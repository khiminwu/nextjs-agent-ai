
"use client";
// import Image from "next/image";
import api from "../utils/axios";
import { useEffect, useState,useRef } from 'react'
import ReactMarkdown from 'react-markdown';
import rehypeRaw from "rehype-raw";
import { useUserStore } from "../store/useUserStore";

type Message ={
  content: string;
  type: string;
}


export default function Chat() {
  const [message, setMessage] = useState<Message[]>([])
  const name = useUserStore((state) => state.name)
  const uid = useUserStore((state) => state.uid)
  
  const [prompt, setPrompt] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {

    const msgs: string = localStorage.getItem("messages") || "";


    if(msgs){
      const data:Message[] = JSON.parse(msgs);
      // console.log(JSON.parse(msgs))
      setMessage(data||[])
    }
    
  }, []);

  const loadData = async ()=>{
    setThinking(true);
    setPrompt('')
    const trimmed = prompt.trim();
    setMsg([{content:trimmed,type:'human'}])
    
    // const formData = new FormData();
    // formData.append("session_id", uid);
    // formData.append("prompt", trimmed);
    const formData = {
      chatId: uid,
      question: trimmed,
      streaming: false,
    }

    api.post('/7a589c20-b039-4b02-983a-a583edf51d96',formData)
    .then(res =>{
      console.log(res?.data)
      setMessage(res?.data?.text || [])
      setMsg([{
        content:trimmed || '',
        type:'human'
      },{
        content:res?.data?.text || '',
        type:'ai'
      }])
      setThinking(false);
    }).catch((err) => {
      console.log(err)
      setThinking(false);
    })
  }

  const setMsg = (data:Message[])=>{
    // const new_msg:any = {
    //   content:data?.content,
    //   type:data?.type
    // }
    // console.log(message,'message')
    const new_msg:Message[] = [...message,...data];
    // new_msg.push(data);
    // console.log(new_msg,data,'new_msg')
    setMessage(new_msg)
    localStorage.setItem("messages", JSON.stringify(new_msg));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
    console.log("Submitted name:", prompt);
    // setSubmitted(true);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]); 

  return (
    <div className="container mx-auto h-full overflow-hidden px-4">
      <div className="overflow-y-auto h-[calc(100%-140px)] my-6 p-6 bg-gray-200 rounded-2xl text-gray-500">
      {/* <p>{uid}</p> */}
        {!thinking && message.length==0 && (
          <>
            <p className="text-lg text-black">Hi, {name}</p>
            <p>How can I help you today?</p>
          </>
        )}

        <div className="relative flex flex-col h-auto mb-8 gap-8">
          {message && (message||[]).map((item,key)=>(
            <div key={key} className={`flex ${item?.type=='human'?'justify-end':''}`}>
              <div className={`${item?.type=='human'?'bg-black text-white px-4 py-1 flex rounded-full':''}`}>
              <ReactMarkdown rehypePlugins={[rehypeRaw]} >{item?.content}</ReactMarkdown>
                {/* <p dangerouslySetInnerHTML={{ __html: item?.content }}></p> */}
              </div>
            </div>
          ))}
        </div>
        
        {thinking && (
          <p className="text-3xl inline-flex items-center animate-pulse gap-2 relative">🤔 <span className="text-xs absolute left-[100%] -top-3 bg-black text-white px-2 py-1 rounded-full text-nowrap">. . .</span></p>
        )} 
        <div ref={bottomRef} />
      </div>
      <div className="flex pb-4">
        <div className="w-full">
          <form onSubmit={handleSubmit} className="flex gap-0 w-full bg-gray-200 px-4 py-4">
            <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Anything..." className="grow px-4 text-black"/>
            <button type="submit" className="bg-black text-white rounded-full h-8 w-8 items-center justify-center flex cursor-pointer hover:bg-gray-600">&#8627;</button>
            </form>
        </div>
      </div>
    </div>
  );
}
