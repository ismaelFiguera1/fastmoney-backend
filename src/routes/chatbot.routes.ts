import { Router } from "express";
import { chatbot } from "../controllers/chatbot.controller";
import { verificarToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/", chatbot);

export default router;