'use client';
import { useEffect, useState,useRef } from 'react';

export default function Home() {
  const text = `We are more than just an agency.\nwe are your guiding star in the complex and\never-evolving digital landscape.\n\nwe believe in the power of innovation, creativity, \nand strategic thinking to drive meaningful results \nfor our clients.`;
const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const [visibleChars, setVisibleChars] = useState(-1);
    const chars = text.split('');
    const threshold = 50;
    const lastScrollY = useRef(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [deltaScroll,setDeltaScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY.current;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        setDeltaScroll(0);
      }, 2000);

      if (diff > 5) {
        // scroll down
        setVisibleChars((prev) => Math.min(prev + 1, text.length));
        setDeltaScroll((prev) => prev + 1);
      } else if (diff < -5) {
        // scroll up
        setVisibleChars((prev) => Math.max(prev - 1, -1));
        setDeltaScroll((prev) => Math.max(prev - 1, 0));
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  useEffect(() => {
    const maxScrollBeforeNext = text.length + threshold;
    console.log(visibleChars,deltaScroll,maxScrollBeforeNext)
    if (
      visibleChars >= text.length &&
      deltaScroll > maxScrollBeforeNext
    ) {
      
      window.location.hash = '#team'; // change hash
    }
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
        console.log(deltaScroll)
        setDeltaScroll(visibleChars);
      }, 2000); // 2 seconds

  }, [deltaScroll, visibleChars, text.length]);



  

  return (
    <div className="w-full h-full absolute z-[10] top-0 left-0">
      <div className="container mx-auto px-6">
        <div className='h-[1000vh]'>

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