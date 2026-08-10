import React, { useRef } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';

export default function EnvelopeScreen({ onOpenComplete }) {
  const envelopeScreenRef = useRef(null);
  const envelopeBoxRef = useRef(null);

  const triggerConfetti = () => {
    confetti({
      particleCount: 55,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#B57E78', '#D8A7A0', '#C5A059', '#E4C88A', '#ffffff'],
      ticks: 220,
      gravity: 0.75,
      scalar: 1.15
    });
  };

  const handleOpenEnvelope = () => {
    triggerConfetti();

    const tl = gsap.timeline({
      onComplete: () => {
        onOpenComplete();
      }
    });

    // 1. Плавный отлет и растворение сургучной печати
    tl.to(".envelope-btn", { 
      opacity: 0, 
      scale: 0.45, 
      duration: 0.4, 
      ease: "back.in(1.8)" 
    })

    // 2. Реалистичное откидывание верхнего клапана назад (180deg), открывающее внутренний лайнер
    .to(".envelope-flap", {
      rotateX: 180,
      duration: 0.75,
      ease: "power3.inOut"
    })
    .set(".envelope-flap", { zIndex: 5 })

    // 3. Выезд пригласительной карточки вверх из кармана конверта
    .to(".envelope-letter", {
      y: -135,
      duration: 0.85,
      ease: "power2.out"
    })
    
    // 4. Плавное опускание конверта
    .to([".envelope-back", ".envelope-liner", ".envelope-front", ".envelope-flap"], {
      y: 480,
      opacity: 0,
      duration: 0.75,
      ease: "power2.in"
    }, "+=0.1")
    
    .set(".envelope-letter", { zIndex: 40 })

    // 5. Раскрытие карточки приглашения на весь экран
    .to(".envelope-letter", {
      scale: 2.2,
      opacity: 0,
      duration: 0.85,
      ease: "power2.inOut"
    }, "+=1.1") 
    
    // 6. Переход к главному сайту
    .to(envelopeScreenRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: "linear"
    }, "-=0.3");
  };

  return (
    <div 
      ref={envelopeScreenRef} 
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAF6F5] px-4 overflow-hidden"
    >
      <div 
        ref={envelopeBoxRef}
        className="relative w-full max-w-xl h-[340px] md:h-[420px] transition-transform will-change-transform"
        style={{ perspective: '1400px' }}
      >
        
        {/* 1. Задняя стенка конверта (z-0) */}
        <div className="envelope-back absolute inset-0 paper-texture-back rounded-[22px] border border-[#C5A059]/50 shadow-[0_30px_90px_rgba(100,30,40,0.32)] z-0" />
        
        {/* 1.1 Внутренний шелковый/золоченый лайнер кармана конверта (z-1) */}
        <div className="envelope-liner absolute inset-1.5 paper-texture-liner rounded-[18px] opacity-95 z-1 pointer-events-none" />

        {/* 2. Карточка-приглашение (z-10) */}
        <div className="envelope-letter absolute left-[5%] right-[5%] bottom-3 top-3 bg-[#FFFFFF] rounded-2xl p-6 md:p-8 text-center flex flex-col justify-between items-center z-10 shadow-[0_15px_35px_rgba(0,0,0,0.12)] border-2 border-[#EAD8BA]">
          
          {/* Декоративная тонкая рамка с золотыми уголочками */}
          <div className="absolute inset-2.5 md:inset-3.5 border border-[#C5A059]/40 rounded-xl pointer-events-none flex flex-col justify-between p-3">
            <div className="w-full flex justify-between opacity-60 text-[11px] text-[#C5A059]">
              <span>✦</span>
              <span>✦</span>
            </div>
            <div className="w-full flex justify-between opacity-60 text-[11px] text-[#C5A059]">
              <span>✦</span>
              <span>✦</span>
            </div>
          </div>

          <div className="z-10 mt-1">
            <span className="text-[#B57E78] text-[10px] md:text-xs uppercase tracking-[0.4em] font-semibold block">
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
            <span className="text-[#C3A6A0] text-[10px] tracking-[0.35em] font-medium uppercase">S &amp; Y</span>
          </div>
        </div>

        {/* 3. Передние карманы конверта (z-20) */}
        <div className="envelope-front absolute inset-0 z-20 pointer-events-none rounded-[22px] overflow-hidden">
          {/* Левый клапан */}
          <div 
            className="absolute inset-0 paper-texture-side" 
            style={{ 
              clipPath: 'polygon(0 0, 49.5% 52%, 0 100%)',
              filter: 'drop-shadow(3px 0 8px rgba(40,10,15,0.25))'
            }} 
          />
          {/* Правый клапан */}
          <div 
            className="absolute inset-0 paper-texture-side" 
            style={{ 
              clipPath: 'polygon(100% 0, 50.5% 52%, 100% 100%)',
              filter: 'drop-shadow(-3px 0 8px rgba(40,10,15,0.25))'
            }} 
          />
          {/* Нижний клапан */}
          <div 
            className="absolute inset-0 paper-texture-bottom" 
            style={{ 
              clipPath: 'polygon(0 100%, 50% 50%, 100% 100%)',
              filter: 'drop-shadow(0 -4px 10px rgba(40,10,15,0.3))'
            }} 
          />
          
          {/* Золоченые линии швов конверта (Gold Leaf Threads) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="0" y1="0" x2="49.5" y2="52" stroke="#E5C578" strokeWidth="0.75" opacity="0.8" />
            <line x1="100" y1="0" x2="50.5" y2="52" stroke="#E5C578" strokeWidth="0.75" opacity="0.8" />
            <polyline points="0,100 50,50 100,100" fill="none" stroke="#D4AF37" strokeWidth="0.85" opacity="0.85" />
          </svg>
        </div>

        {/* 4. Верхний крышка-клапан с идеальным золоченым кантиком по всему периметру (z-30) */}
        <div 
          className="envelope-flap absolute top-0 left-0 w-full h-[68%] paper-texture-flap z-30 origin-top rounded-t-[22px]"
          style={{ 
            clipPath: 'polygon(0% 6%, 1% 3.5%, 3.5% 1%, 6% 0%, 94% 0%, 96.5% 1%, 99% 3.5%, 100% 6%, 100% 16%, 52.5% 96%, 50% 98.5%, 47.5% 96%, 0% 16%)',
            transformStyle: 'preserve-3d',
            filter: 'drop-shadow(0 6px 14px rgba(80,30,40,0.22))'
          }} 
        >
          {/* Непрерывный золотой кантик по всему периметру клапана (включая верхние скругления) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 68" preserveAspectRatio="none">
            <path 
              d="M 0,14 C 0,4 5,0 16,0 L 84,0 C 95,0 100,4 100,14 L 100,16 L 52.5,65.5 C 50.8,67 49.2,67 47.5,65.5 L 0,16 Z" 
              fill="none" 
              stroke="#E5C578" 
              strokeWidth="1.25" 
              opacity="0.95" 
            />
          </svg>
        </div>

        {/* 5. Контрастная премиальная сургучно-золотая печать (z-50) */}
        <div className="envelope-btn absolute z-50 top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2">
          <button 
            onClick={handleOpenEnvelope}
            className="wax-seal group relative flex flex-col items-center justify-center cursor-pointer select-none border-none bg-transparent p-0 outline-none"
            title="Открыть приглашение"
          >
            {/* Тонкий золотистый ореол при наведении */}
            <div className="absolute -inset-3 rounded-full bg-[#E5C578]/0 group-hover:bg-[#E5C578]/25 blur-lg transition-all duration-500 pointer-events-none" />

            {/* Контрастная SVG-печать */}
            <svg 
              viewBox="0 0 200 200" 
              className="w-28 h-28 md:w-32 md:h-32 filter drop-shadow-[0_12px_26px_rgba(30,5,10,0.4)] transition-all duration-500 ease-out group-hover:scale-108 group-hover:rotate-2 group-active:scale-95"
            >
              {/* 1. Матовый силуэт сургуча цвета спелой черешни / темно-красного сургуча */}
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
                fill="#A81B20" 
                className="transition-colors duration-500 group-hover:fill-[#911216]"
              />

              {/* 2. Тонкая кольцевая окантовка чистого золота */}
              <circle 
                cx="100" cy="103" r="58" 
                fill="none" 
                stroke="#E5C578" 
                strokeWidth="1.4" 
                strokeDasharray="4 2"
                opacity="0.85" 
                className="transition-opacity duration-500 group-hover:opacity-100"
              />

              {/* 3. Матовый центральный оттиск */}
              <circle 
                cx="100" cy="103" r="53" 
                fill="#8C1014" 
                className="transition-colors duration-500 group-hover:fill-[#770A0D]"
              />

              {/* 4. Растительные лавровые веточки (Gold Leaf Laurel Sprigs) */}
              <g stroke="#E5C578" strokeWidth="1.1" fill="none" opacity="0.85" strokeLinecap="round">
                {/* Левая ветвь */}
                <path d="M 60,114 C 55,100 60,86 72,78" />
                <circle cx="56" cy="102" r="1.4" fill="#E5C578" />
                <circle cx="60" cy="90" r="1.4" fill="#E5C578" />
                <circle cx="68" cy="80" r="1.4" fill="#E5C578" />

                {/* Правая ветвь */}
                <path d="M 140,114 C 145,100 140,86 128,78" />
                <circle cx="144" cy="102" r="1.4" fill="#E5C578" />
                <circle cx="140" cy="90" r="1.4" fill="#E5C578" />
                <circle cx="132" cy="80" r="1.4" fill="#E5C578" />
              </g>

              {/* 5. Две тисненые фигуры сердец (Pure Gold Foil) */}
              <g strokeLinecap="round" strokeLinejoin="round">
                {/* Левое сердце */}
                <path 
                  d="M 83,71 
                     C 74,56 56,58 52,75 
                     C 47,96 70,116 83,130 
                     C 93,117 114,96 109,75 
                     C 105,57 89,55 83,71 Z" 
                  fill="none" 
                  stroke="#FFF3D6" 
                  strokeWidth="2.4" 
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
                  stroke="#E5C578" 
                  strokeWidth="2.2" 
                  opacity="0.95"
                />
              </g>
            </svg>

            {/* Элегантная подпись "Нажмите, чтобы открыть" */}
            <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none transition-all duration-300 transform group-hover:translate-y-0.5 opacity-95 group-hover:opacity-100">
              <span className="px-4 py-1.5 rounded-full bg-[#33292B] text-[#FFF5F3] text-[9px] md:text-[10px] tracking-[0.25em] font-semibold uppercase shadow-xl border border-[#E5C578]/50 group-hover:border-[#E5C578] transition-colors">
                Нажмите, чтобы открыть
              </span>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}