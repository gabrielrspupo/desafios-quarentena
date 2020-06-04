const SURPRISE_SACK_SIZE = 40;

class Surprise extends Entity {
    static allSurpriseElements = [];

    constructor (
        containerElement,
		initialPosition,
    ) {
        super(containerElement, new Vector(1, 1).scale(SURPRISE_SACK_SIZE), initialPosition);

        this.rootElement.style.backgroundImage = "url('assets/surprise.svg')";

        Surprise.allSurpriseElements.push(this);
    }

    calculateHookSpeedMultiplier () {
        return 0.95;
    }

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
            GameMap.instance.verifyIfLevelIsOver();
        }
    }

    delete () {
        super.delete();

        const index = Surprise.allSurpriseElements.findIndex(e => e === this);
        if (index !== -1) Surprise.allSurpriseElements.splice(index, 1);
    }
}