import * as express from 'express';
import { Request, Response } from 'express';
import { Highscore } from '../models/highscore';
import { MongoDBService } from '../services/MongoDBService'


export class HighscoreController {
    public router = express.Router();
    //TODO: private dbCollection: string = 'highscores';


    constructor() {
        this.initRoutes();
    }


    private initRoutes() {
        this.router.get('/', (req: Request, res: Response) => res.send(`<a href="./highscores/">/highscores</a> is the route you're looking for!`));
        this.router.get('/highscores', HighscoreController.getHighscores);
        this.router.get('/highscores/:difficulty', HighscoreController.getHighscoresByDifficulty);
        this.router.post('/highscores', HighscoreController.postHighscore);
        this.router.put('/highscores', HighscoreController.putHighscore);
        this.router.delete('/highscores', HighscoreController.deleteHighscore);
    }


    private static async getHighscores (req: Request, res: Response) {
        let [name, diff]: [string, string] = [req.query.userName, req.query.difficulty],
            searchParams: {[k: string]: any} = {};
        let error: string = HighscoreController.setSearchParams (searchParams, [name, diff]);
        if (error) {
            res.send(error);
            return;
        }

        let mongoService = new MongoDBService();
        await mongoService.connect();

        let highscores = await mongoService.find('highscores', searchParams);
        res.send(highscores);

        mongoService.disconnect();
    }


    private static async getHighscoresByDifficulty (req: Request, res: Response) {
        req.query.difficulty = req.params.difficulty;
        HighscoreController.getHighscores(req, res); //TODO: Remove .prototype hack.
    }


    private static async postHighscore (req: Request, res: Response) {
        let [name, diff, score]: [string, string, number] = [req.body.userName, req.body.difficulty, req.body.score];

        let error: string = HighscoreController.validParams([name, diff, score], "POST");
        if (error) {
            res.send(error);
            return;
        }

        let mongoService = new MongoDBService();
        await mongoService.connect();

        let previousHighscore: any = await mongoService.findOne('highscores', { userName: name.trim(), difficulty: diff });
        if (previousHighscore === null) {
            await mongoService.insert('highscores', {
                userName: name.trim(),
                difficulty: diff,
                score: score
            });
            res.send(`Added new highscore instance: userName = ${name}, difficulty = ${diff}, score = ${score}`);
        }
        else {
            let oldScore: number = parseInt(previousHighscore.score);
                oldScore = oldScore == NaN ? Infinity : oldScore;
            if (score < oldScore) { //Less is better.
                await mongoService.update('highscores', { userName: name, difficulty: diff },
                    new Highscore(name, diff, score)
                );
                res.send(`Updated highscore instance: userName = ${name}, difficulty = ${diff},` +
                ` oldScore = ${oldScore}, newScore = ${score}`);
            }
            else {
                res.send("Previous highscore was better then (or equal to) the new one:\n" +
                `userName = ${name}, difficulty = ${diff}, oldScore = ${oldScore}, newScore = ${score}\n` +
                "No db update");
            }
        }
        mongoService.disconnect();
    }


    private static async putHighscore (req: Request, res: Response) {
        let [oldName, newName, diff, newScore]: [string, string, string, number]
            = [req.body.oldName, req.body.newName, req.body.difficulty, req.body.score];

        let error: string = HighscoreController.validParams([newName, diff, newScore], "PUT");
        if (error) {
            res.send(error);
            return;
        }

        let mongoService = new MongoDBService();
        await mongoService.connect();

        /*let result: WriteResult = */await mongoService.update('highscores', //TODO: check number of updated.
        {
            userName: oldName,
            difficulty: diff
        },
        {
            userName: newName,
            difficulty: diff,
            score: newScore
        });
        //if (result.nModified > 0 ) {}
        res.send(`PUT successful: old userName = ${oldName}, new userName = ${newName}, difficulty = ${diff}, new score = ${newScore}`);

        mongoService.disconnect();
    }


    private static async deleteHighscore (req: Request, res: Response) {
        let [name, diff]: [string, string] = [req.body.userName, req.body.difficulty],
            searchParams: {[k: string]: any} = {};

        let error: string = HighscoreController.setSearchParams (searchParams, [name, diff]);
        if (error) {
            res.send(error);
            return;
        }

        let mongoService = new MongoDBService();
        await mongoService.connect();

        await mongoService.delete('highscores', searchParams ); //TODO: check number of deleted. Change in MongoDBService to delete (not deleteOne).

        mongoService.disconnect();
        res.send(`DELETE successful: userName = ${name}, difficulty = ${diff}`);
    }


    private static setSearchParams (searchParams: {[k: string]: any}, [name, diff]: [string, string]): string {
        if (name != undefined) {
            if (Highscore.validUserName(name)) {
                searchParams.userName = name.trim();
            }
            else {
                return "Bad userName.";
            }
        }
        if (diff != undefined) {
            if (Highscore.validDifficulty(diff)) {
                searchParams.difficulty = diff;
            }
            else {
                return "Bad difficulty.";
            }
        }
        return ""; // Success, no error.
    }


    private static validParams ([name, diff, score]: [string, string, number], method: string): string {
        const notDefined = (variable: any) => variable === undefined;
        if ([name, diff, score].some(notDefined)) {
            return `Missing ${method} body arguments! Need userName(string), difficulty(string) and highscore(number)!`;
        }
        else if (!Highscore.validUserName(name)) {
            return `Bad userName, ${method} failed!`;
        }
        else if (!Highscore.validDifficulty(diff)) {
            return `Bad difficulty, ${method} failed!`;
        }
        else if (!Highscore.validScore(score)) {
            return `Incorrect score, ${method} failed!`;
        }
        return ""; // Success.
    }

}
