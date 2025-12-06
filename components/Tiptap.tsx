'use client';

import {EditorContent, useEditor, useEditorState} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Emoji, { gitHubEmojis } from '@tiptap/extension-emoji';
import Image from '@tiptap/extension-image';
import ImageResize from 'tiptap-extension-resize-image'
import "./tiptap.css"

import {
    Bold, Italic, Underline, Strikethrough, Code,
    List, ListOrdered,
    Quote, Code2, Minus,
    Link, Unlink,
    Image as ImageIcon,
    Undo, Redo,
    Smile
} from "lucide-react";
import {Level} from "@tiptap/extension-heading";
import {Dropcursor} from "@tiptap/extensions";
import {useEffect, useState} from "react";
import {BubbleMenu} from "@tiptap/react/menus";


interface Props {
    value: string
    onChange?: (content: string) => void,
    saveNote?: () => void,
}


const Tiptap = ({ value, onChange,saveNote }: Props) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4, 5, 6], // 支持全部标题级别
                },
                link:{
                    openOnClick: true,
                    autolink: true,
                }
                // 其他可选配置
            }),
            // Emoji 扩展
            Emoji.configure({
                emojis: gitHubEmojis,
                enableEmoticons: true,
            }),
            // Image 扩展（必须显式添加）
            Image.configure({
                inline: true, // 图片作为块级元素（默认）
                allowBase64: true, // 允许 base64 图片（用于本地预览）
                // resize: {
                //     enabled: true,
                //     alwaysPreserveAspectRatio: true,
                // },
            }).extend(ImageResize),
            Dropcursor,
        ],
        content: value,
        autofocus: true,
        editable: true,
        injectCSS: true, // 建议设为 true，否则样式可能错乱
        immediatelyRender: false,
        onUpdate: ({editor}) => {
            onChange?.(editor.getHTML())
        }
    });

    const [isEditable, setIsEditable] = useState(true)

    useEffect(() => {
        if (editor) {
            editor.setEditable(isEditable)
        }
    }, [isEditable, editor])


    const { isBold, isItalic, isStrikethrough } = useEditorState({
        editor,
        selector: (ctx) => ({
            isBold: ctx?.editor?.isActive('bold') ?? false,
            isItalic: ctx?.editor?.isActive('italic') ?? false,
            isStrikethrough: ctx?.editor?.isActive('strike') ?? false,
        }),
    }) as {
        isBold: boolean;
        isItalic: boolean;
        isStrikethrough: boolean;
    };

    return (
        <div className="border border-slate-200 rounded-lg p-2 bg-white h-full flex flex-col">
            {/* 工具栏 */}
            <div className="tiptap-toolbar flex justify-center items-center flex-wrap">

                <label>
                    <input type="checkbox" checked={isEditable} onChange={() => setIsEditable(!isEditable)} />
                    启用编辑
                </label>

                {/* 标题下拉菜单 */}
                <select
                    onChange={(e) =>
                        editor?.chain().focus().toggleHeading({ level: Number(e.target.value) as Level }).run()
                    }
                    className="tiptap-select"
                    defaultValue=""
                >
                    <option value="" disabled>标题</option>
                    <option value="1">H1</option>
                    <option value="2">H2</option>
                    <option value="3">H3</option>
                    <option value="4">H4</option>
                    <option value="5">H5</option>
                    <option value="6">H6</option>
                </select>

                <button className={`tiptap-btn ${editor?.isActive("bold") ? "active" : ""}`}
                        onClick={() => editor?.chain().focus().toggleBold().run()}>
                    <Bold size={16}/>
                </button>

                <button className={`tiptap-btn ${editor?.isActive("italic") ? "active" : ""}`}
                        onClick={() => editor?.chain().focus().toggleItalic().run()}>
                    <Italic size={16}/>
                </button>

                <button className={`tiptap-btn ${editor?.isActive("underline") ? "active" : ""}`}
                        onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                    <Underline size={16}/>
                </button>

                <button className={`tiptap-btn ${editor?.isActive("strike") ? "active" : ""}`}
                        onClick={() => editor?.chain().focus().toggleStrike().run()}>
                    <Strikethrough size={16}/>
                </button>

                <button className={`tiptap-btn ${editor?.isActive("code") ? "active" : ""}`}
                        onClick={() => editor?.chain().focus().toggleCode().run()}>
                    <Code size={16}/>
                </button>

                <div className="tiptap-divider"></div>

                <button className={`tiptap-btn ${editor?.isActive("bulletList") ? "active" : ""}`}
                        onClick={() => editor?.chain().focus().toggleBulletList().run()}>
                    <List size={16}/>
                </button>

                <button className={`tiptap-btn ${editor?.isActive("orderedList") ? "active" : ""}`}
                        onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
                    <ListOrdered size={16}/>
                </button>

                <button className={`tiptap-btn ${editor?.isActive("blockquote") ? "active" : ""}`}
                        onClick={() => editor?.chain().focus().toggleBlockquote().run()}>
                    <Quote size={16}/>
                </button>

                <button className={`tiptap-btn ${editor?.isActive("codeBlock") ? "active" : ""}`}
                        onClick={() => editor?.chain().focus().toggleCodeBlock().run()}>
                    <Code2 size={16}/>
                </button>

                <button className="tiptap-btn"
                        onClick={() => editor?.chain().focus().setHorizontalRule().run()}>
                    <Minus size={16}/>
                </button>

                <div className="tiptap-divider"></div>

                <button className={`tiptap-btn ${editor?.isActive("link") ? "active" : ""}`}
                        onClick={() => {
                            const url = prompt("请输入链接 URL");
                            if (url) editor?.chain().focus().setLink({ href: url }).run();
                        }}
                >
                    <Link size={16}/>
                </button>

                <button className="tiptap-btn"
                        disabled={!editor?.isActive("link")}
                        onClick={() => editor?.chain().focus().unsetLink().run()}>
                    <Unlink size={16}/>
                </button>

                <label htmlFor="uploadImg" className="tiptap-btn">
                    <ImageIcon size={16}/>
                </label>
                <input id="uploadImg" type="file" accept="image/*"
                       className="hidden"
                       onChange={async (e) => {
                           const file = e.target.files?.[0];
                           if (!file) return;
                           const reader = new FileReader();
                           reader.onload = () =>
                               editor?.chain().focus().setImage({ src: reader.result as string }).run();
                           reader.readAsDataURL(file);
                       }}
                />

                <button className="tiptap-btn"
                        onClick={() => editor?.chain().focus().setEmoji("smile").run()}>
                    <Smile size={16}/>
                </button>

                <div className="tiptap-divider"></div>

                <button className="tiptap-btn" onClick={() => editor?.chain().focus().undo().run()}>
                    <Undo size={16}/>
                </button>

                <button className="tiptap-btn" onClick={() => editor?.chain().focus().redo().run()}>
                    <Redo size={16}/>
                </button>

                <button className="tiptap-btn save-btn" onClick={saveNote}>
                    保存
                </button>
            </div>

            {isEditable&&editor&&(
                <BubbleMenu editor={editor} options={{ placement: 'bottom', offset: 8, flip: true }}>
                    <div className="bubble-menu">
                        <button
                            onClick={() => editor?.chain().focus().toggleBold().run()}
                            className={isBold ? 'is-active' : ''}
                            type="button"
                        >
                            Bold
                        </button>
                        <button
                            onClick={() => editor?.chain().focus().toggleItalic().run()}
                            className={isItalic ? 'is-active' : ''}
                            type="button"
                        >
                            Italic
                        </button>
                        <button
                            onClick={() => editor?.chain().focus().toggleStrike().run()}
                            className={isStrikethrough ? 'is-active' : ''}
                            type="button"
                        >
                            Strike
                        </button>
                    </div>
                </BubbleMenu>
            )}

            {/* 编辑器内容区 */}
            <EditorContent editor={editor} className="prose max-w-none flex-1 h-full overflow-y-auto tiptap-editor" />
        </div>
    );
};

export default Tiptap;
