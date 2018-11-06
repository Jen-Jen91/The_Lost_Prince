const PubSub = require('../helpers/pub_sub.js');
const Player = require('./player_model.js');
const TextView = require('../views/text_view.js');

const Fight = function () {
  this.player = new Player;
};



Fight.prototype.roll = function(){
  return Math.floor(Math.random()*10)+1;
}


Fight.prototype.playerAttack = function (monster){
  //monster declaration
  const monsterName = monster.name;
  const monsterAttack = monster.attack;
  let monsterHp = monster.hp;
  let yourResult = '';

  //Dice Roll Values Per Attack
  const playerAtk = this.player.getAttackHtml();
  const playerRoll = this.roll() + playerAtk;
  const enemyRoll = this.roll() + monsterAttack;

  //Damage for monster
  let monsterDamage = playerRoll - enemyRoll;
  this.updateMonsterHp(this.getMonsteHp() - monsterDamage);
  //Result declaration
  let yourResult = '';
  //Deciding attack outCome Player Attack

  if (playerRoll == enemyRoll){
    yourResult = `You attacked the ${monsterName}. It parried!`;
  } else if (playerRoll < enemyRoll){
    yourResult = `You attacked the ${monsterName}. You rolled [${playerRoll}] and it rolled [${enemyRoll}]. You failed to hurt it.`
  } else {
    var fightDamage = playerRoll - enemyRoll;
    monsterHp -= fightDamage;
    yourResult = `You attacked the ${monsterName}. You rolled [${playerRoll}] and it rolled [${enemyRoll}]. It took ${monsterDamage} Damage! Monster Hp:${this.getMonsteHp()}`;
  };

  const newMonster = {
    name: monster.name,
    attack: monster.attack,
    hp: monster.hp
  }

  return yourResult;

};

Fight.prototype.monsterAttack = function (monster) {
  //monster declaration

  const monsterName = monster.name;
  const monsterAttack = monster.attack;

  //Dice Roll Values Per Attack

  const playerAtk = this.player.getAttackHtml();
  var playerRoll = this.roll() + playerAtk;
  var enemyRoll = this.roll() + monsterAttack;


  var revengeResult = '';
  var fightDamage = 0;

  if (enemyRoll == playerRoll){
    revengeResult = `The ${monsterName} attacked you, but you parried!`;
  } else if (enemyRoll > playerRoll){
    fightDamage = enemyRoll - playerRoll;
    revengeResult = `The ${monsterName} attacked you. It rolled [${enemyRoll}] and you rolled [${playerRoll}]. You take ${fightDamage} Damage!`;
    // Update player HP
    var newPlayerHp = this.player.getHpHtml() - fightDamage;
    this.player.updateHp(newPlayerHp);

  } else {
    revengeResult = `The ${monsterName} attacked you. It rolled [${enemyRoll}] and you rolled [${playerRoll}]. It failed to hurt you physically, but emotionally you are devastated.`
  }
  //
  // if (monsterHp <= 0){
  //   var additional = `The ${monsterName} is dead.`;
  //   this.enableNavigation();
  //   return `${theirResult} ${additional}`;
  // } else {
  //   return theirResult;
  // }
  return revengeResult;
}

Fight.prototype.startFight = function (monster) {

  let newMonster = Fight.playerAttack(monster);

  if (newMonster.hp > 0){
     Fight.monsterAttack(monster)
  };

  return newMonster;

}

Fight.prototype.sendMonster = function(monsterInfo){
  PubSub.subscribe('Fight:attack-clicked',(baddie)=>{

    var yourAttack = this.playerAttack(monsterInfo);
    var theirAttack = this.monsterAttack(monsterInfo);

    this.printStuff(yourAttack,theirAttack);
  });

  // set up run function
  PubSub.subscribe('Fight:run-clicked',(baddie)=>{
    // console.log('RUNNING AWAY FROM: ',monsterInfo.name);
    // this.run(evt.detail);
  });
};

Fight.prototype.printStuff = function(yourInput,theirInput){
  const target = document.querySelector('div#text-display');
  target.innerHTML = "";

  yourAttack = document.createElement('p');
  yourAttack.textContent = yourInput;
  target.appendChild(yourAttack);

  theirAttack = document.createElement('p');
  theirAttack.textContent = theirInput;
  target.appendChild(theirAttack);
}

Fight.prototype.enableNavigation = function(){
  const leftNavButton = document.getElementById('nav-left-btn');
  const rightNavButton = document.getElementById('nav-right-btn');
  const forwardNavButton = document.getElementById('nav-forward-btn');
  const attackButton = document.getElementById('nav-attack-btn');
  const defendButton = document.getElementById('nav-defend-btn');
  const runButton = document.getElementById('nav-run-btn');

  leftNavButton.disabled = false;
  leftNavButton.setAttribute('class','navigate btn btn-lg btn-block');
  rightNavButton.disabled = false;
  rightNavButton.setAttribute('class','navigate btn btn-lg btn-block');
  forwardNavButton.disabled = false;
  forwardNavButton.setAttribute('class','navigate btn btn-lg btn-block');

  attackButton.disabled = true;
  attackButton.setAttribute('class','btn-disabled btn-block navigate btn btn-lg');
  defendButton.disabled = true;
  defendButton.setAttribute('class','btn-disabled btn-block navigate btn btn-lg');
  runButton.disabled = true;
  runButton.setAttribute('class','btn-disabled btn-block navigate btn btn-lg');
};

Fight.prototype.updateMonsterBar = function(hp){
  var healthBar = document.getElementById('monster-hp-bar');
  healthBar.textContent = `${hp} HP`;
  healthBar.setAttribute('style',`width:${hp}%`);
}

Fight.prototype.updateMonsterHp = function(amount){
  const monsterhtml = document.querySelector('#monsterHp')
  monsterhtml.value = amount
}

Fight.prototype.getMonsteHp = function(){
  const monsterhtml = document.querySelector('#monsterHp')
  return monsterhtml.value
}




module.exports = Fight
