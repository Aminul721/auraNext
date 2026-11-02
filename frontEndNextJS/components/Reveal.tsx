"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({
  children,
  className = "",
  delay,
}: {
  children: ReactNode;
  className?: string;
  delay?: "delay-1" | "delay-2" | "delay-3";
}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [observerEnabled, setObserverEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!("IntersectionObserver" in window) || !elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
    );

    observer.observe(elementRef.current);
    setObserverEnabled(true);
    return () => observer.disconnect();
  }, []);

  const classes = [
    "reveal-on-scroll",
    observerEnabled && "reveal-enabled",
    visible && "is-visible",
    delay,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={elementRef} className={classes}>
      {children}
    </div>
  );
}
