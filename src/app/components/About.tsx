'use client';
import { useEffect, useState,useRef } from 'react';

export default function Home() {
    const text = `We are more than just an agency.\nwe are your guiding star in the complex and\never-evolving digital landscape.\n\nwe believe in the power of innovation, creativity, \nand strategic thinking to drive meaningful results \nfor our clients.`;

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [visibleChars, setVisibleChars] = useState(-1);
    const chars = text.split('');
    const scrollThreshold = 5;

    const onChangePage = useRef(false);
    const totalHeight = text.length *  scrollThreshold *2;
    const lastHash = useRef<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    // const [deltaScroll,setDeltaScroll] = useState(0);
    // console.log(totalHeight,chars.length*5,'totalHeight')
  useEffect(() => {

    const scrollEl = scrollContainerRef.current;
    if (!scrollEl) return;


    const handleScroll = () => {
      if(onChangePage.current) return false;
      const scrollTop = scrollEl.scrollTop;
      const clientHeight = scrollEl.clientHeight;
      const scrollHeight = scrollEl.scrollHeight;

      const bottomReached = scrollTop >= scrollHeight - clientHeight - 10;
      
      
        
    //   console.log(onChangePage.current,'diff')
      setVisibleChars(Math.floor(scrollTop / scrollThreshold) - 1);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
          if (bottomReached && lastHash.current !== '#team') {
            window.location.hash = '#team';
            lastHash.current = '#team';
            onChangePage.current = true
            scrollEl.removeEventListener('scroll', handleScroll);
          }
        }, 100);
    };

    scrollEl.addEventListener('scroll', handleScroll);
    
    return () => scrollEl.removeEventListener('scroll', handleScroll);
  }, []);





  

  return (
    <div className="w-full h-full absolute z-[10] top-0 left-0 overflow-hidden">
      <div className="container mx-auto px-6 w-full h-full overflow-y-auto" ref={scrollContainerRef}>
        <div style={{height:`${totalHeight}px`}} className='flex z-10 relative'>

        </div>
        <div className="fixed bottom-16 py-12 fadein delay opacity-0 z-2">
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