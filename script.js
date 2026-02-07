/*
===========================================
VALENTINE'S DAY WEBSITE - JAVASCRIPT
===========================================
This file contains all the interactive functionality
including navigation, music control, game mechanics,
and animations.
===========================================
*/

// ============= GLOBAL VARIABLES =============
let currentSection = 'landing';
let musicPlaying = false;
let noClickCount = 0;
let gameScore = 0;
let gameTimer = 30;
let gameInterval = null;
let gameActive = false;
let audioUnlocked = false;

function unlockAndPlayMusic() {
    if (audioUnlocked) return;

    const bgMusic = document.getElementById('bgMusic');
    const musicIcon = document.getElementById('musicIcon');
    const musicText = document.getElementById('musicText');

    bgMusic.volume = 0.6;

    bgMusic.play().then(() => {
        musicPlaying = true;
        audioUnlocked = true;
        musicIcon.textContent = '🔊';
        musicText.textContent = 'Pause Music';
    }).catch(() => {
        // still blocked — browser policy
    });
}
document.addEventListener('click', unlockAndPlayMusic, { once: true });
document.addEventListener('touchstart', unlockAndPlayMusic, { once: true });

// No button funny messages
const noMessages = [
    "Are you sure? 🥺",
    "Really? Think again!",
    "The button is running away!",
    "Come on, you know you want to say yes!",
    "I'll take that as a maybe!",
    "You're breaking my heart! 💔🥀",
    "Last chance to reconsider! ⏰",
    "Pretty please? 🙏😭",
    "What if I said... please?",
    "The yes button is looking pretty good right now! 👀"
];

// ============= INITIALIZATION =============
document.addEventListener('DOMContentLoaded', function() {
    initFloatingHearts();
    initMusicControl();
    autoplayMusic();
});

// ============= AUTOPLAY MUSIC =============
function autoplayMusic() {
    const bgMusic = document.getElementById('bgMusic');
    const musicIcon = document.getElementById('musicIcon');
    const musicText = document.getElementById('musicText');

    bgMusic.volume = 0.6; // romantic volume

    const tryPlay = () => {
        bgMusic.play().then(() => {
            musicPlaying = true;
            musicIcon.textContent = '🔊';
            musicText.textContent = 'Pause Music';
        }).catch(() => {
            // Autoplay blocked — wait for user interaction
            document.addEventListener('click', unlockAudio, { once: true });
            document.addEventListener('touchstart', unlockAudio, { once: true });
        });
    };

    const unlockAudio = () => {
        bgMusic.play().then(() => {
            musicPlaying = true;
            musicIcon.textContent = '🔊';
            musicText.textContent = 'Pause Music';
        });
    };

    tryPlay();
}


// ============= FLOATING HEARTS BACKGROUND =============
function initFloatingHearts() {
    const heartsContainer = document.getElementById('floatingHearts');
    const heartEmojis = ['💕', '💖', '💗', '💝', '💘', '💞', '❤️', '🌹'];
    
    // Create initial hearts
    for (let i = 0; i < 15; i++) {
        createFloatingHeart();
    }
    
    // Create new hearts periodically
    setInterval(createFloatingHeart, 3000);
    
    function createFloatingHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 5 + 5) + 's';
        heart.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
        heartsContainer.appendChild(heart);
        
        // Remove heart after animation
        setTimeout(() => {
            heart.remove();
        }, 10000);
    }
}

// ============= MUSIC CONTROL =============
function initMusicControl() {
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    const musicIcon = document.getElementById('musicIcon');
    const musicText = document.getElementById('musicText');
    
    musicToggle.addEventListener('click', function() {
        if (musicPlaying) {
            bgMusic.pause();
            musicIcon.textContent = '🔇';
            musicText.textContent = 'Play Music';
            musicPlaying = false;
        } else {
            bgMusic.play();
            musicIcon.textContent = '🔊';
            musicText.textContent = 'Pause Music';
            musicPlaying = true;
        }
    });
}

// ============= SECTION NAVIGATION =============
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
        
        // Reset "No" button if returning to question section
        if (sectionId === 'question') {
            resetNoButton();
        }
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
}

// ============= RESET "NO" BUTTON =============
function resetNoButton() {
    const noBtn = document.getElementById('noBtn');
    const noMessage = document.getElementById('noMessage');
    
    // Reset button state
    noClickCount = 0;
    noBtn.style.transform = 'translate(0, 0)';
    noBtn.style.opacity = '1';
    noBtn.style.display = 'inline-block';
    noMessage.textContent = '';
}

// ============= "NO" BUTTON AVOIDANCE =============
function avoidNo() {
    const noBtn = document.getElementById('noBtn');
    const noMessage = document.getElementById('noMessage');
    const container = noBtn.parentElement;
    
    noClickCount++;
    
    // Show funny message
    const messageIndex = Math.min(noClickCount - 1, noMessages.length - 1);
    noMessage.textContent = noMessages[messageIndex];
    
    // Random position within container
    const containerRect = container.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    
    const maxX = containerRect.width - btnRect.width - 20;
    const maxY = 100;
    
    const randomX = Math.random() * maxX - maxX / 2;
    const randomY = Math.random() * maxY - maxY / 2;
    
    noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
    
    // Shrink button progressively
    const scale = Math.max(0.5, 1 - (noClickCount * 0.1));
    noBtn.style.transform += ` scale(${scale})`;
    
    // After 5 attempts, make it fade out
    if (noClickCount >= 5) {
        noBtn.style.opacity = Math.max(0.2, 1 - ((noClickCount - 5) * 0.15));
    }
    
    // After 8 attempts, hide it completely and show special message
    if (noClickCount >= 8) {
        noBtn.style.display = 'none';
        noMessage.textContent = "Fine! The 'No' button has given up! Now there's only one choice left... 👀👀👀";
    }
}

// ============= "YES" BUTTON HANDLER =============
function handleYes() {
    // Play sound effect
    const yesSound = document.getElementById('yesSound');
    yesSound.play().catch(error => {
        console.log('Sound effect could not play:', error);
    });
    
    // Show celebration section
    showSection('celebration');
    
    // Create confetti
    createConfetti();
    
    // Create floating hearts
    createCelebrationHearts();
    
    // Auto-play music if not playing
    if (!musicPlaying) {
        const bgMusic = document.getElementById('bgMusic');
        bgMusic.play();
        document.getElementById('musicIcon').textContent = '🔊';
        document.getElementById('musicText').textContent = 'Pause Music';
        musicPlaying = true;
    }
}

// ============= CELEBRATION EFFECTS =============
function createConfetti() {
    const confettiContainer = document.getElementById('confetti');
    const colors = ['#ff4081', '#f50057', '#ff80ab', '#ffc1e3', '#c51162'];
    
    // Create 100 confetti pieces
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 3) + 's';
            confettiContainer.appendChild(confetti);
            
            // Remove after animation
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }, i * 30);
    }
}

function createCelebrationHearts() {
    const container = document.getElementById('floatingHearts');
    const hearts = ['💖', '💕', '💗', '💝', '💘'];
    
    // Create burst of hearts
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.fontSize = (Math.random() * 2 + 2) + 'rem';
            heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
            container.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 8000);
        }, i * 100);
    }
}

// ============= HEART CATCHING GAME =============
const game = {
    canvas: null,
    ctx: null,
    hearts: [],
    player: { x: 0, y: 0, width: 60, height: 60, emoji: '🤲' },
    score: 0,
    timeLeft: 30,
    targetScore: 15,
    isRunning: false
};

function startGame() {
    // Hide start screen, show game area
    document.getElementById('gameStart').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';
    document.getElementById('gameEnd').style.display = 'none';
    
    // Initialize canvas
    game.canvas = document.getElementById('gameCanvas');
    game.ctx = game.canvas.getContext('2d');
    
    // Set canvas size
    game.canvas.width = game.canvas.offsetWidth;
    game.canvas.height = game.canvas.offsetHeight;
    
    // Reset game state
    game.score = 0;
    game.timeLeft = 30;
    game.hearts = [];
    game.isRunning = true;
    
    // Initialize player position
    game.player.x = game.canvas.width / 2 - game.player.width / 2;
    game.player.y = game.canvas.height - game.player.height - 20;
    
    // Update UI
    document.getElementById('score').textContent = '0';
    document.getElementById('timer').textContent = '30';
    
    // Add event listeners
    game.canvas.addEventListener('mousemove', handleMouseMove);
    game.canvas.addEventListener('touchmove', handleTouchMove);
    
    // Start game loop
    gameLoop();
    
    // Start timer
    const timerInterval = setInterval(() => {
        game.timeLeft--;
        document.getElementById('timer').textContent = game.timeLeft;
        
        if (game.timeLeft <= 0 || !game.isRunning) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
    
    // Spawn hearts periodically
    const spawnInterval = setInterval(() => {
        if (!game.isRunning) {
            clearInterval(spawnInterval);
            return;
        }
        spawnHeart();
    }, 800);
}

function handleMouseMove(e) {
    const rect = game.canvas.getBoundingClientRect();
    game.player.x = e.clientX - rect.left - game.player.width / 2;
}

function handleTouchMove(e) {
    e.preventDefault();
    const rect = game.canvas.getBoundingClientRect();
    const touch = e.touches[0];
    game.player.x = touch.clientX - rect.left - game.player.width / 2;
}

function spawnHeart() {
    const heartEmojis = ['💖', '💕', '💗', '💘', '💞'];
    game.hearts.push({
        x: Math.random() * (game.canvas.width - 40),
        y: -40,
        width: 40,
        height: 40,
        speed: Math.random() * 2 + 2,
        emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)]
    });
}

function gameLoop() {
    if (!game.isRunning) return;
    
    // Clear canvas
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    
    // Draw player
    game.ctx.font = `${game.player.height}px Arial`;
    game.ctx.fillText(game.player.emoji, game.player.x, game.player.y + game.player.height);
    
    // Update and draw hearts
    for (let i = game.hearts.length - 1; i >= 0; i--) {
        const heart = game.hearts[i];
        heart.y += heart.speed;
        
        // Draw heart
        game.ctx.font = `${heart.height}px Arial`;
        game.ctx.fillText(heart.emoji, heart.x, heart.y + heart.height);
        
        // Check collision with player
        if (
            heart.x < game.player.x + game.player.width &&
            heart.x + heart.width > game.player.x &&
            heart.y < game.player.y + game.player.height &&
            heart.y + heart.height > game.player.y
        ) {
            // Heart caught!
            game.hearts.splice(i, 1);
            game.score++;
            document.getElementById('score').textContent = game.score;
            
            // Check win condition
            if (game.score >= game.targetScore) {
                game.isRunning = false;
                setTimeout(endGame, 500);
            }
        }
        // Remove if off screen
        else if (heart.y > game.canvas.height) {
            game.hearts.splice(i, 1);
        }
    }
    
    requestAnimationFrame(gameLoop);
}

function endGame() {
    game.isRunning = false;
    
    // Remove event listeners
    game.canvas.removeEventListener('mousemove', handleMouseMove);
    game.canvas.removeEventListener('touchmove', handleTouchMove);
    
    // Hide game area, show results
    document.getElementById('gameArea').style.display = 'none';
    document.getElementById('gameEnd').style.display = 'block';
    
    // Display results
    const resultText = document.getElementById('gameResultText');
    const resultMessage = document.getElementById('gameResultMessage');
    
    if (game.score >= game.targetScore) {
        resultText.textContent = 'Amazing! You caught all my hearts!';
        resultMessage.textContent = `You collected ${game.score} hearts! You're clearly a pro at catching hearts!`;
    } else if (game.score >= 10) {
        resultText.textContent = '💖 Great job! 💖';
        resultMessage.textContent = `You caught ${game.score} hearts! You're pretty good at this! 😊`;
    } else if (game.score >= 5) {
        resultText.textContent = '💕 Nice try! 💕';
        resultMessage.textContent = `You caught ${game.score} hearts. Not bad for a first attempt! 😄`;
    } else {
        resultText.textContent = '💗 You tried! 💗';
        resultMessage.textContent = `You caught ${game.score} hearts. But hey, what matters is you tried! 🥰`;
    }
}

// ============= UTILITY FUNCTIONS =============
// Prevent scrolling when touching canvas
document.addEventListener('touchmove', function(e) {
    if (e.target.id === 'gameCanvas') {
        e.preventDefault();
    }
}, { passive: false });

// ============= RESPONSIVE CANVAS RESIZING =============
window.addEventListener('resize', function() {
    if (game.canvas && game.isRunning) {
        const oldWidth = game.canvas.width;
        const oldHeight = game.canvas.height;
        
        game.canvas.width = game.canvas.offsetWidth;
        game.canvas.height = game.canvas.offsetHeight;
        
        // Adjust player position proportionally
        game.player.x = (game.player.x / oldWidth) * game.canvas.width;
        game.player.y = (game.player.y / oldHeight) * game.canvas.height;
    }
});

// ============= KEYBOARD SHORTCUTS (OPTIONAL) =============
document.addEventListener('keydown', function(e) {
    // Press Enter on landing to proceed
    if (currentSection === 'landing' && e.key === 'Enter') {
        showSection('question');
    }
    
    // Press Y for Yes
    if (currentSection === 'question' && e.key.toLowerCase() === 'y') {
        handleYes();
    }
});

// ============= IMAGE LIGHTBOX =============
function openLightbox(img) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    lightboxImg.src = img.src;
    lightbox.classList.add('active');

    document.body.style.overflow = 'hidden'; // prevent scroll
}

function closeLightbox(e) {
    if (
        e.target.id === 'lightbox' ||
        e.target.classList.contains('lightbox-close')
    ) {
        const lightbox = document.getElementById('lightbox');
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}


/*
===========================================
CUSTOMIZATION NOTES:
===========================================

1. To change the game difficulty:
   - Modify game.targetScore (line 230) to change hearts needed to win
   - Modify game.timeLeft (line 231) to change time limit
   - Modify spawnInterval time (line 271) to control heart spawn rate

2. To add more "No" button messages:
   - Add messages to the noMessages array (line 17)

3. To change confetti colors:
   - Modify the colors array in createConfetti() (line 157)

4. To change floating hearts frequency:
   - Modify the interval time in initFloatingHearts() (line 36)

===========================================
*/