const DYNAMITE_AMOUNT = 3;
const DYNAMITE_SIZE = 20;

class Dynamite extends Entity {

    static instance = null;

    constructor (containerElement) {

        super(containerElement, new Vector(1, 1).scale(DYNAMITE_SIZE));

        this.amount = DYNAMITE_AMOUNT;

        Dynamite.instance = this;
    }

    explode () {
        if (Hook.hookElement.state !== 'pulling' || this.amount === 0) return;

        Hook.hookElement.hookedObject.delete();
        Hook.hookElement.hookedObject = null;
        Hook.hookElement.pullEmptyHook();

        HUD.instance.dynamite = --this.amount;
    }
}