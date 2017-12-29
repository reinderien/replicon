// ==UserScript==
// @name        replicon
// @version     0.2
// @description Fix Chrome incompatibilities in Replicon TimeSheet sites
// @author      Greg Toombs
// @namespace   https://github.com/reinderien
// @homepage    https://github.com/reinderien/replicon
// @downloadURL https://raw.githubusercontent.com/reinderien/replicon/master/replicon.js
// @include     /^https?://timesheet\.\w+\.\w+/Timesheet/main\.aspx$/
// @run-at      document-end
// @grant       none
// ==/UserScript==

// Patch the load element - replicon expects it to be a window, not an iframe
window.load = document.getElementById('load').contentWindow;

// Patch the parameter parsing in jsLoaderObject.loadFrom() - inline comments break it
window.nocomments = function(s) {
   return s.replace(/\s*\/\*.*?\*\/\s*/g, '');
};
var loader = window.jsLoader.jsLoaderObject,
    lf = '(' + loader.loadFrom.toString()
      .replace('function jsLoaderObject_loadFrom', 'function')
      .replace(/var body/g, 'o = nocomments(o); var body') + ')';
loader.loadFrom = eval(lf);
