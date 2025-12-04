// app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db  from '@/lib/db';
import { usersTable } from '@/app/db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const ID_COOKIE = 'session_user_id';
const TOKEN_COOKIE = 'session_user_token';
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 天

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: '邮箱和密码不能为空' }, { status: 400 });
        }

        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));

        if (!user) {
            return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
        }

        // 设置 session cookie
        (await cookies()).set(ID_COOKIE,""+user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: SESSION_DURATION,
            path: '/',
        });
        // 应该存id+今天日期+hash后的password
        (await cookies()).set(TOKEN_COOKIE,await bcrypt.hash(user.passwordHash+user.id, 12), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: SESSION_DURATION,
            path: '/',
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
    }
}