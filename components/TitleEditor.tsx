import { useState, useRef, useEffect } from "react";

type Props = {
    value: string;
    onChange: (value: string) => void;
};

export default function TitleEditor({ value, onChange }: Props) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // 点击外侧退出编辑
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setEditing(false);
                setDraft(value); // 恢复原始值
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [value]);

    const handleSave = () => {
        onChange(draft);
        setEditing(false);
    };

    return (
        <div ref={wrapperRef} className="inline-flex items-center gap-2">
            {editing ? (
                <>
                    <input
                        className="border border-blue-400 focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 outline-none"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        autoFocus
                    />
                    <button
                        onClick={handleSave}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        ✓
                    </button>
                </>
            ) : (
                <span
                    onClick={() => {
                        setDraft(value);
                        setEditing(true);
                    }}
                    className="cursor-pointer text-blue-600"
                >
          {value}
        </span>
            )}
        </div>
    );
}
