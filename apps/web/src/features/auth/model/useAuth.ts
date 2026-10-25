import { loginService, registerService } from "@/services/authService";
import { useRouter } from "next/navigation";
import { ChangeEvent, useRef, useState } from "react";

export const useAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeAuth, setAuthMode] = useState<"signup" | "login">("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitting = useRef(false);
  const router = useRouter();

  const setActiveAuth = (mode: "signup" | "login") => {
    if (submitting.current) return;
    setAuthMode(mode);
    setError(null);
  };

  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
  };

  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(null);
  };

  const handleUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setError(null);
  };

  const handleSubmit = async () => {
    if (submitting.current) return;
    if (!username.trim()) {
      setError("Enter your username.");
      return;
    }
    if (!password) {
      setError("Enter your password.");
      return;
    }
    if (activeAuth === "signup") {
      if (password.length < 8) {
        setError("Use a password with at least 8 characters.");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setError("Enter a valid email address.");
        return;
      }
    }

    submitting.current = true;
    setIsSubmitting(true);
    setError(null);
    try {
      if (activeAuth === "signup") {
        await registerService({ username, email: email.trim(), password });
      } else {
        await loginService({ username, password });
      }
      router.push("/rooms");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn’t sign you in. Please try again.",
      );
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
  };

  return {
    email,
    password,
    username,
    error,
    isSubmitting,
    activeAuth,
    setActiveAuth,
    handleEmail,
    handlePassword,
    handleUsername,
    handleSubmit,
  };
};
