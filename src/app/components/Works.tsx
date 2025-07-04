'use client';
import { useEffect, useState,useRef,forwardRef, useImperativeHandle } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import CurvedText from './CurveText';
import 'swiper/css';

export type WorksRef = {
  onScroll: () => void;
};


const WorksComponent = forwardRef<WorksRef>((props, ref) => {
  
    const sectionRef = useRef<HTMLDivElement>(null);
    const [positions, setPositions] = useState<{ top: number; left: number }[]>([]);
    const [opacity, setOpacity] = useState(0);
    
    const [works,setWorks] = useState([
      {title:'work 1',id:1},
      {title:'Lorem Ipsum',id:2},
      {title:'Seketiket',id:3},
      {title:'work 2',id:4},
      {title:'work 3',id:5}
    ])
     
    useEffect(() => {
      const padding = 20;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight/2;

      const rows = 2;
      const cols = 3;
      const cellWidth = (screenWidth - padding * 2) / cols;
      const cellHeight = (screenHeight - 50 * 2) / rows;

      const usedCells = new Set<number>();

      const getRandomCell = () => {
        let index = Math.floor(Math.random() * (rows * cols));
        while (usedCells.has(index)) {
          index = Math.floor(Math.random() * (rows * cols));
        }
        usedCells.add(index);
        return index;
      };

      const generated = works.map(() => {
        const cellIndex = getRandomCell();
        const row = Math.floor(cellIndex / cols);
        const col = cellIndex % cols;

        const jitterX = Math.random() * (cellWidth - 50);
        const jitterY = Math.random() * (cellHeight - 50);

        return {
          top: padding + row * cellHeight + jitterY,
          left: padding + col * cellWidth + jitterX,
        };
      });

      setPositions(generated);
    }, []);

    const delay = ()=>{
      return `${Math.random() * 2}s`;
    }
    
  useImperativeHandle(ref, () => ({
    onScroll() {
       const sectionEl = sectionRef.current;
      if (!sectionEl) return;
      
      const rect = sectionEl.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // const sectionHeight = rect.height;
      const sectionTop = rect.top+windowHeight;
      
      const scrollRatio = 1 - sectionTop / windowHeight;

      const delay = 0;
      let fade = 0;

      if (scrollRatio <= 1) {
        // Fade in phase
        const ratio = Math.max(0, Math.min((scrollRatio - delay) / 0.5, 1));
        fade = ratio;
      } else {
        // Fade out phase
        const fadeOutRatio = 1 - Math.min((scrollRatio - 1 - delay) / 0.5, 1);
        fade = Math.max(0, fadeOutRatio);
      }
      setOpacity(fade)
      // console.log(fade,'fadefade')
      // const normalized = Math.max(0, Math.min(scrollRatio, 1)); // clamp 0–1
      // console.log('scroll Ratio',scrollRatio)
    }
  }));
  
  

  return (
    <div  className="w-full relative z-[99] top-0 left-0 overflow-hidden relative"  ref={sectionRef}>
      <div className='w-full pb-[50vh]'>
        <div id="works" className='mt-[50vh] mb-[100vh]'></div>
        <div className='fixed z-[99] left-0 bottom-0 md:bottom-12 w-full   inset-0 pointer-events-none' style={{opacity:opacity}}>
        <div className='absolute w-[100vw] h-[50vh] bg-white/0 bottom-24'>
        
          {works.map((item,key)=>
            <div
              key={key}
              className="absolute pointer-events-auto text-white cursor-pointer group hover:scale-100 scale-30 transition-all duration-300"
              style={{
                top: positions[key]?.top ?? 0,
                left: positions[key]?.left ?? 0,
              }}
            >
              <div className='absolute top-0  left-0 top-[20%] left-[50%] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 opacity-0 group-hover:opacity-100'><CurvedText text={item.title.toUpperCase()}/></div>
              <div className='w-[70px] h-[70px] bg-white rounded-full transition-all twinkle' style={{ animationDelay: delay() }}></div>
            </div>
          )}
          </div>
        </div>
     </div>
    </div>
  );
})



export default WorksComponent;
