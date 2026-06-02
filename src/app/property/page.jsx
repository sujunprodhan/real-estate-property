import React from 'react';
import Property from '../../componets/Property';


const ProductPage = async ({ searchParams }) => {
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams?.category || '';
  const page = parseInt(resolvedSearchParams?.page || '1', 10);
  const search = resolvedSearchParams?.search || '';
  const sort = resolvedSearchParams?.sort || '';

  return (
    <div>
      <Property category={category} page={page} search={search} sort={sort}></Property>
    </div>
  );
};

export default ProductPage;
