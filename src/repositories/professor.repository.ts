import Professor from '../entities/professor.entity';
import BusinessException from '../utils/exceptions/business.exception';
import Repository from './repository';

import { FilterQuery } from '../utils/database/database';
import { Tables } from '../utils/tables.enum';
import { TipoUsuario } from '../utils/tipo-usuario.enum';
import { Validador } from '../utils/utils';

class ProfessorRepository extends Repository<Professor> {
  constructor() {     
    super(Tables.USUARIO);
  } 

  async incluir(professor: Professor) {
    const user = await super.obter({email: professor.email})

    if (user && user.email === professor.email) {
      throw new BusinessException('Email já cadastrado');
    }

    professor.senha = Validador.criptografarSenha(professor.senha);
    professor.tipo = TipoUsuario.PROFESSOR;
    return super.incluir(professor);
  }

  async alterar(filtro: FilterQuery<Professor>, professor: Professor) {
    if (professor.senha) {
      professor.senha = Validador.criptografarSenha(professor.senha);
    }
    return super.alterar(filtro, professor);
  } 
  
}

export default new ProfessorRepository();
