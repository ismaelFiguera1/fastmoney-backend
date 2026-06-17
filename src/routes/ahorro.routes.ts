import { Router } from "express";
import { getMeta, postMeta, deleteMeta, postAportar, postRetirar } from "../controllers/ahorro.controller";
import { verificarToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/", verificarToken, getMeta);
router.post("/", verificarToken, postMeta);
router.delete("/", verificarToken, deleteMeta);
router.post("/aportar", verificarToken, postAportar);
router.post("/retirar", verificarToken, postRetirar);

export default router;
