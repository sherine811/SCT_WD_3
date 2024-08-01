document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const message = document.getElementById('message');
    const restartButton = document.getElementById('restart');
    const newGameButton = document.getElementById('new-game');
    const modeSelection = document.getElementById('mode-selection');
    const twoPlayerButton = document.getElementById('two-player-mode');
    const computerButton = document.getElementById('computer-mode');
    const themeToggleButton = document.getElementById('theme-toggle');
    const scoreDisplay = document.getElementById('score');
    let isComputerMode = false;
    let currentPlayer = 'X';
    let board = [];
    let gameActive = true;
    let scores = { X: 0, O: 0 };

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const clickSound = new Audio('click.mp3');
    const winSound = new Audio('win.mp3');
    const drawSound = new Audio('draw.mp3');

    const playSound = (sound) => {
        sound.play().catch(error => console.error('Error playing sound:', error));
    };

    const handleCellClick = (e) => {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (board[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        board[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;

        playSound(clickSound);

        if (checkWin()) {
            gameActive = false;
            message.textContent = `${currentPlayer} wins!`;
            scores[currentPlayer]++;
            updateScore();
            playSound(winSound);
            return;
        }

        if (board.every(cell => cell !== '')) {
            gameActive = false;
            message.textContent = 'Draw!';
            playSound(drawSound);
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

        if (isComputerMode && currentPlayer === 'O' && gameActive) {
            setTimeout(() => computerMove(), 500);
        }
    };

    const checkWin = () => {
        return winningConditions.some(condition => {
            return condition.every(index => board[index] === currentPlayer);
        });
    };

    const restartGame = () => {
        board = Array(9).fill('');
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => cell.textContent = '');
        currentPlayer = 'X';
        gameActive = true;
        message.textContent = '';
    };

    const computerMove = () => {
        let availableCells = [];
        board.forEach((cell, index) => {
            if (cell === '') {
                availableCells.push(index);
            }
        });

        const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
        board[randomIndex] = currentPlayer;
        const cell = document.querySelector(`.cell[data-index="${randomIndex}"]`);
        cell.textContent = currentPlayer;

        if (checkWin()) {
            gameActive = false;
            message.textContent = `${currentPlayer} wins!`;
            scores[currentPlayer]++;
            updateScore();
            playSound(winSound);
            return;
        }

        if (board.every(cell => cell !== '')) {
            gameActive = false;
            message.textContent = 'Draw!';
            playSound(drawSound);
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    };

    const toggleTheme = () => {
        document.body.classList.toggle('dark-mode');
    };

    const updateScore = () => {
        scoreDisplay.textContent = `Player X: ${scores.X} | Player O: ${scores.O}`;
    };

    const showGameBoard = () => {
        modeSelection.style.display = 'none';
        gameContainer.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-index', i);
            cell.addEventListener('click', handleCellClick);
            gameContainer.appendChild(cell);
        }
        restartButton.style.display = 'block';
        newGameButton.style.display = 'block';
        message.textContent = '';
        restartGame();
        updateScore();
    };

    const promptModeSelection = () => {
        modeSelection.style.display = 'block';
        restartButton.style.display = 'none';
        newGameButton.style.display = 'none';
        gameContainer.innerHTML = '';
        message.textContent = '';
        updateScore();
    };

    twoPlayerButton.addEventListener('click', () => {
        isComputerMode = false;
        showGameBoard();
    });

    computerButton.addEventListener('click', () => {
        isComputerMode = true;
        showGameBoard();
    });

    restartButton.addEventListener('click', restartGame);
    newGameButton.addEventListener('click', promptModeSelection);
    themeToggleButton.addEventListener('click', toggleTheme);

    promptModeSelection();
});
