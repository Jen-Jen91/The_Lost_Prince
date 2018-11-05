const PubSub = require('../helpers/pub_sub.js');
const Player = require('../models/player_model.js');

const TextView = function(container){
  this.container = container;
};

TextView.prototype.bindEvents = function(){
  PubSub.subscribe('RoomGenerated:room-created',(evt)=>{
    this.container.innerHTML = "";

    // Assign Variables for the room
    const exitLeft = evt.detail.exit_left;
    // console.log('left: ',exitLeft);
    const exitRight = evt.detail.exit_right;
    // console.log('right: ',exitRight);
    const exitForward = evt.detail.exit_forward;
    // console.log('Forward: ',exitForward);
    const content = evt.detail.content;
    // Organise the exits into a fancy style
    var exits = 'Exits: ';
    const leftNavButton = document.getElementById('nav-left-btn');
    const rightNavButton = document.getElementById('nav-right-btn');
    const forwardNavButton = document.getElementById('nav-forward-btn');


    if (exitLeft == 1){
      exits += 'LEFT ';
      leftNavButton.disabled=false;
      leftNavButton.setAttribute('class','navigate btn btn-lg');
    } else {
      leftNavButton.disabled=true;
      leftNavButton.setAttribute('class','btn-disabled navigate btn btn-lg');
    };
    if (exitRight == 1){
      exits += 'RIGHT ';
      rightNavButton.disabled=false;
      rightNavButton.setAttribute('class','navigate btn btn-lg');
    } else {
      rightNavButton.disabled=true;
      rightNavButton.setAttribute('class','btn-disabled navigate btn btn-lg');
    };
    if (exitForward == 1){
      exits += 'FORWARD ';
      forwardNavButton.disabled=false;
      forwardNavButton.setAttribute('class','navigate btn btn-lg');
    } else {
      forwardNavButton.disabled=true;
      forwardNavButton.setAttribute('class','btn-disabled navigate btn btn-lg');
    };

    // Describe the room
    var room_details = '+ Room Description Placeholder +';

    // Fancy up the room contents
    var content_result = '';
    var playerHP = 100;
    var roomDescription = '';
    switch(content){
      case 'health':
        content_result = 'You have found a Health Pack!';
        // Run function to add 1 to health packs
        roomDescription = document.createElement('p');
        roomDescription.textContent = `${room_details} ${content_result} ${exits}.`;
        this.container.appendChild(roomDescription);
        break;
      case 'upgrade':
        content_result = 'You have found a Weapon Upgrade! (Attack + 1)';
        // run function to increase attack
        PubSub.publish('GameEvent:weapon-upgrade');

        roomDescription = document.createElement('p');
        roomDescription.textContent = `${room_details} ${content_result} ${exits}.`;
        this.container.appendChild(roomDescription);
        break;
      case 'trap':
        console.log('Trap Room');
        PubSub.publish('GameEvent:trap-triggered');
        PubSub.subscribe('GameEvent:trap-ready',(evt)=>{
          this.container.innerHTML = "";
          const trap = evt.detail.trap;
          const trapDamage = evt.detail.damage;

          roomDescription = document.createElement('p');
          roomDescription.textContent = `${room_details} ${trap} It hurts you for ${trapDamage}HP! ${exits}.`;
          this.container.appendChild(roomDescription);
        });
        break;
      case 'monster':
        // generate a monster!
        // console.log('YOU ARE HERE');
        PubSub.publish('Monster:monster-choice');
        PubSub.subscribe('Monster:monster-ready',(evt)=>{
          this.container.innerHTML = "";
          // console.log('MONSTER: ',evt.detail.name);
          const name = evt.detail.name;
          const attack = evt.detail.attack;
          var monsterHP = evt.detail.hp;
          const rating = evt.detail.rating;
          const size = evt.detail.size;
          const type = evt.detail.type;

          // Display your chances of beating the monster
          var fight_chance = '';
          if (playerHP < monsterHP){
            fight_chance = `The ${name} looks very tough...`;
          } else if (playerHP > monsterHP){
            fight_chance = `The ${name} looks weak...`;
          } else {
            fight_chance = `The ${name} looks like you could take it...`;
          };



          content_result = `You have stumbled upon a monster... The ${name} is a ${size} ${type}. ${fight_chance}`
          // console.log(`You have stumbled upon a monster... The ${name} is a ${size} ${type}. ${fight_chance}`);
          roomDescription = document.createElement('p');
          roomDescription.textContent = `${room_details} ${content_result} ${exits}.`;
          this.container.appendChild(roomDescription);

        });
        break;
    }

    // console.log('container: ',this.container);

    // console.log('Room Display: ',evt.detail)
  });
};

module.exports = TextView;