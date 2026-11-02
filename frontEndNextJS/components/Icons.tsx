type IconName =
  | "chip"
  | "robot"
  | "shield"
  | "star"
  | "settings"
  | "globe"
  | "briefcase"
  | "pin"
  | "mail"
  | "whatsapp"
  | "arrow-up"
  | "play";

export function Icon({ name }: { name: IconName }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {name === "chip" && (
        <path d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 7h10v10H7zM10 10h4v4h-4z" />
      )}
      {name === "robot" && (
        <>
          <path d="M12 3v2m-2 0h4M7 9h10v8H7zM5 11H3v4h4m12-4h2v4h-4M9 20h6" />
          <circle cx="10" cy="12" r=".7" fill="currentColor" />
          <circle cx="14" cy="12" r=".7" fill="currentColor" />
          <path d="M10 15h4" />
        </>
      )}
      {name === "shield" && (
        <>
          <path d="m12 3 8 4v5c0 4.5-3.4 7.8-8 9-4.6-1.2-8-4.5-8-9V7l8-4Z" />
          <path d="m9 12 2 2 4-4" />
        </>
      )}
      {name === "star" && (
        <path d="m12 3 2.8 6 6.2.7-4.6 4.1 1.3 6.2-5.7-3.2-5.7 3.2 1.3-6.2L3 9.7 9.2 9 12 3Z" />
      )}
      {name === "settings" && (
        <>
          <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
          <path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.5.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.5-.9l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.8l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.5-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.5.9l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 1.7Z" />
        </>
      )}
      {name === "globe" && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18m0-18a14 14 0 0 0 0 18" />
        </>
      )}
      {name === "briefcase" && (
        <>
          <rect x="3" y="7" width="18" height="14" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18m-11 0v2h4v-2" />
        </>
      )}
      {name === "pin" && (
        <>
          <path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        </>
      )}
      {name === "mail" && (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </>
      )}
      {name === "whatsapp" && (
        <path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.7a8.5 8.5 0 1 1 16.3-3.8ZM8.5 9.2c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4 0 .6l-.5.7c-.2.2-.2.4 0 .6.4.7 1.2 1.5 2 1.9.2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1l1.6.8c.2.1.3.3.3.5 0 .3-.2 1-.7 1.4-.5.4-1.2.6-2 .4-1-.2-2.2-.8-3.5-2-1.1-1-1.9-2.3-2.1-3.2-.2-.9.1-1.7.6-2.2Z" />
      )}
      {name === "arrow-up" && <path d="m6 14 6-6 6 6" />}
      {name === "play" && <path d="m9 6 9 6-9 6V6Z" />}
    </svg>
  );
}
