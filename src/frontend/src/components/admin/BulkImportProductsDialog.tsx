import { useState, useRef } from 'react';
import { Upload, FileJson, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAddProducts } from '../../hooks/useQueries';
import { parseProductsImportJson } from '../../utils/parseProductsImportJson';
import type { Product } from '../../backend';

interface BulkImportProductsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BulkImportProductsDialog({ open, onOpenChange }: BulkImportProductsDialogProps) {
  const addProducts = useAddProducts();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [jsonText, setJsonText] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [parsedProducts, setParsedProducts] = useState<Product[] | null>(null);
  const [importSuccess, setImportSuccess] = useState<{ count: number; ids: bigint[] } | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setValidationError('Please select a valid JSON file.');
      return;
    }

    try {
      const text = await file.text();
      setJsonText(text);
      validateJson(text);
    } catch (error) {
      setValidationError('Failed to read file. Please try again.');
    }
  };

  const validateJson = (text: string) => {
    setValidationError(null);
    setParsedProducts(null);
    setImportSuccess(null);

    if (!text.trim()) {
      return;
    }

    try {
      const products = parseProductsImportJson(text);
      setParsedProducts(products);
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Invalid JSON format');
    }
  };

  const handleJsonChange = (text: string) => {
    setJsonText(text);
    validateJson(text);
  };

  const handleSubmit = async () => {
    if (!parsedProducts || parsedProducts.length === 0) {
      setValidationError('No valid products to import.');
      return;
    }

    try {
      const createdIds = await addProducts.mutateAsync(parsedProducts);
      setImportSuccess({ count: createdIds.length, ids: createdIds });
      setJsonText('');
      setParsedProducts(null);
      
      // Close dialog after a short delay to show success message
      setTimeout(() => {
        onOpenChange(false);
        setImportSuccess(null);
      }, 2000);
    } catch (error) {
      console.error('Failed to import products:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to import products';
      
      if (errorMessage.includes('Unauthorized')) {
        setValidationError('You do not have permission to import products.');
      } else {
        setValidationError(errorMessage);
      }
    }
  };

  const handleClose = () => {
    setJsonText('');
    setValidationError(null);
    setParsedProducts(null);
    setImportSuccess(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Import Products</DialogTitle>
          <DialogDescription>
            Upload a JSON file or paste JSON text to import multiple products at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label>Upload JSON File</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={addProducts.isPending}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                Select JSON File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or paste JSON</span>
            </div>
          </div>

          {/* JSON Text Area */}
          <div className="space-y-2">
            <Label htmlFor="jsonText">JSON Text</Label>
            <Textarea
              id="jsonText"
              value={jsonText}
              onChange={(e) => handleJsonChange(e.target.value)}
              placeholder='[{"name": "Product Name", "category": "mechanicalPackings", "description": "Product description", "stockStatus": "inStock", "stockQuantity": 100}]'
              rows={12}
              className="font-mono text-sm"
              disabled={addProducts.isPending}
            />
          </div>

          {/* Validation Preview */}
          {parsedProducts && parsedProducts.length > 0 && !validationError && (
            <Alert>
              <FileJson className="h-4 w-4" />
              <AlertDescription>
                <strong>Ready to import:</strong> {parsedProducts.length} product{parsedProducts.length !== 1 ? 's' : ''} validated successfully.
              </AlertDescription>
            </Alert>
          )}

          {/* Validation Error */}
          {validationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Error:</strong> {validationError}
              </AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {importSuccess && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                <strong>Success!</strong> Imported {importSuccess.count} product{importSuccess.count !== 1 ? 's' : ''} successfully.
              </AlertDescription>
            </Alert>
          )}

          {/* Format Help */}
          <div className="rounded-lg bg-muted p-4 text-sm space-y-2">
            <p className="font-medium">JSON Format Requirements:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong>name</strong> (required): Product name</li>
              <li><strong>category</strong> (required): mechanicalPackings, fluidSealants, compressedAsbestosJointingSheets, nonAsbestosJointingSheets, or wd40Products</li>
              <li><strong>description</strong> (required): Product description</li>
              <li><strong>stockStatus</strong> (optional): inStock, limited, or outOfStock (default: inStock)</li>
              <li><strong>stockQuantity</strong> (optional): Number of items in stock</li>
              <li><strong>image</strong> (optional): Image URL</li>
              <li><strong>specifications</strong> (optional): Array of [key, value] pairs</li>
              <li><strong>price</strong> (optional): Price in cents</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={addProducts.isPending}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!parsedProducts || parsedProducts.length === 0 || addProducts.isPending || !!importSuccess}
          >
            {addProducts.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Import {parsedProducts ? parsedProducts.length : 0} Product{parsedProducts && parsedProducts.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
