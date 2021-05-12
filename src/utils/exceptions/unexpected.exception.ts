import Exception from './exception';

export default class UnexpectedException extends Exception {
  constructor(message: string, status: number = 500) {
    super(message, status);
  }
}
