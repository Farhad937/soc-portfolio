"use client";

import { Children, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

export default function ScrollRevealGrid({ children, className, stagger = 140 }: { children: ReactNode; className: string; stagger?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      return;
    }

    const grid = ref.current;
    if (!grid) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`scroll-reveal-grid ${className}`} data-revealed={revealed}>
      {Children.toArray(children).map((child, index) => (
        <div key={index} className="scroll-reveal-item" style={{ "--reveal-delay": `${index * stagger}ms` } as CSSProperties}>
          {child}
        </div>
      ))}
    </div>
  );
}
