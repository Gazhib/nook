import { Hono } from "hono";
import { authControllers } from "../controllers/authControllers";
import { tokenMiddleware } from "../middleware/token";

export const authRoutes = new Hono();

authRoutes.post("/registration", authControllers.registration);
authRoutes.post("/login", authControllers.login);
authRoutes.get("/me", tokenMiddleware, authControllers.me);
