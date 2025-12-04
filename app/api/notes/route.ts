// app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {cookies} from "next/headers";
import * as bcrypt from "bcryptjs";
import db from "@/lib/db";
import {usersTable} from "@/app/db/schema";
import {eq} from "drizzle-orm";
import {number} from "@drizzle-team/brocli";

const ID_COOKIE = 'session_user_id';
const TOKEN_COOKIE = 'session_user_token';

export async function POST(request: NextRequest) {
    try {
        // 读取 body
        const json = await request.json();
        console.log(json);

        // 你可以从 Cookie 中提取登录用户信息
        const cookieStore =await cookies();

        const id = Number(cookieStore.get(ID_COOKIE)?.value);
        const token = String(cookieStore.get(TOKEN_COOKIE)?.value);


        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, id));

        console.log(user)
        console.log(token)

        const today = new Date().toLocaleDateString("zh-CN").replace(/\//g, "-");
        const isValid = await bcrypt.compare((await bcrypt.hash(today+":"+user.passwordHash+":"+user.id, 12)).toString(), token)
        console.log(await bcrypt.hash(Date.now()+":"+user.passwordHash+":"+user.id, 12))
        // 检查是否登录
        if (!isValid) {
            return NextResponse.json(
                { error: "未登录，无法保存笔记" },
                { status: 401 }
            );
        }



        // 返回保存后的笔记
        return NextResponse.json("asd", { status: 200 });
    } catch (error) {
        console.error("保存笔记失败", error);
        return NextResponse.json(
            { error: "服务器错误" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    return NextResponse.json([{
        id: crypto.randomUUID(),
        title: '欢迎使用 BlueNote',
        content: '这是一个简洁、高效的笔记应用。你可以在这里记录想法、任务或任何灵感。\n\n支持 Markdown 格式（未来可扩展）。',
        createdAt:  "2025-12-03",
        updatedAt: '2025-12-03',
    }],{status:200})
}