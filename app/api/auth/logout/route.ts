// app/api/logout/route.ts
import { NextResponse } from "next/server";

const ID_COOKIE = "session_user_id";
const TOKEN_COOKIE = "session_user_token";

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
    });

    return res;
}
