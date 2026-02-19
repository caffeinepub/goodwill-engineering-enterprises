import { useState, useEffect } from 'react';
import { Mail, Save, Globe, Copy, CheckCircle2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useGetCompanyContactGmail, useUpdateCompanyContactGmail, useGetCustomDomainRequest, useSetCustomDomainRequest } from '../../hooks/useQueries';
import { normalizeDomain } from '../../utils/normalizeDomain';

const SUGGESTED_DOMAIN = 'goodwillengineeringenterprises.com';

export function AdminSettingsTab() {
  const { data: gmailAddress, isLoading: gmailLoading } = useGetCompanyContactGmail();
  const updateGmailMutation = useUpdateCompanyContactGmail();
  const [localGmail, setLocalGmail] = useState('');

  const { data: customDomain, isLoading: domainLoading } = useGetCustomDomainRequest();
  const updateDomainMutation = useSetCustomDomainRequest();
  const [localDomain, setLocalDomain] = useState('');
  const [userHasEditedDomain, setUserHasEditedDomain] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (gmailAddress) {
      setLocalGmail(gmailAddress);
    }
  }, [gmailAddress]);

  useEffect(() => {
    if (customDomain) {
      setLocalDomain(customDomain);
      setUserHasEditedDomain(true);
    } else if (!userHasEditedDomain) {
      // Pre-populate with suggested domain only if user hasn't edited yet
      setLocalDomain(SUGGESTED_DOMAIN);
    }
  }, [customDomain, userHasEditedDomain]);

  const handleSaveGmail = async () => {
    try {
      await updateGmailMutation.mutateAsync(localGmail);
      toast.success('Gmail address updated successfully');
    } catch (error) {
      console.error('Failed to update Gmail:', error);
      toast.error('Failed to update Gmail address');
    }
  };

  const handleDomainChange = (value: string) => {
    setUserHasEditedDomain(true);
    setLocalDomain(value);
  };

  const handleDomainBlur = () => {
    // Normalize on blur to show user the canonical form
    const normalized = normalizeDomain(localDomain);
    if (normalized !== localDomain) {
      setLocalDomain(normalized);
    }
  };

  const handleSaveDomain = async () => {
    try {
      // Normalize before saving
      const normalized = normalizeDomain(localDomain);
      if (!normalized) {
        toast.error('Please enter a valid domain');
        return;
      }
      await updateDomainMutation.mutateAsync(normalized);
      toast.success('Custom domain saved successfully');
    } catch (error) {
      console.error('Failed to save domain:', error);
      toast.error('Failed to save custom domain');
    }
  };

  const handleUseSuggestedDomain = () => {
    setLocalDomain(SUGGESTED_DOMAIN);
    setUserHasEditedDomain(true);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : '';

  // Check if the current domain value matches the saved domain (after normalization)
  const normalizedLocalDomain = normalizeDomain(localDomain);
  const isDomainUnchanged = normalizedLocalDomain === customDomain;

  if (gmailLoading || domainLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const showSuggestedDomainButton = !customDomain && localDomain !== SUGGESTED_DOMAIN;

  return (
    <div className="space-y-6">
      {/* Contact Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Settings</CardTitle>
          <CardDescription>
            Manage your company contact information. This is stored for reference only. The app does not send emails.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="gmail">Company Gmail Address</Label>
            <Input
              id="gmail"
              type="email"
              value={localGmail}
              onChange={(e) => setLocalGmail(e.target.value)}
              placeholder="your-email@gmail.com"
            />
            <p className="text-sm text-muted-foreground">
              This email address is displayed for reference. No automated emails are sent from this app.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={handleSaveGmail}
              disabled={updateGmailMutation.isPending || localGmail === gmailAddress}
            >
              {updateGmailMutation.isPending ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>

            {gmailAddress && (
              <Button
                variant="outline"
                asChild
              >
                <a href={`mailto:${gmailAddress}`} target="_blank" rel="noopener noreferrer">
                  <Mail className="mr-2 h-4 w-4" />
                  Open in Email Client
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Custom Domain Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Custom Domain
          </CardTitle>
          <CardDescription>
            Set up your custom .com domain to use with this site. You'll need to configure DNS settings with your domain registrar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="domain">Your Custom Domain</Label>
            <Input
              id="domain"
              type="text"
              value={localDomain}
              onChange={(e) => handleDomainChange(e.target.value)}
              onBlur={handleDomainBlur}
              placeholder="yourbrand.com"
            />
            {customDomain && (
              <p className="text-sm text-muted-foreground">
                Current domain: <span className="font-medium text-foreground">{customDomain}</span>
              </p>
            )}
            {!customDomain && (
              <p className="text-sm text-muted-foreground">
                No custom domain saved yet. Enter your domain above and click Save.
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleSaveDomain}
              disabled={updateDomainMutation.isPending || isDomainUnchanged || !normalizedLocalDomain}
            >
              {updateDomainMutation.isPending ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Domain
                </>
              )}
            </Button>

            {showSuggestedDomainButton && (
              <Button
                variant="outline"
                onClick={handleUseSuggestedDomain}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Use Suggested Domain
              </Button>
            )}
          </div>

          <Separator />

          {/* DNS Setup Instructions */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">How to link your domain</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Follow these steps to point your custom domain to this site. You'll need to log in to your domain registrar (e.g., GoDaddy, Namecheap, Google Domains).
              </p>
            </div>

            <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    1
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium">Log in to your domain registrar</p>
                    <p className="text-sm text-muted-foreground">
                      Access the DNS management section for your domain (e.g., yourbrand.com).
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    2
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium">Add a CNAME record</p>
                    <p className="text-sm text-muted-foreground">
                      Create a new CNAME record with these values:
                    </p>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center gap-2 bg-background p-2 rounded border">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">Name/Host:</p>
                          <code className="text-sm font-mono">www</code>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard('www', 'cname-name')}
                        >
                          {copiedField === 'cname-name' ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 bg-background p-2 rounded border">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">Value/Points to:</p>
                          <code className="text-sm font-mono break-all">{currentUrl.replace(/^https?:\/\//, '')}</code>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(currentUrl.replace(/^https?:\/\//, ''), 'cname-value')}
                        >
                          {copiedField === 'cname-value' ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    3
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium">Optional: Add an A record for root domain</p>
                    <p className="text-sm text-muted-foreground">
                      If you want yourbrand.com (without www) to work, add an A record or use domain forwarding to redirect to www.yourbrand.com.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    4
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium">Wait for DNS propagation</p>
                    <p className="text-sm text-muted-foreground">
                      DNS changes can take anywhere from a few minutes to 48 hours to propagate worldwide. Be patient!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 p-4 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Note:</strong> This app does not automatically purchase or configure domains. You must buy your domain from a registrar and manually configure the DNS settings as described above.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
