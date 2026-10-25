"use client";

import { SketchButton } from "@/components/Button";
import { Wordmark } from "@/components/Logo";
import { TopDownRoom } from "@/components/TopDownRoom";
import { AuthTabs } from "@/features/auth/ui/AuthTabs";
import { AuthField } from "@/features/auth/ui/AuthField";
import { useAuth } from "@/features/auth/model/useAuth";
import Link from "next/link";

export default function AuthPage() {
  const {
    username,
    email,
    password,
    error,
    isSubmitting,
    activeAuth,
    setActiveAuth,
    handleEmail,
    handlePassword,
    handleUsername,
    handleSubmit,
  } = useAuth();
  const isSignup = activeAuth === "signup";

  return (
    <main className="flex min-h-svh flex-col bg-paper px-5 text-ink sm:px-10 lg:px-16">
      <header className="mx-auto flex w-full max-w-[1320px] items-center justify-between border-b border-hair py-6 sm:py-7">
        <Wordmark size={28} />
        <Link
          href="/"
          className="rounded py-2 text-xs font-medium text-muted transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          ← Back to home
        </Link>
      </header>
      <div className="mx-auto grid w-full max-w-[1160px] flex-1 items-center gap-14 py-12 sm:py-16 lg:grid-cols-2 lg:gap-24">
        <section className="mx-auto w-full max-w-[400px]">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
            A place for your plans
          </p>
          <h1 className="font-display text-[44px] leading-[1.08] tracking-[-0.045em] sm:text-[50px]">
            {isSignup ? "Make yourself at home." : "Welcome back."}
          </h1>
          <p className="mt-4 text-sm leading-6 text-muted">
            {isSignup
              ? "Create an account and give your ideas some room."
              : "Your next great space is right where you left it."}
          </p>
          <div className="mt-8">
            <AuthTabs
              active={activeAuth}
              setActiveAuth={setActiveAuth}
              disabled={isSubmitting}
            />
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void handleSubmit();
            }}
            className="mt-7 flex flex-col gap-5"
            aria-busy={isSubmitting}
          >
            {isSignup && (
              <AuthField
                value={email}
                onChange={handleEmail}
                label="Email address"
                name="email"
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
                disabled={isSubmitting}
              />
            )}
            <AuthField
              value={username}
              onChange={handleUsername}
              label="Username"
              name="username"
              placeholder="Your username"
              autoComplete="username"
              disabled={isSubmitting}
            />
            <div>
              <AuthField
                value={password}
                onChange={handlePassword}
                label="Password"
                name="password"
                placeholder={
                  isSignup ? "At least 8 characters" : "Your password"
                }
                type="password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                minLength={isSignup ? 8 : undefined}
                disabled={isSubmitting}
              />
              {isSignup && (
                <p className="mt-2 text-xs text-muted">
                  Use at least 8 characters.
                </p>
              )}
            </div>
            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-xs leading-5 text-red-700"
              >
                {error}
              </p>
            )}
            <SketchButton
              type="submit"
              disabled={isSubmitting}
              primary
              className="mt-1 min-h-12 w-full gap-3 text-sm"
            >
              {isSubmitting && (
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none"
                />
              )}
              {isSubmitting
                ? "Please wait…"
                : isSignup
                  ? "Create account"
                  : "Log in"}
              {!isSubmitting && <span aria-hidden="true">↗</span>}
            </SketchButton>
          </form>
          <p className="mt-7 text-center text-xs leading-5 text-muted">
            A little planning. A space that feels like you.
          </p>
        </section>
        <aside className="hidden min-w-0 overflow-hidden rounded-[24px] bg-[#e4e9df] p-8 lg:block xl:p-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
            Room for a fresh start
          </p>
          <h2 className="mt-5 max-w-[300px] font-display text-[40px] leading-[1.1] tracking-[-0.04em] text-accent">
            A good space
            <br />
            starts with an idea.
          </h2>
          <div
            aria-label="Example living room floor plan"
            role="img"
            className="pointer-events-none my-8 overflow-hidden rounded-xl border border-ink/10 bg-white p-2 [&>svg]:h-auto"
          >
            <TopDownRoom
              w={540}
              h={380}
              selectedId="table"
              showCursors={false}
            />
          </div>
          <div className="flex items-start gap-4 border-t border-accent/15 pt-6">
            <span
              aria-hidden="true"
              className="font-display text-3xl italic text-accent"
            >
              01
            </span>
            <div>
              <p className="text-sm font-medium text-accent">
                See the possibilities.
              </p>
              <p className="mt-1.5 max-w-[270px] text-xs leading-5 text-muted">
                Move things around, try a different layout, and find the
                arrangement that feels right.
              </p>
            </div>
          </div>
        </aside>
      </div>
      <footer className="mx-auto w-full max-w-[1320px] border-t border-hair py-5 text-center text-[11px] text-muted">
        Nook · A little room for possibility.
      </footer>
    </main>
  );
}
