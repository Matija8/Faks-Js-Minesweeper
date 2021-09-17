import React from 'react';

import './HighscoreItem.css';

const HighscoreItem = props => (
  <div className="HighscoreItem">
    <p className="userName">User: {props.Highscore.userName}</p>
    <p className="difficulty">Difficulty: {props.Highscore.difficulty}</p>
    <p className="score">Score: {props.Highscore.score}</p>
  </div>
);

export default HighscoreItem;
