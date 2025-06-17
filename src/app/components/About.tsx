'use client';
import { useEffect, useState,useRef } from 'react';

export default function Home() {
    const text = `We are more than just an agency.\nwe are your guiding star in the complex and\never-evolving digital landscape.\n\nwe believe in the power of innovation, creativity, \nand strategic thinking to drive meaningful results \nfor our clients.`;


    const [visibleChars, setVisibleChars] = useState(-1);
    const chars = text.split('');
    const scrollThreshold = 5;

    const lastScrollY = useRef(0);
    const onChangePage = useRef(false);
    const totalHeight = text.length *  scrollThreshold *2;

    // const [deltaScroll,setDeltaScroll] = useState(0);
    // console.log(totalHeight,chars.length*5,'totalHeight')
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      
      const windowHeight = window.innerHeight;
      
        
    //   console.log(onChangePage.current,'diff')
      if(currentY>(totalHeight-windowHeight)-10){
        if(onChangePage.current) return false;
        window.location.hash = '#team';
        onChangePage.current = true;
        window.removeEventListener('scroll', handleScroll);
      }

        setVisibleChars(Math.floor(currentY/scrollThreshold)-1)
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);





  

  return (
    <div className="w-full h-full absolute z-[10] top-0 left-0">
      <div className="container mx-auto px-6">
        <div style={{height:`${totalHeight}px`}}>

        </div>
        <div className="fixed bottom-16 py-12 fadein delay opacity-0">
            {/* <p>{visibleChars}</p> */}
            <div className="text-md md:text-xl lg:text-4xl whitespace-pre-wrap">
                {chars.map((char, i) => (
                    char === '\n' ? (
                    <br key={i} />
                    ) : (
                    <span
                        key={i}
                        className={`inline-block transition-opacity duration-300 ${
                        i <= visibleChars ? 'opacity-100' : 'opacity-15'
                        }`}
                    >
                        {char === ' ' ? '\u00A0' : char}
                    </span>
                    )
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}