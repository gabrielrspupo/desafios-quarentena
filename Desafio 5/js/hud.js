const BASE_TIMER = 10;

class HUD {
    static instance = null;

    constructor (containerElement) {
        this.rootElement = document.createElement('div');
        this.rootElement.setAttribute('class', 'hud');
        containerElement.appendChild(this.rootElement);

        this.scoreElement = document.createElement('div');
        this.scoreElement.setAttribute('class', 'hud-element');
        this.rootElement.appendChild(this.scoreElement);

        this.timeElement = document.createElement('div');
        this.timeElement.setAttribute('class', 'hud-element');
        this.rootElement.appendChild(this.timeElement);

        this.startTimestamp = Date.now();

        this.score = 0;
        this.time = BASE_TIMER;
        this.isGameOver = false;
        HUD.instance = this;
    }

    /**
     * @param {number} newScore
     */
    set score(newScore) {
        this._score = newScore;
        this.scoreElement.innerHTML = `Score: ${this._score}`;
    }

    get score() {
        return this._score;
    }

    /**
     * @param {number} newTime
     */
    set time(newTime) {
        this._time = newTime;
        this.timeElement.innerHTML = `Time: ${this._time}`;
    }

    get time() {
        return this._time;
    }

    frame () {
        if (this.time <= 0)
            this.gameOver();
        else this.time --;
    }

    gameOver() {
        if (!this.isGameOver) {
            alert('O tempo acabou!');
            this.isGameOver = true;
            location.reload();
        }
    }
}