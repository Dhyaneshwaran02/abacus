let numQuestions = 0;
let timeInterval = 0;
let questions = [];
let currentQuestionIndex = 0;
let intervalId;

// Step 1: Set the number of questions
function setNumQuestions() {
  const numInput = document.getElementById("num-questions").value.trim();
  numQuestions = parseInt(numInput, 10);

  if (isNaN(numQuestions) || numQuestions <= 0) {
    alert("Please enter a valid number of questions.");
    return;
  }

  document.getElementById("question-setup").style.display = "block";
}

// Step 2: Set the time interval between questions
function setTimeInterval() {
  const timeInput = document.getElementById("time-interval").value.trim();
  timeInterval = parseInt(timeInput, 10);

  if (isNaN(timeInterval) || timeInterval <= 0) {
    alert("Please enter a valid time interval.");
    return;
  }

  renderQuestionInputForms();
}

// Step 3: Render input forms for each question (allowing sequences with operations)
function renderQuestionInputForms() {
  const questionsInput = document.getElementById("questions-input");
  questionsInput.innerHTML = "";

  for (let i = 0; i < numQuestions; i++) {
    questionsInput.innerHTML += `
      <div>
        <h4>Question ${i + 1}</h4>
        <div id="sequences-${i}">
          <input type="text" id="operation-${i}-0" placeholder="Enter number with operation (e.g., +5)">
        </div>
        <button onclick="addSequence(${i})">Add Sequence</button>
      </div>
    `;
  }
  questionsInput.innerHTML += `<button onclick="saveQuestions()">Save Questions</button>`;
}

// Step 4: Add sequences (numbers with operations) dynamically for a specific question
function addSequence(questionIndex) {
  const sequencesDiv = document.getElementById(`sequences-${questionIndex}`);
  const newIndex = sequencesDiv.children.length;
  sequencesDiv.innerHTML += `
    <input type="text" id="operation-${questionIndex}-${newIndex}" placeholder="Enter number with operation (e.g., +5)">
  `;
}

// Step 5: Save all questions and their sequences
function saveQuestions() {
  questions = [];

  for (let i = 0; i < numQuestions; i++) {
    const sequencesDiv = document.getElementById(`sequences-${i}`);
    const sequenceInputs = sequencesDiv.querySelectorAll("input");
    const sequences = [];

    for (const input of sequenceInputs) {
      const value = input.value.trim();
      if (!value.match(/^[+-]?\d+$/)) {
        alert(`Invalid input in Question ${i + 1}. Make sure all inputs are numbers with operations (e.g., +5, -3).`);
        return;
      }
      sequences.push(parseInt(value, 10));
    }

    if (sequences.length === 0) {
      alert(`Please enter at least one sequence for Question ${i + 1}.`);
      return;
    }

    questions.push(sequences);
  }

  document.getElementById("start-btn").style.display = "block";
}

// Step 6: Start the assignment
function startAssignment() {
  document.getElementById("setup").style.display = "none";
  document.getElementById("assignment").style.display = "block";
  showQuestion(0);
}

// Step 7: Display each question with its sequences
function showQuestion(index) {
  if (index < 0 || index >= questions.length) return;
  currentQuestionIndex = index;

  const questionBox = document.getElementById("question-box");
  const answerBox = document.getElementById("answer-box");
  questionBox.innerHTML = "";
  answerBox.innerHTML = "";

  const sequences = questions[index];
  let sequenceIndex = 0;

  clearInterval(intervalId);
  intervalId = setInterval(() => {
    if (sequenceIndex < sequences.length) {
      questionBox.innerHTML = `
        <div>
          <span style="font-size: 5rem; font-weight: bold;">Question ${index + 1}</span><br>
          <span style="font-size: 10rem; font-weight: bold;">${sequences[sequenceIndex]}</span>
        </div>
      `;
      sequenceIndex++;
    } else {
      clearInterval(intervalId);
      questionBox.innerHTML = `<span style="font-size: 5rem; font-weight: bold;">Question ${index + 1} - END</span>`;
    }
  }, timeInterval * 1000);
}

// Step 8: Show the calculated answer for the current question
function showAnswer() {
  const sequences = questions[currentQuestionIndex];
  const answer = sequences.reduce((sum, num) => sum + num, 0);
  document.getElementById("answer-box").textContent = `Answer: ${answer}`;
}

// Step 9: Navigate to the previous question
function prevQuestion() {
  if (currentQuestionIndex > 0) {
    showQuestion(currentQuestionIndex - 1);
  }
}

// Step 10: Navigate to the next question
function nextQuestion() {
  if (currentQuestionIndex < questions.length - 1) {
    showQuestion(currentQuestionIndex + 1);
  }
}

// Step 11: Repeat the current question
function repeatQuestion() {
    showQuestion(currentQuestionIndex);
  }
  
