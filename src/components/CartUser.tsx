'use client';

import { useCartStore } from '@/store/cart';
import { Avatar, Card, Flex, Text } from '@/once-ui/components';
import { useSession } from 'next-auth/react';

export function CartUser() {
  const { data: session } = useSession();
  const { totalItems, totalPrice } = useCartStore();
  
  if (!session) {
    return null;
  }
  
  return (
    <Card className="p-4 mb-4 shadow-sm">
      <Flex gap="4" align="center">
        <Avatar 
          src={session.user?.image || undefined} 
          fallback={session.user?.name?.[0] || '?'} 
          alt={session.user?.name || 'User'}
          size="m"
        />
        <div>
          <Text as="h3" size="l" className="font-medium">{session.user?.name}</Text>
          <Text color="secondary" size="s">{session.user?.email}</Text>
        </div>
      </Flex>
      
      <div className="mt-4 pt-4 border-t">
        <Flex justify="between" className="mb-2">
          <Text>Items in cart:</Text>
          <Text>{totalItems}</Text>
        </Flex>
        <Flex justify="between" className="mb-2">
          <Text>Total amount:</Text>
          <Text className="font-medium">${totalPrice.toLocaleString()}</Text>
        </Flex>
      </div>
    </Card>
  );
}