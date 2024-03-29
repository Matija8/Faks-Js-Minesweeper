import { MongoClient, Db } from 'mongodb';
import util from 'util';

export class MongoDBService {
  private url: string = 'mongodb://root:pitajkonobara@localhost:27018';
  private databaseName: string = 'highscores_db';
  private client: MongoClient | null = null;
  private _database: Db | null = null;

  constructor() {}

  async connect() {
    try {
      const connect = util.promisify(MongoClient.connect);
      this.client = (await connect(this.url)) as MongoClient;
      this._database = this.client.db(this.databaseName);
    } catch (err) {
      console.error(err);
    }
  }

  private get database(): Db {
    if (!this._database) {
      throw Error('Database not present!');
    }
    return this._database;
  }

  disconnect() {
    if (this.client) {
      this.client.close();
    }
  }

  find(collection: string, parameters = {}) {
    return new Promise((resolve, reject) => {
      this.database
        .collection(collection)
        .find(parameters)
        .toArray((error: Error, data: any) => {
          if (error) {
            reject();
          }
          resolve(data);
        });
    });
  }

  findOne(collection: string, parameters: any) {
    return new Promise((resolve, reject) => {
      this.database
        .collection(collection)
        .findOne(parameters, (error: Error, data: any) => {
          if (error) {
            reject();
          }
          resolve(data);
        });
    });
  }

  insert(collection: string, parameters: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.database
        .collection(collection)
        .insertOne(parameters, (error: Error, data: any) => {
          if (error) {
            reject();
          }
          resolve();
        });
    });
  }

  update(
    collection: string,
    findParameters: any,
    updateParameters: any
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.database
        .collection(collection)
        .updateOne(
          findParameters,
          { $set: updateParameters },
          (error: Error) => {
            if (error) {
              reject();
            }
            resolve();
          }
        );
    });
  }

  delete(collection: string, findParameters: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.database
        .collection(collection)
        .deleteOne(findParameters, (error: Error) => {
          if (error) {
            reject(error);
          }
          resolve();
        });
    });
  }
}
