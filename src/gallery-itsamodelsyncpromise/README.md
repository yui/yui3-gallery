gallery-itsamodelsyncpromise
============================


This module comes with the extention Y.ITSAModelSyncPromise

Extends Y.Model with Promised sync-methods. The synclayer can be made just as usual. But instead of calling
Model.load and Model.save and Model.destroy, you can use:

* Model.<b>loadPromise()</b>
* Model.<b>savePromise()</b>
* Model.<b>submitPromise()</b>
* Model.<b>destroyPromise()</b>


All methods return Promises.

Examples
--------
[Online example](http://projects.itsasbreuk.nl/examples/itsamodelsyncpromise/index.html)

Documentation
--------------
[API Docs](http://projects.itsasbreuk.nl/apidocs/classes/ITSAModelSyncPromise.html)

Usage
-----

<b>Loading Model-data with Model.loadPromise</b>
```js
YUI().use('model', 'gallery-itsamodelsyncpromise', 'base-build', function(Y) {

    var piemodel;
    Y.PieModel = Y.Base.create('pieModel', Y.Model, [], {
        // ... create Y.PieModel just as the example on http://yuilibrary.com/yui/docs/model/#the-sync-method specifies ...
    });
    piemodel = new Y.PieModel({...});

    piemodel.loadPromise().then(
        function(response, options) {
            // we are sure now that the Model has its attributes read.
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
