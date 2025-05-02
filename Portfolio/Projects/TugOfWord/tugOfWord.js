const gameBoard = document.getElementById('game-board');
const gridCols = 70;
let currentRow = 0;
let branchingInfo = null;

// Function to create a word row
function createWordRow(word, offset = 0, isLocked = false) {
  for (let i = 0; i < gridCols; i++) {
    const cell = document.createElement('div');
    cell.classList.add('grid-cell');
    const input = document.createElement('input');
    input.setAttribute('maxlength', '1');

    if (i >= offset && i < offset + word.length) {
      const letter = word[i - offset];
      input.value = letter;
      if (isLocked) {
        input.disabled = true;
        // Add click event to enable branching
        input.addEventListener('click', () => {
          branchingInfo = {
            letter: letter,
            column: i
          };
          startNewGuessRow();
        });
      }
    } else {
      input.disabled = true;
    }

    cell.appendChild(input);
    gameBoard.appendChild(cell);
  }
  currentRow++;
}

// Function to start a new guess row
function startNewGuessRow() {
  if (!branchingInfo) return;
  const { letter, column } = branchingInfo;
  for (let i = 0; i < gridCols; i++) {
    const cell = document.createElement('div');
    cell.classList.add('grid-cell');
    const input = document.createElement('input');
    input.setAttribute('maxlength', '1');

    if (i === column) {
      input.value = letter;
      input.disabled = true;
    } else {
      input.disabled = false;
      input.addEventListener('input', moveFocus);
    }

    cell.appendChild(input);
    gameBoard.appendChild(cell);
  }
  currentRow++;
}

// Function to handle input and move focus
function moveFocus(e) {
  const input = e.target;
  const cell = input.parentElement;
  const cells = Array.from(gameBoard.querySelectorAll('.grid-cell'));
  const index = cells.indexOf(cell);
  if (index >= 0 && index < cells.length - 1) {
    const nextInput = cells[index + 1].querySelector('input');
    if (nextInput && !nextInput.disabled) {
      nextInput.focus();
    }
  }
}

// Initialize the game with a starting word
createWordRow('APPLE', 30, true);