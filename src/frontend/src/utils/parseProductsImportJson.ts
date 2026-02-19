import type { Product, StockStatus } from '../backend';
import { ProductCategory } from '../backend';

interface RawProduct {
  name?: string;
  category?: string;
  description?: string;
  image?: string;
  stockStatus?: string | { __kind__: string; [key: string]: any };
  stockQuantity?: number | string;
  specifications?: Array<[string, string]>;
  price?: number | string;
}

const validCategories: ProductCategory[] = [
  ProductCategory.mechanicalPackings,
  ProductCategory.fluidSealants,
  ProductCategory.compressedAsbestosJointingSheets,
  ProductCategory.nonAsbestosJointingSheets,
  ProductCategory.wd40Products,
];

const categoryStringMap: Record<string, ProductCategory> = {
  'mechanicalPackings': ProductCategory.mechanicalPackings,
  'fluidSealants': ProductCategory.fluidSealants,
  'compressedAsbestosJointingSheets': ProductCategory.compressedAsbestosJointingSheets,
  'nonAsbestosJointingSheets': ProductCategory.nonAsbestosJointingSheets,
  'wd40Products': ProductCategory.wd40Products,
};

export function parseProductsImportJson(jsonText: string): Product[] {
  let parsed: any;
  
  try {
    parsed = JSON.parse(jsonText);
  } catch (error) {
    throw new Error('Invalid JSON format. Please check your JSON syntax.');
  }

  if (!Array.isArray(parsed)) {
    throw new Error('JSON must be an array of products.');
  }

  if (parsed.length === 0) {
    throw new Error('JSON array is empty. Please provide at least one product.');
  }

  const products: Product[] = [];

  for (let i = 0; i < parsed.length; i++) {
    const raw = parsed[i] as RawProduct;
    
    if (!raw || typeof raw !== 'object') {
      throw new Error(`Item at index ${i} is not a valid object.`);
    }

    // Validate required fields
    if (!raw.name || typeof raw.name !== 'string' || raw.name.trim() === '') {
      throw new Error(`Item at index ${i}: "name" is required and must be a non-empty string.`);
    }

    if (!raw.category || typeof raw.category !== 'string') {
      throw new Error(`Item at index ${i}: "category" is required and must be a string.`);
    }

    const category = categoryStringMap[raw.category];
    if (!category) {
      throw new Error(
        `Item at index ${i}: "category" must be one of: mechanicalPackings, fluidSealants, compressedAsbestosJointingSheets, nonAsbestosJointingSheets, wd40Products.`
      );
    }

    if (!raw.description || typeof raw.description !== 'string' || raw.description.trim() === '') {
      throw new Error(`Item at index ${i}: "description" is required and must be a non-empty string.`);
    }

    // Parse stock status
    let stockStatus: StockStatus;
    if (typeof raw.stockStatus === 'string') {
      const status = raw.stockStatus.toLowerCase();
      if (status === 'instock' || status === 'in_stock' || status === 'in stock') {
        const quantity = raw.stockQuantity ? BigInt(raw.stockQuantity) : BigInt(100);
        stockStatus = { __kind__: 'inStock', inStock: quantity };
      } else if (status === 'limited' || status === 'limited_stock' || status === 'limited stock') {
        const quantity = raw.stockQuantity ? BigInt(raw.stockQuantity) : BigInt(10);
        stockStatus = { __kind__: 'limited', limited: quantity };
      } else if (status === 'outofstock' || status === 'out_of_stock' || status === 'out of stock') {
        stockStatus = { __kind__: 'outOfStock', outOfStock: null };
      } else {
        throw new Error(
          `Item at index ${i}: "stockStatus" must be one of: inStock, limited, outOfStock.`
        );
      }
    } else if (raw.stockStatus && typeof raw.stockStatus === 'object' && '__kind__' in raw.stockStatus) {
      // Already in correct format
      stockStatus = raw.stockStatus as StockStatus;
    } else {
      // Default to in stock
      stockStatus = { __kind__: 'inStock', inStock: BigInt(100) };
    }

    // Build product object
    const product: Product = {
      id: BigInt(0), // Will be assigned by backend
      name: raw.name.trim(),
      category,
      description: raw.description.trim(),
      image: raw.image || '',
      imageBlob: undefined,
      stockStatus,
      specifications: raw.specifications || [],
      price: raw.price ? BigInt(raw.price) : undefined,
    };

    products.push(product);
  }

  return products;
}
