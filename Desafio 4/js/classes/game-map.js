const MAP_SIZE = new Vector(400, 400);
const FLOOR_HEIGHT = -100;

const BASE_SCORE_FOR_NEXT_LEVEL = 5;
const BASE_NUMBER_OF_ROCKS = 2;
const MAX_NUMBER_OF_SURPRISES = 3;
const BASE_TIME = 20;

/**
* This is a class declaration
* This class is responsible for defining the GameMap behavior
* There should be only one map in the game, so this is a Singleton class.
* If you'd like to know more about the singleton pattern, see this link:
* https://en.wikipedia.org/wiki/Singleton_pattern
*
* This class extends the Entity class, which is responsible for binding the element's
* positons and directions. If you'd like to know more about class inheritance in javascript, see this link
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
*/
class GameMap extends Entity {
	/**
	* @type { GameMap | null }
	*/
	static instance = null;

	/**
	* @argument { HTMLDivElement } containerElement
	*/
	constructor (containerElement) {
		// The `super` function will call the constructor of the parent class.
		// If you'd like to know more about class inheritance in javascript, see this link
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
		super(containerElement, MAP_SIZE);

		// Create the map's box and floor
		this.rootElement.style.border = '1px solid black';
		this.floor = new Entity(containerElement, new Vector(MAP_SIZE.x, 1), new Vector(0, FLOOR_HEIGHT));
		this.floor.rootElement.style.border = '1px solid black';
		this.floor.rootElement.style.zIndex = '1';

		// The current game level. Will increase when player captures enough gold
		this.level = 0;

		this.initializeLevel();

		//this.time = BASE_TIME + BASE_SCORE_FOR_NEXT_LEVEL;
		this.calculateCurrentLevelTime();
		this.isGameOver = false;

		GameMap.instance = this;
	}

	/**
	* Will initialize the whole level, creating all golds and rocks
	*/
	initializeLevel () {
		while (this.getCurrentGoldScoreInMap() < this.calculateTotalGoldScore()) {
			this.generateItem('gold');
		}

		for (let i = 0; i < this.calculateNumberOfRocks(); i ++) {
			this.generateItem('rock');
		}

		for (let i = 0; i < this.calculateNumberOfSurprises(); i ++) {
			this.generateItem('surprise');
		}
	}

	nextLevel () {
		this.level ++;
		HUD.instance.level = this.level; // update level stat on HUD
		// Delete all remaining gold and rock elements
		Gold.allGoldElements.forEach(gold => gold.delete());
		Rock.allRockElements.forEach(rock => rock.delete());
		Surprise.allSurpriseElements.forEach(sack => sack.delete());
		this.initializeLevel();
		this.calculateCurrentLevelTime();
	}

	calculateCurrentLevelTime () {
		this.levelStartTimestamp = Date.now();
		this.time = BASE_TIME + this.calculateMinimumScore(this.level) - (this.level * 2);
	}

	/**
	* calculates the minimum score the player must achieve to reach the given level
	* @argument { number } level
	*/
	calculateMinimumScore (level) {
		if (level === 0) return BASE_SCORE_FOR_NEXT_LEVEL;
		else return BASE_SCORE_FOR_NEXT_LEVEL + this.level * 2 + this.calculateMinimumScore(level - 1);
	}

	/**
	* calculates the total score the level should have. It must alwasy be larger
	* than the minimum score
	*/
	calculateTotalGoldScore () {
		return this.calculateMinimumScore(this.level) + this.level * 2;
	}

	/**
	* calculates the number of rocks the level should have
	*/
	calculateNumberOfRocks () {
		return BASE_NUMBER_OF_ROCKS + this.level * 3;
	}

	calculateNumberOfSurprises () {
		return Math.min(MAX_NUMBER_OF_SURPRISES, this.level);
	}

	/**
	* calculates the sum of the score of all existing gold in the map
	*/
	getCurrentGoldScoreInMap () {
		let score = 0;
		Gold.allGoldElements.forEach(gold => score += gold.calculateScore());
		return score;
	}

	/**
	* Checks if the two entities collidade, and if they did, call their `collided` method.
	* @argument { Entity } entity1
	* @argument { Entity } entity2
	*/
	verifyForCollision (entity1, entity2) {
		if (Entity.didEntitiesColide(entity1, entity2)) {
			entity1.collided(entity2);
			entity2.collided(entity1);
		}
	}

	/**
	* Checks if an entity is ouside the map bounding box
	* @argument { Entity } entity
	* @returns { boolean }
	*/
	isEntityOutOfBounds (entity) {
		return (
			entity.position.x >= MAP_SIZE.x / 2 ||
			entity.position.x <= -MAP_SIZE.x / 2 ||
			entity.position.y >= MAP_SIZE.y / 2 ||
			entity.position.y <= -MAP_SIZE.y / 2
		);
	}

	/**
	* Will generate either a rock element, or a gold element.
	* @argument { 'rock' | 'gold' } itemType
	*/
	generateItem (itemType) {
		let element;
		if (itemType === 'rock') element = new Rock(this.containerElement, Vector.zero);
		else if (itemType === 'gold') element = new Gold(this.containerElement, Vector.zero);
		else if (itemType === 'surprise') element = new Surprise(this.containerElement, Vector.zero);
		else throw new Error(`Invalid item type '${itemType}'`);

		// Checks if the new element is colliding with anything on the map
		function isElementCollidingWithAnything () {
			const isCollidingWithRocks = Rock.allRockElements.some(rock => Entity.didEntitiesColide(rock, element));
			if (isCollidingWithRocks) return true;
			const isCollidingWithGold = Gold.allGoldElements.some(gold => Entity.didEntitiesColide(gold, element));
			if (isCollidingWithGold) return true;
			const isCollidingWithSurpriseSack = Surprise.allSurpriseElements.some(sack => Entity.didEntitiesColide(sack, element));
			if (isCollidingWithSurpriseSack) return true;
			return false;
		}

		let timesTriedToRepositionElement = 0;

		// This whle loop will try to make sure new elements don't overlap old ones.
		// It does that by checking if the new element is colliding with anything,
		// and if it is, try again with another random position.
		do {
			const position = Vector.random;
			position.x *= (MAP_SIZE.x / 2) - 45;
			position.y *= (MAP_SIZE.y + FLOOR_HEIGHT) / 2 - 200;
			position.y -= FLOOR_HEIGHT / 2 - 50;
			element.position = position;

			// Limits the maximum amount of position rearrangements to 10.
			// This is to prevent infinite loop, or long map generation on higher
			// levels
			if (timesTriedToRepositionElement > 10) break;
			timesTriedToRepositionElement ++;
		} while (isElementCollidingWithAnything());
	}

	clockTick () {
		HUD.instance.time = this.time - Math.floor((Date.now() - this.levelStartTimestamp) / 1000);
		this.verifyIfLevelIsOver();
	}

	gameOver () {
		alert("Você perdeu");
		window.location.reload();
	}

	/**
	* If the player has a high enough score, generate the next level.
	*/
	verifyIfLevelIsOver () {
		if (Player.instance.score >= this.calculateMinimumScore(this.level)) {
			this.nextLevel();
		}

		if (HUD.instance.time <= 0 && !this.isGameOver) {
			this.isGameOver = true;
			this.gameOver();
		}
	}

	fetchAllGroundEntities () {
		return Rock.allRockElements.concat(Gold.allGoldElements.concat(Surprise.allSurpriseElements));
	}

	/*
	* This function should be executed every game frame. It will call all of it's
	* movableObjects's frame functions (which will update their physics), and
	* handle any collision that happened.
	*
	* Note that this methods overrides the parent class's frame method. This is to
	* allow for behavior extension.
	*/
	frame () {
		this.clockTick();

		// Call the frame function on all movableEntities
		MovableEntity.runAllFrameFunctions();

		const hook = Hook.hookElement;

		// No need to check for collision if the hook is being pulled back
		if (hook.status === 'pulling') return;

		const dynamite = Dynamite.instance;

		const groundEntities = this.fetchAllGroundEntities();

		groundEntities.forEach(entity => {
			this.verifyForCollision(hook, entity);
			if (dynamite !== null)
				this.verifyForCollision(dynamite, entity);
		});

		// pull back the hook if it's gone too far
		if (this.isEntityOutOfBounds(hook)) hook.pullBack();
	}
}