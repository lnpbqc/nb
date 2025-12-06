// app/api/logout/route.ts
import { NextResponse } from "next/server";
import {ID_COOKIE, TOKEN_COOKIE} from "@/lib/definitions";


export async function POST() {
    const res = NextResponse.json({ success: true });

    // 删除 cookie：设置为空并过期
    res.cookies.set({
        name: ID_COOKIE,
        value: "",
        path: "/",
        expires: new Date(0),
    });

    res.cookies.set({
        name: TOKEN_COOKIE,
        value: "",
        path: "/",
        expires: new Date(0),
    })

    return res;
}
