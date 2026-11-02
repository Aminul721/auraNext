"use client";

import { useEffect, useRef, useState } from "react";

const navigation = [
  ["Home", "#home"],
  ["About", "#about"],
  ["Robotics", "#robotics"],
  ["Applications", "#applications"],
  ["Why Us", "#why-us"],
  ["Contact", "#contact"],
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 50);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="container nav-container">
        <div className="logo">
          <a href="#home" onClick={closeMenu}>
            AURA <span>HUMANOID TECH</span>
          </a>
        </div>
        <nav
          id="site-navigation"
          className="nav-links"
          data-open={menuOpen}
          aria-label="Main navigation"
        >
          {navigation.map(([label, href]) => (
            <a href={href} key={href} onClick={closeMenu}>
              {label}
            </a>
          ))}
          <a
            href="#contact"
            className="mobile-menu-cta btn btn-primary"
            onClick={closeMenu}
          >
            Talk to Us
          </a>
        </nav>
        <div className="nav-cta">
          <a href="#contact" className="btn btn-primary">
            Talk to Us
          </a>
        </div>
        <button
          ref={menuButtonRef}
          className={`mobile-menu-toggle${menuOpen ? " active" : ""}`}
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
