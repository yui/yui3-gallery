gallery-itsawidgetrenderpromise
=====================


<b>Widget.renderPromose()</b>


This module adds <b>Widget.renderPromise()</b> to the Y.Widget class.

By using this Promise, you don't need to listen for the 'render'-event, neither look for the value of the attribute 'rendered'.



Examples
--------
[Online example](http://projects.itsasbreuk.nl/examples/itsawidgetrenderpromise/index.html)

Documentation
--------------
[API Docs](http://projects.itsasbreuk.nl/apidocs/classes/Y.Widget.html)

Usage
-----

<b>Using renderPromise() for one widget</b>
```js
YUI({gallery: 'gallery-next'}).use('dial', 'gallery-itsawidgetrenderpromise', function(Y) {

    var mydial = new Y.Dial().render();
    mydial.renderPromise().then(
        function() {
            // .. here we can place some code: we are sure mydial is rendered.
        }
    );

});
```

<b>Using renderPromise() to display a div with for multiple widgets</b>
```css
.yui3-js-enabled .notrendered {
    visibility: hidden;
}
```

```html
<div id='toolbar' class='notrendered'>
    <div id='dial1'></div>
    <div id='dial2'></div>
    <div id='dial3'></div>
</div>
```

```js
YUI({gallery: 'gallery-next'}).use('node-base', 'dial', 'gallery-itsawidgetrenderpromise', 'promise', function(Y) {

    var dial1, dial2, dial3;

    dial1 = new Y.Dial().render('#dial1');
    dial2 = new Y.Dial().render('#dial2');
    dial3 = new Y.Dial().render('#dial3');

    Y.batch(
        dial1.renderPromise(),
        dial2.renderPromise(),
        dial3.renderPromise()
    ).then(
        function() {
            Y.one('#toolbar').removeClass('notrendered');
        }
    );

});
```

License
-------

Copyright (c) 2013 [Its Asbreuk](http://http://itsasbreuk.nl)

Special thanks to Jeff Pinach - http://http://fromanegg.com :)

[YUI BSD License](http://developer.yahoo.com/yui/license.html)
