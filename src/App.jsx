import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, ArrowRight, Heart, MapPin, Calendar } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const heroRef = useRef(null);
  const heroContentRef = useRef(null);
  const manifestoRef = useRef(null);
  const galleryRef = useRef(null);
  const detailsRef = useRef(null);
  const rsvpRef = useRef(null);

  useEffect(() => {
    // 1. Инициализация инерционного плавного скролла Lenis
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // 2. Кинематографичный параллакс и зум главного экрана
    gsap.to(heroContentRef.current, {
      y: -120,
      opacity: 0,
      scale: 0.95,
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });

    // 3. Staggered Text Reveal для Манифеста
    const manifestoElements = manifestoRef.current.querySelectorAll('.reveal-text');
    manifestoElements.forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // 4. Image Reveal с масками для галереи
    const galleryImages = galleryRef.current.querySelectorAll('.gallery-item');
    galleryImages.forEach((img) => {
      gsap.fromTo(img,
        { opacity: 0, scale: 0.9, y: 60 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: img,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // 5. Появление блока деталей торжества
    gsap.fromTo(detailsRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: detailsRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // 6. Финальное свечение и появление RSVP
    gsap.fromTo(rsvpRef.current,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: rsvpRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="bg-[#1A1E1C] text-[#FAF9F6] font-sans antialiased overflow-x-hidden selection:bg-[#C5A880] selection:text-[#1A1E1C]">
      {/* Глубокий премиальный фоновый градиент */}
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-[radial-gradient(circle_at_50%_20%,_#242B27_0%,_#1A1E1C_100%)]" />

      {/* 1. HERO SCREEN */}
      <section ref={heroRef} className="relative h-screen w-full flex flex-col items-center justify-center text-center bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
        <div className="absolute inset-0 bg-[#1A1E1C]/60 backdrop-blur-[3px] z-0" />
        
        <div ref={heroContentRef} className="relative z-10 px-4 max-w-5xl mx-auto">
          <p className="text-xs md:text-sm tracking-[0.4em] uppercase mb-8 text-[#C5A880] font-light">
            Приглашение на свадьбу
          </p>
          <h1 className="font-serif text-6xl md:text-9xl font-light tracking-wide leading-none mb-4 text-[#FAF9F6]">
            Сергей
          </h1>
          <div className="font-serif italic text-[#C5A880] text-4xl md:text-6xl my-4">&amp;</div>
          <h1 className="font-serif text-6xl md:text-9xl font-light tracking-wide leading-none text-[#FAF9F6]">
            Юлия
          </h1>
          <div className="mt-16 inline-flex items-center gap-6 text-sm md:text-base tracking-[0.35em] font-light border-y border-[#C5A880]/30 py-4 px-10 text-[#FAF9F6]/90">
            <span>21 СЕНТЯБРЯ 2027</span>
          </div>
        </div>
      </section>

      {/* 2. MANIFESTO / WELCOME */}
      <section ref={manifestoRef} className="relative py-36 px-6 max-w-3xl mx-auto text-center">
        <span className="reveal-text text-[#C5A880] text-xs uppercase tracking-[0.4em] block mb-6">Философия момента</span>
        <h2 className="reveal-text font-serif text-3xl md:text-5xl font-light text-[#FAF9F6] mb-10 leading-snug">
          «Истинная роскошь заключается в искренности чувств и разделенной тишине двоих.»
        </h2>
        <p className="reveal-text font-light text-[#FAF9F6]/70 text-lg leading-relaxed max-w-2xl mx-auto">
          Этот день — не просто дата в календаре. Это эстетика нашей истории, обретшая форму. Мы приглашаем вас стать свидетелями рождения нашей семьи в атмосфере безупречного тепла и утонченности.
        </p>
      </section>

      {/* 3. OUR MOMENTS (ГАЛЕРЕЯ / ИСТОРИЯ) */}
      <section ref={galleryRef} className="relative py-28 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#C5A880] text-xs uppercase tracking-[0.4em] block mb-3">Хроника чувств</span>
          <h3 className="font-serif text-4xl md:text-5xl font-light text-[#FAF9F6]">Наши мгновения</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="gallery-item md:col-span-7 h-[480px] rounded-2xl overflow-hidden border border-[#C5A880]/20 relative group shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop" 
              alt="Story 1" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1E1C]/80 via-transparent to-transparent opacity-60" />
          </div>
          
          <div className="gallery-item md:col-span-5 space-y-4 md:pl-6">
            <span className="text-[#C5A880] font-serif italic text-2xl">Глава первая</span>
            <h4 className="font-serif text-3xl font-light text-[#FAF9F6]">Случайная встреча, изменившая всё</h4>
            <p className="font-light text-[#FAF9F6]/70 leading-relaxed text-sm md:text-base">
              В суете большого города наши пути пересеклись неожиданно, но совершенно естественно, будто мы всегда знали траекторию друг друга.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mt-24">
          <div className="gallery-item md:col-span-5 order-2 md:order-1 space-y-4 md:pr-6">
            <span className="text-[#C5A880] font-serif italic text-2xl">Глава вторая</span>
            <h4 className="font-serif text-3xl font-light text-[#FAF9F6]">Решение идти рядом</h4>
            <p className="font-light text-[#FAF9F6]/70 leading-relaxed text-sm md:text-base">
              Каждый новый рассвет вместе укреплял нас в вере, что впереди — долгая, наполненная смыслом и гармонией дорога.
            </p>
          </div>

          <div className="gallery-item md:col-span-7 order-1 md:order-2 h-[480px] rounded-2xl overflow-hidden border border-[#C5A880]/20 relative group shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1975&auto=format&fit=crop" 
              alt="Story 2" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1E1C]/80 via-transparent to-transparent opacity-60" />
          </div>
        </div>
      </section>

      {/* 4. EVENT DETAILS (ЛОКАЦИЯ И ДЕТАЛИ) */}
      <section className="relative py-32 px-6 max-w-4xl mx-auto">
        <div ref={detailsRef} className="bg-[#222824]/80 backdrop-blur-xl p-10 md:p-16 rounded-3xl shadow-2xl text-center border border-[#C5A880]/20 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-[#C5A880] to-transparent" />
          
          <Calendar className="w-8 h-8 text-[#C5A880] mx-auto mb-6 opacity-90" />
          <h2 className="font-serif text-4xl md:text-5xl font-light text-[#FAF9F6] mb-6">Детали торжества</h2>
          
          <div className="mb-10">
            <p className="font-serif text-3xl text-[#C5A880] mb-2">Усадьба Братцево</p>
            <p className="font-light text-[#FAF9F6]/60 uppercase tracking-widest text-sm flex items-center justify-center gap-2 mt-3">
              <Clock className="w-4 h-4 text-[#C5A880]" /> Сбор гостей в 15:30
            </p>
          </div>

          <p className="font-light text-[#FAF9F6]/70 mb-10 max-w-xl mx-auto leading-relaxed">
            Мы позаботились о каждой детали, чтобы этот вечер оставил в ваших сердцах самое теплое послевкусие.
          </p>
          
          <div className="w-full h-96 bg-[#1A1E1C] rounded-2xl overflow-hidden shadow-inner border border-[#C5A880]/20">
            <iframe src="https://yandex.ru/map-widget/v1/-/CTS1A2LP" width="100%" height="100%" frameBorder="0" allowFullScreen={true} style={{ border: 'none', filter: 'invert(90%) hue-rotate(180deg) brightness(90%) contrast(90%)' }} title="Map" />
          </div>
        </div>
      </section>

      {/* 5. RSVP (ФИНАЛ) */}
      <section className="relative py-36 px-6 text-center bg-[#1D2320]/60 backdrop-blur-md border-t border-[#C5A880]/20">
        <div ref={rsvpRef} className="max-w-xl mx-auto">
          <span className="text-[#C5A880] text-xs uppercase tracking-[0.4em] block mb-4">RSVP</span>
          <h2 className="font-serif text-4xl md:text-6xl font-light text-[#FAF9F6] mb-6">Присутствие</h2>
          <p className="font-light mb-12 text-[#FAF9F6]/70 leading-relaxed text-lg">
            Ваше присутствие — самый ценный подарок для нас. Пожалуйста, подтвердите его до 1 августа 2027 года через Telegram.
          </p>
          
          <a 
            href="https://t.me/sergey_nstrk" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-3 bg-[#C5A880] text-[#1A1E1C] px-12 py-5 rounded-full font-medium tracking-widest hover:bg-[#FAF9F6] transition-all duration-300 shadow-[0_0_30px_rgba(197,168,128,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] group"
          >
            ПОДТВЕРДИТЬ В TELEGRAM 
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </section>
    </div>
  );
}