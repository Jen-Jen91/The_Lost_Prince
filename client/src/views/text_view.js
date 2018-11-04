const PubSub = require('../helpers/pub_sub.js');
const PlayerView = require('./player_view.js')

const TextView = function(container){
  this.container = container;
};

player = new PlayerView;
var counter = 0
TextView.prototype.bindEvents = function(){
  PubSub.subscribe(`RoomGenerated:room-created${counter}`,(evt)=>{
    counter += 1
    console.log(counter,'textView');
    this.container.innerHTML = "";

    // Assign Variables for the room
    const exitLeft = evt.detail.exit_left;

    const exitRight = evt.detail.exit_right;

    const exitForward = evt.detail.exit_forward;

    const content = evt.detail.content;

    PubSub.publish('TextView:room-content',content);

    // Organise the exits into a fancy style
    var exits = 'Exits: ';
    if (exitLeft == 1){exits += 'LEFT '};
    if (exitRight == 1){exits += 'RIGHT '};
    if (exitForward == 1){exits += 'FORWARD '};
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
        roomDescription = document.createElement('p');
        roomDescription.textContent = `${room_details} ${content_result} ${exits}.`;
        this.container.appendChild(roomDescription);
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
