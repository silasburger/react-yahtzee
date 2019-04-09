import React, { Component } from 'react';
import Dice from './Dice';
import Scoring from './Scoring';
import './Game.css';

const NUM_DICE = 5;
const NUM_ROLLS = 3;

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dice: Array.from({ length: NUM_DICE }),
      locked: Array(NUM_DICE).fill(false),
      rollsLeft: NUM_ROLLS,
      scores: {
        ones: undefined,
        twos: undefined,
        threes: undefined,
        fours: undefined,
        fives: undefined,
        sixes: undefined,
        threeOfKind: undefined,
        fourOfKind: undefined,
        fullHouse: undefined,
        smallStraight: undefined,
        largeStraight: undefined,
        yahtzee: undefined,
        chance: undefined
      },
      totalScore: 0,
      isGameOver: false,
      highScore: null,
    };
    this.roll = this.roll.bind(this);
    this.doScore = this.doScore.bind(this);
    this.toggleLocked = this.toggleLocked.bind(this);
    this.resetGame = this.resetGame.bind(this);
  }

  componentDidMount() {
    let highScore = localStorage.getItem('highScore');
    this.setState(st => ({
      dice: st.dice.map((d, i) =>
        st.locked[i] ? d : Math.ceil(Math.random() * 6)
      ), 
      highScore,
    }));
  }

  roll(evt) {
    // roll dice whose indexes are in reroll
    this.setState(st => ({
      dice: st.dice.map((d, i) =>
        st.locked[i] ? d : Math.ceil(Math.random() * 6)
      ),
      locked: st.rollsLeft > 1 ? st.locked : Array(NUM_DICE).fill(true),
      rollsLeft: st.rollsLeft - 1
    }));
  }

  toggleLocked(idx) {
    // toggle whether idx is in locked or not
    this.setState(st => ({
      locked: [
        ...st.locked.slice(0, idx),
        !st.locked[idx],
        ...st.locked.slice(idx + 1)
      ]
    }));
  }

  resetGame() {
    this.setState(st=>({
      scores: {
        ones: undefined,
        twos: undefined,
        threes: undefined,
        fours: undefined,
        fives: undefined,
        sixes: undefined,
        threeOfKind: undefined,
        fourOfKind: undefined,
        fullHouse: undefined,
        smallStraight: undefined,
        largeStraight: undefined,
        yahtzee: undefined,
        chance: undefined
      },
      dice: st.dice.map((d, i) =>
        st.locked[i] ? d : Math.ceil(Math.random() * 6)
      ),
      locked: Array(NUM_DICE).fill(false),
      rollsLeft: NUM_ROLLS,
      totalScore: 0,
      isGameOver: false,
    }));
  }

  doScore(rulename, ruleFn) {
    // evaluate this ruleFn with the dice and score this rulename
    const newScore = ruleFn(this.state.dice);
    const scores = { ...this.state.scores, [rulename]: newScore };
    const isGameOver = !Object.values(scores).includes(undefined);
    const totalScore = this.state.totalScore + newScore;
    const highScore = totalScore > this.state.highScore ? totalScore : this.state.highScore;

    //setting highScore in localStorage
    if(isGameOver) {
      localStorage.setItem('highScore', highScore);
    }
    this.setState(st => ({
        scores,
        rollsLeft: NUM_ROLLS,
        locked: Array(NUM_DICE).fill(false), 
        totalScore,
        isGameOver,
        highScore,
      }));

    this.roll();
  }

  render() {
    return (
      <section>
        <Dice
          dice={this.state.dice}
          locked={this.state.locked}
          toggleLocked={this.toggleLocked}
        />
       {this.state.isGameOver ? <button className="Game-restart" onClick={this.resetGame}>Restart</button> :
        <button
          className="Game-reroll"
          disabled={this.state.rollsLeft < 1}
          onClick={this.roll}
        >
          {this.state.rollsLeft} Rerolls Left
        </button>}
        <Scoring totalScore={this.state.totalScore} doScore={this.doScore} highScore={this.state.highScore} scores={this.state.scores} />
      </section>
    );
  }
}

export default Game;
