import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
        {props.value}
    </button>
  );
}

function WinSquare(props) {
  return (
    <button className="square" onClick={props.onClick}>
        <span style={{color: "green"}}>{props.value}</span>
    </button>
  );
}


class Board extends React.Component {

    renderSquare(i) {
    return (
        <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            key={i}
            />
        );
    }

    renderWinSquare(i) {
        return (
        <WinSquare
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            key={i}
            />
        );
    }

    createSquares(winningSquares) {
        let rows = [];
        for(let i = 0; i < 3; i++){
          let squares = [];
          for(let j = 0; j < 3; j++){
              if (winningSquares && winningSquares.includes(3*i+j)){
                  squares.push(this.renderWinSquare(3*i+j));
              } else {
                  squares.push(this.renderSquare(3 * i + j));
              }
          }
        rows.push(<div className="board-row" key={i}>{squares}</div>);
      }
      return rows;
    }

    render() {
        return (
          <div>
              {this.createSquares(this.props.winningSquares)}
          </div>
        );
    }

}

class Game extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
        history: [{
            squares: Array(9).fill(null),
        }],
        xIsNext: true,
        stepNumber: 0,
        clicks: [],
        ascending:true,
    };
  }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length -1];
        const squares = current.squares.slice();
        const location = this.state.clicks.slice(0, this.state.stepNumber);

        // If not a winner yet, check if theres a winner
        if (calculateWinner(squares) || squares[i]){
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        location.push(i);
        this.setState({
            history: history.concat([{
            squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            clicks: location
        });

    }

    jumpTo(step) {
        this.setState({
          stepNumber: step,
          xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const result = calculateWinner(current.squares);
        const winner = result ? result[0] : result
        const winningSquares = result ? result.slice(1) : result

        const moves = history.map((step, move, history) => {
            const loc = this.state.clicks[move-1];
            const row = Math.floor(loc / 3) + 1;
            const col = loc % 3 + 1;
            const desc = move ? 'Go to move #' + move + ' (' + row + ', ' + col + ') '  : 'Go to game start';
            if (move === this.state.stepNumber) {
                return (
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}> <b>{desc}</b> </button>
                    </li>
                )
            }
            return (
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}> {desc} </button>
                    </li>
                )

        });

        if (!this.state.ascending){
            moves.reverse()
        }

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else if (this.state.stepNumber === 9) {
            status = 'Its a draw, yall suck at tic-tac-toe';
        }
        else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div><h1>TIC TAC TOE</h1>
          <div className="game">
            <div className="game-board">
              <Board
                  squares={current.squares}
                  winningSquares={winningSquares}
                  onClick={(i) => this.handleClick(i)}/>
            </div>
            <div className="game-info">
                <button onClick={() => (this.setState({ascending: !this.state.ascending}))}>
                Toggle Order: {(this.state.ascending ? 'ascending' : 'descending')}</button>
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
          </div></div>
        );
    }
}

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


// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);