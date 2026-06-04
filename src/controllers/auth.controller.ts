import { Request, Response } from 'express';
import { registerUser } from '../services/auth.service';

export async function register(req: Request, res: Response) {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    res.status(400).json({ message: 'Nombre, email y contraseña son obligatorios' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    return;
  }

  try {
    const usuario = await registerUser(nombre, email, password);
    res.status(201).json({ message: 'Usuario registrado correctamente', user: usuario });
  } catch (error: any) {
    if (error.message === 'El email ya está registrado') {
      res.status(409).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}
