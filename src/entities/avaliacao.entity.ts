import Entity from './entity';

export default class Avaliacao extends Entity {
  idAluno: number
  idCurso: number
  nota: number

  constructor() {
    super();
  }
}
