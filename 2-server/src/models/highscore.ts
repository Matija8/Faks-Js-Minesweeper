export class Highscore {
  private userName: string;
  private difficulty: string;
  private score: number;

  constructor(name: string, diff: string, score: number) {
    this.userName = Highscore.validUserName(name)
      ? name.trim()
      : 'Invalid userName';
    this.difficulty = Highscore.validDifficulty(diff)
      ? diff
      : 'Invalid difficulty';
    this.score = Highscore.validScore(score) ? score : 0;
  }

  public getUserName(): string {
    return this.userName;
  }

  public getDifficulty(): string {
    return this.difficulty;
  }

  public getScore(): number {
    return this.score;
  }

  public getScoreAsTime(): string {
    return new Date(this.score).toISOString().substr(11, 8);
  }

  public setName(name: string) {
    if (Highscore.validUserName(name)) this.userName = name;
  }

  public static validUserName(name: string): boolean {
    //TODO: security checks?
    if (typeof name !== 'string') {
      return false;
    }
    const trimmedName = name.trim();
    return trimmedName === name && trimmedName !== '';
  }

  public static validDifficulty(difficulty: string): boolean {
    const validDifficulties = Object.freeze({
      Test: 1,
      Beginner: 2,
      Intermediate: 3,
      Expert: 4,
    });
    return Object.keys(validDifficulties).includes(difficulty);
  }

  public static validScore(score: number): boolean {
    return score > 0;
  }
}
