import { useState, useEffect, useRef } from 'react';
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useAddProduct, useUpdateProduct, useUploadProductImage, useDeleteProductImage } from '../../hooks/useQueries';
import { useProductImageUpload } from '../../hooks/useProductImageUpload';
import type { Product, ProductCategory, StockStatus } from '../../backend';
import { toast } from 'sonner';

interface ProductEditorDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductEditorDialog({ product, open, onOpenChange }: ProductEditorDialogProps) {
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const uploadProductImage = useUploadProductImage();
  const deleteProductImage = useDeleteProductImage();
  const { uploadImage, uploadState, resetUpload } = useProductImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('mechanicalPackings' as ProductCategory);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [description, setDescription] = useState('');
  const [stockStatus, setStockStatus] = useState<'inStock' | 'outOfStock' | 'limited'>('inStock');
  const [stockQuantity, setStockQuantity] = useState('100');
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setImageUrl(product.image);
      setDescription(product.description);
      
      // Set image preview from existing product
      if (product.imageBlob) {
        setImagePreview(product.imageBlob.getDirectURL());
      } else if (product.image) {
        setImagePreview(product.image);
      } else {
        setImagePreview('');
      }
      
      if ('inStock' in product.stockStatus) {
        setStockStatus('inStock');
        setStockQuantity(product.stockStatus.inStock.toString());
      } else if ('limited' in product.stockStatus) {
        setStockStatus('limited');
        setStockQuantity(product.stockStatus.limited.toString());
      } else {
        setStockStatus('outOfStock');
        setStockQuantity('0');
      }
    } else {
      setName('');
      setCategory('mechanicalPackings' as ProductCategory);
      setImageUrl('');
      setImagePreview('');
      setDescription('');
      setStockStatus('inStock');
      setStockQuantity('100');
    }
    setPendingImageFile(null);
    resetUpload();
  }, [product, open, resetUpload]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPendingImageFile(file);
    
    // Create local preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = async () => {
    if (product && (product.imageBlob || product.image)) {
      if (!confirm('Are you sure you want to remove this image?')) return;
      
      try {
        await deleteProductImage.mutateAsync(product.id);
        setImageUrl('');
        setImagePreview('');
        setPendingImageFile(null);
        toast.success('Image removed successfully');
      } catch (error) {
        console.error('Failed to remove image:', error);
        toast.error('Failed to remove image');
      }
    } else {
      setImageUrl('');
      setImagePreview('');
      setPendingImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadState.isUploading) {
      toast.error('Please wait for the image upload to complete');
      return;
    }

    let stockStatusObj: StockStatus;
    if (stockStatus === 'inStock') {
      stockStatusObj = { __kind__: 'inStock', inStock: BigInt(stockQuantity) };
    } else if (stockStatus === 'limited') {
      stockStatusObj = { __kind__: 'limited', limited: BigInt(stockQuantity) };
    } else {
      stockStatusObj = { __kind__: 'outOfStock', outOfStock: null };
    }

    try {
      let productId: bigint;

      // Create or update product first
      const productData: Product = {
        id: product?.id || BigInt(0),
        name,
        category,
        image: imageUrl,
        imageBlob: product?.imageBlob,
        description,
        specifications: [],
        price: undefined,
        stockStatus: stockStatusObj,
      };

      if (product) {
        await updateProduct.mutateAsync({ id: product.id, product: productData });
        productId = product.id;
      } else {
        productId = await addProduct.mutateAsync(productData);
      }

      // Upload image if a new file was selected
      if (pendingImageFile) {
        const externalBlob = await uploadImage(pendingImageFile);
        
        if (!externalBlob) {
          toast.error(uploadState.error || 'Failed to upload image');
          return;
        }

        await uploadProductImage.mutateAsync({ productId, externalBlob });
      }

      toast.success(product ? 'Product updated successfully' : 'Product added successfully');
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save product:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save product';
      
      if (errorMessage.includes('Unauthorized')) {
        toast.error('You do not have permission to perform this action');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const isSubmitting = addProduct.isPending || updateProduct.isPending || uploadProductImage.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as ProductCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mechanicalPackings">Mechanical Packings</SelectItem>
                <SelectItem value="fluidSealants">Fluid Sealants</SelectItem>
                <SelectItem value="compressedAsbestosJointingSheets">Compressed Asbestos Jointing Sheets</SelectItem>
                <SelectItem value="nonAsbestosJointingSheets">Non-Asbestos Jointing Sheets</SelectItem>
                <SelectItem value="wd40Products">WD-40 Products</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Product Image</Label>
            
            {imagePreview ? (
              <div className="relative">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden border-2 border-border">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadState.isUploading || isSubmitting}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Replace Photo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveImage}
                    disabled={uploadState.isUploading || isSubmitting || deleteProductImage.isPending}
                  >
                    {deleteProductImage.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <X className="mr-2 h-4 w-4" />
                    )}
                    Remove Photo
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="aspect-video bg-muted rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer flex flex-col items-center justify-center gap-2"
              >
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Click to upload product image</p>
                <p className="text-xs text-muted-foreground">JPG, PNG, WebP or GIF (max 10MB)</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleFileSelect}
              className="hidden"
            />

            {uploadState.isUploading && (
              <div className="space-y-2">
                <Progress value={uploadState.progress} />
                <p className="text-xs text-muted-foreground text-center">
                  Uploading... {uploadState.progress}%
                </p>
              </div>
            )}

            {uploadState.error && (
              <p className="text-xs text-destructive">{uploadState.error}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stockStatus">Stock Status *</Label>
              <Select value={stockStatus} onValueChange={(value: any) => setStockStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inStock">In Stock</SelectItem>
                  <SelectItem value="limited">Limited Stock</SelectItem>
                  <SelectItem value="outOfStock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {stockStatus !== 'outOfStock' && (
              <div className="space-y-2">
                <Label htmlFor="stockQuantity">Quantity</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  min="0"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || uploadState.isUploading}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {product ? 'Update' : 'Add'} Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
