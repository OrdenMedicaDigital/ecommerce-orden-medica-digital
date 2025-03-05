import React from 'react';
import { Card, Button, Text, Flex, Icon, Badge, Heading } from '@/once-ui/components';
import { useCartStore } from '@/store/cart';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  discount?: number;
  examsIncluded: string[];
  image?: string;
}

export function ProductCard({ id, title, description, price, discount = 0, examsIncluded, image }: ProductCardProps) {
  const { addItem } = useCartStore();
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Calculate discounted price
    const discountedPrice = discount > 0 ? price * (1 - discount / 100) : price;
    
    addItem({
      id,
      name: title,
      price: discountedPrice,
      quantity: 1,
      description,
      image
    });
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Save current scroll position
    const scrollPosition = window.scrollY;
    
    // Check if View Transitions API is supported
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        // Use router.push with shallow routing to prevent scroll reset
        router.push(`/pedir/${id}`, { scroll: false });
        
        // Restore scroll position after a short delay
        setTimeout(() => {
          window.scrollTo(0, scrollPosition);
        }, 0);
      });
    } else {
      // Use router.push with shallow routing to prevent scroll reset
      router.push(`/pedir/${id}`, { scroll: false });
      
      // Restore scroll position after a short delay
      setTimeout(() => {
        window.scrollTo(0, scrollPosition);
      }, 0);
    }
  };

  // Calculate final price after discount
  const finalPrice = discount > 0 ? price * (1 - discount / 100) : price;

  return (
    <Card 
      fillWidth 
      overflow='hidden' 
      radius='l' 
      shadow='l'
      className="cursor-pointer"
      onClick={handleViewDetails}
      direction='row-reverse'
    >
      {/* Image with discount badge */}
      <Flex minWidth={"160"} aspectRatio={"3/4"} fitHeight position='relative'>
        {image && (
          <Image 
            src={image} 
            alt={title} 
            fill
            objectFit='cover'
          />
        )}
        
        {/* Discount badge - using Tailwind 4 for absolute positioning */}
        {discount > 0 && (
          <Flex position='absolute' top='12' right='12' radius='full' background='danger-strong' color='white' paddingX='8' paddingY='4'  textWeight='strong'>
            {discount}% OFF
          </Flex>
        )}

        <Flex position='absolute' bottom='12' right='12' gap='4'>
          <Button 
            variant="secondary" 
            size="s" 
            onClick={handleAddToCart}
            suffixIcon="plus"
          >
          </Button>
        </Flex>
      </Flex>
      
      {/* Content */}
      <Flex direction="column" padding='16'>
        <Heading variant="heading-strong-m" className="mb-2">{title}</Heading>
        
        <Text variant="body-default-s" color="secondary" className="mb-3 flex-grow">
          {description}
        </Text>
        
        <Flex align="center" gap="4" className="mt-auto">
          {discount > 0 && (
            <Text 
              variant="body-default-s" 
              color="error" 
              className="price-discount"
              style={{ 
                opacity: 0.7,
                marginRight: '8px'
              }}
            >
              ${price.toLocaleString()}
            </Text>
          )}
          <Heading variant="heading-strong-l" color="success">
            ${finalPrice.toLocaleString()}
          </Heading>
        </Flex>
      </Flex>
    </Card>
  );
}