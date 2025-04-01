// --- Global Variables ---
const board = []; // 9x9 grid; each cell is either null or an object { piece, owner, deadzone }
const deadzone = { row: Math.floor(Math.random() * 9), col: Math.floor(Math.random() * 9) };
let currentPlayer = 1;
let playerScores = { 1: 0, 2: 0 };

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
let selectedPiece = null; // Will hold the selected piece type
let gameEnded = false;

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

                // Click event listener for cell selection
                cellDiv.addEventListener("click", () => selectCell(row, col));

                // Drag-and-drop event listeners
                cellDiv.addEventListener("dragover", (event) => {
                    event.preventDefault(); // Allow drop
                });

                cellDiv.addEventListener("drop", (event) => {
                    event.preventDefault();
                    if (selectedPiece && !board[row][col]) {
                        placePiece(row, col, selectedPiece);
                        selectedPiece = null;
                    }
                });
            }
            gameBoard.appendChild(cellDiv);
        }
    }
}

// --- Piece Buttons ---
function updatePieceButtons() {
    const player1PiecesDiv = document.getElementById("player1Pieces");
    const player2PiecesDiv = document.getElementById("player2Pieces");
    player1PiecesDiv.innerHTML = "";
    player2PiecesDiv.innerHTML = "";

    for (let player = 1; player <= 2; player++) {
        const pieces = playerPieces[player];
        const playerDiv = player === 1 ? player1PiecesDiv : player2PiecesDiv;

        for (const piece in pieces) {
            if (pieces[piece] > 0) {
                const button = document.createElement("div");
                button.classList.add("piece-button");
                button.textContent = piece;
                button.dataset.piece = piece;
                button.dataset.player = player; // Add player data attribute

                // Only add click event listener for the current player
                if (player === currentPlayer) {
                    button.addEventListener("click", () => selectPiece(piece, player));
                }
                
                // Add draggable attribute and drag event listeners
                if (player === currentPlayer) {
                    button.draggable = true;
                    button.addEventListener('dragstart', (event) => {
                        event.dataTransfer.setData('text/plain', piece);
                        selectedPiece = piece; // Set selected piece for drop
                    });
                }

                if (playerDiv.lastChild && playerDiv.lastChild.children.length < 5) {
                    playerDiv.lastChild.appendChild(button);
                } else {
                    const row = document.createElement("div");
                    row.classList.add("piece-row");
                    row.appendChild(button);
                    playerDiv.appendChild(row);
                }
            }
        }
    }
}

function selectPiece(piece, player) {
    if (player !== currentPlayer) return; // Only allow selection for current player

    document.querySelectorAll(".piece-button").forEach((button) => button.classList.remove("selected"));
    selectedPiece = piece;
    const pieceButton = document.querySelector(`[data-piece='${piece}'][data-player='${player}']`);
    pieceButton.classList.add("selected");
}

// --- Cell Selection ---
function selectCell(row, col) {
    if (row === deadzone.row && col === deadzone.col) return;
    document.querySelectorAll(".cell").forEach((cell) => cell.classList.remove("selected"));
    selectedCell = { row, col };
    const cellDiv = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
    cellDiv.classList.add("selected");
}

// --- Attempt to Place Piece ---
function attemptPlacePiece() {
    if (!selectedCell) {
        alert("Select a cell first!");
        return;
    }
    if (!selectedPiece) {
        alert("Select a piece first!");
        return;
    }
    const { row, col } = selectedCell;
    if (!isValidMove(row, col, selectedPiece)) {
        alert("Invalid move!");
        return;
    }
    placePiece(row, col, selectedPiece);
    selectedCell = null;
    selectedPiece = null;
    document.querySelectorAll(".cell").forEach((cell) => cell.classList.remove("selected"));
    document.querySelectorAll(".piece-button").forEach((button) => button.classList.remove("selected"));
    if (!gameEnded) switchPlayer();
}

// --- Placing a Piece ---
function placePiece(row, col, piece) {
    const cellObj = { piece, owner: currentPlayer };
    board[row][col] = cellObj;
    const cellDiv = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
    cellDiv.textContent = piece;
    cellDiv.classList.add(currentPlayer === 1 ? "player1" : "player2");

    let baseScore = 0;
    if (!isSpecial(piece)) {
        baseScore = parseInt(piece);
    } else {
        if (piece === "K") baseScore = 50;
        else if (piece === "A") {
            if (hasKingInRow(row) || hasKingInCol(col) || hasKingInSquare(row, col)) baseScore = 11;
            else baseScore = 1;
        }
    }
    playerScores[currentPlayer] += baseScore;
    //call updatePieceButtons before decrementing the piece count.
    updatePieceButtons();
    playerPieces[currentPlayer][piece]--;

    updateScore();

    if (isSpecial(piece)) {
        applySpecialEffects(row, col, piece);
    }

    checkConversion(row, col);
}

// --- Move Validation ---
function isValidMove(row, col, piece) {
    if (board[row][col] !== null) return false;
    if (row === deadzone.row && col === deadzone.col) return false;

    if (isSpecial(piece)) {
        if (hasSpecialInRow(row) || hasSpecialInCol(col) || hasSpecialInSquare(row, col)) return false;
        if (piece === "B" && hasSpecialInDiagonals(row, col)) return false;
    } else {
        if (hasNumberInRow(row, piece) || hasNumberInCol(col, piece) || hasNumberInSquare(row, col, piece)) return false;
    }
    return true;
}

// --- Helper Functions ---
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
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (r - c === row - col) {
                const cell = board[r][c];
                if (cell && cell.piece && isSpecial(cell.piece)) return true;
            }
        }
    }
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
function applySpecialEffects(row, col, piece) {
    if (piece === "Q") {
        captureRowColSquare(row, col);
    } else if (piece === "K") {
        captureAdjacent(row, col);
    } else if (piece === "B") {
        captureDiagonals(row, col);
    }
}

function captureCell(row, col) {
    const cell = board[row][col];
    if (!cell || !cell.piece || cell.deadzone) return;
    if (cell.owner === currentPlayer) return;

    let value = 0;
    if (!isSpecial(cell.piece)) {
        value = parseInt(cell.piece);
    } else {
        if (cell.piece === "K") value = 50;
        else if (cell.piece === "A") value = 1;
    }

    playerScores[currentPlayer] += value;
    playerScores[cell.owner] -= value;
    cell.owner = currentPlayer;

    const cellDiv = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
    cellDiv.classList.remove("player1", "player2");
    cellDiv.classList.add(currentPlayer === 1 ? "player1" : "player2");

    updateScore();

    if (cell.piece === "K") {
        alert(`Player ${currentPlayer} captured the King! Game over.`);
        disableBoard();
        gameEnded = true;
    }
}

function captureRowColSquare(row, col) {
    const toCapture = new Set();
    for (let c = 0; c < 9; c++) {
        if (c === col) continue;
        if (board[row][c] && board[row][c].piece && !board[row][c].deadzone && board[row][c].owner !== currentPlayer) toCapture.add(`${row},${c}`);
    }
    for (let r = 0; r < 9; r++) {
        if (r === row) continue;
        if (board[r][col] && board[r][col].piece && !board[r][col].deadzone && board[r][col].owner !== currentPlayer) toCapture.add(`${r},${col}`);
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            if (r === row && c === col) continue;
            if (board[r][c] && board[r][c].piece && !board[r][c].deadzone && board[r][c].owner !== currentPlayer) toCapture.add(`${r},${c}`);
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
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1],
    ];
    directions.forEach(([dr, dc]) => {
        const r = row + dr;
        const c = col + dc;
        if (r >= 0 && r < 9 && c >= 0 && c < 9) {
            if (board[r][c] && board[r][c].piece && !board[r][c].deadzone && board[r][c].owner !== currentPlayer) captureCell(r, c);
        }
    });
}

function captureDiagonals(row, col) {
    let r = row - 1, c = col - 1;
    while (r >= 0 && c >= 0) {
        if (board[r][c] && board[r][c].piece && !board[r][c].deadzone && board[r][c].owner !== currentPlayer) captureCell(r, c);
        r--; c--;
    }
    r = row - 1; c = col + 1;
    while (r >= 0 && c < 9) {
        if (board[r][c] && board[r][c].piece && !board[r][c].deadzone && board[r][c].owner !== currentPlayer) captureCell(r, c);
        r--; c++;
    }
    r = row + 1; c = col - 1;
    while (r < 9 && c >= 0) {
        if (board[r][c] && board[r][c].piece && !board[r][c].deadzone && board[r][c].owner !== currentPlayer) captureCell(r, c);
        r++; c--;
    }
    r = row + 1; c = col + 1;
    while (r < 9 && c < 9) {
        if (board[r][c] && board[r][c].piece && !board[r][c].deadzone && board[r][c].owner !== currentPlayer) captureCell(r, c);
        r++; c++;
    }
}

// --- Row/Column/Square Conversion ---
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
        if (board[row][col] && board[row][col].piece && board[row][col].owner !== currentPlayer) captureCell(row, col);
    }
}

function convertCol(col) {
    for (let row = 0; row < 9; row++) {
        if (row === deadzone.row && col === deadzone.col) continue;
        if (board[row][col] && board[row][col].piece && board[row][col].owner !== currentPlayer) captureCell(row, col);
    }
}

function convertSquare(row, col) {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            if (r === deadzone.row && c === deadzone.col) continue;
            if (board[r][c] && board[r][c].piece && board[r][c].owner !== currentPlayer) captureCell(r, c);
        }
    }
}

// --- Turn Management & Score Update ---
function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    document.getElementById("turnIndicator").textContent = `Player ${currentPlayer}'s Turn`;
    updatePieceButtons();
}

function updateScore() {
    document.getElementById("scoreDisplay").textContent = `Player 1: ${playerScores[1]} | Player 2: ${playerScores[2]}`;
}

// --- Endgame ---
function disableBoard() {
    document.querySelectorAll(".cell").forEach((cell) => {
        cell.replaceWith(cell.cloneNode(true));
    });
}

// --- Initialize Game ---
createBoard();
updatePieceButtons();