// app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from "@/lib/db";
import {notebookTable} from "@/app/db/schema";
import {and, eq} from "drizzle-orm";
import {now, today} from "@/lib/definitions"
import authenticate from "@/app/api/auth/auth-user";

export async function POST(request: NextRequest) {
    try {
        const json = await request.json();
        const user = await authenticate();

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

export async function GET() {
    try {
        const user = await authenticate();

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
        const json = await request.json();
        const user = await authenticate();  // 获取登录的用户

        // 先查询笔记是否存在且属于该用户
        const [note] = await db
            .select()
            .from(notebookTable)
            .where(
                eq(notebookTable.id, json.id)
            );

        if (!note) {
            return NextResponse.json(
                { error: "笔记不存在" },
                { status: 404 }
            );
        }

        if (note.authorId !== user.id) {
            return NextResponse.json(
                { error: "无权删除他人的笔记" },
                { status: 403 }
            );
        }

        // 删除笔记
        await db
            .delete(notebookTable)
            .where(eq(notebookTable.id, json.id));

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("删除笔记失败", error);
        return NextResponse.json(
            { error: "服务器错误", success: false },
            { status: 500 }
        );
    }
}
