// Project data
const projects = [
  {
    title: "Wordle Themed Game",
    description: "A fun word-guessing game inspired by Wordle.",
    liveUrl: "https://your-wordle-app.netlify.app",
    repoUrl: "https://github.com/your-username/wordle-app",
  },
  {
    title: "Coloku Puzzle Generator",
    description: "A dynamic crossword puzzle themed around novels.",
    liveUrl: "/Projects/ColorkuGen.html",
    repoUrl: "https://github.com/willSnipeCelly/ProfessionalWebsite/tree/main/Portfolio/Projects/ColorkuGen.html",
  },
  {
    title: "Financial Model Tool",
    description: "A financial modeling tool for analyzing investment returns.",
    liveUrl: "https://your-financial-tool.netlify.app",
    repoUrl: "https://github.com/your-username/financial-model",
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
