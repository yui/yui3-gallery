gallery-itsaviewmodellistpanel
==============================


Widget Y.ITSAViewModellistPanel which extends Y.ITSAViewModellist by adding the Panel-functionalities:

* WidgetAutohide
* WidgetButtons
* WidgetModality
* WidgetPosition
* WidgetPositionAlign
* WidgetPositionConstrain
* WidgetStack
* WidgetStdMod

It is basicly the same extention that Y.Panel gives to Y.Widget. See [Y.ITSAViewModellist](../gallery-itsaviewmodellist) for its functionality.

Examples
--------
[Online example](http://projects.itsasbreuk.nl/examples/itsaviewmodellistpanel/index.html)

Documentation
--------------
[API Docs](http://projects.itsasbreuk.nl/apidocs/classes/ITSAViewModellistPanel.html)

Usage
-----

<b>View rendered as unsorted list</b>
```html
<div id='myscrollview' class='itsa-modellistview-noinitialitems'></div>
```
```js
YUI({gallery: 'gallery-2013.02.27-21-03'}).use('gallery-itsaviewmodellistpanel', 'lazy-model-list', function(Y) {
var myModellist, rendermodel, groupheader, myView;

myModellist = new Y.LazyModelList();
myModellist.add([
    {Country: 'The Netherlands'},
    {Country: 'USA'},
    {},
    ....
]);

rendermodel = '{Country}';
groupheader = '<%= data.Country.substr(0,1) %>';

myView = new Y.ITSAViewModellistPanel({
    boundingBox: "#myscrollview",
    height:'600px',
    width:'240px',
    modelTemplate: rendermodel,
    groupHeader1: groupheader,
    modelList: myModellist
});

myView.render();

});
```

Custom styling
--------------

See [Y.ITSAViewModellist](../gallery-itsaviewmodellist).

License
-------

Copyright (c) 2013 [Its Asbreuk](http://http://itsasbreuk.nl)

[YUI BSD License](http://developer.yahoo.com/yui/license.html)