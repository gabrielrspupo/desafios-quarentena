const SURPRISE_SACK_SIZE = 40;
/**
 * This class defines the surprise sacks behavior.
 */
class Surprise extends Entity {
    /**
     * Store every surprise sacks instantiated in the current level.
     * @type { Surprise[] }
     */
    static allSurpriseElements = [];

    /**
     * 
     * @param {HTMLDivElement} containerElement The HTML element in which the sack must be created
     * @param {Vector} initialPosition The initial position of the sack in the container
     */
    constructor (
        containerElement,
		initialPosition,
    ) {
        super(containerElement, new Vector(1, 1).scale(SURPRISE_SACK_SIZE), initialPosition);

        this.rootElement.style.backgroundImage = "url('assets/surprise.svg')";

        // when new sack is created push to the Surprise elements array
        Surprise.allSurpriseElements.push(this);
    }

    /**
     * The speed in which the sack will be pulled by the hook
     * @returns {number} A constant multiplyer
     */
    calculateHookSpeedMultiplier () {
        return 0.95;
    }

    /**
     * Draw a random effect and apply in the game.
     */
    applyRandomEffect () {
        let roll = Math.random();
        if (roll < 0.5) {
            HUD.instance.dynamite = ++ Player.instance.dynamite;    // increase dynamite amount
            HUD.instance.dynamiteElement.style.color = 'red';
            setTimeout(() => {
                HUD.instance.dynamiteElement.style.color = 'black';
            }, 300);
        } else {
            Player.instance.score += 3;     // increase player score in 3 units
            HUD.instance.score = Player.instance.score; 	// update score stat on HUD
            HUD.instance.scoreElement.style.color = 'red';
            setTimeout(() => {
                HUD.instance.scoreElement.style.color = 'black';
            }, 300);
            GameMap.instance.verifyIfLevelIsOver(); // check if this score change terminates level
        }
    }

    delete () {
        super.delete();

        const index = Surprise.allSurpriseElements.findIndex(e => e === this);
        if (index !== -1) Surprise.allSurpriseElements.splice(index, 1);
    }
}