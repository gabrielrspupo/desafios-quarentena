// This is the container of all Entities
const movableEntityContainer = document.getElementById('movable-entity-container');

const map = new GameMap(movableEntityContainer);
const player = new Player(movableEntityContainer);

// Fetching the HUD container
const gameHUDContainer = document.getElementById('game-hud');
const hud = new HUD(gameHUDContainer);

// This is the game frame function. It is responsible for updating everything in the game.
function frame () {
	map.frame();
	hud.update();
}

// This function will run every time the player presses a key
document.body.addEventListener('keydown', event => {
	// if that key is the spacebar, the player will try to throw it's hook.
	if (event.key === ' ') player.throwHook();

	// if that key is D, the player will try to throw a dynamite.
	if (event.key === 'd') player.throwDynamite();
});

// Registers the frame function to run at every frame.
// if you'd like to know more about intervals, see this link
// https://javascript.info/settimeout-setinterval
const intervalHandler = setInterval(frame);
