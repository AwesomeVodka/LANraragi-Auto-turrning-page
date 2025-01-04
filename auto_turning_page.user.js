// ==UserScript==
// @name        LANraragi - Auto turning page
// @namespace   https://github.com/AwesomeVodka/LANraragi-Auto-turrning-page
// @include     *:*/reader?id=*
// @grant       unsafeWindow
// @version     0.1.2
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
        const ATP_WAKELOCK_VIDEO_DATA_URL = "data:video/mp4;base64,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"
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
            switchWakeLock: function(on) {
                if(on instanceof Boolean && on) {
                    $wakeLockVideoEl.play();
                } else {
                    $wakeLockVideoEl.pause();
                }
            }, 
            atpStart: function() {
                let setTimer = methods.getValidSiVal();

                if(methods.checkUsefs() && !methods.isFullscreenMode()) {
                    Reader.handleFullScreen(true);
                }

                atpRunBtnElArr.forEach(function($el) {
                    $el.className = ATP_STOP_BTN_ICON_CLASSNAME;
                });

                methods.switchWakeLock(true);

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

                methods.switchWakeLock(false);

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

        // 화면 꺼짐 방지를 위한 video 태그 추가
        let $wakeLockVideoEl = document.createElement("video");
            $wakeLockVideoEl.src = ATP_WAKELOCK_VIDEO_DATA_URL;
            $wakeLockVideoEl.loop = true;
            $wakeLockVideoEl.muted = true;
            $wakeLockVideoEl.style.display="none";
        
        document.querySelector("div#settingsOverlay").append($siSettingEl);
        document.querySelector("div#settingsOverlay").append($usefsSettingEl);

        document.addEventListener("fullscreenchange", eventlistener.fullscreenChange);
    }
})();