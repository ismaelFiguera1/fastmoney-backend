import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      usuario?: { id: number; email: string };
    }
  }
}

export function verificarToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Token no proporcionado" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const datos = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
      email: string;
    };
    req.usuario = { id: datos.id, email: datos.email };
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
}
