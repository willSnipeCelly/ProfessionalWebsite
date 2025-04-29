// USING CDN Version -- import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Using Firebase via CDN (firebase.auth())
const auth = firebase.auth();

// Get references to HTML elements
const authButton = document.getElementById("auth-button"); // Navbar button
const authModal = document.getElementById("auth-modal");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("error-message");
const loginButton = document.getElementById("login-button");
const signupButton = document.getElementById("signup-button");

// Show/hide modal
function showAuthModal() {
    authModal.style.display = "block";
}
function hideAuthModal() {
    authModal.style.display = "none";
}

// Track auth state
auth.onAuthStateChanged(user => {
    if (user) {
        authButton.textContent = "Logout";
        authButton.onclick = () => {
            auth.signOut().then(hideAuthModal);
        };
    } else {
        authButton.textContent = "Login/Signup";
        authButton.onclick = showAuthModal;
        hideAuthModal();
    }
});

// Login logic
loginButton.addEventListener("click", () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            console.log("Logged in:", userCredential.user);
            errorMessage.textContent = '';
            hideAuthModal();
        })
        .catch(error => {
            errorMessage.textContent = error.message;
            console.error("Login error:", error);
        });
});

// Sign-up logic
signupButton.addEventListener("click", () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            console.log("Signed up:", userCredential.user);
            errorMessage.textContent = '';
            hideAuthModal();
        })
        .catch(error => {
            errorMessage.textContent = error.message;
            console.error("Signup error:", error);
        });
});

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
        description: "Strategy board game (WIP).",
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

// Career Timeline Data and Logic

const timelineData = {
    2011: {
        title: "Eagle Project",
        description: "Savannah restoration for West Des Moines Parks Department. Savannah Restoration is essential because it revives native grassland ecosystems that support biodiversity and provide critical environmental services. Restoring these areas improves soil health, enhances carbon sequestration, and mitigates erosion, which in turn benefits water quality and climate stability. For humans, healthy savannahs offer recreational spaces, bolster local economies, and promote community resilience through ecosystem services. With only 2% of its remaining natural ecosystem, Iowa stands out as one of the most transformed states—its vast prairies replaced by intensive agriculture and urban development. This dramatic change highlights the importance of restoration efforts that aim to reintroduce native species and ecological functions, ultimately benefiting both people and the environment.",
        //image: "https://via.placeholder.com/300",
        //links: [{ text: "Internship Details", url: "https://example.com" }]
    },
    2012: {
        title: "Started College",
        description: "Began Liberal Arts studies in Computer Science, 2-dimensional Studio Art, Urban Studies, Spanish, Economics and Business.",
        image: "https://www.wheaton.edu",
        links: [{ text: "Blanchard Hall", url: "wkeiideas.com/Portfolio/assets/BH.png" }]
    },
    2015: {
        title: "First Internship",
        description: "coming soon",
        image: "https://via.placeholder.com/300",
        links: [{ text: "Internship Details", url: "https://example.com" }]
    },
    2018: {
        title: "First Full-Time Job",
        description: "coming soon",
        image: "https://via.placeholder.com/300",
        links: [{ text: "Company Website", url: "https://example.com" }]
    },
    2021: {
        title: "Senior Developer",
        description: "coming soon",
        image: "https://via.placeholder.com/300",
        links: [{ text: "Promotion Announcement", url: "https://example.com" }]
    },
    2025: {
        title: "Current Position",
        description: "coming soon",
        image: "https://via.placeholder.com/300",
        links: [{ text: "Company Blog", url: "https://example.com" }]
    }
};

const aboutData = {
        integrity: {
        title: "Integrity",
        content: "With a background in accounting and finance, I’ve built my career on the principles of transparency and accuracy. Early in my career, I worked for Stephen Calk, a banker who was later convicted of fraud. That experience reinforced my commitment to ethical financial practices and the importance of integrity in both business and personal conduct. Whether in finance or technology, I believe that trust is earned through accountability and a commitment to doing what is right."
    },
    community: {
        title: "Community",
        content: "Earning an undergraduate certificate in Urban Studies ignited my passion for transit equity and community advocacy. I’ve had the privilege of volunteering at Alderwoman Nicole Lee's freestore to help newly arrived migrants integrate into our neighborhood."
    },
    data: {
        title: "Data",
        content: "With over a decade of experience in finance, accounting, and banking, I see financial institutions as more than just lenders—they are vast databases of fungible assets. My work has given me insight into how data shapes decision-making, from risk assessment to investment strategies. I’m fascinated by the intersection of technology and finance, constantly exploring ways to leverage data to build more transparent, efficient systems."
    }
};

const aboutTopics = document.getElementById("about-topics");
const aboutContent = document.getElementById("about-content");

function updateAbout(topic) {
    const data = aboutData[topic];
    if (data) {
        aboutContent.innerHTML = `<h2>${data.title}</h2><p>${data.content}</p>`;
    }
}

aboutTopics.addEventListener("click", (event) => {
    if (event.target.classList.contains("topic-btn")) {
        updateAbout(event.target.dataset.topic);
    }
});

const yearsDiv = document.getElementById("timeline-years");
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

    contentDiv.classList.add("show");
}

Object.keys(timelineData).forEach(year => {
    const yearPoint = document.createElement("div");
    yearPoint.className = "year-point";
    yearPoint.textContent = year;
    yearPoint.addEventListener("click", () => {
        updateTimeline(year);
    });
    yearsDiv.appendChild(yearPoint);
});

// Initialize with the first year
updateTimeline(Object.keys(timelineData)[0]);