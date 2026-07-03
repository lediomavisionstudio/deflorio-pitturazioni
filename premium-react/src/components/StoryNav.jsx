import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

const sections = [
  ['home', 'Home'],
  ['servizi', 'Servizi'],
  ['lavori', 'Look'],
  ['metodo', 'Metodo'],
  ['preventivo', 'Contatti'],
];

export function StoryNav() {
  const [active, setActive] = useState('home');
  const navRef = useRef(null);
  const linkRefs = useRef(new Map());
  const [spot, setSpot] = useState({ x: 8, width: 70 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.44 }
    );
    sections.forEach(([id]) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    const link = linkRefs.current.get(active);
    if (!nav || !link) return;
    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    setSpot({ x: linkRect.left - navRect.left, width: linkRect.width });
    link.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [active]);

  return (
    <nav className="story-nav" ref={navRef} aria-label="Sezioni rapide">
      <motion.span
        className="story-spotlight"
        animate={{ x: spot.x, width: spot.width }}
        transition={{ type: 'spring', stiffness: 380, damping: 34 }}
      />
      {sections.map(([id, label]) => (
        <a
          key={id}
          ref={node => node && linkRefs.current.set(id, node)}
          className={active === id ? 'story-link active' : 'story-link'}
          href={'#' + id}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
