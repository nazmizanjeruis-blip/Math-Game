class MathGame {
    constructor() {
        this.score = 0;
        this.streak = 0;
        this.bestStreak = 0;
        this.currentQuestion = 0;
        this.totalQuestions = 10;
        this.correctAnswers = 0;
        this.difficulty = 'medium';
        this.currentAnswer = null;
        this.answerSubmitted = false;

        this.initElements();
        this.attachEventListeners();
        this.generateQuestion();
    }

    initElements() {
        this.scoreEl = document.getElementById('score');
        this.streakEl = document.getElementById('streak');
        this.questionsEl = document.getElementById('questions');
        this.questionEl = document.getElementById('question');
        this.answerInput = document.getElementById('answer-input');
        this.submitBtn = document.getElementById('submit-btn');
        this.feedbackEl = document.getElementById('feedback');
        this.nextBtn = document.getElementById('next-btn');
        this.nextSection = document.getElementById('next-section');
        this.gameArea = document.getElementById('game-area');
        this.gameOver = document.getElementById('game-over');
        this.finalScore = document.getElementById('final-score');
        this.correctAnswersEl = document.getElementById('correct-answers');
        this.accuracy = document.getElementById('accuracy');
        this.bestStreakEl = document.getElementById('best-streak');
        this.playAgainBtn = document.getElementById('play-again-btn');
        this.difficultySelect = document.getElementById('difficulty');
    }

    attachEventListeners() {
        this.submitBtn.addEventListener('click', () => this.submitAnswer());
        this.answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.submitAnswer();
        });
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.playAgainBtn.addEventListener('click', () => this.resetGame());
        this.difficultySelect.addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.resetGame();
        });
    }

    getDifficultyRange() {
        switch (this.difficulty) {
            case 'easy':
                return { min: 1, max: 10 };
            case 'hard':
                return { min: 1, max: 100 };
            case 'medium':
            default:
                return { min: 1, max: 50 };
        }
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    generateQuestion() {
        const range = this.getDifficultyRange();
        const num1 = this.getRandomNumber(range.min, range.max);
        const num2 = this.getRandomNumber(range.min, range.max);
        const operations = ['+', '-', '*', '/'];
        const operation = operations[Math.floor(Math.random() * operations.length)];

        let answer;
        switch (operation) {
            case '+':
                answer = num1 + num2;
                break;
            case '-':
                answer = num1 - num2;
                break;
            case '*':
                answer = num1 * num2;
                break;
            case '/':
                // Ensure division results in a whole number
                answer = num1;
                this.currentQuestion++;
                const divisor = this.getRandomNumber(1, 10);
                answer = answer * divisor;
                this.currentQuestion--;
                this.questionEl.textContent = `${answer} ÷ ${divisor} = ?`;
                this.currentAnswer = answer / divisor;
                return;
            default:
                answer = num1 + num2;
        }

        this.questionEl.textContent = `${num1} ${operation} ${num2} = ?`;
        this.currentAnswer = answer;
    }

    submitAnswer() {
        if (this.answerSubmitted) return;

        const userAnswer = parseFloat(this.answerInput.value);

        if (isNaN(userAnswer)) {
            this.showFeedback('Please enter a valid number!', 'wrong');
            return;
        }

        this.answerSubmitted = true;
        const isCorrect = userAnswer === this.currentAnswer;

        if (isCorrect) {
            this.streak++;
            this.correctAnswers++;
            this.score += 10 + this.streak;
            if (this.streak > this.bestStreak) {
                this.bestStreak = this.streak;
            }
            this.showFeedback('✓ Correct! Great job!', 'correct');
        } else {
            this.streak = 0;
            this.showFeedback(`✗ Wrong! The answer was ${this.currentAnswer}`, 'wrong');
        }

        this.updateStats();
        this.submitBtn.style.display = 'none';
        this.nextSection.style.display = 'block';
    }

    showFeedback(message, type) {
        this.feedbackEl.textContent = message;
        this.feedbackEl.className = `feedback show ${type}`;
    }

    updateStats() {
        this.scoreEl.textContent = this.score;
        this.streakEl.textContent = this.streak;
        this.questionsEl.textContent = `${this.currentQuestion + 1}/${this.totalQuestions}`;
    }

    nextQuestion() {
        this.currentQuestion++;

        if (this.currentQuestion >= this.totalQuestions) {
            this.endGame();
            return;
        }

        this.answerSubmitted = false;
        this.answerInput.value = '';
        this.feedbackEl.className = 'feedback';
        this.feedbackEl.textContent = '';
        this.submitBtn.style.display = 'inline-block';
        this.nextSection.style.display = 'none';
        this.generateQuestion();
        this.answerInput.focus();
    }

    endGame() {
        this.gameArea.style.display = 'none';
        this.gameOver.style.display = 'block';

        const accuracyPercent = Math.round((this.correctAnswers / this.totalQuestions) * 100);

        this.finalScore.textContent = this.score;
        this.correctAnswersEl.textContent = this.correctAnswers;
        this.accuracy.textContent = accuracyPercent;
        this.bestStreakEl.textContent = this.bestStreak;
    }

    resetGame() {
        this.score = 0;
        this.streak = 0;
        this.bestStreak = 0;
        this.currentQuestion = 0;
        this.correctAnswers = 0;
        this.answerSubmitted = false;

        this.gameArea.style.display = 'block';
        this.gameOver.style.display = 'none';
        this.answerInput.value = '';
        this.feedbackEl.className = 'feedback';
        this.feedbackEl.textContent = '';
        this.submitBtn.style.display = 'inline-block';
        this.nextSection.style.display = 'none';

        this.updateStats();
        this.generateQuestion();
        this.answerInput.focus();
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MathGame();
});
