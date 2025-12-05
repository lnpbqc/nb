import authenticate from "@/app/api/auth/auth-user";
import {NextRequest, NextResponse} from "next/server";

export async function POST(req:NextRequest) {
    try {
        const user = await authenticate();
        const json = await req.json()

        if(json.msg === "id"){
            return NextResponse.json({msg:user.id})
        }else if(json.msg === "name"){
            return NextResponse.json({msg:user.name})
        }else if(json.msg === "email"){
            return NextResponse.json({msg:user.email})
        }else if(json.msg === "status"){
            return NextResponse.json({msg:true})
        }

        return NextResponse.json({ msg:null });
    } catch (error) {
        console.error("获取信息失败", error);
        return NextResponse.json(
            { error: "服务器错误", success: false },
            { status: 500 }
        );
    }
}