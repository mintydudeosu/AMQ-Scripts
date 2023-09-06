// ==UserScript==
// @name         AMQ Fastest Guesser
// @namespace    http://tampermonkey.net/
// @version      0.2
// @updateURL    https://raw.githubusercontent.com/mintydudeosu/AMQ-Scripts/main/amqFastestGuesser.user.js
// @downloadURL  https://raw.githubusercontent.com/mintydudeosu/AMQ-Scripts/main/amqFastestGuesser.user.js
// @description  An extension to Joseph's Song List UI which displays the fastest guesser within the song info window
// @author       MintyDude
// @match        https://animemusicquiz.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=animemusicquiz.com
// @grant        none
// ==/UserScript==

window.setTimeout(() => {

    if(!document.getElementById("listWindowBody")) {
        console.log("No Song List UI script");
        return;
    }

    let songInfoPanel = document.getElementById("infoWindow").getElementsByClassName("customWindowPanel")[0];

    let infoWindowObserver = new MutationObserver(() => {
        infoWindowObserver.disconnect();
        //console.log("mutation observed");

        let guessers = document.getElementById("guessedContainer").getElementsByTagName("li");
        //console.log(guessers);
        let fastestGuesser = {
            names: [],
            time: 999999999
        };

        for(let i = 0; i < guessers.length; i++) {
            let guessTime = parseInt(guessers[i].innerHTML.split(", ")[1].slice(0, -3));
            if(guessTime < fastestGuesser.time) {
                fastestGuesser.names = [guessers[i].innerHTML.split(" (")[0]];
                fastestGuesser.time = guessTime;
            } else if(guessTime == fastestGuesser.time) {
                fastestGuesser.names.push(guessers[i].innerHTML.split(" (")[0]);
            }
        }

        if(guessers.length > 0) {
            let fastestGuesserRow = document.createElement("div");
            fastestGuesserRow.classList.add("infoRow");
            fastestGuesserRow.innerHTML = `
                <div style="width: 100%;">
                    <h5><b>Fastest Guesser</b></h5>
                </div>
            `;

            for(let i = 0; i < fastestGuesser.names.length; i++)
                fastestGuesserRow.children[0].innerHTML += `${fastestGuesser.names[i]} (${fastestGuesser.time}ms)\n`;

            songInfoPanel.insertBefore(fastestGuesserRow, songInfoPanel.lastChild);
        }

        infoWindowObserver.observe(songInfoPanel, {childList: true});
    });

    infoWindowObserver.observe(songInfoPanel, {childList: true});
    //console.log("it's observing time");


// yes this is how im waiting for the other script to load, hopefully no one has a load time longer than 5 seconds! :DDD
}, 5000);



