import { App } from './app';

//Controllers
import { HighscoreController } from './controllers/highscore.controller';

const app = new App({
    port: 8787,
    controllers: [
        new HighscoreController()
    ]
});

app.startApp();