import { NextResponse } from "next/server";
// todo: 笔记分表
export async function GET({ params }: { params: { id: string } }) {
    console.log("params:", params); // { id: '1' }

    const id = Number(params.id); // 转成数字
    return NextResponse.json({ success: true, noteId: id });
}