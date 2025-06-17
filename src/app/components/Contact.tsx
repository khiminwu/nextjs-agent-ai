'use client';
import { useEffect, useState,useRef } from 'react';

export default function Contact() {
    
    const [visibleChars, setVisibleChars] = useState(-1);
    
    const scrollThreshold = 5;

    const lastScrollY = useRef(0);
    const onChangePage = useRef(false);
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
       if (topReached && lastHash.current !== '#works') {
          window.location.hash = '#works';
          lastHash.current = '#works';
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
            <p>Contact content</p>
        </div>
      </div>
    </div>
  );
}