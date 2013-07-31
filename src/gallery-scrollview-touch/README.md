gallery-scrollview-touch
==================

YUI3 ScrollView Touch - module to use CSS scrollviews for touch devices

How to use it
========

    <script src="http://yui.yahooapis.com/3.11.0/build/yui/yui-min.js"></script>
    <script>
    YUI().use("gallery-scrollview-touch", function (Y)
    {
        var scrollview = new Y.ScrollViewTouch({
            srcNode: node,
            axis: 'y',
            width: 100
        });
    });
    </script>

Why this module ?
==============================

Recent mobile browsers allow us, to make scrolls on DOM element (overflow:scroll). W3C is still
working on this subject (http://www.w3.org/Submission/pointer-events/#the-touch-action-css-property),
so this feature is not implemented in a lot of browsers. Only Internet Explorer 10 has it (ms-touch-action),
but webkit has implemented a few months ago, a similar feature named 'webkit-overflow-scrolling'.
Using this two features, we can cover a important percentage of touch devices.

This module is still in progress, and I will appreciate your feedback and your ideas on it.

Benefits
=========

- Scrolls are faster and smoother, because browser render it directly without using JavaScript engine.
- Scrolls respect native UX behavior : on iOs, the scroll 'bounce' when ending, whereas on Android, 
there isn't.


Browsers compatibilities
====================

This module use some new CSS3 features (touch-action and overflow Scrolling) to render
scrollviews. For browsers that can render it, we use the 'classical' scrollviews of
YUI3 (made with Javascript and translate feature).

CSS Scrolls is available on :

- Android Browser 3+
- Safari 5.1+ (iOs 5+)
- Chrome 12+
- Internet Explorer 10+


Arguments
=========

- srcNode (String) : The source node to apply the scrollview

- axis (x|y) : The axis of the scrollview

- width (int): The width of the scrollview to display

- height (int): The height of the scrollview to display

You can also specify the arguments of the Y.Scrollview module (duration, easing, bounce, etc...).
They will be ignored for CSS rendering, but for not-capable devices, fallback scrollviews will be 
rendered with this arguments.