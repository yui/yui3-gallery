Storage Lite
------------

Storage Lite provides a lightweight YUI 3 API for persistent cross-browser local
key/value storage similar to the HTML5 localStorage API. Supported browsers
include IE6+, Firefox 2+, Safari 3.1+, Chrome 4+, and Opera 10.5+. No browser
plugins are required (not even Flash).

Storage Lite will automatically use the best available local storage API
supported by the browser it's running in. The complexities of the following
storage APIs are all wrapped in a loving YUI 3 embrace and presented to you as a
single consistent HTML5-like API:

  * **Firefox 3.5+, Chrome 4+, Safari 4+, IE8+, Opera 10.5+:**
    [localStorage](http://dev.w3.org/html5/webstorage/) -- these modern
    browsers all support the core localStorage functionality defined in the
    Web Storage spec.

  * **Firefox 2.x and 3.0.x**:
    [Gecko globalStorage](https://developer.mozilla.org/en/DOM/Storage), an early
    API similar to localStorage.

  * **Safari 3.1 and 3.2**:
    [Database Storage](http://developer.apple.com/safari/library/documentation/iPhone/Conceptual/SafariJSDatabaseGuide/Introduction/Introduction.html),
    because Safari 3.1 and 3.2 don't support localStorage.

  * **IE6, IE7**: [userData persistence](http://msdn.microsoft.com/en-us/library/ms531424%28VS.85%29.aspx),
    a rarely used IE feature for associating string data with an element on a
    web page and persisting it between pageviews.

When minified, Storage Lite weighs in at about 2.6KB before gzip, making it
ideal for performance-critical web apps that need client-side storage
capabilities across all A-grade browsers and can't depend on non-standard
browser extensions.


Examples
========

See the `examples` directory for usage examples.


Caveats
=======

  * IE userData storage, which is used for IE6 and IE7, has a per-document
    storage limit (in most cases) of 64KB, which is much lower than the limits
    of the other storage providers. If you exceed this limit, a
    `Y.StorageFullError` exception will be raised.

  * IE userData storage persists across pageviews, but does not persist across
    browser restarts. All other storage providers persist across both pageviews
    and browser restarts.


License
=======

Copyright (c) 2012 Ryan Grove (ryan@wonko.com)
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice,
    this list of conditions and the following disclaimer.

  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

  * Neither the name of this project nor the names of its contributors may be
    used to endorse or promote products derived from this software without
    specific prior written permission.

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
