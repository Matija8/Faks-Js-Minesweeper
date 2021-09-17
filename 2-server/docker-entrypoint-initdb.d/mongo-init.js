const testScores = [
  {
    userName: 'Peter',
    difficulty: 'Expert',
    score: '5000',
  },
  {
    userName: 'Steve',
    difficulty: 'Beginner',
    score: '132',
  },
  {
    userName: 'Dan',
    difficulty: 'Beginner',
    score: '55055',
  },
  {
    userName: 'Kyle',
    difficulty: 'Beginner',
    score: '400',
  },
  {
    userName: 'Stan',
    difficulty: 'Expert',
    score: '555',
  },
  {
    userName: 'Kenny',
    difficulty: 'Intermediate',
    score: '5525',
  },
];

db.createCollection('highscores');
const scoreCollection = db.getCollection('highscores');

for (const score of testScores) {
  scoreCollection.insert(score);
}
