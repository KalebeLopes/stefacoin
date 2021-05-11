import Aluno from '../entities/aluno.entity';
import { FilterQuery } from '../utils/database/database';
import BusinessException from '../utils/exceptions/business.exception';
import { Tables } from '../utils/tables.enum';
import { TipoUsuario } from '../utils/tipo-usuario.enum';
import { Validador } from '../utils/utils';
import Repository from './repository';

class AlunoRepository extends Repository<Aluno> {
  constructor() {
    super(Tables.USUARIO);
  }

  async incluir(aluno: Aluno) {
    const user = await super.obter({email: aluno.email})

    if (user && user.email === aluno.email) {
      throw new BusinessException('Email já cadastrado');
    }
    
    aluno.senha = Validador.criptografarSenha(aluno.senha);
    aluno.tipo = TipoUsuario.ALUNO;
    return super.incluir(aluno);
  }

  async alterar(filtro: FilterQuery<Aluno>, aluno: Aluno) {
    if (aluno.senha) {
      aluno.senha = Validador.criptografarSenha(aluno.senha);
    }
    return super.alterar(filtro, aluno);
  }
}

export default new AlunoRepository();
