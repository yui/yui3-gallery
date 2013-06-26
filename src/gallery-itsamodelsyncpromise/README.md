gallery-itsamodelsyncpromise
============================


This module comes with Y.ITSAModelSyncPromise which extends Y.Model with Promised sync-methods.
The synclayer can be made just as usual. But instead of calling
Model.load and Model.save and Model.destroy, you can use:

* Model.<b>loadPromise()</b>
* Model.<b>savePromise()</b>
* Model.<b>submitPromise()</b>
* Model.<b>destroyPromise()</b>


All methods return Promises.


The module also introduces <b>syncPromise</b> which could be used instead of sync(). When syncPromise() is defined,
all sync-methods will use syncPromise() instead.


syncPromise() is a method that should be set-up the same way as sync(), except its actions should return promises.
<b>gallery-io-utils</b> is the perfect module that returns Promises that can be used in conjunction with this module.
See the examples.


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
YUI({gallery: 'gallery-2013.05.29-23-38'}).use('model', 'gallery-itsamodelsyncpromise', 'base-build', function(Y) {

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

<b>Loading Model-data with using the syncPromise-layer</b>
```js
YUI({gallery: 'gallery-2013.05.29-23-38'}).use('model', 'gallery-itsamodelsyncpromise', 'gallery-io-utils', base-build', function(Y) {

    var piemodel;
    Y.PieModel = Y.Base.create('pieModel', Y.Model, [], {
        syncPromise: function (action, options) {
            if (action==='read') {
                return Y.io.get('http://mydomain.com/getdata.php?modelid='+this.get('id'));
            }
            // do not forget to reject the promise in case an invalid 'action' is defined
            return new Y.Promise(function (resolve, reject) {
                reject(new Error('The syncPromise()-method was is called with undefined action: '+action));
            });
        }
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
