import { Router } from "express";
import { balance, tasas } from "../controllers/wallet.controller";
import { verificarToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/balance/:moneda", verificarToken, balance);
router.get("/tasas", verificarToken, tasas);

export default router;
