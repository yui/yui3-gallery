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

* Supports lazy loading of node children. Just add the [`Y.Plugin.Tree.Lazy`](http://smugmug.github.com/yui-gallery/api/classes/Plugin.Tree.Lazy.html) plugin to your TreeView and define an async function that loads and adds child nodes the first time the parent node is opened.

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
<script src="http://yui.yahooapis.com/3.8.0/build/yui/yui-min.js"></script>
```

Next, in your JS, create an instance of `Y.TreeView`, specify some nodes to add to the tree, then render the view into a container element.

```js
YUI({
    gallery: 'gallery-2013.01.09-23-24'
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

Working with Tree Nodes
-----------------------

All [`Y.TreeView`][api-treeview] instances extend [`Y.Tree`][api-tree], and every node in a TreeView extends [`Y.Tree.Node`][api-treenode].

A Tree has one `rootNode`, which may have any number of `children`. Each of its children may also have any number of their own children, and so on.

In the same way that HTML elements in the DOM are always associated with a document, tree nodes are always associated with a tree, even if they haven't yet been added to that tree.

[api-tree]:http://smugmug.github.com/yui-gallery/api/classes/Tree.html
[api-treenode]:http://smugmug.github.com/yui-gallery/api/classes/Tree.Node.html
[api-treeview]:http://smugmug.github.com/yui-gallery/api/classes/TreeView.html

### Useful `Y.Tree.Node`Properties

Tree nodes have a variety of properties and methods, the most important of which is probably the `label` property, which specifies an HTML string that will be rendered as the label for the node.

The `children` property is an array that contains zero or more `Y.Tree.Node` instances that are children of the parent node.

The `parent` property always contains a reference to the node's parent node, or `undefined` if the node is the root node of a tree and has no parent.

Consult the API docs for details on all available [`Y.Tree.Node`][api-treenode] properties.

### Adding Nodes

Use the [`append()`][api-append], [`insert()`][api-insert], and [`prepend()`][api-prepend] methods to add nodes to other nodes as children. Each method accepts either a `Y.Tree.Node` instance or a configuration object that will be turned into a `Y.Tree.Node` instance.

After adding the node, each method returns the node that was added.

```js
// For the sake of this example, we'll add children to the root node.
var parent = treeview.rootNode;

// Append a node (it becomes the parent's last child).
parent.append({label: 'appended'});

// Prepend a node (it becomes the parent's first child).
parent.prepend({label: 'prepended'});

// Insert a node at a specific index.
parent.insert({label: 'inserted'}, {index: 1});
```

Alternatively, you may create and add a node in two separate steps.

```js
// Create a node.
var node = treeview.createNode({label: 'New node'});

// Add it to the tree.
treeview.rootNode.append(node);
```

The `append()`, `insert()` and `prepend()` methods also accept arrays, which makes it easy to add multiple nodes at once.

```js
// Add multiple nodes at once.
parent.append([
    {label: 'one'},
    {label: 'two'},
    {label: 'three'}
]);
```

If the node being added already exists as a child of another node, it will be removed from its old parent before being added to its new parent. This is also true for nodes that exist in another tree. A node instance may only exist in one tree at a time, and may only have one parent node (or zero parent nodes if it's a root node).

[api-append]:http://smugmug.github.com/yui-gallery/api/classes/Tree.Node.html#method_append
[api-insert]:http://smugmug.github.com/yui-gallery/api/classes/Tree.Node.html#method_insert
[api-prepend]:http://smugmug.github.com/yui-gallery/api/classes/Tree.Node.html#method_prepend

### Removing Nodes

Use the [`empty()`][api-empty] and [`remove()`][api-remove] methods to remove
nodes from the tree.

```js
// Remove all of this node's children.
node.empty();

// Remove this node (and its children, if any) from its parent node.
node.remove();
```

The `empty()` method returns an array containing all the nodes that were removed (if any), while the `remove()` method is chainable, meaning it always returns the node it's called on.

A node can still be re-added to a tree after it's removed. If you want to both remove a node and ensure that it can't be reused (freeing up memory in the process), set the `destroy` option to `true` when emptying or removing nodes.

```js
// Remove and destroy all of this node's children.
node.empty({destroy: true});

// Remove and destroy this node and all of its children.
node.remove({destroy: true});
```

[api-empty]:http://smugmug.github.com/yui-gallery/api/classes/Tree.Node.html#method_empty
[api-remove]:http://smugmug.github.com/yui-gallery/api/classes/Tree.Node.html#method_remove

TreeView Events
---------------

The TreeView component exposes the following events. Note that all events are
fired on the `Y.TreeView` instance itself, not on `Y.Tree.Node` instances. This
helps keep the nodes light and efficient, since there can be a lot of them.

Event | Fired When
------| ----------
[`add`][api-event-add] | A node is added to the tree.
[`clear`][api-event-clear] | The tree is cleared.
[`close`][api-event-close] | A node is closed.
[`open`][api-event-open] | A node is opened.
[`remove`][api-event-remove] | A node is removed from the tree.
[`select`][api-event-select] | A node is selected.
[`unselect`][api-event-unselect] | A node is unselected.

[api-event-add]:http://smugmug.github.com/yui-gallery/api/classes/Tree.html#event_add
[api-event-clear]:http://smugmug.github.com/yui-gallery/api/classes/Tree.html#event_clear
[api-event-close]:http://smugmug.github.com/yui-gallery/api/classes/Tree.html#event_close
[api-event-open]:http://smugmug.github.com/yui-gallery/api/classes/Tree.html#event_open
[api-event-remove]:http://smugmug.github.com/yui-gallery/api/classes/Tree.html#event_remove
[api-event-select]:http://smugmug.github.com/yui-gallery/api/classes/Tree.html#event_select
[api-event-unselect]:http://smugmug.github.com/yui-gallery/api/classes/Tree.html#event_unselect

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
