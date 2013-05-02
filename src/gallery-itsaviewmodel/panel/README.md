gallery-itsaviewmodelpanel
==========================


Widget Y.ITSAViewModelPanel which extends Y.ITSAViewModel by adding the Panel-functionalities:

* WidgetAutohide
* WidgetButtons
* WidgetModality
* WidgetPosition
* WidgetPositionAlign
* WidgetPositionConstrain
* WidgetStack
* WidgetStdMod

It is basicly the same extention that Y.Panel gives to Y.Widget. See [Y.ITSAViewModel](../gallery-itsaviewmodel) for its functionality.


Examples
--------
[Online example](http://projects.itsasbreuk.nl/examples/itsaviewmodelpanel/index.html)

Documentation
--------------
[API Docs](http://projects.itsasbreuk.nl/apidocs/classes/ITSAViewModelPanel.html)

Usage
-----

```js
YUI().use('model', 'gallery-itsaviewmodelpanel', function(Y) {

    var viewmodel, model, modeltemplate;
    model = new Y.Model({
        artist: 'Madonna',
        country: 'USA'
    });
    modeltemplate = '{artist}<br />{country}';

    viewmodel = new Y.ITSAViewModelPanel({
        boundingBox: "#myview",
        width:'280px',
        height:'284px',
        template: modeltemplate,
        model: model
    });
    viewmodel.render();

});
```

License
-------

Copyright (c) 2013 [Its Asbreuk](http://http://itsasbreuk.nl)

[YUI BSD License](http://developer.yahoo.com/yui/license.html)
