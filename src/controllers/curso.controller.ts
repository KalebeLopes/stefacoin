import Curso from '../entities/curso.entity';
import ProfessorRepository from '../repositories/professor.repository'
import CursoRepository from '../repositories/curso.repository';
import { FilterQuery } from '../utils/database/database';
import Mensagem from '../utils/mensagem';
import { Validador } from '../utils/utils';
import BusinessException from '../utils/exceptions/business.exception';
import UnauthorizedException from '../utils/exceptions/unauthorized.exception';
import AulaController from './aula.controller';
import { formatDurationWithOptions } from 'date-fns/fp';


export default class CursoController {
  async obterPorId(id: number): Promise<Curso> {
    Validador.validarParametros([{ id }]);
    return await CursoRepository.obterPorId(id);
  }

  async obter(filtro: FilterQuery<Curso> = {}): Promise<Curso> {
    return await CursoRepository.obter(filtro);
  }

  async listar(filtro: FilterQuery<Curso> = {}): Promise<Curso[]> {
    return await CursoRepository.listar(filtro);
  }

  async incluir(curso: Curso, tipo: number) {
    console.log(tipo)
    const { nome, descricao, idProfessor, aulas } = curso;
    Validador.validarParametros([{ nome }, { descricao }, { idProfessor }, { tipo }, { aulas }]);
    
    if (tipo !== 1)
      throw new UnauthorizedException('Operação não autorizada')

    const findProfessor = await ProfessorRepository.obterPorId(idProfessor)
    if(!findProfessor)
      throw new BusinessException('Professor não existe')
      
    const nomeCurso = await CursoRepository.obter({nome: nome.toLowerCase()})
    if(nomeCurso)
      throw new BusinessException('Curso já cadastrado')

    const cursos = await CursoRepository.listar({})
    let idUltimoCurso: number = 0
    cursos[0] ? idUltimoCurso = cursos[cursos.length - 1].id : idUltimoCurso  // pegar o id do ultimo curso na tabela
    console.log(idUltimoCurso)

    for(let i: number = 1; i <= aulas.length; i++) {  
      const { nome, duracao, topicos } = aulas[i-1]

      Validador.validarParametros([{nome}, {duracao}, {topicos}]) // validando os campos obrigatorios de aula
      aulas[i-1].idCurso = idUltimoCurso + 1  // atribuindo o id do novo curso na aula
      aulas[i-1].id = i   // atribuindo os ids das aulas
    }

    console.log(curso)

    const id = await CursoRepository.incluir(curso)

    return new Mensagem('Curso incluido com sucesso!', {
      id,
    });
  }

  async alterar(id: number, tipo: number, curso: Curso) {
    console.log(tipo)
    const { nome, descricao, aulas, idProfessor } = curso;
    
    Validador.validarParametros([{ id }, { nome }, { descricao }, { aulas }, { idProfessor }, { tipo }]);

    if (tipo !== 1)
      throw new UnauthorizedException('Operação não autorizada')

    const findCursoById = await CursoRepository.obterPorId(id)
    if(!findCursoById)
      throw new BusinessException('Curso não existe')

    const findProfessor = await ProfessorRepository.obterPorId(idProfessor)
    if(!findProfessor)
      throw new BusinessException('Professor não existe')

    if (findCursoById.nome != nome){
      const findName = await CursoRepository.obter({nome: nome.toLowerCase()})   
      console.log(findName)
      if(findName)
        throw new BusinessException('Curso já existe')
    }
    
    await CursoRepository.alterar({ id }, curso);

    return new Mensagem('Curso alterado com sucesso!', {
      id,
    });
  }

  async excluir(id: number) {
    Validador.validarParametros([{ id }]);

    await CursoRepository.excluir({ id });

    return new Mensagem('Curso excluido com sucesso!', {
      id,
    });
  }
}
