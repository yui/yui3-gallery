YUI3 IO Utils
=============

![Travis Build Status](https://api.travis-ci.org/juandopazo/yui3-io-utils.png)

Extra utilities for doing IO request using promises. Includes the following
functions:

* `Y.io.xhr`. Makes an Ajax request.
* `Y.io.get`. Makes an Ajax request with HTTP method GET.
* `Y.io.post`. Makes an Ajax request with POST method GET.
* `Y.io.put`. Makes an Ajax request with PUT method GET.
* `Y.io.delete`. Makes an Ajax request with DELETE method GET.
* `Y.io.DELETE`. Alias for `Y.io.delete`.
* `Y.io.json`. Makes an Ajax request and parses the result as JSON. Requires the
`json` module.
* `Y.io.getJSON`. Makes an Ajax request with HTTP method GET and parses the
    result as JSON. Requires the `json` module.
* `Y.io.putJSON`. Makes an Ajax request with HTTP method PUT and parses the
    result as JSON. Requires the `json` module.
* `Y.io.postJSON`. Makes an Ajax request with HTTP method POST and parses the
    result as JSON. Requires the `json` module.
* `Y.io.deleteJSON`. Makes an Ajax request with HTTP method DELETE and parses the
    result as JSON. Requires the `json` module.
* `Y.io.jsonp`. Makes a JSONP request. Requires the `jsonp` module.
* `Y.io.script`. Loads a script.
* `Y.io.css`. Loads a CSS stylesheet.

All these functions return a promise. See [the API Docs](http://juandopazo.github.io/yui3-io-utils/api/classes/io.html) for more details.

### Example

To start include the `gallery-io-utils` module.

```JavaScript
YUI({
    gallery: 'gallery-2013.05.10-00-54'
}).use('gallery-io-utils', function (Y) {
    
    Y.io.getJSON('/foo/bar').then(function (data) {
        console.log(data);
    });

});
```

### Note to those using version 0.0.1

Requirements are broken in this release. You can still use it by doing
`YUI(...).use('io-base', 'promise', 'gallery-io-utils', ...)`.
