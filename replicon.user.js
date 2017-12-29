// ==UserScript==
// @name        replicon
// @version     0.3
// @description Fix Chrome incompatibilities in Replicon TimeSheet sites
// @author      Greg Toombs
// @namespace   https://github.com/reinderien
// @homepage    https://github.com/reinderien/replicon
// @include     /^https?://timesheet\.\w+\.\w+/Timesheet/main\.aspx$/
// @run-at      document-end
// @grant       none
// ==/UserScript==

// Patch the load element - replicon expects it to be a window, not an iframe
window.load = document.getElementById('load').contentWindow;

// Patch the parameter parsing in jsLoaderObject.loadFrom() - inline comments break it
old_string = window.String;
window.String = function(o) {
    var s = old_string(o);
    if (typeof(o) == 'function')
        s = s.replace(/\s*\/\*.*?\*\/\s*/g, '');
    return s;
};
