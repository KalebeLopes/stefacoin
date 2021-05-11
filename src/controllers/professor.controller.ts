import Professor from '../entities/professor.entity';
import ProfessorRepository from '../repositories/professor.repository';
import { FilterQuery } from '../utils/database/database';
import BusinessException from '../utils/exceptions/business.exception';
import Mensagem from '../utils/mensagem';
import { Validador } from '../utils/utils';

export default class ProfessorController {
  async obterPorId(id: number): Promise<Professor> { // ok
    Validador.validarParametros([{ id }]);

    let professor = await ProfessorRepository.obterPorId(id);

    if (professor && professor.tipo === 1) {
      delete professor.senha
      return professor
    } 

    throw new BusinessException('Parâmetro inválido');
  }

  async obter(filtro: FilterQuery<Professor> = {}): Promise<Professor> {
    return await ProfessorRepository.obter(filtro);
  }

  // #pegabandeira 
  async listar(filtro: FilterQuery<Professor> = {}): Promise<Professor[]> { // ok
    const professoresSerialized = (await ProfessorRepository.listar(filtro)).map((professor) => {
      delete professor.senha
      return professor
    });
    // console.log(professoresSerialized)
    return professoresSerialized
  }

  // #pegabandeira
  async incluir(professor: Professor) { // ok
    const { nome, email, senha } = professor;

    Validador.validarParametros([{ nome }, { email }, { senha }]);
    professor.tipo = 1;

    const id = await ProfessorRepository.incluir(professor);

    return new Mensagem('Professor incluido com sucesso!', {
      id,
    });
  }

  async alterar(id: number, professor: Professor) { // ok
    const { nome, email, senha } = professor;
    // console.log('aq')
    Validador.validarParametros([{ id }, { nome }, { email }, { senha }]);

    let prof = await this.obterPorId(id)

    if (prof.email !== email) {
      const profWithEmail = await this.obter({email: email})
      if (profWithEmail)
        throw new BusinessException('Email já cadastrado');
    }

    const profUpdated = {
      nome: nome,
      email: email,
      senha: senha,
      id: prof.id,
      tipo: prof.tipo
    }

    await ProfessorRepository.alterar({ id }, profUpdated);
    return new Mensagem('Professor alterado com sucesso!', {
      id,
    });

  }

  async excluir(id: number) { // ok
    Validador.validarParametros([{ id }]);
    
    await this.obterPorId(id)
    await ProfessorRepository.excluir({ id });

    return new Mensagem('Professor excluido com sucesso!', {
      id,
    });
  }
}
