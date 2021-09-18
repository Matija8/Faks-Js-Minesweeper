import React from 'react';

import './HighscoreList.css';
import HighscoreItem from '../HighscoreItem/HighscoreItem';
import HighscoresApi from '../../apis/HighscoresApi';

// TODO: Extract somewhere
const defaultDifficulties = [
  /* 'Test',  */
  'Any',
  'Beginner',
  'Intermediate',
  'Expert',
];

class HighscoreList extends React.Component {
  state = { Highscores: [], difficulty: 'Any' };

  componentDidMount() {
    this.fetchHighscores();
  }

  render() {
    console.log(this.state);
    return (
      <div className="page">
        {this.renderForm()}
        {this.state.Highscores.length !== 0
          ? this.renderList()
          : this.renderEmptyList()}
      </div>
    );
  }

  renderForm = () => (
    <form
      onSubmit={(event) => {
        console.log(this.state);
        this.fetchHighscores();
        event.preventDefault();
      }}
    >
      <label>
        Difficulty:
        <select
          value={this.state.difficulty}
          onChange={(event) =>
            this.setState({ difficulty: event.target.value })
          }
        >
          {defaultDifficulties.map((difficulty) => (
            <option value={difficulty} key={difficulty}>
              {difficulty}
            </option>
          ))}
        </select>
      </label>
      <input type="submit" value="Get Highscores!" />
    </form>
  );

  renderList = () => (
    <div className="highscore-list">
      {this.state.Highscores.map((highscore) => (
        <HighscoreItem
          key={highscore.userName + highscore.difficulty}
          Highscore={highscore}
        />
      ))}
    </div>
  );

  renderEmptyList = () => (
    <div className="highscore-list">No Highscores yet...</div>
  );

  fetchHighscores() {
    HighscoresApi.getHighscores(this.state.difficulty).then((Highscores) => {
      if (!Array.isArray(Highscores)) {
        // The server returns a string in case of errors. ("Bad difficulty")
        // TODO: Return errors!
        console.error(Highscores);
        this.setState({ Highscores: [] });
      }
      Highscores.sort((a, b) => {
        return a.score - b.score;
      });
      this.setState({ Highscores });
    });
  }
}

export default HighscoreList;
