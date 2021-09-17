import React from 'react';
import { Link } from "react-router-dom";

import './WelcomePage.css';

const WelcomePage = () => (
  <div className="page welcome">
    <p>
      Welcome to the Minesweeper leaderboard:
    </p>
    <Link to="/Highscores" className="link">Highscores</Link>
  </div>
);

export default WelcomePage;
