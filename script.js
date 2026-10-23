// DOM Elements
const textDisplay = document.getElementById('text-display');
const textInput = document.getElementById('text-input');
const timeElement = document.getElementById('time');
const wpmElement = document.getElementById('wpm');
const restartBtn = document.getElementById('restart-btn');
const changeTextBtn = document.getElementById('change-text-btn');

// Modal Elements
const modal = document.getElementById('result-modal');
const finalWpm = document.getElementById('final-wpm');
const finalAccuracy = document.getElementById('final-accuracy');
const closeModalBtn = document.getElementById('close-modal-btn');

// Application State
let timeLeft = 60;
let timeElapsed = 0;
let timer = null;
let isTyping = false;
let currentText = "";

// Full library of 20 paragraphs
const textLibrary = [
    "Web development involves building and maintaining websites. It requires a combination of front-end skills like HTML, CSS, and JavaScript, along with back-end technologies to manage data and server operations seamlessly.",
    "Data structures and algorithms are the foundation of computer science. Understanding how to organize data efficiently and write optimal logic is what separates a good programmer from an exceptional software engineer.",
    "The quick brown fox jumps over the lazy dog. This famous sentence contains every single letter of the English alphabet. Practicing with diverse sentences helps improve your overall typing speed and keyboard memory.",
    "Debugging is like being the detective in a crime movie where you are also the murderer. It can be frustrating, but solving the puzzle and finding that one missing semicolon is an incredibly rewarding feeling.",
    "Artificial intelligence and machine learning are rapidly transforming the tech industry. As a software developer, staying curious and constantly adapting to these new technologies is essential for building a long-lasting career.",
    "A journey of a thousand miles begins with a single step. When building large software projects, breaking the application down into small, manageable components is the best way to ensure success and avoid being overwhelmed.",
    "Version control systems like Git allow multiple developers to collaborate on the same codebase without overwriting each other's work. Committing frequently and writing clear commit messages are habits of highly effective teams.",
    "Cybersecurity is more important today than ever before. Protecting user data through encryption, secure authentication methods, and regular vulnerability audits is a core responsibility for modern application developers.",
    "Cloud computing has revolutionized how applications are hosted and deployed. Instead of maintaining physical servers, developers can leverage scalable infrastructure from providers to handle millions of users dynamically.",
    "User Interface and User Experience design are critical to software success. An application can have flawless backend logic, but if the interface is confusing or unresponsive, users will quickly abandon it for a competitor.",
    "Relational databases use structured query language to manage data in tables, while NoSQL databases handle unstructured data flexibly. Choosing the right database architecture depends entirely on the specific needs of your project.",
    "JavaScript is the undisputed language of the web. Originally created in just ten days, it has evolved into a powerful, versatile tool capable of running complex algorithms in the browser and managing servers via Node.js.",
    "Agile software development emphasizes iterative progress, team collaboration, and constant feedback. Instead of waiting months to release a finished product, Agile teams deliver small, functional updates on a regular schedule.",
    "Application Programming Interfaces, or APIs, are the bridges that allow different software systems to talk to each other. Fetching data from a third-party API is a fundamental skill for any intermediate frontend developer.",
    "Computer networks operate on a standardized set of protocols. The TCP/IP model breaks network communication down into distinct layers, ensuring that data packets reach their intended destination accurately and securely.",
    "Writing clean code means writing code that is easy for humans to read, not just for machines to execute. Using descriptive variable names and keeping functions focused on a single task will save you hours of future debugging.",
    "The Document Object Model is a programming interface for web documents. It represents the page so that programs can change the document structure, style, and content dynamically using client-side scripting languages.",
    "To type really fast, you must learn to look at the screen rather than your hands. Touch typing relies on muscle memory, allowing your fingers to find the right keys automatically while your eyes process the upcoming words.",
    "Memory management in languages like C and C++ requires manual allocation and deallocation. Modern languages like Java and Python use a garbage collector to automatically free up memory that is no longer being utilized.",
    "A great portfolio project demonstrates not just coding ability, but problem-solving skills and architectural thinking. Recruiters look for projects that handle complex state, manage asynchronous data, and provide a polished user experience."
];

function getRandomText() {
    const randomIndex = Math.floor(Math.random() * textLibrary.length);
    return textLibrary[randomIndex];
}

// 1. Loads a completely new paragraph
function initTest() {
    currentText = getRandomText();
    setupBoard();
}

// 2. Restarts the current paragraph without changing the text
function resetCurrentTest() {
    setupBoard();
}

// Helper to set up the board for both start and restart
function setupBoard() {
    textDisplay.innerHTML = '';
    textInput.value = '';
    modal.classList.add('hidden'); 
    
    currentText.split('').forEach(char => {
        const span = document.createElement('span');
        span.innerText = char;
        textDisplay.appendChild(span);
    });
    
    timeLeft = 60;
    timeElapsed = 0;
    timeElement.innerText = timeLeft;
    wpmElement.innerText = 0;
    
    if(timer) clearInterval(timer);
    
    isTyping = false;
    textInput.disabled = false; 
    changeTextBtn.disabled = false; // Re-enable the change button
    textInput.focus();
}

// Show the final results pop-up
function showResults() {
    clearInterval(timer);
    textInput.disabled = true;
    changeTextBtn.disabled = false; 
    
    const arrayText = textDisplay.querySelectorAll('span');
    let correctCharacters = 0;
    
    arrayText.forEach(span => {
        if (span.classList.contains('correct')) {
            correctCharacters++;
        }
    });

    // NEW LOGIC: Calculate accuracy based ONLY on what the user actually typed
    let totalTyped = textInput.value.length;
    let accuracy = 0;
    
    if (totalTyped > 0) {
        accuracy = Math.round((correctCharacters / totalTyped) * 100);
    }
    
    // Prevent accuracy from going over 100% just in case of weird backspace glitches
    if (accuracy > 100) accuracy = 100;

    finalWpm.innerText = wpmElement.innerText;
    finalAccuracy.innerText = accuracy;
    modal.classList.remove('hidden');
}

// Handle typing logic and button states
textInput.addEventListener('input', () => {
    // Start timer on the very first keystroke
    if (!isTyping) {
        timer = setInterval(updateTimer, 1000);
        isTyping = true;
        changeTextBtn.disabled = true; // DISABLE the change button while typing
    }

    const arrayText = textDisplay.querySelectorAll('span');
    const arrayValue = textInput.value.split('');
    let correctCharacters = 0;

    arrayText.forEach((characterSpan, index) => {
        const typedChar = arrayValue[index];
        if (typedChar == null) {
            characterSpan.classList.remove('correct', 'incorrect');
        } else if (typedChar === characterSpan.innerText) {
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
            correctCharacters++;
        } else {
            characterSpan.classList.add('incorrect');
            characterSpan.classList.remove('correct');
        }
    });

    if (timeElapsed > 0) {
        let wpm = Math.round(((correctCharacters / 5) / timeElapsed) * 60);
        wpmElement.innerText = wpm;
    }

    if (arrayValue.length === arrayText.length) {
        showResults();
    }
});

// Timer logic
function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeElapsed++;
        timeElement.innerText = timeLeft;
    } else {
        showResults(); 
    }
}

// Button Listeners
restartBtn.addEventListener('click', resetCurrentTest);
changeTextBtn.addEventListener('click', initTest);

// Modal button loads new text
closeModalBtn.addEventListener('click', initTest);

// Keep focus on input if user clicks the background
document.querySelector('.container').addEventListener('click', () => {
    if (!textInput.disabled) {
        textInput.focus();
    }
});

// Start the app ONLY after the HTML is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initTest();
});