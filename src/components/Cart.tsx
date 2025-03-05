'use client';

import { Button, IconButton, RevealFx, Text, Card, Flex } from '@/once-ui/components';
import { Icon } from '@/once-ui/components';
import { useCartStore } from '@/store/cart';
import { useEffect, useState } from 'react';

// Cart Button Component
export function CartButton() {
  const { totalItems, openCart } = useCartStore();
  
  return (
    <Flex>
      <IconButton
        onClick={openCart}
        variant="ghost"
        size="s"
        aria-label="Cart"
      >
        <Icon name="cart" />
        {totalItems > 0 && (
          <Flex 
            position="absolute" 
            style={{ top: '-0.25rem', right: '-0.25rem' }}
            background="danger-strong" 
            color="white"
            horizontal='center'
            vertical="center"
            className="text-xs rounded-full h-4 w-4"
          >
            {totalItems}
          </Flex>
        )}
      </IconButton>
    </Flex>
  );
}

// Cart Modal Component
export function CartModal() {
  const { isCartOpen, closeCart, items, removeItem, updateQuantity, totalItems, totalPrice } = useCartStore();
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Close cart when clicking escape key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [closeCart]);

  if (!isCartOpen) return null;

  return (
    <>
      <Flex 
        position="fixed" 
        top='0'
        left='0'
        fillHeight
        fillWidth
        style={{ opacity: 0.7, backgroundColor: 'black' }} 
        zIndex={9} 
        onClick={closeCart} 
      />

      <RevealFx
        hidden={false}
        speed="fast"
        position="fixed"
        style={{ 
          top: 0, 
          right: 0,
          width: isMobile ? '100%' : '20rem',
          backgroundColor: 'white',
          boxShadow: 'var(--shadow-lg)',
          overflowY: 'auto'
        }}
        fillHeight
        zIndex={10}
      >
        <Flex direction="column" fillHeight padding="4">
          <Flex marginBottom="4" horizontal="space-between" vertical="center">
            <Text as="h2" size="xl">Your Cart</Text>
            <IconButton
              onClick={closeCart}
              variant="ghost"
              size="s"
              aria-label="Close cart"
            >
              <Icon name="close" />
            </IconButton>
          </Flex>

          {items.length === 0 ? (
            <Flex flex="1" horizontal="center" vertical="center">
              <Text color="secondary">Your cart is empty</Text>
            </Flex>
          ) : (
            <>
              <Flex direction="column" flex="1">
                {items.map(item => (
                  <Card key={item.id} marginBottom="4" padding="4">
                    <Flex horizontal="space-between">
                      <Flex direction="column">
                        <Text>{item.name}</Text>
                        <Text size="m" color="secondary">
                          ${item.price ? item.price.toLocaleString() : '0'}
                        </Text>
                      </Flex>
                      <IconButton
                        onClick={() => removeItem(item.id)}
                        variant="ghost"
                        size="s"
                        aria-label="Remove item"
                      >
                        <Icon name="trash" />
                      </IconButton>
                    </Flex>
                    <Flex marginTop="2" horizontal="space-between" align="center">
                      <Flex align="center" gap="2">
                        <IconButton
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          variant="ghost"
                          size="s"
                          aria-label="Decrease quantity"
                        >
                          <Icon name="minus" />
                        </IconButton>
                        <Text size="m">{item.quantity}</Text>
                        <IconButton
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          variant="ghost"
                          size="s"
                          aria-label="Increase quantity"
                        >
                          <Icon name="plus" />
                        </IconButton>
                      </Flex>
                      <Text>
                        ${item.price ? (item.price * item.quantity).toLocaleString() : '0'}
                      </Text>
                    </Flex>
                  </Card>
                ))}
              </Flex>

              <Flex 
                direction="column" 
                className="border-t" 
                paddingTop="4" 
                marginTop="4"
              >
                <Flex horizontal="space-between" marginBottom="2">
                  <Text>Total:</Text>
                  <Text>${totalPrice ? totalPrice.toLocaleString() : '0'}</Text>
                </Flex>
                <Button variant="primary" fillWidth>
                  Checkout
                </Button>
              </Flex>
            </>
          )}
        </Flex>
      </RevealFx>
    </>
  );
}
