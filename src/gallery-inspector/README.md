Inspector
=========

Inspector is a real-time attribute inspector widget for YUI 3.

Hook Inspector up to any class that implements the Attribute interface, such as
Base- and Widget-derived classes, and watch its attribute values change as the
application runs.

Toggle Inspector's Pause checkbox to freeze attribute values (they still might
change behind the scenes, just not in Inspector).

Use Inspector's attribute filter to narrow the attribute list.

Collapse Inspector to get it out of your way, or drag it by the header to a new
location.

* [API docs](http://brettstimmerman.github.com/inspector/docs/)
* [Bugs](https://github.com/brettstimmerman/inspector/issues)

<img 
    src="https://github.com/brettstimmerman/Inspector/raw/master/screenshot.png"
    alt="Screenshot" />

Usage
-----

Add the `yui3-skin-sam` class to your `body`, then:

    YUI().use('base', 'gallery-inspector', function (Y) {
        
        // 1. Define an object with attributes. Base is a good place to start.
        var Test = Y.Base.create('test', Y.Base, [], {}, {
            ATTRS: {
                foo: {
                    value: 'bar'
                },
                
                baz: {
                    value: true
                }
            }
        }),
        
        // 2. Instantiate the object
        test = new Test(),
        
        // 3. Hook it up to an Inspector
        inspector = new Y.Inspector({
            host: test
        }).render();
        
        // 4. Then watch it in real-time as attributes change
        Y.later(2500, test, function () {
            this.setAttrs({
                foo: 'not bar',
                baz: false
            });
        });
        
    });

Or, using the plugin:

    YUI().use('gallery-inspector-plugin', function (Y) {
        // Instantiate a Base- or Widget-based object ...
        
        obj.plug(Y.Plugin.Inspector);
    });

Configuration
-------------

* __exclude__: Array of attribute names to exclude from view.
* __include__: Array of attribute names to include. Opposite of, and overrides
               _exclude_.

These are the most interesting. Have a look at the source for more.

Supported Browsers
------------------

* Firefox 3.6+
* Chrome
* Internet Explorer 9+
* Safari 5+

Other browsers may work, but haven't been tested.

Known Issues
------------

* Inspecting arrays, functions and most non-native objects is not supported
  (yet).
  
Links
-----

* https://github.com/brettstimmerman/inspector
* https://github.com/yui/yui3-gallery/tree/master/src/gallery-inspector
* http://yuilibrary.com/gallery/show/inspector

License
-------

Copyright (c) 2011 Brett Stimmerman (brettstimmerman@gmail.com).
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this
  list of conditions and the following disclaimer in the documentation and/or
  other materials provided with the distribution.
* Neither the name of this project nor the names of its contributors may be used
  to endorse or promote products derived from this software without specific
  prior written permission.

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
