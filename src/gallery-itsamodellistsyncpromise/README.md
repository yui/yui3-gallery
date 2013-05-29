gallery-itsamodellistsyncpromise
======================


This module comes with the extention Y.ITSAModellistSyncPromise


Extends Y.ModelList with Promised sync-methods. The ModelList's synclayer can be made just as usual, defining these actions:


 * 'create'
 * 'destroy'
 * 'read'
 * 'readappend'
 * 'save'
 * 'submit'
 * 'update'


Instead of calling ModelList.load() you should use:


<b>ModelList.loadPromise(options)</b> --> to append the read-models --> options = {append: true};


Also, there are 3 extra Promises, which -in this current version- <b>all depends</b> on the Model's synclayer, not ModelLists synclayer:

* <b>ModelList.destroyPromise()</b><br />
* <b>ModelList.savePromise()</b><br />
* <b>ModelList.submitPromise()</b>


All methods return Promises.

Examples
--------
[Online example](http://projects.itsasbreuk.nl/examples/itsamodellistsyncpromise/index.html)

Documentation
--------------
[API Docs](http://projects.itsasbreuk.nl/apidocs/classes/ITSAModellistSyncPromise.html)

Usage
-----

<b>Loading Models with ModelList.loadPromise()</b>
```js
YUI().use('model', 'model-list', 'gallery-itsamodellistsyncpromise', 'base-build', function(Y) {

    var pielist;
    Y.PieModel = Y.Base.create('pieModel', Y.Model, [], {
        // ... you might want to set  up the sync-layer, but ModelList.loadPromise doesn't call the 'read' method of every separate Y.PieModel
        // instead, it calls its own ModelList synclayer
    });
    Y.PieList = Y.Base.create('pieList', Y.ModelList, [], {
        model: Y.PieModel,
        // ... create Y.PieList just as the example on http://yuilibrary.com/yui/docs/model-list/#the-sync-method specifies ...
        // define the right methods for the action 'read'
    });
    pielist = new Y.PieList({...});

    pielist.loadPromise().then(
        function(response, options) {
            // we are sure now pielist is filled with all PieModels.
            // we could read 'response' or 'options', but don't need to
        },
        function(reason) {
            // 'reason' gives you the reason why loading has failed
        }
    );

});
```

<b>Appending Models with ModelList.loadPromise()</b>
```js
YUI().use('model', 'model-list', 'gallery-itsamodellistsyncpromise', 'base-build', function(Y) {

    var pielist;
    Y.PieModel = Y.Base.create('pieModel', Y.Model, [], {
        // ... you might want to set  up the sync-layer, but ModelList.loadPromise doesn't call the 'read' method of every separate Y.PieModel
        // instead, it calls its own ModelList synclayer
    });
    Y.PieList = Y.Base.create('pieList', Y.ModelList, [], {
        model: Y.PieModel,
        // ... create Y.PieList just as the example on http://yuilibrary.com/yui/docs/model-list/#the-sync-method specifies ...
        // define the right methods for the action 'readappend'.
    });
    pielist = new Y.PieList({...});

    pielist.loadPromise({append: true}).then(
        function(response, options) {
            // we are sure now pielist is appended with all PieModels.
            // we could read 'response' or 'options', but don't need to
        },
        function(reason) {
            // 'reason' gives you the reason why appending has failed
        }
    );

});
```

<b>Saving Models with ModelList.savePromise()</b>
```js
YUI().use('model', 'model-list', 'gallery-itsamodellistsyncpromise', 'base-build', function(Y) {

    var pielist;
    Y.PieModel = Y.Base.create('pieModel', Y.Model, [], {
        // ... create Y.PieModel just as the example on http://yuilibrary.com/yui/docs/model/#the-sync-method specifies ...
        // define the right methods for the action 'create' and 'update'
    });
    Y.PieList = Y.Base.create('pieList', Y.ModelList, [], {
        model: Y.PieModel,
        // ... you cannot use ModelList's sync-layer for saviing all models at once. Instead setup the Model-synclayer
    });
    pielist = new Y.PieList({...});

    pielist.savePromise().then(
        function(response, options) {
            // we are sure now that the ModelList has saved all modified PieModels.
            // we could read 'response' or 'options', but don't need to
        },
        function(reason) {
            // 'reason' gives you the reason why loading has failed
        }
    );

});
```

License
-------

Copyright (c) 2013 [Its Asbreuk](http://http://itsasbreuk.nl)

[YUI BSD License](http://developer.yahoo.com/yui/license.html)
