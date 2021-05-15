import Aluno from '../entities/aluno.entity';
import Avaliacao from '../entities/avaliacao.entity';
import alunoRepository from '../repositories/aluno.repository';
import AlunoRepository from '../repositories/aluno.repository';
import AvaliacaoRepository from '../repositories/avaliacao.repository';
import CursoRepository from '../repositories/curso.repository';
import { FilterQuery } from '../utils/database/database';
import BusinessException from '../utils/exceptions/business.exception';
import UnauthorizedException from '../utils/exceptions/unauthorized.exception';
import Mensagem from '../utils/mensagem';
import { Validador } from '../utils/utils';

export default class AlunoController {
  async obterPorId(id: number): Promise<Aluno> {
    Validador.validarParametros([{ id }]);

    let aluno = await AlunoRepository.obterPorId(id)

    if(!aluno)
      throw new BusinessException('Aluno não existe'); 
    
    delete aluno.senha

    return aluno
  }

  async obter(filtro: FilterQuery<Aluno> = {}): Promise<Aluno> {
    return await AlunoRepository.obter(filtro);
  }

  // #pegabandeira
  async listar(filtro: FilterQuery<Aluno> = {}): Promise<Aluno[]> { // ok
    const alunosSerialized = (await AlunoRepository.listar(filtro)).map((aluno) => {
      delete aluno.senha
      return aluno
    });
    return alunosSerialized
  }

  // #pegabandeira
  async incluir(aluno: Aluno) {
    const { nome, formacao, idade, email, senha } = aluno;
    Validador.validarParametros([{ nome }, { formacao }, { idade }, { email }, { senha }]);
    Validador.validarTamanhoSenha(senha)

    const user = await this.obter({email: email.toLowerCase()})

    if (user) {
      throw new BusinessException('Email já cadastrado');
    }

    const id = await AlunoRepository.incluir(aluno);
    return new Mensagem('Aluno incluido com sucesso!', {
      id,
    });
  }

  async alterar(id: number, tipo: number, idToken: number, aluno: Aluno) {
    console.log(tipo)
    console.log(idToken)
    const { nome, formacao, idade, senha, cursos, novaSenha } = aluno;
    Validador.validarParametros([
      { id }, { nome }, { senha }, { idToken }, { novaSenha }
    ]);

    if (tipo === 2 && idToken !== id)
      throw new UnauthorizedException('Operação não autorizada')
    
    let getAluno = await AlunoRepository.obterPorId(id)

    if(!getAluno)
      throw new BusinessException('Aluno não existe')

    console.log(getAluno)

    Validador.validarTamanhoSenha(novaSenha)
    // Validador.validarSenha(senha, getAluno.senha)

    // if (getAluno.email !== aluno.email) { // verificar se o email já está em uso
    //   const alunoWithEmail = await this.obter({email: aluno.email})
    //   if (alunoWithEmail)
    //     throw new BusinessException('Email já cadastrado');
    // }

    const alunoUpdated = {
      nome: nome,
      formacao: formacao?formacao:getAluno.formacao,
      idade: idade?idade:getAluno.idade,
      email: getAluno.email,
      senha: novaSenha,
      id: getAluno.id,
      tipo: getAluno.tipo,
      cursos: cursos?cursos:[]
    }

    await AlunoRepository.alterar({ id }, alunoUpdated);
    return new Mensagem('Aluno alterado com sucesso!', {
      id,
    });
  }

  async excluir(id: number, tipo: number) {
    console.log(tipo)
    Validador.validarParametros([{ id }, { tipo }]);
    const getAluno = await AlunoRepository.obterPorId(id)

    if(tipo !== 1)
      throw new UnauthorizedException('Operação não autorizada');

    if(!getAluno)
      throw new BusinessException('Aluno não existe');

    if(getAluno.cursos.length > 0)
      throw new BusinessException('Aluno está matriculado');

    await AlunoRepository.excluir({ id });
    return new Mensagem('Aluno excluido com sucesso!', {
      id,
    });
  }

  async addCurso(idCurso: number, idAluno: number, tipo: number) {
    console.log(idAluno)
    Validador.validarParametros([{ idCurso }, { idAluno }, { tipo }]);
    
    let aluno: Aluno = await AlunoRepository.obterPorIdSenha(idAluno) 
    console.log(aluno)

    if(!aluno)
      throw new BusinessException('Aluno não existe');
    
    if (tipo !== 2)
      throw new UnauthorizedException('Operação não autorizada')

    const curso = await CursoRepository.obterPorId(idCurso)
    if (!curso) 
      throw new BusinessException('Curso não existe');
    
    if (aluno.cursos.length > 0){
      aluno.cursos.forEach((curso) => {
        if(curso.id===idCurso)
          throw new BusinessException('Aluno já matriculado');
      })
    }
    
    aluno.cursos.push(curso)
    aluno.novaSenha = aluno.senha
    
    this.alterar(idAluno, tipo, idAluno, aluno)

    return new Mensagem('Aluno matriculado com sucesso!', {
      idAluno,
    });
  }

  async avaliarCurso(avaliacao: Avaliacao, idToken: number, tipo: number){
    const { idAluno, idCurso, nota } = avaliacao;
    Validador.validarParametros([{ idAluno }, { idCurso }, { nota }, { tipo }]);

    console.log(avaliacao)

    if(tipo != 2)
      throw new UnauthorizedException('Operação não autorizada')

    if(idToken !== idAluno)
      throw new UnauthorizedException('Operação não autorizada')

    if(avaliacao.nota > 5)
      throw new BusinessException('Nota deve ser menor que 5');

    const aluno = await AlunoRepository.obterPorId(idAluno)
    if(!aluno)
      throw new BusinessException('Aluno não existe');

    const curso = await CursoRepository.obterPorId(idCurso)
    if(!curso)
      throw new BusinessException('Curso não existe');

    const getAluno = await AlunoRepository.obterPorId(idAluno)
    console.log(getAluno)
    const alunoMatriculado = getAluno.cursos.find(curso => curso.id === idCurso)
    console.log(alunoMatriculado)

    if(!alunoMatriculado)
      throw new BusinessException('Aluno nao matriculado nesse curso');

    const verificarAvaliacao = await AvaliacaoRepository.obter({idAluno: {$eq: idAluno}, idCurso: {$eq: idCurso}})
    console.log(verificarAvaliacao)
    if(verificarAvaliacao)
      throw new BusinessException('Avaliação já realizada');

    AvaliacaoRepository.incluir(avaliacao)
    return new Mensagem('Curso avaliado!', {
      idAluno
    });
  }

  async atualizarCurso(avaliacao: Avaliacao, id: number, idToken: number, tipo: number){
    const { idAluno, idCurso, nota } = avaliacao;
    Validador.validarParametros([{ idAluno }, { idCurso }, { nota }, { tipo }]);

    if(tipo != 2)
      throw new UnauthorizedException('Operação não autorizada')

    if(idToken !== idAluno)
      throw new UnauthorizedException('Operação não autorizada')

    const aluno = await AlunoRepository.obterPorId(idAluno)
    if(!aluno)
      throw new BusinessException('Aluno não existe');

    const curso = await CursoRepository.obterPorId(idCurso)
    if(!curso)
      throw new BusinessException('Curso não existe');
    
    const verificarAvaliacao = await AvaliacaoRepository.obter({id: {$eq: id}})
    
    console.log(verificarAvaliacao)

    if(!verificarAvaliacao || verificarAvaliacao.idAluno !== avaliacao.idAluno || verificarAvaliacao.idCurso !== avaliacao.idCurso)
      throw new BusinessException('Avaliação invalida');

    AvaliacaoRepository.alterar({id} ,avaliacao)
    return new Mensagem('Curso avaliado!', {
      idAluno
    });
  }

}
