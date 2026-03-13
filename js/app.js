// ========================================
// LIFE DASHBOARD - Main JavaScript
// ========================================

// DOM Elements
const greetingMessage = document.querySelector('.greeting-message');
const userName = document.querySelector('.user-name');
const currentTime = document.querySelector('.current-time');
const currentDate = document.querySelector('.current-date');
const timerDisplay = document.querySelector('.timer-display');
const btnStart = document.querySelector('.btn-start');
const btnStop = document.querySelector('.btn-stop');
const btnReset = document.querySelector('.btn-reset');
const todoForm = document.querySelector('.todo-form');
const todoInput = document.querySelector('.todo-input');
const todoList = document.querySelector('.todo-list');
const linkForm = document.querySelector('.link-form');
const linkNameInput = document.querySelector('.link-name-input');
const linkUrlInput = document.querySelector('.link-url-input');
const linksContainer = document.querySelector('.links-container');
const btnThemeToggle = document.querySelector('.btn-theme-toggle');
const btnEditName = document.querySelector('.btn-edit-name');
const themeIcon = document.querySelector('.theme-icon');

// State Variables
let timerInterval = null;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isRunning = false;

// ========================================
// GREETING & DATE/TIME
// ========================================

function updateDateTime() {
    const now = new Date();
    
    // Update time
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    currentTime.textContent = `${hours}:${minutes}:${seconds}`;
    
    // Update date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDate.textContent = now.toLocaleDateString('en-US', options);
    
    // Update greeting based on time
    const hour = now.getHours();
    let greeting = 'Good Evening';
    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 18) greeting = 'Good Afternoon';
    greetingMessage.textContent = greeting;
}

// Update every second
setInterval(updateDateTime, 1000);
updateDateTime();

// ========================================
// USER NAME
// ========================================

function loadUserName() {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
        userName.textContent = savedName;
    }
}

function editUserName() {
    const newName = prompt('Enter your name:', userName.textContent);
    if (newName && newName.trim()) {
        userName.textContent = newName.trim();
        localStorage.setItem('userName', newName.trim());
    }
}

btnEditName.addEventListener('click', editUserName);
userName.addEventListener('click', editUserName);

loadUserName();

// ========================================
// FOCUS TIMER
// ========================================

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function startTimer() {
    if (isRunning) return;
    
    isRunning = true;
    btnStart.disabled = true;
    btnStart.classList.add('opacity-50', 'cursor-not-allowed');
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = formatTime(timeLeft);
        
        if (timeLeft <= 0) {
            stopTimer();
            alert('🎉 Focus session complete! Great job!');
            resetTimer();
        }
    }, 1000);
}

function stopTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    btnStart.disabled = false;
    btnStart.classList.remove('opacity-50', 'cursor-not-allowed');
}

function resetTimer() {
    stopTimer();
    timeLeft = 25 * 60;
    timerDisplay.textContent = formatTime(timeLeft);
}

btnStart.addEventListener('click', startTimer);
btnStop.addEventListener('click', stopTimer);
btnReset.addEventListener('click', resetTimer);

// ========================================
// TO-DO LIST
// ========================================

let todos = [];

function loadTodos() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
        renderTodos();
    }
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
    todoList.innerHTML = '';
    
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-all ${
            todo.done ? 'opacity-60' : ''
        }`;
        
        li.innerHTML = `
            <input 
                type="checkbox" 
                ${todo.done ? 'checked' : ''} 
                class="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                onchange="toggleTodo(${index})"
            >
            <span class="flex-1 text-gray-800 dark:text-white ${
                todo.done ? 'line-through' : ''
            }" ondblclick="editTodo(${index})">${todo.text}</span>
            <button 
                onclick="deleteTodo(${index})" 
                class="text-red-500 hover:text-red-700 font-bold text-xl transition-colors"
                aria-label="Delete task"
            >×</button>
        `;
        
        todoList.appendChild(li);
    });
}

function addTodo(text) {
    // Prevent duplicate tasks
    const duplicate = todos.find(todo => todo.text.toLowerCase() === text.toLowerCase());
    if (duplicate) {
        alert('⚠️ This task already exists!');
        return;
    }
    
    todos.push({ text, done: false });
    saveTodos();
    renderTodos();
}

function toggleTodo(index) {
    todos[index].done = !todos[index].done;
    saveTodos();
    renderTodos();
}

function editTodo(index) {
    const newText = prompt('Edit task:', todos[index].text);
    if (newText && newText.trim()) {
        todos[index].text = newText.trim();
        saveTodos();
        renderTodos();
    }
}

function deleteTodo(index) {
    if (confirm('Delete this task?')) {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
    }
}

// Make functions global for inline event handlers
window.toggleTodo = toggleTodo;
window.editTodo = editTodo;
window.deleteTodo = deleteTodo;

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
        addTodo(text);
        todoInput.value = '';
    }
});

loadTodos();

// ========================================
// QUICK LINKS
// ========================================

let links = [];

function loadLinks() {
    const savedLinks = localStorage.getItem('quickLinks');
    if (savedLinks) {
        links = JSON.parse(savedLinks);
        renderLinks();
    }
}

function saveLinks() {
    localStorage.setItem('quickLinks', JSON.stringify(links));
}

function renderLinks() {
    linksContainer.innerHTML = '';
    
    links.forEach((link, index) => {
        const linkCard = document.createElement('div');
        linkCard.className = 'relative group';
        
        linkCard.innerHTML = `
            <a 
                href="${link.url}" 
                target="_blank" 
                rel="noopener noreferrer"
                class="block p-4 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 text-center font-medium"
            >
                ${link.name}
            </a>
            <button 
                onclick="deleteLink(${index})" 
                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                aria-label="Delete link"
            >×</button>
        `;
        
        linksContainer.appendChild(linkCard);
    });
}

function addLink(name, url) {
    // Validate URL
    try {
        new URL(url);
    } catch {
        alert('⚠️ Please enter a valid URL');
        return;
    }
    
    links.push({ name, url });
    saveLinks();
    renderLinks();
}

function deleteLink(index) {
    if (confirm('Delete this link?')) {
        links.splice(index, 1);
        saveLinks();
        renderLinks();
    }
}

window.deleteLink = deleteLink;

linkForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = linkNameInput.value.trim();
    const url = linkUrlInput.value.trim();
    
    if (name && url) {
        addLink(name, url);
        linkNameInput.value = '';
        linkUrlInput.value = '';
    }
});

loadLinks();

// ========================================
// DARK MODE
// ========================================

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        themeIcon.textContent = '☀️';
    } else {
        document.documentElement.classList.remove('dark');
        themeIcon.textContent = '🌙';
    }
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeIcon.textContent = isDark ? '☀️' : '🌙';
}

btnThemeToggle.addEventListener('click', toggleTheme);

loadTheme();

// ========================================
// INITIALIZATION
// ========================================

console.log('✨ Life Dashboard loaded successfully!');

// ========================================
// DAILY QUOTES
// ========================================
const dailyQuoteContainer = document.querySelector('.daily-quote');

const quotes = [
    "Cara terbaik untuk memulai adalah berhenti berbicara dan mulai melakukan. - Walt Disney",
    "Masa depan bergantung pada apa yang kamu lakukan hari ini. - Mahatma Gandhi",
    "Jangan melihat jam; lakukan apa yang dilakukannya. Teruslah berjalan. - Sam Levenson",
    "Sukses bukanlah akhir, kegagalan bukanlah hal yang fatal: keberanian untuk melanjutkanlah yang penting. - Winston Churchill",
    "Satu-satunya cara untuk melakukan pekerjaan hebat adalah dengan mencintai apa yang kamu lakukan. - Steve Jobs",
    "Hal-hal besar tidak pernah datang dari zona nyaman."
];

function displayRandomQuote() {
    if(dailyQuoteContainer) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        dailyQuoteContainer.textContent = `"${randomQuote}"`;
    }
}

displayRandomQuote();

// ========================================
// QUICK NOTES (AUTO-SAVE)
// ========================================
const notesInput = document.querySelector('.notes-input');

function initQuickNotes() {
    if(notesInput) {
        
        const savedNotes = localStorage.getItem('quickNotes');
        if (savedNotes) {
            notesInput.value = savedNotes;
        }

       
        notesInput.addEventListener('input', (e) => {
            localStorage.setItem('quickNotes', e.target.value);
        });
    }
}

initQuickNotes();

// ========================================
// BACKGROUND CUSTOMIZATION
// ========================================
const btnChangeBg = document.querySelector('.btn-change-bg');


const bgThemes = [
    { id: 'default', classes: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900' },
    { id: 'nature', classes: 'bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50 dark:from-gray-900 dark:via-teal-900 dark:to-gray-900' },
    { id: 'warm', classes: 'bg-gradient-to-br from-orange-50 via-red-50 to-rose-50 dark:from-gray-900 dark:via-red-900 dark:to-gray-900' },
    { id: 'image', classes: 'bg-cover bg-center bg-fixed dark:bg-gray-900', useImage: true }
];

function applyBackground(index) {
    const body = document.body;
    
   
    bgThemes.forEach(theme => {
        const classArray = theme.classes.split(' ');
        body.classList.remove(...classArray);
    });
    body.style.backgroundImage = ''; // Reset gambar
    
    
    const newTheme = bgThemes[index];
    const newClassArray = newTheme.classes.split(' ');
    body.classList.add(...newClassArray);
    
    
    if (newTheme.useImage) {
        body.style.backgroundImage = 'linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url("https://picsum.photos/1920/1080?blur=1")';
        
        if (document.documentElement.classList.contains('dark')) {
            body.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://picsum.photos/1920/1080?blur=1")';
        }
    }
    
    body.classList.add('min-h-screen', 'transition-colors', 'duration-300');
    
    localStorage.setItem('bgThemeIndex', index);
}

function toggleBackground() {
    let currentIndex = parseInt(localStorage.getItem('bgThemeIndex') || 0);
    let nextIndex = (currentIndex + 1) % bgThemes.length; // Berputar (0 -> 1 -> 2 -> 3 -> 0)
    applyBackground(nextIndex);
}

let savedBgIndex = parseInt(localStorage.getItem('bgThemeIndex') || 0);
applyBackground(savedBgIndex);

btnChangeBg.addEventListener('click', toggleBackground);
