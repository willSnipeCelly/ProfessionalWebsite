// --- Global Variables ---
const board = []; // 9x9 grid; each cell is either null or an object { piece, owner, deadzone }
const deadzone = { row: Math.floor(Math.random() * 9), col: Math.floor(Math.random() * 9) };
let currentPlayer = 1;
let playerScores = { 1: 0, 2: 0 };
let moveCount = 0; //track # of computer moves

const rulesBtn = document.getElementById("rulesBtn");
const rulesModal = document.getElementById("rulesModal");
const closeRulesBtn = document.getElementById("closeRulesBtn");
const newGameBtn = document.getElementById("newGameBtn");

const initialPieces = {
    K: 1,
    Q: 1,
    B: 1,
    A: 3,
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

let lastComputerMove = null; //Tracks computer move so user can see where they went
let selectedCell = null; // Will hold { row, col } when the user clicks a cell
let selectedPiece = null; // Will hold the selected piece type
let gameEnded = false;

const gameModeModal = document.getElementById("gameModeModal");
const twoPlayerBtn = document.getElementById("twoPlayerBtn");
const computerBtn = document.getElementById("computerBtn");
const difficultyOptions = document.getElementById("difficultyOptions");
const difficultyBtns = document.querySelectorAll(".difficultyBtn");

let gameMode = null;
let difficulty = null;

// Function to start a new game
function startNewGame() {
    gameModeModal.style.display = "flex";
    gameMode = null;
    difficulty = null;
    resetGame();
}

//Function to reset the game to its initial state
function resetGame(){
    currentPlayer = 1;
    playerScores = { 1: 0, 2: 0 };
    playerPieces = { 1: { ...initialPieces }, 2: { ...initialPieces } };
    board.forEach(row=> row.fill(null));
    updateScore();
    updatePieceButtons();
    createBoard();
    document.getElementById("turnIndicator").textContent = `Player ${currentPlayer}'s Turn`;
}

// Event listeners for game mode selection
twoPlayerBtn.addEventListener("click", () => {
    gameMode = "twoPlayer";
    gameModeModal.style.display = "none";
    startGame(); //two play start
});

computerBtn.addEventListener("click", () => {
    gameMode = "computer";
    difficultyOptions.style.display = "block";
});

// Event listeners for difficulty selection
difficultyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        difficulty = btn.dataset.difficulty;
        gameModeModal.style.display = "none";
        startGame(); // Start the game with the chosen mode and difficulty
    });
});

// Function to start the game
function startGame() {
    gameModeModal.style.display = "none";
    moveCount = 0;
    initializeNines(); // Generate 9's

    if (gameMode === "computer") {
        currentPlayer = 1;
        if (difficulty) {
            // Optionally, start first move after a delay
            // setTimeout(computerMove, 1000);
        }
    } else if (gameMode === "twoPlayer") {
        currentPlayer = 1; // Player 1 starts
    }
}

// --- Create Board ---
function createBoard() {
    const gameBoard = document.getElementById("gameBoard");
        gameBoard.innerHTML = ""; // Clear existing board

    const subgrids = Array.from({ length: 9 }, () => document.createElement("div"));
    subgrids.forEach((subgrid) => {
        subgrid.classList.add("subgrid");
        gameBoard.appendChild(subgrid);
    });

    for (let row = 0; row < 9; row++) {
        board[row] = [];
        for (let col = 0; col < 9; col++) {
            const cellDiv = document.createElement("div");
            cellDiv.classList.add("cell");
            cellDiv.dataset.row = row;
            cellDiv.dataset.col = col;

            if (row === deadzone.row && col === deadzone.col) {
                cellDiv.classList.add("deadzone");
                board[row][col] = { deadzone: true };
            } else {
                board[row][col] = null;

                // Click for non-drag interaction
                cellDiv.addEventListener("click", () => {
                    if (selectedPiece) {
                        selectedCell = { row, col };
                        attemptPlacePiece();
                    }
                });

                // Desktop Drag & Drop
                cellDiv.addEventListener("dragover", (event) => {
                    event.preventDefault();
                });
                cellDiv.addEventListener("drop", (event) => {
                    event.preventDefault();
                    if (selectedPiece && !board[row][col]) {
                        selectedCell = { row, col };
                        attemptPlacePiece();
                        selectedPiece = null;
                    }
                });

                // Mobile Touch Events for "Drop" Simulation
                cellDiv.addEventListener("touchend", (event) => {
                    event.preventDefault();
                    if (selectedPiece && !board[row][col]) {
                        selectedCell = { row, col };
                        attemptPlacePiece();
                        selectedPiece = null;
                    }
                });
            }

            const subgridIndex = Math.floor(row / 3) * 3 + Math.floor(col / 3);
            subgrids[subgridIndex].appendChild(cellDiv);
        }
    }
}

function initializeNines() {
    const numNines = Math.random() < 0.5 ? 2 : 4;
    for (let i = 0; i < numNines; i++) {
        let row, col;
        do {
            row = Math.floor(Math.random() * 9);
            col = Math.floor(Math.random() * 9);
        } while (board[row][col] || (row === deadzone.row && col === deadzone.col));

        board[row][col] = { piece: "9", owner: 0, captureValue: 9 }; // Neutral 9
        const cellDiv = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
        cellDiv.textContent = "9";
        cellDiv.classList.add("neutral-nine"); // Add a class for styling
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
            for (let i = 0; i < pieces[piece]; i++) {
                const button = document.createElement("div");
                button.classList.add("piece-button");
                button.textContent = piece;
                button.dataset.piece = piece;
                button.dataset.player = player;

                if (player === currentPlayer) {
                    // Desktop Drag & Drop
                    button.draggable = true;
                    button.addEventListener("dragstart", (event) => {
                        event.dataTransfer.setData("text/plain", piece);
                        selectedPiece = piece;
                        button.classList.add("dragging"); // Add class for styling during drag
                    });
                    button.addEventListener("dragend", () => {
                        button.classList.remove("dragging");
                    });

                    // Mobile Touch Events for Drag-and-Drop Simulation
                    button.addEventListener("touchstart", (event) => {
                        selectedPiece = piece;
                        button.classList.add("dragging"); // Add class for styling during "drag"
                    });
                    button.addEventListener("touchend", (event) => {
                        button.classList.remove("dragging");
                        // We'll handle the "drop" on the board cell's touchend
                    });

                    // Click for non-drag interaction
                    button.addEventListener("click", () => selectPiece(piece, player));
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
    if (player !== currentPlayer) return;

    document.querySelectorAll(".piece-button").forEach((button) => button.classList.remove("selected"));
    selectedPiece = piece;
    const pieceButton = document.querySelector(`[data-piece='${piece}'][data-player='${player}']`);
    pieceButton.classList.add("selected");
}

function attemptPlacePiece() {
    /* i don't think this should matter because you can select either order.
    
    if (!selectedCell) {
        alert("Select a cell first!");
        return;
    }*/
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
    playerPieces[currentPlayer][piece]--;
    updateScore();
    updatePieceButtons();
    
        if (isSpecial(piece)) {
        applySpecialEffects(row, col, piece);
    }

    checkConversion(row, col);

    // Update Ace values if a King is placed
    if (piece === "K") {
        updateAceValues(row, col);
    }
    
}

function updateAceValues(row, col) {
    // Update Aces in the same row
    for (let c = 0; c < 9; c++) {
        if (board[row][c] && board[row][c].piece === "A") {
            const cell = board[row][c];
            if (hasKingInRow(row) || hasKingInCol(c) || hasKingInSquare(row, c)) {
                playerScores[cell.owner] -= 1;
                playerScores[cell.owner] += 11;
                updateScore();
            }
        }
    }

    // Update Aces in the same column
    for (let r = 0; r < 9; r++) {
        if (board[r][col] && board[r][col].piece === "A") {
            const cell = board[r][col];
            if (hasKingInRow(r) || hasKingInCol(col) || hasKingInSquare(r, col)) {
                playerScores[cell.owner] -= 1;
                playerScores[cell.owner] += 11;
                updateScore();
            }
        }
    }

    // Update Aces in the same square
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            if (board[r][c] && board[r][c].piece === "A") {
                const cell = board[r][c];
                if (hasKingInRow(r) || hasKingInCol(c) || hasKingInSquare(r, c)) {
                    playerScores[cell.owner] -= 1;
                    playerScores[cell.owner] += 11;
                    updateScore();
                }
            }
        }
    }
}

attemptPlacePiece

// --- Cell Selection ---
function selectCell(row, col) {
    if (row === deadzone.row && col === deadzone.col) return;
    document.querySelectorAll(".cell").forEach((cell) => cell.classList.remove("selected"));
    selectedCell = { row, col };
    const cellDiv = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
    cellDiv.classList.add("selected");
}

function isValidMove(row, col, piece) {
    if (board[row][col] !== null) return false;
    if (row === deadzone.row && col === deadzone.col) return false;

    if (piece === "A") {
        return true; // Aces can be placed anywhere
    } else if (isSpecial(piece)) {
        if (hasSpecialInRow(row) || hasSpecialInCol(col) || hasSpecialInSquare(row, col)) return false;
        if (piece === "B" && hasSpecialInDiagonals(row, col)) return false;
        if (piece === "K" && isKingAdjacent(row, col)) return false; // Prevent adjacent Kings
    } else {
        if (hasNumberInRow(row, piece) || hasNumberInCol(col, piece) || hasNumberInSquare(row, col, piece)) return false;
    }
    return true;
}

function isKingAdjacent(row, col) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1],
    ];

    for (const [dr, dc] of directions) {
        const r = row + dr;
        const c = col + dc;
        if (r >= 0 && r < 9 && c >= 0 && c < 9 && board[r][c] && board[r][c].piece === "K") {
            return true; // King is adjacent
        }
    }
    return false; // No Kings are adjacent
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
        captureRowCol(row, col); // Capture row and column for Queen
    } else if (piece === "K") {
        captureAdjacent(row, col); // Capture adjacent cells for King
    } else if (piece === "B") {
        captureDiagonals(row, col); // Capture diagonals for Bishop
    }
}

function captureCell(row, col) {
    if (row < 0 || row > 8 || col < 0 || col > 8) return;
    const cell = board[row][col];
    if (!cell || !cell.piece || cell.deadzone || cell.owner === currentPlayer) return;

    let value = 0;
    const cellDiv = document.querySelector(`[data-row='${row}'][data-col='${col}']`);

    if (cell.piece === "9") {
        value = cell.captureValue;
        cell.captureValue += 9; // Increment capture value
        cellDiv.textContent = cell.captureValue; // Update the text on the board
    } else if (!isSpecial(cell.piece)) {
        value = parseInt(cell.piece);
    } else {
        if (cell.piece === "K") value = 50;
        else if (cell.piece === "A") value = 1;
        else if (cell.piece === "Q" || cell.piece === "B") value = 0; // Queens and Bishops have no inherent point value on capture
    }

    playerScores[currentPlayer] += value;
    playerScores[cell.owner] -= value;
    cell.owner = currentPlayer;

    cellDiv.classList.remove("player1", "player2", "neutral-nine");
    cellDiv.classList.add(currentPlayer === 1 ? "player1" : "player2");

    updateScore();

    if (cell.piece === "K") {
        alert(`Player ${currentPlayer} captured the King! Game over.`);
        disableBoard();
        gameEnded = true;
    }
}

function captureRowCol(row, col) {
    for (let i = 0; i < 9; i++) {
        if (i !== col && board[row][i] && board[row][i].owner !== currentPlayer) {
            captureCell(row, i);
        }
        if (i !== row && board[i][col] && board[i][col].owner !== currentPlayer) {
            captureCell(i, col);
        }
    }
}

/* i think this isnt used
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
*/
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
        if (board[row][col] && board[row][col].piece && board[row][col].owner !== currentPlayer) {
            captureCell(row, col);
        }
    }
}

function convertCol(col) {
    for (let row = 0; row < 9; row++) {
        if (row === deadzone.row && col === deadzone.col) continue;
        if (board[row][col] && board[row][col].piece && board[row][col].owner !== currentPlayer) {
            captureCell(row, col);
        }
    }
}

function convertSquare(row, col) {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            if (r === deadzone.row && c === deadzone.col) continue;
            if (board[r][c] && board[r][c].piece && board[r][c].owner !== currentPlayer) {
                captureCell(r, c);
            }
        }
    }
}

// Function to make a computer move

function computerMove() {
    // Clear previous computer move highlight
    if (lastComputerMove) {
        const lastCellDiv = document.querySelector(`[data-row='${lastComputerMove.row}'][data-col='${lastComputerMove.col}']`);
        if (lastCellDiv) {
            lastCellDiv.classList.remove("computer-move");
        }
        lastComputerMove = null;
    }

    let row, col, piece;

    if (difficulty === "easy") {
        [row, col, piece] = easyMove();
    } else if (difficulty === "medium") {
        [row, col, piece] = mediumMove();
    } else if (difficulty === "hard") {
        [row, col, piece] = hardMove();
    }

    if (row !== null && col !== null && piece !== null) {
        selectedPiece = piece;
        selectedCell = { row, col };
        attemptPlacePiece();
        moveCount++;

        // Store and highlight the computer's move
        lastComputerMove = { row, col };
        const currentCellDiv = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
        if (currentCellDiv) {
            currentCellDiv.classList.add("computer-move");
        }
    } else if (difficulty !== "hard"{
        [row, col, piece] = hardMove();
    } else {
        alert("cannodt make move!");
    }
}

// Easy mode: Randomly select and place a piece
function easyMove() {
    const availablePieces = Object.keys(playerPieces[2]).filter(piece => playerPieces[2][piece] > 0);
    if (availablePieces.length === 0) return [null, null, null];

    const piece = availablePieces[Math.floor(Math.random() * availablePieces.length)];
    const emptyCells = [];
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (!board[row][col] && isValidMove(row, col, piece)) {
                emptyCells.push({ row, col });
            }
        }
    }

    if (emptyCells.length === 0) return [null, null, null];
    const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    return [row, col, piece];
}

// Medium mode: Mix of easy and hard, increasing hard strategy over time
function mediumMove() {
    const hardChance = 0.5 + (moveCount * 0.02); // Increase chance of hard strategy
    if (Math.random() < hardChance) {
        return hardMove();
    } else {
        return easyMove();
    }
}

// Hard mode: Prioritize completing rows/columns/squares, then capturing many pieces, then highest value piece
function hardMove() {
    // 1. Check for rows/columns/squares to complete
    let move = findCompletingMove();
    if (move) return move;

    // 2. Check for captures of 4 or more pieces with special pieces
    move = findLargeCaptureMove();
    if (move) return move;

    // 3. Play highest available number piece
    return findHighestNumberMove();
}

// Helper function to find a move that completes a row, column, or square
function findCompletingMove() {
    const availablePieces = Object.keys(playerPieces[2]).filter(piece => playerPieces[2][piece] > 0);
    for (const piece of availablePieces) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (!board[row][col] && isValidMove(row, col, piece)) {
                    board[row][col] = { piece, owner: 2 }; // Simulate move
                    if (isCompleteRow(row) || isCompleteCol(col) || isCompleteSquare(row, col)) {
                        board[row][col] = null; // Undo simulation
                        return [row, col, piece];
                    }
                    board[row][col] = null; // Undo simulation
                }
            }
        }
    }
    return null;
}

// Helper function to find a move that captures 4 or more pieces
function findLargeCaptureMove() {
    const specialPieces = ["Q", "K", "B"];
    for (const piece of specialPieces) {
        if (playerPieces[2][piece] > 0) {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (!board[row][col] && isValidMove(row, col, piece)) {
                        let capturedCount = 0;
                        if (piece === "Q") {
                            // Simulate Queen capture
                            capturedCount = simulateCaptureRowCol(row, col);
                        } else if (piece === "K") {
                            // Simulate King capture
                            capturedCount = simulateCaptureAdjacent(row, col);
                        } else if (piece === "B") {
                            // Simulate Bishop capture
                            capturedCount = simulateCaptureDiagonals(row, col);
                        }
                        if (capturedCount >= 4) {
                            return [row, col, piece];
                        }
                    }
                }
            }
        }
    }
    return null;
}

// Helper function to find the highest available number piece
function findHighestNumberMove() {
    const numberPieces = Object.keys(playerPieces[2]).filter(piece => !isNaN(parseInt(piece)) && playerPieces[2][piece] > 0).sort((a, b) => b - a);
    for (const piece of numberPieces) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (!board[row][col] && isValidMove(row, col, piece)) {
                    return [row, col, piece];
                }
            }
        }
    }
    return null;
}

// Helper functions to simulate captures
function simulateCaptureRowCol(row, col) {
    let count = 0;
    for (let i = 0; i < 9; i++) {
        if (i !== col && board[row][i] && board[row][i].owner !== 2) count++;
        if (i !== row && board[i][col] && board[i][col].owner !== 2) count++;
    }
    return count;
}

function simulateCaptureAdjacent(row, col) {
    let count = 0;
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1],
    ];
    directions.forEach(([dr, dc]) => {
        const r = row + dr;
        const c = col + dc;
        if (r >= 0 && r < 9 && c >= 0 && c < 9 && board[r][c] && board[r][c].owner !== 2) count++;
    });
    return count;
}

function simulateCaptureDiagonals(row, col) {
    let count = 0;
    let r = row - 1, c = col - 1;
    while (r >= 0 && c >= 0) {
        if (board[r][c] && board[r][c].owner !== 2) count++;
        r--; c--;
    }
    r = row - 1; c = col + 1;
    while (r >= 0 && c < 9) {
        if (board[r][c] && board[r][c].owner !== 2) count++;
        r--; c++;
    }
    r = row + 1; c = col - 1;
    while (r < 9 && c >= 0) {
        if (board[r][c] && board[r][c].owner !== 2) count++;
        r++; c--;
    }
    r = row + 1; c = col + 1;
    while (r < 9 && c < 9) {
        if (board[r][c] && board[r][c].owner !== 2) count++;
        r++; c++;
    }
    return count;
}

// --- Turn Management & Score Update ---
function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    document.getElementById("turnIndicator").textContent = `Player ${currentPlayer}'s Turn`;
    updatePieceButtons();

    if (gameMode === "computer" && currentPlayer === 2) {
        setTimeout(computerMove, 500); // Delay computer move
    }

    if (!checkGameEnd()) {
        if (gameMode === "computer" && currentPlayer === 2) {
            setTimeout(() => {
                if (!checkComputerMovePossible()) {
                    alert("Computer forfeits!");
                    startNewGame();
                }
            }, 1000);
        }
    }
}

function checkGameEnd() {
    if (!checkPlayerMovePossible(currentPlayer)) {
        alert(`Player ${currentPlayer} has no moves left!`);
        displayScores();
        startNewGame();
        return true;
    }
    return false;
}

function checkPlayerMovePossible(player) {
    const availablePieces = Object.keys(playerPieces[player]).filter(piece => playerPieces[player][piece] > 0);
    for (const piece of availablePieces) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (!board[row][col] && isValidMove(row, col, piece)) {
                    return true; // Found a valid move
                }
            }
        }
    }
    return false; // No valid moves found
}

function checkComputerMovePossible() {
    return checkPlayerMovePossible(2);
}

function displayScores() {
    alert(`Game Over! Player 1: ${playerScores[1]} | Player 2: ${playerScores[2]}`);
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

// Event listeners for rules modal
rulesBtn.addEventListener("click", () => {
    rulesModal.style.display = "flex";
});

closeRulesBtn.addEventListener("click", () => {
    rulesModal.style.display = "none";
});

// Event listener for new game button
newGameBtn.addEventListener("click", startNewGame);

// --- Initialize Game ---
createBoard();
updatePieceButtons();
startNewGame();