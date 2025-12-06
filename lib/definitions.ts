export type Note = {
    id: string;
    title: string;
    content: string;
    updatedAt: string;
    createdAt: string;
    authorId?: string;
    localized?: boolean;// true 为本地 false 为数据库, 不用传到数据库
}

export type User = {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    token: string;
}

export const today = new Date().toLocaleDateString("zh-CN").replace(/\//g, "-");
export const now = ()=>{
    function toLocalSqlTimestampMs(date: Date) {
        const pad = (n: number) => String(n).padStart(2, "0");
        const ms = String(date.getMilliseconds()).padStart(3, "0");

        return (
            `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
            `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${ms}`
        );
    }
    return toLocalSqlTimestampMs(new Date());
}

export const Local_Notes_Key = "note_books";

export const ID_COOKIE = "session_user_id";
export const TOKEN_COOKIE = "session_user_token";