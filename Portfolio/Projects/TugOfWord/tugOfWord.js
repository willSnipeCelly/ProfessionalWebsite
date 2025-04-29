const secretWord = "planet";
let placedWords = []; // Stores objects: { word: string, offset: number }
let branchingIndex = null; // Which letter index we're branching off

const input = document.getElementById('guess-input');
const button = document.getElementById('submit-guess');
const guessesContainer = document.getElementById('guesses');

// Submit a guess
button.addEventListener('click', () => {
  const guess = input.value.toLowerCase();
  if (!guess) return;

  // Compute offset: center the word so branching letter lines up
  const offset = branchingIndex !== null
    ? Math.max(branchingIndex - guess.indexOf(secretWord[branchingIndex]), 0)
    : 0;

  placedWords.push({ word: guess, offset });
  branchingIndex = null;
  input.value = '';
  renderGuesses();
});

// Render all guessed words
function renderGuesses() {
  guessesContainer.innerHTML = '';

  placedWords.forEach((entry, rowIndex) => {
    const { word, offset } = entry;

    const row = document.createElement('div');
    row.classList.add('guess-row');

    // Add empty boxes for offset
    for (let i = 0; i < offset; i++) {
      const emptyBox = document.createElement('div');
      emptyBox.className = 'letter-box';
      emptyBox.textContent = '';
      emptyBox.style.visibility = 'hidden';
      row.appendChild(emptyBox);
    }

    // Add letters
    for (let i = 0; i < word.length; i++) {
      const box = document.createElement('div');
      box.className = 'letter-box';
      box.textContent = word[i];

      if (secretWord[i] === word[i]) {
        box.classList.add('green');
      } else if (secretWord.includes(word[i])) {
        box.classList.add('yellow');
      } else {
        box.classList.add('grey');
      }

      // Add click-to-branch behavior
      box.addEventListener('click', () => {
        branchingIndex = i + offset;
        input.placeholder = `Start a word using '${word[i]}'`;
        input.focus();
      });

      row.appendChild(box);
    }

    guessesContainer.appendChild(row);
  });
}