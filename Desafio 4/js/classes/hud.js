const HUD_SIZE = new Vector(400, 75);
const HUD_POSITION = new Vector(0, 250);

class HUD extends Entity {

    static instance = null;

    constructor (containerElement) {
        super(containerElement, HUD_SIZE, HUD_POSITION);

        this.score = Player.instance.score;
        this.level = GameMap.instance.level;
        this.latest = true;

        this.rootElement.style.display = 'flex';
        this.rootElement.style.justifyContent = 'space-evenly';
        this.rootElement.style.textAlign = 'center';

        this.scoreElement = document.createElement('div');
        this.scoreElement.innerHTML = `Score<br />${this.score}`;

        this.levelElement = document.createElement('div');
        this.levelElement.innerHTML = `Level<br />${this.level}`;

        this.rootElement.appendChild(this.scoreElement);
        this.rootElement.appendChild(this.levelElement);

        HUD.instance = this;
    }

    set level (newLevel) {
        this._level = newLevel;
        this.latest = false;
    }

    get level () {
        return this._level;
    }

    set score (newScore) {
        this._score = newScore;
        this.latest = false;
    }

    get score () {
        return this._score;
    }

    update () {
        if (!this.latest) {
            this.scoreElement.innerHTML = `Score<br />${this.score}`;
            this.levelElement.innerHTML = `Level<br />${this.level}`;
            this.latest = true;
        }
    }
} 