'use client';

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import Aside from "@/components/Aside";
import {Note, today} from "@/lib/definitions";
import Tiptap from "@/components/Tiptap";
import { getNotes, saveNote } from "@/lib/notes";
import TitleEditor from "@/components/TitleEditor";

const createNewNote = (): Note => ({
    id: crypto.randomUUID(),
    title: "新建笔记",
    content: "",
    createdAt: today,
    updatedAt: today,
});



export default function HomePage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNoteId, setActiveNoteId] = useState<string>("0");
    const router = useRouter();

    const activeNote = notes.find(n => n.id === activeNoteId) || null;

    // 假设用户名（未来可从 auth 获取）
    const userName = "未登录";


    // 页面加载时获取数据库笔记，没有笔记时使用 example
    useEffect(() => {
        (async () => {
            const data = await getNotes();
            if (!data || data.length === 0) {
                const first = createNewNote();
                await saveNote(first);
                setNotes([first]);
                setActiveNoteId(first.id);
            } else {
                setNotes(data);
                setActiveNoteId(data[0].id);
            }
        })();
    }, []);


    // 一个接收 Note 的保存函数：保存到数据库，然后刷新列表
    const save = async (note: Note | null) => {
        if (!note) return;
        await saveNote(note);           // 保存到数据库
        const newNotes = await getNotes();  // 重新获取最新数据库内容
        if(newNotes)setNotes(newNotes);
    };

    const createNote = async () => {
        const newNote = createNewNote();
        await saveNote(newNote);

        setNotes(prev => [newNote, ...prev]);
        setActiveNoteId(newNote.id);
    };



    return (
        <div className="flex h-screen bg-slate-50">
            <Aside
                notes={notes}
                activeNoteId={activeNoteId||"0"}
                setActiveNoteId={setActiveNoteId}
                createNote={createNote}  // 💡传给 Aside，将在 Aside 中加按钮
            />

            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
                    <TitleEditor value={activeNote?.title||"无标题"} key={activeNote?.id} onChange={(a:string)=>{
                        const newTitle = a || ""
                        const updatedNotes = notes.map(n =>
                            n.id === activeNoteId
                                ? {
                                    ...n,
                                    title: newTitle,
                                    updatedAt: new Date().toLocaleDateString("zh-CN").replace(/\//g, "-"),
                                }
                                : n
                        );
                        setNotes(updatedNotes);
                        if(activeNote)saveNote(activeNote)
                    }}>

                    </TitleEditor>

                    <div className="flex space-x-2">
                        <span className="underline">{userName}</span>

                        <button
                            className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                            onClick={() => save(activeNote)}
                        >
                            保存
                        </button>

                        <button
                            className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md"
                            onClick={createNote}
                        >
                            新建笔记
                        </button>

                        <button
                            className="px-3 py-1.5 text-sm bg-blue-700 hover:bg-blue-600 text-white rounded-md"
                            onClick={() => router.push('/auth/signin')}
                        >
                            登录/注册
                        </button>
                    </div>
                </header>

                <div className="flex-1 p-6 overflow-auto">
                    {activeNote && (
                        <Tiptap
                            key={activeNote.id}
                            value={activeNote.content}
                            saveNote={() => saveNote(activeNote)}
                            onChange={(content: string) => {
                                const updatedNotes = notes.map(n =>
                                    n.id === activeNoteId
                                        ? {
                                            ...n,
                                            content,
                                            updatedAt: new Date().toLocaleDateString("zh-CN").replace(/\//g, "-"),
                                        }
                                        : n
                                );
                                setNotes(updatedNotes);
                            }}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}