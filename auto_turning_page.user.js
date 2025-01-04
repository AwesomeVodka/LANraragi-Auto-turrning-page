// ==UserScript==
// @name        LANraragi - Auto turning page
// @namespace   https://github.com/AwesomeVodka/LANraragi-Auto-turrning-page
// @include     *:*/reader?id=*
// @grant       unsafeWindow
// @version     0.1.1
// @author      AwesomeVodka
// @description Script to add auto turning page function to LANraragi Reader. 
// @license     MIT
// @homepageURL https://github.com/AwesomeVodka/LANraragi-Auto-turrning-page
// @supportURL  https://github.com/AwesomeVodka/LANraragi-Auto-turrning-page/issues
// @downloadURL https://awesomevodka.github.io/LANraragi-Auto-turrning-page/auto_turning_page.user.js
// @updateURL   https://awesomevodka.github.io/LANraragi-Auto-turrning-page/auto_turning_page.user.js
// @run-at      document-idle
// ==/UserScript==

(function() {
    'use strict';

    if("undefined" !== typeof Reader) {
        const ATP_START_BTN_ICON_CLASSNAME = "fa fa-circle-play fa-2x";
        const ATP_STOP_BTN_ICON_CLASSNAME = "fa fa-circle-stop fa-2x";
        const ATP_INPS_STOP_BTN_ID = "atp-inps-stop-btn"
        const ATP_INPS_STOP_BTN_SHOW_VALUE = "inline-block";
        const ATP_INPS_STOP_BTN_HIDE_VALUE = "none";
        const ATP_INPS_STOP_BTN_STYLES = [
            "display: " + ATP_INPS_STOP_BTN_HIDE_VALUE,
            "position: fixed",
            "top: 10px",
            "right: 10px",
            "padding: 10px 20px",
            "color: rgb(255,255,255,255,0.5)",
            "border: none",
            "border-radius: 5px",
            "cursor: pointer"
        ];
        const ATP_SETTING_IS_KEY = "atp_is";
        const ATP_SETTING_IS_DEFAULT = 8;
        const ATP_SETTING_IS_MIN = 1;
        const ATP_SETTING_IS_MAX = 60;
        const ATP_SETTING_USEFS_KEY = "atp_usefs";
        const ATP_SETTING_USEFS_ID_PREFIX = "atp-setting-usefs-";
        const ATP_SETTING_USEFS_ENABLED = "enabled";
        const ATP_SETTING_USEFS_DISABLED = "disabled";
        const LANRARAGI_FS_EL_ID = "i3";
        const LANRARAGI_BTN_TOGGLED_CLASSNAME = "toggled";
        

        const methods = {
            getValidSiVal: function(timerVal) {
                let returnVal = timerVal;

                if(!returnVal) {
                    returnVal = unsafeWindow.localStorage.getItem(ATP_SETTING_IS_KEY);
                }

                returnVal = parseInt(returnVal);

                if(Number.isNaN(returnVal) || returnVal < ATP_SETTING_IS_MIN || returnVal > ATP_SETTING_IS_MAX) {
                    returnVal = ATP_SETTING_IS_DEFAULT;
                }

                return returnVal;
            },
            getValidUsefsVal: function(usefullscreenVal) {
                let returnVal = usefullscreenVal;

                if(!returnVal) {
                    returnVal = unsafeWindow.localStorage.getItem(ATP_SETTING_USEFS_KEY);
                }

                if(ATP_SETTING_USEFS_ENABLED !== returnVal && ATP_SETTING_USEFS_DISABLED !== returnVal) {
                    returnVal = ATP_SETTING_USEFS_ENABLED;
                }

                return returnVal;
            },
            checkUsefs: function() {
                return (ATP_SETTING_USEFS_ENABLED === methods.getValidUsefsVal());
            },
            isFullscreenMode: function() {
                let $fullscreenEl = document.fullscreenElement;
                
                return ($fullscreenEl && LANRARAGI_FS_EL_ID === $fullscreenEl.id);
            },
            atpStart: function() {
                let setTimer = methods.getValidSiVal();

                if(methods.checkUsefs() && !methods.isFullscreenMode()) {
                    Reader.handleFullScreen(true);
                }

                atpRunBtnElArr.forEach(function($el) {
                    $el.className = ATP_STOP_BTN_ICON_CLASSNAME;
                });

                atpInst = setInterval(function() {
                    if(Reader.maxPage === Reader.currentPage) {
                        methods.atpStop();
                    } else {
                        Reader.changePage(1);
                    }
                }, setTimer * 1000);
            },
            atpStop: function() {
                if(methods.checkUsefs() && methods.isFullscreenMode()) {
                    document.exitFullscreen();
                }

                atpRunBtnElArr.forEach(function($el) {
                    $el.className = ATP_START_BTN_ICON_CLASSNAME;
                });

                clearInterval(atpInst);
            }
        }

        const eventlistener = {
            atpRunBtnClick: function(e) {
                e.stopPropagation();

                if(Reader.currentPageLoaded) {
                    if(!atpRun) {
                        methods.atpStart();
                    } else if(atpRun) {
                        methods.atpStop();
                    }

                    atpRun = !atpRun
                }
            },
            atpSettingSiChange: function(e) {
                if(Reader.currentPageLoaded) {
                    let inputVal = parseInt(e.currentTarget.value);
                    let validVal = methods.getValidSiVal(inputVal);

                    if(validVal !== inputVal) {
                        e.currentTarget.value = validVal;
                    }
                    
                    unsafeWindow.localStorage.setItem(ATP_SETTING_IS_KEY, validVal);
                }
            },
            atpSettingFullscreenBtnClick: function(e) {
                if(Reader.currentPageLoaded) {
                    let inputVal = methods.getValidUsefsVal(e.currentTarget.value);

                    if(ATP_SETTING_USEFS_ENABLED === inputVal) {
                        $usefsSettingEnabledBtnEl.classList.add(LANRARAGI_BTN_TOGGLED_CLASSNAME);
                        $usefsSettingDisabledBtnEl.classList.remove(LANRARAGI_BTN_TOGGLED_CLASSNAME);
                    } else {
                        $usefsSettingEnabledBtnEl.classList.remove(LANRARAGI_BTN_TOGGLED_CLASSNAME);
                        $usefsSettingDisabledBtnEl.classList.add(LANRARAGI_BTN_TOGGLED_CLASSNAME);
                    }

                    unsafeWindow.localStorage.setItem(ATP_SETTING_USEFS_KEY, inputVal);
                }
            }, 
            fullscreenChange: function(e) {
                if(Reader.currentPageLoaded) {
                    if(methods.isFullscreenMode()) {
                        $fullscreenInStopBtnEl.style.display = ATP_INPS_STOP_BTN_SHOW_VALUE;
                    } else {
                        $fullscreenInStopBtnEl.style.display = ATP_INPS_STOP_BTN_HIDE_VALUE;
                    }
                }
            }
        };

        let atpInst = -1;
        let atpRun = false;
        let atpRunBtnElArr = [];
        let $atpRunBtnEl = document.createElement("a");
            $atpRunBtnEl.className = ATP_START_BTN_ICON_CLASSNAME;

        let $siSettingEl = document.createElement("div");
            $siSettingEl.id = "atp-setting-si";

        let $siSettingTitleEl = document.createElement("h2");
            $siSettingTitleEl.className = "config-panel";
            $siSettingTitleEl.innerText = "Auto turning page - Seconds interval";

        let $siSettingDescEl = document.createElement("span");
            $siSettingDescEl.className = "config-panel";
            $siSettingDescEl.innerText = "Set the seconds interval to auto turning the page.\r\n(Default 8 sec, Min 1 sec, Max 60 sec)\r\n* If you enter a value out of range or a non-numeric value, it will be set to the default value.";

        let $siSettingInputEl = document.createElement("input");
            $siSettingInputEl.className = "stdinput";
            $siSettingInputEl.id = "atp-setting-si-input";
            $siSettingInputEl.type = "number";
            $siSettingInputEl.min = ATP_SETTING_IS_MIN;
            $siSettingInputEl.max = ATP_SETTING_IS_MAX;
            $siSettingInputEl.value = methods.getValidSiVal();
            $siSettingInputEl.onchange = eventlistener.atpSettingSiChange;

        $siSettingEl.append($siSettingTitleEl);
        $siSettingEl.append($siSettingDescEl);
        $siSettingEl.append($siSettingInputEl);

        let $usefsSettingEl = document.createElement("div");
            $usefsSettingEl.id = "atp-setting-usefs";

        let $usefsSettingTitleEl = document.createElement("h2");
            $usefsSettingTitleEl.className = "config-panel";
            $usefsSettingTitleEl.innerText = "Auto turning page - Use fullscreen";

        let $usefsSettingDescEl = document.createElement("span");
            $usefsSettingDescEl.className = "config-panel";
            $usefsSettingDescEl.innerText = "Set whether to use fullscreen mode when auto turning page to run.\r\n(default \"enabled\")\r\n* If an invalid value is entered, it will be set to the default value.";

        let $usefsSettingEnabledBtnEl = document.createElement("input");
            $usefsSettingEnabledBtnEl.className = "favtag-btn config-btn";
            $usefsSettingEnabledBtnEl.id = ATP_SETTING_USEFS_ID_PREFIX + ATP_SETTING_USEFS_ENABLED;
            $usefsSettingEnabledBtnEl.type = "button";
            $usefsSettingEnabledBtnEl.value = ATP_SETTING_USEFS_ENABLED;
            $usefsSettingEnabledBtnEl.innerText = "Enabled";
            $usefsSettingEnabledBtnEl.onclick = eventlistener.atpSettingFullscreenBtnClick;

        let $usefsSettingDisabledBtnEl = $usefsSettingEnabledBtnEl.cloneNode(false);
            $usefsSettingDisabledBtnEl.id = ATP_SETTING_USEFS_ID_PREFIX + ATP_SETTING_USEFS_DISABLED;
            $usefsSettingDisabledBtnEl.value = ATP_SETTING_USEFS_DISABLED;
            $usefsSettingDisabledBtnEl.innerText = "Disabled";
            $usefsSettingDisabledBtnEl.onclick = eventlistener.atpSettingFullscreenBtnClick;
            
        if(ATP_SETTING_USEFS_ENABLED === methods.getValidUsefsVal()) {
            $usefsSettingEnabledBtnEl.classList.add(LANRARAGI_BTN_TOGGLED_CLASSNAME);
        } else {
            $usefsSettingDisabledBtnEl.classList.add(LANRARAGI_BTN_TOGGLED_CLASSNAME);
        } 

        $usefsSettingEl.append($usefsSettingTitleEl);
        $usefsSettingEl.append($usefsSettingDescEl);
        $usefsSettingEl.append($usefsSettingEnabledBtnEl);
        $usefsSettingEl.append($usefsSettingDisabledBtnEl);

        // 풀스크린 모드에서 표시할 버튼
        let $runBtnCloneEl = $atpRunBtnEl.cloneNode(false);
            $runBtnCloneEl.style.cssText = ATP_INPS_STOP_BTN_STYLES.join(";");
            $runBtnCloneEl.id = ATP_INPS_STOP_BTN_ID;
            $runBtnCloneEl.onclick = eventlistener.atpRunBtnClick;

            document.querySelector("div#i3").append($runBtnCloneEl);

            atpRunBtnElArr.push($runBtnCloneEl);

        let $fullscreenInStopBtnEl = $runBtnCloneEl;

        document.querySelectorAll("div.absolute-options.absolute-right").forEach(function($rightMenuEl) {
            $runBtnCloneEl = $atpRunBtnEl.cloneNode(false);
            $runBtnCloneEl.onclick = eventlistener.atpRunBtnClick;

            $rightMenuEl.prepend($runBtnCloneEl);

            atpRunBtnElArr.push($runBtnCloneEl);
        });

        
        document.querySelector("div#settingsOverlay").append($siSettingEl);
        document.querySelector("div#settingsOverlay").append($usefsSettingEl);

        document.addEventListener("fullscreenchange", eventlistener.fullscreenChange);
    }
})();