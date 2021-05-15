import Curso from './curso.entity';
import Usuario from './usuario.entity';

export default class Aluno extends Usuario {
  idade: string;
  formacao: string;
  novaSenha?: string; 
  cursos?: Curso[];

  constructor() {
    super();
  }
}
