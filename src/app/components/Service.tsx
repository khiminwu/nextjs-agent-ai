
'use client';
import { useEffect, useState,useRef,forwardRef, useImperativeHandle } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export type ServiceRef = {
  onScroll: () => void;
};


const ServiceComponent = forwardRef<ServiceRef>((props, ref) => {
  
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
    <div  className=""  ref={sectionRef}>
      <div>
        <div id="service" className='mt-[100vh] pt-26'>
          <div className='container mx-auto px-6'>
            <p className='font-bold text-2xl '>We focused on web solution-whether it's brand building or work automation.</p>
            <div className='flex flex-col border-t mt-12'>
                <div className='flex flex-col md:flex-row gap-2 py-8 border-b border-white w-full'>
                    <div className='flex gap-2 items-start md:w-[45%]'>
                      <span className='text-sm pt-0.5'>01.</span>
                      <span className='text-xl font-semibold'>Branding & Identity</span>
                    </div>
                    <p className='md:w-[55%]'>We craft brand identities that make lasting impressions—from visuals to voice. Whether launching a new brand or refreshing an existing one, we help you tell your story clearly and consistently across every channel.</p>
                </div>
                <div className='flex flex-col md:flex-row gap-2 py-8 border-b border-white w-full'>
                    <div className='flex gap-2 items-start md:w-[45%]'>
                      <span className='text-sm pt-0.5'>02.</span>
                      <span className='text-xl font-semibold'>Web Design & Development</span>
                    </div>
                    <p className='md:w-[55%]'>We build websites that not only look good, but convert. From landing pages to custom web apps, every digital touchpoint is crafted for performance, accessibility, and engagement. We design and develop robust backend systems, apps, and APIs to scale your operations or product.</p>
                </div>
                <div className='flex flex-col md:flex-row gap-2 py-8 border-b border-white w-full'>
                    <div className='flex gap-2 items-start md:w-[45%]'>
                      <span className='text-sm pt-0.5'>03.</span>
                      <span className='text-xl font-semibold'>Marketing & Growth</span>
                    </div>
                    <p className='md:w-[55%]'>Our marketing strategies are built to grow your brand, increase leads, and boost sales—backed by data and tailored to your audience.</p>
                </div>
                <div className='flex flex-col md:flex-row gap-2 py-8 border-b border-white w-full'>
                    <div className='flex gap-2 items-start md:w-[45%]'>
                      <span className='text-sm pt-0.5'>04.</span>
                      <span className='text-xl font-semibold'>Performance & Analytics</span>
                    </div>
                    <p className='md:w-[55%]'>We help you set up analytics, track behavior, and measure marketing ROI—all through custom dashboards and automation.</p>
                </div>
                <div className='flex flex-col md:flex-row gap-2 py-8 border-b border-white w-full'>
                    <div className='flex gap-2 items-start md:w-[45%]'>
                      <span className='text-sm pt-0.5'>05.</span>
                      <span className='text-xl font-semibold'>Creative Content & Video Production</span>
                    </div>
                    <p className='md:w-[55%]'>We help your brand speak visually and emotionally through stunning content and video.</p>
                </div>
            </div>

            </div>
        </div>

     </div>
    </div>
  );
})



export default ServiceComponent;