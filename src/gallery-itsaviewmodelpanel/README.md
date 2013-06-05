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

With this, you get ITSAViewModel inside a Panel (which floats by default). Also has standard a 'close'-button. Using WidgetButtons functionalyties, more buttons can be added. It is basicly the same extention that Y.Panel gives to Y.Widget.


These buttons are available by the module and will call Model's corresponding methods:

 * close   --> fires 'model:closeclick' (visible by default)
 * add     --> fires 'model:addclick'     --> no e.promise, because no serversync
 * reset   --> fires 'model:resetclick'   --> no e.promise, because no serversync
 * destroy --> fires 'model:destroyclick' --> look at e.promise to handle the resolve-method
 * save    --> fires 'model:saveclick'    --> look at e.promise to handle the resolve-method
 * submit  --> fires 'model:submitclick'  --> look at e.promise to handle the resolve-method


<b>Caution:</b>If you use the 'add'-button, then -in order to work properly- you need to take care of (see examples):
* declaring the attribute 'newModelClass' (extention of Y.Model)
* define a sync-layer at the class-level of 'newModelClass'
<i>Do not create a synclayer at instance-level, because any new created Model will loose the synclayer.</i>


All other functionality is inherited from [Y.ITSAViewModel](../gallery-itsaviewmodel).

ITSAViewModelPanel is extremely useful in conjunction with [Y.ITSAEditModel](../gallery-itsaeditmodel).


Examples
--------
[Online example](http://projects.itsasbreuk.nl/examples/itsaviewmodelpanel/index.html)

Documentation
--------------
[API Docs](http://projects.itsasbreuk.nl/apidocs/classes/ITSAViewModelPanel.html)

Usage
-----

<b>Standard usage ITSAViewModelPanel:</b>
```js
YUI({gallery: 'gallery-2013.05.29-23-38'}).use('model', 'gallery-itsaviewmodelpanel', function(Y) {

    var viewmodel, model, modeltemplate;
    model = new Y.Model({
        artist: 'Madonna',
        country: 'USA'
    });
    modeltemplate = '{artist}<br />{country}';

    viewmodel = new Y.ITSAViewModelPanel({
        width:'280px',
        centered: true,
        dragable: true,
        title: 'Artist',
        template: modeltemplate,
        model: model
    });
    viewmodel.render();

});
```

<b>ITSAViewModelPanel with extra buttons:</b>
```js
YUI({gallery: 'gallery-2013.05.29-23-38'}).use('model', 'gallery-itsaviewmodelpanel', function(Y) {

    var viewmodel, model, modeltemplate;
    model = new Y.Model({
        artist: 'Madonna',
        country: 'USA'
    });
    modeltemplate = '{artist}<br />{country}';

    //-- you might want to setup your Model-synclayer here --------
    model.sync = function (action, options, callback) {
        callback();
    };
    //-------------------------------------------------------------

    viewmodel = new Y.ITSAViewModelPanel({
        width:'280px',
        centered: true,
        dragable: true,
        title: 'Artist',
        template: modeltemplate,
        model: model,
        buttons: ['close', 'destroy']
    });
    viewmodel.render();

    // 'destroy' will sync to the server, so we listen for e.promise
    viewmodel.after(
        ['model:destroyclick'],
        function(e) {
            var destroyPromise = e.promise;
            destroyPromise.then(
                // resolved:
                function(response, options) {
                    // the model is succesfully destroyed on the server here
                    ...
                },
                // rejected:
                function(err) {
                    // error during destroyed on the server
                    ...
                }
            );
        }
    );

});
```

<b>ITSAViewModelPanel in conjunction with ITSAEditModel:</b>
```js
YUI({gallery: 'gallery-2013.05.29-23-38'}).use('model', 'base-build', 'gallery-itsaviewmodelpanel', 'gallery-itsaeditmodel', function(Y) {

    var viewmodel, model, modeltemplate, editmodeltemplate;

    //-- extendding Y.Model to create a class with its own synclayer --------
    Y.MyModel = Y.Base.create('myModel', Y.Model, [], {
        sync: function (action, options, callback) {
            // define your own synclayer here
            callback();
        }
    }, {
        ATTRS: {
            artist: {
                value: 'new artist'
            },
            country: {
                value: 'enter Country'
            }
        }
    });
    //------------------------------------------------------------------------
    model = new Y.MyModel({
        artist: 'Madonna',
        country: 'USA'
    });
    modeltemplate = '{artist}<br />{country}';
    editmodeltemplate = '<table><tbody>'+
                        '<tr><td><label>artist:</label></td><td>{artist}</td></tr>'+
                        '<tr><td><label>country:</label></td><td>{country}</td></tr>'+
                        '</tbody></table>';
    editmodelConfigAttrs = {
        artist: {type: 'input'},
        country: {type: 'input'}
    };

    model.plug(Y.Plugin.ITSAEditModel, {template: editmodeltemplate, editmodelConfigAttrs: editmodelConfigAttrs});

    viewmodel = new Y.ITSAViewModelPanel({
        width:'280px',
        centered: true,
        dragable: true,
        title: 'Artist',
        template: modeltemplate,
        model: model,
        modelEditable: true,
        actionAfterSave: 1,  // <-- will cause the panel to close after save
        newModelClass: Y.MyModel,
        buttons: ['close', 'reset', 'add', 'save']
    });
    viewmodel.render();

    // only 'save' will sync to the server, so we listen for e.promise
    viewmodel.after(
        ['model:saveclick'],
        function(e) {
            var savePromise = e.promise;
            savePromise.then(
                // resolved:
                function(response, options) {
                    // the model is succesfully saved on the server here
                    ...
                },
                // rejected:
                function(err) {
                    // error during saving on the server
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
