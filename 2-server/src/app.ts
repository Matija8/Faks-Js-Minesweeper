import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { HighscoreController } from './controllers/highscore.controller';

function main() {
  const port = 8787;
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(morgan('short'));
  app.use(new HighscoreController().router);

  app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
  });
}

main();
