// Initial time of countdown
const BASE_TIMER = 20;

class HUD {
    /**
     * Static reference to game HUD object.
     * @type { HUD } HUD instance
     */
    static instance = null;

    /**
     * @param {HTMLDivElement} containerElement 
     */
    constructor (containerElement) {
        // create HUD
        this.rootElement = document.createElement('div');
        this.rootElement.setAttribute('class', 'hud');
        containerElement.appendChild(this.rootElement);

        // create Scoreboard
        this.scoreElement = document.createElement('div');
        this.scoreElement.setAttribute('class', 'hud-element');
        this.rootElement.appendChild(this.scoreElement);

        // create Timer
        this.timeElement = document.createElement('div');
        this.timeElement.setAttribute('class', 'hud-element');
        this.rootElement.appendChild(this.timeElement);

        // System time when game started
        this.startTimestamp = Date.now();

        this.score = 0;
        this.time = BASE_TIMER;
        this.isGameOver = false;

        HUD.instance = this;
    }

    /**
     * Sets score and updates scoreboard
     * @param {number} newScore
     */
    set score(newScore) {
        if (newScore < 0) this._score = 0;
        else this._score = newScore;
        this.scoreElement.innerHTML = `Score: ${this._score}`;
    }

    /** @returns {number} score */
    get score() { return this._score; }

    /**
     * Sets time and updates countdown
     * @param {number} newTime
     */
    set time(newTime) {
        this._time = newTime;
        this.timeElement.innerHTML = `Time: ${this._time}`;
    }

    /** @returns {number} time */
    get time() { return this._time; }

    /**
     * Update loop for clock ticking and game over checking
     */
    frame () {
        if (this.time <= 0)
            this.gameOver();
        else this.time --;
    }

    /**
     * Reload game when it is over
     */
    gameOver() {
        if (!this.isGameOver) {
            alert('O tempo acabou!');
            this.isGameOver = true;
            location.reload();
        }
    }
}