import axios from "axios";

class HighscoresApi {
  config = {
    baseURL: "http://localhost",
    port: 8787
  };
  constructor() {
    this.httpClient = axios.create({
      baseURL: `${this.config.baseURL}:${this.config.port}`
    });
  }

  getHighscores(difficulty) {
    if (difficulty === 'Any') {
      return this.httpClient
      .get("/highscores")
      .then(response =>
        response.data
      );
    }
    return this.httpClient
    .get(`/highscores/${difficulty}`)
    .then(response =>
      response.data
    );
  }
}

export default new HighscoresApi();