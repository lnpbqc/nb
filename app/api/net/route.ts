import {NextResponse} from "next/server";
// 表示服务器在线
export async function GET() {
       return NextResponse.json({ success: true});
}