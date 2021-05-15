import express, { NextFunction, Request, Response } from 'express';
import AlunoController from '../controllers/aluno.controller';
import Aluno from '../entities/aluno.entity';
import Mensagem from '../utils/mensagem';

const router = express.Router();

router.post('/aluno', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mensagem: Mensagem = await new AlunoController().incluir(req.body);
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
});

router.put('/aluno/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const idToken = req.uid.id
    // @ts-ignore
    const { tipo } = req.uid
    const { id } = req.params;
    const mensagem: Mensagem = await new AlunoController().alterar(Number(id), Number(tipo), Number(idToken), req.body);
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
});

router.delete('/aluno/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const { tipo } = req.uid
    const { id } = req.params;
    const mensagem: Mensagem = await new AlunoController().excluir(Number(id), Number(tipo));
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
});

router.get('/aluno/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const aluno: Aluno = await new AlunoController().obterPorId(Number(id));
    res.json(aluno);
  } catch (e) {
    next(e);
  }
});

router.get('/aluno', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const alunos: Aluno[] = await new AlunoController().listar({tipo: 2});
    res.json(alunos);
  } catch (e) {
    next(e);
  }
});

router.post('/aluno/curso/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // @ts-ignore
    const idAluno = req.uid.id
    // @ts-ignore
    const {tipo} = req.uid

    const mensagem: Mensagem = await new AlunoController().addCurso(Number(id), Number(idAluno), Number(tipo));
    // console.log('aqui')
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
})

export default router;
