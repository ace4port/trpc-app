import withAuth from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      if (token) return true; // maybe check for admin role ?
      return false;
    },
  },
});

export const config = {
  matcher: [
    // match all starting with /dashboard or /api
    "/dashboard(.*)",
    "/api(.*)",
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    // '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
};
