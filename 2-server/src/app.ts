import express from 'express';
import { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

export class App {
    public app: Application;
    public port: number;

    
    constructor(appInit: {port: number, controllers: any}) {
        this.app = express();
        //TODO: lookup body-parser and cors.
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cors());
        this.port = appInit.port;

        this.routes(appInit.controllers);
    }

    private routes(controllers: { forEach: (arg0: (controller: any) => void) => void; }) {
        controllers.forEach(controller => {
            // This is for importing controller modules with their routes:
            // https://stackoverflow.com/questions/28305120/differences-between-express-router-and-app-get
            this.app.use('/', controller.router);
        });
    }

    public startApp() {
        this.app.listen(this.port, () => {
            console.log(`Server started on http://localhost:${this.port}`);
        });
    }
}