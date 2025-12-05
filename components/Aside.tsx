import {Note} from "@/lib/definitions"

type AsidePros = {
    notes: Note[],
    setActiveNoteId: (noteId: string) => void,
    activeNoteId:string,
    createNote:() => void,
    deleteNote:(id:string) => void,
}

export default function Aside({notes, setActiveNoteId,activeNoteId,deleteNote}:AsidePros){
    return (
        <aside
            className={`bg-white border-r border-slate-200 w-64 flex-shrink-0 transform transition-transform duration-300 ease-in-out -translate-x-full md:translate-x-0 fixed md:static h-screen z-10`}>
            <div className="border-b border-slate-200">
                <h1 className="text-xl font-bold text-blue-600 px-4">
                    BlueNote
                    <br/>
                    {notes?.filter((note)=>note.id===activeNoteId)[0]?.title}
                </h1>
            </div>
            <div className="p-2 space-y-1 overflow-y-auto h-[calc(100%-60px)]">
                {
                    notes.map(note => (
                    <button
                        key={note.id}
                        onClick={() => {
                            setActiveNoteId(note.id);
                        }}
                        className={`w-full text-left p-3 rounded-lg transition-colors relative ${
                            activeNoteId === note.id
                                ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                                : 'hover:bg-slate-100 text-slate-700'
                        }`}
                    >
                        <div className="font-medium truncate">{note.title}</div>
                        <div className="text-xs text-slate-500 mt-1">{note.updatedAt}</div>
                        {activeNoteId === note.id&&(<div className={"absolute right-1 top-1/2 -translate-1/2"} onClick={()=>{
                            deleteNote(note.id)
                        }}>X</div>)}
                    </button>
                ))}
            </div>
        </aside>
    )
}