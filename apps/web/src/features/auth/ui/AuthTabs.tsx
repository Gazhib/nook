const TABS: ["signup" | "login", string][] = [
  ["login", "Log in"],
  ["signup", "Sign up"],
];

export const AuthTabs = ({
  active = "login",
  setActiveAuth,
  disabled = false,
}: {
  active?: "signup" | "login";
  setActiveAuth: (method: "signup" | "login") => void;
  disabled?: boolean;
}) => (
  <div
    role="group"
    aria-label="Account access"
    className="grid grid-cols-2 gap-1 rounded-xl border border-hair-2 bg-paper p-1"
  >
    {TABS.map(([key, label]) => (
      <button
        type="button"
        onClick={() => setActiveAuth(key)}
        key={key}
        aria-pressed={active === key}
        disabled={disabled}
        className={`min-h-10 cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-wait ${active === key ? "bg-white text-accent shadow-sm" : "text-muted hover:text-ink"}`}
      >
        {label}
      </button>
    ))}
  </div>
);
