import React from 'react';
import Property from '../../componets/Property';


const ProductPage = async ({ searchParams }) => {
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams?.category || '';

  return (
    <div>
      <Property category={category}></Property>
    </div>
  );
};

export default ProductPage;
