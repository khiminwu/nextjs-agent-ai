'use client';
import { useEffect, useState,useRef } from 'react';

export default function Home() {
  const text = `We are more than just an agency.\nwe are your guiding star in the complex and\never-evolving digital landscape.\n\nwe believe in the power of innovation, creativity, \nand strategic thinking to drive meaningful results \nfor our clients.`;
const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const [visibleChars, setVisibleChars] = useState(-1);
    const chars = text.split('');
    const threshold = 50;
    const hasNavigated = useRef(false);
    
    const [deltaScroll,setDeltaScroll] = useState(0);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      const delta = e.deltaY;
        
      // Clear the previous timeout on new scroll
      

    // Set a new timeout to reset deltaScroll after 2 seconds of inactivity
      
      if (delta > 0) {
        // let prev = visibleChars;
        setVisibleChars((prev) => Math.min(prev + 1, text.length));
        // setDeltaScroll(1);
        setDeltaScroll((prev) => prev+1);
        // console.log(visibleChars,'scroll')
        
      } else {
        
        setDeltaScroll((prev) => Math.max(prev - 1, 0));
        setVisibleChars((prev) => Math.max(prev - 1, -1));
      }

       
    };

    window.addEventListener('wheel', handleScroll);
    return () => window.removeEventListener('wheel', handleScroll);
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
//   useEffect(()=>{
//       console.log('scroll');
//      if(visibleChars>=text.length){
//         deltaScroll +=1;
//         console.log('scroll',deltaScroll,visibleChars,text.length)
//         // window.location.hash = 'service';
//       }
//   },[visibleChars])



  

  return (
    <div className="w-full h-full absolute z-[10] top-0 left-0">
      <div className="container mx-auto px-6">
        <div className="absolute bottom-16 py-12 text-lg md:text-2xl lg:text-4xl fadein delay opacity-0">
            {/* <p>{visibleChars}</p> */}
            <div className="text-lg md:text-2xl lg:text-4xl whitespace-pre-wrap">
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