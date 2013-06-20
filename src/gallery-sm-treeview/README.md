SmugMug TreeView
=================

A powerful and easy to use TreeView widget for YUI.

Features
--------

<img src="http://f.cl.ly/items/3L3m2n1e1d073y3M2N2X/Image%202012.12.20%2012:26:30%20PM.png" alt="Screenshot of the gorgeous SmugMug TreeView widget" align="right">

* Crazy fast, [as demonstrated in this comparison][jsperf] with a few other YUI TreeView widgets. The SmugMug TreeView can easily handle thousands and thousands of nodes with lightning fast rendering times, even in mobile browsers and IE.

* Memory-efficient. A tree containing over 10,000 nodes consumes less than 8MB of RAM when rendered.

* Comes with an attractive default skin that won't make you claw your eyes out, and is easy to customize via CSS.

* Default skin includes high-res icons that look fantastic on retina displays and other high-dpi devices.

* Behaves just like the native TreeViews users are used to (full keyboard support coming soon).

* Accessible markup for users of screen readers and other assistive tools (not yet fully accessible to keyboard users though -- that's coming soon).

* Supports lazy loading of node children. Just add the [`Y.Plugin.Tree.Lazy`](http://yuilibrary.com/yui/docs/api/classes/Plugin.Tree.Lazy.html) plugin to your TreeView and define an async function that loads and adds child nodes the first time the parent node is opened.

* Supports all modern desktop and mobile browsers, as well as IE8+. Looks like crap in IE6 and IE7, but still works.

Useful Links
------------

* [API Docs][api-docs]
* [Performance Stress Test](http://jsbin.com/udayaz/54/)
* [YUI TreeView Shootout][jsperf]

[api-docs]:http://smugmug.github.com/yui-gallery/api/modules/gallery-sm-treeview.html
[jsperf]:http://jsperf.com/yui-treeview/3

Usage
-----

In your HTML, create a container element for the TreeView. Be sure to add the `yui3-skin-sam` class if you want to use the TreeView's default skin.

```html
<div id="treeview" class="yui3-skin-sam"></div>
```

Load YUI onto the page if you haven't already.

```html
<script src="http://yui.yahooapis.com/3.9.1/build/yui/yui-min.js"></script>
```

Next, in your JS, create an instance of `Y.TreeView`, specify some nodes to add to the tree, then render the view into a container element.

```js
YUI({
    gallery: 'gallery-2013.03.27-22-06'
}).use('gallery-sm-treeview', function (Y) {
    // Create a new TreeView with a few nodes.
    var treeview = new Y.TreeView({
        // Tell the TreeView where to render itself.
        container: '#treeview',

        // Populate the treeview with some tree nodes. You can add or remove
        // nodes later too, so this is optional.
        nodes: [
            {label: 'Node 1'},
            {label: 'Node 2', children: [
                {label: 'Child 1'},
                {label: 'Child 2'}
            ]},
            {label: 'Node 3'}
        ]
    });

    // Render the treeview inside the #treeview element.
    treeview.render();
});
```

The result will look something like this:

![Screenshot of a rendered TreeView](http://f.cl.ly/items/1M0L1H3Q1r0O250x0V3F/Image%202012.12.19%204:27:46%20PM.png)


License
-------

Copyright (c) 2013 SmugMug, Inc.

Redistribution and use of this software in source and binary forms, with or
without modification, are permitted provided that the following conditions are
met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.

  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

  * Neither the name of SmugMug, Inc. nor the names of this project's
    contributors may be used to endorse or promote products derived from this
    software without specific prior written permission of SmugMug, Inc.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
