// pages/_middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { protectedRoutes } from "./helper/ProtectedRoutes";
import { cookies } from 'next/headers';

function role() {
    const token = cookies().get("access_token");
    
    if (!token) {
        return null;
    }
    
    try {
        const parse = JSON.parse(Buffer.from(token.value.split('.')[1], 'base64').toString());
        return parse.role
    } catch (e) {
        console.error('Ошибка при декодировании токена:', e);
        return null;
    }
}

export default function middleware(req: NextRequest) {
    const userRole = role();
    
    for (const item of protectedRoutes) {
        if (req.nextUrl.pathname.startsWith(item.path)) {
            if (!item.role.includes(userRole)) {
                const absoluteURL = new URL("/", req.nextUrl.origin);
                return NextResponse.redirect(absoluteURL.toString());
            }
        }
    }

    return NextResponse.next();
}
