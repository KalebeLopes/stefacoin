import express, { NextFunction, Request, Response } from 'express';
import ProfessorController from '../controllers/professor.controller';
import Professor from '../entities/professor.entity';
import UnauthorizedException from '../utils/exceptions/unauthorized.exception';
import Mensagem from '../utils/mensagem';

const router = express.Router();

router.post('/professor', async (req: Request, res: Response, next: NextFunction) => { // ok
  try {
    const mensagem: Mensagem = await new ProfessorController().incluir(req.body);
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
});

router.put('/professor/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const idToken = req.uid.id
    const { id } = req.params;

    const mensagem: Mensagem = await new ProfessorController().alterar(Number(id), Number(idToken), req.body);
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
});

router.delete('/professor/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const { tipo } = req.uid
    const { id } = req.params;
    const mensagem: Mensagem = await new ProfessorController().excluir(Number(id), Number(tipo));
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
});

router.get('/professor/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    console.log(id)
    const professor: Professor = await new ProfessorController().obterPorId(Number(id));
    res.json(professor);
  } catch (e) {
    next(e);
  }
});

router.get('/professor', async (req: Request, res: Response, next: NextFunction) => { //ok
  try {
    const professores: Professor[] = await new ProfessorController().listar({tipo: 1});
    res.json(professores);
  } catch (e) {
    next(e);
  }
});

export default router;
