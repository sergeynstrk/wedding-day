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

    // 2. Откидывание верхнего клапана назад (180deg)
    .to(".envelope-flap", {
      rotateX: 180,
      duration: 0.75,
      ease: "power3.inOut"
    })
    .set(".envelope-flap", { zIndex: 5 })

    // 3. Выезд пригласительной карточки вверх из конверта
    .to(".envelope-letter", {
      y: -135,
      duration: 0.85,
      ease: "power2.out"
    })
    
    // 4. Плавное опускание конверта и внешней золотой каемки
    .to([".envelope-back", ".envelope-liner", ".envelope-front", ".envelope-flap", ".envelope-border"], {
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
        <div className="envelope-back absolute inset-0 paper-texture-back rounded-none shadow-[0_20px_45px_rgba(51,41,43,0.08)] z-0" />
        
        {/* 1.1 Внутренний шелковый/золоченый лайнер кармана конверта (z-1) */}
        <div className="envelope-liner absolute inset-1.5 paper-texture-liner rounded-none opacity-90 z-1 pointer-events-none" />

        {/* 2. Исходная карточка-приглашение со скругленными уголками rounded-2xl (z-10) */}
        <div className="envelope-letter absolute left-[5%] right-[5%] bottom-3 top-3 bg-[#FCFCFA] rounded-2xl p-6 md:p-8 text-center flex flex-col justify-between items-center z-10 shadow-[0_10px_25px_rgba(0,0,0,0.07)] border border-[#EBE5DF]">
          
          {/* Декоративная тонкая рамка со скруглениями и золотыми уголочками ✦ */}
          <div className="absolute inset-2.5 md:inset-3.5 border border-[#E3DAD0] rounded-xl pointer-events-none flex flex-col justify-between p-3">
            <div className="w-full flex justify-between opacity-50 text-[10px] text-[#C5A059]">
              <span>✦</span>
              <span>✦</span>
            </div>
            <div className="w-full flex justify-between opacity-50 text-[10px] text-[#C5A059]">
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
            <span className="text-[#C3A6A0] text-[10px] tracking-[0.35em] font-medium uppercase">S &amp; Y</span>
          </div>
        </div>

        {/* 3. Передние карманы конверта - плотная непрозрачная бумага (z-20) */}
        <div className="envelope-front absolute inset-0 z-20 pointer-events-none rounded-none overflow-hidden">
          {/* Сплошная плотная подложка кармана */}
          <div 
            className="absolute inset-0 bg-[#F4E7E3] paper-texture-side" 
            style={{ 
              clipPath: 'polygon(0 0, 50% 54%, 100% 0, 100% 100%, 0 100%)',
              filter: 'drop-shadow(0 -3px 8px rgba(51,41,43,0.08))'
            }} 
          />

          {/* Нижний клапан для рельефа швов */}
          <div 
            className="absolute inset-0 paper-texture-bottom" 
            style={{ 
              clipPath: 'polygon(0 100%, 50% 54%, 100% 100%)'
            }} 
          />
          
          {/* Чистые сплошные швы конверта без пунктиров */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="0" y1="0" x2="50" y2="54" stroke="#E3DAD0" strokeWidth="0.6" opacity="0.9" />
            <line x1="100" y1="0" x2="50" y2="54" stroke="#E3DAD0" strokeWidth="0.6" opacity="0.9" />
            <polyline points="0,100 50,54 100,100" fill="none" stroke="#D8C8B8" strokeWidth="0.7" opacity="0.9" />
          </svg>
        </div>

        {/* 4. Верхний крышка-клапан с аккуратными золотыми V-линиями (z-30) */}
        <div 
          className="envelope-flap absolute top-0 left-0 w-full h-[68%] paper-texture-flap z-30 origin-top rounded-none"
          style={{ 
            clipPath: 'polygon(0 0, 100% 0, 50% 79.4%)',
            transformStyle: 'preserve-3d',
            filter: 'drop-shadow(0 4px 10px rgba(51,41,43,0.08))'
          }} 
        >
          {/* Внутренняя шелковая подкладка клапана при открывании */}
          <div className="absolute inset-0 paper-texture-liner rounded-none opacity-95 pointer-events-none" />

          {/* Золотая V-линия аккуратно начинается внутри уголочков */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 68" preserveAspectRatio="none">
            <line x1="0" y1="0" x2="50" y2="54" stroke="#C5A059" strokeWidth="1.2" opacity="0.95" />
            <line x1="100" y1="0" x2="50" y2="54" stroke="#C5A059" strokeWidth="1.2" opacity="0.95" />
          </svg>
        </div>

        {/* 5. Главная непрерывная золотая рамочная каемка ПО ВСЕМ 4 СТОРОНАМ конверта (z-35) */}
        <div className="envelope-border absolute inset-0 rounded-none border-2 border-[#C5A059] pointer-events-none z-35 shadow-[0_20px_45px_rgba(51,41,43,0.08)]" />

        {/* 6. Элегантная печать "Пыльная Роза" с двумя сердцами без веточек и без пунктиров (z-50) */}
        <div className="envelope-btn absolute z-50 top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2">
          <button 
            onClick={handleOpenEnvelope}
            className="wax-seal group relative flex flex-col items-center justify-center cursor-pointer select-none border-none bg-transparent p-0 outline-none"
            title="Открыть приглашение"
          >
            {/* Изящная SVG-печать оттенка Пыльной Розы */}
            <svg 
              viewBox="0 0 200 200" 
              className="w-28 h-28 md:w-32 md:h-32 filter drop-shadow-[0_8px_20px_rgba(181,126,120,0.35)] transition-all duration-500 ease-out group-hover:scale-106 group-active:scale-95"
            >
              {/* 1. Матовый силуэт воска оттенка Пыльной Розы (--c-accent #B57E78) */}
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
                fill="#B57E78" 
                className="transition-colors duration-500 group-hover:fill-[#A36D67]"
              />

              {/* 2. Чистая сплошная золотая кольцевая окантовка (без пунктира) */}
              <circle 
                cx="100" cy="103" r="58" 
                fill="none" 
                stroke="#C5A059" 
                strokeWidth="1.2" 
                opacity="0.85" 
                className="transition-opacity duration-500 group-hover:opacity-100"
              />

              {/* 3. Матовый центральный оттиск */}
              <circle 
                cx="100" cy="103" r="53" 
                fill="#A36D67" 
                className="transition-colors duration-500 group-hover:fill-[#925C56]"
              />

              {/* 4. Два лаконичных тисненых сердца (БЕЗ веточек) */}
              <g strokeLinecap="round" strokeLinejoin="round">
                {/* Левое сердце */}
                <path 
                  d="M 83,71 
                     C 74,56 56,58 52,75 
                     C 47,96 70,116 83,130 
                     C 93,117 114,96 109,75 
                     C 105,57 89,55 83,71 Z" 
                  fill="none" 
                  stroke="#FFF5F3" 
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
                  stroke="#E4C88A" 
                  strokeWidth="2" 
                  opacity="0.9"
                />
              </g>
            </svg>

            {/* Подпись "Нажмите, чтобы открыть" в стиле сайта */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none transition-all duration-300 transform group-hover:translate-y-0.5 opacity-90 group-hover:opacity-100">
              <span className="px-3.5 py-1.5 rounded-full bg-[#FAF6F5]/95 backdrop-blur-md text-[#6B5A5C] text-[9px] md:text-[10px] tracking-[0.25em] font-medium uppercase shadow-md border border-[#E3DAD0] group-hover:border-[#C5A059]/50 group-hover:text-[#33292B] transition-colors">
                Нажмите, чтобы открыть
              </span>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}