"use client";

import { SketchButton } from "@/components/Button";
import { Wordmark } from "@/components/Logo";
import { TopDownRoom } from "@/components/TopDownRoom";
import { createRoomService } from "@/services/roomServices";
import { getMeService } from "@/services/authService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const creating = useRef(false);

  useEffect(() => {
    let active = true;
    void getMeService().then((me) => {
      if (active) setIsAuthenticated(!!me);
    });
    return () => {
      active = false;
    };
  }, []);

  const handleStartRoom = async () => {
    if (isAuthenticated === null || creating.current) return;
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }
    creating.current = true;
    setIsCreating(true);
    setError(null);
    try {
      const roomId = await createRoomService();
      router.push(`/rooms/${roomId}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn’t create your room. Please try again.",
      );
    } finally {
      creating.current = false;
      setIsCreating(false);
    }
  };

  return (
    <main className="min-h-svh bg-paper px-5 text-ink sm:px-10 lg:px-16">
      <header className="mx-auto flex max-w-[1320px] items-center justify-between border-b border-hair py-6 sm:py-7">
        <Wordmark size={28} />
        <div className="flex items-center gap-7">
          <span className="hidden text-xs text-muted sm:block">
            A little room for possibility.
          </span>
          <Link
            href={isAuthenticated ? "/rooms" : "/auth"}
            className="rounded-lg border border-hair bg-white px-4 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            {isAuthenticated ? "My rooms" : "Log in"}
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-[1320px] items-center gap-12 py-14 sm:py-20 lg:min-h-[690px] lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 lg:py-16">
        <div className="max-w-[540px]">
          <p className="mb-6 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Your space. Your possibilities.
          </p>
          <h1 className="font-display text-[clamp(3.5rem,6.2vw,6rem)] leading-[0.99] tracking-[-0.055em]">
            Good things
            <br />
            start with
            <br />
            <span className="italic text-accent">a little space.</span>
          </h1>
          <p className="mt-7 max-w-[370px] text-[16px] leading-7 text-muted sm:text-[17px]">
            Make room for your ideas. Arrange your furniture, find the right
            fit, and plan it all together.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <SketchButton
              onClick={handleStartRoom}
              disabled={isCreating || isAuthenticated === null}
              primary
              className="min-h-12 gap-6 px-6 text-sm"
            >
              {isCreating ? "Creating your room…" : "Start a room"}
              <span aria-hidden="true">↗</span>
            </SketchButton>
            <Link
              href="/rooms"
              className="rounded px-1 py-3 text-sm font-medium text-ink underline decoration-hair underline-offset-4 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              See my rooms
            </Link>
          </div>
          {error && (
            <p
              role="alert"
              className="mt-4 max-w-sm text-sm leading-6 text-red-700"
            >
              {error}
            </p>
          )}
          <p className="mt-5 text-xs text-muted">
            A shared plan, before the heavy lifting.
          </p>
        </div>

        <figure className="relative min-w-0 rounded-[22px] bg-[#e4e9df] p-4 sm:p-7 lg:-mr-3 lg:p-8">
          <div className="mb-5 flex items-center justify-between px-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
              A space to make your own
            </span>
            <svg
              aria-hidden="true"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              className="text-accent"
            >
              <path d="M12 2v20M2 12h20M5 5l14 14M5 19 19 5" />
            </svg>
          </div>
          <div className="overflow-hidden rounded-xl border border-ink/10 bg-white shadow-[0_12px_32px_-18px_rgba(35,75,61,0.3)]">
            <div className="flex items-center justify-between border-b border-hair-2 px-4 py-4 sm:px-5">
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="grid h-8 w-8 place-items-center rounded-lg bg-accent/10 text-accent"
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z" />
                    <path d="M9 21v-8h6v8" />
                  </svg>
                </span>
                <span className="text-xs font-medium">The living room</span>
              </div>
              <span className="rounded-full bg-paper px-2.5 py-1 text-[10px] text-muted">
                Sample plan
              </span>
            </div>
            <div
              aria-label="Example floor plan with a sofa, table, armchair, and shared cursors"
              role="img"
              className="pointer-events-none px-1 py-6 [&>svg]:h-auto"
            >
              <TopDownRoom w={560} h={390} selectedId="table" />
            </div>
            <div className="flex items-center justify-between border-t border-hair-2 px-4 py-3 text-[10px] text-muted sm:px-5">
              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-accent"
                />
                Every idea has a place.
              </span>
              <span className="font-mono">4.40 × 2.80 m</span>
            </div>
          </div>
          <figcaption className="mt-5 flex items-center justify-between gap-4 px-1">
            <span className="font-display text-xl italic text-accent sm:text-2xl">
              A fresh perspective, from above.
            </span>
            <span aria-hidden="true" className="text-2xl text-accent">
              ↗
            </span>
          </figcaption>
        </figure>
      </section>

      <footer className="mx-auto flex max-w-[1320px] flex-col gap-4 border-t border-hair py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>Thoughtful spaces start with a simple plan.</p>
        <p>Independently built. Made for planning together.</p>
      </footer>
    </main>
  );
}
