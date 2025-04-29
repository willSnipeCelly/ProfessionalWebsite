const secretWord = "planet"; // You can randomize this later
let guesses = [];

document.getElementById('submit-guess').addEventListener('click', () => {
  const input = document.getElementById('guess-input');
  const guess = input.value.toLowerCase();
  if (!guess) return;

  guesses.push(guess);
  renderGuesses();
  input.value = '';
});

function renderGuesses() {
  const container = document.getElementById('guesses');
  container.innerHTML = '';

  guesses.forEach(guess => {
    const row = document.createElement('div');
    row.classList.add('word-row');

    for (let i = 0; i < guess.length; i++) {
      const box = document.createElement('div');
      box.classList.add('letter-box');
      box.textContent = guess[i];

      if (guess[i] === secretWord[i]) {
        box.classList.add('green');
      } else if (secretWord.includes(guess[i])) {
        box.classList.add('yellow');
      } else {
        box.classList.add('grey');
      }

      row.appendChild(box);
    }

    container.appendChild(row);
  });
}