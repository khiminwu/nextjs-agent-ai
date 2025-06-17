
"use client";
import Image from 'next/image'
import { useEffect } from 'react'
import { useUserStore } from '../store/useUserStore'
export default function Header() {
 
  
  const name = useUserStore((state) => state.name)
  const init = useUserStore((state) => state.init)
  useEffect(() => {
    init()
  }, [init])
  return (
    <div className="flex justify-between items-center mb-16 mx-6 my-6">
        <link href="/" className="flex items-center gap-2">
              <Image
                  src="/logo_ursa.svg"      // ✅ must be in /public folder
                  alt="Logo"
                  width={180}
                  height={30}
                />
        </link>
                {name && name!='' && (
                    <h3>Hi, {name}</h3>
                )}
            </div>
  );
}
