import Professor from '../entities/professor.entity';
import CursoRepository from '../repositories/curso.repository';
import ProfessorRepository from '../repositories/professor.repository';
import { FilterQuery } from '../utils/database/database';
import BusinessException from '../utils/exceptions/business.exception';
import UnauthorizedException from '../utils/exceptions/unauthorized.exception';
import Mensagem from '../utils/mensagem';
import { Validador } from '../utils/utils';

export default class ProfessorController {
  async obterPorId(id: number): Promise<Professor> { // ok
    Validador.validarParametros([{ id }]);

    let professor = await ProfessorRepository.obterPorId(id);

    if(!professor)
      throw new BusinessException('Professor não existe'); 

    return professor
  }

  async obter(filtro: FilterQuery<Professor> = {}): Promise<Professor> {
    return await ProfessorRepository.obter(filtro);
  }

  // #pegabandeira 
  async listar(filtro: FilterQuery<Professor> = {}): Promise<Professor[]> { // ok
    const professores = await ProfessorRepository.listar(filtro)

    let professoresSerialized = await Promise.all(
      professores.map(async (professor) => {
        professor.cursos = await CursoRepository.listar({ idProfessor: professor.id })
        delete professor.senha
        
        return professor
      })
    )

    return professoresSerialized
  }

  // #pegabandeira
  async incluir(professor: Professor) { // ok
    const { nome, email, senha } = professor;
    Validador.validarParametros([{ nome }, { email }, { senha }]);

    const user = await ProfessorRepository.obter({email: email.toLowerCase()})
    
    if (user) {
      throw new BusinessException('Email já cadastrado');
    }

    const id = await ProfessorRepository.incluir(professor);

    return new Mensagem('Professor incluido com sucesso!', {
      id,
    });
  }

  async alterar(id: number, idToken: number, professor: Professor) { // ok
    console.log(idToken)
    const { nome, senha } = professor;

    Validador.validarParametros([{ id }, { idToken }, { nome }, { senha }]);

    if(idToken != id) 
      throw new UnauthorizedException('Operação não autorizada')

    let prof = await ProfessorRepository.obterPorId(id)

    if(!prof)
      throw new BusinessException('Professor não existe')

    // if (prof.email !== email) {  caso queira alterar o email, verifico se ja tem alguem com esse email
    //   const profWithEmail = await ProfessorRepository.obter({email: email})
    //   if (profWithEmail)
    //     throw new BusinessException('Email já cadastrado');
    // }

    const profUpdated = {
      nome: nome,
      email: prof.email,
      senha: senha,
      id: prof.id,
      tipo: prof.tipo
    }

    await ProfessorRepository.alterar({ id }, profUpdated);
    return new Mensagem('Professor alterado com sucesso!', {
      id,
    });

  }

  async excluir(id: number, tipo: number) { // ok
    console.log(tipo)
    Validador.validarParametros([{ id }, { tipo }]);
    
    if(tipo != 1)
      throw new UnauthorizedException('Operação não autorizada')

    const professor = await ProfessorRepository.obterPorId(id)
    if(!professor)
      throw new BusinessException('Professor não existe')

    const professorVinculadoCurso = await CursoRepository.obter({idProfessor: id})
    if (professorVinculadoCurso)
      throw new BusinessException('Professor está vinculado a um curso')


    await ProfessorRepository.excluir({ id });

    return new Mensagem('Professor excluido com sucesso!', {
      id,
    });
  }
}
