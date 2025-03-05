"use client";
import { CartBadge } from "@/components/CartBadge";
import Main from "@/components/Main";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductModal } from "@/components/ProductModal";
import {
  Flex,
  Heading,
} from "@/once-ui/components";
import { Sidebar } from "@/once-ui/modules";
import { useEffect } from "react";

export default function RootPage() {
  // Ensure proper cleanup when navigating away
  useEffect(() => {
    return () => {
      // Remove modal-related classes when navigating away from the page
      document.documentElement.classList.remove('has-modal-open');
    };
  }, []);
  
  return (
    <>
      <Flex fillWidth flex={1}>
        <Sidebar />
        <Main>
          <ProductGrid />
        </Main>
      </Flex>
      
      {/* Product Modal - will automatically show based on URL */}
      <ProductModal />
      
      {/* Cart Badge - fixed at bottom of the screen */}
      <CartBadge />
    </>
  );
}