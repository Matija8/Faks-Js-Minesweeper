# Minesweeper highscore server

## Back end project for the Levi9 JavaScript course

To install and run:

1. npm install
2. npm run docker-up
3. npm start (start the server, uses ts-node)

Other scripts:

- npm run build (compile the server to js)
- npm run nodemon (restarts server on any /src change, uses ts-node)
- npm run clean (delete build files and rm docker containers)
- npm run docker-stop
- npm run docker-rm (rm containers used in this project)

Ports used:

- 8787:  Node.js server
- 27018: Mongo db (docker container)
- 8082:  Mongo-express (docker container)
