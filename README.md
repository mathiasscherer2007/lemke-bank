# LemkeBank

[![Lemke-Bank CI](https://github.com/mathiasscherer2007/lemke-bank/actions/workflows/test.yml/badge.svg)](https://github.com/mathiasscherer2007/lemke-bank/actions/workflows/test.yml)
![MPV](https://img.shields.io/github/milestones/progress-percent/mathiasscherer2007/lemke-bank/1)

## O seu banco (e o do seu professor)

O LemkeBank é um projeto de internet-banking que opera com a moeda fictícia Bills (BL$). O professor consegue distribuir bills para os alunos, que podem realizar transações (tanto para o professor, como para outros alunos) utilizando os bills na sua carteira.

## Linguagens e Frameworks

Tecnologias utilizadas:<br />
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/css-%23663399.svg?style=for-the-badge&logo=css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-%236DA55F.svg?style=for-the-badge&logo=node.js&logoColor=white)

Frameworks utilizadas:<br />
<a target="_blank" href="https://svelte.dev/">![Svelte](https://img.shields.io/badge/sveltekit-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white)</a>
<a target="_blank" href="https://tailwindcss.com/">![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)</a>
<a target="_blank" href="https://fastify.dev">![Fastify](https://img.shields.io/badge/fastify-%23000000.svg?style=for-the-badge&logo=fastify&logoColor=white)</a>

## Features do projeto final

Planejamos entregar as features descritas no [MVP](https://github.com/mathiasscherer2007/lemke-bank/milestone/1).

## Executando o projeto

Para executar o projeto, siga os seguintes passos:
  1. Clone o repositório.
  2. Acesse a pasta lemke-bank no seu terminal.
  3. Digite o comando `npm i` para instalar as dependências e bibliotecas.
  4. Configure um arquivo `.env` com base no `.env.example`.
  5. Execute o comando `docker compose up -d` para executar o docker.
  6. Execute os comandos `npm run database:generate` e `npm run database:migrate`.
  7. Execute o comando `npm run dev` e acesse o URL localhost:5173.

### Operações administrativas pelo terminal

Para criar um administrador com uma carteira e saldo inicial:

```bash
npm run create-admin -- \
  --email admin@example.com \
  --name Admin \
  --password 'sua-senha' \
  --initial-bills 1000
```

O argumento `--initial-bills` é opcional e assume `0`. A senha é usada apenas
para gerar o hash compatível com o login da aplicação e não é salva no código.

Para adicionar BL$ a uma carteira existente:

```bash
npm run add-bills -- \
  --wallet-id ID_DA_CARTEIRA \
  --amount 500
```

O crédito atualiza o saldo e registra a transação no ledger atomicamente.
