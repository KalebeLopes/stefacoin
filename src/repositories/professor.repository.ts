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
    professor.senha = Validador.criptografarSenha(professor.senha);
    professor.tipo = TipoUsuario.PROFESSOR;
    professor.email = professor.email.toLowerCase()

    return super.incluir(professor);
  }

  async alterar(filtro: FilterQuery<Professor>, professor: Professor) {
    if (professor.senha) {
      professor.senha = Validador.criptografarSenha(professor.senha);
    }
    return super.alterar(filtro, professor);
  } 

  async obterPorId(id: number){
    let professor = await super.obterPorId(id)

    if (professor && professor.tipo === 1) {
      // delete professor.senha // arrumar isso
      return professor
    } 

    return null
  }
  
}

export default new ProfessorRepository();
