gallery-itsaviewmodel
=====================


<b<Widget Y.ITSAViewModel</b>

This widget renderes Y.Model-instances -or just plain objects- inside the widgets contentBox.
It uses Y.View under the hood, where Y.View.container is bound to the 'contentBox'. The render-method must be defined
by the widget's attribute 'template'. The Model (or object) must be set through the attribute 'model'.


Events can be set through the attribute 'events' and follow the same pattern as Y.View does. As a matter of fact, all attributes
(template, model, events) are passed through to the widgets Y.View instance (which has the property 'view').


Using this widget is great to render Model on the page, where the widget keeps synced with the model. Whenever a new Model-instance
is attached to the widget, or another template is used, the wodget will be re-rendered automaticly.


Attaching Y.Model-instances or objects?

Both can be attached. Whenever widgetattribute change, the widget will be re-rendered is needed (template- or model-attribute). This also
counts for attached objects. However, changes inside an object itself (updated property-value) cannot be caught by the widget, so you need
to call syncUI() yourself after an object-change. Y.Model-instances -on the other hand- do fire a *:change-event which is caught by the widget.
This makes the widget re-render after a Model-instance changes some of its attributes.


Creating an editable modelview:
By plugin Y.Plugin.ITSAEditModel and setting the attribute 'modelEditable' to true, you create an editable Model.
[See ITSAEditModel](src/gallery-itsaeditmodel). This will also automaticly plugin [Y.Plugin.ITSATabKeyManager](src/gallery-itsatabkeymanager).


By default, the widget comes with its own style. You can disable this by setting the attribute 'styled' to false.


Examples
--------
[Online example](http://projects.itsasbreuk.nl/examples/itsaviewmodel/index.html)

Documentation
--------------
[API Docs](http://projects.itsasbreuk.nl/apidocs/classes/ITSAViewModel.html)

Usage
-----

<b>ITSAViewModel with Y.Lang.sub as template:</b>
```js
YUI().use('model', 'gallery-itsaviewmodel', function(Y) {

    var viewmodel, model, modeltemplate;
    model = new Y.Model({
        artist: 'Madonna',
        country: 'USA'
    });
    modeltemplate = '{artist}<br />{country}';

    viewmodel = new Y.ITSAViewModel({
        boundingBox: "#myview",
        width:'280px',
        height:'284px',
        template: modeltemplate,
        model: model
    });
    viewmodel.render();

});
```

<b>ITSAViewModel with Y.Template.Micro as template:</b>
```js
YUI().use('model', 'gallery-itsaviewmodel', function(Y) {

    var viewmodel, model, modeltemplate;
    model = new Y.Model({
        artist: 'Madonna',
        firstAlbum: 'Madonna',
        firstAlbumRelease: 1983,
        firstAlbumTracks: [
            'Lucky star',
            'Borderline',
            'Burning up',
            'I know it',
            'Holiday',
            'Think of me',
            'Physical attraction',
            'Everybody'
        ]
    });
    modeltemplate =
        '‹b›Artist:‹/b› ‹%= data.artist %›‹br /›'+
        '‹b›First album:‹/b› ‹%= data.firstAlbum %›‹br /›'+
        '‹b›Released:‹/b› ‹%= data.firstAlbumRelease %›‹br /›'+
        '‹b›tracknumbers:‹/b› '+
            '‹ul class="tracks"›'+
            '‹% Y.Array.each(data.firstAlbumTracks, function (track, i) { %›'+
                '‹li class="‹%= i % 2 ? \'odd\' : \'even\' %›"›'+
                    '‹%= track %›'+
                '‹/li›'+
            '‹% }); %›'+
        '‹/ul›';

    viewmodel = new Y.ITSAViewModel({
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
