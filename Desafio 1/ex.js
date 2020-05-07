class Fighter {
  constructor(name, type, totalHp, hpElement, attacks, weaknesses, weaknessIndex, main) {
    this.name = name;
    this.type = type;
    this.stage = 0;
    this.frozen = 0;
    this.totalHp = totalHp;
    this.hp = totalHp;
    this.hpElement = hpElement;
    this.attacks = attacks;
    this.weaknesses = weaknesses;
    this.weaknessIndex = weaknessIndex;
    this.main = main;
    this.opponent = null;
  }

  set name(newName) {
    this._name = newName;
  }

  set versus(opponent) {
    this.opponent = opponent;
  }

  set hp(newHP) {
    // Prevents the HP to go off boundaries
    this._hp = Math.max(newHP, 0);
    this._hp = Math.min(this.hp, this.totalHp);
  
    // If player health is equal 0 opponent wins
    setTimeout(() => {
      if (this._hp === 0) {
        if ((this.main && !stageTransition) || (!this.main && this.stage == 1)) {
          gameOver(this.opponent);
        } else if (this.stage == 0) {
          stageTransition = true;
          nextStage();
        }
      }
    }, 1000);
    // Update the player hp bar
    const barWidth = (this._hp / this.totalHp) * 100;
    this.updateHealthBar(barWidth);
  }

  set hpElement(newHpElement) {
    this._hpElement = newHpElement;
  }

  set freeze(rounds) {
    this.frozen = rounds;
  }

  set totalHp(newHP) {
    this._totalHp = newHP;
  }

  get name() {
    return this._name;
  }

  get versus() {
    return this.opponent;
  }

  get hpElement() {
    return this._hpElement;
  }

  get hp() {
    return this._hp;
  }

  get totalHp() {
    return this._totalHp;
  }

  get frozenRounds() {
    return this.frozen;
  }

  updateHealthBar(barWidth) {
    if (this.hpElement !== undefined)
      this.hpElement.style.width = barWidth + '%';
  }

  // check if fighter is frozen
  isFrozen() {
    return this.frozen > 0;
  }

  // reduce frozen rounds every player turn
  defrost() {
    this.frozen--;
  }

  // evolve fighter to next level
  evolve() {
    this.stage++;
  }

  // check if attack is fighter's weakness
  isWeakness(attack) {
    this.weaknesses.forEach((w) => {
      if (w.fighter == this.type && w.attack == attack.type)
        return 1;
    })
    return 0;
  }

  // Check if attacks misses
  willAttackMiss (accuracy) {
    if (accuracy)
      return Math.floor(Math.random() * 100) > accuracy;
    return 0;
  }

  attack(attack) {
    // 0: return false if attack misses
    // 1: otherwise update opponents health and return true
    
    // if attack misses, end turn
    if (this.willAttackMiss(attack.accuracy))
      return 0;
    if (this.willAttackMiss(attack.freezingAccuracy)) {
      this.opponent.freeze = 2;
      this.opponent.hpElement.style.backgroundColor = "var(--blue)";
    }
    
    if (attack.type == 'healing')
      this.hp = this.hp + attack.healing;
    else {
      // check if attack type is opponent's weakness
      let { type: opponentType, stage: opponentStage } = this.opponent,
          multiplyer = 1 + (this.weaknessIndex * this.isWeakness(attack));
      
      // update opponent's health
      this.opponent.hp = this.opponent.hp - attack.power * multiplyer;
    }
    return 1;
  }

  // append a new attack to fighter
  appendAttack(callable, stats) {
    this.attacks[callable] = stats;
  }
}

const turnText = document.getElementById('text');
let isTurnHappening = false;
let stageTransition = false;

const playerAttacks = {
  arduinoFlamejante: {
    power: 40,
    accuracy: 100,
    name: 'Arduíno Flamejante',
    type: 'electric',
  },
  raioBioinspirado: {
    power: 80,
    accuracy: 80,
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
    power: 60,
    accuracy: 80,
    name: 'Submissão Robótica',
    type: 'fighting',
    freezingAccuracy: 60
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

const playerWeaknesses = [
  {
    fighter: 'human',
    attack: 'electric'
  }
]

const opponentWeaknesses = [
  {
    fighter: 'assembly',
    attack: 'pointer'
  }
]

let player;
let opponent;

// wait until DOM is loaded to catch health bar element
document.addEventListener("DOMContentLoaded", function(event) { 
  player = new Fighter('Simões', ['human', 'assembly'], 280, document.getElementById('player-health'), playerAttacks, playerWeaknesses, 0.25, true);
  opponent = new Fighter('Mello', ['human', 'gcc'], 380, document.getElementById('opponent-health'), opponentAttacks, opponentWeaknesses, 0.075, false);
  
  player.versus = opponent;
  opponent.versus = player;
});

function gameOver (winner) {
  // Wait 1000 (Health loss animation)
  setTimeout(() => {
    // Update HTML text with the winner
    turnText.innerText = winner.name + ' vence!';
    // Open alert with the winner
    alert(winner.name + ' é o vencedor! Feche este alerta para jogar novamente');
    // Reload the game
    window.location.reload();
  }, 1000);
}

// load next stage
function nextStage () {
  setTimeout(() => {
    alert("Prepare-se para a fase final!");
    opponent.hpElement.style.backgroundColor = "var(--green)"
    document.getElementById("mello-sprite").src = "assets/mello_evolved.png"
    document.getElementById("simoes-sprite").src = "assets/simoes_evolved.png"
    document.getElementById("fight").style.backgroundImage = "url('/assets/icmc_evolved.jpg')"
    for (let i = 0; i <= 1; ++i)
      document.getElementsByClassName("grass")[i].style.backgroundColor = "var(--red)"

    setTimeout(() => {
      player.evolve();
      opponent.evolve();

      player.totalHp = player.totalHp * 2;
      player.hp = player.totalHp;
      opponent.totalHp = opponent.totalHp * 2.75;
      opponent.hp = opponent.totalHp;

      player.appendAttack('restauracaoSistematica', { power: 0, accuracy: 65, healing: 80, name: 'Restauração Sistemática', type: 'healing' })
      player.appendAttack('fonteOnipotente', { power: 220, accuracy: 35, name: 'Fonte Onipotente', type: 'electric'})
      opponent.appendAttack('curaValgrindiana', { power: 0, accuracy: 50, healing: 70, name: 'Cura Valgrindiana', type: 'healing'})
      opponent.appendAttack('sudoKillall', { power: 220, accuracy: 30, name: 'sudo killall', type: 'purge'})

      document.getElementsByClassName("row-evolve")[0].style.display = "flex";
    }, 1000)
    stageTransition = false;
  }, 1000);
}

function chooseOpponentAttack () {
  // Put all opponents attacks in a array
  const possibleAttacks = Object.values(opponent.attacks);

  // Randomly chooses one attack from the array
  return possibleAttacks[Math.floor(Math.random() * possibleAttacks.length)];
}

function turn(playerChosenAttack) {
  // Don't start another turn till the current one is not finished
  if (isTurnHappening) {
    return;
  }
  isTurnHappening = true;

  const didPlayerHit = player.attack(playerChosenAttack);

  // Update HTML text with the used attack
  turnText.innerText = player.name + ' usou ' + playerChosenAttack.name;

  // if opponent just got frozen, update HTML text
  if (opponent.frozenRounds == 2){
    turnText.innerText += ' e incapacitou ' + opponent.name + ' por 2 rodadas!'
  }

  // Update HTML text in case the attack misses
  if (!didPlayerHit) {
    turnText.innerText += ', mas errou!';
  }

  // Wait 2000ms to execute opponent attack (Player attack animation time)
  let opponentTurn = opponent.isFrozen() ? 0 : 2500;

  setTimeout(() => {
    // Randomly chooses opponents attack
    const opponentChosenAttack = chooseOpponentAttack();

    if (!opponent.isFrozen()) {
      opponent.hpElement.style.backgroundColor = "var(--green)"
      const didOpponentHit = opponent.attack(opponentChosenAttack);

      // Update HTML text with the used attack
      turnText.innerText = opponent.name + ' usou ' + opponentChosenAttack.name;

      // Update HTML text in case the attack misses
      if (!didOpponentHit) {
        turnText.innerText += ', mas errou!';
      }
    } else {
      opponent.defrost(); // reduce current frozen rounds
    }

    // Wait 2000ms to end the turn (Opponent attack animation time)    
    setTimeout(() => {
      // Update HTML text for the next turn
      turnText.innerText = 'Escolha um ataque';
      isTurnHappening = false;
    }, 2000);
  }, opponentTurn);
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
document.getElementById('restauracao-sistematica-button').addEventListener('click', function() {
  turn(playerAttacks.restauracaoSistematica);
});
document.getElementById('fonte-onipotente-button').addEventListener('click', function() {
  turn(playerAttacks.fonteOnipotente);
});