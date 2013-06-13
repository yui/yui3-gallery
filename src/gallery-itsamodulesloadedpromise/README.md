gallery-itsamodulesloadedpromise
======================


<b>Y.usePromise()</b>


This module adds <b>Y.usePromise()</b> to the Y-class.


Equivalent of Y.use(), except that no callback is used, but a Promise


<b>Caution</b>: this is not a replacement of YUI.use(), which creates a new YUI-sandbox.

 It is meant as an replacement of Y.use() which is sometimes called within a YUI-instance.



Documentation
--------------
[API Docs](http://projects.itsasbreuk.nl/apidocs/classes/Y.html)

Usage
-----

<b>Example 1: Lazy-loading a dial-instance</b>
```html
<button id='mybutton'>Click to render Dial</button>
```
```js
YUI({gallery: 'gallery-next'}).use('node', 'gallery-itsamodulesloadedpromise', function(Y) {

    var button, renderdial, mydial;

    button = Y.one('#mybutton');
    renderDial = function() {
        mydial = new Y.Dial();
        mydial.render();
    };

    button.on('click', function() {
        Y.usePromise('dial').then(renderDial);
    });

});
```

<b>Example 2: Lazy-loading multiple widgets</b>
```html
<button id='mybutton'>Click to render Dial</button>
```
```js
YUI({gallery: 'gallery-next'}).use('node', 'gallery-itsamodulesloadedpromise', function(Y) {

    var button, renderWidgets, mydial, myslider;

    button = Y.one('#mybutton');
    renderWidgets = function() {
        mydial = new Y.Dial();
        myslider = new Y.Slider();
        mydial.render();
        myslider.render();
    };

    button.on('click', function() {
        Y.usePromise('dial', 'slider').then(renderWidgets);
    });

});
```

License
-------

Copyright (c) 2013 [Its Asbreuk](http://http://itsasbreuk.nl)

[YUI BSD License](http://developer.yahoo.com/yui/license.html)