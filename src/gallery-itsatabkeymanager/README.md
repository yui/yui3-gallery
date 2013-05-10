gallery-itsatabkeymanager
========

Plugin that extends [gallery-sm-focusmanager](https://github.com/smugmug/yui-gallery/tree/master/src/sm-focusmanager) by navigate with TAB and Shift-TAB. The plugin needs to be done on a container-Node. By default focusing is done with nodes that have the class <b>'.focusable'</b>, but this can be overruled with the attribite 'itemSelector'.


Examples
--------
[Online example](http://projects.itsasbreuk.nl/examples/itsatabkeymanager/index.html)

Documentation
--------------
[API Docs](http://projects.itsasbreuk.nl/apidocs/classes/ITSATabKeyManager.html)

Usage
-----

<b>Using TAB and Shift-TAB to jump between input-elements</b>
```html
<div id='container'>
    <input type='input' class='focusable' />
    <input type='input' class='focusable' />
    <input type='input' /> <!-- this element will not gain focus by pressing tab -->
    <input type='input' id='lastinput' class='focusable' />
</div>
```
```js
YUI().use('node', 'gallery-itsatabkeymanager', function(Y) {

    var container = Y.one('#container');
    container.plug(Y.Plugin.ITSATabKeyManager);

    container.itsatabkeymanager.setFirstFocus('#lastinput'); // making the last element as the first focusable element
    container.itsatabkeymanager.setSelectText(true); // making the all text to be selected once focussed

    container.focus(); // <-- by focussing the container, the focusmanager will be active on this container

});
```

License
-------

Copyright (c) 2013 [Its Asbreuk](http://http://itsasbreuk.nl)

[YUI BSD License](http://developer.yahoo.com/yui/license.html)