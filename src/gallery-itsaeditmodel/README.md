gallery-itsaeditmodel
=====================

Plugin for Y.Model that extends Y.Model-instances into having editable properties.
After pluged-in, Each property can be rendered into a form-element by using: <b>yourModel.itsaeditmodel.formelement()</b>
You can also retreive a copy of the model's (or object's) attributes with: <b>yourModel.itsaeditmodel.toJSON()</b>


You may not need to call the plugin's methods yourself, but want to use one of the next 3 view-widgets who do this automaticly:

* [ITSAViewModel](../gallery-itsaviewmodel) --> you need to plug this plugin into to viewed model
* [ITSAViewModelList](../gallery-itsaviewmodellist) --> you need [Y.Plugin.ITSAChangeModelTemplate](../gallery-itsachangemodeltemplate) to activate editmode
* [ITSAScrollViewModelList](../gallery-itsascrollviewmodellist) --> you need [Y.Plugin.ITSAChangeModelTemplate](../gallery-itsachangemodeltemplate) to activate editmode


##Custom buttons
The plugin can create form-elements of all Model's-attributes. It also can create the next UI-buttons: <i>button, add, submit, save, destroy, stopedit</i>. In order to do so, you must declare 2 attributes:

* <b>'template'</b> where the Model's-attributes can be between brackets (it uses Y.Lang.sub() for this), or conform the Y.Template.Micro-format. Also the UI-buttons -which are not part of the model- can be declared between brackets: just make sure you use a unique name: '{firstname} {lastname} {send}'.
* <b>'editmodelConfigAttrs'</b> this is the configuration by which the plugin determines what type must be used for all specified properties within 'template'


##Events
The custom buttons have their defaultFunction which correspons with their names. When listening to these events, you catch a buttonclick immediately, but
the real action may take some time. The action performed are <b>not</b> model.load etc, but model.loadPromise, which is supplied by [ITSAModelSyncPromise](../gallery-itsamodelsyncpromise). Some defaultfunctions will add e.promise to the eventTarget:

* button   --> event 'model:buttonclick'
* add      --> event 'model:addclick'
* stopedit --> event 'model:stopeditclick'
* submit   --> event 'model:submitclick'  --> e.promise
* save     --> event 'model:saveclick'    --> e.promise
* destroy  --> event 'model:destroyclick' --> e.promise

Because the defaultfunctions adds the promises to eventTarget, you need to listen for these using the model.after() events, not model.on().

Examples
--------
[Online example](http://projects.itsasbreuk.nl/examples/itsaeditmodel/index.html)

Documentation
--------------
[API Docs](http://projects.itsasbreuk.nl/apidocs/classes/ITSAEditModel.html)

Usage
-----

<b>Usage in conjunction with ITSAViewModel</b>
```js
YUI().use('model', 'gallery-itsaviewmodel', 'gallery-itsaeditmodel', datatype-date-format', function(Y) {

    var viewmodel, model, modeltemplate, edittemplate, editmodelConfigAttrs;
    model = new Y.Model({
        artist: 'Madonna',
        country: 'USA',
        firstRelease: new Date(1983, 1, 1)
    });
    modeltemplate = '<%= data.artist %><br />'+
                    '<%= country %><br />'+
                    'First album released: <%= Y.Date.format(data.firstRelease, {format:"%d-%m-%Y"}) %>';
    edittemplate = 'Artist: {artist}<br />'+
                   'Country: {country}<br />'+
                   'First album released: {firstRelease}<br />'+
                   '{cancelButton} {saveButton}';

    editmodelConfigAttrs = {
        artist: {type: 'input'},
        country: {type: 'input'},
        firstRelease: {type: 'date', dateFormat: '%d-%m-%Y'},
        cancelButton: {type: 'stopedit', buttonText: 'cancel'},
        saveButton: {type: 'save', buttonText: 'save'}
    };

    model.plug(Y.Plugin.ITSAEditModel, {template: edittemplate, editmodelConfigAttrs : editmodelConfigAttrs});

    viewmodel = new Y.ITSAViewModel({
        boundingBox: "#myview",
        width:'280px',
        height:'284px',
        template: modeltemplate,  // <-- is NOT the active template, because edittemplate is used. But you can turn back to this one.
        modelEditable: true,
        model: model
    });
    viewmodel.render();

});
```

<b>Usage in conjunction with ITSAScrollViewModellist</b>
```js
YUI({gallery: 'gallery-2013.02.27-21-03'}).use('gallery-itsascrollviewmodellist', 'gallery-itsachangemodeltemplate', 'lazy-model-list', function(Y) {
var myModellist, rendertemplate, myScrollview, editmodeltemplate, editmodelConfigAttrs, configForEditModel, changeModelTemplateConfig;

//----- defining the LazyModelList -----------------------------------------------------

myModellist = new Y.LazyModelList();
myModellist.comparator = function (model) {
    return model.Country.toUpperCase();
};
myModellist.add([
    {Country: 'The Netherlands'},
    {Country: 'USA'},
    {},
    ....
]);

//--------------------------------------------------------------------------------------

rendertemplate = '{Country} <button type="button" class="yui3-button edittemplate">edit</button>';

myScrollview = new Y.ITSAScrollViewModellist({
    boundingBox: "#myscrollview",
    height:'600px',
    width:'240px',
    modelTemplate: rendertemplate,
    axis: 'y',
    modelList: myModellist
});

//----- defining everything we need to know about Y.Plugin.ITSAChangeModelTemplate -----

editmodeltemplate = 'continental: {Continental}<br />'+
                        'country: {Country}<br />'+
                        '{Reset} {Close} {Save}';

editmodelConfigAttrs = {
    Continental: {type: 'input', selectOnFocus: true},
    Country: {type: 'textarea', initialFocus: true},
    Reset: {type: 'reset', buttonText: 'reset'},
    Close: {type: 'stopedit', buttonText: 'close'},
    Save: {type: 'save', buttonText: 'save'}
};

configForEditModel = {
    updateMode: 1
};

changeModelTemplateConfig = {
    editTemplate: editmodeltemplate,
    editmodelConfigAttrs: editmodelConfigAttrs,
    configForEditModel: configForEditModel
};

//--------------------------------------------------------------------------------------

scrollview.plug(Y.Plugin.ITSAChangeModelTemplate, changeModelTemplateConfig);

myScrollview.render();

//--------------------------------------------------------------------------------------

});
```

<b>Using events</b>
```js
YUI().use('model', 'gallery-itsaviewmodel', 'gallery-itsaeditmodel', datatype-date-format', function(Y) {

    var viewmodel, model, modeltemplate, edittemplate, editmodelConfigAttrs;
    model = new Y.Model({
        artist: 'Madonna',
        country: 'USA',
        firstRelease: new Date(1983, 1, 1)
    });
    modeltemplate = '<%= data.artist %><br />'+
                    '<%= country %><br />'+
                    'First album released: <%= Y.Date.format(data.firstRelease, {format:"%d-%m-%Y"}) %>';
    edittemplate = 'Artist: {artist}<br />'+
                   'Country: {country}<br />'+
                   'First album released: {firstRelease}<br />'+
                   '{cancelButton} {saveButton}';

    editmodelConfigAttrs = {
        artist: {type: 'input'},
        country: {type: 'input'},
        firstRelease: {type: 'date', dateFormat: '%d-%m-%Y'},
        cancelButton: {type: 'stopedit', buttonText: 'cancel'},
        saveButton: {type: 'save', buttonText: 'save'}
    };

    model.plug(Y.Plugin.ITSAEditModel, {template: edittemplate, editmodelConfigAttrs : editmodelConfigAttrs});

    viewmodel = new Y.ITSAViewModel({
        boundingBox: "#myview",
        width:'280px',
        height:'284px',
        template: modeltemplate,  // <-- is NOT the active template, because edittemplate is used. But you can turn back to this one.
        modelEditable: true,
        model: model
    });
    viewmodel.render();

    viewmodel.after(
        'model:saveclick',
        function(e) {
            var savePromise = e.promise;
            savePromise.then(
                // resolved:
                function(response, options) {
                    ...
                },
                // rejected:
                function(err) {
                   ...
                }
            );
        }
    );

});
```

License
-------

Copyright (c) 2013 [Its Asbreuk](http://http://itsasbreuk.nl)

[YUI BSD License](http://developer.yahoo.com/yui/license.html)
