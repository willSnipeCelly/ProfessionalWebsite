// Project data
const projects = [
  {
    title: "Wordle Themed Game",
    description: "A fun word-guessing game inspired by Wordle.",
    liveUrl: "projects/word%20rush/wordrush.html",
    repoUrl: "https://github.com/willSnipeCelly/ProfessionalWebsite/tree/main/Portfolio/Projects/",
  },
  {
    title: "Colorku Puzzle Generator",
    description: "Generate sudoku puzzles playable on phone or colorku board.",
    liveUrl: "/Projects/ColorkuGen.html",
    repoUrl: "https://github.com/willSnipeCelly/ProfessionalWebsite/tree/main/Portfolio/Projects/ColorkuGen.html",
  },
  {
    title: "Crossword Puzzles",
    description: "Here is a dump of crossword puzzles I've made. They are just for fun.",
    liveUrl: "/Crosswords/crosswords.html",
    //repoUrl: "https://github.com/your-username/financial-model",
  },
  {
    title: "WKEIIpedia",
    description: "Guess the wikipedia article from the information in the article.",
    liveUrl: "/Projects/wkeiipedia.html",
    repoUrl: "https://github.com/willSnipeCelly/ProfessionalWebsite/tree/main/Portfolio/Projects/wkeiipedia.html",
  },
  {
    title: "Dulko",
    description: "Guess the wikipedia article from the information in the article.",
    liveUrl: "/Projects/Dulko/Dulko.html",
    repoUrl: "https://github.com/willSnipeCelly/ProfessionalWebsite/tree/main/Portfolio/Portfolio/Projects/Dulko.html",
  },
];

// Dynamically load projects
const projectList = document.getElementById('project-list');
projects.forEach((project) => {
  const col = document.createElement('div');
  col.className = 'col-md-4 mb-4';
  col.innerHTML = `
    <div class="card h-100">
      <div class="card-body">
        <h5 class="card-title">${project.title}</h5>
        <p class="card-text">${project.description}</p>
        <a href="${project.liveUrl}" class="btn btn-success me-2" target="_blank">Live Demo</a>
        <a href="${project.repoUrl}" class="btn btn-secondary" target="_blank">View Code</a>
      </div>
    </div>
  `;
  projectList.appendChild(col);
});
