import React, { Component } from 'react';
import './Die.css';

class Die extends Component {

  handleClick = evt => {
    this.props.toggleLocked(this.props.idx);
  }

  render() {
    return (
      <button
        className="Die"
        style={{ backgroundColor: this.props.locked ? "darkred" : "red" }}
        onClick={this.handleClick}>
        {this.props.val}
      </button>
    )
  }
}

export default Die;