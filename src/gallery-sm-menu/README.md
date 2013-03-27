SmugMug Menu
============

An awesome menu widget that makes it easy to create standalone menus, dropdown
menus, and context menus either from JavaScript or from existing markup.

Useful Links
------------

* [API Docs][api-docs]

[api-docs]:http://smugmug.github.com/yui-gallery/api/modules/gallery-sm-menu.html

Usage
-----

In your HTML, create a container element for the menu. Be sure to add the `yui3-skin-sam` class if you want to use the menu's default skin.

```html
<div id="menu" class="yui3-skin-sam"></div>
```

Load YUI onto the page if you haven't already.

```html
<script src="http://yui.yahooapis.com/3.9.0/build/yui/yui-min.js"></script>
```

Next, in your JS, create an instance of `Y.Menu`, specify some menu items, then render the menu into its container element.

```js
YUI({
    gallery: 'gallery-2013.03.20-19-59'
}).use('gallery-sm-menu', function (Y) {
    // Create a new menu and render it inside the #menu node.
    var menu = new Y.Menu({
        container: '#menu',

        items: [
            {label: 'First Item', url: 'http://www.example.com/'},
            {label: 'Second Item', children: [
                {label: 'Submenu Item'},
                {label: 'Another Submenu Item'}
            ]},

            {type: 'separator'},

            {label: 'Group Heading', type: 'heading'},
            {label: 'Another Item'}
        ]
    });

    menu.render();
}
```

### Creating a menu from markup

Alternatively, you can parse existing list markup to generate the contents of
the menu. Note that the existing markup is consumed and re-rendered in this
process.

#### HTML

```html
<div id="menu" class="yui3-skin-sam">
    <ul id="menu-data">
        <li><a href="http://www.example.com/">First Item</a></li>

        <li>
            Second Item

            <ul>
                <li>Submenu Item</li>
                <li>Another Submenu Item</li>
            </ul>
        </li>

        <li class="yui3-menu-separator"></li>
        <li class="yui3-menu-heading">Group Heading</li>
        <li>Another Item</li>
    </ul>
</div>
```

#### JS

```js
YUI().use('gallery-sm-menu', function (Y) {
    var menu = new Y.Menu({
        container : '#menu',
        sourceNode: '#menu-data'
    });

    menu.render();
});
```

Documentation
--------------

* [API Docs](http://smugmug.github.com/yui-gallery/api/modules/gallery-sm-menu.html)

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
