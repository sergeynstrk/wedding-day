import React, { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';
import { Clock, ArrowRight, Calendar, Sparkles, Gift, Users, CheckCircle2, Volume2, VolumeX, CalendarPlus } from 'lucide-react';
import EnvelopeScreen from './EnvelopeScreen';
import './style.css';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef(null);

  // Refs
  const appContentRef = useRef(null);
  const heroRef = useRef(null);
  const heroBgRef = useRef(null);
  const sectionsRef = useRef([]);
  const imagesRef = useRef([]);
  const magneticRefs = useRef([]);

  const addToRefs = (refArray) => (el) => {
    if (el && !refArray.current.includes(el)) {
      refArray.current.push(el);
    }
  };

  const [selectedColor, setSelectedColor] = useState({ name: "Пыльная роза", hex: "#D8A7A0" });
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Состояние для формы RSVP
  const [rsvpForm, setRsvpForm] = useState({ name: '', attendance: 'yes', alcohol: 'Вино красное/белое' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch(() => {
        setIsPlayingAudio(false);
      });
    }
  };

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    if (!rsvpForm.name.trim()) return;
    
    setIsSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#B57E78', '#D8A7A0', '#C5A059', '#FAF6F5']
    });
  };

  const googleCalendarUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Свадьба+Сергея+и+Юлии&dates=20270921T123000Z/20270921T200000Z&details=Ждем+вас+на+нашем+торжестве!+Усадьба+Братцево.&location=Усадьба+Братцево,+Светлогорский+проезд,+13,+Москва";

  useEffect(() => {
    if (!isOpen) return;

    // --- 1. Инициализация Smooth Scroll (Lenis) ---
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // Fade-in всего приложения при открытии конверта
    gsap.fromTo(appContentRef.current, 
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: "power2.out" }
    );

    // --- 2. Parallax фона Hero ---
    gsap.to(heroBgRef.current, {
      y: '20%',
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });

    // --- 3. Внутренний параллакс изображений ---
    imagesRef.current.forEach((imgWrapper) => {
      const image = imgWrapper.querySelector('img');
      if(image) {
        gsap.fromTo(image, 
          { scale: 1.2, y: '-10%' },
          {
            scale: 1,
            y: '10%',
            ease: "none",
            scrollTrigger: {
              trigger: imgWrapper,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            }
          }
        );
      }
    });

    // --- 4. Магнитные кнопки (для палитры) ---
    const handleMagneticMove = (e, el) => {
      const { clientX, clientY } = e;
      const { top, left, width, height } = el.getBoundingClientRect();
      const x = (clientX - (left + width / 2)) * 0.4;
      const y = (clientY - (top + height / 2)) * 0.4;

      gsap.to(el, { x, y, duration: 1, ease: "power3.out" });
      
      const inner = el.querySelector('.magnetic-inner');
      if (inner) {
         gsap.to(inner, { x: x * 0.5, y: y * 0.5, duration: 1, ease: "power3.out" });
      }
    };

    const handleMagneticLeave = (el) => {
      gsap.to(el, { x: 0, y: 0, duration: 1.5, ease: "elastic.out(1, 0.3)" });
      
      const inner = el.querySelector('.magnetic-inner');
      if (inner) {
         gsap.to(inner, { x: 0, y: 0, duration: 1.5, ease: "elastic.out(1, 0.3)" });
      }
    };

    magneticRefs.current.forEach((el) => {
      el.addEventListener('mousemove', (e) => handleMagneticMove(e, el));
      el.addEventListener('mouseleave', () => handleMagneticLeave(el));
    });

    // --- 5. Появление секций ---
    sectionsRef.current.forEach((sec) => {
      gsap.fromTo(sec,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sec,
            start: "top 85%",
          }
        }
      );
    });

    // --- Таймер ---
    const targetDate = new Date('2027-09-21T15:30:00');
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
      clearInterval(interval);
      magneticRefs.current.forEach((el) => {
        el.removeEventListener('mousemove', handleMagneticMove);
        el.removeEventListener('mouseleave', handleMagneticLeave);
      });
    };
  }, [isOpen]);

  const dressColors = [
    { name: "Пыльная роза", hex: "#D8A7A0" },
    { name: "Благородный айвори", hex: "#F3E9E7" },
    { name: "Жемчужно-бежевый", hex: "#E8D8D5" },
    { name: "Теплый шампань", hex: "#E6C7C2" },
    { name: "Глубокий графит", hex: "#33292B" }
  ];

  const timelineEvents = [
    { time: "15:30", title: "Сбор гостей и фуршет", desc: "Легкие напитки, живая музыка и приятные знакомства перед началом церемонии." },
    { time: "16:30", title: "Церемония бракосочетания", desc: "Самый трогательный и важный момент нашего дня, когда мы скажем друг другу «Да»." },
    { time: "18:00", title: "Праздничный банкет", desc: "Изысканный ужин, душевные поздравления, танцы и живые выступления." },
    { time: "22:00", title: "Свадебный торт и финал", desc: "Сладкое завершение вечера и яркие эмоции под звездным небом." }
  ];

  return (
    <>
      <div className="page-background" />
      <div className="paper-noise" />

      {/* Фоновый аудиоплеер */}
      <audio 
        ref={audioRef} 
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-wedding-112199.mp3" 
        loop 
      />

      {/* Плавающая кнопка музыки */}
      {isOpen && (
        <button
          onClick={toggleAudio}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-[#E8D8D5] shadow-lg flex items-center justify-center text-[#B57E78] transition-all hover:scale-110 active:scale-95 cursor-pointer"
          title={isPlayingAudio ? "Выключить музыку" : "Включить музыку"}
        >
          {isPlayingAudio ? <Volume2 size={20} className="animate-pulse" /> : <VolumeX size={20} />}
        </button>
      )}

      {!isOpen && <EnvelopeScreen onOpenComplete={() => setIsOpen(true)} />}

      <div ref={appContentRef} style={{ opacity: isOpen ? 1 : 0, display: isOpen ? 'block' : 'none' }}>
        
        {/* HERO */}
        <section ref={heroRef} className="hero">
          <div 
            ref={heroBgRef} 
            className="hero__bg" 
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop')` }}
          />
          <div className="hero__overlay" />
          
          <div className="hero__content container">
            <p className="subtitle" style={{ color: '#E6C7C2' }}>Приглашение на свадьбу</p>
            <h1 className="title-serif hero__name">Сергей</h1>
            <div className="hero__ampersand">&amp;</div>
            <h1 className="title-serif hero__name">Юлия</h1>
            <div className="hero__date text-body" style={{ color: '#fff' }}>
              <span>21 СЕНТЯБРЯ 2027</span>
            </div>
          </div>
        </section>

        {/* MANIFESTO */}
        <section ref={addToRefs(sectionsRef)} className="container text-center" style={{ padding: '4.5rem 1rem 2.5rem' }}>
          <span className="subtitle">Философия момента</span>
          <h2 className="title-serif" style={{ fontSize: 'var(--fz-h2)', marginBottom: '1.5rem' }}>
            «Истинная роскошь — это гармония в деталях и глубина <span className="title-italic gold-gradient-text">искренних чувств</span>.»
          </h2>
          <p className="text-body" style={{ maxWidth: '800px', margin: '0 auto' }}>
            Этот день станет отражением нашей истории — утонченной, наполненной теплом и эстетикой. Мы будем счастливы разделить его с самыми близкими.
          </p>
        </section>

        {/* LIVE COUNTDOWN */}
        <section ref={addToRefs(sectionsRef)} className="container text-center" style={{ padding: '1.5rem 1rem' }}>
          <div className="glass-panel" style={{ padding: '3rem 2rem' }}>
            <span className="subtitle">До долгожданной встречи</span>
            <div className="countdown__grid">
              {Object.entries(timeLeft).map(([unit, value]) => {
                const labels = { days: 'Дней', hours: 'Часов', minutes: 'Минут', seconds: 'Секунд' };
                return (
                  <div key={unit} className="countdown__item">
                    <span className="countdown__number">{value}</span>
                    <span className="subtitle" style={{ marginBottom: 0, fontSize: '0.65rem' }}>{labels[unit]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* OUR MOMENTS / GALLERY */}
        <section ref={addToRefs(sectionsRef)} className="container" style={{ padding: '2.5rem 1rem' }}>
          <div className="text-center" style={{ marginBottom: '2.5rem' }}>
            <span className="subtitle">Хроника чувств</span>
            <h3 className="title-serif" style={{ fontSize: 'var(--fz-h3)' }}>Наши мгновения</h3>
          </div>

          <div className="glass-panel gallery__card" style={{ marginBottom: '2rem' }}>
            <div className="gallery__img-wrapper" ref={addToRefs(imagesRef)}>
              <img 
                src="/images/story1.jpg" 
                onError={(e) => {
                  if (!e.currentTarget.dataset.retried) {
                    e.currentTarget.dataset.retried = 'true';
                    e.currentTarget.src = '/images/story1.png';
                  } else {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop';
                  }
                }}
                alt="Story 1" 
              />
            </div>
            <div className="gallery__info">
              <span className="title-italic" style={{ color: 'var(--c-accent)', fontSize: '1.6rem' }}>Глава первая</span>
              <h4 className="title-serif" style={{ fontSize: '2.2rem', margin: '0.75rem 0' }}>Случайная встреча, изменившая всё</h4>
              <p className="text-body">
                В суете большого города наши пути пересеклись неожиданно, но совершенно естественно, будто мы всегда знали траекторию друг друга. С первого взгляда стало ясно — это начало чего-то большего.
              </p>
            </div>
          </div>

          <div className="glass-panel gallery__card gallery__card--reverse" style={{ marginBottom: '2rem' }}>
            <div className="gallery__info">
              <span className="title-italic" style={{ color: 'var(--c-accent)', fontSize: '1.6rem' }}>Глава вторая</span>
              <h4 className="title-serif" style={{ fontSize: '2.2rem', margin: '0.75rem 0' }}>Решение идти рядом</h4>
              <p className="text-body">
                Каждый новый день вместе укреплял нас в вере, что впереди — долгая, наполненная смыслом и гармонией дорога. И теперь мы готовы сделать самый главный шаг.
              </p>
            </div>
            <div className="gallery__img-wrapper" ref={addToRefs(imagesRef)}>
              <img 
                src="/images/story2.png" 
                onError={(e) => {
                  if (!e.currentTarget.dataset.retried) {
                    e.currentTarget.dataset.retried = 'true';
                    e.currentTarget.src = '/images/story2.jpg';
                  } else {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1975&auto=format&fit=crop';
                  }
                }}
                alt="Story 2" 
              />
            </div>
          </div>

          <div className="glass-panel gallery__card">
            <div className="gallery__img-wrapper" ref={addToRefs(imagesRef)}>
              <img 
                src="/images/story3.jpg" 
                onError={(e) => {
                  if (!e.currentTarget.dataset.retried) {
                    e.currentTarget.dataset.retried = 'true';
                    e.currentTarget.src = '/images/story3.png';
                  } else {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop';
                  }
                }}
                alt="Story 3" 
              />
            </div>
            <div className="gallery__info">
              <span className="title-italic" style={{ color: 'var(--c-accent)', fontSize: '1.6rem' }}>Глава третья</span>
              <h4 className="title-serif" style={{ fontSize: '2.2rem', margin: '0.75rem 0' }}>Впереди вся жизнь</h4>
              <p className="text-body">
                Мы счастливы открыть новую главу нашей истории и разделить каждый ее момент в любви, заботе и гармонии.
              </p>
            </div>
          </div>
        </section>

        {/* TIMELINE */}
        <section ref={addToRefs(sectionsRef)} className="container" style={{ padding: '2.5rem 1rem' }}>
          <div className="glass-panel" style={{ padding: '3.5rem 2rem' }}>
            <div className="text-center" style={{ marginBottom: '3rem' }}>
              <Clock style={{ margin: '0 auto 1rem', color: 'var(--c-accent)' }} />
              <span className="subtitle">Тайминг</span>
              <h2 className="title-serif" style={{ fontSize: 'var(--fz-h3)' }}>Программа дня</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {timelineEvents.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', borderBottom: index !== timelineEvents.length - 1 ? '1px solid var(--c-border)' : 'none', paddingBottom: index !== timelineEvents.length - 1 ? '1.75rem' : '0' }}>
                  <span className="title-serif title-italic" style={{ color: 'var(--c-accent)', fontSize: '1.75rem', minWidth: '75px', fontWeight: 400 }}>{item.time}</span>
                  <div>
                    <h4 className="title-serif" style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>{item.title}</h4>
                    <p className="text-body" style={{ fontSize: '0.95rem' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DRESS CODE */}
        <section ref={addToRefs(sectionsRef)} className="container text-center" style={{ padding: '1.5rem 1rem' }}>
          <div className="glass-panel" style={{ padding: '3.5rem 2rem' }}>
            <Sparkles style={{ margin: '0 auto 1rem', color: 'var(--c-accent)' }} />
            <span className="subtitle">Дресс-код</span>
            <h2 className="title-serif" style={{ fontSize: 'var(--fz-h3)', marginBottom: '1rem' }}>Цветовая палитра праздника</h2>
            <p className="text-body" style={{ maxWidth: '700px', margin: '0 auto 2rem' }}>
              Мы будем очень признательны, если при выборе нарядов вы поддержите цветовую гамму нашей свадьбы. Нажмите на оттенок:
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {dressColors.map((color, index) => (
                <div 
                  key={index} 
                  ref={addToRefs(magneticRefs)} 
                  className="magnetic-wrapper"
                  style={{ padding: '10px', cursor: 'pointer' }}
                  onClick={() => setSelectedColor(color)}
                >
                  <div
                    className={`color-btn magnetic-inner ${selectedColor.name === color.name ? 'is-active' : ''}`}
                    style={{ backgroundColor: color.hex, pointerEvents: 'none' }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: 'inline-block', padding: '0.75rem 1.75rem', borderRadius: '100px', border: '1px solid var(--c-border)', background: 'var(--c-bg-glow)' }}>
              <span className="text-body" style={{ fontSize: '0.85rem' }}>Выбранный оттенок: </span>
              <span className="title-italic" style={{ color: 'var(--c-accent)', fontSize: '1.2rem', marginLeft: '0.5rem' }}>
                {selectedColor.name}
              </span>
            </div>
          </div>
        </section>

        {/* EVENT DETAILS & MAP */}
        <section ref={addToRefs(sectionsRef)} className="container text-center" style={{ padding: '1.5rem 1rem' }}>
          <div className="glass-panel" style={{ padding: '3.5rem 2rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '150px', height: '1px', background: 'linear-gradient(90deg, transparent, var(--c-accent), transparent)' }} />
            
            <Calendar style={{ margin: '0 auto 1.25rem', color: 'var(--c-accent)' }} />
            <h2 className="title-serif" style={{ fontSize: 'var(--fz-h3)', marginBottom: '1.25rem' }}>Детали торжества</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <p className="title-serif" style={{ fontSize: '2.2rem', color: 'var(--c-accent)' }}>Усадьба Братцево</p>
              <p className="text-body" style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.25rem' }}>г. Москва, Светлогорский проезд, д. 13</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                <Clock size={16} color="var(--c-accent)" />
                <span className="subtitle" style={{ marginBottom: 0, letterSpacing: '0.2em' }}>Сбор гостей в 15:30</span>
              </div>
            </div>

            {/* Добавить в календарь */}
            <div style={{ marginBottom: '2.5rem' }}>
              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ fontSize: '0.75rem', padding: '0.85rem 2rem' }}
              >
                <CalendarPlus size={16} />
                <span>Добавить в Google Календарь</span>
              </a>
            </div>
            
            <div style={{ width: '100%', height: '360px', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--c-border)', padding: '8px', background: '#fff' }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '14px', overflow: 'hidden' }}>
                <iframe src="https://yandex.ru/map-widget/v1/-/CTS1A2LP" width="100%" height="100%" frameBorder="0" allowFullScreen={true} style={{ filter: 'grayscale(0.2) opacity(0.95) contrast(1.05)' }} title="Map" />
              </div>
            </div>
          </div>
        </section>

        {/* GIFTS */}
        <section ref={addToRefs(sectionsRef)} className="container text-center" style={{ padding: '1.5rem 1rem' }}>
          <div className="glass-panel" style={{ padding: '3.5rem 2rem' }}>
            <Gift style={{ margin: '0 auto 1.25rem', color: 'var(--c-accent)' }} />
            <span className="subtitle">Пожелания</span>
            <h2 className="title-serif" style={{ fontSize: 'var(--fz-h3)', marginBottom: '1.25rem' }}>О подарках</h2>
            <p className="text-body" style={{ lineHeight: '1.9', maxWidth: '800px', margin: '0 auto' }}>
              Ваши улыбки, поддержка и присутствие в этот день — самый главный подарок для нас.<br /><br />
              Если вы хотите порадовать нас памятным сюрпризом, мы будем признательны за вклад в наше общее семейное будущее вместо живых цветов (они быстро увядают, а теплые воспоминания останутся навсегда).
            </p>
          </div>
        </section>

        {/* RSVP */}
        <section ref={addToRefs(sectionsRef)} className="container text-center" style={{ padding: '1.5rem 1rem 3rem' }}>
          <div className="glass-panel" style={{ padding: '3.5rem 2rem' }}>
            <span className="subtitle">RSVP</span>
            <h2 className="title-serif" style={{ fontSize: 'var(--fz-h2)', marginBottom: '1rem' }}>Подтверждение присутствия</h2>
            <p className="text-body" style={{ maxWidth: '700px', margin: '0 auto 2.5rem' }}>
              Пожалуйста, заполните небольшую форму до 1 августа 2027 года, чтобы мы могли учесть все пожелания.
            </p>

            {isSubmitted ? (
              <div style={{ padding: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <CheckCircle2 size={52} color="var(--c-accent)" />
                <h3 className="title-serif" style={{ fontSize: '2rem' }}>Спасибо за ответ!</h3>
                <p className="text-body">Мы записали ваш выбор и с нетерпением ждем встречи.</p>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', textAlign: 'left', maxWidth: '520px', margin: '0 auto' }}>
                <div>
                  <label className="subtitle" style={{ marginBottom: '0.5rem', display: 'block' }}>Ваши Фамилия и Имя</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Например: Александр и Анна Смирновы"
                    value={rsvpForm.name}
                    onChange={(e) => setRsvpForm({...rsvpForm, name: e.target.value})}
                    style={{ width: '100%', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid var(--c-border)', background: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-sans)', color: 'var(--c-text-main)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label className="subtitle" style={{ marginBottom: '0.5rem', display: 'block' }}>Сможете ли вы присутствовать?</label>
                  <div className="rsvp-switch">
                    <button
                      type="button"
                      className={`rsvp-switch-btn ${rsvpForm.attendance === 'yes' ? 'is-active' : ''}`}
                      onClick={() => setRsvpForm({...rsvpForm, attendance: 'yes'})}
                    >
                      С радостью буду(ем)
                    </button>
                    <button
                      type="button"
                      className={`rsvp-switch-btn ${rsvpForm.attendance === 'no' ? 'is-active' : ''}`}
                      onClick={() => setRsvpForm({...rsvpForm, attendance: 'no'})}
                    >
                      Не смогу
                    </button>
                  </div>
                </div>

                {rsvpForm.attendance === 'yes' && (
                  <div>
                    <label className="subtitle" style={{ marginBottom: '0.5rem', display: 'block' }}>Предпочтения по напиткам</label>
                    <select 
                      value={rsvpForm.alcohol}
                      onChange={(e) => setRsvpForm({...rsvpForm, alcohol: e.target.value})}
                      style={{ width: '100%', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid var(--c-border)', background: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-sans)', color: 'var(--c-text-main)', outline: 'none' }}
                    >
                      <option value="Вино красное/белое">Красное / Белое вино</option>
                      <option value="Крепкие напитки">Крепкие напитки</option>
                      <option value="Шампанское">Шампанское</option>
                      <option value="Безалкогольные напитки">Безалкогольные напитки</option>
                    </select>
                  </div>
                )}

                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <button type="submit" className="btn-primary" style={{ border: 'none', cursor: 'pointer', width: '100%' }}>
                    <span>Отправить ответ</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="text-center glass-panel" style={{ borderRadius: '0', borderLeft: 'none', borderRight: 'none', borderBottom: 'none', padding: '3.5rem 1rem' }}>
          <div className="container">
            <Users size={24} style={{ margin: '0 auto 0.75rem', color: 'var(--c-accent)' }} />
            <span className="subtitle">Организационные вопросы</span>
            <p className="text-body" style={{ fontSize: '0.9rem', marginBottom: '0.5rem', maxWidth: '600px', margin: '0 auto 0.5rem' }}>
              Если в день свадьбы у вас возникнут вопросы или вы будете опаздывать, пожалуйста, свяжитесь с нашим свадебным координатором:
            </p>
            <a href="https://t.me/coordinator_username" target="_blank" rel="noopener noreferrer" className="title-serif title-italic" style={{ color: 'var(--c-accent)', fontSize: '1.35rem', textDecoration: 'none' }}>
              Анастасия (Telegram)
            </a>
          </div>
        </footer>

      </div>
    </>
  );
}