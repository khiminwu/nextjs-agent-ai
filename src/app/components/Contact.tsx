'use client';
import { useEffect, useState,useRef,forwardRef, useImperativeHandle } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export type ContactRef = {
  onScroll: () => void;
};


const ContactComponent = forwardRef<ContactRef>((props, ref) => {
  
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
      // console.log('scroll Ratio',scrollRatio)
    }
  }));
  
  

  return (
    <div  className="w-full relative z-[10] top-0 left-0 overflow-hidden relative"  ref={sectionRef}>
      <div className='w-full mb-[100vh]'>
        <div id="service" className='mt-[100vh]'></div>
        <div className='absolute bottom-24 md:bottom-12 w-full'>
          <div className='container mx-auto px-6 py-12'>
            <h1 className='text-2xl font-bold'>
              <span className='text-xl font-normal'>e. </span>voyager@ursamajor.id</h1>
            <h1 className='text-2xl font-bold'>
              <span className='text-xl font-normal'>p. </span>
              +62 811 933 8600</h1>
            <h1 className='text-2xl font-bold'>
              <span className='text-xl font-normal'>p. </span>
              +62 811 933 8600</h1>
          </div>
        </div>
     </div>
    </div>
  );
})



export default ContactComponent;
