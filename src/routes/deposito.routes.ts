import { Router } from "express";
import { depositar, historialDepositos } from "../controllers/deposito.controller";
import { verificarToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/", verificarToken, depositar);
router.get("/historial", verificarToken, historialDepositos);

export default router;
