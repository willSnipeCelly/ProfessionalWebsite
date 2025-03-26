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

const timelineData = {
    2012: {
        title: "Started College",
        description: "Began studies in Computer Science.",
        image: "https://via.placeholder.com/300",
        links: [{ text: "University Website", url: "https://example.com" }]
    },
    2015: {
        title: "First Internship",
        description: "Worked as a software engineering intern.",
        image: "https://via.placeholder.com/300",
        links: [{ text: "Internship Details", url: "https://example.com" }]
    },
    2018: {
        title: "First Full-Time Job",
        description: "Joined XYZ Corp as a software developer.",
        image: "https://via.placeholder.com/300",
        links: [{ text: "Company Website", url: "https://example.com" }]
    },
    2021: {
        title: "Senior Developer",
        description: "Promoted to senior software engineer.",
        image: "https://via.placeholder.com/300",
        links: [{ text: "Promotion Announcement", url: "https://example.com" }]
    },
    2025: {
        title: "Current Position",
        description: "Leading projects at ABC Tech.",
        image: "https://via.placeholder.com/300",
        links: [{ text: "Company Blog", url: "https://example.com" }]
    }
};

const slider = document.getElementById("timeline-slider");
const contentDiv = document.getElementById("timeline-content");

function updateTimeline(year) {
    const data = timelineData[year];
    
    if (!data) return;

    contentDiv.innerHTML = `
        <div class="timeline-year">${year}</div>
        <h2>${data.title}</h2>
        <p>${data.description}</p>
        <img src="${data.image}" class="timeline-image" alt="${data.title}">
        <div class="timeline-links">
            ${data.links.map(link => `<a href="${link.url}" target="_blank">${link.text}</a>`).join("")}
        </div>
    `;

    contentDiv.classList.remove("show");
    setTimeout(() => contentDiv.classList.add("show"), 50);
}

slider.addEventListener("input", () => {
    updateTimeline(slider.value);
});

// Initialize with the first year
updateTimeline(slider.value);

