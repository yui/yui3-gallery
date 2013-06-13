gallery-itsaerrorreporter
===============


This module full automaticly reports error-events by pop-up an error-dialog.

Catching errors during development (logging) are prominent available now.

Also error-events during production will be shown to the users.


By default it listens to both error-events and error-loggings. Both can be (un)set.



Examples
--------
[Online example](http://projects.itsasbreuk.nl/examples/itsaerrorreporter/index.html)

Documentation
--------------
[API Docs](http://projects.itsasbreuk.nl/apidocs/classes/Y.ITSAErrorReporter.html)

Usage
-----

<b>ErrorReport when fireing an 'error'-event</b>
```js
YUI({gallery: 'next'}).use('gallery-itsaerrorreporter', function(Y) {

    var facade = {src: 'webapplication', msg: 'Simulating an error'};
    Y.fire('error', facade);
    // the event is caught and leads to an error-pop-up

});
```

<b>ErrorReport when logging an 'error'</b>
```js
YUI({gallery: 'next'}).use('gallery-itsaerrorreporter', function(Y) {

    Y.log('logging an error', 'error', 'webapp');
    // the logging is caught and leads to an error-pop-up

});
```

<b>Disabling error-messages when logging an 'error'</b>
```js
YUI({gallery: 'next'}).use('gallery-itsaerrorreporter', function(Y) {

    Y.ITSAErrorReporter.reportErrorLogs(false);
    Y.log('logging an error', 'error', 'webapp');
    // no error-pop-up

});
```

License
-------

Copyright (c) 2013 [Its Asbreuk](http://http://itsasbreuk.nl)

[YUI BSD License](http://developer.yahoo.com/yui/license.html)
