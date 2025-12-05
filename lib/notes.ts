// lib/notes.ts
import { Note } from "@/lib/definitions";

export const getNotes = async (): Promise<Note[] | null> => {
    try {
        const res = await fetch('/api/notes', {
            method: "GET",
            cache: "no-store",
        });

        if (!res.ok) return null;
        const data = await res.json();
        return data.notes;
    } catch (e) {
        console.error("getNotes error:", e);
        return null;
    }
};

export const saveNote = async (note: Note): Promise<boolean> => {
    try {
        const res = await fetch('/api/notes', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(note),
        });

        if (!res.ok) {
            alert("Could not save note");
            return false;
        }

        const { success } = await res.json();
        return success;
    } catch (e) {
        console.error("saveNote error:", e);
        return false;
    }
};

export const deleteNote = async (id: string): Promise<boolean> => {
    try {
        console.log("===========================",id)
        const res = await fetch('/api/notes', {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: id,
        });

        if (!res.ok) {
            alert("Could not delete note");
            return false;
        }

        const { success } = await res.json();
        return success;
    } catch (e) {
        console.error("saveNote error:", e);
        return false;
    }
};
