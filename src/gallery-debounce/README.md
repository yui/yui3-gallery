# Debouncing for YUI [![Build Status](https://travis-ci.org/juandopazo/yui3-debounce.png)](https://travis-ci.org/juandopazo/yui3-debounce)

Debouncing is a similar strategy to throttling (see [yui-throttle](http://yuilibrary.com/yui/docs/api/classes/YUI.html#method_throttle))

`Y.debounce` delays the execution of a function by a certain number
of milliseconds, starting over every time the function is called.
That way it allows you to listen only once to events happening
repeated times over a time span.

For example, you can debounce a callback to a keypress event
so that you know when the user stopped typing:

```JavaScript
Y.one('input').on('keypress', Y.debounce(500, function () {
    alert('The user stopped typing');
}));
```
