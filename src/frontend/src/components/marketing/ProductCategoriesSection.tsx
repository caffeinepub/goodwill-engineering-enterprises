import { ProductCategoriesGrid } from './ProductCategoriesGrid';

export function ProductCategoriesSection() {
  const scrollToProducts = () => {
    const element = document.getElementById('product-catalog');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="products" className="py-20 md:py-32 bg-muted/30">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Our <span className="text-primary">Product</span> Range
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            From WD-40 <span className="text-accent">lubricants</span> to advanced <span className="text-accent">fluid sealing solutions</span>, 
            we supply the products that keep your operations running smoothly.
          </p>
        </div>
        
        <ProductCategoriesGrid />
        
        <div className="text-center mt-12">
          <button
            onClick={scrollToProducts}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold shadow-industrial-lg rounded-md transition-colors"
          >
            Browse All Products
          </button>
        </div>
      </div>
    </section>
  );
}
