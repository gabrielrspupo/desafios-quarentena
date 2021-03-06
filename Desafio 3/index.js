// This is the container of all movableEntities
const movableEntityContainer = document.getElementById('movable-entity-container');

// creates the single only map instance in the game.
// There should be only one map in the game, so it is a Singleton class.
// If you'd like to know more about the singleton pattern, see this link:
// https://en.wikipedia.org/wiki/Singleton_pattern
const map = new Map(movableEntityContainer);

// creates the single only player instance in the game.
const player = new Player(
	movableEntityContainer,
	map,
	gameOver,
);

// This is the game frame function. It is responsible for updating everything in the game.
function frame () {
	map.frame();

	// if the player is pressing one of the keys, call the turn function
	if (pressedKeys['a'] || pressedKeys['ArrowLeft']) player.turn(-1);
	if (pressedKeys['d'] || pressedKeys['ArrowRight']) player.turn(1);
	if (pressedKeys['w'] || pressedKeys['ArrowUp']) player.move();

	// tell player if power bullet is ready
	if (!powerBulletLoading() && !playerKnows) {
		map.powerBulletElement.appendChild(readyText);
		playerKnows = true;
	}
}

// This is a dictionary that will hold the keys that are being held down at the time.
// If you'd like to know more about dictionaries, see this link:
// https://pietschsoft.com/post/2015/09/05/javascript-basics-how-to-create-a-dictionary-with-keyvalue-pairs
const pressedKeys = {};
const bulletMode = Object.freeze({
	NORMAL: 0,
	POWER: 1,
	SPREAD: 2
});

const cooldown = 3000;			// power bullet cooldown
let lastPowerInvoke = 0;		// last time power bullet was invoked

// power bullet 'Ready!' display
let playerKnows = false;
let readyText = document.createElement('div');
readyText.innerHTML = `Ready!`;
readyText.style.fontSize = '10px';
readyText.style.color = 'green';
readyText.style.textShadow = 'green 0 0 2.5px, green 0 0 2.5px';

function powerBulletLoading() {
	return lastPowerInvoke >= (Date.now() - cooldown);
}

// This function will run every time the player presses a key
document.body.addEventListener('keydown', event => {
	// if that key is the spacebar, the player will shoot.
	if (event.key === ' ' && !pressedKeys[' ']) player.shoot(bulletMode.NORMAL);
	// if that key is E, the player shoots a special bullet
	if (event.key === 'e' && !pressedKeys['e']) {
		if (map.ability == bulletMode.POWER) {	// wait 3 seconds before shooting power bullet
			if (powerBulletLoading())	return;
			playerKnows = false;
			map.powerBulletElement.removeChild(readyText);
			lastPowerInvoke = Date.now();
		}

		player.shoot(map.ability);
	}

	// add the pressed key to the pressedKey dictionary
	pressedKeys[event.key] = true;
});

// This function will run every time the player releases a key
document.body.addEventListener('keyup', event => {
	// removes the pressed key to the pressedKey dictionary
	delete pressedKeys[event.key];
});

// This function will run every time the player clicks
document.body.addEventListener('click', event => {
	switch (event.target.id) {
		case 'power-bullet':	// select power bullet in HUD
			map.ability = bulletMode.POWER;

			map.powerBulletElement.style.color = 'red';
			map.powerBulletElement.style.textShadow = 'red 0 0 2.5px, red 0 0 2.5px';

			map.spreadBulletElement.style.color = 'white';
			map.spreadBulletElement.style.textShadow = 'white 0 0 2.5px, white 0 0 2.5px';
			break;
		case 'spread-bullet':	// select spread bullet in HUD
			map.ability = bulletMode.SPREAD;

			map.powerBulletElement.style.color = 'white';
			map.powerBulletElement.style.textShadow = 'white 0 0 2.5px, white 0 0 2.5px';

			map.spreadBulletElement.style.color = 'red';
			map.spreadBulletElement.style.textShadow = 'red 0 0 2.5px, red 0 0 2.5px';
			break;
	}
});

// Registers the frame function to run at every frame.
// if you'd like to know more about intervals, see this link
// https://javascript.info/settimeout-setinterval
const intervalHandler = setInterval(frame);

// This is the function that will end the game
function gameOver () {
	// This will unregister the frame function, so nothing else will be updated
	clearInterval(intervalHandler);
	alert('Você perdeu');
}