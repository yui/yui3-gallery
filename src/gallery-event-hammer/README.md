gallery-event-hammer
====================

This module lets you leverage all gesture events from [HammerJS](eightmedia.github.io/hammer.js/).

## Usage

First, add HammerJS and YUI on the page. HammerJS must be loaded separately as it is not bundled with this module.

```html
<script src="http://yui.yahooapis.com/3.15.0/build/yui/yui-min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/hammer.js/1.0.6/hammer.min.js"></script>
```

Then, you can add `gallery-event-hammer` in your `YUI().use()` statement.

```js
YUI().use('node', 'gallery-event-hammer', function (Y) {

    //Use all the HammerJS gesture goodness
    Y.one('#myNode').on('swipeleft', function (ev) {
        console.log(ev.gesture);
        console.log('swiping left!')
    });

});
```

## Passing in options
You can also pass in [all the options](https://github.com/EightMedia/hammer.js/wiki/Getting-Started#gesture-options) that HammerJS supports in an optional 3rd argument to `on()`:

```js
Y.one('#myNode').on(['drag', 'swipe'], function (ev) {

    if (ev.type === 'drag')
        console.log('dragging!');
    else
        console.log('swiping!');

}, {prevent_default: true, drag_block_vertical: true});
```


## Supported Gestures

All of these:

```js
var HAMMER_GESTURES = [
    'hold',
    'tap',
    'doubletap',
    'drag',
    'dragstart',
    'dragend',
    'dragup',
    'dragdown',
    'dragleft',
    'dragright',
    'swipe',
    'swipeup',
    'swipedown',
    'swipeleft',
    'swiperight',
    'transform',
    'transformstart',
    'transformend',
    'rotate',
    'pinch',
    'pinchin',
    'pinchout',
    'touch',
    'release'
];
```

## Tested on

* **HammerJS 1.0.9**
* Latest Safari
* Latest Chrome
* Latest Firefox
* Android 4.3
* iOS 7.1

## TODO

* Event Delegation
* Lots of code cleanup
* Performance Work around multiple Hammer instances
* Figure out how HammerJS options and YUI Synthetic Event options would work together

## Note

This is more of an experiment for now. Do not use it in code that is important.
