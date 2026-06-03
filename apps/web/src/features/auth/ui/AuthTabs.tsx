const TABS: ["signup" | "login", string][] = [
  ["signup", "Sign up"],
  ["login", "Log in"],
];

export const AuthTabs = ({
  active = "signup",
  setActiveAuth,
}: {
  active?: "signup" | "login";
  setActiveAuth: (method: "signup" | "login") => void;
}) => {
  return (
    <div className="flex gap-1 border-b border-hair-2">
      {TABS.map(([k, l]) => {
        const isActive = active === k;
        return (
          <div
            onClick={() => setActiveAuth(k)}
            key={k}
            className={`-mb-px mr-4 border-b-2 px-1 py-2 font-display
               text-[14px] cursor-pointer 
               transform transition-color duration-200
               
               ${
              isActive
                ? "border-accent font-medium text-ink"
                : "border-transparent font-normal text-muted"
            }`}
          >
            {l}
          </div>
        );
      })}
    </div>
  );
};
