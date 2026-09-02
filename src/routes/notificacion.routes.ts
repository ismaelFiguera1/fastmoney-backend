import { Router } from "express";
import { getNotificaciones, patchMarcarLeidas } from "../controllers/notificacion.controller";
import { verificarToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/", verificarToken, getNotificaciones);
router.patch("/leidas", verificarToken, patchMarcarLeidas);

export default router;