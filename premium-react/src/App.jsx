import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Lenis from 'lenis';
import { motion } from 'motion/react';
import { ArrowRight, Paintbrush, ShieldCheck, Sparkles } from 'lucide-react';
import { HeroScene } from './components/HeroScene';
import { StoryNav } from './components/StoryNav';
import { Button } from './components/ui/Button';
import './styles.css';

function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.08, smoothWheel: true, wheelMultiplier: 0.88 });
    let rafId;
    const raf = time => { lenis.raf(time); rafId = requestAnimationFrame(raf); };
    rafId = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(rafId); lenis.destroy(); };
  }, []);
}

export default function App() {
  const root = useRef(null);
  useLenis();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-reveal]', {
        y: 28,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root}>
      <header className="top-logo">
        <img src="/assets/logo-deflorio.png" alt="Deflorio Pitturazioni" />
      </header>
      <StoryNav />

      <main>
        <section className="hero section-watch" id="home">
          <div className="hero-bg" />
          <HeroScene />
          <div className="hero-copy">
            <p className="eyebrow" data-reveal>Deflorio Pitturazioni</p>
            <h1 data-reveal>Pareti precise. Effetto memorabile.</h1>
            <p data-reveal>Un sito premium per un lavoro che deve comunicare fiducia, ordine e cura artigianale fin dal primo sguardo.</p>
            <div className="hero-actions" data-reveal>
              <Button>Richiedi preventivo <ArrowRight size={18} /></Button>
              <Button variant="ghost">Guarda i servizi</Button>
            </div>
          </div>
        </section>

        <section className="section services section-watch" id="servizi">
          <p className="eyebrow">Servizi</p>
          <h2>Finiture pulite, materiali corretti, ambienti protetti.</h2>
          <div className="cards">
            {[
              [Paintbrush, 'Interni', 'Imbiancature, pitture lavabili, antimuffa e tinte su misura.'],
              [ShieldCheck, 'Esterni', 'Facciate, balconi, fondi protettivi e superfici esposte.'],
              [Sparkles, 'Decorativi', 'Effetti materici, velature, smalti e dettagli su misura.'],
            ].map(([Icon, title, text]) => (
              <motion.article className="premium-card" key={title} whileHover={{ y: -8 }}>
                <Icon />
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="section dark section-watch" id="lavori">
          <p className="eyebrow">Look</p>
          <h2>Qui possiamo costruire la parte più scenografica del portfolio.</h2>
        </section>

        <section className="section section-watch" id="metodo">
          <p className="eyebrow">Metodo</p>
          <h2>Sopralluogo, preparazione, applicazione, consegna pulita.</h2>
        </section>

        <section className="section quote section-watch" id="preventivo">
          <p className="eyebrow">Preventivo</p>
          <h2>Raccontaci il lavoro e ti richiamiamo.</h2>
        </section>
      </main>
    </div>
  );
}
