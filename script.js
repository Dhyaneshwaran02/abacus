let numQuestions = 0;
let timeInterval = 0;
let questions = [];
let currentQuestionIndex = 0;
let currentSequenceIndex = 0;

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

// Step 3: Render input forms for each question
function renderQuestionInputForms() {
  const questionsInput = document.getElementById("questions-input");
  questionsInput.innerHTML = "";

  for (let i = 0; i < numQuestions; i++) {
    const questionLetter = String.fromCharCode(65 + i); // Convert index to A, B, C, ...
    questionsInput.innerHTML += `
      <div>
        <h4>Question ${questionLetter}</h4>
        <div id="sequences-${i}">
          <input type="text" id="operation-${i}-0" placeholder="Enter operation (e.g., *2, +5)">
        </div>
        <button onclick="addSequence(${i})">Add Sequence</button>
      </div>
    `;
  }
  questionsInput.innerHTML += `<button onclick="saveQuestions()">Save Questions</button>`;
}

// Step 4: Add sequences dynamically
function addSequence(questionIndex) {
  const sequencesDiv = document.getElementById(`sequences-${questionIndex}`);
  const newIndex = sequencesDiv.children.length;
  sequencesDiv.innerHTML += `
    <input type="text" id="operation-${questionIndex}-${newIndex}" placeholder="Enter operation (e.g., *2, +5)">
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
      if (!value.match(/^[+\-*/]\d+(\.\d+)?$/)) {
        alert(`Invalid input in Question ${String.fromCharCode(65 + i)}. Ensure each input is in the format: operator followed by an integer or decimal number (e.g., +5, -3, *2.5, /4.75).`);
        return;
      }
      sequences.push(value);
    }

    if (sequences.length === 0) {
      alert(`Please enter at least one sequence for Question ${String.fromCharCode(65 + i)}.`);
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

// Step 7: Display each question with its sequences and blank screen
function showQuestion(index) {
  if (index < 0 || index >= questions.length) return;
  currentQuestionIndex = index;

  const questionBox = document.getElementById("question-box");
  const answerBox = document.getElementById("answer-box");
  questionBox.innerHTML = "";
  answerBox.innerHTML = "";

  const questionLetter = String.fromCharCode(65 + index); // Convert index to A, B, C, ...
  const sequences = questions[index];
  currentSequenceIndex = 0;

  displaySequence(sequences, questionLetter);
}

function displaySequence(sequences, questionLetter) {
  const questionBox = document.getElementById("question-box");

  if (currentSequenceIndex < sequences.length) {
    // Keep the question letter displayed and show a blank for the sequence part
    questionBox.innerHTML = `
      <div>
        <span style="font-size: 10rem; font-weight: bold;">${questionLetter}</span><br>
        <span style="font-size: 12rem; font-weight: bold;">&nbsp;</span> <!-- Blank for the sequence -->
      </div>
    `;

    setTimeout(() => {
      // Display the current sequence
      questionBox.innerHTML = `
        <div>
          <span style="font-size: 10rem; font-weight: bold;">${questionLetter}</span><br>
          <span style="font-size: 15rem; font-weight: bold;">${sequences[currentSequenceIndex]}</span>
        </div>
      `;

      // Move to the next sequence after the time interval
      currentSequenceIndex++;
      setTimeout(() => {
        displaySequence(sequences, questionLetter);
      }, timeInterval * 1000); // Wait for the time interval before the next sequence
    }, timeInterval * 1000); // Blank interval
  } else {
    // End of the question sequences
    questionBox.innerHTML = `
      <div>
        <span style="font-size: 10rem; font-weight: bold;">${questionLetter}</span><br>
        <span style="font-size: 7rem; font-weight: bold;">END</span>
      </div>
    `;
  }
}


// Step 8: Show the calculated answer for the current question
function showAnswer() {
  const sequences = questions[currentQuestionIndex];
  try {
    let result = 0; // Initial value

    sequences.forEach((operation) => {
      const operator = operation[0];
      const value = parseFloat(operation.slice(1)); // Parse the numeric part

      switch (operator) {
        case "+":
          result += value;
          break;
        case "-":
          result -= value;
          break;
        case "*":
          result *= value;
          break;
        case "/":
          result /= value;
          break;
        default:
          throw new Error("Invalid operator.");
      }
    });

    // Determine if the result is an integer
    const formattedResult = Number.isInteger(result) ? result : result.toFixed(3);

    document.getElementById("answer-box").textContent = `Answer: ${formattedResult}`;
  } catch (error) {
    alert(`Error in calculating the answer: ${error.message}`);
  }
}

// Navigation functions
function repeatQuestion() {
  showQuestion(currentQuestionIndex);
}

function prevQuestion() {
  showQuestion(currentQuestionIndex - 1);
}

function nextQuestion() {
  showQuestion(currentQuestionIndex + 1);
}
