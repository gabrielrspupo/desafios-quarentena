const playerHpElement = document.getElementById('player-health');
const playerTotalHp = 280;
let playerHp = 280;

const opponentHpElement = document.getElementById('opponent-health');
const opponentTotalHp = 380;
let opponentHp = 380;

const turnText = document.getElementById('text');
let isTurnHappening = false;

const playerInfo = {
  name: 'Simões',
  type: ['human', 'assembly'],
  stage: 0
}

const opponentInfo = {
  name: 'Mello',
  type: ['human', 'gcc'],
  stage: 0
}

const playerAttacks = {
  arduinoFlamejante: {
    power: 40,
    accuracy: 100,
    name: 'Arduíno Flamejante',
    type: 'electric',
  },
  raioBioinspirado: {
    power: 40,
    accuracy: 100,
    name: 'Raio Bioinspirado',
    type: 'normal',
  },
  tiraTampa: {
    power: 110,
    accuracy: 70,
    name: 'Tira a Tampa',
    type: 'electric',
  },
  submissaoRobotica: {
    power: 80,
    accuracy: 80,
    name: 'Submissão Robótica',
    type: 'fighting',
  }
}

const opponentAttacks = {
  desarranjoHeap: {
    power: 40,
    accuracy: 100,
    name: 'Desarranjo na Heap',
    type: 'pointer',
  },
  stdshock: {
    power: 40,
    accuracy: 100,
    name: '#include <stdshock.h>',
    type: 'normal',
  },
  transtornadaFourier: {
    power: 40,
    accuracy: 100,
    name: 'Transtornada de Fourier',
    type: 'normal',
  },
  lendarioPonteiroDuplo: {
    power: 110,
    accuracy: 80,
    name: 'O Lendário Ponteiro Duplo',
    type: 'pointer',
  }
}

function gameOver (winner) {
  // Wait 1000 (Health loss animation)
  setTimeout(() => {
    // Update HTML text with the winner
    turnText.innerText = winner + ' vence!';
    // Open alert with the winner
    alert(winner + ' é o vencedor! Feche este alerta para jogar novamente');
    // Reload the game
    window.location.reload();
  }, 1000);
}

// Check if attacks misses
function willAttackMiss (accuracy) {
  return Math.floor(Math.random() * 100) > accuracy;
}

function updatePlayerHp(newHP) {
  // Prevents the HP to go lower than 0
  playerHp = Math.max(newHP, 0);

  // If player health is equal 0 opponent wins
  if (playerHp === 0) {
    gameOver('Mello');
  }

  // Update the player hp bar
  const barWidth = (playerHp / playerTotalHp) * 100;
  playerHpElement.style.width = barWidth + '%';
}

function updateOpponentHp(newHP) {
  // Prevents the HP to go lower than 0
  opponentHp = Math.max(newHP, 0);

  // If oppont health is equal 0 player wins
  if (opponentHp === 0) {
    gameOver('Simões');
  }

  // Update the opponents hp bar
  const barWidth = (opponentHp / opponentTotalHp) * 100;
  opponentHpElement.style.width = barWidth + '%';
}

function isWeakness(characterType, attackType) {
  // 0: return false if attack type is not character's weakness
  // 1: return true if it is character's weakness
  if (characterType == "human" && attackType == "electric")
    return 1;
  if (characterType == "assembly" && attackType == "pointer")
    return 1;
  return 0;
}

// player attack function that receives the used attack
function playerAttack(attack) {
  // 0: return false if attack misses
  // 1: otherwise update opponents health and return true

  // if attack misses, end turn
  if (willAttackMiss(attack.accuracy))
    return 0;
  
  // check if attack type is opponent's weakness
  let { type: opponentType, stage: opponentStage } = opponentInfo,
      weaknessIndex = 0.25,
      multiplyer = 1 + (weaknessIndex * isWeakness(opponentType[opponentStage], attack.type));
  
  // update opponent's health
  updateOpponentHp(opponentHp - attack.power * multiplyer);
  return 1;
}

// opponent attack function that receives the used attack
function opponentAttack(attack) {
  // 0: return false if attack misses
  // 1: otherwise update player health and return true

  // if attack misses, end turn
  if (willAttackMiss(attack.accuracy))
    return 0;

  // check if attack type is player's weakness
  let { type: playerType, stage: playerStage } = playerInfo,
      weaknessIndex = 0.25,
      multiplyer = 1 + (weaknessIndex * isWeakness(playerType[playerStage], attack.type));

  // update player's health
  updatePlayerHp(playerHp - attack.power * multiplyer);
  return 1;
}

function chooseOpponentAttack () {
  // Put all opponents attacks in a array
  const possibleAttacks = Object.values(opponentAttacks);

  // Randomly chooses one attack from the array
  return possibleAttacks[Math.floor(Math.random() * possibleAttacks.length)];
}

function turn(playerChosenAttack) {
  // Don't start another turn till the current one is not finished
  if (isTurnHappening) {
    return;
  }
  isTurnHappening = true;

  const didPlayerHit = playerAttack(playerChosenAttack);

  // Update HTML text with the used attack
  turnText.innerText = 'Simões usou ' + playerChosenAttack.name;

  // Update HTML text in case the attack misses
  if (!didPlayerHit) {
    turnText.innerText += ', mas errou!';
  }

  // Wait 2000ms to execute opponent attack (Player attack animation time)
  setTimeout(() => {
    // Randomly chooses opponents attack
    const opponentChosenAttack = chooseOpponentAttack();

    const didOpponentHit = opponentAttack(opponentChosenAttack);

    // Update HTML text with the used attack
    turnText.innerText = 'Mello usou ' + opponentChosenAttack.name;

    // Update HTML text in case the attack misses
    if (!didOpponentHit) {
      turnText.innerText += ', mas errou!';
    }

    // Wait 2000ms to end the turn (Opponent attack animation time)
    setTimeout(() => {
      // Update HTML text for the next turn
      turnText.innerText = 'Escolha um ataque';
      isTurnHappening = false;
    }, 2000);
  }, 2000);
}

// Set buttons click interaction
document.getElementById('arduino-flamejante-button').addEventListener('click', function() {
  turn(playerAttacks.arduinoFlamejante);
});
document.getElementById('raio-bioinspirado-button').addEventListener('click', function() {
  turn(playerAttacks.raioBioinspirado);
});
document.getElementById('tira-tampa-button').addEventListener('click', function() {
  turn(playerAttacks.tiraTampa);
});
document.getElementById('submissao-robotica-button').addEventListener('click', function() {
  turn(playerAttacks.submissaoRobotica);
});
