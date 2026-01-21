// Game configuration
const gameSymbols = ['🎮', '🎯', '🎪', '🎨', '🎭', '🎰', '🚀', '🌟'];
let gameCards = [];
let selectedCards = [];
let matchedCount = 0;
let moveCounter = 0;
let timerSeconds = 120;
let timerInterval = null;
let canClick = true;

// DOM elements
const gridElement = document.getElementById('gameGrid');
const timerElement = document.getElementById('timerDisplay');
const movesElement = document.getElementById('movesDisplay');
const pairsElement = document.getElementById('pairsDisplay');
const statusElement = document.getElementById('statusMsg');
const restartButton = document.getElementById('restartBtn');

// Initialize game
function initializeGame() {
  // Reset game state
  gameCards = [];
  selectedCards = [];
  matchedCount = 0;
  moveCounter = 0;
  timerSeconds = 120;
  canClick = true;
  
  // Update displays
  updateDisplay();
  
  // Create card pairs
  const cardPairs = [...gameSymbols, ...gameSymbols];
  shuffleCards(cardPairs);
  
  // Clear grid
  gridElement.innerHTML = '';
  
  // Create card elements
  cardPairs.forEach((symbol, idx) => {
    const cardElement = document.createElement('div');
    cardElement.className = 'memory-card';
    cardElement.dataset.symbol = symbol;
    cardElement.dataset.id = idx;
    cardElement.addEventListener('click', () => handleCardClick(cardElement));
    gridElement.appendChild(cardElement);
    gameCards.push(cardElement);
  });
  
  // Start timer
  startTimer();
  updateStatusMessage('Find all matching pairs!');
}

// Shuffle array
function shuffleCards(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Handle card click
function handleCardClick(card) {
  if (!canClick) return;
  if (card.classList.contains('active') || card.classList.contains('success')) return;
  if (selectedCards.length >= 2) return;
  
  // Reveal card
  card.classList.add('active');
  card.textContent = card.dataset.symbol;
  selectedCards.push(card);
  
  // Check for match
  if (selectedCards.length === 2) {
    moveCounter++;
    updateDisplay();
    canClick = false;
    
    setTimeout(() => {
      checkForMatch();
    }, 800);
  }
}

// Check if cards match
function checkForMatch() {
  const [firstCard, secondCard] = selectedCards;
  
  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    // Match found
    firstCard.classList.remove('active');
    secondCard.classList.remove('active');
    firstCard.classList.add('success');
    secondCard.classList.add('success');
    matchedCount++;
    updateDisplay();
    updateStatusMessage('Perfect match! 🎉');
    
    // Check for win
    if (matchedCount === gameSymbols.length) {
      handleWin();
    }
  } else {
    // No match
    firstCard.classList.add('wrong');
    secondCard.classList.add('wrong');
    updateStatusMessage('Try again! 🤔');
    
    setTimeout(() => {
      firstCard.classList.remove('active', 'wrong');
      secondCard.classList.remove('active', 'wrong');
      firstCard.textContent = '';
      secondCard.textContent = '';
    }, 600);
  }
  
  selectedCards = [];
  canClick = true;
}

// Timer function
function startTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  timerInterval = setInterval(() => {
    timerSeconds--;
    timerElement.textContent = timerSeconds;
    
    // Warning color
    if (timerSeconds <= 30) {
      timerElement.style.color = '#ff4444';
    } else if (timerSeconds <= 60) {
      timerElement.style.color = '#ffaa00';
    }
    
    // Time's up
    if (timerSeconds <= 0) {
      handleGameOver();
    }
  }, 1000);
}

// Update display
function updateDisplay() {
  movesElement.textContent = moveCounter;
  pairsElement.textContent = `${matchedCount}/${gameSymbols.length}`;
  timerElement.textContent = timerSeconds;
}

// Update status message
function updateStatusMessage(message) {
  statusElement.textContent = message;
  statusElement.style.animation = 'none';
  setTimeout(() => {
    statusElement.style.animation = 'fadeInOut 0.5s ease';
  }, 10);
}

// Handle win
function handleWin() {
  clearInterval(timerInterval);
  canClick = false;
  updateStatusMessage('🎊 Victory! You won! 🎊');
  
  // Celebration animation
  gameCards.forEach((card, index) => {
    setTimeout(() => {
      card.style.animation = 'successBounce 0.6s ease';
    }, index * 100);
  });
}

// Handle game over
function handleGameOver() {
  clearInterval(timerInterval);
  canClick = false;
  updateStatusMessage('⏰ Time ran out! Try again! ⏰');
  
  gameCards.forEach(card => {
    card.style.opacity = '0.4';
  });
}

// Restart button
restartButton.addEventListener('click', () => {
  clearInterval(timerInterval);
  initializeGame();
});

// Start game on page load
initializeGame();