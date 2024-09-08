# Bem vindo(a)
Esta é uma aplicação Angular com GraphQL e Apollo Client.

#### Aqui está o [Back-end](https://github.com/filiperv7/desafio-gen-backend/) desta aplicação.

A aplicação tem como foco ajudar nos estudos dos devs, com a oportunidade de tirar dúvidas com pessoas mais experiêntes. Funciona assim:
- crie sua conta;
- faça login;
- navegue pelas perguntas existentes; ou
- faça um nova pergunta;
- você também pode responder perguntas.

## Regras de negócio
1. Os recursos de perguntas e respostas só estão disponíveis para usuários autenticados com um token JWT válido.
2. Para criar uma pergunta o usuário deve, obrigatóriamente, preeencher o titulo, descrição e alguma tag.
3. Para criar uma pergunta é obrigatório adicionar pelo menos 1 tag relacionada ao assunto e no máximo 3.
4. Uma pergunta só pode ser editada pelo seu próprio autor.
5. Uma pergunta só pode ser editada se ainda não tiver nenhuma resposta.
6. Ao editar uma pergunta, todas as regras de criação são válidas aqui também.
7. Uma pergunta só pode ser excluída pelo seu próprio autor.
8. Ao excluir uma pergunta, suas respostas, caso existam, também são excluídas do banco.
9. Você pode responder as perguntas de qualquer pessoa, inclusive as suas.
10. Ninguém pode editar nenhuma resposta.
11. Uma resposta só pode ser excluída pelo seu próprio autor.


## Algumas decisões e observações
Dividi a aplicação entre componentes reutilizáveis, inclusive a moldura de algumas telas, views para cada página e services, para fazer as requisições GraphQL com o Apollo.

Decidi usar CSS puro, sem nenhum framework.


## Como rodar a aplicação

##### - Clone o projeto
```bash
git clone https://github.com/filiperv7/desafio-gen-frontend
```

##### - Acesse a pasta do projeto
```bash
cd desafio-gen-frontend
```

##### - Faça a instalação dos pacotes

```bash
npm install
```

##### - Rode a aplicação

```bash
ng serve
```

##### E pronto! A aplicação já está rodando
Agora é só acessar http://localhost:4242/ para ter acesso a aplicação.

##### OBS.: Não se esqueça de rodar também o back-end!
