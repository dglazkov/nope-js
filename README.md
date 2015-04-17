# nope-js
A library that's kind enough to tell you "No" when you need it.

## Getting Started

`npm install`

`npm install --global gulp` (if you don't already have [gulp](http://gulpjs.com/) installed)

`gulp test` to start [karma](http://karma-runner.github.io/) in continuous integration mode.

Write tests! :smiley:

## Requirements

Needs [Chrome 43+](http://updates.html5rocks.com/2015/04/DOM-attributes-now-on-the-prototype) (this is why currently karma is configured to ask for Chrome Canary). If you want to make it for an earlier version or a rendering engine that doesn't keep [DOM properties on prototypes]((http://updates.html5rocks.com/2015/04/DOM-attributes-now-on-the-prototype) ), I am unlikely to take your patches. My apologies -- trying to keep this simple.