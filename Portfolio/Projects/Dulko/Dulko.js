const board = document.getElementById("board");
const player1Panel = document.getElementById("player1-panel");
const player2Panel = document.getElementById("player2-panel");

const NUMBERS = [2, 3, 4, 5, 6, 7, 8];
const SPECIALS = ["K", "Q", "B", "A"];

let gameState = {
    board: Array(9).fill(null).map(() => Array(9).fill(null)),
    deadzone: { x: Math.floor(Math.random() * 9), y: Math.floor(Math.random() * 9) },
    turn: 1,
    pieces: {
        1: createPieces(),
        2: createPieces()
    }
};

// Create Pieces for Each Player
function createPieces() {
    let pieces = {};
    NUMBERS.forEach(num => pieces[num] = 9); // 9 of each number
    SPECIALS.forEach(s => pieces[s] = (s === "A" ? 2 : 1)); // Aces (2), Others (1)
    return pieces;
}

// Initialize Board
function createBoard() {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = row;
            cell.dataset.col = col;
            if (row === gameState.deadzone.y && col === gameState.deadzone.x) {
                cell.classList.add("deadzone");
            }
            cell.addEventListener("click", handleCellClick);
            board.appendChild(cell);
        }
    }
}

// Display Player Pieces
function displayPieces() {
    player1Panel.innerHTML = "<h3>Player 1</h3>";
    player2Panel.innerHTML = "<h3>Player 2</h3>";

    NUMBERS.concat(SPECIALS).forEach(piece => {
        let p1 = createPieceElement(piece, 1);
        let p2 = createPieceElement(piece, 2);
        player1Panel.appendChild(p1);
        player2Panel.appendChild(p2);
    });
}

// Create Draggable Piece
function createPieceElement(piece, player) {
    const div = document.createElement("div");
    div.classList.add("piece");
    div.innerText = piece;
    div.dataset.piece = piece;
    div.dataset.player = player;
    div.draggable = true;
    div.addEventListener("dragstart", dragStart);
    div.addEventListener("click", selectPiece);
    return div;
}

// Handle Click-to-Select and Click-to-Place
let selectedPiece = null;
function selectPiece(event) {
    selectedPiece = event.target.dataset.piece;
}

// Handle Cell Click
function handleCellClick(event) {
    if (!selectedPiece) return;

    const row = event.target.dataset.row;
    const col = event.target.dataset.col;
    
    if (!isValidMove(row, col, selectedPiece)) return;

    event.target.innerText = selectedPiece;
    event.target.classList.add(`player${gameState.turn}`);

    updateGameState(row, col, selectedPiece);
}

// Drag & Drop Mechanics
function dragStart(event) {
    event.dataTransfer.setData("text", event.target.dataset.piece);
}

board.addEventListener("dragover", event => event.preventDefault());
board.addEventListener("drop", event => {
    event.preventDefault();
    const piece = event.dataTransfer.getData("text");
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;
    
    if (!isValidMove(row, col, piece)) return;

    event.target.innerText = piece;
    event.target.classList.add(`player${gameState.turn}`);

    updateGameState(row, col, piece);
});

// Validate Move
function isValidMove(row, col, piece) {
    if (gameState.board[row][col] || (row == gameState.deadzone.y && col == gameState.deadzone.x)) {
        return false;
    }
    return true;
}

// Update Game State
function updateGameState(row, col, piece) {
    gameState.board[row][col] = piece;
    gameState.pieces[1][piece] -= 1;
    gameState.pieces[2][piece] -= 1;
    gameState.turn = gameState.turn === 1 ? 2 : 1;
}

createBoard();
displayPieces();