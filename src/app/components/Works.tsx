'use client';
import { useEffect, useRef } from 'react';

export default function Works() {
    
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const onChangePage = useRef(false);
    const totalHeight =1000;
    const lastHash = useRef<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    
  useEffect(() => {
    
    

    const scrollEl = scrollContainerRef.current;
    if (!scrollEl) return;
    scrollEl.scrollTo(0, 20);

    const handleScroll = () => {
      if(onChangePage.current) return false;
      const scrollTop = scrollEl.scrollTop;
      const clientHeight = scrollEl.clientHeight;
      const scrollHeight = scrollEl.scrollHeight;

      const bottomReached = scrollTop >= scrollHeight - clientHeight - 10;
      const topReached = scrollTop <= 10;
      
        
    //   console.log(onChangePage.current,'diff')
      

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {

          if (bottomReached && lastHash.current !== '#contact') {
            window.location.hash = '#contact';
            lastHash.current = '#contact';
            onChangePage.current = true
            scrollEl.removeEventListener('scroll', handleScroll);
          } else if (topReached && lastHash.current !== '#service') {
            window.location.hash = '#service';
            lastHash.current = '#service';
            onChangePage.current = true
            scrollEl.removeEventListener('scroll', handleScroll);
          }
        }, 100);
    };

    scrollEl.addEventListener('scroll', handleScroll);
    
    return () => scrollEl.removeEventListener('scroll', handleScroll);
  }, []);





  

  return (
    <div className="w-full h-full absolute z-[10] top-0 left-0">
      <div className="container mx-auto px-6 w-full h-full overflow-y-auto" ref={scrollContainerRef}>
        <div style={{height:`${totalHeight}px`}}>

        </div>
        <div className="fixed bottom-16 py-12 fadein delay opacity-0">
            {/* <p>{visibleChars}</p> */}
            <p>Works content</p>
        </div>
      </div>
    </div>
  );
}