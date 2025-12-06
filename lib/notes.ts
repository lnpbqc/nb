// lib/notes.ts
import {Local_Notes_Key, Note, now} from "@/lib/definitions";

// 需要加入保存到本地和从本地加载的
// 保存的时候,如果有网络且登录,则把本地和数据库同步;否则保存到本地
// GET /api/net 检查链接,返回{status:boolean},POST /api/notes 获取笔记,返回{success:boolean}
// 保存本地为 "note_books",Note[],(如果已经登录,在退出的时候需要再/api/auth/logout/route.ts 中清除本地缓存)

// 加载的时候,如果有网络且登录,则加载本地和数据库;否则加载本地
// GET /api/net 检查链接,返回{status:boolean},GET /api/notes 获取笔记,返回{success:boolean,notes:Note[]}


const loadLocalNotes = (): Note[] => {
    if (typeof window === "undefined") return [];
    try {
        const str = localStorage.getItem(Local_Notes_Key);
        return str ? JSON.parse(str) : [];
    } catch {
        return [];
    }
};

/** 保存到本地 */
const saveLocalNotes = (notes: Note[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(Local_Notes_Key, JSON.stringify(notes));
};


/** 检查网络 */
const checkNet = async (): Promise<boolean> => {
    try {
        const net = await fetch("/api/net", { method: "GET", cache: "no-cache" });
        return (await net.json()).success;
    } catch {
        return false;
    }
};

/** 判断是否登录 */
const checkLogin = async (): Promise<boolean> => {
    try {
        const res = await fetch("/api/auth", {
            cache: "no-store",
            method:"POST",
            body:JSON.stringify({msg:"status"})
        });
        return (await res.json()).msg;
    } catch {
        return false;
    }
};


export const getNotes = async (): Promise<Note[] | null> => {
    try {
        const online = await checkNet();
        const loggedIn = await checkLogin();

        const local = loadLocalNotes();

        // 若在线并已登录 → 合并服务器和本地
        if (online && loggedIn) {
            const res = await fetch('/api/notes', {
                method: "GET",
                cache: "no-store",
            });
            if (!res.ok) return local;

            const serverNotes = (await res.json()).notes as Note[];

            // 合并本地与服务器，按 id 去重（服务器优先）
            const map = new Map<string, Note>();
            serverNotes.forEach(n => map.set(n.id, n));
            local.forEach(n => {
                if (!map.has(n.id)) map.set(n.id, n);
                // 把数据
                saveNote(n,true);
            });

            const merged = [...map.values()];

            // 合并结果同步回本地
            saveLocalNotes(merged);

            return merged;
        }

        // 若离线或未登录 → 仅返回本地
        return local;
    } catch (e) {
        console.error("getNotes error:", e);
        return null;
    }
};


// export const getNotes = async (): Promise<Note[] | null> => {
//     try {
//         const net = await fetch("/api/net",{
//             method: "GET",
//             cache: "no-cache",
//         })
//         const online = (await net.json()).status;
//         if(online){
//
//         }
//
//
//         const res = await fetch('/api/notes', {
//             method: "GET",
//             cache: "no-store",
//         });
//
//         if (!res.ok) return null;
//         const data = await res.json();
//         return data.notes;
//     } catch (e) {
//         console.error("getNotes error:", e);
//         return null;
//     }
// };

// update为同步本地给远程数据库
export const saveNote = async (note: Note,update:boolean=false): Promise<boolean> => {
    try {
        const online = await checkNet();
        const loggedIn = await checkLogin();

        if(!update){
            // 本地笔记的更新时间
            note.updatedAt = now()
            // 更新本地数据
            const local = loadLocalNotes();
            const idx = local.findIndex(n => n.id === note.id);
            // 保存到本地
            if (idx >= 0) local[idx] = note;
            else local.push(note);
            saveLocalNotes(local);
        }

        // 联网 & 登录 → 同步服务器
        if (online && loggedIn) {
            const res = await fetch('/api/notes', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(note),
            });
            if (!res.ok) return false;

            const { success } = await res.json();
            return success;
        }

        // 离线/未登录 → 本地已保存即成功
        return true;
    } catch (e) {
        console.error("saveNote error:", e);
        return false;
    }
};

// export const saveNote = async (note: Note): Promise<boolean> => {
//     try {
//         const res = await fetch('/api/notes', {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(note),
//         });
//
//         if (!res.ok) {
//             alert("Could not save note");
//             return false;
//         }
//
//         const { success } = await res.json();
//         return success;
//     } catch (e) {
//         console.error("saveNote error:", e);
//         return false;
//     }
// };


export const deleteNote = async (id: string): Promise<boolean> => {
    try {
        const online = await checkNet();
        const loggedIn = await checkLogin();

        // 本地删除
        let local = loadLocalNotes();
        local = local.filter(n => n.id !== id);
        saveLocalNotes(local);

        // 在线 & 登录 → 同步删除到服务器
        if (online && loggedIn) {
            const res = await fetch('/api/notes', {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (!res.ok) return false;

            const { success } = await res.json();
            return success;
        }

        // 离线/未登录 → 本地已删除即成功
        return true;
    } catch (e) {
        console.error("deleteNote error:", e);
        return false;
    }
};

// export const deleteNote = async (id: string): Promise<boolean> => {
//     try {
//         const res = await fetch('/api/notes', {
//             method: "DELETE",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({id}),
//         });
//
//         if (!res.ok) {
//             alert("Could not delete note");
//             return false;
//         }
//
//         const { success } = await res.json();
//         return success;
//     } catch (e) {
//         console.error("saveNote error:", e);
//         return false;
//     }
// };
