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

With this, you get ITSAViewModellist inside a Panel (which floats by default). Also has standard a 'close'-button. Using WidgetButtons functionalities, more buttons can be added. It is basicly the same extention that Y.Panel gives to Y.Widget.


These buttons are available by the module and will call corresponding methods:

 * close   --> fires 'closeclick' (visible by default)
 * add     --> fires 'addclick'   --> with e.model is the new created Model-instance


<b>Caution:</b>If you use the 'add'-button, then -in order to work properly- you need to take care of (see examples):
* define the property 'modellist.model' (extention of Y.Model)
* define a sync-layer at the class-level of 'modellist.model'-class
* plugin Y.Plugin.ITSAChangeModelTemplate and declare at least 'editTemplate' and 'config', see: [Y.ITSAChangeModelTemplate](../gallery-itsachangemodeltemplate)

All other functionality is inherited from [Y.ITSAViewModellist](../gallery-itsaviewmodellist).

ITSAViewModelPanel is extremely useful in conjunction with the add-button.


Examples
--------
[Online example](http://projects.itsasbreuk.nl/examples/itsaviewmodellistpanel/index.html)

Documentation
--------------
[API Docs](http://projects.itsasbreuk.nl/apidocs/classes/ITSAViewModellistPanel.html)

Usage
-----

<b>Centered Panel:</b>
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
    width:'240px',
    modelTemplate: rendermodel,
    groupHeader1: groupheader,
    centered: true,
    modelList: myModellist
});

myView.render();

});
```

<b>Centered Panel with add-button</b>
```css
.itsa-modellistview-noinitialitems {
    visibility: hidden;
}
```
```html
<div id='myscrollview'></div>
```
```js
YUI({gallery: 'gallery-2013.04.10-22-48'}).use('node', 'base-build', 'gallerycss-cssform', 'lazy-model-list', 'gallery-itsaviewmodellistpanel', 'gallery-itsachangemodeltemplate', 'gallery-itsaeditmodel', function(Y) {

    var lazymodellist = new Y.LazyModelList(),
        modellistPanel;

    //-- extendding Y.Model to create a class with its own synclayer --------
    Y.MyModel = Y.Base.create('myModel', Y.Model, [], {
        sync: function (action, options, callback) {
            // define your own synclayer here
            callback();
        }
    }, {
        ATTRS: {
            Country: {
                value: 'A new Country'
            },
            Continental: {
                value: 'AFRICA'
            }
    }
    });
    //------------------------------------------------------------------------

    lazymodellist.comparator = function (model) {
        return model.Continental + model.Country;
    };

    lazymodellist.add(YUI.Env.countries);

    var modelTemplate = '{Country}';
    var editTemplate = 'Continental: {Continental}<br />'+
                       'Country: {Country}<br />'+
                       '{Close} {Save}';

    var groupHeader1 = '<%= data.Continental.toUpperCase()  %>';
    var groupHeader2 = '<%= data.Country.substr(0,1).toUpperCase() %>';

    modellistPanel = new Y.ITSAViewModellistPanel({
              width:'240px',
              modelListStyled: true,
              modelTemplate: modelTemplate,
              groupHeader1: groupHeader1,
              groupHeader2: groupHeader2,
              title: 'Worlds Countries',
              modelList: lazymodellist,
              modelsIntoViewAfterAdd: 4,
              buttons: ['add', 'close']
    });

    var config = {
        Continental: {type: 'input'},
        Country: {type: 'textarea'},
        Close: {type: 'stopedit', buttonText: 'close'},
        Save: {type: 'save', buttonText: 'save'}
    };

    modellistPanel.model = Y.MyModel;
    modellistPanel.plug(Y.Plugin.ITSAChangeModelTemplate, {newModelMode: 3,  editTemplate: editTemplate, config: config});

    modellistPanel.render();

});
```

Custom styling
--------------

See [Y.ITSAViewModellist](../gallery-itsaviewmodellist).

License
-------

Copyright (c) 2013 [Its Asbreuk](http://http://itsasbreuk.nl)

[YUI BSD License](http://developer.yahoo.com/yui/license.html)