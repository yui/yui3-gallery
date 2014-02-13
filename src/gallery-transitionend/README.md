transitionend event for YUI
===========================

![Travis Build Status](https://api.travis-ci.org/juandopazo/yui3-transitionend.png)

YUI cross-browser detection for the `transitionend` event.

Getting Started
---------------

Create a new YUI instance for your application and populate it with the modules you need by specifying them as arguments to the `YUI().use()` method. YUI will automatically load any dependencies required by the modules you specify. Then use the `transitionend` event as you would any other DOM event. Additionally a `Y.support.transitionend` property is available to check if the browser supports the event.

```javascript
YUI({
    gallery: 'gallery-2013.05.29-23-38'
}).use('gallery-transitionend', function (Y) {

    if (Y.support.transitionend) {
        Y.one('.fade').on('transitionend', doSomethingAfterTransition);
    } else {
        doSomethingAfterTransition();
    }

    function doSomethingAfterTransition() {
        // ...
    }
    
});
```
