// app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db  from '@/lib/db';
import { usersTable } from '@/app/db/schema';
import * as bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const { name,email, password,repassword } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: '邮箱和密码不能为空' }, { status: 400 });
        }
        if (password !== repassword) {
            return NextResponse.json({ error: '两次密码需要一致' }, { status: 400 });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        await db
            .insert(usersTable).values({ name,email, passwordHash })

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
    }
}