'use client';
import { useEffect, useState,useRef } from 'react';

export default function Team() {
    
    
    
    
    const totalHeight =1000;
    const lastHash = useRef<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    // const [deltaScroll,setDeltaScroll] = useState(0);
    // console.log(totalHeight,chars.length*5,'totalHeight')
    const handleScroll = () => {
      const currentY = window.scrollY;
      
      const windowHeight = window.innerHeight;
      const bottomReached = currentY >= totalHeight - windowHeight - 10;
      const topReached = currentY <= 5;
      
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      console.log(currentY,'diff')
      timeoutRef.current = setTimeout(() => {
        if (bottomReached && lastHash.current !== '#service') {
          window.location.hash = '#service';
          lastHash.current = '#service';
          window.removeEventListener('scroll', handleScroll);
        } else if (topReached && lastHash.current !== '#about') {
          window.location.hash = '#about';
          lastHash.current = '#about';
          window.removeEventListener('scroll', handleScroll);
        }
      }, 100); // short delay to ensure stability

        // setVisibleChars(Math.floor(currentY/scrollThreshold)-1)
      // lastScrollY.current = currentY;
    };

    
  useEffect(() => {
    window.scrollTo(0, 20);
    

    const delayId = setTimeout(() => {
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // panggil langsung untuk inisialisasi jika perlu
    }, 2000); // <-- ubah delay di sini (dalam ms)

    return () => {
      clearTimeout(delayId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);





  

  return (
    <div className="w-full h-full absolute z-[10] top-0 left-0">
      <div className="container mx-auto px-6">
        <div style={{height:`${totalHeight}px`}}>

        </div>
        <div className="fixed bottom-16 py-12 fadein delay opacity-0">
            {/* <p>{visibleChars}</p> */}
            <p>Team content</p>
        </div>
      </div>
    </div>
  );
}