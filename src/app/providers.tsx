"use client";

import { ReactNode, useEffect } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    // Add support for View Transitions API
    // Check if the browser supports View Transitions API
    if (!document.startViewTransition) {
      console.log("View Transitions API not supported");
    }

    // Handle navigation events
    const handlePopState = () => {
      // If there's a modal open, ensure proper cleanup
      if (document.documentElement.classList.contains('has-modal-open')) {
        const isModalPath = window.location.pathname.includes('/pedir/');
        if (!isModalPath) {
          document.documentElement.classList.remove('has-modal-open');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return <>{children}</>;
}