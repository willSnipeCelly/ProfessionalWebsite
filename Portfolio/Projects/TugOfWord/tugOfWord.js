const secretWord = "planet";
let placedWords = []; // { word, offset }
let branchingInfo = null; // { letter: 'a', column: 3 }

const input = document.getElementById('guess-input');
const button = document.getElementById('submit-guess');
const guessesContainer = document.getElementById('guesses');

// Submit guess
button.addEventListener('click', () => {
  const guess = input.value.toLowerCase();
  if (!guess) return;

  let offset = 0;

  if (branchingInfo) {
    const { letter, column } = branchingInfo;
    const matchIndex = guess.indexOf(letter);

    if (matchIndex === -1) {
      alert(`Your guess must include the letter '${letter.toUpperCase()}' to branch.`);
      return;
    }

    offset = column - matchIndex;
    if (offset < 0) offset = 0;
  }

  placedWords.push({ word: guess, offset });
  branchingInfo = null;
  input.placeholder = "Enter your guess";
  input.value = '';
  renderGuesses();
});

function renderGuesses() {
  guessesContainer.innerHTML = '';

  placedWords.forEach(({ word, offset }, rowIndex) => {
    const row = document.createElement('div');
    row.classList.add('guess-row');

    // Add leading blanks for offset
    for (let i = 0; i < offset; i++) {
      const blank = document.createElement('div');
      blank.className = 'letter-box';
      blank.textContent = '';
      blank.style.visibility = 'hidden';
      row.appendChild(blank);
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

      // Enable branching from any letter
      box.addEventListener('click', () => {
        const columnIndex = i + offset;
        branchingInfo = { letter: word[i], column: columnIndex };
        input.placeholder = `Next word must include '${word[i].toUpperCase()}'`;
        input.focus();
      });

      row.appendChild(box);
    }

    guessesContainer.appendChild(row);
  });
}