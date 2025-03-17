// --- Global Variables ---
const board = []; // 9x9 grid; each cell is either null or an object { piece, owner, deadzone }
const deadzone = { row: Math.floor(Math.random() * 9), col: Math.floor(Math.random() * 9) };
let currentPlayer = 1;
let playerScores = { 1: 0, 2: 0 };

// Define each player's starting pieces.
// Special pieces: K (King), Q (Queen), B (Bishop), A (Ace)
// Number pieces: "2" through "8" (5 of each)
const initialPieces = {
  K: 1,
  Q: 1,
  B: 1,
  A: 2,
  2: 5,
  3: 5,
  4: 5,
  5: 5,
  6: 5,
  7: 5,
  8: 5,
};
let playerPieces = {
  1: { ...initialPieces },
  2: { ...initialPieces },
};

let selectedCell = null; // Will hold { row, col } when the user clicks a cell

// --- Board Initialization ---
function createBoard() {
  const gameBoard = document.getElementById("gameBoard");
  for (let row = 0; row < 9; row++) {
    board[row] = [];
    for (let col = 0; col < 9; col++) {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      cellDiv.dataset.row = row;
      cellDiv.dataset.col = col;
      // Mark deadzone cell
      if (row === deadzone.row && col === deadzone.col) {
        cellDiv.classList.add("deadzone");
        board[row][col] = { deadzone: true };
      } else {
        board[row][col] = null;
        // When clicked, select the cell (for placement)
        cellDiv.addEventListener("click", () => selectCell(row, col));
      }
      gameBoard.appendChild(cellDiv);
    }
  }
  updatePieceDropdown();
}

// --- Piece Dropdown ---
function updatePieceDropdown() {
  const dropdown = document.getElementById("pieceDropdown");
  dropdown.innerHTML = "";
  const pieces = playerPieces[currentPlayer];
  for (const piece in pieces) {
    if (pieces[piece] > 0) {
      const option = document.createElement("option");
      option.value = piece;
      option.textContent = `${piece} (x${pieces[piece]})`;
      dropdown.appendChild(option);
    }
  }
}

// --- Cell Selection ---
function selectCell(row, col) {
  // If cell is deadzone, do nothing
  if (row === deadzone.row && col === deadzone.col) return;
  // Remove highlight from previously selected cell (if any)
  document.querySelectorAll(".cell").forEach((cell) => cell.classList.remove("selected"));
  selectedCell = { row, col };
  // Highlight the selected cell
  const cellDiv = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
  cellDiv.classList.add("selected");
}

// --- Attempt to Place Piece ---
function attemptPlacePiece() {
  if (!selectedCell) {
    alert("Select a cell first!");
    return;
  }
  const piece = document.getElementById("pieceDropdown").value;
  if (!piece) return;
  const { row, col } = selectedCell;
  if (!isValidMove(row, col, piece)) {
    alert("Invalid move!");
    return;
  }
  placePiece(row, col, piece);
  selectedCell = null;
  // Remove any selection highlight
  document.querySelectorAll(".cell").forEach((cell) => cell.classList.remove("selected"));
  // Switch turns only if game hasn't ended
  if (!gameEnded) switchPlayer();
}

// --- Move Validation ---
// For numbers, we enforce Sudoku rules (no same number in row/column/square).
// For special pieces (K, Q, B, A), ensure no other special piece is in the same row, column, or square.
// Additionally, for Bishops, also check that no special piece exists along either diagonal.
function isValidMove(row, col, piece) {
  // Check if cell is already occupied or is the deadzone.
  if (board[row][col] !== null) return false;
  if (row === deadzone.row && col === deadzone.col) return false;

  if (isSpecial(piece)) {
    if (hasSpecialInRow(row) || hasSpecialInCol(col) || hasSpecialInSquare(row, col)) return false;
    if (piece === "B" && hasSpecialInDiagonals(row, col)) return false;
  } else {
    // Number pieces must not repeat in the row, column, or 3x3 square.
    if (hasNumberInRow(row, piece) || hasNumberInCol(col, piece) || hasNumberInSquare(row, col, piece)) return false;
  }
  return true;
}

function isSpecial(piece) {
  return ["K", "Q", "B", "A"].includes(piece);
}

function hasSpecialInRow(row) {
  for (let col = 0; col < 9; col++) {
    const cell = board[row][col];
    if (cell && cell.piece && isSpecial(cell.piece)) return true;
  }
  return false;
}
function hasSpecialInCol(col) {
  for (let row = 0; row < 9; row++) {
    const cell = board[row][col];
    if (cell && cell.piece && isSpecial(cell.piece)) return true;
  }
  return false;
}
function hasSpecialInSquare(row, col) {
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      const cell = board[r][c];
      if (cell && cell.piece && isSpecial(cell.piece)) return true;
    }
  }
  return false;
}
function hasSpecialInDiagonals(row, col) {
  // Check top-left to bottom-right diagonal
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (r - c === row - col) {
        const cell = board[r][c];
        if (cell && cell.piece && isSpecial(cell.piece)) return true;
      }
    }
  }
  // Check top-right to bottom-left diagonal
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (r + c === row + col) {
        const cell = board[r][c];
        if (cell && cell.piece && isSpecial(cell.piece)) return true;
      }
    }
  }
  return false;
}

function hasNumberInRow(row, num) {
  for (let col = 0; col < 9; col++) {
    const cell = board[row][col];
    if (cell && cell.piece === num) return true;
  }
  return false;
}
function hasNumberInCol(col, num) {
  for (let row = 0; row < 9; row++) {
    const cell = board[row][col];
    if (cell && cell.piece === num) return true;
  }
  return false;
}
function hasNumberInSquare(row, col, num) {
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      const cell = board[r][c];
      if (cell && cell.piece === num) return true;
    }
  }
  return false;
}

// --- Placing a Piece ---
// This function sets the board cell, updates the UI, adjusts scores, and (if special)
// applies capturing effects.
function placePiece(row, col, piece) {
  const cellObj = { piece, owner: currentPlayer };
  board[row][col] = cellObj;
  const cellDiv = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
  cellDiv.textContent = piece;
  cellDiv.classList.add(currentPlayer === 1 ? "player1" : "player2");
  
  // Calculate base score
  let baseScore = 0;
  if (!isSpecial(piece)) {
    baseScore = parseInt(piece);
  } else {
    if (piece === "K") baseScore = 50;
    else if (piece === "A") {
      // Check if any King exists in the same row, column, or square.
      if (hasKingInRow(row) || hasKingInCol(col) || hasKingInSquare(row, col)) baseScore = 11;
      else baseScore = 1;
    }
    // Q and B have no base point value.
  }
  playerScores[currentPlayer] += baseScore;
  playerPieces[currentPlayer][piece]--;
  updateScore();
  
  // If a special piece was placed, apply its capture effect.
  if (isSpecial(piece)) {
    applySpecialEffects(row, col, piece);
  }
  
  // After placing, check if the current row, column, or square is complete,
  // which converts all pieces in that area to the current player's color.
  checkConversion(row, col);
}

// --- Helpers for Checking for a King ---
function hasKingInRow(row) {
  for (let col = 0; col < 9; col++) {
    const cell = board[row][col];
    if (cell && cell.piece === "K") return true;
  }
  return false;
}
function hasKingInCol(col) {
  for (let row = 0; row < 9; row++) {
    const cell = board[row][col];
    if (cell && cell.piece === "K") return true;
  }
  return false;
}
function hasKingInSquare(row, col) {
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      const cell = board[r][c];
      if (cell && cell.piece === "K") return true;
    }
  }
  return false;
}

// --- Special Effects ---
// Depending on the special piece, capture opponent pieces in the designated pattern.
function applySpecialEffects(row, col, piece) {
  if (piece === "Q") {
    captureRowColSquare(row, col);
  } else if (piece === "K") {
    captureAdjacent(row, col);
  } else if (piece === "B") {
    captureDiagonals(row, col);
  }
  // Aces have no capture effect.
}

// --- Capturing Mechanics ---
// Capturing converts an opponent’s piece to the current player's color,
// updates scores, and if a King is captured, ends the game.
function captureCell(row, col) {
  const cell = board[row][col];
  if (!cell || !cell.piece || cell.deadzone) return;
  if (cell.owner === currentPlayer) return;
  
  // Determine the captured piece's value.
  let value = 0;
  if (!isSpecial(cell.piece)) {
    value = parseInt(cell.piece);
  } else {
    if (cell.piece === "K") value = 50;
    else if (cell.piece === "A") value = 1; // For capture, assume Ace is worth 1.
    // Q and B are assumed 0.
  }
  // Update scores: current player gains, opponent loses.
  playerScores[currentPlayer] += value;
  playerScores[cell.owner] -= value;
  cell.owner = currentPlayer;
  
  // Update UI color.
  const cellDiv = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
  cellDiv.classList.remove("player1", "player2");
  cellDiv.classList.add(currentPlayer === 1 ? "player1" : "player2");
  
  updateScore();
  
  // If a King was captured, end the game.
  if (cell.piece === "K") {
    alert(`Player ${currentPlayer} captured the King! Game over.`);
    disableBoard();
    gameEnded = true;
  }
}

function captureRowColSquare(row, col) {
  const toCapture = new Set();
  // Capture pieces in the same row.
  for (let c = 0; c < 9; c++) {
    if (c === col) continue;
    if (board[row][c] && board[row][c].piece && !board[row][c].deadzone && board[row][c].owner !== currentPlayer)
      toCapture.add(`${row},${c}`);
  }
  // Capture pieces in the same column.
  for (let r = 0; r < 9; r++) {
    if (r === row) continue;
    if (board[r][col] && board[r][col].piece && !board[r][col].deadzone && board[r][col].owner !== currentPlayer)
      toCapture.add(`${r},${col}`);
  }
  // Capture pieces in the same 3x3 square.
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if (r === row && c === col) continue;
      if (board[r][c] && board[r][c].piece && !board[r][c].deadzone && board[r][c].owner !== currentPlayer)
        toCapture.add(`${r},${c}`);
    }
  }
  toCapture.forEach((coord) => {
    const [r, c] = coord.split(",").map(Number);
    captureCell(r, c);
  });
}

function captureAdjacent(row, col) {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1],
  ];
  directions.forEach(([dr, dc]) => {
    const r = row + dr;
    const c = col + dc;
    if (r >= 0 && r < 9 && c >= 0 && c < 9) {
      if (board[r][c] && board[r][c].piece && !board[r][c].deadzone && board[r][c].owner !== currentPlayer)
        captureCell(r, c);
    }
  });
}

function captureDiagonals(row, col) {
  // Top-left diagonal
  let r = row - 1, c = col - 1;
  while (r >= 0 && c >= 0) {
    if (board[r][c] && board[r][c].piece && !board[r][c].deadzone && board[r][c].owner !== currentPlayer)
      captureCell(r, c);
    r--; c--;
  }
  // Top-right diagonal
  r = row - 1; c = col + 1;
  while (r >= 0 && c < 9) {
    if (board[r][c] && board[r][c].piece && !board[r][c].deadzone && board[r][c].owner !== currentPlayer)
      captureCell(r, c);
    r--; c++;
  }
  // Bottom-left diagonal
  r = row + 1; c = col - 1;
  while (r < 9 && c >= 0) {
    if (board[r][c] && board[r][c].piece && !board[r][c].deadzone && board[r][c].owner !== currentPlayer)
      captureCell(r, c);
    r++; c--;
  }
  // Bottom-right diagonal
  r = row + 1; c = col + 1;
  while (r < 9 && c < 9) {
    if (board[r][c] && board[r][c].piece && !board[r][c].deadzone && board[r][c].owner !== currentPlayer)
      captureCell(r, c);
    r++; c++;
  }
}

// --- Row/Column/Square Conversion ---
// When an entire row, column, or 3x3 square is filled (ignoring deadzone),
// all pieces in that line are converted to the current player's color.
function checkConversion(row, col) {
  if (isCompleteRow(row)) convertRow(row);
  if (isCompleteCol(col)) convertCol(col);
  if (isCompleteSquare(row, col)) convertSquare(row, col);
}

function isCompleteRow(row) {
  for (let col = 0; col < 9; col++) {
    if (row === deadzone.row && col === deadzone.col) continue;
    if (!board[row][col] || (board[row][col] && board[row][col].deadzone)) return false;
  }
  return true;
}
function isCompleteCol(col) {
  for (let row = 0; row < 9; row++) {
    if (row === deadzone.row && col === deadzone.col) continue;
    if (!board[row][col] || (board[row][col] && board[row][col].deadzone)) return false;
  }
  return true;
}
function isCompleteSquare(row, col) {
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if (r === deadzone.row && c === deadzone.col) continue;
      if (!board[r][c] || (board[r][c] && board[r][c].deadzone)) return false;
    }
  }
  return true;
}

function convertRow(row) {
  for (let col = 0; col < 9; col++) {
    if (row === deadzone.row && col === deadzone.col) continue;
    if (board[row][col] && board[row][col].piece && board[row][col].owner !== currentPlayer)
      captureCell(row, col);
  }
}
function convertCol(col) {
  for (let row = 0; row < 9; row++) {
    if (row === deadzone.row && col === deadzone.col) continue;
    if (board[row][col] && board[row][col].piece && board[row][col].owner !== currentPlayer)
      captureCell(row, col);
  }
}
function convertSquare(row, col) {
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if (r === deadzone.row && c === deadzone.col) continue;
      if (board[r][c] && board[r][c].piece && board[r][c].owner !== currentPlayer)
        captureCell(r, c);
    }
  }
}

// --- Turn Management & Score Update ---
function switchPlayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  document.getElementById("turnIndicator").textContent = `Player ${currentPlayer}'s Turn`;
  updatePieceDropdown();
}

function updateScore() {
  document.getElementById("scoreDisplay").textContent = `Player 1: ${playerScores[1]} | Player 2: ${playerScores[2]}`;
}

// --- Endgame ---
let gameEnded = false;
function disableBoard() {
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.replaceWith(cell.cloneNode(true)); // Remove all event listeners.
  });
  alert("Game Over");
}

// --- Initialize Game ---
createBoard();
