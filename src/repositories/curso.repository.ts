import Curso from '../entities/curso.entity';
import { FilterQuery } from '../utils/database/database';
import { Tables } from '../utils/tables.enum';
import Repository from './repository';

class CursoRepository extends Repository<Curso> {
  constructor() {
    super(Tables.CURSO);
  }

  async incluir(curso: Curso){
    curso.nome = curso.nome.toLowerCase()
  
    return super.incluir(curso)
  }

  async alterar(id: FilterQuery<Curso>, curso: Curso){
    curso.nome = curso.nome.toLowerCase()
  
    return super.alterar(id, curso)
  }

}

export default new CursoRepository();
