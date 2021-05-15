import Avaliacao from '../entities/avaliacao.entity';
import { Tables } from '../utils/tables.enum';
import Repository from './repository';

class AvaliacaoRepository extends Repository<Avaliacao> {
  constructor() {
    super(Tables.AVALIACAO);
  }
}

export default new AvaliacaoRepository();
