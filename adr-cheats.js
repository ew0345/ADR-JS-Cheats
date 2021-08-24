// ==UserScript==
// @name ADR Cheats
// @namespace ew0345
// @author Ew0345
// @description Javascript based cheats for A Dark Room
// @version 2.4
// @homepage https://youtube.com/user/ew0345
// @icon https://i.imgur.com/iRck696.png
// @match http://adarkroom.doublespeakgames.com/
// @match http://doublespeakgames.github.io/adarkroom/
// @grant none
// ==/UserScript==

/* 
* Game Link: http://adarkroom.doublespeakgames.com/
*
* Updates:
*   1.1 - Added additional resources (weren't in my original js that I used to make this)
*   1.2 - Made Auto Stoke/Gather/Check into individual keybinds
*   1.3 - Changed $SM.set to $SM.add so that it adds the resources/weapons instead of just setting them
*   1.4 - Changed from If Statements to switch statements
*   1.5 - Added: No Food/Water Consumption, Cured Meat/Medicine heals 50k, 999,999,999 HP, 999,999 Weight (Rucksack space), Add 100 Cured Meat & Medicine to current amount in rucksack, and reset embark timer.
*   1.6 - Added notification message in the games notifications for enabling cheats, made things a bit more modular, and also added Userscript stuff
*   2.0 - Added a cheat menu with buttons for the cheats. Keybinds still work in place of them if you don't want to use it
*   2.1 - Put the stuff being appended into it's own function as well as changed the buttons to be append through an array and a for-statement
*   2.2 - Added some checking to Stoke, Gather and Check which should stop any errors from not having things unlocked.
*   2.3 - Auto Stoke/Light, Gather and Check are now toggles. Activating it once will enabled it and activating it again will disable it.
*   2.4 - Minor change to how buttons are created. This won't affect the user at all, just for the sake slightly condensing the code.
*
* Keycode List:
*   Numpad 0 - 9: 96-105
*   Numpad *: 106
*   Numpad +: 107
*   Numpad -: 109
*   Numpad .: 110
*   Numpad /: 111
*
* Additional Note: Change 'var amount' to the amount of resource you want. For max amount you can use $SM.MAX_STORE as the amount.
* Bug: Doesn't seem to add beyond the initial added amount for some resources and weapons. Not sure why.
* Bug: Interface doesn't update when setting HP, Rucksack space, adding things to rucksack etc until you do something to update the interface.
*/
alert ('Welcome to ADR Cheats - Open console for info');
function ListOfKeys() {
    Notifications.printMessage('Open browser console to view keybinds');
    console.log('Keylist:\n'
        +'  Numpad 0 - Auto Stoke Fire\n'
        +'  Numpad 1 - Auto Gather Wood\n'
        +'  Numpad 2 - Auto Check Trap\n'
        +'  Numpad 3 - 10,000 of all resources\n'
        +'  Numpad 4 - 10,000 of all weapons\n'
        +'  Numpad 5 - All Perks\n'
        +'  Numpad 6 - No Water/Food Consumption on movement\n'
        +'  Numpad 7 - Cured Meat/Medicine Heals 50,000 HP\n'
        +'  Numpad 8 - Sets Base HP (Before Armor) to 999,999,999 and heals you to your max health (BASE_HEALTH + HP From Armor) (Heal does not work in combat)\n'
        +'  Numpad 9 - Sets rucksack space to 999,999\n'
        +'  Numpad * - Adds 100 to current medicine and cured meat in rucksack while exploring\n'
        +'  Numpad + - Reset embark timer so you can instantly embark again\n'
        +'  Numpad . - This Message\n\n'
        +'Anything that updates the interface while out in the world will not update the interface until you have moved or casued another interface to open up.');
}

var amount = 10000;
var resources = ['alien alloy', 'bait', 'bullets', 'charm', 'cloth', 'coal', 'compass', 'cured meat', 'energy cell', 'fur', 'iron', 'leather', 'meat', 'medicine', 'scales', 'steel', 'teeth', 'torch', 'wood'];
var weapons = ['bayonet', 'bolas', 'bone spear', 'iron sword', 'steel sword', 'rifle', 'laser rifle', 'grenade'];
var perks = ['barbarian', 'boxer', 'desert rat', 'evasive', 'gastronome', 'martial artist', 'percise', 'scout', 'slow metabolism', 'stealthy', 'unarmed master'];
var heal = 50000;
var basehp = 999999;
var bagspace = 999999;
var medsamount = 100;

var automate = [false, false, false];
var stokeInterval, gatherInterval, trapInterval, buildtrapInterval;

var cm = document.createElement('div');
var bar = document.createElement('hr');
var bar2 = document.createElement('hr');

var buttons = [];

for (var i = 0; i < 11; i++) {
    buttons[i] = document.createElement('button');
}


cm.innerHTML = "--Cheat Menu-- ";
cm.id = "cm";
cm.style="text-align: center;"

buttons[0].innerHTML = "Auto Stoke";
buttons[0].style = "cursor: pointer;";
buttons[0].addEventListener('click', ADR_Stoke);

buttons[1].innerHTML = "Auto Gather";
buttons[1].style = "cursor: pointer;";
buttons[1].addEventListener('click', ADR_Gather);

buttons[2].innerHTML = "Auto Check";
buttons[2].style = "cursor: pointer;";
buttons[2].addEventListener('click', ADR_Check);

buttons[3].innerHTML = "Resources";
buttons[3].style = "cursor: pointer;";
buttons[3].addEventListener('click', ADR_Resources);

buttons[4].innerHTML = "Weapons";
buttons[4].style = "cursor: pointer;";
buttons[4].addEventListener('click', ADR_Weapons);

buttons[5].innerHTML = "All Perks";
buttons[5].style = "cursor: pointer;";
buttons[5].addEventListener('click', ADR_AllPerks);

buttons[6].innerHTML = "No Water/Food Use";
buttons[6].style = "cursor: pointer;";
buttons[6].addEventListener('click', ADR_NoWaterFood);

buttons[7].innerHTML = "More Health from Food/Meds";
buttons[7].style = "cursor: pointer;";
buttons[7].addEventListener('click', ADR_HighHealing);

buttons[8].innerHTML = "More Base HP";
buttons[8].style = "cursor: pointer;";
buttons[8].addEventListener('click', ADR_LotsOfHP);

buttons[9].innerHTML = "More Base Bag Space";
buttons[9].style = "cursor: pointer;";
buttons[9].addEventListener('click', ADR_Storage);

buttons[10].innerHTML = "Reset Death Cooldown";
buttons[10].style = "cursor: pointer;";
buttons[10].addEventListener('click', ADR_DeathCooldown);

function ADR_Stoke() {
    if ($SM.get('game.fire.value') == 0) {
      lightButton.click();
    }
    
    if (automate[0] == false) {
        stokeInterval = setInterval(function() { stokeButton.click(); }, 100);
        automate[0] = true;
        Notifications.printMessage('Enabled Auto Fire Stoking');
    } else if (automate[0] == true) {
        clearInterval(stokeInterval);
        automate[0] = false;
        Notifications.printMessage('Disabled Auto Fire Stoking');
    }

   
}

function ADR_Gather() {
    if ($SM.get('stores.wood') != undefined) {
        if (automate[1] == false) {
            gatherInterval = setInterval(function () { gatherButton.click(); }, 2000);
            automate[1] = true;
            Notifications.printMessage('Enabled Auto Wood Gathering');
        } else if (automate[1] == true) {
            clearInterval(gatherInterval);
            automate[1] = false;
            Notifications.printMessage('Disabled Auto Wood Gathering');
        }
    } else if ($SM.get('stores.wood') == undefined) {
      Notifications.printMessage('You have not unlocked the ability to gather wood yet.');
    }
}

function ADR_Check() {
    if ($SM.get('game.buildings["trap"]', true) > 0) {
        if (automate[2] == false) {
            trapInterval = setInterval(function() { trapsButton.click(); }, 2000);
            buildtrapInterval = setInterval(function() {
                while ($SM.get('game.buildings["trap"]', true) == 0) {
                    Notifications.printMessage('No traps found; Building trap.');
                    build_trap.click();
                }
            }, 2000);
            automate[2] = true;
            Notifications.printMessage('Enabled Auto Trap Checking & Building');
        } else if (automate[3] == true) {
            clearInterval(trapInterval);
            clearInterval(buildtrapInterval);
            automate[3] = false;
            Notifications.printMessage('Disabled Auto Trap Checking & Building');
        }
    }
    if ($SM.get('game.buildings["trap"]', true) == 0 || $SM.get('game.buildings["trap"]', true) == undefined) {
      Notifications.printMessage('No traps built. Please build a trap first.');
    }
}

function ADR_Resources() {
    for (var i=0; i < resources.length; i++) {
        $SM.add('stores.'+resources[i]+'', amount);
        $SM.set('stores.compass', 1);
    }

    Notifications.printMessage('Gave '+amount+' resouces');
}

function ADR_Weapons() {
    for (var i=0; i < weapons.length; i++) {
        $SM.add('stores.'+weapons[i]+'', amount);
    }

    Notifications.printMessage('Gave '+amount+' weapons');
}

function ADR_AllPerks() {
    for (var i=0; i < perks.length; i++) {
        $SM.set('character.perks["'+perks[i]+'"]', true);
    }

    Notifications.printMessage('Gave all perks');
}

function ADR_NoWaterFood() {
    World.MOVES_PER_FOOD = $SM.MAX_STORE;
    World.MOVES_PER_WATER = $SM.MAX_STORE;

    Notifications.printMessage('Moves per food and water set to: '+$SM.MAX_STORE);
}
function ADR_HighHealing() {
    World.MEAT_HEAL = heal;
    World.MEDS_HEAL = heal;

    Notifications.printMessage('Cured Meat and Medicine now heal '+heal+' hp');
}

function ADR_LotsOfHP() {
    World.BASE_HEALTH = basehp;
    World.health = World.getMaxHealth();

    Notifications.printMessage('Base Health set to: '+basehp);
}

function ADR_Storage() {
    Path.DEFAULT_BAG_SPACE = bagspace;

    Notifications.printMessage('Default bag space set to: '+bagspace);
}

function ADR_AddMeatMeds() {
    Path.outfit["cured meat"] = medsamount;
    Path.outfit["medicine"] = medsamount;

    Notifications.printMessage('Added '+medsamount+' of Cured Meat and Medicine to rucksack');
}

function ADR_DeathCooldown() {
    Button.clearCooldown($('#embarkButton'));

    Notifications.printMessage('Embark button cooldown reset');
}

window.onkeydown = function (e) {
    switch (e.keyCode) {
        case 96:
            ADR_Stoke();
            break;
        case 97:
            ADR_Gather();
            break;
        case 98:
            ADR_Check()
            break;
        case 99:
            ADR_Resources();
            break;
        case 100:
            ADR_Weapons();
            break;
        case 101:
            ADR_AllPerks();
            break;
        case 102:
            ADR_NoWaterFood();
            break;
        case 103:
            ADR_HighHealing();
            break;
        case 104:
            ADR_LotsOfHP();
            break;
        case 105:
            ADR_Storage();
            break;
        case 106:
            ADR_AddMeatMeds();
            break;
        case 107:
            ADR_DeathCooldown();
            break;
        case 110:
            ListOfKeys();
            break;
        default: break;
    }
};

function appendStuff() {
    $('body').prepend(cm);

    for (var i = 0; i < buttons.length; i++) {
        $('#cm').append(buttons[i]);
    }

    $('#cm').append(bar);
    $('body').prepend(bar2);
}

ListOfKeys();
appendStuff();
