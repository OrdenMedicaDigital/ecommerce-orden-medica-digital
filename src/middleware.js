import { NextResponse } from 'next/server';
import { withAuth } from "next-auth/middleware";

function middleware(request) {
  // Handle pseudo-routes like '/pedir/product-1'
  // Just pass through to the main app and let client-side handle it
  const url = request.nextUrl.clone();
  if (url.pathname.startsWith('/pedir/')) {
    url.pathname = '/';
    return NextResponse.rewrite(url);
  }
  
  return NextResponse.next();
}

// Apply authorization to protected routes and pedir rewrite to all routes
export default withAuth(middleware, {
  callbacks: {
    authorized: ({ token, req }) => {
      const path = req.nextUrl.pathname;
      
      // For protected routes, check authentication
      if (path.startsWith('/dashboard') || path.startsWith('/admin/dashboard')) {
        return !!token;
      }
      
      // For other routes (including /pedir/*), always allow
      return true;
    },
  },
  pages: {
    signIn: "/",
  }
});

export const config = { 
  matcher: ["/dashboard/:path*", "/admin/dashboard/:path*", "/pedir/:path*"]
};