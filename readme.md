# replicon

## Introduction

[Replicon](https://www.replicon.com) sells "time intelligence" products to companies. One
such product is their "Replicon Web Timesheet: Project & Billing Edition, Time & Attendance
Edition". This is a web product often installed as a sub-domain of a company's internet or
intranet site.

The product has severe but easy-to-fix compatibility issues, hence this project.

This is a [Greasemonkey](https://www.greasespot.net) script written and tested for 
[TamperMonkey](https://tampermonkey.net) on Chrome. It has not been tested on any other
platform. It fixes all known Chrome incompatibilities for Replicon Timesheet sites.

## Usage

This script fixes the aforementioned Replicon products from the outside, for your Chrome
browser only. It does not affect the server at all, nor does it affect any other clients.
To use it,

1. Install [Chrome Browser](https://www.google.com/chrome/browser/desktop/index.html).
2. Install [TamperMonkey](https://tampermonkey.net) plugin on Chrome.
3. Install replicon.js to TamperMonkey.

The only way for this to take effect company-wide would be for the Chrome browser, the
TamperMonkey plugin and the Replicon script to be installed on each client. (Or Replicon
themselves could release a patch, but who knows if that's feasible.)

## "Design"

The Replicon product uses the Microsoft-stack ([IIS](https://www.iis.net) +
([ASP](https://www.asp.net)), a scattering of [jQuery](https://jquery.com), and piles and
piles of custom JavaScript found both embedded in pages as well as in separate script files.
Some script files, notably `Timesheet/CombineScripts.axd`, are auto-generated and take huge
query parameters. (AXD files are ASP.net AJAX toolkit HTTP handlers.)

Of the many thousands of lines of JavaScript, there is a mix of whitespace-minified and
non-minified code. None of it has been obfuscated.

The site also relies quite heavily on dynamically manipulated iframes, in turn used by a
home-grown dependency loading system. No AJAX requests appear to have been used.

## Compatibility

### Internet Explorer

When IE Compatibility View is enabled for the site, regardless of emulation version (5, 7, 8,
9, 10 or Edge), it works.

When IE Compatibility View is disabled, different emulation modes exhibit different behaviours. The site
works under Edge emulation. On all other versions (IE 5, 7, 8, and 9), the following line fails:

```
if (GUI_getBrowserType()=="Mozilla") {
   this.timesheetDocument.captureEvents(Event.MOUSEMOVE);
```

This throws an "Event is undefined" error. It's mis-identifying the browser as being Mozilla-based. The
links on the bottom (Print, Copy From, Save, Cancel and Submit) are then missing. This
GreaseMonkey script does not fix this issue.

### Chrome

The inner iframe hangs on "Generating Timesheet..." despite the fact that `window.body.location` is
successfully modified.

