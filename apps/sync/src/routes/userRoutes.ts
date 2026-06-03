import { Hono } from "hono";
import { userControllers } from "../controllers/userControllers";
import { tokenMiddleware } from "../middleware/token";

export const userRoutes = new Hono();

userRoutes.use("/", tokenMiddleware);

userRoutes.get("/", userControllers.getUserById);
