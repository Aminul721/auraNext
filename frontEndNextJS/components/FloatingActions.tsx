"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/Icons";

const whatsappUrl =
  "https://api.whatsapp.com/send/?phone=60102090179&text=Hello%2C%20I%20am%20interested%20in%20your%20Humanoid%20Robotics%20services.";

export function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setShowScrollTop(window.scrollY > 300);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return (
    <>
      <button
        type="button"
        className={`scroll-to-top${showScrollTop ? " show" : ""}`}
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <Icon name="arrow-up" />
      </button>
      <a
        href={whatsappUrl}
        className="floating-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with AURA HUMANOID TECH on WhatsApp"
      >
        <Icon name="whatsapp" />
      </a>
    </>
  );
}
