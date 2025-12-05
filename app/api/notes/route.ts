// app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {cookies} from "next/headers";
import * as bcrypt from "bcryptjs";
import db from "@/lib/db";
import {notebookTable, usersTable} from "@/app/db/schema";
import {eq} from "drizzle-orm";
import {now, today} from "@/lib/definitions"

const ID_COOKIE = 'session_user_id';
const TOKEN_COOKIE = 'session_user_token';

export async function POST(request: NextRequest) {
    try {
        const json = await request.json();
        const cookieStore = await cookies();

        const id = Number(cookieStore.get(ID_COOKIE)?.value);
        const token = String(cookieStore.get(TOKEN_COOKIE)?.value);

        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, id));

        if (!user) {
            return NextResponse.json({ error: "用户不存在" }, { status: 401 });
        }

        const isValid = await bcrypt.compare(
            today + ":" + user.passwordHash + ":" + String(user.id),
            token
        );

        if (!isValid) {
            return NextResponse.json(
                { error: "未登录，无法保存笔记" },
                { status: 401 }
            );
        }

        const payload = {
            ...json,
            authorId: user.id,
            updatedAt: now(),
        };

        const [note] = await db
            .select()
            .from(notebookTable)
            .where(eq(notebookTable.id, payload.id));

        if (!note) {
            await db.insert(notebookTable).values(payload);
        } else {
            await db
                .update(notebookTable)
                .set({
                    title: payload.title,
                    content: payload.content,
                    updatedAt: payload.updatedAt,
                })
                .where(eq(notebookTable.id, payload.id));
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("保存笔记失败", error);
        return NextResponse.json(
            { error: "服务器错误", success: false },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();

        const id = Number(cookieStore.get(ID_COOKIE)?.value);
        const token = String(cookieStore.get(TOKEN_COOKIE)?.value);

        // 查用户
        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, id));

        if (!user) {
            return NextResponse.json({ error: "用户不存在" }, { status: 401 });
        }

        // 校验权限
        const isValid = await bcrypt.compare(
            today + ":" + user.passwordHash + ":" + String(user.id),
            token
        );

        if (!isValid) {
            return NextResponse.json(
                { error: "未登录，无法获取笔记" },
                { status: 401 }
            );
        }

        // 查询该用户全部笔记
        const notes = await db
            .select()
            .from(notebookTable)
            .where(eq(notebookTable.authorId, user.id));

        return NextResponse.json({ success: true, notes });
    } catch (error) {
        console.error("获取笔记失败", error);
        return NextResponse.json(
            { error: "服务器错误", success: false },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const cookieStore = await cookies();

        const id = Number(cookieStore.get(ID_COOKIE)?.value);
        const token = String(cookieStore.get(TOKEN_COOKIE)?.value);

        // 查用户
        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, id));

        if (!user) {
            return NextResponse.json({ error: "用户不存在" }, { status: 401 });
        }

        // 校验权限
        const isValid = await bcrypt.compare(
            today + ":" + user.passwordHash + ":" + String(user.id),
            token
        );

        if (!isValid) {
            return NextResponse.json(
                { error: "未登录，无法获取笔记" },
                { status: 401 }
            );
        }

        // 查询该用户全部笔记
        const notes = await db
            .select()
            .from(notebookTable)
            .where(eq(notebookTable.authorId, user.id));

        return NextResponse.json({ success: true, notes });
    } catch (error) {
        console.error("获取笔记失败", error);
        return NextResponse.json(
            { error: "服务器错误", success: false },
            { status: 500 }
        );
    }
}
