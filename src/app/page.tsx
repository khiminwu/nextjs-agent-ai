
"use client";
// import Image from "next/image";
// import api from "./utils/axios";
import { useEffect, useState,useRef } from 'react'

import Scene from '@/app/components/Ursa/Scene';
import About,{ AboutRef } from "@/app/components/About";
import Team,{ TeamRef } from "@/app/components/Team";
import Service, {ServiceRef} from "@/app/components/Service";
import Works,{WorksRef} from "@/app/components/Works";
import Contact,{ContactRef} from "@/app/components/Contact";



export default function Home() {
  // const [isLanding,setIsLanding] = useState(false);
  const [hash,setHash] = useState('');
  
  const aboutRef = useRef<AboutRef>(null);
  const teamRef = useRef<TeamRef>(null);
  const serviceRef = useRef<ServiceRef>(null);
  const worksRef = useRef<WorksRef>(null);
  const contactRef = useRef<ContactRef>(null);
  

  const aboutSection = useRef<HTMLDivElement>(null);
  const teamSection = useRef<HTMLDivElement>(null);
  const worksSection = useRef<HTMLDivElement>(null);
  const serviceSection = useRef<HTMLDivElement>(null);
  const contactSection = useRef<HTMLDivElement>(null);
  let lastScrollY = 0;

  useEffect(() => {
    
    // if (!scrollEl) return;

  

    // Cleanup
    // const scrollEl = scrollContainerRef.current;
// console.log(scrollEl,'scrollEl')
    const handleScroll = () => {

      const sections = [
    { id: "about", ref: aboutSection },
    { id: "service", ref: serviceSection },
    { id: "team", ref: teamSection },
    { id: "works", ref: worksSection },
    { id: "contact", ref: contactSection }
  ];

  const currentScrollY = window.scrollY;
  const direction = currentScrollY > lastScrollY ? "down" : "up";
  lastScrollY = currentScrollY;

  for (const section of sections) {
    const el = section.ref.current;
    if (!el) continue;
    
    const rect = el.getBoundingClientRect();

    const screenHeight = window.innerHeight;

    const downTrigger = (screenHeight * 2) / 3;       // 1/3 from top
    const upTrigger = screenHeight / 3;   // 2/3 from top (i.e. 1/3 from bottom)

    if (direction === "down") {
      // When scrolling down: top reaches top of window (± tolerance)
      if ( rect.top <= downTrigger && rect.bottom >= downTrigger && window.location.hash !== `#${section.id}`) {
        if (window.location.hash !== `#${section.id}`) {
          history.replaceState(null, "", `#${section.id}`);
          setHash(section.id);
        }
        break;
      }
    } else {
      // When scrolling up: bottom reaches top of window (± tolerance)
      if (
      rect.bottom >= upTrigger &&
      rect.top <= upTrigger &&
      window.location.hash !== `#${section.id}`
    ) {
        if (window.location.hash !== `#${section.id}`) {
          history.replaceState(null, "", `#${section.id}`);
          setHash(section.id);
        }
        break;
      }
    }
  }
      // console.log('aaaa')
      aboutRef.current?.onScroll();
      contactRef.current?.onScroll();
      worksRef.current?.onScroll();
      serviceRef.current?.onScroll();
      teamRef?.current?.onScroll();
    };

    const handleHashChange = () => {
    const currentHash = window.location.hash.replace(/^#/, '').toLowerCase();
      setHash(currentHash);
      setTimeout(()=>{
         const el = document.getElementById(currentHash);
        console.log(el,currentHash,'elelelel')
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      },2000)
     
    };


    window.addEventListener('hashchange', handleHashChange);
    handleHashChange()

    window.addEventListener('scroll', handleScroll);
    
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
    };

  },[])

  

  const clickExplore=()=>{
    // const event = createCustomEvent('exploreClicked', {});
    // window.dispatchEvent(event);
    // setIsLanding(false);
    window.location.hash = 'about';
  }

  




  return (
    <div className="w-full flex justify-center">
      {/* <p className="fixed">page : {hash}</p> */}
      <div className="fixed w-[100vw] h-[100%] top-0 left-0 overflow-hidden">
        <Scene hash={hash}/>
      </div>
    
        <div id="content" className="w-full">
          {hash=='' &&(
            <div className="fixed top-[50%] md:top-[40%] h-[45%] mt-2 w-full justify-between flex flex-col text-center p-6 fadein delay opacity-0">
              <h2 className="text-xl md:text-3xl opacity-60 tracking-widest mt-16">Your North Star in Digital Transformation</h2>
              {/* <a onClick={clickExplore} className={`text-sm md:text-lg cursor-pointer hover:opacity-50 mb-12 md:mb-4`}>EXPLORE</a> */}
            </div>
          )}
          {hash!='' && hash!='home' &&(
            <div id="content" className="w-full h-full">
              <div id="about" ref={aboutSection}>
                <About ref={aboutRef} />
              </div>
              <div ref={serviceSection}>
                <Service ref={serviceRef}/>
              </div>
               <div ref={worksSection}>
                <Works ref={serviceRef}/>
              </div>
              <div ref={teamSection}>
                <Team ref={teamRef}/>
              </div>
              <div ref={contactSection}>
                <Contact ref={contactRef}/>
              </div>
              
              
            </div>
          )}

          {/* <div ref={aboutSection} id="about" className='w-full h-[100vh] text-4xl justify-center mt-[5rem] flex uppercase border-b-2 border-white'>about</div> */}
          
          
          
          {hash!='' &&(
            <div className="text-xs bottom-12 opacity-60 fixed uppercase w-full text-center">Scroll to explore</div>
          )}
          
        </div>
      
    </div>
  );
}
