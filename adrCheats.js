var CheatMain = {
    vars: {
        amountToAdd: 10000,
        amountToHeal: 50000,
        amountOfBaseHP: 999999,
        amountOfBagSpace: 999999,
        amountOfMedsToAdd: 100,
        resources: ['alien alloy', 'bait', 'bullets', 'charm', 'cloth', 'coal', 'compass', 'cured meat', 'energy cell', 'fur', 'iron', 'leather', 'meat', 'medicine', 'scales', 'steel', 'teeth', 'torch', 'wood'],
        weapons: ['bayonet', 'bolas', 'bone spear', 'iron sword', 'steel sword', 'rifle', 'laser rifle', 'grenade'],
        perks: ['barbarian', 'boxer', 'desert rat', 'evasive', 'gastronome', 'martial artist', 'percise', 'scout', 'slow metabolism', 'stealthy', 'unarmed master'],
        automate: {
            stoke: false,
            gather: false,
            check: false
        },
        stokeInterval: null,
        gatherInterval: null,
        trapInterval: null,
        buildTrapInterval: null
    },
    adrStoke: function() {
        if ($SM.get('game.fire.value') == 0) lightButton.click();

        if (!CheatMain.vars.automate.stoke) {
            CheatMain.vars.stokeInterval = setInterval(function() { 
                if ($SM.get('stores.wood') == undefined) {
                    stokeButton.click();
                } else if ($SM.get('stores.wood') > 0) {
                    stokeButton.click();
                }
            }, 100);
            CheatMain.vars.automate.stoke = true;
            Notifications.printMessage('Enabled Auto Fire Stoking');
        } else if (CheatMain.vars.automate.stoke) {
            clearInterval(CheatMain.vars.stokeInterval);
            CheatMain.vars.automate.stoke = false;
            Notifications.printMessage('Disabled Auto Fire Stoking');
        }
    },
    adrGather: function() {
        if ($SM.get('stores.wood') !== undefined) {
            if (!CheatMain.vars.automate.gather) {
                CheatMain.vars.gatherInterval = setInterval(function() { gatherButton.click(); }, 2000);
                CheatMain.vars.automate.gather = true;
                Notifications.printMessage("Enabled Auto Wood Gathering");
            } else if (CheatMain.vars.automate.gather) {
                clearInterval(CheatMain.vars.gatherInterval);
                CheatMain.vars.automate.gather = false;
                Notifications.printMessage("Disabled Auto Wood Gathering");
            }
        } else {
            Events.startEvent({
                title: _('Forest Not Unlocked'),
                scenes: {
                    start: {
                        text: [_('Silent Forest is not unlocked.')],
                        buttons: {
                            'okay': {
                                text: _('Okay'),
                                nextScene: 'end'
                            }
                        }
                    }
                }
            });
        }
    },
    adrCheckTraps: function() {
       if ($SM.get('game.buildings["trap"]', true) > 0) {
            if (!CheatMain.vars.automate.check) {
                CheatMain.vars.trapInterval = setInterval(function() { trapsButton.click(); }, 2000);
                CheatMain.vars.buildTrapInterval = setInterval(function() {
                    while ($SM.get('game.buildings["trap"]', true) == 0) {
                        Notifications.printMessage('No traps found; Building a trap.');
                        build_trap.click();
                    }
                }, 2000);
                CheatMain.vars.automate.check = true;
                Notifications.printMessage('Enabled Auto Trap Checking & Building.');
            } else if (CheatMain.vars.automate.check) {
                clearInterval(CheatMain.vars.trapInterval);
                clearInterval(CheatMain.vars.buildTrapInterval);
                CheatMain.vars.automate.check = false;
                Notifications.printMessage('Disabled Auto Trap Checking & Building.');
            }
       } else {
            Events.startEvent({
                title: _('No Traps'),
                scenes: {
                    start: {
                        text: [_('No traps built.'), _('Please build a trap first.')],
                        buttons: {
                            'okay': {
                                text: _('Okay'),
                                nextScene: 'end'
                            }
                        }
                    }
                }
            });
       }
    },
    adrGiveResources: function() {
        return;
    },
    adrGiveWeapons: function() {
        return;
    },
    adrGiveAllPerks: function() {
        return;
    },
    adrNoWaterOrFood: function() {
        return;
    },
    adrHighHealing: function() {
        return;
    },
    adrLotsOfHP: function() {
        return;
    },
    adrLotsOfStorage: function() {
        return;
    },
    adrAddMeds: function() {
        return;
    },
    adrResetDeathCooldown: function() {
        return;
    },
    buildCheatMenu: function() {
        var cMenu = $('<div>')
            .addClass('cMenu')
            .text('==Cheat Menu== | ')
            .css('text-align', 'center')
            .prependTo('body');
        $("<button>")
            .text(_('Auto Stoke'))
            .css('cursor', 'pointer')
            .click(() => CheatMain.adrStoke())
            .appendTo(cMenu);
        $("<button>")
            .text(_('Auto Gather'))
            .css('cursor', 'pointer')
            .click(() => CheatMain.adrGather())
            .appendTo(cMenu);
        $("<button>")
            .text(_('Auto Check Traps'))
            .css('cursor', 'pointer')
            .click(() => CheatMain.adrCheckTraps())
            .appendTo(cMenu);
        $("<button>")
            .text(_('Give All Resources'))
            .css('cursor', 'pointer')
            .click(() => CheatMain.adrGiveResources())
            .appendTo(cMenu);
        $("<button>")
            .text(_('Give All Perks'))
            .css('cursor', 'pointer')
            .click(() => CheatMain.adrGiveAllPerks())
            .appendTo(cMenu);
        $("<button>")
            .text(_('No Water/Food Use'))
            .css('cursor', 'pointer')
            .click(() => CheatMain.adrNoWaterOrFood())
            .appendTo(cMenu);
        $("<button>")
            .text(_('More Health from Food/Meds'))
            .css('cursor', 'pointer')
            .click(() => CheatMain.adrHighHealing())
            .appendTo(cMenu);
        $("<button>")
            .text(_('More Base HP'))
            .css('cursor', 'pointer')
            .click(() => CheatMain.adrLotsOfHP())
            .appendTo(cMenu);
        $("<button>")
            .text(_('More Base Bag Space'))
            .css('cursor', 'pointer')
            .click(() => CheatMain.adrLotsOfStorage())
            .appendTo(cMenu);
        $("<button>")
            .text(_('Reset Death Cooldown'))
            .css('cursor', 'pointer')
            .click(() => CheatMain.adrResetDeathCooldown())
            .appendTo(cMenu);
    }
}


if (document.readyState !== 'loading') {
    setTimeout(CheatMain.buildCheatMenu, 0);
} else {
    window.addEventListener("DOMContentLoaded", function () {
        setTimeout(CheatMain.buildCheatMenu, 0);
    });
}