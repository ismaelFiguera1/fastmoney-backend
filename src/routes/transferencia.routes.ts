import { Router } from "express";
import { transferir, historial } from "../controllers/transferencia.controller";
import { verificarToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/", verificarToken, transferir);
router.get("/historial", verificarToken, historial);

export default router;
