import {cookies} from "next/headers";
import db from "@/lib/db";
import {usersTable} from "@/app/db/schema";
import {eq} from "drizzle-orm";
import bcrypt from "bcryptjs";
import {ID_COOKIE, today, TOKEN_COOKIE} from "@/lib/definitions";


export default async function authenticate() {
    const cookieStore = await cookies();

    const id = Number(cookieStore.get(ID_COOKIE)?.value);
    const token = String(cookieStore.get(TOKEN_COOKIE)?.value);

    if (!id || !token) {
        throw new Error("未登录");
    }

    const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id));

    if (!user) {
        throw new Error("用户不存在");
    }

    const isValid = await bcrypt.compare(
        today + ":" + user.passwordHash + ":" + String(user.id),
        token
    );

    if (!isValid) {
        throw new Error("未登录");
    }

    return user;
}