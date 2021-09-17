let testScores = [
  {
    "userName": "Zika",
    "difficulty": "Expert",
    "score": "5000"
  },
  {
    "userName": "Pera",
    "difficulty": "Beginner",
    "score": "132"
  },
  {
    "userName": "Totalni pocetnik",
    "difficulty": "Beginner",
    "score": "55055"
  },
  {
    "userName": "Mufasa",
    "difficulty": "Beginner",
    "score": "400"
  },
  {
    "userName": "Doktor",
    "difficulty": "Expert",
    "score": "555"
  },
  {
    "userName": "Boris The Bullet Dodger",
    "difficulty": "Intermediate",
    "score": "5525"
  }
];

db.createCollection('highscores');
const scoreCollection = db.getCollection('highscores');

for (let score of testScores)
  scoreCollection.insert(score);
