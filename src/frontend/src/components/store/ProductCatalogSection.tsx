import { ProductCard } from './ProductCard';
import { useGetAllProducts } from '../../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';

export function ProductCatalogSection() {
  const { data: products = [], isLoading } = useGetAllProducts();

  return (
    <section id="product-catalog" className="py-20 md:py-32 bg-background">
      <div className="container">
        <div className="mb-12">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-center">
            Browse Our <span className="text-primary">Complete</span> Catalog
          </h2>
          <p className="text-muted-foreground text-center text-lg max-w-2xl mx-auto">
            Explore our full range of industrial sealing solutions and WD-40 products
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No products available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id.toString()} product={product} />
              ))}
            </div>

            <div className="mt-12">
              <a
                href="#product-catalog"
                className="flex items-center justify-center gap-2 py-4 px-6 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg transition-colors group"
              >
                <span className="text-lg font-semibold text-primary">Browse All Products</span>
                <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
