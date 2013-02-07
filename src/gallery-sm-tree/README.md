SmugMug Tree
============

Provides a generic tree data structure.

A tree has a root node, which may contain any number of child nodes, which may
themselves contain child nodes, ad infinitum.

The `Y.Tree` class doesn't expose any UI, but is extended by the [SmugMug
TreeView component][sm-treeview], which does.

[sm-treeview]: https://github.com/smugmug/yui-gallery/src/sm-treeview/

Usage
-----

```js
YUI({
    gallery: 'gallery-2013.01.09-23-24'
}).use('gallery-sm-tree', function (Y) {
    // Y.Tree is available and ready to use.
});
```

Documentation
--------------

* [API Docs](http://smugmug.github.com/yui-gallery/api/modules/gallery-sm-tree.html)

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
