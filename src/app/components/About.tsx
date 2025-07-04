'use client';
import {  useState,useRef,forwardRef, useImperativeHandle } from 'react';
// import { useRouter } from "next/navigation";


export type AboutRef = {
  onScroll: () => void;
};



const AboutComponent = forwardRef<AboutRef>((props, ref) => {
// const router = useRouter();
  const text = `We are more than just an agency.\nwe are your guiding star in the complex and\never-evolving digital landscape.\n\nwe believe in the power of innovation, creativity, \nand strategic thinking to drive meaningful results \nfor our clients.`;

    const [opacity, setOpacity] = useState(1);
    const [visibleChars, setVisibleChars] = useState(-1);
    const chars = text.split('');
    const scrollThreshold = 5;
    const thresholdPosition = 50
    const sectionRef = useRef<HTMLDivElement>(null);
    const totalHeight = (chars.length*scrollThreshold)+thresholdPosition+window.innerHeight

    // const onChangePage = useRef(false);
    // const totalHeight = text.length *  scrollThreshold *2;
    // const lastHash = useRef<string | null>(null);
    // const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    // console.log(totalHeight,'totalHeight')
    
  useImperativeHandle(ref, () => ({
    onScroll() {
      if (!sectionRef.current) return;

      // const rect = sectionRef.current.getBoundingClientRect();
      // const hasReachedBottom = rect.bottom <= window.innerHeight;

      const scrollTop = window.scrollY;
      const visibleChars = Math.floor(scrollTop / scrollThreshold) - 1
      // console.log('hasReachedBottom : ',hasReachedBottom,'--',scrollTop)
      setVisibleChars(visibleChars);
      
      // if(visibleChars>chars.length+thresholdPosition){
        const diffOpacity =visibleChars - (chars.length+thresholdPosition)
        const opa = 1-(diffOpacity/100)
        setOpacity(opa)
        // console.log(opa,'opa')
    
      
    }
  }));
  
    // const [deltaScroll,setDeltaScroll] = useState(0);
    // console.log(totalHeight,chars.length*5,'totalHeight')
  // useEffect(() => {

  //   const scrollEl = scrollContainerRef.current;
  //   if (!scrollEl) return;


  //   const handleScroll = () => {
  //     if(onChangePage.current) return false;
  //     const scrollTop = scrollEl.scrollTop;
  //     const clientHeight = scrollEl.clientHeight;
  //     const scrollHeight = scrollEl.scrollHeight;

  //     const bottomReached = scrollTop >= scrollHeight - clientHeight - 10;
      
      
        
  //   //   console.log(onChangePage.current,'diff')
  //     setVisibleChars(Math.floor(scrollTop / scrollThreshold) - 1);

  //     if (timeoutRef.current) clearTimeout(timeoutRef.current);

  //       timeoutRef.current = setTimeout(() => {
  //         if (bottomReached && lastHash.current !== '#team') {
  //           window.location.hash = '#team';
  //           lastHash.current = '#team';
  //           onChangePage.current = true
  //           scrollEl.removeEventListener('scroll', handleScroll);
  //         }
  //       }, 100);
  //   };

  //   scrollEl.addEventListener('scroll', handleScroll);
    
  //   return () => scrollEl.removeEventListener('scroll', handleScroll);
  // }, []);


  

  return (
    <div className="w-full relative z-[10] top-0 left-0 overflow-hidden" style={{height:totalHeight}} ref={sectionRef}>
      <div className="w-full h-full" >
        {/* <div style={{height:`${totalHeight}px`}} className='flex z-10 relative'>

        </div> */}
        <div className="fixed bottom-16 py-12 fadein delay opacity-0 z-2">
            {/* <p>{visibleChars}</p> */}
            <div className={`text-md md:text-xl lg:text-4xl whitespace-pre-wrap px-4 md:px-16`} style={{opacity: opacity}}>
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
})

// ✅ Add this line to fix the ESLint warning
AboutComponent.displayName = "AboutComponent";

export default AboutComponent;