# projeto-whats-app-clone
Pagina web, reproduzindo algumas da principais funcionalidades do whatsapp-web

## Descrição:
Este projeto usa um servidor local (usando o web-pack) para desponibilizar a aplicação, e dois serviços do firebase para complementar a aplicação:
- *_Storege_* -> Usado para armazenar os arquivos, ao qual foram feitos uploads.
- *_Firestore_* -> Usado para armazenar dados, tais como dados dos usuarios, conversas e etc.

O projeto faz autenticação com o google, acessa midias do computador (video/audio) gravando e apresentando ao usuario entre varias outras funcionalidades do JS nativo.

## IMPORTANTE:
- Instalar o [NodeJs](https://nodejs.org/en/).
- Executar o comando *'npm install'* no diretorio do projeto para baixar e instalar todas as dependencias.
- Executar o comando *'npm start'* no diretorio do projeto para subir o servidor (localhost:8080).
- Caso o banco de dados que criei no firebase esteja expirado, tera que criar um novo com sua conta e mudar as configurações no arquivo *'projeto-whats-app-clone/src/util/Firebase.js'*. Para uma nova configuração siga os [passos](https://firebase.google.com/docs/web/setup?authuser=0).
