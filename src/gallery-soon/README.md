gallery-soon
============

[![Travis Build Status](https://travis-ci.org/solmsted/gallery-soon.png)](https://travis-ci.org/solmsted/gallery-soon)


Getting Started
---------------

`Y.soon` is YUI's method for scheduling an asynchronous operation that runs as
soon as possible. In environments where it's supported, `soon` is a wrapper on
top of `setImmediate`. Where it's not supported, it falls back to
`setTimeout(fn, 0)`.

This module extends `soon`'s behavior to make use of faster scheduling options
provided by browsers. These methods are not designed for scheduling a task and
so their behavior may change as standards evolve.

`gallery-soon` specifically uses under the hood:

 * `MutationObserver`. A method for observing changes in DOM nodes.
 * `postMessage`. A cross-frame messaging mechanism.
 * `MessageChannel`. A friendly version of `postMessage` that doesn't pollute
 a global event.

Using this module
-----------------

To use this module, look up the corresponding YUI Gallery build tag and include
`gallery-soon` in your `YUI().use()` statement:

```js
YUI({
    gallery: '{gallery-tag}'
}).use('gallery-soon', 'promise', function (Y) {
    
    // promises are sped up!

});
```

Alternatively, if you're self-hosting this module you can use YUI's configuration
to make it load `gallery-soon` automatically every time you request the `timers`
module:

```js
YUI({
    modules: {
        'gallery-soon': {
            path: '...',
            condition: {
                trigger: 'timers'
            }
        }
    }
}).use('timers', function (Y) {
    // ...
});
```
