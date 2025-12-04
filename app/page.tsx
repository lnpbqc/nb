'use client';

import {useEffect, useState} from 'react';
import {useRouter} from "next/navigation";
import Aside from "@/components/Aside";
import {Note} from "@/lib/definitions"
import Tiptap from "@/components/Tiptap";

const getNotes = async () => {
    try {
        const res = await fetch('/api/notes', { cache: 'no-store',method:"get"});
        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        console.error(e);
        return null;
    }
};

const saveNote = async (note:Note) => {
    try {
        const res = await fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(note),
        });
        const json = await res.json();
        console.log(json);

        if (!res.ok) return alert("Could not save note");
    } catch (e) {
        console.error(e);
    }
};

const initialNotes: Note[] = [
    {
        id: crypto.randomUUID(),
        title: '欢迎使用 BlueNote',
        content: '这是一个简洁、高效的笔记应用。你可以在这里记录想法、任务或任何灵感。\n\n支持 Markdown 格式（未来可扩展）。',
        createdAt:  "2025-12-03",
        updatedAt: '2025-12-03',
    },
];

export default function HomePage() {
    // 从数据库获取和从本地获取
    // id或用uuid
    const [notes, setNotes] = useState<Note[]>(initialNotes);
    const [activeNoteId, setActiveNoteId] = useState<string>(notes[0].id);
    const [userName, setUserName] = useState<string>("");

    useEffect(() => {
        (async () => {
            const data = await getNotes();
            if (data) {
                setNotes(data);
                setActiveNoteId(data[0].id);
            }
        })();


    }, []);

    const activeNote = notes.find(note => note.id === activeNoteId) || notes[0];

    const router = useRouter();


    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            {/* 只查询列表，具体内容点击后查询显示 */}
            <Aside notes={notes} setActiveNoteId={setActiveNoteId} activeNoteId={activeNoteId}  />

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-800">{activeNote?.title || '无标题'}</h2>
                    <div className="flex space-x-2">

                        {/*如果有登录，登录有效的话，就显示登录的账号名*/}

                        <span className={"underline"}>{userName}</span>

                        <button className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition">
                            保存
                        </button>
                        <button className="px-3 py-1.5 text-sm bg-blue-700 hover:bg-blue-600 text-white rounded-md transition"
                            onClick={()=>router.push('/auth/signin')}
                        >
                            {"登录/注册"}
                        </button>
                    </div>
                </header>

                {/* Note Editor / Viewer */}
                <div className="flex-1 p-6 overflow-auto">
                  <Tiptap  value={notes.filter((note)=>note.id===activeNoteId)[0].content}
                           saveNote={()=>saveNote(notes.filter((note)=>note.id===activeNoteId)[0])}
                  onChange={(content:string)=>{
                      const note = notes.filter((note)=>note.id===activeNoteId)[0]
                      const local_notes = notes.filter((note)=>note.id!==activeNoteId)
                      note.content = content;
                      note.updatedAt = Date.now().toString();
                      local_notes.push(note);
                      setNotes(local_notes);
                  }}/>
                </div>
            </main>
        </div>
    );
}