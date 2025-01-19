import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {jwtDecode} from "jwt-decode";
import {Jwt} from "@/types";

const adminPaths = ["/quan-tri"];
const privatePaths = ["/nguoi-dung"]
const authPaths = ["/dang-nhap", "/dang-ky"];
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("access-token")?.value;
    if ((adminPaths.some((path) => pathname.startsWith(path)) ||
        privatePaths.some((path) => pathname.startsWith(path))
    ) && !token){
        return NextResponse.redirect(new URL("/dang-nhap", request.url));
    }
    if ((authPaths.some((path) => pathname.startsWith(path)) && token) ||
        (adminPaths.some((path) => pathname.startsWith(path)) && !jwtDecode<Jwt>(token ?? "").isAdmin)
    ) {
        return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [...adminPaths, ...authPaths],
};
