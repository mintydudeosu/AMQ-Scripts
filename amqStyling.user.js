// ==UserScript==
// @name         AMQ Styling
// @namespace    http://tampermonkey.net/
// @version      1.2
// @updateURL    https://raw.githubusercontent.com/mintydudeosu/AMQ-Scripts/main/amqStyling.user.js
// @downloadURL  https://raw.githubusercontent.com/mintydudeosu/AMQ-Scripts/main/amqStyling.user.js
// @description  make amq look decent :thumbsup:
// @author       MintyDude
// @match        https://animemusicquiz.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=animemusicquiz.com
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://raw.githubusercontent.com/TheJoseph98/AMQ-Scripts/master/common/amqScriptInfo.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.4.0/color-thief.umd.js
// ==/UserScript==

if(!document.getElementById("gameContainer"))
    return;

function waitForLoad() {
    if(document.querySelector("*[id^=qpMoePlayer-1]"))
        return scriptsLoaded();
    window.setTimeout(waitForLoad, 500);
}
waitForLoad();



/* this whole thing could do with a refactor, but for now it's just a complete mess of random things i've added over the course of a year or so */



let videoHiderObserver;

function scriptsLoaded() {
    document.getElementById("mainMenu").style.marginTop = "10vh";
    let mainPageToggle = document.createElement("div");
    mainPageToggle.style.cssText = "width: fit-content; margin: auto; margin-bottom: 10px;";
    mainPageToggle.enabled = false;
    mainPageToggle.innerHTML = "Hide";
    mainPageToggle.classList.add("clickAble");
    mainPageToggle.onclick = () => {
        mainPageToggle.enabled = !mainPageToggle.enabled;
        if(mainPageToggle.enabled) {
            mainPageToggle.innerHTML = "Show";
            document.getElementById("mpNewsContainer").style.visibility = "hidden";
            document.getElementById("mpPromoOuterContainer").style.visibility = "hidden";
            document.getElementById("mpAvatarDriveContainer").style.visibility = "hidden";
            document.getElementById("mpLeaderboardButton").style.visibility = "hidden";
        } else {
            mainPageToggle.innerHTML = "Hide";
            document.getElementById("mpNewsContainer").style.visibility = "visible";
            document.getElementById("mpPromoOuterContainer").style.visibility = "visible";
            document.getElementById("mpAvatarDriveContainer").style.visibility = "visible";
            document.getElementById("mpLeaderboardButton").style.visibility = "visible";
        }
    };
    mainPageToggle.click();
    document.getElementById("mainMenu").insertBefore(mainPageToggle, document.getElementById("mainMenu").firstChild);

    let inputBoxCharacter = document.createElement("img");
    inputBoxCharacter.classList.add("inputBoxCharacter");
    let avatar = storeWindow.activeAvatar;
    inputBoxCharacter.src = cdnFormater.newAvatarHeadSrc(avatar.avatarName, avatar.outfitName, avatar.optionName, avatar.optionActive, avatar.colorName);
    let qpAnswerInputContainer = document.getElementById("qpAnswerInputContainer");
    //console.log(qpAnswerInputContainer.children.length);
    qpAnswerInputContainer.appendChild(inputBoxCharacter);

    let settingsDiv = document.createElement("div");
    settingsDiv.classList.add("row");
    settingsDiv.style.paddingTop = "10px";
    settingsDiv.innerHTML = `
        <div style="text-align: center;font-weight: bold;">AMQ Style Settings</div>
        <div style="margin-top: 10px;">
            <span style="margin-left: 15px;font-weight: bold;">Background URL</span>
            <input id="backgroundURL" class="form-control" type="text" style="width: 75%;display: inline-block;height: 25.6px;padding: 4px;">
        </div>
        <div style="margin-top: 5px;">
            <span style="margin-left:15px;font-weight: bold;">Blur Backgrounds</span>
            <div class="customCheckbox" style="vertical-align: middle;">
                <input type="checkbox" id="blurBackgroundSetting">
                <label for="blurBackgroundSetting">
                    <i class="fa fa-check" aria-hidden="true"></i>
                </label>
            </div>
        </div>
    `;
    // https://wallpaperaccess.com/full/2165209.png
    // https://i.imgur.com/23QjaEx.png
    document.getElementById("settingsGraphicContainer").appendChild(settingsDiv);

    let alSettingsDiv = document.createElement("div");
    alSettingsDiv.classList.add("row");
    alSettingsDiv.style.paddingTop = "20px";
    alSettingsDiv.innerHTML = `
        <div class="col-xs-6">
            <button class="btn btn-primary" id="shResetButton">Reset Song History Position</button>
        </div>
    `;
    document.getElementById("settingsAnimeListContainer").appendChild(alSettingsDiv);

    document.getElementById("backgroundURL").value = GM_getValue("background-url", "https://wallpaperaccess.com/full/2165209.png");
    document.getElementById("backgroundURL").onchange = () => {
        GM_setValue("background-url", document.getElementById("backgroundURL").value);
        //console.log(GM_getValue("background-url", "none"));
        document.getElementById("gameContainer").style.backgroundImage = `url('${document.getElementById("backgroundURL").value}')`;
        let modals = document.getElementsByClassName("modal");
        for(let i = 0; i < modals.length; i++)
            modals[i].style.backgroundImage = `url('${document.getElementById("backgroundURL").value}')`;
    };
    document.getElementById("backgroundURL").onchange();

    document.getElementById("blurBackgroundSetting").checked = GM_getValue("blur-background", true);
    document.getElementById("blurBackgroundSetting").onclick = () => {
        GM_setValue("blur-background", document.getElementById("blurBackgroundSetting").checked);
        if(document.getElementById("blurBackgroundSetting").checked) {
            globalStyles.sheet.cssRules[0].style.cssText = "backdrop-filter: none;"
        } else {
            globalStyles.sheet.cssRules[0].style.cssText = "backdrop-filter: none !important;"
        }
    };

    document.getElementById("shResetButton").onclick = () => {
        document.getElementById("songHistoryWindow").style.width = "510px";
        document.getElementById("songHistoryWindow").style.height = "250px";
        songHistoryWindow.centerContainer();
    };

    document.getElementById("qcStickOut").appendChild(document.getElementById("qcTokenTrackerContainer"));
    document.getElementById("qcTokenTrackerContainer").classList.add("floatingContainer");

    let globalStyles = document.createElement("style");
    globalStyles.type = "text/css";
    globalStyles.id = "mintyStyle";
    globalStyles.innerHTML = `
        * {
            backdrop-filter: none !important;
        }

        #loadingScreen, .col-xs-9:first-of-type {
            background-image: none !important;
        }

        .floatingContainer, .modal-content {
            background-color: rgba(44, 44, 44, 0.5) !important;
            border: 1px solid #ffffff;
            backdrop-filter: blur(3px);
        }

        #mpPlayMultiplayer:hover, #mpPlaySolo:hover {
            background-color: rgba(109, 109, 109, 0.25);
        }

        .modal-content {
            border-radius: 0 0 6px 6px;
        }

        .modal {
            background-size: cover;
            background-position: top center;
        }

        #elCounterContainer {
            border-top: none;
        }

        #qpAnimeNameHider, #qpRateOuterContainer, #qpInfoHider, #qpVideoTroubleshootingContainer {
            display: none;
        }

        #qpCounter {
            border-bottom: none;
        }

        #qpAnimeCenterContainer + .col-xs-3 .qpSideContainer {
            padding-bottom: 10px;
        }

        #qpAnimeCenterContainer + .col-xs-3 .qpSideContainer .row h3 {
            margin-top: 10px;
        }

        #qpVideoHider, #qpVideosUserHidden, #qpWaitBuffering {
            background-color: transparent;
        }

        #qpVideoOverflowContainer {
            background-color: rgba(66, 66, 66, 0.5);
        }

        #qpHiderText, #qpVideosUserHidden, #qpWaitBuffering {
            text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
            color: white;
        }

        .qpVideoPlayer {
            background-color: black;
        }

        #qpVideoOverflowContainer, #qpAnswerInputContainer {
            border: none;
        }

        #qpAnswerInputContainer {
            box-shadow: 2px 2px 10px 2px rgb(0 0 0);
            z-index: 10;
            backdrop-filter: none;
        }

        #qpAnswerInputContainer.focused {
            box-shadow: 2px 2px 10px 2px rgb(0 0 0), 0px 0px 15px 1px #228dff;
        }

        .mpMainTitleShadowHider {
            top: -45px;
        }

        .mpMainTitleShadowHider .floatingContainer {
            border-bottom: none;
        }

        #mpDriveStandingHeaderShadowHider, #mpDriveRecentHeaderShadowHider {
            top: -34px;
        }

        #mpDriveTopHeaderShadowHider {
            top: -28.5px;
        }

        .mhSettingContainer {
            padding-top: 30px;
        }

        .mhSettingContainer:first-of-type {
            padding-top: 1px;
        }

        .qpAvatarStatusOuterContainer {
            height: 30%;
            bottom: 0;
        }

        .qpAvatarStatusInnerContainer {
            background-color: #4273e5;
            opacity: 1;
            width: 108px;
            right: -89px;
        }

        .qpAvatarStatusBar {
            opacity: 1;
            left: 0;
        }

        .qpAvatarStatus {
            color: #d9d9d9;
            bottom: -3px;
            right: 81px;
        }

        .qpAvatarStatusBar.completed, .qpAvatarStatusBar.looted {
            background-color: #4273e5;
        }

        .inputBoxCharacter {
            position: absolute;
            right: 0;
            top: 0;
            pointer-events: none;
            height: 42px;
            z-index: 1;
        }

        #qpAnswerStateContainerOuter {
            z-index: 2;
            opacity: 0.8;
        }

        #mhMainContainerInner {
            pointer-events: none;
        }

        #gcMessageContainer, #gcSpectatorList, #gcQueueList {
            background-color: rgba(0, 0, 0, 0.5);
        }

        .gcList > li:nth-child(2n) {
            background-color: rgba(0, 0, 0, 0.5);
        }

        .gcList > li:nth-child(2n - 1) {
            background-color: rgba(48, 48, 48, 0.5);
        }

        #gameChatContainer {
            backdrop-filter: blur(5px);
            background-color: transparent;
        }

        .gmsModeContainer {
            border-right: 1px solid #ffffff !important;
            transition: background-color 100ms ease-in-out;
        }

        .gmsModeContainer:hover {
            background-color: rgba(0, 0, 0, 0.3) !important;
            transition: background-color 100ms ease-in-out;
        }

        .gmsModeDescription {
            background: transparent !important;
            transition: opacity 100ms ease-in-out;
        }

        .gmsModeContainer:hover .gmsModeDescription {
            transition: opacity 100ms ease-in-out;
        }

        .modal-header {
            border-bottom: 1px solid #ffffff !important;
            background: transparent !important;
        }

        .gmsModeContainer:last-child {
            border-right: none !important;
        }

        .mhSettingContainer {
            border-top: 2px solid #ffffff;
        }

        .mhSettingCategory {
            padding: 0 5px;
            border: 2px solid #ffffff;
            border-top: none;
            transform: none;
            background: transparent;
            left: 0;
            width: auto;
        }

        .mhSettingCategory > div {
            transform: none;
        }

        #mhQuickSelectContainer {
            display: none;
        }

        #mhScrollFiller {
            height: 10px;
        }

        .mhAdvancedContainerTitle {
            display: none;
        }

        .mhCustomSliderContainer {
            background: transparent;
            border-radius: 0;
            border: 1px solid #ffffff;
            padding-left: 10px;
        }

        .mhCustomSliderContainer label {
            padding-right: 10px;
        }

        .mhCheckTableContainer {
            border: none;
        }

        .mhctRow {
            border: none;
        }

        .mhctRowNameContainer {
            background: transparent;
            margin-top: -2.6px;
        }

        .mhctRowItem {
            background: transparent !important;
        }

        .mhctOptionRow {
            top: -20px;
        }

        .filterContainer {
            border-radius: 0;
            background-color: rgba(0, 0, 0, 0.5);
            border: 1px solid #ffffff;
            margin-top: 0;
        }

        .filterContent {
            border-top: 1px solid #ffffff;
        }

        .filterEmptyText {
            color: #d9d9d9;
        }

        .filterContainer .flatTextInput {
            background: transparent;
        }

        .filterContainer .flatTextInput:focus {
            outline: none;
        }

        .tabContainer {
            background: transparent !important;
            border-bottom: 1px solid #ffffff;
        }

        .tabContainer .tab::before {
            background: transparent;
            box-shadow: none;
            border-left: 2px solid #ffffff;
        }

        .tabContainer .tab.selected::before {
            background: rgba(120, 120, 120, 0.5);
        }

        #mhAdvancedTab::before {
            border-right: 2px solid white;
        }

        .gcInputContainer {
            background: rgba(0, 0, 0, 0.7);
            border-top: 1px solid #ffffff;
        }

        .gcInputContainer .fa {
            color: #d9d9d9 !important;
        }

        textarea {
            background: rgba(0, 0, 0, 0.5);
        }

        .textAreaContainer:focus-within {
            border: 1px solid #ffffff;
        }

        #gcEmojiPickerContainer {
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid #ffffff;
            backdrop-filter: blur(3px);
        }

        .gcEmojiPickerHeader {
            border-bottom: 1px solid #ffffff;
            margin: 10px 0;
        }

        #gcEmojiPickerRecentContainer .gcEmojiPickerHeader {
            margin-top: 0;
        }

        #gcEmojiPickerContainer {
            width: 210px;
        }

        #gcContent {
            border-left: 1px solid #ffffff;
        }

        .qpAvatarAnswerContainer {
            background-color: rgba(44, 44, 44, 0.7) !important;
        }

        .awesomplete > ul.ps, #songs-list, #artists-list {
            background: rgba(0, 0, 0, 0.7) !important;
        }

        #qpAnswerInputContainer .awesomplete > ul.ps, #songs-list, #artists-list {
            backdrop-filter: blur(3px);
            top: 22px;
            padding-top: 10px !important;
            z-index: -1 !important;
        }

        #songs-list, #artists-list {
            padding-top: 15px !important;
        }

        .awesomplete > ul:before {
            display: none;
        }

        .qpVoteSkip {
            left: -16px;
        }

        .qpVoteSkip p {
            padding-left: 3px;
        }

        .filterInput .awesomplete > ul.ps {
            max-height: 148px;
            top: 30px;
        }

        .button {
            transition: box-shadow 100ms ease-in-out;
        }

        .button:hover {
            transition: box-shadow 100ms ease-in-out;
        }

        #settingModal .tab:last-child {
            width: 125px;
        }

        #settingModal .tab:last-child::before {
            border-right: 2px solid #ffffff;
        }

        #smGameSettingTab {
            width: 100px;
        }

        #smAnimeListTab {
            width: 125px;
        }

        #gcChatMenu {
            border-left: 1px solid #ffffff;
        }

        #gcChatMenu div {
            background: rgba(0, 0, 0, 0.8);
            border-bottom: 1px solid #ffffff;
            height: 100%;
        }

        #gcChatMenu div.selected {
            background: rgba(0, 0, 0, 0.5);
            border-bottom: none;
        }

        #gcChatMenu div {
            border-left: 2px solid #ffffff;
        }

        #gcChatMenu div:first-child {
            border-left: none;
        }

        #gcChatMenu h5 {
            margin-top: 8px;
        }

        #gcQueueListContent .gcInputContainer {
            opacity: 1;
        }

        #questContainer {
            width: 340px;
            border-left: none;
        }

        .qcQuestOuter {
            border: none;
            padding: 4px 0;
        }

        #qcStickOut, #qcTokenTrackerContainer {
            transform: skewX(0);
        }

        #qcStickOut {
            width: auto;
        }

        #qcStickOut i {
            display: none;
        }

        #qcStickOut, #qcHeader {
            background: transparent;
            box-shadow: none;
        }

        #qcTokenTrackerContainer {
            left: -50px;
            right: 0;
            width: 40px;
        }

        #qcTokenCounterContainer {
            pointer-events: none;
            width: 40px;
            left: 0;
        }

        .qcTokenIcon {
            margin-left: 5px;
        }

        .qcProgressBarContainer {
            background: rgba(0, 0, 0, 0.7);
            border: 1px solid #ffffff;
        }

        .qcProgressBar {
            background-color: rgba(6, 60, 209, 0.8);
        }

        .qcQuestTypeContainer {
            background: transparent;
        }

        .topMenuBar {
            background: transparent;
        }

        #lobbyRoomNameContainer {
            display: none;
        }

        .topMenuBar > div, #rbMajorFilters, #rbSearchContainer, #roomBrowserHostButton {
            background-color: rgba(44, 44, 44, 0.5) !important;
            border: 1px solid #ffffff;
            border-top: none;
            backdrop-filter: blur(3px);
        }

        #lbLeaveButton, #rbBackButton {
            border-left: none;
        }

        #rbMenuCenter, #rbFilterContainer {
            backdrop-filter: none;
        }

        #rbMajorFilters {
            left: -320px;
            height: 47px;
            padding-left: 10px;
            padding-top: 5px;
        }

        #rbFilterContainer {
            background: transparent !important;
            border: none;
        }

        #rbFilterContainer > * {
            display: none;
        }

        #rbSearchContainer {
            display: block;
            transform: skewX(0);
        }

        #rbSearchContainer > * {
            transform: skewX(0);
        }

        #rbSearchInput {
            background: transparent !important;
            position: absolute;
            top: 0;
            left: 40px;
        }

        #rbSearchInputContainer > span {
            left: -110px;
            top: 0;
            padding: 0 10px;
            border-right: 1px solid #ffffff;
            height: 100%;
            width: 35px;
        }

        #rbSearchInputContainer > span:before {
            position: absolute;
            top: 9px;
            left: 9px;
        }

        #rbSearchInput::placeholder {
            color: #d9d9d9;
        }

        #qpSongInfoContainer {
            z-index: 11;
        }

        .qpAvatarContainerOuter {
            z-index: 7 !important;
        }

        .stPlayerName {
            background: transparent;
            border-bottom: none;
        }

        #socialTab {
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(3px);
            border-top: 1px solid #ffffff;
            border-right: 1px solid #ffffff;
            bottom: 0;
            visibility: visible;
        }

        .socialTabPlayerEntry, .socialTabPlayerEntry * {
            transform: none !important;
        }

        .stPlayerProfileButton {
            position: absolute;
            bottom: 8px;
            right: 70px;
        }

        #friendOfflineList .stPlayerProfileButton {
            color: rgba(255, 255, 255, 0.57);
        }

        .stPlayerNameContainer > h4 {
            top: 0;
        }

        .socialTabFriendPlayerEntry > .stPlayerName > h3 {
            top: 28px;
        }

        .socialTabPlayerSocialStatusOuterCircle {
            top: 30px;
        }

        .stPlayerNameContainer {
            width: 150px;
        }

        #allUserList .stPlayerProfileButton {
            right: 63px;
            bottom: 1px;
        }

        /* idfk how any of this works but it centres the text vertically. this took about 3 hours of randomly testing stackoverflow answers until one worked. */
        #allUserList .stPlayerNameContainer {
            left: 20px;
            width: 193px;
            height: 100%;
            top: 0;
            position: relative;
        }

        #allUserList .stPlayerNameContainer h4 {
            top: calc(50% - 3px);
            transform: translateY(-50%) !important;
        }

        .socialTabPlayerEntry {
            transition: background-color 100ms ease-in-out;
        }

        .socialTabPlayerEntry:hover, .socialTabPlayerEntry.profileOpen {
            background-color: rgba(109, 109, 109, 0.4);
            transition: background-color 100ms ease-in-out;
        }

        .ppImageContainer {
            background: transparent;
        }

        .ppStatsNameContainer {
            background: transparent;
            border: 1px solid #ffffff;
            border-bottom: none;
            box-shadow: none;
            border-left: none;
            padding-top: 1px;
        }

        .ppStatsValueContainer {
            border-top: 1px solid #ffffff;
            padding-top: 1px;
        }

        .ppFooterText {
            background: transparent;
            box-shadow: none;
        }

        .ppFooterContainer {
            background-color: rgba(0, 0, 0, 0.6);
            box-shadow: 0 -6px 6px -6px rgba(0, 0, 0, 0.5);
        }

        .ppFooterOptionIcon {
            background: transparent;
            color: #ffffff;
            opacity: 1;
            transition: background-color 100ms ease-in-out;
        }

        .ppFooterOptionIcon:hover {
            transition: background-color 100ms ease-in-out;
            background-color: rgba(45, 45, 45, 0.7);
        }

        .ppFooterOptionIcon.disabled {
            color: #d9d9d9;
        }

        .ppFooterOptionIcon.disabled:hover {
            background: transparent;
        }

        .ppBadgeContainer {
            border: 2px solid #1b1b1b;
            border-left: none;
            background-color: rgba(27, 27, 27, 0.4);
            position: absolute;
            top: 55px;
            right: 0;
            height: 60px;
            width: calc(100% - 107px);
            /*overflow: hidden;*/
        }

        .ppBadgeOptions {
            right: -205px;
        }

        .ppBadgeOptionProfileBody {
            height: 109px;
        }

        .ppImageSelector {
            width: calc(100% + 2px);
            left: -1px;
            top: -4px;
        }

        .ppHeader {
            height: 107px;
        }

        .ppPlayerLevelLine, .ppPlayerLevelContainerInnser, .ppPlayerLevelBoarderLineHider, .ppPlayerLevelBoarderTopShadowHider, .ppPlayerLevelLowerBoarder {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
        }

        .ppImageContainer > img {
            width: 107px;
            border-right: 2px solid #1b1b1b;
        }

        .playerProfileContainer {
            width: 307px;
            margin-left: 7px;
        }

        .ppBadgeNoBadgeText {
            display: none;
        }

        .ppPlayerName, .ppPlayerOriginalName {
            width: calc(100% - 7px);
            left: auto;
            right: 0;
            top: calc(50% - 3px);
        }

        .ppPlayerLevelContainer {
            width: calc(100% - 7px);
            position: absolute;
            right: 0;
        }

        .socialFooterTab {
            background-color: rgba(0, 0, 0, 0.8);
            border-top: 1px solid #ffffff;
            border-right: 2px solid #ffffff;
        }

        #socailTabFooter > .selected {
            background: transparent;
            border-top: 1px solid transparent;
        }

        #socialTabProfile {
            border-top: 1px solid #ffffff !important;
            background-color: rgba(0, 0, 0, 0.8) !important;
        }

        .context-menu-list.context-menu-root {
            background: rgba(0, 0, 0, 0.7);
            border: 1px solid #ffffff;
            backdrop-filter: blur(3px);
            border-radius: 0;
        }

        .context-menu-item {
            background: transparent;
            transition: background-color 100ms ease-in-out;
        }

        .context-menu-item.context-menu-hover {
            background-color: rgba(109, 109, 109, 0.4);
            transition: background-color 100ms ease-in-out;
        }

        #footerMenuBarBackground {
            background-color: rgba(0, 0, 0, 0.7);
            border-top: 1px solid #ffffff;
            backdrop-filter: blur(3px);
        }

        #socialTabClip {
            position: absolute;
            bottom: 45px;
            width: 246px;
            height: 360px;
            overflow: hidden;
            visibility: hidden;
        }

        #mainMenuSocailButton {
            background: transparent;
            box-shadow: none !important;
            border-right: 2px solid #ffffff;
            transition: background-color 100ms ease-in-out;
        }

        #mainMenuSocailButton:hover {
            background-color: rgba(109, 109, 109, 0.4);
            transition: background-color 100ms ease-in-out;
        }

        #xpOuterContainer {
            height: calc(100% - 1px);
        }

        #xpBarOuter {
            background-color: rgba(0, 0, 0, 0.6);
            border-left: 1px solid #ffffff;
            border-right: 2px solid #ffffff;
        }

        #xpBarInner {
            background-color: rgba(6, 60, 209, 0.8);
            box-shadow: 1px 0px 15px 1px rgba(6, 60, 209, 0.8);
        }

        #currencyContainer, #currencyTicketContainer {
            border-right: 2px solid #ffffff;
        }

        #optionsContainerClip {
            position: absolute;
            right: 80px;
            bottom: 45px;
            overflow: hidden;
            visibility: hidden;
            width: 148px;
            height: 1000px;
        }

        #optionsContainer {
            visibility: visible;
            right: 20px;
            bottom: 0;
            border: 1px solid #ffffff;
            border-bottom: none;
            background-color: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(3px);
        }

        #rightMenuBarPartContainer::before {
            background: transparent;
        }

        #menuBarOptionContainer {
            right: 81px;
            border-left: 2px solid #ffffff;
            transition: background-color 100ms-ease-in-out;
        }

        #menuBarOptionContainer:hover {
            background-color: rgba(109, 109, 109, 0.4);
            transition: background-color 100ms ease-in-out;
        }

        #optionsContainer li {
            background: transparent;
            border-bottom: none;
            transition: background-color 100ms ease-in-out;
        }

        #optionsContainer li:hover {
            background-color: rgba(109, 109, 109, 0.4);
            transition: background-color 100ms ease-in-out;
        }

        #footerMenuBar .popOut {
        	box-shadow: 0 0 10px 2px rgb(0, 0, 0);
        	transform: translateY(105%);
        	transition: transform 0.6s ease-in-out;
	        overflow: hidden;
	        z-index: -1;
        }

        #footerMenuBar .popOut.open {
        	transform: translateY(0%);
        }

        .chatBox::before {
            background: transparent;
        }

        .chatBoxFooter {
            background: transparent;
            border-left: 2px solid #ffffff;
            border-right: 2px solid #ffffff;
        }

        .chatClip {
            width: 255px;
            height: 260px;
            position: absolute;
            bottom: 45px;
            right: -36px;
            overflow: hidden;
            visibility: hidden;
        }

        .chatBoxContainer {
            width: 215px;
            height: 240px;
            position: absolute;
            bottom: 0;
            right: 20px;
            visibility: visible;
            border: 1px solid #ffffff;
            border-bottom: none;
            background-color: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(3px);
        }

        .chatTopBar .glyphicon-arrow-left, .chatTopBar .glyphicon-arrow-right {
            display: none;
        }

        .chatTopBar {
            background-color: rgba(120, 120, 120, 0.7);
        }

        .chatTopBar p::after {
            background: transparent;
        }

        .chatBoxContainer .header {
            border-bottom: 1px solid #ffffff;
        }

        .context-menu-item.context-menu-disabled {
            background-color: rgba(27, 27, 27, 0.5);
        }

        #nexus {
            height: calc(100vh);
        }

        #gameChatPage.nexusView #quizPage {
            height: calc(100vh - 45px);
        }

        .disableChatLayer {
            background: transparent;
        }

        .chatBoxFooter {
            transition: background-color 100ms ease-in-out;
        }

        .chatBoxFooter:hover {
            background-color: rgba(109, 109, 109, 0.4);
            transition: background-color 100ms ease-in-out;
        }

        #avatarUserImgContainer {
            box-shadow: none;
            background: transparent;
            border-top: 3px solid #ffffff;
            border-left: 3px solid #ffffff;
        }

        #shopIconBackground {
            width: 100%;
            height: 100%;
            position: absolute;
            right: 0;
            bottom: 0;
            z-index: -1;
            filter: brightness(85%);
            transition: filter 100ms ease-in-out;
        }

        #avatarUserImgContainer:hover #shopIconBackground {
            filter: brightness(100%);
            transition: filter 100ms ease-in-out;
        }

        #storeWindow {
            background-color: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(10px);
        }

        #swNoSelectionContainer {
            display: none;
        }

        #swTicketRewardCenter, #swTicketAvatarLockingContainer, #swTicketAvatarLockingPromoContainer::before {
            background: transparent !important;
        }

        /*#swTicketOneRollContainer:before {
            content: "";
            height: 63%;
            width: 100%;
            display: block;
            position: absolute;
            bottom: 0;
            border-right: 1px solid #ffffff;
        }*/

        .swTicketRollContainer, #swTicketAvatarLockingContainer {
            box-shadow: none;
        }

        /*#swTicketAvatarLockingContainer {
            border-right: 1px solid #ffffff;
            border-bottom: 1px solid #ffffff;
        }*/

        #ticketsLeftClip {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 20%;
            right: 38%;
            transform: rotate(45deg);
            overflow: hidden;
            visibility: hidden;
        }

        #swTicketOneRollContainer {
            transform: rotate(-45deg);
            right: 29.6%;
            bottom: 23.1%;
            left: auto;
            visibility: visible;
        }

        #ticketsRightClip {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 20%;
            left: 38%;
            transform: rotate(-45deg);
            overflow: hidden;
            visibility: hidden;
        }

        #swTicketTenRollContainer {
            transform: rotate(45deg);
            left: 29.6%;
            bottom: 23.1%;
            right: auto;
            visibility: visible;
        }

        #swTicketAvatarLockingContainer {
            z-index: 1;
        }

        .swTicketRollContainer {
            transition: bottom 600ms ease-in-out, background-color 100ms ease-in-out;
        }

        .swTicketRollContainer.moveOut {
            bottom: -50% !important;
        }

        #swTicketOneRollContainer.moveOut:before {
            border-right: none;
        }

        #swTicketAvatarLockingContentInner, #swTicketAvatarLockingCloseButton, .swTicketAvatarLockingItemInner {
            background: transparent;
        }

        #swTicketAvatarLockingMainContent {
            height: calc(100% - 40px);
        }

        #swTicketAvatarLockingFooter {
            display: none;
        }

        #swTicketAvatarLockingContentInner {
            box-shadow: none;
            width: 70%;
        }

        .swTicketAvatarLockingItemInner, #swTicketAvatarLockingCloseButton, #swTicketAvatarLockingContainer {
            transition: background-color 100ms ease-in-out;
        }

        .swTicketAvatarLockingItemInner:hover, #swTicketAvatarLockingCloseButton:hover, .swTicketRollContainer:hover, #swTicketAvatarLockingContainer:hover {
            background-color: rgba(109, 109, 109, 0.4) !important;
        }

        .swTicketOptionButton {
            background: transparent;
            box-shadow: none;
            border-right: 2px solid #ffffff;
            transition: background-color 100ms ease-in-out;
        }

        .swTicketOptionButton:hover {
            background-color: rgba(109, 109, 109, 0.4);
        }

        .swTicketOptionButton.active {
            background-color: rgba(255, 255, 255, 0.2);
        }

        .swAvatarTileType {
            background-color: rgba(27, 27, 27, 0.9);
        }

        .qpAvatarContainer.disabled {
            opacity: 1;
        }

        .qpAvatarContainer.disabled .qpAvatarInfoBar, .qpAvatarContainer.disabled .qpAvatarImageContainer {
            opacity: 0.4;
        }

        #gcSpectateListButtonHostIcon {
            display: none;
        }

        .qpAvatarContainer:hover .qpAvatarStatusScore {
            opacity: 0;
        }

        .qpAvatarContainer:hover .qpAvatarStatusType {
            opacity: 1;
        }

        #elQuestionFilter {
            background-color: rgba(44, 44, 44, 0.7) !important;
            border: 1px solid #ffffff;
            backdrop-filter: blur(3px);
            border-top: none;
        }

        #elQuestionFilterInput {
            background: transparent;
            border-radius: 0;
            border-top: 1px solid #ffffff;
            margin-bottom: 0;
            margin-left: 0;
            width: 100%;
        }

        #elQuestionFilterInput::placeholder {
            color: rgba(217, 217, 217, 0.8);
        }

        #elQuestionFilterInput:focus {
            outline: none;
        }

        #elQuestionNoSongSelectedContainer {
            background: transparent;
        }

        #elQuestionInputSongName, #elQuestionInputArtistName {
            text-overflow: ellipsis;
        }

        #elQuestionInputSongName::after, #elQuestionInputArtistName::after {
            background: transparent;
        }

        #elInputStatusBar {
            background-color: rgba(27, 27, 27, 0.8);
            border-bottom: 1px solid #ffffff;
            border-top: 1px solid #ffffff;
        }

        #elInputStatusBar .elStatusName, #elInputStatusBar .elResOption {
            background: transparent;
            box-shadow: none;
            border-right: 1px solid #ffffff;
        }

        #elInputStatusBar .elStatusName::after, #elInputStatusBar .elResOption::after {
            background: transparent;
        }

        #elCatboxStatusContainer .elStatusName {
            width: 70px;
            padding-left: 15px;
        }

        #elInputVideoPreviewContainer {
            background: transparent;
        }

        #elQuestionSoundOnly, #elInputVideoPreviewText {
            visibility: hidden;
        }

        #elExitButton, #elFaqButton {
            background: transparent;
            border: 1px solid #ffffff;
            border-top: none;
            background-color: rgba(44, 44, 44, 0.5);
            backdrop-filter: blur(3px);
        }

        #elExitButton {
            border-left: none;
        }

        #mpRankedDescriptionButton, #mpRankedTimer {
            background: transparent;
        }

        #mpRankedDescriptionButton h1 , #mpRankedTimer h3, #mpRankedTimer h4 {
            color: rgb(217, 217, 217);
            opacity: 0.7;
        }

        #rmsNoviceSelector {
            border-right: 1px solid #ffffff;
            border-radius: 0 0 0 6px;
        }

        #rmsExpertSelector {
            border-radius: 0 0 6px 0;
        }

        .rmsModeContainer {
            transition: background-color 100ms ease-in-out;
        }

        .rmsModeContainer:hover {
            background-color: rgba(0, 0, 0, 0.3) !important;
            transition: background-color 100ms ease-in-out;
        }

        .swInfoPopoutContainer::after {
            background: transparent;

        }

        #swTicketInfoButton {
            transform: skewX(0);
            padding: 0;
            height: 40px;
            width: 40px;
            left: calc(100% + 1px);
            border: 1px solid #ffffff;
            border-left: none;
            background-color: rgba(44, 44, 44, 0.5);
        }

        #swTicketInfoButton i, #swResonanceButtonTargetText {
            transform: skewX(0);
            text-align: center;
            width: 100%;
            height: 100%;
            vertical-align: middle;
            line-height: 40px;
        }

        .swInfoPopoutContainer {
            transform: translateX(calc(-100% - 1px));
            box-shadow: none;
        }

        .swInfoPopoutContainer:hover {
            transform: translateX(0);
            box-shadow: 0 0 10px 2px rgb(0, 0, 0);
        }

        #swResonanceTargetContainer, #swResonanceProgressBarContainer {
            background: transparent;
        }

        #swResonanceContainer .swInfoPopoutButton {
            transform: skewX(0);
            padding: 0;
            height: 40px;
            width: 80px;
            left: calc(100% + 1px);
            border: 1px solid #ffffff;
            border-left: none;
            background-color: rgba(44, 44, 44, 0.5);
        }

        #swRhythmContainer, #swAvatarTokenContainer {
            background-color: rgba(44, 44, 44, 0.5);
            border: 1px solid #ffffff;
            border-left: none;
        }

        .swTopBarAvatarImageContainer, .swTopBarSkinImageContainer {
            background: transparent;
        }

        .swTopBarAvatarImageContainer.selected, .swTopBarSkinImageContainer.selected {
            background-color: rgba(255, 255, 255, 0.2);
        }

        #loadingScreen .center-div {
            background-color: rgba(44, 44, 44, 0.5) !important;
            border: 1px solid #ffffff;
            backdrop-filter: blur(3px);
            padding: 10px;
        }

        #loadingScreen h1 {
            position: absolute;
            top: -15px;
        }

        #elInputVideo {
            background-color: #000000;
        }

        #lobbyAvatarContainer {
            height: 100%;
            top: 0;
            padding-top: 30px;
        }

        /* this is actually top left :thumbsup: */
        .topRightBackButton {
            background-color: rgba(44, 44, 44, 0.5) !important;
            border: 1px solid #ffffff;
            border-top: none;
            backdrop-filter: blur(3px);
        }

        #qpLeaveButton, #battleRoyalPage .topRightBackButton {
            border-left: none;
        }

        #qpOptionContainer {
            background-color: rgba(44, 44, 44, 0.5) !important;
            border: 1px solid #ffffff;
            border-top: none;
            backdrop-filter: blur(3px);
        }

        #qpOptionContainerHider {
            display: none;
        }

        #qpQualityListClip {
            position: absolute;
            right: 123px;
            top: 35px;
            overflow: hidden;
        }

        #qpQualityList {
            position: static;
            margin-top: 0;
            background-color: rgba(44, 44, 44, 0.5) !important;
            border: 1px solid #ffffff;
            border-top: none;
            backdrop-filter: blur(3px);
        }

        #qpQualityList li {
            transition: background-color 100ms ease-in-out;
        }

        #qpQualityList li.selected {
            background-color: rgba(109, 109, 109, 0.4);
            transition: background-color 100ms ease-in-out;
        }

        .mpNewsBottomTab {
            background-color: rgba(0, 0, 0, 0.2);
            border: none;
            border-top: 1px solid #ffffff !important;
        }

        .mpNewsBottomTab .leftRightButtonTop {
            background: transparent;
            transform: none;
            box-shadow: none;
        }

        .mpNewsBottomTab .leftRightButtonTop > div {
            transform: none;
            margin-top: 7px;
        }

        .mpNewsBottomTab > .mpNewsBottomContainer {
            margin-top: 5px;
        }

        .lobbyAvatarImgContainer {
            background: transparent;
            border: 2px solid #ffffff;
        }

        .lobbyAvatarNameContainer, .lobbyAvatarSubTextContainer {
            background-color: rgba(0, 0, 0, 0.3) !important;
            border: 2px solid #ffffff;
            backdrop-filter: blur(3px);
        }

        .lobbyAvatarSubTextContainer {
            border-top: none;
        }

        .lobbyAvatarHostSubTextContainer {
            border-top: 2px solid #ffffff;
            border-bottom: none;
        }

        .lobbyAvatarHostSubTextContainer h3 {
            margin-top: -1px !important;
        }

        .lobbyAvatar.lbReady .lobbyAvatarNameContainer, .lobbyAvatar.lbReady .lobbyAvatarSubTextContainer, .lobbyAvatar.lbReady .lobbyAvatarImgContainer {
            border-color: rgba(68, 151, 234);
        }

        .lobbyAvatarRow.left .lobbyAvatarImgContainer {
            right: 2px;
        }

        .lobbyAvatarRow.right .lobbyAvatarImgContainer {
            left: 2px;
        }

        .lobbyAvatarLevelContainer .lobbyAvatarPlayerOptions {
            display: none;
        }

        #mhResetDefaultButton {
            padding: 6px;
        }
    `;
    document.getElementsByTagName("head")[0].appendChild(globalStyles);

    document.getElementById("blurBackgroundSetting").onclick();

    document.getElementById("socialMenuPlayerTemplate").innerHTML = `
        <li class="socialTabPlayerEntry">
	    	<div class="stPlayerName leftRightButtonBottom clickAble">
                <div class="stPlayerNameContainer">
	    		    <h4>{0}</h4>
                </div>
	    	</div>
	    	<div class="stPlayerProfileButton clickAble">
	    		<i class="fa fa-id-card-o" aria-hidden="true"></i>
	    	</div>
	    </li>
    `;
    socialTab.allPlayerList._ALL_PLAYER_ENTRY_TEMAPLTE = $("#socialMenuPlayerTemplate").html();

    for(let i = 0; i < Object.keys(socialTab.offlineFriends).length; i++)
        socialTab.offlineFriends[Object.keys(socialTab.offlineFriends)[i]].updateTextSize();
    for(let i = 0; i < Object.keys(socialTab.onlineFriends).length; i++)
        socialTab.onlineFriends[Object.keys(socialTab.onlineFriends)[i]].updateTextSize();

    let socialTabClip = document.createElement("div");
    socialTabClip.id = "socialTabClip";
    document.getElementById("footerMenuBar").appendChild(socialTabClip);
    socialTabClip.appendChild(document.getElementById("socialTab"));

    let optionsContainerClip = document.createElement("div");
    optionsContainerClip.id = "optionsContainerClip";
    document.getElementById("footerMenuBar").appendChild(optionsContainerClip);
    optionsContainerClip.appendChild(document.getElementById("optionsContainer"));

    let qpQualityListClip = document.createElement("div");
    qpQualityListClip.id = "qpQualityListClip";
    document.getElementById("qpOptionContainer").children[0].appendChild(qpQualityListClip);
    qpQualityListClip.appendChild(document.getElementById("qpQualityList"));

    SocialTab.prototype.changeToAllUsers = function () {
	    if (!this.allPlayerList.ready) {
	    	//If no users, then do nothing (server haven't responded yet)
	    	return;
    	}
    	this.$friendView.addClass("hide");
    	this.$allUsersView.removeClass("hide");
    	this.$friendsButton.removeClass("selected");
    	this.$allUsersButton.addClass("selected");
    	this.updateScrollbar();

        let allPlayers = document.getElementById("allUserList").getElementsByClassName("socialTabPlayerEntry");
        for(let i = 0; i < allPlayers.length; i++) {
            let container = $(allPlayers[i]).find(".stPlayerNameContainer");
            fitTextToContainer(container.find("h4"), container, 24, 10);
            //console.log("fit");
        }
    };

    AllPlayersList.prototype.insertPlayer = function (name) {
	    let $entry = this.createEntry(name);
    	let $after = this.getEntryAfterPlayer(name);

    	if ($after) {
	    	$entry.insertBefore($after);
	    } else {
	    	this._$CONTAINER.append($entry);
	    }

	    this.attachContextMenu($entry, name);

        let container = $entry.find(".stPlayerNameContainer");
        fitTextToContainer(container.find("h4"), container, 24, 10);

	    return $entry;
    };

    ChatBar.prototype.getChat = function (playerName, modMessage) {
    	var chat = this.activeChats.find((element) => {
	    	return element.name === playerName;
    	});
    	if (!chat) {
	    	chat = new ChatBox(playerName, this, modMessage);

	    	this.activeChats.push({
	    		name: playerName,
	    		object: chat
	    	});

            let chatClip = document.createElement("div");
            chatClip.classList.add("chatClip");
            document.getElementById(chat.id).appendChild(chatClip);
            chatClip.appendChild(chat.dom[0].getElementsByClassName("chatBoxContainer")[0]);

	    	this.updateLayout();
    	} else {
    		chat = chat.object;
	    }

	    return chat;
    };

    let ticketsLeftClip = document.createElement("div");
    ticketsLeftClip.id = "ticketsLeftClip";
    document.getElementById("swTicketRollSelectionContainer").appendChild(ticketsLeftClip);
    ticketsLeftClip.appendChild(document.getElementById("swTicketOneRollContainer"));

    let ticketsRightClip = document.createElement("div");
    ticketsRightClip.id = "ticketsRightClip";
    document.getElementById("swTicketRollSelectionContainer").appendChild(ticketsRightClip);
    ticketsRightClip.appendChild(document.getElementById("swTicketTenRollContainer"));

    let animeContainerObserver = new MutationObserver(animeContainerCallback);
    animeContainerObserver.observe(document.getElementById("qpAnimeCenterContainer"), { childList: true });

    let nameHiderObserver = new MutationObserver(nameHiderCallback);
    nameHiderObserver.observe(document.getElementById("qpAnimeNameHider"), { attributes: true });

    let infoHiderObserver = new MutationObserver(infoHiderCallback);
    infoHiderObserver.observe(document.getElementById("qpInfoHider"), { attributes: true });

    videoHiderObserver = new MutationObserver(videoHiderCallback);
    videoHiderObserver.observe(document.getElementById("qpVideoHider"), { attributes: true });
    videoHiderObserver.observe(document.getElementById("qpWaitBuffering"), { attributes: true });
    videoHiderObserver.observe(document.getElementById("qpVideosUserHidden"), { attributes: true });
    videoHiderObserver.observe(document.querySelector("*[id^=qpMoePlayer-1]"), { attributes: true });
    videoHiderObserver.observe(document.querySelector("*[id^=qpMoePlayer-0]"), { attributes: true });
    videoHiderObserver.observe(document.getElementById("qpCenterInfoContainer"), { childList: true });

    let expandHiderObserver = new MutationObserver(expandHiderCallback);
    expandHiderObserver.observe(document.getElementById("elQuestionNoSongSelectedContainer"), { attributes: true });
    expandHiderCallback();

    let ticketObserver = new MutationObserver(ticketObserverCallback);
    ticketObserver.observe(document.getElementById("swTicketAvatarLockingContainerOuter"), { attributes: true });

    let quizReadyListener = new Listener("quiz ready", (data) => {
        nameHiderCallback();
        infoHiderCallback();
        videoHiderCallback();
        organiseAvatars();
    });
    quizReadyListener.bindListener();

    let useAvatarListener = new Listener("use avatar", (data) => {
        //console.log(data);
        let inputBoxCharacter = document.getElementsByClassName("inputBoxCharacter")[0];
        let avatar = data.currentAvatar.avatar;
        inputBoxCharacter.src = cdnFormater.newAvatarHeadSrc(avatar.avatarName, avatar.outfitName, avatar.optionName, avatar.optionActive, avatar.colorName);
    });
    useAvatarListener.bindListener();

    document.getElementById("qpVideoSoundOnly").innerHTML = "&#128266";
    document.getElementById("qpWaitBuffering").children[0].innerHTML = "Buffering";

    document.getElementById("menuBarOptionContainer").dataset.toggle = "modal";
    document.getElementById("menuBarOptionContainer").dataset.target = "#settingModal";

    let lobbyAvatarObserver = new MutationObserver(() => {
        colourLobbyAvatars();
    });
    lobbyAvatarObserver.observe(document.getElementById("lobbyAvatarContainer"), { childList: true, subtree: true });

    AMQ_addScriptData({
        name: "AMQ Styling",
        author: "MintyDude",
        description: `
            <p>Makes AMQ look epic and cool!! 😎</p>
            <p>Designed for my own use, specifically on <a href="https://www.twitch.tv/mintydudeosu">https://www.twitch.tv/mintydudeosu</a>. Apologies if something doesn't look right on your system, but I probably won't fix it.</p>
            <p>This can cause a lot of lag so if you're struggling with performance, try either switching the Hardware Acceleration setting on within your browser, or using an alternative script such as Elodie's (<a href="https://www.youtube.com/watch?v=JL85rOIb3FA">https://www.youtube.com/watch?v=JL85rOIb3FA</a>).</p>
        `
    });

    let shopIconBackground = document.createElement("div");
    shopIconBackground.id = "shopIconBackground";
    document.getElementById("avatarUserImgContainer").appendChild(shopIconBackground);

    document.getElementById("swTopBarContentContainerInner").getElementsByClassName("swTopBarAvatarContainer")[0].getElementsByClassName("swTopBarAvatarImageContainer")[0].click();

    colourShopIcon();
}

function animeContainerCallback() {
    if(document.getElementById("songartist")) {
        let inputBoxCharacters = document.getElementsByClassName("inputBoxCharacter");
        for(let i = 1; i < inputBoxCharacters.length; i++) {
            inputBoxCharacters[i].style.display = "none";
        }

        let inputBoxes = document.querySelectorAll("[id='qpAnswerInputContainer']");
        for(let i = 0; i < inputBoxes.length; i++) {
            inputBoxes[i].style.zIndex = 10 - i;
        }

        document.getElementById("songs-list").style.zIndex = "-1";
        document.getElementById("songs-list").style.width = "calc(100% - 10px)";
        document.getElementById("artists-list").style.zIndex = "-1";
        document.getElementById("artists-list").style.width = "calc(100% - 10px)";
    }
}

function nameHiderCallback() {
    let qpAnimeName = document.getElementById("qpAnimeName");
    if(!document.getElementById("qpAnimeNameHider").classList.contains("hide")) {
        qpAnimeName.style.fontSize = "50px";
        qpAnimeName.innerHTML = "?";
    }
}

function infoHiderCallback() {
    let infoContainer = document.getElementById("qpAnimeCenterContainer").nextElementSibling.children[0];
    //console.log(document.getElementById("qpInfoHider").classList.contains("hide"));
    if(document.getElementById("qpInfoHider").classList.contains("hide")) {
        for(let i = 0; i < infoContainer.children.length; i++)
            if(infoContainer.children[i].classList.contains("row"))
                infoContainer.children[i].style.visibility = "visible";
    } else {
        for(let i = 0; i < infoContainer.children.length; i++)
            if(infoContainer.children[i].classList.contains("row"))
                infoContainer.children[i].style.visibility = "hidden";
    }
}

function videoHiderCallback() {
    videoHiderObserver.disconnect();

    let qpVideoHider = document.getElementById("qpVideoHider");
    let qpWaitBuffering = document.getElementById("qpWaitBuffering");
    let qpVideosUserHidden = document.getElementById("qpVideosUserHidden");
    let qpVideoSoundOnly = document.getElementById("qpVideoSoundOnly");
    let qpVideoPlayers = document.getElementsByClassName("qpVideoPlayer");
    let qpHiderText = document.getElementById("qpHiderText");

    //console.log("WDAHWIDUHAWIUDHWAIDUHAWIUH");

    if(qpVideosUserHidden.classList.contains("active") && qpVideoHider.classList.contains("hide") && qpWaitBuffering.classList.contains("hide")) {
        //console.log("hidden");
        // video hidden message
        qpVideoSoundOnly.classList.add("hide");
        for(let i = 0; i < qpVideoPlayers.length; i++)
            qpVideoPlayers[i].classList.add("vjs-hidden");
    } else if(qpVideoHider.classList.contains("hide") && qpWaitBuffering.classList.contains("hide")) {
        //console.log("video/sound");
        // either video or sound icon shown
        qpVideoSoundOnly.classList.remove("hide");
        for(let i = 0; i < qpVideoPlayers.length; i++) {
            let playerId = qpVideoPlayers[i].getElementsByTagName("video")[0].id.replace("qpMoePlayer-", "").replace("_html5_api", "");
            //console.log(playerId);
            if(playerId != quizVideoController.currentMoePlayerId) {
                qpVideoPlayers[i].classList.add("vjs-hidden");
            } else {
                qpVideoPlayers[i].classList.remove("vjs-hidden");
                //console.log(qpVideoPlayers[i].getElementsByTagName("video")[0].videoWidth);
                qpVideoPlayers[i].style.backgroundColor = "black";
                if(qpVideoPlayers[i].getElementsByTagName("video")[0].videoWidth == 0)
                    qpVideoPlayers[i].style.backgroundColor = "transparent";
            }
        }
    } else if(!qpVideoHider.classList.contains("hide") && qpWaitBuffering.classList.contains("hide")) {
        //console.log("counting down");
        // counting down
        qpVideoSoundOnly.classList.add("hide");
        qpVideosUserHidden.classList.remove("active");
        qpHiderText.classList.remove("invisible");
        let popovers = document.getElementById("qpCenterInfoContainer").getElementsByClassName("popover");
        for(let i = 0; i < popovers.length; i++)
            popovers[i].style.display = "none";
    } else {
        //console.log("buffering");
        // buffering
        qpVideoSoundOnly.classList.add("hide");
        qpHiderText.classList.add("invisible");
    }

    videoHiderObserver.observe(document.getElementById("qpVideoHider"), { attributes: true });
    videoHiderObserver.observe(document.getElementById("qpWaitBuffering"), { attributes: true });
    videoHiderObserver.observe(document.getElementById("qpVideosUserHidden"), { attributes: true });
    videoHiderObserver.observe(document.querySelector("*[id^=qpMoePlayer-1]"), { attributes: true });
    videoHiderObserver.observe(document.querySelector("*[id^=qpMoePlayer-0]"), { attributes: true });
    videoHiderObserver.observe(document.getElementById("qpCenterInfoContainer"), { childList: true });
}

function expandHiderCallback() {
    if(document.getElementById("elQuestionNoSongSelectedContainer").classList.contains("hide")) {
        document.getElementById("elInputVideoContainer").style.visibility = "visible";
        document.getElementById("elInputStatusBar").style.visibility = "visible";
        document.getElementById("elInputQuestionContainer").style.visibility = "visible";
    } else {
        document.getElementById("elInputVideoContainer").style.visibility = "hidden";
        document.getElementById("elInputStatusBar").style.visibility = "hidden";
        document.getElementById("elInputQuestionContainer").style.visibility = "hidden";
    }
}

function ticketObserverCallback() {
    if(document.getElementById("swTicketAvatarLockingContainerOuter").classList.contains("open")) {
        document.getElementById("swTicketOneRollContainer").classList.add("moveOut");
        document.getElementById("swTicketTenRollContainer").classList.add("moveOut");
    } else {
        document.getElementById("swTicketOneRollContainer").classList.remove("moveOut");
        document.getElementById("swTicketTenRollContainer").classList.remove("moveOut");
    }
}

function organiseAvatars() {
    let avatarStatuses = document.getElementsByClassName("qpAvatarStatusOuterContainer");
    for(let i = 0; i < avatarStatuses.length; i++) {
        avatarStatuses[i].parentElement.parentElement.getElementsByClassName("qpAvatarImageContainer")[0].appendChild(avatarStatuses[i]);
    }
}

function colourShopIcon() {
    let background = document.getElementById("shopIconBackground");
    let img = document.getElementById("avatarUserImgContainerInner").getElementsByClassName("avatarImage")[0];
    img.crossOrigin = "Anonymous";
    let colorThief = new ColorThief();

    if (img.complete) {
        let color = colorThief.getColor(img);
        background.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    } else {
      img.addEventListener('load', function() {
          let color = colorThief.getColor(img);
          background.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
      });
    }
}

function colourLobbyAvatars() {
    let avatars = document.getElementsByClassName("lobbyAvatar");
    for(let i = 0; i < avatars.length; i++) {
        let imgContainer = avatars[i].getElementsByClassName("lobbyAvatarImgContainer")[0];
        let img = imgContainer.getElementsByClassName("avatarImage")[0];
        img.crossOrigin = "Anonymous";
        let colorThief = new ColorThief();

        console.log(colorThief);

        if (img.complete && !img.classList.contains("loading")) {
            console.log(img);
            let color = colorThief.getColor(img, 5);
            imgContainer.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        } else {
            img.addEventListener('load', function() {
                console.log(img);
                let color = colorThief.getColor(img, 5);
                imgContainer.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            });
        }

        let nameContainer = avatars[i].getElementsByClassName("lobbyAvatarNameContainer")[0];
        nameContainer.classList.add("playerCommandProfileIcon", "clickAble");
        imgContainer.classList.add("playerCommandProfileIcon", "clickAble");
        lobby.players[i].lobbySlot.setupAvatarOptions();
    }
}