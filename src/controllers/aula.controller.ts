import Aula from '../models/aula.model';
import CursoRepository from '../repositories/curso.repository';
import BusinessException from '../utils/exceptions/business.exception';
import UnauthorizedException from '../utils/exceptions/unauthorized.exception';
import Mensagem from '../utils/mensagem';
import { Validador } from '../utils/utils';

export default class AulaController {
  async obterPorId(id: number, idCurso: number): Promise<Aula> {
    Validador.validarParametros([{ id }, { idCurso }]);
    const curso = await CursoRepository.obterPorId(idCurso);
    const aulas =  curso.aulas.find((a) => a.id === id);
    if(!aulas)
      throw new BusinessException('Aula não existe')

    return aulas

  }

  async listar(idCurso: number): Promise<Aula[]> {
    Validador.validarParametros([{ idCurso }]);
    const curso = await CursoRepository.obterPorId(idCurso);
    return curso.aulas;
  }

  async incluir(aula: Aula, tipo: number) {
    const { nome, duracao, topicos, idCurso } = aula;
    Validador.validarParametros([{tipo}, { nome }, { duracao }, { topicos }, { idCurso }]);

    if (tipo !== 1)
      throw new UnauthorizedException('Operação não autorizada')

    const curso = await CursoRepository.obterPorId(idCurso);

    if(!curso)
      throw new BusinessException('Curso não existe')

    curso.aulas.forEach((aula) => {
      if(aula.nome === nome.toLowerCase())
        throw new BusinessException('Aula já existe')
    })

    const idAnterior = curso.aulas[curso.aulas.length - 1].id;
    aula.id = idAnterior ? idAnterior + 1 : 1;
    aula.nome = aula.nome.toLowerCase()
    curso.aulas.push(aula);
    console.log(aula)

    await CursoRepository.alterar({ id: idCurso }, curso);

    return new Mensagem('Aula incluida com sucesso!', {
      id: aula.id,
      idCurso,
    });
  }

  async alterar(id: number, aula: Aula, tipo: number) {
    const { nome, duracao, topicos, idCurso } = aula;
    Validador.validarParametros([{tipo}, { id }, { idCurso }, { nome }, { duracao }, { topicos }]);

    if (tipo !== 1)
      throw new UnauthorizedException('Operação não autorizada')

    const curso = await CursoRepository.obterPorId(idCurso);
    if(!curso)
      throw new BusinessException('Curso não existe')
    
    curso.aulas.forEach((aula) => {
      if(aula.nome === nome.toLowerCase() && aula.id !== id)
        throw new BusinessException('Aula já existe')
    })

    curso.aulas.map((a) => {
      if (a.id === id) {
        aula.nome = aula.nome.toLowerCase()
        Object.keys(aula).forEach((k) => {
          a[k] = aula[k];
        });
      }
    });

    await CursoRepository.alterar({ id: idCurso }, curso);

    return new Mensagem('Aula alterado com sucesso!', {
      id,
      idCurso,
    });
  }

  async excluir(id: number, idCurso: number, tipo: number) {
    Validador.validarParametros([{ id }, { idCurso }, { tipo }]);

    if (tipo !== 1)
      throw new UnauthorizedException('Operação não autorizada')

    const curso = await CursoRepository.obterPorId(idCurso);

    curso.aulas = curso.aulas.filter((a) => a.id !== id);

    await CursoRepository.alterar({ id: idCurso }, curso);

    return new Mensagem('Aula excluido com sucesso!');
  }
}
