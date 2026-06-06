import { Router } from "express";
import { balance } from "../controllers/wallet.controller";
import { verificarToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/balance", verificarToken, balance);

export default router;
