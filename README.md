# test_2666
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>網頁五子棋</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>五子棋 Gomoku</h1>
        <div id="status" class="status">輪到黑子下棋</div>
        <div id="board" class="board"></div>
        <button id="restart-btn">重新開始</button>
    </div>

    <script src="script.js"></script>
</body>
</html>

body {
    margin: 0;
    padding: 0;
    background-color: #f0f0f0;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.container {
    text-align: center;
}

h1 {
    color: #333;
    margin-bottom: 10px;
}

.status {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 20px;
    color: #555;
}

/* 15x15 的棋盤 */
.board {
    display: grid;
    grid-template-columns: repeat(15, 35px);
    grid-template-rows: repeat(15, 35px);
    gap: 0;
    background-color: #e6b373; /* 經典木質色調 */
    padding: 10px;
    border: 4px solid #8a5a22;
    border-radius: 4px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    margin: 0 auto;
}

/* 棋盤格子的交點與線條效果 */
.cell {
    width: 35px;
    height: 35px;
    position: relative;
    cursor: pointer;
    box-sizing: border-box;
}

/* 繪製棋盤十字線 */
.cell::before {
    content: "";
    position: absolute;
    background-color: #8a5a22;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    transform: translateY(-50%);
}

.cell::after {
    content: "";
    position: absolute;
    background-color: #8a5a22;
    left: 50%;
    top: 0;
    width: 1px;
    height: 100%;
    transform: translateX(-50%);
}

/* 棋子基本樣式 */
.piece {
    position: absolute;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    top: 52%;
    left: 52%;
    transform: translate(-50%, -50%);
    z-index: 10;
    box-shadow: 0 3px 5px rgba(0,0,0,0.3);
    animation: drop 0.1s ease-out;
}

@keyframes drop {
    from { transform: translate(-50%, -70%); opacity: 0; }
    to { transform: translate(-50%, -50%); opacity: 1; }
}

/* 黑子 */
.piece.black {
    background: radial-gradient(circle at 30% 30%, #555, #000);
}

/* 白子 */
.piece.white {
    background: radial-gradient(circle at 30% 30%, #fff, #ccc);
    border: 1px solid #aaa;
}

/* 按鈕樣式 */
#restart-btn {
    margin-top: 25px;
    padding: 10px 25px;
    font-size: 1rem;
    font-weight: bold;
    color: white;
    background-color: #4a7c59;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.2s;
}

#restart-btn:hover {
    background-color: #385e43;
}


const BOARD_SIZE = 15;
const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const restartBtn = document.getElementById('restart-btn');

let board = [];
let currentPlayer = 'black'; // 'black' 或 'white'
let isGameOver = false;

// 初始化遊戲
function initGame() {
    boardElement.innerHTML = '';
    board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
    currentPlayer = 'black';
    isGameOver = false;
    statusElement.innerText = "輪到黑子下棋";
    statusElement.style.color = "#333";

    // 建立 15x15 的格子
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', handleCellClick);
            boardElement.appendChild(cell);
        }
    }
}

// 處理點擊落子
function handleCellClick(e) {
    const r = parseInt(e.currentTarget.dataset.row);
    const c = parseInt(e.currentTarget.dataset.col);

    // 如果該位置已有棋子或遊戲已結束，則不反應
    if (board[r][c] || isGameOver) return;

    // 記錄棋子狀態
    board[r][c] = currentPlayer;

    // 在畫面上渲染棋子
    const piece = document.createElement('div');
    piece.classList.add('piece', currentPlayer);
    e.currentTarget.appendChild(piece);

    // 檢查是否獲勝
    if (checkWin(r, c, currentPlayer)) {
        statusElement.innerText = `🎉 恭喜！${currentPlayer === 'black' ? '黑子' : '白子'}獲勝了！`;
        statusElement.style.color = "#d9534f";
        isGameOver = true;
        return;
    }

    // 檢查是否平手（棋盤下滿）
    if (board.flat().every(cell => cell !== null)) {
        statusElement.innerText = "平手！棋盤已經滿了。";
        isGameOver = true;
        return;
    }

    // 切換玩家
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    statusElement.innerText = `輪到${currentPlayer === 'black' ? '黑子' : '白子'}下棋`;
}

// 檢查勝負的邏輯
function checkWin(r, c, player) {
    // 四個方向：[列增量, 行增量]
    // 依序為：水平 (→)、垂直 (↓)、右斜下 (↘)、右斜上 (↗)
    const directions = [
        [0, 1],
        [1, 0],
        [1, 1],
        [-1, 1]
    ];

    for (const [dr, dc] of directions) {
        let count = 1; // 算上剛落下的這顆子

        // 正方向延伸檢查
        let nr = r + dr;
        let nc = c + dc;
        while (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board[nr][nc] === player) {
            count++;
            nr += dr;
            nc += dc;
        }

        // 反方向延伸檢查
        nr = r - dr;
        nc = c - dc;
        while (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board[nr][nc] === player) {
            count++;
            nr -= dr;
            nc -= dc;
        }

        // 只要任一方向達到或超過 5 顆子即獲勝
        if (count >= 5) return true;
    }
    return false;
}

// 綁定重來按鈕
restartBtn.addEventListener('click', initGame);

// 啟動遊戲
initGame();