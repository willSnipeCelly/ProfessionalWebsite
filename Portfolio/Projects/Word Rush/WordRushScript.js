let answerWords = [];
let guessableWords = [];
let correctWord = "";
let guesses = 0;
let totalScore = 0;
let totalTime = 0;
let times = [];
let startTime;
let roundCount = 0;

// Load word lists from external files
async function loadWords() {
    try {
        const answerResponse = await fetch("words.txt");
        const guessableResponse = await fetch("guessable_words.txt");

        if (!answerResponse.ok || !guessableResponse.ok) {
            throw new Error("Failed to load word lists.");
        }

        const answerText = await answerResponse.text();
        const guessableText = await guessableResponse.text();

        answerWords = answerText.split("\n").map(word => word.trim().toLowerCase()).filter(word => word.length === 5);
        guessableWords = guessableText.split("\n").map(word => word.trim().toLowerCase()).filter(word => word.length === 5);

        if (answerWords.length === 0) {
            throw new Error("No valid words found in words.txt");
        }

        startGame();
    } catch (error) {
        console.error(error);
        alert("Error loading word lists. Make sure words.txt and guessable_words.txt exist and are properly formatted.");
    }
}

// Start the game after loading words
function startGame(score = 0) {
    roundCount++;
    if (roundCount > 5) {
        //alert(`Game Over! Your final score: ${totalScore}`);
        setTimeout(() => {
            // Ask user for a message (140 characters max)
            let message = prompt("Enter a message to save your high score (140 characters max):");
            if (message) {
                message = message.substring(0, 140); // Limit to 140 characters
                saveScore(score, message);
            }
            let choice = confirm("View high scores or play again?");
            if (choice) {
                window.location.href = "highscores.html"; // Redirect to high scores page
            } else {
                startGame();
            }
        }, 500);
        resetGame();  // Reset everything after 5 rounds
        return;
    };

    startTime = Date.now();
    guesses = 0;
    correctWord = answerWords[Math.floor(Math.random() * answerWords.length)];
    console.log("Word to guess:", correctWord);

    // Clear board and input
    document.getElementById("game-board").innerHTML = "";
    document.getElementById("guess-input").value = "";

    // Reset keyboard colors
    document.querySelectorAll(".key").forEach(button => {
        button.style.backgroundColor = "";
        button.disabled = false;
    });

    document.getElementById("score-display").textContent = `Score: ${totalScore}`;
    document.getElementById("guess-container").innerHTML = "";  // Clear previous guesses
}

function saveScore(score, message) {
    const timestamp = new Date().toISOString();
    const newEntry = { score, message, timestamp };

    // Get existing scores from localStorage
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    
    // Add new score
    scores.push(newEntry);
    
    // Save back to localStorage
    localStorage.setItem("scores", JSON.stringify(scores));
}

//Handle user's guess
async function makeGuess() {
    let guess = document.getElementById("guess-input").value.toLowerCase();
    document.getElementById("guess-input").value = ""; // Clear input field

    guesses++;

    if (guess.length !== 5) {
        alert("Please enter a 5-letter word.");
        return;
    }

    if (!guessableWords.includes(guess)) {
        alert("Not in word list.");
        return;
    }

    let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    times.push(elapsedTime);
    totalTime += elapsedTime;
    displayGuess(guess);

    if (guess === correctWord) {
        setTimeout(() => {
            updateScore(elapsedTime, guesses);
            rc1 = roundCount + 1;
            if (rc1 != 6) {
                alert("Round " + roundCount + " complete. Continue to round " + rc1 + "/5");
            };
            startGame(totalScore);
        }, 500);
    } else if (guesses >= 6) {
        setTimeout(() => {
            alert(`Game Over! The word was "${correctWord}".`);
            roundCount = 6;
            startGame(totalScore);
        }, 500);
    }
}

function updateScore(timeTaken, guessCount) {
    let baseScore = 100;
    let timeBonus = Math.max(0, 120 - 2 * timeTaken);
    let guessPenalty = [0, 0, 0, -25, -50, -100][guessCount - 1];
    let roundScore = baseScore + timeBonus + guessPenalty;
    totalScore += roundScore;
    document.getElementById("score-display").textContent = `Score: ${totalScore}`;
}


function displayGuess(guess) {
    const guessContainer = document.getElementById("guess-container");
    const row = document.createElement("div");
    row.classList.add("guess-row");

    let wordToGuess = correctWord.split("");
    let guessArray = guess.split("");
    let letterCount = {};

    // Count occurrences of each letter in the correct word
    for (let letter of wordToGuess) {
        letterCount[letter] = (letterCount[letter] || 0) + 1;
    }

    // First pass: Identify correct letters (green)
    let result = Array(5).fill("gray");
    for (let i = 0; i < 5; i++) {
        if (guessArray[i] === wordToGuess[i]) {
            result[i] = "green";
            letterCount[guessArray[i]]--; // Reduce available count for that letter
        }
    }

    // Second pass: Identify misplaced letters (yellow)
    for (let i = 0; i < 5; i++) {
        if (result[i] === "gray" && letterCount[guessArray[i]] > 0) {
            result[i] = "yellow";
            letterCount[guessArray[i]]--; // Reduce available count for that letter
        }
    }

    // Apply the colors and update the keyboard
    for (let i = 0; i < 5; i++) {
        const tile = document.createElement("span");
        tile.classList.add("tile");
        tile.textContent = guessArray[i].toUpperCase();
        tile.style.backgroundColor = result[i];

        const key = document.querySelector(`button[data-key='${guessArray[i]}']`);
        if (key) {
            if (result[i] === "green") {
                key.style.backgroundColor = "green";
            } else if (result[i] === "yellow" && key.style.backgroundColor !== "green") {
                key.style.backgroundColor = "yellow";
            } else if (result[i] === "gray" && !["green", "yellow"].includes(key.style.backgroundColor)) {
                key.style.backgroundColor = "gray";
            }
        }

        row.appendChild(tile);
    }

    guessContainer.appendChild(row);
}

function resetGame() {
    totalScore = 0;
    totalTime = 0;
    times = [];
    roundCount = 0;
    startGame();
}

/*Note: not displaying game timer in this version
// Update game timer
function updateTimer() {
    let timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById("timer").textContent = `Time: ${timeElapsed}s`;
}
*/

//Add listener to guess button
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded, adding event listeners...");
    
    document.getElementById("guess-button").addEventListener("click", makeGuess);
    
    document.getElementById("guess-input").addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            makeGuess();
        }
    });

    document.querySelectorAll(".key").forEach(button => {
        button.addEventListener("click", function () {
            const guessInput = document.getElementById("guess-input");
            
            if (this.id === "backspace") {
                guessInput.value = guessInput.value.slice(0, -1); // Remove last letter
            } else if (this.id === "enter") {
                makeGuess(); // Submit the guess
            } else if (guessInput.value.length < 5) {
                guessInput.value += this.dataset.key; // Append letter
            }
        });
    });
});

/*Node solution
async function saveScore(score, message) {
    await fetch("http://localhost:8000/save-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score, message })
    });
}
*/

// Load words and start game
loadWords();
