"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLImageElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const textClipTargetRef = useRef<HTMLDivElement>(null);
  const introTextRef = useRef<HTMLDivElement>(null);

  const statsBoxes = [
    { id: 1, value: "58%", text: "Increase in pick up point use", bg: "bg-[#def54f]", color: "text-black", twpos: "top-[10%] right-[30%]" },
    { id: 2, value: "23%", text: "Decrease in customer phone calls", bg: "bg-[#6ac9ff]", color: "text-black", twpos: "bottom-[10%] right-[35%]" },
    { id: 3, value: "27%", text: "Increase in pick up point use", bg: "bg-[#333333]", color: "text-white", twpos: "top-[10%] right-[10%]" },
    { id: 4, value: "40%", text: "Decrease in customer phone calls", bg: "bg-[#fa7328]", color: "text-black", twpos: "bottom-[10%] right-[12.5%]" },
  ];

  useGSAP(
    () => {
      // Intro timeline
      const tlIntro = gsap.timeline();
      
      tlIntro.fromTo(trackRef.current, { opacity: 0 }, { opacity: 1, duration: 1.5, ease: "power2.inOut" })
             .fromTo(introTextRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "back.out(1.7)" }, "-=0.5")
             .fromTo(carRef.current, { x: -300 }, { x: 0, duration: 1.5, ease: "power3.out" }, "-=1");

      const carWidth = 250;
      const roadWidth = window.innerWidth;
      const endX = roadWidth - carWidth;

      // Scroll bound animations
      const tlScroll = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1, // Smooth scrub
        },
      });

      // Move the car
      tlScroll.to(carRef.current, {
        x: endX,
        ease: "none",
        duration: 10,
      }, 0);

      // Expand the trail behind it
      tlScroll.to(trailRef.current, {
        width: `${endX + carWidth / 2}px`,
        ease: "none",
        duration: 10,
      }, 0);

      // Reveal text clipping mask
      tlScroll.fromTo(textClipTargetRef.current, {
        clipPath: "inset(0 100% 0 0)"
      }, {
        clipPath: "inset(0 0% 0 0)",
        ease: "none",
        duration: 10,
      }, 0);

      // Stats boxes fade in based on total duration of the scroll
      // Using positions on a 0-10 duration scale
      statsBoxes.forEach((box, i) => {
        const appearTime = 2 + (i * 2); // 2, 4, 6, 8
        tlScroll.fromTo(`.box-${box.id}`, 
          { opacity: 0, y: 20 }, 
          { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, 
          appearTime
        );
      });

    },
    { scope: containerRef }
  );

  return (
    <main ref={containerRef} className="relative h-[300vh] bg-[#0d0d0d]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#18181A]" ref={trackRef} style={{ opacity: 0 }}>
        
        {/* Intro Top Heading */}
        <div ref={introTextRef} className="absolute top-[5%] w-full text-center text-zinc-400 font-light tracking-[0.3em] uppercase text-sm">
          Scroll to explore
        </div>

        {/* Road and Car Container */}
        <div className="w-full h-[200px] bg-[#121212] relative overflow-hidden flex items-center shadow-2xl border-y border-zinc-800">
          
          {/* Base Unlit Text */}
          <div className="absolute top-1/2 -translate-y-1/2 left-[5%] text-[6rem] md:text-[8rem] font-bold text-zinc-800 tracking-wider flex z-0 z-0 select-none opacity-50 whitespace-nowrap">
            W E L C O M E&nbsp;&nbsp;&nbsp;I T Z F I Z Z
          </div>

          {/* Glowing Lit Text (Clipped) */}
          <div 
            ref={textClipTargetRef} 
            className="absolute top-1/2 -translate-y-1/2 left-[5%] text-[6rem] md:text-[8rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-wider flex z-20 select-none whitespace-nowrap drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"
            style={{ clipPath: "inset(0 100% 0 0)" }}
          >
            W E L C O M E&nbsp;&nbsp;&nbsp;I T Z F I Z Z
          </div>

          {/* The Trail */}
          <div 
            ref={trailRef}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#06b6d4]/20 to-[#3b82f6]/40 backdrop-blur-sm z-10 w-0 border-r-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)]"
          ></div>
          
          {/* The Car */}
          {/* Using a standard img tag because next/image transforms can sometimes conflict with GSAP transforms unless configured carefully */}
          <img
            ref={carRef}
            src="/car_transparent.png"
            alt="car"
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[150px] w-auto lg:h-[180px] z-30 drop-shadow-2xl object-contain"
          />
        </div>

        {/* Stats Boxes */}
        {statsBoxes.map((box) => (
          <div 
            key={box.id} 
            className={`box-${box.id} absolute ${box.twpos} ${box.bg} ${box.color} p-6 rounded-2xl shadow-xl z-40 max-w-[250px] opacity-0 flex flex-col gap-2 transform-gpu hover:scale-105 transition-transform`}
          >
            <span className="text-4xl lg:text-5xl font-extrabold tracking-tight">{box.value}</span>
            <span className="text-sm lg:text-[15px] font-medium leading-tight opacity-90">{box.text}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
