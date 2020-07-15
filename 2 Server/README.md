# Levi9-Node.js
### Back end project for the Levi9 JavaScript course.

To install and run:

    1. npm install
    2. npm run buildnstart (build the server, start the docker containers, start the server)

Other scripts:

    - npm run build (build the server from the .ts files in /src)
    - npm start (only start the server - works if .ts files have been transpiled(npm run build))
    - npm run nodemon (restarts server on any src/ change)
    - npm run clean (delete build files and rm docker containers)
    - npm run docker-up
    - npm run docker-stop
    - npm run docker-rm (rm ONLY containers used in this project, your other containers should be safe)

Ports used:

    - 8787:  Node.js server
    - 27018: Mongo db (run in a docker container)
    - 8082:  Mongo-express (also in a docker cont.)
