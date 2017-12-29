// ==UserScript==
// @name        replicon
// @version     0.1
// @description Fix Chrome incompatibilities in Replicon TimeSheet sites
// @author      Greg Toombs
// @namespace   https://github.com/reinderien
// @homepage    https://github.com/reinderien/replicon
// @downloadURL https://raw.githubusercontent.com/reinderien/replicon/master/replicon.js
// @include     /^https?://timesheet\.\w+\.\w+/Timesheet/main\.aspx$/
// @run-at      document-end
// @grant       unsafeWindow
// ==/UserScript==

// Patch the incompatible load element - replicon expects it to be a window, not an iframe
unsafeWindow.load = document.getElementById('load').contentWindow;

// Patch the parameter parsing in jsLoaderObject.loadFrom() - inline comments break it
unsafeWindow.nocomments = function(s) {
   return s.replace(/\s*\/\*.*\*\/\s*/, '');
};
var lf = unsafeWindow.jsLoaderObject_loadFrom.toString()
   .replace('function jsLoaderObject_loadFrom', 'window.jsLoaderObject_loadFrom = function')
   .replace(/var body/g, 'o = nocomments(o); var body');
unsafeWindow.eval(lf);
unsafeWindow.jsLoader.jsLoaderObject.loadFrom = unsafeWindow.jsLoaderObject_loadFrom;
