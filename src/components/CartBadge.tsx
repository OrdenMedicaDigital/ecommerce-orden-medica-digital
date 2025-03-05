"use client";
import { useState, useEffect } from "react";
import { Button, Badge, Flex } from "@/once-ui/components";
import { useCartStore } from "@/store/cart";
import { motion, AnimatePresence } from "framer-motion";

export function CartBadge() {
  const { items, openCart } = useCartStore();
  const [isVisible, setIsVisible] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [hasAnimation, setHasAnimation] = useState(false);

  // Calculate total items in cart
  useEffect(() => {
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    setItemCount(totalItems);

    // Check if should be visible
    setIsVisible(totalItems > 0);

    // Add animation when items are added
    if (totalItems > 0) {
      setHasAnimation(true);
      const timer = setTimeout(() => setHasAnimation(false), 500);
      return () => clearTimeout(timer);
    }
  }, [items]);

  const handleClick = () => {
    openCart();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="cart-badge-container"
        initial={{ y: 100, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          scale: hasAnimation ? 1.1 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
          scale: { duration: 0.2 },
        }}
      >
        <Button
          variant="primary"
          size="l"
          onClick={handleClick}
          className="cart-badge-button"
          prefixIcon="cart"
        >
          <Flex fillWidth horizontal="center" vertical="center">
            Ver carrito
            <Badge className="cart-badge-count">{itemCount}</Badge>
          </Flex>
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}
