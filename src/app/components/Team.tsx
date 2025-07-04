'use client';
import {  useState,useRef,forwardRef, useImperativeHandle } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export type TeamRef = {
  onScroll: () => void;
};

const names = ['Fajar', 'Rio', 'Nuggie', 'Khimin'];


const TeamComponent = forwardRef<TeamRef>((props, ref) => {
   const [opacities, setOpacities] = useState<number[]>(
    Array(names.length).fill(0)
  );
    
    const sectionRef = useRef<HTMLDivElement>(null);
    // const lastScrollY = useRef<number>(0); // for direction tracking
  

    
  useImperativeHandle(ref, () => ({
    onScroll() {
       const sectionEl = sectionRef.current;
      if (!sectionEl) return;
      
      const rect = sectionEl.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // const sectionHeight = rect.height;
      const sectionTop = rect.top+windowHeight;
      
      const scrollRatio = 1 - sectionTop / windowHeight;
      // const normalized = Math.max(0, Math.min(scrollRatio, 1)); // clamp 0–1

      const newOpacities = names.map((_, index) => {
        // Optional: stagger each card slightly
        const delay = index * 0.1;
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

        return fade;
      });

      setOpacities(newOpacities);

      if (newOpacities.every(op => op >= 1)) {
        
        console.log('🎯 All cards are fully visible');
        console.log('📍 ScrollY:', window.scrollY);
      }
    }
  }));
  
  

  return (
    <div  className="w-full relative z-[10] top-0 left-0 overflow-hidden relative"  ref={sectionRef}>
      <div className='pb-[180vh] w-full '>
        <div id="team" className='mt-[20vh]'></div>
        <div className='fixed bottom-24 md:bottom-12 w-full '>
          <div className='flex md:hidden h-[50vh]'>
            <Swiper slidesPerView={1}>
              <SwiperSlide className='px-6 h-full'>
                <div  className='w-full h-full bg-white/70 text-black px-6 py-4 transition-opacity duration-50 ease-in-out' style={{opacity: opacities[0]}}>
                  <p>Fajar</p>
                </div>
              </SwiperSlide>
              <SwiperSlide className='px-4'>
                <div className='w-full h-full bg-white/70 text-black px-6 py-4 transition-opacity duration-50 ease-in-out' style={{opacity: opacities[1]}}>
                  <p>Rio</p>
                </div>
              </SwiperSlide>
              <SwiperSlide className='px-4'>
                <div className='w-full h-full bg-white/70 text-black px-6 py-4 transition-opacity duration-50 ease-in-out' style={{opacity: opacities[2]}}>
                  <p>Nuggie</p>
                </div>
              </SwiperSlide>
              <SwiperSlide className='px-4'>
                <div className='w-full h-full bg-white/70 text-black px-6 py-4 transition-opacity duration-50 ease-in-out' style={{opacity: opacities[3]}}>
                  <p>Khimin</p>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        <div className='hidden md:grid grid-cols-2 md:grid-cols-4 gap-4 px-6 md:px-12 py-24'>
            <div  className='w-full h-[300px] bg-white/70 text-black px-6 py-4 transition-opacity duration-50 ease-in-out' style={{opacity: opacities[0]}}>
              <p>Fajar</p>
            </div>
            <div className='w-full h-[300px] bg-white/70 text-black px-6 py-4 transition-opacity duration-50 ease-in-out' style={{opacity: opacities[1]}}>
              <p>Rio</p>
            </div>
            <div className='w-full h-[300px] bg-white/70 text-black px-6 py-4 transition-opacity duration-50 ease-in-out' style={{opacity: opacities[2]}}>
              <p>Nuggie</p>
            </div>
            <div className='w-full h-[300px] bg-white/70 text-black px-6 py-4 transition-opacity duration-50 ease-in-out' style={{opacity: opacities[3]}}>
              <p>Khimin</p>
            </div>
         
        </div>
        </div>
     </div>
    </div>
  );
})

// ✅ Add this line to fix the ESLint warning
TeamComponent.displayName = "TeamComponent";

export default TeamComponent;