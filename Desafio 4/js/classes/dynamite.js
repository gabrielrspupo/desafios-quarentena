const DYNAMITE_SIZE = 70;
const DYNAMITE_THROWING_SPEED = 0.8;
const DYNAMITE_ROTATION_SPEED = 0.03;

class Dynamite extends MovableEntity {

    static instance = null;

    constructor (
        containerElement,
        initialPosition
    ) {

        super(containerElement, new Vector(1, 1).scale(DYNAMITE_SIZE), initialPosition);

        this.rootElement.style.backgroundImage = "url('assets/dynamite.svg')";

        this.hook = Hook.hookElement;

        Dynamite.instance = this;
    }

    explode (object) {
        if (this.hook.state !== 'pulling' || this.amount === 0) return;

        object.delete();
        object = null;
        this.hook.pullEmptyHook();

        HUD.instance.dynamite = --Player.instance.dynamite;
        
        this.delete();
        Dynamite.instance = null;
    }

    collided (object) {
        if (object === this.hook.hookedObject)
            this.explode(this.hook.hookedObject);
    }

    throw () {
        this.velocity = this.hook.direction.scale(DYNAMITE_THROWING_SPEED);
    }

    frame () {
        super.frame();

        this.turn(DYNAMITE_ROTATION_SPEED);
    }
}