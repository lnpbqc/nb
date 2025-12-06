import {NextRequest, NextResponse} from "next/server";
// todo: 笔记分表
export async function GET(request:NextRequest,{ params }: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    return NextResponse.json({ success: true, noteId: id });
}