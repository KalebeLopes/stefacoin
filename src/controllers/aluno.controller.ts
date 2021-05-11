import Aluno from '../entities/aluno.entity';
import AlunoRepository from '../repositories/aluno.repository';
import { FilterQuery } from '../utils/database/database';
import BusinessException from '../utils/exceptions/business.exception';
import Mensagem from '../utils/mensagem';
import { Validador } from '../utils/utils';

export default class AlunoController {
  async obterPorId(id: number): Promise<Aluno> {
    Validador.validarParametros([{ id }]);

    let aluno = await AlunoRepository.obterPorId(id)

    if (aluno && aluno.tipo === 2) {
      delete aluno.senha
      return aluno
    } 

    throw new BusinessException('Aluno não existe'); 
  }

  async obter(filtro: FilterQuery<Aluno> = {}): Promise<Aluno> {
    return await AlunoRepository.obter(filtro);
  }

  // #pegabandeira
  async listar(filtro: FilterQuery<Aluno> = {}): Promise<Aluno[]> { // ok
    const alunosSerialized = (await AlunoRepository.listar(filtro)).map((aluno) => {
      delete aluno.senha
      return aluno
    });
    return alunosSerialized
  }

  // #pegabandeira
  async incluir(aluno: Aluno) {
    const { nome, formacao, idade, email, senha } = aluno;
    Validador.validarParametros([{ nome }, { formacao }, { idade }, { email }, { senha }]);
    aluno.tipo = 2

    const id = await AlunoRepository.incluir(aluno);
    return new Mensagem('Aluno incluido com sucesso!', {
      id,
    });
  }

  async alterar(id: number, aluno: Aluno) {
    const { nome, formacao, idade, email, senha } = aluno;
    Validador.validarParametros([
      { id }, { nome }, { formacao }, { idade }, { email }, { senha }
    ]);

    let getAluno = await this.obterPorId(id)

    if (getAluno.email !== aluno.email) {
      const alunoWithEmail = await this.obter({email: aluno.email})
      if (alunoWithEmail)
        throw new BusinessException('Email já cadastrado');
    }

    const alunoUpdated = {
      nome: nome,
      formacao: formacao,
      idade: idade,
      email: email,
      senha: senha,
      id: getAluno.id,
      tipo: getAluno.tipo
    }

    await AlunoRepository.alterar({ id }, alunoUpdated);
    return new Mensagem('Aluno alterado com sucesso!', {
      id,
    });
  }

  async excluir(id: number) {
    Validador.validarParametros([{ id }]);
    await this.obterPorId(id)
    await AlunoRepository.excluir({ id });
    return new Mensagem('Aluno excluido com sucesso!', {
      id,
    });
  }
}
