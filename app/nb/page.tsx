'use client'
import Tiptap from "@/components/Tiptap";
import {useEffect, useState} from "react";

export default function NB(){
    const [content,setContent] = useState("");
    useEffect(()=>{
        console.log(content);
    },[content]);
    return <Tiptap value={content} onChange={setContent}></Tiptap>
}