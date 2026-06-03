import { loginService, registerService } from "@/services/authService";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

export const useAuth = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [activeAuth, setActiveAuth] = useState<"signup" | "login">("login");

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dont forget to put some constraints, even though they have to be mainly in backend

  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async () => {
    if (username.trim().length < 5) {
      setError("Username length can't be less than 5 characters");
      return;
    } else if (password.trim().length < 8) {
      setError("Password length can't be less than 8 characters");
      return;
    } else if (!email.includes("@") && activeAuth === "signup") {
      setError("Email should include @");
      return;
    }

    setIsSubmitting(true);
    if (activeAuth === "signup")
      await registerService({ username, email, password });
    else await loginService({ username, password });
    setIsSubmitting(false);
    router.push("/");
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
