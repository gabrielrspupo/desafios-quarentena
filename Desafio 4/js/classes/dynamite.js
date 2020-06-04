const DYNAMITE_SIZE = 70;
const DYNAMITE_THROWING_SPEED = 0.8;
const DYNAMITE_ROTATION_SPEED = 0.03;

/**
 * This class defines the Dynamite behaviour.
 */
class Dynamite extends MovableEntity {
    /**
	* Store dynamite instance
	* @type { Dynamite }
	*/
    static instance = null;

    /**
     * 
     * @param {HTMLDivElement} containerElement The HTML element in which the dynamite must be created
     * @param {Vector} initialPosition The initial position of the dynamite in the container
     */
    constructor (
        containerElement,
        initialPosition
    ) {

        super(containerElement, new Vector(1, 1).scale(DYNAMITE_SIZE), initialPosition);

        this.rootElement.style.backgroundImage = "url('assets/dynamite.svg')";

        // fetch player hook instance
        this.hook = Hook.hookElement;

        Dynamite.instance = this;
    }

    /**
     * Explode hooked object.
     * @param {Gold | Rock| Surprise} object 
     */
    explode (object) {
        // delete hooked object
        object.delete();
        object = null;

        // change hook animation stance to pull it faster
        this.hook.pullEmptyHook();

        // decrease dynamite amount
        HUD.instance.dynamite = --Player.instance.dynamite;
        
        // delete this dynamite instance
        this.delete();
        Dynamite.instance = null;
    }

    /**
     * Check if dynamite collided with hooked object and, if so, explode it
     * @param {Gold | Rock | Surprise} object 
     */
    collided (object) {
        if (object === this.hook.hookedObject)
            this.explode(this.hook.hookedObject);
    }

    /**
     * If player press throw button, start throwing animation at constant speed on hooked object direction.
     */
    throw () {
        this.velocity = this.hook.direction.scale(DYNAMITE_THROWING_SPEED);
    }

    /**
     * Handles dynamite throwing animation
     */
    frame () {
        super.frame();

        // Rotates dynamite during throw
        this.turn(DYNAMITE_ROTATION_SPEED);
    }
}