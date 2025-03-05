"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { Button, Card, Flex, Heading, Text, Badge } from '@/once-ui/components';
import Image from 'next/image';

export function ProductModal() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { addItem } = useCartStore();

  useEffect(() => {
    // Check if URL contains '/pedir/' and get the product ID
    const path = pathname || '';
    const isProductPath = path.includes('/pedir/');
    
    if (isProductPath) {
      const productId = path.split('/pedir/')[1];
      if (productId) {
        setLoading(true);
        setIsOpen(true);
        
        // Fetch product data
        fetch(`/api/products?id=${productId}`)
          .then(res => {
            if (!res.ok) throw new Error('Product not found');
            return res.json();
          })
          .then(data => {
            setProduct(data);
            setLoading(false);
            // Add modal open class to body
            document.documentElement.classList.add('has-modal-open');
          })
          .catch(error => {
            console.error('Error fetching product:', error);
            setLoading(false);
          });
      }
    } else {
      // Reset state when not on a product path
      setIsOpen(false);
      setProduct(null);
      document.documentElement.classList.remove('has-modal-open');
    }

    // Cleanup when component unmounts
    return () => {
      document.documentElement.classList.remove('has-modal-open');
    };
  }, [pathname]);

  // Event handlers
  const handleClose = () => {
    // Save current scroll position
    const scrollPosition = window.scrollY;
    
    // Use View Transitions API if available
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        router.back();
        setIsOpen(false);
        
        // Restore scroll position after a short delay
        setTimeout(() => {
          window.scrollTo(0, scrollPosition);
        }, 0);
      });
    } else {
      router.back();
      setIsOpen(false);
      
      // Restore scroll position after a short delay
      setTimeout(() => {
        window.scrollTo(0, scrollPosition);
      }, 0);
    }
  };

  const handleAddToCart = () => {
    // Save current scroll position
    const scrollPosition = window.scrollY;
    
    if (product) {
      const discountedPrice = product.discount > 0 
        ? product.price * (1 - product.discount / 100) 
        : product.price;
      
      addItem({
        id: product.id,
        name: product.title,
        price: discountedPrice,
        quantity: 1,
        description: product.description,
        image: product.image
      });
    }
    
    // Close modal but preserve scroll
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        router.back();
        setIsOpen(false);
        
        // Restore scroll position after a short delay
        setTimeout(() => {
          window.scrollTo(0, scrollPosition);
        }, 0);
      });
    } else {
      router.back();
      setIsOpen(false);
      
      // Restore scroll position after a short delay
      setTimeout(() => {
        window.scrollTo(0, scrollPosition);
      }, 0);
    }
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        // Save current scroll position
        const scrollPosition = window.scrollY;
        
        // Close but preserve scroll
        if (document.startViewTransition) {
          document.startViewTransition(() => {
            router.back();
            setIsOpen(false);
            
            // Restore scroll position after a short delay
            setTimeout(() => {
              window.scrollTo(0, scrollPosition);
            }, 0);
          });
        } else {
          router.back();
          setIsOpen(false);
          
          // Restore scroll position after a short delay
          setTimeout(() => {
            window.scrollTo(0, scrollPosition);
          }, 0);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, router]);

  // If modal is not open, don't render anything
  if (!isOpen) {
    return null;
  }

  // Loading state
  if (loading) {
    return (
      <div className="product-modal-backdrop">
        <Flex 
          className="product-modal loading" 
          direction="column" 
          align="center" 
          justify="center"
          padding="8"
        >
          <Heading>Loading...</Heading>
        </Flex>
      </div>
    );
  }

  // Error state
  if (!product) {
    return (
      <div className="product-modal-backdrop">
        <Flex 
          className="product-modal error" 
          direction="column" 
          align="center" 
          justify="center"
          padding="8"
        >
          <Heading color="error">Product not found</Heading>
          <Button onClick={handleClose} variant="secondary" className="mt-4">Close</Button>
        </Flex>
      </div>
    );
  }

  // Calculate final price
  const finalPrice = product.discount > 0 
    ? product.price * (1 - product.discount / 100) 
    : product.price;

  // Product modal UI
  return (
    <div className="product-modal-backdrop" onClick={handleClose}>
      <div 
        className="product-modal" 
        onClick={(e) => e.stopPropagation()}
      >
        <Card fillWidth radius="l" shadow="xl" overflow="hidden">
          <Button 
            variant="tertiary" 
            size="icon-s" 
            onClick={handleClose}
            className="modal-close-button"
            prefixIcon="close"
          />
          
          <Flex direction="column" className="product-modal-content">
            <Flex width="100%" height="200px" position="relative">
              {product.image && (
                <Image 
                  src={product.image} 
                  alt={product.title} 
                  fill
                  objectFit="cover"
                />
              )}
              
              {product.discount > 0 && (
                <Flex 
                  position="absolute" 
                  top="0" 
                  right="0" 
                  background="danger-strong" 
                  color="white" 
                  paddingX="2" 
                  paddingY="1"  
                  textWeight="strong"
                >
                  {product.discount}% OFF
                </Flex>
              )}
            </Flex>
            
            <Flex direction="column" padding="6" gap="4">
              <Heading variant="heading-strong-xl">{product.title}</Heading>
              
              <Text variant="body-default-m" color="secondary">
                {product.description}
              </Text>
              
              <Flex className="mb-3" wrap gap="2">
                {product.examsIncluded?.map((exam: string, index: number) => (
                  <Badge key={index} variant="info">{exam}</Badge>
                ))}
              </Flex>
              
              <Flex align="center" gap="3" className="mt-auto">
                {product.discount > 0 && (
                  <Text 
                    variant="body-default-l" 
                    color="error" 
                    className="price-discount"
                    style={{ 
                      opacity: 0.7,
                      marginRight: '12px',
                      fontSize: '1.2rem'
                    }}
                  >
                    ${product.price.toLocaleString()}
                  </Text>
                )}
                <Heading variant="heading-strong-xl" color="success">
                  ${finalPrice.toLocaleString()}
                </Heading>
              </Flex>
              
              <Button 
                variant="primary" 
                size="l" 
                onClick={handleAddToCart}
                suffixIcon="order"
                className="mt-3"
              >
                Add to Cart
              </Button>
            </Flex>
          </Flex>
        </Card>
      </div>
    </div>
  );
}