import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './App.css';
import WelcomePage from '../WelcomePage/WelcomePage';
import HighscoreList from '../HighscoreList/HighscoreList';

const App = () => (
  <div className="app">
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={WelcomePage} />
        <Route exact path="/Highscores" component={HighscoreList} />
      </Switch>
    </BrowserRouter>
  </div>
);

export default App;
