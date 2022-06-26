import React, { useState } from 'react';

import styles from './index.module.css'

// 游戏父组件
const Game = () => {
    const [history, setHistory] = useState([
        { squares: Array(9).fill(null) }
    ]);
    const [player, setPlayer] = useState('X');
    const [step, setStep] = useState(0);

    const handleClick = (i) => {
        const lastStep = history[history.length - 1]
        const squares = lastStep.squares.slice();

        // 如果已经产生胜者或者棋盘填满，则直接返回，游戏结束
        if (calculateWinner(squares) || squares[i]) {
            return;
        };

        squares[i] = player;

        setHistory(history.concat([{ squares: squares }]));

        // 根据当前玩家来判断下一位玩家
        player === 'X'
            ? setPlayer('O')
            : setPlayer('X');

        setStep(prevStep => prevStep + 1);
    };

    const jumpTo = (step) => {
        const newHistory = history.slice(0, step + 1);

        setHistory(newHistory);

        // 根据步数来判断当前玩家：X和O的步数为固定的单数或双数
        step % 2 === 0
            ? setPlayer('X')
            : setPlayer('O');

        setStep(step);
    };

    const current = history[history.length - 1];

    const winner = calculateWinner(current.squares);

    // 先判定是否存在胜者；如不存在，在判定是否已经填满棋盘；顺序颠倒会导致无法判定填满棋盘时才获胜的玩家
    const tip = winner
        ? `胜者: ${winner}`
        : (step === 9
            ? `游戏结束`
            : `下一位玩家: ${player}`
        );

    return (
        <>
            <div className={styles.game}>
                <div className={styles.gameBoard}>
                    <Board
                        squares={current.squares}
                        onClick={(i) => handleClick(i)}
                    />
                </div>
                <div className={styles.gameInfo}>
                    <div>{tip}</div>
                    <ol>
                        <Moves history={history} jumpTo={jumpTo} />
                    </ol>
                </div>
            </div>
            <div className={styles.source}>
                源代码：
                <a href="https://github.com/Phil-Libra/tic-tac-toe-hook">Github</a>
            </div>
        </>
    );
};

// 棋盘子组件
const Board = (props) => {
    const renderSquare = (i) => {
        return <Square value={props.squares[i]} onClick={() => props.onClick(i)} />;
    };

    return (
        <div>
            <div className={styles.boardRow}>
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </div>
            <div className={styles.boardRow}>
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </div>
            <div className={styles.boardRow}>
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
        </div>
    );
};

// 棋盘格子子组件
const Square = (props) => {
    return (
        <button className={styles.square} onClick={props.onClick}>
            {props.value}
        </button>
    );
};

// 步数列表子组件
const Moves = (props) => {
    return props.history.map((squares, step) => {
        // 根据步数可以自动生成步数列表按钮描述
        const desc = step
            ? `回到第${step}步`
            : `重新开始`;

        return (
            <li key={step} className={styles.moveList}>
                <button onClick={() => props.jumpTo(step)}>{desc}</button>
            </li>
        );
    });
};

export default Game;

// 判断胜负函数
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
            return squares[a];
        }
    }

    return null;
}