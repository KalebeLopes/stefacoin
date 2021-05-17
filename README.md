** FUNCIONALIDADES: 

* Professor:
    - Listar -> listar todos os professores trazendo a informação de quais cursos eles lecionam - ok
        - Implementações:
            - trazer somente professores da tabela de usuario
            - tirar a senha do professor retornado
            - atribuir os cursos dos professores na resposta

    - Incluir -> incluir um professor seguindo as seguintes regras: Não permitir incluir com e-mail repetido, validar obrigatoriedade dos campos nome, email, senha, criptografar a senha antes de inserir na base utilizando os recursos já disponíveis no código - ok
        - Implementações:
            - verificação de email já cadastrado (usando o lowerCase)
            - verificar se a senha e a confirmação da senha batem
            - criptografar a senha
            - definir o tipo como professor
            - transformar o email passado em minusculo para salvar no banco

    - Alterar -> alterar um professor seguindo as seguintes regras: Não permitir alterar o e-mail, validar obrigatoriedade dos campos nome, senha, criptografar a senha antes de inserir na base utilizando os recursos já disponíveis no código, somente o próprio professor pode altera seus dados - ok
        - Implementações:
            - verificar se é o proprio professor logado que está fazendo a alteracao
            - verificação de existencia do professor com o id informado
            - verificar se a "senha anterior" informada bate com a atual senha do professor
            - criptografar a senha antes de salvar

    - Excluir -> excluir um professor seguindo as seguintes regras: Não permitir que o professor seja excluido caso esteja vinculado a algum curso, somente um professor pode excluir outro professor - ok
        - Implementações:
            - verificar se é um professor que está tentando fazer a exclusão
            - verificação de existencia do professor com o id informado
            - verificar se o professor está vinculado a algum curso

* Aluno:
    - Listar -> listar todos os alunos trazendo a informação de quais cursos eles estão matriculados - ok
        - Implementações:
            - trazer somente os alunos da tabela de usuario
            - tirar a senha do aluno retornado

    - Incluir -> incluir um aluno seguindo as seguintes regras: Não permitir incluir com e-mail repetido, validar obrigatoriedade dos campos nome, email, senha, formacao, idade, criptografar a senha antes de inserir na base utilizando os recursos já disponíveis no código - ok
        - Implementações:
            - verificacao de email ja cadastrado (usando o lowerCase)
            - criptografar a senha
            - definir o tipo como aluno
            - transformar o email passado em minusculo
            - salvar no banco

    - Alterar -> alterar um aluno seguindo as seguintes regras: Não permitir alterar o e-mail, validar obrigatoriedade dos campos nome, senha, criptografar a senha antes de inserir na base utilizando os recursos já disponíveis no código, somente o próprio aluno ou um professor pode altera seus dados - ok
        - Implementações:
            - verificar se quem esta alterando é um professor ou se é o proprio aluno
            - verificar se existe um aluno na tabela de usuarios com o id passado
            - alterar o aluno com base no que ele passou no body
            - criptografar a senha antes de salvar

    - Excluir -> excluir um aluno seguindo as seguintes regras: Não permitir que o aluno seja excluido caso esteja matriculado a algum curso, somente um professor pode excluir um aluno - ok
        - Implementações:
            - verificar se existe um aluno na tabela de usuarios com o id passado
            - verificar se é um professor que está excluindo o aluno
            - verificar se o aluno está matriculado em algum curso
            - excluir aluno

    - Matricular Curso -> matricular um aluno em um curso seguindo as seguintes regras: Não permitir que o aluno matricule-se mais de uma vez no mesmo curso - ok
        - Implementações:
            - Verificar se o aluno logado existe
            - Verificar se é um aluno mesmo atravez do tipo
            - Verificar se o curso existe
            - Verificar se o aluno já está matriculado no curso

* Curso:
    - Listar -> listar todos os cursos disponiveis -  ok

    - Incluir -> incluir um curso seguindo as seguintes regras: Não permitir incluir com nome repetido, validar obrigatoriedade dos campos nome, professor, aulas e descrição, somente um professor pode incluir um curso - ok
        - Implementações:
            - verificação de tipo (só professor pode criar)
            - verificação de existencia do professor com o id informado
            - verificação do nome do curso (em minúsculo)
            - definir os ids para as aulas passadas juntamente com a criação do curso com base no último id de curso cadastrado (pode inserir mais de uma aula)
            - validar os campos da aula
            - salvar as aulas em minúsculo
            - inserção do curso com o nome em minúsculo

    - Alterar -> alterar um curso seguindo as seguintes regras: Validar obrigatoriedade dos campos nome, professor, aulas e descrição, somente um professor pode alterar um curso - ok
        - Implementações:
            - verificação de tipo (só professor pode alterar)
            - verificar se o curso existe atraves do id passado
            - verificar se o professor existe atraves do id passado
            - verificar se o nome do cuso ja existe na tabela dos cursos caso o professor queira alterar o nome do curso (verifica em minusculo)

    - Excluir -> excluir um curso seguindo as seguintes regras: Não permitir que o curso seja excluido caso tenha alunos matriculados - ok

- Aula:
    - Listar -> listar todos as aulas de um determinado curso - ok
    - Incluir -> incluir uma aula seguindo as seguintes regras: Não permitir incluir com nome repetido, validar obrigatoriedade dos campos nome, duracao, curso e topicos, somente um professor pode incluir uma aula - ok
        - Implementações:
            - verificar se é um prof q está alterando
            - verificar se o curso existe
            - verificar se o nome da aula ja existe

    - Alterar -> alterar uma aula seguindo as seguintes regras: Validar obrigatoriedade dos campos nome, duracao, curso e topicos, somente um professor pode alterar uma aula - ok
        - Implementações:
            - verificar se é um prof q está alterando
            - verificar se o curso existe
            - verificar se esse curso ja tem essa aula
            - alterar a aula do curso

    - Excluir -> excluir uma aula seguindo as seguintes regras: somente um professor pode excluir uma aula - ok
        - Implementações:
            - verificar se é um prof q está excluindo

- Avaliação Curso
    - Criar funcionalidade para o aluno avaliar o curso seguindo as seguintes regras: a nota vai de 0 a 5, somente uma avaliação por aluno, o aluno pode alterar sua nota de avaliação, professor não pode avaliar o curso - ok
        - Implementações:
            - fazer avaliação:
                - verificar se não é um professor
                - verificar se quem está logado é diferente do id passado
                - verificar se o aluno existe
                - verificar se o curso existe
                - verificar se o aluno está matriculado no curso que quer alterar
                - verificar se o aluno ja avaliou o curso
            - alterar avaliação:
                - verificar se não é um professor
                - verificar se quem está logado é diferente do id passado
                - verificar se aluno existe
                - verificar se curso existe
                - verificar se a avaliacao existe pelo id
                - se a avaliação existir, verificar se os IDs da avaliação encontrada bate com os IDs passados
