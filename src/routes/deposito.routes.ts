import { Router } from "express";
import { depositar } from "../controllers/deposito.controller";
import { verificarToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/", verificarToken, depositar);

export default router;
