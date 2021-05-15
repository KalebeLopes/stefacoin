import Aluno from '../entities/aluno.entity';
import { FilterQuery } from '../utils/database/database';
import { Tables } from '../utils/tables.enum';
import { TipoUsuario } from '../utils/tipo-usuario.enum';
import { Validador } from '../utils/utils';
import Repository from './repository';

class AlunoRepository extends Repository<Aluno> {
  constructor() {
    super(Tables.USUARIO);
  }

  async incluir(aluno: Aluno) {
    aluno.senha = Validador.criptografarSenha(aluno.senha);
    aluno.tipo = TipoUsuario.ALUNO;
    aluno.email = aluno.email.toLowerCase()
    aluno.cursos = []
    return super.incluir(aluno);
  }

  async alterar(filtro: FilterQuery<Aluno>, aluno: Aluno) {
    if (aluno.senha) {
      aluno.senha = Validador.criptografarSenha(aluno.senha);
    }
    return super.alterar(filtro, aluno);
  }

  async obterPorId(id: number){ //sem senha
    let aluno = await super.obterPorId(id)

    if (aluno && aluno.tipo === 2) {
      // delete aluno.senha
      return aluno
    } 

    return null
  }

  async obterPorIdSenha(id: number){ //sem senha
    let aluno = await super.obterPorId(id) 

    return aluno
  }
}

export default new AlunoRepository();
