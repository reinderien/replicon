# replicon

## Introduction

[Replicon](https://www.replicon.com) sells "time intelligence" products to companies. One such product is their "Replicon Web Timesheet: Project & Billing Edition, Time & Attendance Edition". This is a web product often installed as a sub-domain of a company's internet or intranet site.

The product has severe but easy-to-fix compatibility issues, hence this project.

This is a [Greasemonkey](https://www.greasespot.net) script written and tested for [TamperMonkey](https://tampermonkey.net) on Chrome. It has not been tested on any other platform. It fixes all known Chrome incompatibilities for Replicon Timesheet sites.

## Usage

This script fixes the aforementioned Replicon products from the outside, for your Chrome browser only. It does not affect the server at all, nor does it affect any other clients. To use it,

1. Install [Chrome Browser](https://www.google.com/chrome/browser/desktop/index.html).
2. Install [TamperMonkey](https://tampermonkey.net) plugin on Chrome.
3. Install replicon.js to TamperMonkey.

The only way for this to take effect company-wide would be for the Chrome browser, the TamperMonkey plugin and the Replicon script to be installed on each client. (Or Replicon themselves could release a patch, but who knows if that's feasible.)

## "Design"

The Replicon product uses the Microsoft-stack ([IIS](https://www.iis.net) + [ASP](https://www.asp.net)), a scattering of [jQuery](https://jquery.com), and piles and piles of custom JavaScript found both embedded in pages as well as in separate script files. Some script files, notably `Timesheet/CombineScripts.axd`, are auto-generated and take huge query parameters. (AXD files are ASP.net AJAX toolkit HTTP handlers.)

Of the many thousands of lines of JavaScript, there is a mix of whitespace-minified and non-minified code. None of it has been obfuscated.

The site also relies quite heavily on dynamically manipulated iframes, in turn used by a home-grown dependency loading system. No AJAX requests appear to have been used.

## Internet Explorer issues

When IE Compatibility View is enabled for the site, regardless of emulation version (5, 7, 8, 9, 10 or Edge), it works.

When IE Compatibility View is disabled, different emulation modes exhibit different behaviours. The site works under Edge emulation. On all other versions (IE 5, 7, 8, and 9), the following line fails:

```
if (GUI_getBrowserType()=="Mozilla") {
   this.timesheetDocument.captureEvents(Event.MOUSEMOVE);
```

This throws an "Event is undefined" error. It's mis-identifying the browser as being Mozilla-based. The links on the bottom (Print, Copy From, Save, Cancel and Submit) are then missing.

This GreaseMonkey script does not fix this issue. Trixie is dead and I can't be bothered to investigate [IE7Pro](https://en.wikipedia.org/wiki/IE7Pro).

## Chrome issues

There are two main compatibility issues here.

### iframe hang

The inner iframe hangs on "Generating Timesheet...".

This is due to the way that Replicon interprets `window.load`, where `load` is the ID of an iframe used to perform dynamic GETs. In Internet Explorer, `window.load` evaluates to the inner window of the iframe. Somewhat more sanely, in Chrome, it evaluates to the iframe object itself. The workaround is to assign `window.load` to be the `contentWindow` of the iframe.

### eval faceplant

Another prominent feature of Replicon's design is its propensity to read its own source, parse it, hack on it and re-eval it. In Internet Explorer they've managed to get this working. In Chrome, it fails due to certain types of `function.toString()` source containing comments. The workaround is to strip out inline comments after the source reading step.

## Post-Mortem

I've until now attempted to withhold my editorializing, but here it goes:

I realize this creature is likely a product of its times (poor browser inter-compatibility, patchy support for AJAX, etc.), but there is no excuse to sell and use something like it in 2017. And it is in use.

Debugging this Gordian knot required some truly concerted effort over the Christmas holiday, which was an exercise in archeology, forensics, cryptozoology and exorcism, simultaneously. It didn't help that Internet Explorer developer tools mis-report iframe request initiation, and Chrome developer tools mis-report some variables as being undefined in certain narrow contexts where an `eval` dramatically fails.

Some specific gripes about the design:

- Javascript is already an abomination even when it's used well, and surprise, it isn't here.
- No one uses frames anymore, for a good reason. Especially, don't use frames when you should be doing AJAX.
- Don't hack together your own frame-based chain-loading dependency resolution system. It's both slow and bad.
- Don't abuse eval. Introspection has its (infrequent) use cases, and this is not one. The introspection and re-eval code I've witnessed and fixed here is a cursed abortion from the deepest bowels of hell, a human-centipede-like Lovecraftian horror that will never leave my nightmares.

I can only hope that Replicon kills all of this with cleansing fire and writes something, anything, more sane. I'm not a fan boy of the latest goofy Javascript and Node trends, but anything is better than this.
