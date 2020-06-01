const HUD_SIZE = new Vector(400, 75);
const HUD_POSITION = new Vector(0, 250);

/**
 * This class defines the HUD. A HUD is a visual representation of current game statistics.
 * It holds the current player score and game level.
 */
class HUD extends Entity {
    /**
	* Will hold the HUD instance
	* @type { HUD | null }
	*/
    static instance = null;

    /**
	* @argument { HTMLDivElement } containerElement The HTML element in which the HUD should be created
	*/
    constructor (containerElement) {
        super(containerElement, HUD_SIZE, HUD_POSITION);

        // assign the game stats from appropriate objects into the HUD elements
        this.score = Player.instance.score;
        this.level = GameMap.instance.level;
        this.dynamite = Dynamite.instance.amount;
        this.latest = true; // is the HUD on the latest version?

        this.rootElement.style.display = 'flex';
        this.rootElement.style.justifyContent = 'space-evenly';
        this.rootElement.style.textAlign = 'center';

        this.scoreElement = document.createElement('div');
        this.scoreElement.innerHTML = `Score<br />${this.score}`;

        this.levelElement = document.createElement('div');
        this.levelElement.innerHTML = `Level<br />${this.level}`;

        this.dynamiteElement = document.createElement('div');
        this.dynamiteElement.innerHTML = `Dynamites<br />${this.dynamite}`;

        this.rootElement.appendChild(this.scoreElement);
        this.rootElement.appendChild(this.levelElement);
        this.rootElement.appendChild(this.dynamiteElement);

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

    set dynamite (newAmount) {
        this._dynamite = newAmount;
        this.latest = false;
    }

    get dynamite () {
        return this._dynamite;
    }

    /**
     * Updates the game HUD, with the latest statistics.
     * To avoid the reconstruction of the DOM every frame (and thus enhance performance), only updates when flag is unset.
     */
    update () {
        if (!this.latest) {
            this.scoreElement.innerHTML = `Score<br />${this.score}`;
            this.levelElement.innerHTML = `Level<br />${this.level}`;
            this.dynamiteElement.innerHTML = `Dynamites<br />${this.dynamite}`;
            this.latest = true;
        }
    }
} 