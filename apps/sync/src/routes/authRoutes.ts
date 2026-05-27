import { Hono } from "hono";
import { authControllers } from "../controllers/authControllers";

export const authRoutes = new Hono();

authRoutes.post("/registration", authControllers.registration);
