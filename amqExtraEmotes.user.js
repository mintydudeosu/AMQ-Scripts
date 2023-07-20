// ==UserScript==
// @name                  AMQ Extra Emotes
// @namespace             http://tampermonkey.net/
// @version               0.6
// @updateURL             https://raw.githubusercontent.com/mintydudeosu/AMQ-Scripts/main/amqExtraEmotes.user.js
// @downloadURL           https://raw.githubusercontent.com/mintydudeosu/AMQ-Scripts/main/amqExtraEmotes.user.js
// @description           Adds missing emotes to AMQ, like :handshake:
// @author                MintyDude
// @match                 https://animemusicquiz.com/*
// @icon                  https://www.google.com/s2/favicons?sz=64&domain=animemusicquiz.com
// @grant                 GM_getResourceText
// @require               https://raw.githubusercontent.com/TheJoseph98/AMQ-Scripts/master/common/amqScriptInfo.js
// @resource emoteData    https://raw.githubusercontent.com/joypixels/emoji-toolkit/master/emoji_strategy.json
// ==/UserScript==

// don't execute if on the login page
if(!document.getElementById("gameContainer"))
    return;

// amqScriptInfo stuff
AMQ_addScriptData({
    name: "AMQ Extra Emotes",
    author: "MintyDude",
    description: `
        <p>Adds emote shortcodes currently missing from the dropdown.</p>
        <p>Based off of the <a href="https://github.com/joypixels/emoji-toolkit">JoyPixels</a> library. This script was pretty hastily thrown together so expect problems, but please do report them to me if you encounter anything.</p>
    `
});

// wait for page to fully load (by waiting for video player to appear in html)
// not waiting caused issues sometimes since the game tries accessing emojis while they're still being populated or something
function waitForLoad() {
    if(document.querySelector("*[id^=qpMoePlayer-1]"))
        return scriptsLoaded();
    window.setTimeout(waitForLoad, 500);
}
waitForLoad();

function scriptsLoaded() {
    let rawEmoteData = JSON.parse(GM_getResourceText("emoteData"));

    let NEW_EMOJI_SHORTCODE_MAP = {};

    for(let e in rawEmoteData) {
        let shortname = rawEmoteData[e].shortname;
        for(let i = 0; i < rawEmoteData[e].shortname_alternates.length; i++) {
            // somehow this works pretty well - changes the default name for the shortest name only if the default name includes "ing"
            // does a pretty good job of matching current amq emote names but haven't thoroughly checked everything
            if(rawEmoteData[e].shortname_alternates[i].length < shortname.length && rawEmoteData[e].shortname.includes("ing")) {
                shortname = rawEmoteData[e].shortname_alternates[i];
                //console.log(`${rawEmoteData[e].shortname} -> ${shortname}`);
            }
        }

        // maybe will add support for these in the future - for now i just skip alternate skin tones because they clutter the dropdown
        if(shortname.includes("tone"))
            continue;

        NEW_EMOJI_SHORTCODE_MAP[shortname] = [];

        let ar = rawEmoteData[e].unicode_output.split("-");
        for(let i = 0; i < ar.length; i++)
            NEW_EMOJI_SHORTCODE_MAP[shortname].push(`0x${ar[i]}`);

        //NEW_EMOJI_SHORTCODE_MAP[rawEmoteData[e].shortname] = [e.unicode_output];
    }

    //console.log(NEW_EMOJI_SHORTCODE_MAP);





    // pretty much a direct copy of emojiTranslators.js, overrides the functions to use the new shortcodes etc.
    // there MUST be a better way of doing this but im stupid so /shrug

    translateShortcodeToUnicode = function(text) {
        //console.log("awhdiuawhiuwadh");
        let rawText = text;
        let codeMap = {};
        getShortCodesInMessage(text).forEach((shortcode) => {
            let unicodes = NEW_EMOJI_SHORTCODE_MAP[shortcode];
            let unicodeKey = unicodes.map(entry => entry.toString(16)).join('-');
            codeMap[unicodeKey] = shortcode;
            if(unicodes){
                let unicodeString = "";
                unicodes.forEach((unicode) => {
                    unicodeString += String.fromCodePoint(unicode);
                });
                text = text.replace(new RegExp(shortcode, 'g'), unicodeString);
            }
        });

        getEmojisInMessage(text).forEach(emoji => {
            let shortcode = NEW_EMOJI_TO_NAME_MAP[emoji];
            let unicodeKey = NEW_EMOJI_SHORTCODE_MAP[shortcode].map(entry => entry.toString(16)).join('-');
            codeMap[unicodeKey.replaceAll("0x", "")] = shortcode;
        });

        return {text, codeMap};
    }

    getShortCodesInMessage = function(msg) {
        let shortcodeRegex = /(:[^:]*(?=:))/g;
        let shortcodesFound = {};
        let match;
        do {
            match = shortcodeRegex.exec(msg);
            if (match && NEW_EMOJI_SHORTCODE_MAP[match[1] + ':']) {
                shortcodesFound[match[1] + ':'] = true;
            }
        } while (match);

        return Object.keys(shortcodesFound);
    }

    getEmojisInMessage = function(msg) {
        let emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
        let emojiFound = {};
        let match;
        do {
            match = emojiRegex.exec(msg);
            if (match && NEW_EMOJI_TO_NAME_MAP[match[0]]) {
                emojiFound[match[0]] = true;
            }
        } while (match);

        return Object.keys(emojiFound);
    }

    messageContainsShortcodes = function(msg) {
        return getShortCodesInMessage(msg).length > 0;
    }

    getShortCodeMatchingStart = function(startText) {
        return NEW_EMOJI_SHORTCODE_LIST.filter(code => code.startsWith(startText));
    }

    let NEW_EMOJI_SHORTCODE_LIST = Object.keys(NEW_EMOJI_SHORTCODE_MAP);

    // i had issues with this so i just rewrote it in a probably worse way below, it works so who cares
    /*let NEW_EMOJI_TO_NAME_MAP = Object.keys(NEW_EMOJI_SHORTCODE_MAP).reduce((newMap, name) => {
        console.log(NEW_EMOJI_SHORTCODE_MAP[name]);
	    newMap[String.fromCodePoint(...NEW_EMOJI_SHORTCODE_MAP[name])] = name;
	    return newMap;
    }, {});*/

    let NEW_EMOJI_TO_NAME_MAP = {};
    for(let e in NEW_EMOJI_SHORTCODE_MAP) {
        //console.log(NEW_EMOJI_SHORTCODE_MAP[e]);
        NEW_EMOJI_TO_NAME_MAP[String.fromCodePoint(...NEW_EMOJI_SHORTCODE_MAP[e])] = e;
    }















    // from gameChat.js

    // this is altered to translate shortcode into their actual emoji form before sending messages - otherwise, players without this script would just see the shortcode
    // again, SURELY there's a better way of doing this. really should put some thought into it

    GameChat.prototype.sendMessage = function () {
        let msg = this.$chatInputField.val().trim();
        msg = translateShortcodeToUnicode(msg).text;

        //console.log(msg);

        if (msg != "") {
            if (this.slowModeActive && this.lastMessageCooldown >= new Date().getTime()) {
                this.displaySlowModeMessage("Chat in slowmode");
            } else if (this.slowModeActive && this.messageRepeated(msg)) {
                this.displaySlowModeMessage("Repeated message too soon");
            } else if (this.slowModeActive && xpBar.level < this.MINIMUM_LEVEL_TO_CHAT_IN_SLOW_MODE) {
                this.displaySlowModeMessage("Level 15 required to use ranked chat");
            } else if (
                this.noEmoteMode &&
                (messageContainsShortcodes(msg) || storeWindow.messageContainEmote(msg) || patreon.msgContainsCustomEmoji(msg))
            ) {
                if (msg.match(/\s/g)) {
                    this.displaySlowModeMessage("Emotes disabled doing ranked guessing");
                } else {
                    emojiSelector.lockInEmoteInMsg(msg);
                    this.$chatInputField.val("");
                    this.lastChatCursorPosition = 0;
                    this.displaySlowModeMessage("Emote Locked In");
                }
            } else {
                socket.sendCommand({
                    type: "lobby",
                    command: "game chat message",
                    data: {
                        msg: msg,
                        teamMessage: this.teamChatSwitch.on,
                    },
                });
                this.$chatInputField.val("");
                this.lastChatCursorPosition = 0;

                if (this.slowModeActive) {
                    let now = new Date().getTime();
                    this.$cooldownBar.addClass("active");
                    this.lastMessageCooldown = now + this.CHAT_COOLDOWN_LENGTH;
                    setTimeout(() => {
                        this.$cooldownBar.removeClass("active");
                        this.$cooldownBarContainer.popover("hide");
                    }, this.CHAT_COOLDOWN_LENGTH);

                    this.lastMessageInfo = {
                        msg,
                        cooldownUntil: now + this.SPAM_COOLDOWN,
                    };
                }
            }
        }
    };
}