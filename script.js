const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const restartButton = document.getElementById('restartButton');

const SIZE = 15;
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

let board = [];
let currentPlayer = BLACK;
let gameOver = false;

function createBoard() {
  boardElement.innerHTML = '';
  board = Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY));
  gameOver = false;
  currentPlayer = BLACK;
  updateStatus('輪到：黑棋');

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cell';
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener('click', handleCellClick);
      boardElement.appendChild(cell);
    }
  }
}

function updateStatus(message) {
  statusElement.textContent = message;
}

function handleCellClick(event) {
  if (gameOver) return;

  const cell = event.currentTarget;
  const row = Number(cell.dataset.row);
  const col = Number(cell.dataset.col);

  if (board[row][col] !== EMPTY) return;

  board[row][col] = currentPlayer;
  renderPiece(cell, currentPlayer);

  if (checkWin(row, col, currentPlayer)) {
    gameOver = true;
    const winner = currentPlayer === BLACK ? '黑棋' : '白棋';
    updateStatus(`${winner} 獲勝！`);
    return;
  }

  currentPlayer = currentPlayer === BLACK ? WHITE : BLACK;
  updateStatus(`輪到：${currentPlayer === BLACK ? '黑棋' : '白棋'}`);
}

function renderPiece(cell, player) {
  const piece = document.createElement('div');
  piece.className = `piece ${player === BLACK ? 'black' : 'white'}`;
  cell.appendChild(piece);
}

function checkWin(row, col, player) {
  return (
    countConnected(row, col, player, 1, 0) + countConnected(row, col, player, -1, 0) > 4 ||
    countConnected(row, col, player, 0, 1) + countConnected(row, col, player, 0, -1) > 4 ||
    countConnected(row, col, player, 1, 1) + countConnected(row, col, player, -1, -1) > 4 ||
    countConnected(row, col, player, 1, -1) + countConnected(row, col, player, -1, 1) > 4
  );
}

function countConnected(row, col, player, deltaRow, deltaCol) {
  let count = 0;
  let r = row + deltaRow;
  let c = col + deltaCol;

  while (r >= 0 && r < SIZE && c >= 0 && c < SIZE && board[r][c] === player) {
    count += 1;
    r += deltaRow;
    c += deltaCol;
  }

  return count;
}

restartButton.addEventListener('click', createBoard);
createBoard();
