'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Emoji, { gitHubEmojis } from '@tiptap/extension-emoji';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link'; // 虽然 StarterKit 包含，但常需自定义配置
import { useCallback } from 'react';

const Tiptap = () => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4, 5, 6], // 支持全部标题级别
                },
                // 其他可选配置
            }),
            // Emoji 扩展
            Emoji.configure({
                emojis: gitHubEmojis,
                enableEmoticons: true,
            }),
            // Image 扩展（必须显式添加）
            Image.configure({
                inline: false, // 图片作为块级元素（默认）
                allowBase64: true, // 允许 base64 图片（用于本地预览）
            }),
            // 如果你需要自定义 link 行为（比如自动识别 URL），可以显式配置
            Link.configure({
                openOnClick: false, // 点击不自动跳转
                autolink: true,     // 自动将输入的 URL 转为链接
            }),
        ],
        content: '<p>你好世界！</p>',
        autofocus: true,
        editable: true,
        injectCSS: true, // 建议设为 true，否则样式可能错乱
        immediatelyRender: false,
    });

    const addImage = useCallback(() => {
        const url = window.prompt('请输入图片 URL');
        if (url) {
            editor?.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    const addLink = useCallback(() => {
        const url = window.prompt('请输入链接 URL');
        if (url) {
            editor?.chain().focus().setLink({ href: url }).run();
        }
    }, [editor]);

    return (
        <div className="border rounded-lg p-4 max-w-4xl mx-auto">
            {/* 工具栏 */}
            <div className="flex flex-wrap gap-2 mb-4 p-2 bg-slate-100 rounded">
                <button
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`px-3 py-1 text-sm rounded ${editor?.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-white'}`}
                >
                    Bold
                </button>
                <button
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`px-3 py-1 text-sm rounded ${editor?.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-white'}`}
                >
                    Italic
                </button>
                <button
                    onClick={() => editor?.chain().focus().toggleUnderline().run()}
                    className={`px-3 py-1 text-sm rounded ${editor?.isActive('underline') ? 'bg-blue-500 text-white' : 'bg-white'}`}
                >
                    Underline
                </button>
                <button
                    onClick={() => editor?.chain().focus().toggleStrike().run()}
                    className={`px-3 py-1 text-sm rounded ${editor?.isActive('strike') ? 'bg-blue-500 text-white' : 'bg-white'}`}
                >
                    Strike
                </button>
                <button
                    onClick={() => editor?.chain().focus().toggleCode().run()}
                    className={`px-3 py-1 text-sm rounded ${editor?.isActive('code') ? 'bg-blue-500 text-white' : 'bg-white'}`}
                >
                    Code
                </button>

                <button
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`px-3 py-1 text-sm rounded ${editor?.isActive('heading', { level: 1 }) ? 'bg-blue-500 text-white' : 'bg-white'}`}
                >
                    H1
                </button>
                <button
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`px-3 py-1 text-sm rounded ${editor?.isActive('heading', { level: 2 }) ? 'bg-blue-500 text-white' : 'bg-white'}`}
                >
                    H2
                </button>

                <button
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={`px-3 py-1 text-sm rounded ${editor?.isActive('bulletList') ? 'bg-blue-500 text-white' : 'bg-white'}`}
                >
                    • List
                </button>
                <button
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                    className={`px-3 py-1 text-sm rounded ${editor?.isActive('orderedList') ? 'bg-blue-500 text-white' : 'bg-white'}`}
                >
                    1. List
                </button>

                <button
                    onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                    className={`px-3 py-1 text-sm rounded ${editor?.isActive('blockquote') ? 'bg-blue-500 text-white' : 'bg-white'}`}
                >
                    Blockquote
                </button>

                <button
                    onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                    className={`px-3 py-1 text-sm rounded ${editor?.isActive('codeBlock') ? 'bg-blue-500 text-white' : 'bg-white'}`}
                >
                    Code Block
                </button>

                <button
                    onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                    className="px-3 py-1 text-sm bg-white rounded"
                >
                    HR
                </button>

                <button
                    onClick={addLink}
                    className={`px-3 py-1 text-sm rounded ${editor?.isActive('link') ? 'bg-blue-500 text-white' : 'bg-white'}`}
                >
                    Link
                </button>

                <button
                    onClick={() => editor?.chain().focus().unsetLink().run()}
                    disabled={!editor?.isActive('link')}
                    className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
                >
                    Unlink
                </button>

                <button onClick={addImage} className="px-3 py-1 text-sm bg-white rounded">
                    Image
                </button>

                <button
                    onClick={() => editor?.chain().focus().setEmoji('smile').run()}
                    className="px-3 py-1 text-sm bg-white rounded"
                >
                    😊
                </button>

                <button
                    onClick={() => editor?.chain().focus().undo().run()}
                    className="px-3 py-1 text-sm bg-white rounded"
                >
                    Undo
                </button>
                <button
                    onClick={() => editor?.chain().focus().redo().run()}
                    className="px-3 py-1 text-sm bg-white rounded"
                >
                    Redo
                </button>
            </div>

            {/* 编辑器内容区 */}
            <EditorContent editor={editor} className="prose prose-blue max-w-none p-4 border rounded min-h-[300px]" />
        </div>
    );
};

export default Tiptap;
// 本地化
// // Save the editor content to LocalStorage
// localStorage.setItem('editorContent', JSON.stringify(editor.getJSON()))
//
// // Restore the editor content from LocalStorage
// const savedContent = localStorage.getItem('editorContent')
// if (savedContent) {
//     editor.setContent(JSON.parse(savedContent))
// }

// 数据库
// fetch('/api/editor/content', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(editor.getJSON()),
// })
