// ===============================
// QUIZ FUNCTIONALITY
// ===============================

// Correct Answers
const correctAnswers = {
  q1: "Chandragupta Maurya",
  q2: "1947",
  q3: "Bihar",
  q4: "Bahadur Shah Zafar",
  q5: "Civil Disobedience Movement",
};

// Submit Quiz
function submitQuiz() {
  const form = document.getElementById("quizForm");
  const formData = new FormData(form);
  let score = 0;
  let reviewHTML = "";

  // Loop through each question
  Object.keys(correctAnswers).forEach((question, index) => {
    const userAnswer = formData.get(question);
    const correct = correctAnswers[question];
    const questionNum = index + 1;

    if (userAnswer === correct) {
      score++;
    }

    reviewHTML += `
      <div class="review-question">
        <h4>Question ${questionNum}</h4>
        <p><strong>Your Answer:</strong> ${userAnswer ? userAnswer : "Not Answered"}</p>
        <p><strong>Correct Answer:</strong> ${correct}</p>
        <hr>
      </div>
    `;
  });

  // Display Score
  const scoreElement = document.getElementById("score");
  scoreElement.innerHTML = `You scored <strong>${score}/5</strong> 🎉`;

  // Display Review
  const reviewContainer = document.getElementById("reviewAnswers");
  reviewContainer.innerHTML = reviewHTML;
}

// ===============================
// EXPLORE RESOURCES POPUP
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const exploreBtn = document.getElementById("exploreBtn");

  if (exploreBtn) {
    exploreBtn.addEventListener("click", function () {
      const resources = [
        "India never invaded any country in her last 100000 years of history.",
        "When many cultures were nomadic 5000 years ago, Indians built the Indus Valley Civilization.",
        "The name 'India' is derived from the River Indus.",
        "The Persian invaders converted 'Sindhu' into 'Hindu'.",
        "Chess was invented in India.",
        "Algebra, Trigonometry and Calculus originated in India.",
        "The decimal system was developed in India in 100 B.C.",
        "The Brihadeswara Temple is made entirely of granite (built in 1009 AD).",
        "India is the world's largest democracy.",
        "Snakes & Ladders was invented by the poet Gyandev in the 13th century.",
        "The world’s highest cricket ground is in Himachal Pradesh.",
        "India has the largest number of post offices in the world.",
        "The Indian Railways is one of the world's largest employers.",
        "Takshila University (700 BC) was the world’s first university.",
        "Ayurveda was consolidated by Charaka over 2500 years ago.",
        "Navigation originated in the Sindh River 6000 years ago.",
        "The concept of 'pi' was known to Indian mathematicians long before Pythagoras.",
        "Until 1896, India was the only source of diamonds in the world.",
        "Sushruta, the Father of Surgery, described 300 types of operations 2600 years ago.",
        "Yoga originated in India over 5000 years ago."
      ];

      // Create popup container
      const popup = document.createElement("div");
      popup.style.position = "fixed";
      popup.style.top = "50%";
      popup.style.left = "50%";
      popup.style.transform = "translate(-50%, -50%)";
      popup.style.width = "80%";
      popup.style.maxHeight = "80vh";
      popup.style.overflowY = "auto";
      popup.style.background = "rgba(0, 0, 0, 0.95)";
      popup.style.color = "#fff";
      popup.style.padding = "30px";
      popup.style.borderRadius = "15px";
      popup.style.boxShadow = "0 0 25px rgba(255,255,255,0.2)";
      popup.style.fontSize = "1.1rem";
      popup.style.lineHeight = "1.6";
      popup.style.zIndex = "2000";
      popup.style.animation = "fadeIn 0.3s ease-in-out";

      // Heading
      const heading = document.createElement("h2");
      heading.innerText = "Amazing Facts About India 🇮🇳";
      heading.style.color = "#ffcc70";
      heading.style.textAlign = "center";
      heading.style.marginBottom = "20px";
      popup.appendChild(heading);

      // Facts list
      const list = document.createElement("ul");
      list.style.marginTop = "15px";
      list.style.paddingLeft = "20px";
      resources.forEach((fact) => {
        const li = document.createElement("li");
        li.innerText = fact;
        li.style.marginBottom = "10px";
        list.appendChild(li);
      });
      popup.appendChild(list);

      // Close button
      const closeBtn = document.createElement("button");
      closeBtn.innerText = "Close";
      closeBtn.style.display = "block";
      closeBtn.style.margin = "25px auto 0";
      closeBtn.style.padding = "14px 30px";
      closeBtn.style.background = "#ffcc70";
      closeBtn.style.border = "none";
      closeBtn.style.borderRadius = "8px";
      closeBtn.style.cursor = "pointer";
      closeBtn.style.fontSize = "1.1rem";
      closeBtn.style.transition = "0.3s";
      closeBtn.onmouseover = () => (closeBtn.style.background = "#ffb347");
      closeBtn.onmouseout = () => (closeBtn.style.background = "#ffcc70");
      closeBtn.onclick = () => popup.remove();
      popup.appendChild(closeBtn);

      // Append popup to body
      document.body.appendChild(popup);
    });
  }
});

// ===============================
// SMALL FADE-IN ANIMATION
// ===============================
const style = document.createElement("style");
style.textContent = `
@keyframes fadeIn {
  from { opacity: 0; transform: translate(-50%, -48%); }
  to { opacity: 1; transform: translate(-50%, -50%); }
}
`;
document.head.appendChild(style);



/**************************************
 * QUIZQUEST: BACKEND (NODE + EXPRESS)
 **************************************/

// This part is for server-side (Node.js). 
// ⚠️ You CANNOT run this in CodePen or the browser — it must go in Node environment.

if (typeof require !== "undefined") {
  const express = require("express");
  const bodyParser = require("body-parser");
  const cors = require("cors");
  const fs = require("fs");

  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(bodyParser.json());
  app.use(express.static(__dirname));

  const correctAnswers = {
    q1: "Chandragupta Maurya",
    q2: "1947",
    q3: "Bihar",
    q4: "Bahadur Shah Zafar",
    q5: "Civil Disobedience Movement"
  };

  app.post("/submitQuiz", (req, res) => {
    const userAnswers = req.body;
    let score = 0;

    for (let key in correctAnswers) {
      if (userAnswers[key] === correctAnswers[key]) score++;
    }

    const result = {
      timestamp: new Date().toLocaleString(),
      answers: userAnswers,
      score
    };

    const filePath = "./results.json";
    let existingResults = [];

    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath);
      existingResults = JSON.parse(data);
    }

    existingResults.push(result);
    fs.writeFileSync(filePath, JSON.stringify(existingResults, null, 2));

    res.json({
      message: "Quiz submitted successfully!",
      score,
      correctAnswers
    });
  });

  app.listen(3000, () => {
    console.log(`✅ QuizQuest backend running on http://localhost:3000}`);
  });
}