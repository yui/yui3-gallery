YUI3 IO Utils
=============

![Travis Build Status](https://api.travis-ci.org/juandopazo/yui3-io-utils.png)

Extra utilities for doing IO request using promises.

Getting Started
---------------

Create a new YUI instance for your application and populate it with the modules you need by specifying them as arguments to the `YUI().use()` method. YUI will automatically load any dependencies required by the modules you specify. 

```html
<script>
YUI({
    gallery: 'gallery-2013.05.15-21-12'
}).use('gallery-io-utils', function (Y) {
    
    Y.io.getJSON('/foo/bar').then(function (data) {
        console.log(data);
    });

});
</script>
```

API Summary
-----------

IO Utils includes the following functions:

* `Y.io.xhr`. Makes an Ajax request.
* `Y.io.get`. Makes an Ajax request with HTTP method GET.
* `Y.io.post`. Makes an Ajax request with HTTP method POST.
* `Y.io.put`. Makes an Ajax request with HTTP method PUT.
* `Y.io.delete`. Makes an Ajax request with HTTP method DELETE.
* `Y.io.del`. Alias for `Y.io.delete`.
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


Release Notes
-------------

#### gallery-2013.05.15-21-12
* Fixes broken requirements

#### gallery-2013.05.10-00-54
* Requirements are broken in this version
