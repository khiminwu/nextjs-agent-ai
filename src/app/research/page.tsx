
"use client";
// import Image from "next/image";
import api from "../utils/axios";
import { useEffect, useState,useRef } from 'react'

import { useUserStore } from '../store/useUserStore'

type Message ={
  content: string;
  type: string;
}


export default function Research() {
   const { uid, setUid } = useUserStore()
  const [name, setName] = useState('')
  
  useEffect(() => {

  })



  return (
    <div className=" mx-auto p-6">
     
    </div>
  );
}
