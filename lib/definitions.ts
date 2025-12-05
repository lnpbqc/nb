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