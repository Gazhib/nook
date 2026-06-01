"use client";

import { SketchButton } from "@/components/Button";
import { Wordmark } from "@/components/Logo";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { AuthField } from "@/components/auth/AuthField";
import { OrRule } from "@/components/auth/OrRule";
import { useEffect, useState } from "react";

export default function AuthPage() {
  const [focusedField, setFocusedField] = useState<
    "password" | "username" | "email"
  >("email");

  const [activeAuth, setActiveAuth] = useState<"signup" | "login">("login");

  useEffect(() => {
    console.log(activeAuth);
  }, [activeAuth]);

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
              label="Email"
              placeholder="jane@studio.co"
              type="email"
              focused={focusedField === "email"}
              onClick={() => setFocusedField("email")}
            />
          )}
          <AuthField
            label="Username"
            placeholder="jane_doe"
            type="username"
            focused={focusedField === "username"}
            onClick={() => setFocusedField("username")}
          />
          <AuthField
            label="Password"
            placeholder="secret"
            type="pw"
            focused={focusedField === "password"}
            onClick={() => setFocusedField("password")}
          />
          <SketchButton primary className="w-full py-3">
            Sign up
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
