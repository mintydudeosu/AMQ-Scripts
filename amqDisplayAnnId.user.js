// ==UserScript==
// @name         AMQ Display ANNID
// @namespace    http://tampermonkey.net/
// @version      1.0
// @updateURL    https://raw.githubusercontent.com/mintydudeosu/AMQ-Scripts/main/amqDisplayAnnId.user.js
// @downloadURL  https://raw.githubusercontent.com/mintydudeosu/AMQ-Scripts/main/amqDisplayAnnId.user.js
// @description  Displays ANNIDs (and fake ones) for shows in the More Info section in the Song Library
// @author       MintyDude
// @match        https://animemusicquiz.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=animemusicquiz.com
// @grant        none
// ==/UserScript==

if(!document.getElementById("gameContainer"))
    return;

function waitForLoad() {
    if(document.getElementById("loadingScreen") && document.getElementById("loadingScreen").classList.contains("hidden"))
        return scriptsLoaded();
    window.setTimeout(waitForLoad, 1000);
}
waitForLoad();

function scriptsLoaded() {
    let entryContainers = document.getElementsByClassName("elEntryContainer");
    for(let i = 0; i < entryContainers.length; i++) {
        let mutationObserver = new MutationObserver((mutationList, observer) => {
            observer.disconnect();
            let openInfos = entryContainers[i].getElementsByClassName("elAnimeEntryExtraInfo open");
            for(let j = 0; j < openInfos.length; j++) {
                if(!openInfos[j].getElementsByClassName("elAnnId").length) {
                    let labelRow = document.createElement("div");
                    labelRow.classList.add("elFlexRow", "elFlexRowNoMargin");
                    labelRow.innerHTML = `<div class="elLabel">ANNID</div>`;
                    openInfos[j].getElementsByClassName("elFlexColumn")[0].appendChild(labelRow);

                    let idRow = document.createElement("div");
                    idRow.classList.add("elFlexRow", "elAnnId");
                    idRow.innerHTML = openInfos[j].parentNode.parentNode.getAttribute("data-uniqueid");
                    openInfos[j].getElementsByClassName("elFlexColumn")[0].appendChild(idRow);
                }
            }

            observer.observe(entryContainers[i], {
                childList: true,
                attributes: true,
                subtree: true
            });
        });

        mutationObserver.observe(entryContainers[i], {
            childList: true,
            attributes: true,
            subtree: true
        });
    }
}