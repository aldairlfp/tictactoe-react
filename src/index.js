import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className="square" id={props.id} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const isOver = this.props.isOver;
    if (isOver && (i === isOver[1] || i === isOver[2] || i === isOver[3])) {
      return (
        <Square
          value={this.props.squares[i]}
          id="win"
          onClick={() => this.props.onClick(i)}
        />
      );
    }
    return (
      <Square
        value={this.props.squares[i]}
        id="notWin"
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderBoard() {
    let listRowSquare = [];
    let boardToRender = [];
    let count = 0;
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        listRowSquare = listRowSquare.concat(this.renderSquare(count));
        count++;
      }
      boardToRender = boardToRender.concat(
        <div className="board-row">{listRowSquare}</div>
      );
      listRowSquare = [];
    }
    return boardToRender;
  }

  render() {
    return <div>{this.renderBoard()}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          row: null,
          column: null,
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      ascendentOrder: true,
    };
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const calcWinner = calculateWinner(current.squares);
    let winner;
    if (calcWinner) {
      winner = calcWinner[0];
    }
    if (winner || squares[i]) {
      return;
    }
    if (squares[i] === null) {
      squares[i] = this.state.xIsNext ? "X" : "O";
      this.setState({
        history: history.concat([
          { squares: squares, row: parseInt(i / 3), column: i % 3 },
        ]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }
  }

  switchOrder() {
    this.setState({ ascendentOrder: !this.state.ascendentOrder });
  }

  ascendentWay() {
    const history = this.state.history;
    let listToRender = [];
    for (var i = 0; i < history.length; i++) {
      const move = i;
      const desc =
        i === 0
          ? "Go to game start"
          : "Go to move #" +
            move +
            " (" +
            history[move].row +
            "," +
            history[move].column +
            ")";
      if (move === this.state.stepNumber) {
        listToRender = listToRender.concat(
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>
              <b>{desc}</b>
            </button>
          </li>
        );
      } else {
        listToRender = listToRender.concat(
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      }
    }
    return listToRender;
  }

  descendentWay() {
    const history = this.state.history;
    let listToRender = [];
    for (var i = history.length - 1; i >= 0; i--) {
      const move = i;
      const desc =
        i === 0
          ? "Go to game start"
          : "Go to move #" +
            move +
            " (" +
            history[move].row +
            "," +
            history[move].column +
            ")";
      if (move === this.state.stepNumber) {
        listToRender = listToRender.concat(
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>
              <b>{desc}</b>
            </button>
          </li>
        );
      } else {
        listToRender = listToRender.concat(
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      }
    }
    return listToRender;
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const calcWinner = calculateWinner(current.squares);
    let winner;
    if (calcWinner) {
      winner = calcWinner[0];
    }

    let listToRender = [];
    if (this.state.ascendentOrder) {
      listToRender = this.ascendentWay();
    } else {
      listToRender = this.descendentWay();
    }

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else if(this.state.stepNumber === 9){
      status = "Draw"
    }
    else{
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            isOver={calcWinner}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{listToRender}</ol>
          <button onClick={() => this.switchOrder()}>Switch Order</button>
        </div>
        <div className="game-info">
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], a, b, c];
    }
  }
  return null;
}
