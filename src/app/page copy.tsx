
"use client";
// import Image from "next/image";
import api from "./utils/axios";
import { useEffect, useState,useRef } from 'react'
// import SVGParticles from '@/components/SVGParticles';
import SVGParticles from './components/Particles';
import { useUserStore } from './store/useUserStore'

type Message ={
  content: string;
  type: string;
}


export default function Home() {
   const { uid, setUid } = useUserStore()
  const [name, setName] = useState('')
  
  useEffect(() => {
    
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    

    api.post('/7a589c20-b039-4b02-983a-a583edf51d96',{
      "question": "my name is "+name,
    })
    .then(res =>{
      console.log(res?.data?.sessionId)
      setUid(res?.data?.sessionId,name);
    }).catch((err) => {
      console.log(err)
    })
  };

  return (
    <div className="">
      <SVGParticles/>
      {uid=='' && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Welcome to Ursa</h1>
          <p className="mb-4">Tell me your name</p>
          <form onSubmit={handleSubmit} className="flex gap-0 w-full bg-gray-200 px-4 py-4">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="grow px-4 text-black"/>
            <button type="submit" className="bg-black text-white rounded-full h-8 w-8 items-center justify-center flex cursor-pointer hover:bg-gray-600">&#8627;</button>
          </form>
          
        </div>
      )}

      {uid && uid!='' && (
         <div className="flex flex-col gap-2">
          <strong>What would you like to do?</strong>
          <a href="/research">Research</a>
          <a href="">Strategy</a>
          <a href="/chat">Chat</a>
        </div>
      )}
    </div>
  );
}
