import { proxy } from "next/server";

export const config = {
  matcher: [
    "/admin/:path*",
    "/seller/:path*",
  ],
};

export default proxy((request) => {
  const role =
    request.cookies.get("role")?.value;

  const token =
    request.cookies.get("access_token")?.value;

  const path = request.nextUrl.pathname;

  console.log("PROXY RUNNING");
  console.log("ROLE:", role);
  console.log("PATH:", path);

  // not logged in
  if (!token || !role) {
    return Response.redirect(
      new URL("/", request.url)
    );
  }

  // seller cannot access admin
  if (
    path.startsWith("/admin") &&
    role?.toLowerCase().trim() === "seller"
  ) {
    return Response.redirect(
      new URL("/seller/home", request.url)
    );
  }

  // admin cannot access seller
  if (
    path.startsWith("/seller") &&
    role?.toLowerCase().trim() === "admin"
  ) {
    return Response.redirect(
      new URL("/admin/home", request.url)
    );
  }

  return Response.next();
});