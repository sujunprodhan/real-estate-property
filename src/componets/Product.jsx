
import { Key } from 'lucide-react';
import { getProduct } from '../actions/server/product';
import ProductListClient from './ProductListClient';

const Product = async () => {
  const products = await getProduct();
  return (
    <section className="py-24 bg-base-100 relative z-10 w-full">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header Section */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <span className="text-primary font-bold tracking-wider uppercase text-sm mb-3 block">Exclusive Selection</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-base-content mb-4">Featured Properties</h2>
          <p className="text-base-content/70 text-lg">
            Explore our handpicked collection of premium real estate properties available for sale and rent.
          </p>
        </div>

        {/* Pagination */}
        <ProductListClient initialProducts={products} />
      </div>
    </section>
  );
};

export default Product;