"use client";

import { SketchButton } from "@/components/Button";
import { Wordmark } from "@/components/Logo";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { AuthField } from "@/components/auth/AuthField";
import { OrRule } from "@/components/auth/OrRule";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

export default function AuthPage() {
  const [focusedField, setFocusedField] = useState<
    "password" | "username" | "email"
  >("email");

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

  return (
    <main className="box-border flex h-full w-full flex-col bg-paper">
      <div className="flex items-center justify-between px-8 py-5">
        <Wordmark size={20} />
        <div className="font-body text-[12px] text-muted">← back to home</div>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex w-[380px] flex-col gap-[18px] rounded-[12px] border border-hair bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="text-center">
            <div className="mb-[10px] inline-flex">
              <Wordmark size={32} />
            </div>
            <div className="font-display text-[20px] font-medium tracking-[-0.4px] text-ink">
              Welcome to Nook
            </div>
          </div>
          <AuthTabs active={activeAuth} setActiveAuth={setActiveAuth} />
          {activeAuth === "signup" && (
            <AuthField
              value={email}
              onChange={handleEmail}
              label="Email"
              placeholder="jane@studio.co"
              type="email"
              focused={focusedField === "email"}
              onClick={() => setFocusedField("email")}
            />
          )}
          <AuthField
            value={username}
            onChange={handleUsername}
            label="Username"
            placeholder="jane_doe"
            type="username"
            focused={focusedField === "username"}
            onClick={() => setFocusedField("username")}
          />
          <AuthField
            value={password}
            onChange={handlePassword}
            label="Password"
            placeholder="secret"
            type="pw"
            focused={focusedField === "password"}
            onClick={() => setFocusedField("password")}
          />
          {error && (
            <div
              role="alert"
              className="rounded-[6px] border border-red-200 bg-red-50 px-3 py-2 font-body text-[12px] text-red-600"
            >
              {error}
            </div>
          )}
          <SketchButton
            disabled={isSubmitting}
            onClick={handleSubmit}
            primary
            className="w-full gap-2 py-3"
          >
            {isSubmitting && (
              <span
                aria-hidden
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
              />
            )}
            {isSubmitting
              ? "Please wait…"
              : activeAuth === "login"
              ? "Log in"
              : "Sign up"}
          </SketchButton>
          {/* <OrRule />
          <div className="flex gap-[10px]">
            <SketchButton className="flex-1">Google</SketchButton>
            <SketchButton className="flex-1">Apple</SketchButton>
          </div> */}
        </div>
      </div>
    </main>
  );
}
