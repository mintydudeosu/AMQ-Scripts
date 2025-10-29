// ==UserScript==
// @name         AMQ Custom Quiz Exporter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Export songs in a Custom Quiz as JSON (anisongdb format)
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
    libraryCacheHandler.getCache((callback) => {
        let exportButton = document.createElement("div");
        exportButton.classList.add("cqsOptionButton", "cqsOptionButtonSmall", "cqsBuildButtons");
        exportButton.innerHTML = "Export";

        let buttonContainer = document.getElementById("cqsButtonContainer");
        buttonContainer.insertBefore(exportButton, buttonContainer.firstChild);

        console.log("TEST!");

        exportButton.onclick = () => {
            let quizId = Number(document.getElementById("cqsSideQuizId").innerHTML.replace("#", ""));

            let quizLoadedListener = new Listener("load custom quiz", async (payload) => {
                console.log(payload);
                quizLoadedListener.unbindListener();

                let finalList = [];

                let songList = payload.quizSave.ruleBlocks[0].blocks;

                for(let i = 0; i < songList.length; i++) {
                    let songInfo = libraryCacheHandler.getCachedAnnSongEntry(songList[i].annSongId);
                    let animeInfo = libraryCacheHandler.getCachedAnime(songInfo.annId);

                    console.log(`Adding song ${i + 1} of ${songList.length}`);

                    await new Promise((resolve) => {
                        let animeExtendedInfoListener = new Listener("get anime extended info", (animePayload) => {
                            if(animePayload && animePayload.annId == songInfo.annId) {
                                animeExtendedInfoListener.unbindListener();
                                //console.log("anime", animePayload);

                                let songExtendedInfoListener = new Listener("get song extended info", (songPayload) => {
                                    if(songPayload && songPayload.annSongId == songList[i].annSongId) {
                                        songExtendedInfoListener.unbindListener();

                                        //console.log("song", songPayload);

                                        let linkMap = songPayload.fileNameMap;

                                        /*finalList.push({
                                            animeTitle: animeInfo.mainNames.EN == null ? animeInfo.mainNames.JA : animeInfo.mainNames.EN,
                                            songTitle: songInfo.songEntry.name,
                                            artist: songInfo.songEntry.artist.name,
                                            link: "https://naedist.animemusicquiz.com/" + (linkMap[720] ? linkMap[720] : linkMap[480])
                                        });*/

                                        let altTitles = [];
                                        for(let j = 0; j < animeInfo.names.length; j++)
                                            if(animeInfo.names[j].name != animeInfo.mainNames.JA && animeInfo.names[j].name != animeInfo.mainNames.EN)
                                                altTitles.push(animeInfo.names[j].name);

                                        let seasons = ["Winter", "Spring", "Summer", "Fall"];
                                        let songTypes = ["Opening", "Ending", "Insert Song"];

                                        finalList.push({
                                            annId: songInfo.annId,
                                            annSongId: songList[i].annSongId,
                                            amqSongId: songInfo.songEntry.songId,
                                            animeENName: animeInfo.mainNames.EN == null ? animeInfo.mainNames.JA : animeInfo.mainNames.EN,
                                            animeJPName: animeInfo.mainNames.JA == null ? animeInfo.mainNames.EN : animeInfo.mainNames.JA,
                                            animeAltName: altTitles.length > 0 ? altTitles : null,
                                            animeVintage: seasons[animeInfo.seasonId] + " " + animeInfo.year,
                                            linked_ids: {
                                                myanimelist: animePayload.malId,
                                                // anidb missing
                                                anilist: animePayload.aniListId,
                                                kitsu: animePayload.kitsuId
                                            },
                                            // animeType missing
                                            animeCategory: animeInfo.category,
                                            songType: songTypes[songInfo.type - 1] + (songInfo.number == 0 ? "" : (" " + songInfo.number)),
                                            songName: songInfo.songEntry.name,
                                            songArtist: songInfo.songEntry.artist.name,
                                            songComposer: songInfo.songEntry.composer ? songInfo.songEntry.composer.name : "",
                                            songArranger: songInfo.songEntry.arranger ? songInfo.songEntry.arranger.name : "",
                                            songDifficulty: songPayload.globalPercent,
                                            // missing songCategory
                                            // missing songLength
                                            isDub: songInfo.dub == 1,
                                            isRebroadcast: songInfo.rebroadcast == 1,
                                            HQ: linkMap[720] ? linkMap[720] : null,
                                            MQ: linkMap[480] ? linkMap[480] : null,
                                            audio: linkMap[0] ? linkMap[0] : null,
                                            // missing artists, composers, arrangers, fuck that
                                        });

                                        window.setTimeout(resolve, 150); // avoid ratelimit
                                    }
                                });
                                songExtendedInfoListener.bindListener();

                                socket.sendCommand({
                                    type: "library",
                                    command: "get song extended info",
                                    data: {
                                        annSongId: songList[i].annSongId,
                                        includeFileNames: true,
                                    },
                                });
                            }
                        });
                        animeExtendedInfoListener.bindListener();

                        socket.sendCommand({
                            type: "library",
                            command: "get anime extended info",
                            data: {
                                annId: songInfo.annId
                            },
                        });
                    });
                }

                let downloadEl = document.createElement("a");
                document.body.appendChild(downloadEl);
                downloadEl.style = "display: none";

                let blob = new Blob([JSON.stringify(finalList)], {type: "application/json"});
                let url = window.URL.createObjectURL(blob);
                downloadEl.href = url;
                downloadEl.download = "exportedQuiz.json";
                downloadEl.click();
                window.URL.revokeObjectURL(url);
            });
            quizLoadedListener.bindListener();

            socket.sendCommand({
                command: "load custom quiz",
                type: "quizCreator",
                data: {
                    quizId,
                },
            });
        };
    });
}