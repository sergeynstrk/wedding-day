import React, { useRef } from 'react';
import gsap from 'gsap';

export default function EnvelopeScreen({ onOpenComplete }) {
  const envelopeScreenRef = useRef(null);

  const handleOpenEnvelope = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        onOpenComplete();
      }
    });

    // 1. Убираем печать
    tl.to(".envelope-btn", { 
      opacity: 0, 
      scale: 0.5, 
      duration: 0.3, 
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
      y: -110,
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
      scale: 2.0,
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut"
    }, "+=1.5") 
    
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAF6F5] px-4 perspective-[1400px]"
    >
      <div className="relative w-full max-w-xl h-[340px] md:h-[420px]">
        
        {/* 1. Задняя стенка конверта (z-0) */}
        <div className="envelope-back absolute inset-0 bg-[#EFE4E1] rounded-[18px] shadow-[0_20px_50px_rgba(51,41,43,0.12)] z-0" />
        
        {/* 2. Карточка-письмо (z-10) */}
        <div className="envelope-letter absolute left-[6%] right-[6%] bottom-3 top-3 bg-[#FCFCFA] rounded-xl p-5 md:p-8 text-center flex flex-col justify-between items-center z-10 shadow-[0_8px_20px_rgba(0,0,0,0.06)] border border-[#EBE5DF]">
          
          <div className="absolute inset-2 md:inset-3 border border-[#E3DAD0] rounded-[6px] pointer-events-none flex flex-col justify-between p-3">
            <div className="w-full flex justify-between opacity-30 text-[9px] text-[#8C7A6B]">
              <span>✦</span>
              <span>✦</span>
            </div>
            <div className="w-full flex justify-between opacity-30 text-[9px] text-[#8C7A6B]">
              <span>✦</span>
              <span>✦</span>
            </div>
          </div>

          <div className="z-10 mt-1">
            <span className="text-[#B57E78] text-[10px] md:text-xs uppercase tracking-[0.35em] font-medium block">
              Свадебное приглашение
            </span>
          </div>

          <div className="space-y-1.5 z-10 my-auto">
            <h3 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-[#33292B]">
              Сергей <span className="text-[#B57E78]">&</span> Юлия
            </h3>
            <p className="font-light text-[#6B5A5C] text-xs md:text-sm tracking-widest uppercase">
              21 сентября 2027
            </p>
          </div>

          <div className="z-10 w-full flex flex-col items-center gap-1 mb-1">
            <div className="w-16 h-[1px] bg-[#E8D8D5]" />
            <span className="text-[#C3A6A0] text-[10px] tracking-widest">S & Y</span>
          </div>
        </div>

        {/* 3. Передние карманы конверта (z-20) */}
        <div className="envelope-front absolute inset-0 z-20 pointer-events-none rounded-[18px] overflow-hidden">
          {/* Левый клапан */}
          <div 
            className="absolute inset-0 bg-[#EADAD6]" 
            style={{ clipPath: 'polygon(0 0, 49.5% 52%, 0 100%)' }} 
          />
          {/* Правый клапан */}
          <div 
            className="absolute inset-0 bg-[#EADAD6]" 
            style={{ clipPath: 'polygon(100% 0, 50.5% 52%, 100% 100%)' }} 
          />
          {/* Нижний клапан */}
          <div 
            className="absolute inset-0 bg-[#E2D2CE] shadow-[0_-4px_12px_rgba(0,0,0,0.03)]" 
            style={{ clipPath: 'polygon(0 100%, 50% 50%, 100% 100%)' }} 
          />
        </div>

        {/* 4. Верхний крышка-клапан (z-30) */}
        <div 
          className="envelope-flap absolute top-0 left-0 w-full h-[68%] bg-[#E5D5D1] z-30 origin-top rounded-t-[18px] drop-shadow-sm"
          style={{ 
            clipPath: 'polygon(0 0, 100% 0, 100% 8%, 53% 97%, 50% 100%, 47% 97%, 0 8%)',
            transformStyle: 'preserve-3d'
          }} 
        />

        {/* 5. Печать (z-50) */}
        <div className="envelope-btn absolute z-50 top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2">
          <button 
            onClick={handleOpenEnvelope}
            className="group relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#B57E78] text-white flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-[0_10px_20px_rgba(181,126,120,0.35)] border border-[#CBB0AC]/60"
          >
            <div className="absolute inset-1.5 rounded-full border border-dashed border-white/40 pointer-events-none group-hover:border-white/60 transition-colors" />
            <span className="font-serif tracking-widest text-[11px] md:text-xs uppercase text-white font-medium text-center drop-shadow-sm leading-tight">
              Открыть
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}