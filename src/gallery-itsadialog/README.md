gallery-itsadialog
===========



This module adds three sugar Promise-dialogs to the Y-class:


<b>Y.alert()</b> --> dialog with no input-field and only an 'OK'-button.

<b>Y.prompt()</b> --> dialog with input-fields and an 'CANCEL' + 'OK' buttons, or In case of 'login', only an 'OK'-button.

<b>Y.confirm()</b> --> dialog with no input-field confirm-buttons.


All methods return a Promise.


This module is really light-weight: You get these dialogs for an initial <900 bytes (minified an gzipped).

Initially only the available methods are loaded, because, most of the time you won't activate the dialogs immediatly. The rest of the code (5kb) comes lazy-loaded (after 5 seconds), or at demand - if needed sooner.



Examples
--------
[Online example](http://projects.itsasbreuk.nl/examples/itsadialog/index.html)

Documentation
--------------
[API Docs](http://projects.itsasbreuk.nl/apidocs/classes/Y.html)

Usage
-----

<b>example Y.alert()</b>
```js
YUI({gallery: 'gallery-2013.06.20-02-07'}).use('gallery-itsadialog', function(Y) {

    Y.alert('Wow, this is very nice!');

});
```

<b>example Y.confirm() with 'abort-ignore-retry'-buttons</b>
```js
YUI({gallery: 'gallery-2013.06.20-02-07'}).use('gallery-itsadialog', function(Y) {

    Y.confirm('IO-error', 'Read-write failure', {type: 'retry', defaultBtn: 'abort'}).then(
        function(response) {
            // response --> holds the buttonname that has been pressed (in this case 'ignore' or 'retry')
            // ...
        },
        function(reason) {
            // the 'abort' button is pressed, by which the promise is rejected
        }
    );

});
```

<b>example Y.prompt() to retrieve username+password</b>
```js
YUI({gallery: 'gallery-2013.06.20-02-07'}).use('gallery-itsadialog', function(Y) {

    Y.prompt('Login', 'Enter login', {type: 'login'}).then(
        function(response) {
            var username = response.username,
                  password = response.password;
            // ...
        }
        // the current login-dialog does not reject the promise
    );

});
```

License
-------

Copyright (c) 2013 [Its Asbreuk](http://http://itsasbreuk.nl)

[YUI BSD License](http://developer.yahoo.com/yui/license.html)
