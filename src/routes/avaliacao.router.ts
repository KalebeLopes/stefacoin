import express, { NextFunction, Request, Response } from 'express';
import AlunoController from '../controllers/aluno.controller';
import Mensagem from '../utils/mensagem';

const router = express.Router();

router.post('/aluno/avaliacao', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const idToken = req.uid.id
    // @ts-ignore
    const {tipo} = req.uid

    const mensagem: Mensagem = await new AlunoController().avaliarCurso(req.body, Number(idToken), Number(tipo));
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
})

router.put('/aluno/avaliacao/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const idToken = req.uid.id
    // @ts-ignore
    const { tipo } = req.uid
    const { id } = req.params

    const mensagem: Mensagem = await new AlunoController().atualizarCurso(req.body, Number(id), Number(idToken), Number(tipo));
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
})

router.get('/aluno/avaliacao/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const idToken = req.uid.id
    // @ts-ignore
    const { tipo } = req.uid
    const { id } = req.params

    const mensagem: Mensagem = await new AlunoController().atualizarCurso(req.body, Number(id), Number(idToken), Number(tipo));
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
})

export default router
