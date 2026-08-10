import React, { useRef } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';

export default function EnvelopeScreen({ onOpenComplete }) {
  const envelopeScreenRef = useRef(null);
  const envelopeBoxRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!envelopeBoxRef.current) return;
    const rect = envelopeBoxRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(envelopeBoxRef.current, {
      rotateY: (x / rect.width) * 12,
      rotateX: (-y / rect.height) * 12,
      duration: 0.6,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    if (!envelopeBoxRef.current) return;
    gsap.to(envelopeBoxRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 1,
      ease: "elastic.out(1, 0.4)"
    });
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#B57E78', '#D8A7A0', '#C5A059', '#E4C88A', '#ffffff'],
      ticks: 200,
      gravity: 0.8,
      scalar: 1.1
    });
  };

  const handleOpenEnvelope = () => {
    triggerConfetti();

    const tl = gsap.timeline({
      onComplete: () => {
        onOpenComplete();
      }
    });

    // 1. Убираем печать
    tl.to(".envelope-btn", { 
      opacity: 0, 
      scale: 0.5, 
      duration: 0.35, 
      ease: "back.in(1.7)" 
    })
    // 2. Откидываем верхний клапан назад
    .to(".envelope-flap", {
      rotateX: 180,
      duration: 0.7,
      ease: "power3.inOut"
    })
    .set(".envelope-flap", { zIndex: 5 })

    // 3. Письмо выезжает вверх строго внутри кармана
    .to(".envelope-letter", {
      y: -120,
      duration: 0.8,
      ease: "power2.out"
    })
    
    // 4. Конверт улетает вниз
    .to([".envelope-back", ".envelope-front", ".envelope-flap"], {
      y: 450,
      opacity: 0,
      duration: 0.7,
      ease: "power2.in"
    }, "+=0.1")
    
    .set(".envelope-letter", { zIndex: 40 })

    // 5. Пауза и раскрытие письма
    .to(".envelope-letter", {
      scale: 2.1,
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut"
    }, "+=1.2") 
    
    // 6. Открытие основной страницы
    .to(envelopeScreenRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: "linear"
    }, "-=0.3");
  };

  return (
    <div 
      ref={envelopeScreenRef} 
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAF6F5] px-4"
    >
      <div 
        ref={envelopeBoxRef}
        className="relative w-full max-w-xl h-[340px] md:h-[420px] transition-transform will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
      >
        
        {/* 1. Задняя стенка конверта (z-0) */}
        <div className="envelope-back absolute inset-0 paper-texture-back rounded-[22px] border border-[#D9B6BC] shadow-[0_18px_45px_rgba(51,41,43,0.1)] z-0" />
        
        {/* 2. Карточка-письмо (z-10) */}
        <div className="envelope-letter absolute left-[5%] right-[5%] bottom-3 top-3 bg-[#FCFCFA] rounded-2xl p-6 md:p-8 text-center flex flex-col justify-between items-center z-10 shadow-[0_10px_25px_rgba(0,0,0,0.07)] border border-[#EBE5DF]">
          
          <div className="absolute inset-2.5 md:inset-3.5 border border-[#E3DAD0] rounded-xl pointer-events-none flex flex-col justify-between p-3">
            <div className="w-full flex justify-between opacity-40 text-[10px] text-[#8C7A6B]">
              <span>✦</span>
              <span>✦</span>
            </div>
            <div className="w-full flex justify-between opacity-40 text-[10px] text-[#8C7A6B]">
              <span>✦</span>
              <span>✦</span>
            </div>
          </div>

          <div className="z-10 mt-1">
            <span className="text-[#B57E78] text-[10px] md:text-xs uppercase tracking-[0.4em] font-medium block">
              Свадебное приглашение
            </span>
          </div>

          <div className="space-y-1.5 z-10 my-auto">
            <h3 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-[#33292B]">
              Сергей <span className="text-[#B57E78] title-italic">&amp;</span> Юлия
            </h3>
            <p className="font-light text-[#6B5A5C] text-xs md:text-sm tracking-[0.25em] uppercase mt-2">
              21 сентября 2027
            </p>
          </div>

          <div className="z-10 w-full flex flex-col items-center gap-1.5 mb-1">
            <div className="w-20 h-[1px] bg-[#E8D8D5]" />
            <span className="text-[#C3A6A0] text-[10px] tracking-[0.3em] uppercase">S &amp; Y</span>
          </div>
        </div>

        {/* 3. Передние карманы конверта (z-20) */}
        <div className="envelope-front absolute inset-0 z-20 pointer-events-none rounded-[22px] overflow-hidden">
          {/* Левый клапан */}
          <div 
            className="absolute inset-0 paper-texture-side" 
            style={{ 
              clipPath: 'polygon(0 0, 49.5% 52%, 0 100%)',
              filter: 'drop-shadow(3px 0 6px rgba(140,80,90,0.14))'
            }} 
          />
          {/* Правый клапан */}
          <div 
            className="absolute inset-0 paper-texture-side" 
            style={{ 
              clipPath: 'polygon(100% 0, 50.5% 52%, 100% 100%)',
              filter: 'drop-shadow(-3px 0 6px rgba(140,80,90,0.14))'
            }} 
          />
          {/* Нижний клапан */}
          <div 
            className="absolute inset-0 paper-texture-bottom" 
            style={{ 
              clipPath: 'polygon(0 100%, 50% 50%, 100% 100%)',
              filter: 'drop-shadow(0 -3px 8px rgba(140,80,90,0.16))'
            }} 
          />
          
          {/* Тончайшие золоченые контурные линии швов (Gold Leaf Thread) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="0" y1="0" x2="49.5" y2="52" stroke="#D4AF37" strokeWidth="0.45" opacity="0.6" />
            <line x1="100" y1="0" x2="50.5" y2="52" stroke="#D4AF37" strokeWidth="0.45" opacity="0.6" />
            <polyline points="0,100 50,50 100,100" fill="none" stroke="#C5A059" strokeWidth="0.5" opacity="0.65" />
          </svg>
        </div>

        {/* 4. Верхний крышка-клапан (z-30) */}
        <div 
          className="envelope-flap absolute top-0 left-0 w-full h-[68%] paper-texture-flap z-30 origin-top rounded-t-[22px]"
          style={{ 
            clipPath: 'polygon(0 0, 100% 0, 100% 8%, 53% 97%, 50% 100%, 47% 97%, 0 8%)',
            transformStyle: 'preserve-3d',
            filter: 'drop-shadow(0 6px 14px rgba(130,70,80,0.18))'
          }} 
        >
          {/* Золотая нить по краю V-образного клапана */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 68" preserveAspectRatio="none">
            <polyline points="0,5.4 47,66 50,68 53,66 100,5.4" fill="none" stroke="#D4AF37" strokeWidth="0.6" opacity="0.75" />
          </svg>
        </div>

        {/* 5. Эксклюзивная сургучная печать Haute Couture (z-50) */}
        <div className="envelope-btn absolute z-50 top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2">
          <button 
            onClick={handleOpenEnvelope}
            className="wax-seal group relative flex flex-col items-center justify-center cursor-pointer select-none border-none bg-transparent p-0 outline-none"
            title="Открыть приглашение"
          >
            {/* Авторская SVG-печать с золотым тиснением и лавровым венком */}
            <svg 
              viewBox="0 0 200 200" 
              className="w-28 h-28 md:w-32 md:h-32 filter drop-shadow-[0_10px_22px_rgba(70,25,35,0.22)] transition-all duration-500 ease-out group-hover:scale-106 group-hover:rotate-1 group-active:scale-95"
            >
              {/* 1. Живой матовый силуэт сургуча (Rosewood & Deep Coral) */}
              <path 
                d="M 100,12 
                   C 126,9 146,18 163,35 
                   C 180,52 194,74 191,101 
                   C 188,128 177,153 158,171 
                   C 139,189 113,194 88,189 
                   C 63,184 41,173 25,153 
                   C 9,133 6,108 12,83 
                   C 18,58 35,36 57,23 
                   C 74,12 82,14 100,12 Z" 
                fill="#9E4B50" 
                className="transition-colors duration-500 group-hover:fill-[#8E3F44]"
              />

              {/* 2. Тонкая филигранная кольцевая окантовка золотой фольгой */}
              <circle 
                cx="100" cy="103" r="58" 
                fill="none" 
                stroke="#D4AF37" 
                strokeWidth="1.1" 
                strokeDasharray="4 2.5"
                opacity="0.75" 
                className="transition-opacity duration-500 group-hover:opacity-100"
              />

              {/* 3. Матовый центральный оттиск */}
              <circle 
                cx="100" cy="103" r="53" 
                fill="#8A3D42" 
                className="transition-colors duration-500 group-hover:fill-[#7B3338]"
              />

              {/* 4. Растительный лавровый веточный декор (Gold Leaf Laurel Sprigs) */}
              <g stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.65" strokeLinecap="round">
                {/* Левая ветвь */}
                <path d="M 62,112 C 58,100 62,88 72,80" />
                <circle cx="58" cy="100" r="1.2" fill="#D4AF37" />
                <circle cx="62" cy="88" r="1.2" fill="#D4AF37" />
                <circle cx="70" cy="80" r="1.2" fill="#D4AF37" />

                {/* Правая ветвь */}
                <path d="M 138,112 C 142,100 138,88 128,80" />
                <circle cx="142" cy="100" r="1.2" fill="#D4AF37" />
                <circle cx="138" cy="88" r="1.2" fill="#D4AF37" />
                <circle cx="130" cy="80" r="1.2" fill="#D4AF37" />
              </g>

              {/* 5. Изящное тиснение двух сердец (Champagne Gold Foil) */}
              <g strokeLinecap="round" strokeLinejoin="round">
                {/* Левое сердце */}
                <path 
                  d="M 83,71 
                     C 74,56 56,58 52,75 
                     C 47,96 70,116 83,130 
                     C 93,117 114,96 109,75 
                     C 105,57 89,55 83,71 Z" 
                  fill="none" 
                  stroke="#F5E4BE" 
                  strokeWidth="2.2" 
                  opacity="0.95"
                />
                
                {/* Правое сердце */}
                <path 
                  d="M 124,83 
                     C 117,72 104,74 101,86 
                     C 98,100 114,114 124,124 
                     C 131,114 145,100 142,86 
                     C 139,73 128,72 124,83 Z" 
                  fill="none" 
                  stroke="#D4AF37" 
                  strokeWidth="2" 
                  opacity="0.9"
                />
              </g>
            </svg>

            {/* Драгоценная подпись "Открыть" с тонким золотистым кантиком */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none transition-all duration-300 transform group-hover:translate-y-0.5 opacity-90 group-hover:opacity-100">
              <span className="px-3.5 py-1 rounded-full bg-[#FAF6F5]/92 backdrop-blur-md text-[#6B5A5C] text-[10px] md:text-xs tracking-[0.3em] font-medium uppercase shadow-md border border-[#D4AF37]/35 group-hover:border-[#D4AF37]/70 group-hover:text-[#33292B] transition-colors">
                Открыть
              </span>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}