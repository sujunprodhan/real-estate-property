import React from 'react';
import Property from '../../componets/Property';


const ProductPage = async ({ searchParams }) => {
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams?.category || '';
  const page = parseInt(resolvedSearchParams?.page || '1', 10);

  return (
    <div>
      <Property category={category} page={page}></Property>
    </div>
  );
};

export default ProductPage;
