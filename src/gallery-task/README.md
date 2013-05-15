YUI 3 Task
==========

This module includes a utility for simplifying the use of promises by making
them behave as synchronous code. It's targeted for Spider Monkey and the latest
versions of V8 (Chrome 29 and upwards) with the `--harmony` flag enabled.

Use it by including the `gallery-task` module and passing a generator function
to the `Y.task` utility:

```JavaScript
YUI({
    gallery: '{latestgallery}'
}).use('json-parse', 'gallery-io-utils', 'gallery-task', function (Y) {
    
    // The function* is the syntax for EcmaScript 6 generators
    Y.task(function* () {
        var data = yield Y.io.getJSON('/foo');
        var result = yield Y.io.postJSON('/bar', {data: data});
        Y.log(result.field);
    });

});
