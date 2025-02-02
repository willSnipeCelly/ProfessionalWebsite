let scores = [];
let currentPage = 0;
const scoresPerPage = 10;

function loadScores() {
    let storedScores = JSON.parse(localStorage.getItem("scores")) || [];

    // Get today's date in YYYY-MM-DD format
    let today = new Date().toISOString().split("T")[0];

    // Filter for today's scores and sort by highest score
    scores = storedScores.filter(s => s.timestamp.startsWith(today))
                         .sort((a, b) => b.score - a.score);

    displayScores();
}

function displayScores() {
    let container = document.getElementById("score-container");
    container.innerHTML = ""; // Clear old scores

    let start = currentPage * scoresPerPage;
    let end = start + scoresPerPage;
    let pagedScores = scores.slice(start, end);

    pagedScores.forEach((entry, index) => {
        let div = document.createElement("div");
        div.innerHTML = `<strong>Rank ${start + index + 1}:</strong> ${entry.score} - "${entry.message}"`;
        container.appendChild(div);
    });

    document.getElementById("prev").disabled = currentPage === 0;
    document.getElementById("next").disabled = end >= scores.length;
}

document.getElementById("prev").addEventListener("click", () => {
    if (currentPage > 0) {
        currentPage--;
        displayScores();
    }
});

document.getElementById("next").addEventListener("click", () => {
    if ((currentPage + 1) * scoresPerPage < scores.length) {
        currentPage++;
        displayScores();
    }
});

loadScores();
