import Curso from './curso.entity';
import Usuario from './usuario.entity';

export default class Professor extends Usuario {

  cursos?: Curso[];
  novaSenha?: string

  constructor() {
    super();
  }
}
