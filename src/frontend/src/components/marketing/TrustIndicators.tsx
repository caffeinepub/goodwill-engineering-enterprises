import { CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function TrustIndicators() {
  const indicators = [
    'Trusted by Professionals',
    'Verified Business',
    'Highly Rated by Customers',
    'Serving Since 1986'
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 pt-6">
      {indicators.map((indicator) => (
        <Badge 
          key={indicator} 
          variant="secondary" 
          className="px-4 py-2 text-sm font-medium bg-white/20 backdrop-blur-sm border border-white/30 text-white"
        >
          <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
          {indicator}
        </Badge>
      ))}
    </div>
  );
}
