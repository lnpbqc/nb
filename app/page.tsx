'use client';

import { useState } from 'react';
import {useRouter} from "next/navigation";


type Note = {
    id: string;
    title: string;
    content: string;
    updatedAt: string;
};

const initialNotes: Note[] = [
    {
        id: '1',
        title: '欢迎使用 BlueNote',
        content: '这是一个简洁、高效的笔记应用。你可以在这里记录想法、任务或任何灵感。\n\n支持 Markdown 格式（未来可扩展）。',
        updatedAt: '2025-12-03',
    },
    {
        id: '2',
        title: '项目计划',
        content: '- 完成 UI 设计\n- 实现本地存储\n- 添加搜索功能\n- 支持导出为 PDF',
        updatedAt: '2025-12-02',
    },
];

export default function HomePage() {
    const [notes, setNotes] = useState<Note[]>(initialNotes);
    const [activeNoteId, setActiveNoteId] = useState<string>('1');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const activeNote = notes.find(note => note.id === activeNoteId) || notes[0];

    const router = useRouter();

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar Toggle Button (for mobile) */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden fixed top-4 left-4 z-10 p-2 rounded-lg bg-blue-500 text-white"
            >
                ☰
            </button>

            {/* Sidebar */}
            <aside
                className={`bg-white border-r border-slate-200 w-64 flex-shrink-0 transform transition-transform duration-300 ease-in-out ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 fixed md:static h-full z-10`}
            >
                <div className="p-4 border-b border-slate-200">
                    <h1 className="text-xl font-bold text-blue-600">BlueNote</h1>
                </div>
                <div className="p-2 space-y-1 overflow-y-auto h-[calc(100%-60px)]">
                    {notes.map(note => (
                        <button
                            key={note.id}
                            onClick={() => {
                                setActiveNoteId(note.id);
                                setIsSidebarOpen(false); // Auto close on mobile
                            }}
                            className={`w-full text-left p-3 rounded-lg transition-colors ${
                                activeNoteId === note.id
                                    ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                                    : 'hover:bg-slate-100 text-slate-700'
                            }`}
                        >
                            <div className="font-medium truncate">{note.title}</div>
                            <div className="text-xs text-slate-500 mt-1">{note.updatedAt}</div>
                        </button>
                    ))}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-800">{activeNote?.title || '无标题'}</h2>
                    <div className="flex space-x-2">
                        <button className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition">
                            保存
                        </button>
                        <button className="px-3 py-1.5 text-sm bg-blue-700 hover:bg-blue-600 text-white rounded-md transition"
                            onClick={()=>router.push('/auth/signin')}
                        >
                            {"登录"}
                        </button>
                    </div>
                </header>

                {/* Note Editor / Viewer */}
                <div className="flex-1 p-6 overflow-auto">
          <textarea
              value={activeNote?.content || ''}
              readOnly
              className="w-full h-full min-h-[400px] p-4 text-slate-700 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              placeholder="开始记录你的想法..."
          />
                    {/* 可替换为富文本编辑器如 Tiptap 或 Quill（进阶） */}
                </div>
            </main>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-0 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}