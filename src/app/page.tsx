
"use client";
// import Image from "next/image";
import api from "./utils/axios";
import { useEffect, useState,useRef } from 'react'
import { createCustomEvent } from '@/app/utils/createCustomEvent';
import Scene from '@/app/components/Ursa/Scene';
import About from "@/app/components/About";

type Message ={
  content: string;
  type: string;
}


export default function Home() {
  const [isLanding,setIsLanding] = useState(false);
  const [hash,setHash] = useState('');
  useEffect(() => {
    window.addEventListener('onPageChangeFinished', (e) => {
      
      handleHashChange()
      // Trigger your explode animation or navigation
    });

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange()

    // Cleanup
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };

  },[])

  const handleHashChange = () => {
    const currentHash = window.location.hash.replace(/^#/, '').toLowerCase();
    
    if(!currentHash || currentHash==''){
      setIsLanding(true)
      
    }
      setHash(currentHash)  
  };


  const clickExplore=()=>{
    // const event = createCustomEvent('exploreClicked', {});
    // window.dispatchEvent(event);
    setIsLanding(false);
    window.location.hash = 'about';
  }


  return (
    <div className="flex justify-center">
      <p className="fixed">page : {hash}</p>
      <div className="fixed w-[100vw] h-[100vh] top-0 left-0">
        <Scene/>
      </div>
      {hash=='' ? (
        <div className="w-[100vw] h-[100vh] absolute z-[10] top-0 left-0">
          <div className="absolute top-[50%] w-full justify-center flex flex-col text-center p-6 fadein delay opacity-0">
            <h2 className="text-sm md:text-3xl font-bold mt-24">Your North Star in Digital Transformation</h2>
            <a onClick={clickExplore} className={`text-sm md:text-lg cursor-pointer hover:opacity-50 mt-6`}>EXPLORE</a>
          </div>
        </div>
      ):(
        <div className="flex justify-center">
          
          {hash=='about' &&(
            <About/>
          )}
          <div className="text-xs bottom-12 opacity-60 absolute uppercase">Scroll to explore</div>
        </div>
      )}
    </div>
  );
}
