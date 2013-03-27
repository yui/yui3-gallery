gallery-itsascrollviewkeynav
============================


Plugin Y.Plugin.ITSAScrollViewKeyNav


Plugin that enables scrollview-navigation with keys.

In order to response to key-events, the scrollview-instance needs to have focus. This can be set either by myScrollView.focus() -or blur()-
or by setting the attribute 'initialFocus' to true. The plugin also works when Plugin.ScrollViewPaginator is plugged-in. The behaviour will be
different, because the scrolling is paginated in that case.


If this plugin is plugged into a Y.ITSAScrollViewModellist-instance, then the keynavigation will scroll through the items in case
the attribute 'modelsSelectable' is set to true.


Examples
--------
[Online example](http://projects.itsasbreuk.nl/examples/itsascrollviewkeynav/index.html)

Documentation
--------------
[API Docs](http://projects.itsasbreuk.nl/apidocs/classes/ITSAScrollViewKeyNav.html)

Usage
-----

<b>Initial focus (immediate response to key-events):</b>
```js
YUI().use('scrollview', 'gallery-itsascrollviewkeynav', function(Y) {

    var scrollView = new Y.ScrollView({
            srcNode: '#scrollview-content',
            height: 500,
            axis: 'y'
        });

    scrollView.plug(Y.Plugin.ITSAScrollViewKeyNav, {initialFocus: true});
    scrollView.render();

});
```

<b>No initial focus, but focus later on (response to key-events after 5 seconds)</b>
```js
YUI().use('scrollview', 'gallery-itsascrollviewkeynav', function(Y) {

    var scrollView = new Y.ScrollView({
            srcNode: '#scrollview-content',
            height: 500,
            axis: 'y'
        });

    scrollView.plug(Y.Plugin.ITSAScrollViewKeyNav);
    scrollView.render();

    Y.later(
        5000,
        scrollView,
        scrollView.focus
    );

});
```

License
-------

Copyright (c) 2013 [Its Asbreuk](http://http://itsasbreuk.nl)

[YUI BSD License](http://developer.yahoo.com/yui/license.html)
