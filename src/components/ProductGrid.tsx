import React, { useEffect, useState } from 'react';
import { Heading, Text, Spinner, Flex, Grid } from '@/once-ui/components';
import { ProductCard } from './ProductCard';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  examsIncluded: string[];
  image?: string;
}

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load medical examination products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Flex horizontal="center" vertical="center" paddingY="16">
        <Spinner size="l" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex horizontal="center" vertical="center" paddingY="16">
        <Text color="error">{error}</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" padding="8" fillWidth>
      <Heading variant="heading-strong-xl" className="mb-6">Medical Examination Products</Heading>
      
    <Grid columns={2} tabletColumns={1} mobileColumns={1} gap="8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            description={product.description}
            price={product.price}
            discount={product.discount}
            examsIncluded={product.examsIncluded}
            image={product.image}
          />
        ))}
      </Grid>
    </Flex>
  );
}