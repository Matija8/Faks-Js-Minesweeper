import React from "react";

import "./HighscoreList.css";
import HighscoreItem from "../HighscoreItem";
import HighscoresApi from "../../apis/HighscoresApi";

class HighscoreList extends React.Component {
  state = { Highscores: [] , difficulty: 'Any'};

  componentDidMount() {
    this.fetchHighscores();
  }

  render() {
    console.log(this.state)
    return <div className="page">
      {this.renderForm()}
      {this.state.Highscores.length !== 0 ? this.renderList() : this.renderEmptyList()}
    </div>;
  }

  renderForm = () => (
    <form onSubmit={event => {
      console.log(this.state);
      this.fetchHighscores();
      event.preventDefault();
    }}>
      <label>
        Difficulty:
        <input type="text" value={this.state.difficulty} onChange={event => this.setState({difficulty: event.target.value})} />
      </label>
      <input type="submit" value="Get Highscores!" />
    </form>
  );

  renderList = () => (
    <div className="highscore-list">
      {this.state.Highscores.map(highscore => (
        <HighscoreItem
          key={highscore.userName + highscore.difficulty}
          Highscore={highscore}
        />
      ))}
    </div>
  );

  renderEmptyList = () => (null)/*<div className="highscore-list">No Highscores yet...</div>*/;

  componentWillUnmount() {
    //
  }

  fetchHighscores() {
    HighscoresApi.getHighscores(this.state.difficulty).then(Highscores => {
      if (!Array.isArray(Highscores)) {
        // The server returns a string in case of errors. ("Bad difficulty")
        // This causes problems when trying to map on a non array item.
        Highscores = [];
      }
      Highscores.sort((a, b) => {
        return a.score - b.score;
      })
      this.setState({ Highscores });
    });
  }
}

export default HighscoreList;
