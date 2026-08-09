import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const manRef = useRef(null);
  const womanRef = useRef(null);
  const dressRef = useRef(null);
  const armRef = useRef(null);
  const heartRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    gsap.to("#hero-content", {
      y: -150,
      opacity: 0,
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: storyRef.current,
        start: "center center",
        end: "+=2500",
        pin: true,
        scrub: 1,
      }
    });

    tl.to(manRef.current, { rotation: -5, transformOrigin: "bottom center", duration: 1 })
      .to(womanRef.current, { rotation: 10, transformOrigin: "bottom center", duration: 1 }, "<")
      .to(womanRef.current, { rotation: 360, transformOrigin: "center center", duration: 3 })
      .to(dressRef.current, { attr: { d: "M160 210 C130 250, 90 320, 45 340 H355 C310 320, 270 250, 240 210 Z" }, duration: 3 }, "<")
      .to(womanRef.current, { rotation: 22, x: 20, y: -10, duration: 1.5 })
      .to(armRef.current, { attr: { d: "M200 140 Q 240 90, 280 55" }, duration: 1.5 }, "<")
      .to(heartRef.current, { opacity: 1, scale: 1.3, duration: 1 }, "-=0.5");

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="bg-[#FAFAFA] text-[#2F3E36] font-sans antialiased overflow-x-hidden selection:bg-[#B86F7D] selection:text-white">
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-[radial-gradient(circle,_#FAF9F6_0%,_#F3F3E9_100%)]" />

      {/* HERO SECTION */}
      <section ref={heroRef} className="relative h-screen w-full flex flex-col items-center justify-center text-center bg-[url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40 z-0" />
        <div id="hero-content" className="relative z-10 text-white px-4">
          <p className="text-xs md:text-sm tracking-[0.3em] uppercase mb-4 opacity-90 font-light">
            Приглашение на свадьбу
          </p>
          <h1 className="font-serif text-6xl md:text-8xl font-light tracking-wider leading-tight mb-2">
            Сергей
          </h1>
          <div className="font-serif italic text-[#B86F7D] text-5xl md:text-7xl my-2">&amp;</div>
          <h1 className="font-serif text-6xl md:text-8xl font-light tracking-wider leading-tight">
            Юлия
          </h1>
          <p className="text-lg md:text-xl tracking-[0.2em] mt-10 font-light border-t border-white/30 pt-6 inline-block">
            21 СЕНТЯБРЯ 2027
          </p>
        </div>
      </section>

      {/* STORY SECTION (WALTZ ANIMATION) */}
      <section ref={storyRef} className="relative w-full h-screen flex items-center justify-between px-[6vw]">
        <div className="w-[42%] z-10">
          <h2 className="font-serif text-4xl md:text-6xl text-[#B86F7D] mb-6">Наша история</h2>
          <p className="font-light leading-relaxed text-gray-700 text-lg mb-6">
            В этот особенный день наши пути сплетаются в единый танец. Каждый шаг, каждый взгляд и каждое мгновение ведут нас к началу общей семейной истории.
          </p>
          <p className="font-light leading-relaxed text-gray-600">
            Прокручивайте страницу вниз, чтобы увидеть, как оживает наш вальс.
          </p>
        </div>

        <div className="w-[48%] h-[75vh] relative flex items-center justify-center bg-white/40 backdrop-blur-md rounded-3xl border border-[#B86F7D]/20 shadow-xl overflow-hidden">
          <svg viewBox="0 0 400 400" className="w-full h-full max-w-sm text-[#B86F7D] overflow-visible">
            <g ref={manRef} transform="translate(180, 200)">
              <path d="M-5 10 L-15 90 H-28 L-12 20 Z" fill="currentColor" opacity="0.75" />
              <path d="M-10 0 C-10 -15, 0 -22, 6 -22 C12 -22, 18 -15, 18 0 L12 65 H-10 Z" fill="currentColor" />
              <circle cx="4" cy="-30" r="10" fill="currentColor" />
              <path d="M12 25 L45 42 L35 52 L8 30 Z" fill="currentColor" />
            </g>

            <g ref={womanRef} style={{ transformOrigin: '190px 200px' }}>
              <path ref={dressRef} d="M175 210 C155 250, 135 310, 100 330 H270 C235 310, 215 250, 195 210 Z" fill="currentColor" opacity="0.85" />
              <path d="M185 130 C185 115, 190 110, 196 110 C202 110, 207 115, 207 130 L204 210 H188 Z" fill="currentColor" />
              <circle cx="196" cy="98" r="10" fill="currentColor" />
              <path ref={armRef} d="M200 140 Q 235 110, 255 85" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
            </g>

            <path ref={heartRef} d="M 200,110 C 200,95 170,85 170,100 C 170,115 200,135 200,145 C 200,135 230,115 230,100 C 230,85 200,95 200,110 Z" fill="currentColor" opacity="0" style={{ transformOrigin: '200px 110px' }} />
          </svg>
        </div>
      </section>

      {/* DETAILS SECTION */}
      <section className="relative py-28 px-6 max-w-4xl mx-auto z-10">
        <div className="bg-white/80 backdrop-blur-xl p-10 md:p-14 rounded-3xl shadow-sm text-center border border-gray-100">
          <h2 className="font-serif text-4xl md:text-5xl text-[#2F3E36] mb-6">Детали торжества</h2>
          <p className="font-serif text-3xl text-[#B86F7D] mb-3">Усадьба Братцево</p>
          <p className="font-light text-gray-500 uppercase tracking-widest text-sm mb-6 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-[#B86F7D]" /> Сбор гостей в 15:30
          </p>
          <p className="font-light text-gray-600 mb-10 max-w-xl mx-auto">
            Мы с нетерпением ждем возможности отпраздновать этот день в кругу самых близких людей.
          </p>
          
          <div className="w-full h-96 bg-gray-200 rounded-2xl overflow-hidden shadow-inner border border-gray-200">
            <iframe src="https://yandex.ru/map-widget/v1/-/CTS1A2LP" width="100%" height="100%" frameBorder="0" allowFullScreen={true} style={{ border: 'none' }} title="Map" />
          </div>
        </div>
      </section>

      {/* RSVP SECTION */}
      <section className="relative py-32 px-6 text-center bg-white/60 backdrop-blur-md border-t border-[#B86F7D]/10 z-10">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl text-[#B86F7D] mb-6">Присутствие</h2>
          <p className="font-light mb-10 text-gray-700">
            Пожалуйста, подтвердите ваше присутствие, написав нам в Telegram. Будем счастливы разделить этот праздник с вами!
          </p>
          <a href="https://t.me/sergey_nstrk" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-[#B86F7D] text-white px-10 py-4 rounded-full font-light tracking-widest hover:bg-[#a35e6c] transition-colors shadow-lg">
            ПОДТВЕРДИТЬ В TELEGRAM <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}