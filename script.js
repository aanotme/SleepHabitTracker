// DOM Elements
const sleepForm = document.getElementById('sleepForm');
const sleepLogs = document.getElementById('sleepLogs');
const streakCount = document.getElementById('streakCount');
const themeToggle = document.getElementById('themeToggle');
const motivationModal = document.getElementById('motivationModal');
const reminderModal = document.getElementById('reminderModal');
const motivationMessage = document.getElementById('motivationMessage');
const closeButtons = document.querySelectorAll('.close');
const starRating = document.querySelectorAll('.star-rating i');

// Motivational messages
const motivationalMessages = [
    "Great job! Consistent sleep patterns lead to better health!",
    "Sleep fuels memory — you're doing amazing!",
    "Your future self thanks you for this healthy habit!",
    "Quality sleep = Quality life. Keep it up!",
    "You're building a strong bedtime routine!",
    "Every good night's sleep is a step toward better health!",
    "Sleep is the best meditation. You're doing great!",
    "Your body and mind thank you for this rest!",
    "Consistency is key! You're on the right track!",
    "Sleep is the golden chain that ties health together!"
];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadSleepLogs();
    checkReminder();
    initializeStarRating();
});

// Theme toggle
themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Star rating functionality
function initializeStarRating() {
    starRating.forEach(star => {
        star.addEventListener('click', () => {
            const rating = star.getAttribute('data-rating');
            starRating.forEach(s => {
                s.className = parseInt(s.getAttribute('data-rating')) <= rating ? 'fas fa-star' : 'far fa-star';
            });
        });
    });
}

// Calculate sleep duration
function calculateSleepDuration(bedtime, wakeup) {
    const bed = new Date(`2000-01-01T${bedtime}`);
    let wake = new Date(`2000-01-01T${wakeup}`);
    
    if (wake < bed) {
        wake.setDate(wake.getDate() + 1);
    }
    
    const duration = (wake - bed) / (1000 * 60 * 60);
    return duration.toFixed(1);
}

// Get current star rating
function getCurrentRating() {
    return document.querySelectorAll('.star-rating .fas').length;
}

// Save sleep log
function saveSleepLog(log) {
    const logs = JSON.parse(localStorage.getItem('sleepLogs') || '[]');
    logs.unshift(log);
    localStorage.setItem('sleepLogs', JSON.stringify(logs));
}

// Load sleep logs
function loadSleepLogs() {
    const logs = JSON.parse(localStorage.getItem('sleepLogs') || '[]');
    sleepLogs.innerHTML = '';
    
    logs.forEach(log => {
        const logEntry = document.createElement('div');
        logEntry.className = 'sleep-log-entry';
        logEntry.innerHTML = `
            <p><strong>Date:</strong> ${new Date(log.date).toLocaleDateString()}</p>
            <p><strong>Duration:</strong> ${log.duration} hours</p>
            <p><strong>Quality:</strong> ${'★'.repeat(log.quality)}${'☆'.repeat(5-log.quality)}</p>
            ${log.notes ? `<p><strong>Notes:</strong> ${log.notes}</p>` : ''}
        `;
        sleepLogs.appendChild(logEntry);
    });
    
    updateStreak(logs);
}

// Update streak count
function updateStreak(logs) {
    let streak = 0;
    const today = new Date().toDateString();
    const lastLog = logs[0];
    
    if (lastLog && new Date(lastLog.date).toDateString() === today) {
        streak = 1;
        for (let i = 1; i < logs.length; i++) {
            const currentDate = new Date(logs[i].date);
            const previousDate = new Date(logs[i-1].date);
            const diffDays = Math.floor((previousDate - currentDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                streak++;
            } else {
                break;
            }
        }
    }
    
    streakCount.textContent = `${streak} days`;
}

// Show motivational message
function showMotivationMessage() {
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    motivationMessage.textContent = randomMessage;
    motivationModal.style.display = 'block';
}

// Check reminder
function checkReminder() {
    const logs = JSON.parse(localStorage.getItem('sleepLogs') || '[]');
    if (logs.length > 0) {
        const lastLog = new Date(logs[0].date);
        const today = new Date();
        const diffDays = Math.floor((today - lastLog) / (1000 * 60 * 60 * 24));
        
        if (diffDays >= 3) {
            reminderModal.style.display = 'block';
        }
    }
}

// Close modals
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        motivationModal.style.display = 'none';
        reminderModal.style.display = 'none';
    });
});

// Form submission
sleepForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const bedtime = document.getElementById('bedtime').value;
    const wakeup = document.getElementById('wakeup').value;
    const quality = getCurrentRating();
    const notes = document.getElementById('notes').value;
    
    if (!bedtime || !wakeup || quality === 0) {
        alert('Please fill in all required fields and rate your sleep quality.');
        return;
    }
    
    const duration = calculateSleepDuration(bedtime, wakeup);
    
    const log = {
        date: new Date().toISOString(),
        bedtime,
        wakeup,
        duration,
        quality,
        notes
    };
    
    saveSleepLog(log);
    loadSleepLogs();
    showMotivationMessage();
    
    // Reset form
    sleepForm.reset();
    starRating.forEach(star => star.className = 'far fa-star');
}); 