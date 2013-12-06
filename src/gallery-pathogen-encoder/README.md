# Pathogen Encoder

This module monkey-patches [YUI Loader][] to generate pathogen-encoded combo
urls. It should be loaded as part of an application's seed, and added to the
[list of core modules][].

[YUI Loader]: http://yuilibrary.com/yui/docs/yui/loader.html
[list of core modules]: http://yuilibrary.com/yui/docs/api/classes/config.html#property_core

## Overview

This module is the encoder component of the pathogen codec, which is used to
encode and decode JavaScript and CSS modules using the YUI Combo Handler.

This strategy encodes combo URLs without using any query parameters. This
approach was taken due to the cacheing behavior of particular public proxies
[1]:

> Most proxies, most notably Squid up through version 3.0, do not cache
> resources with a "?" in their URL even if a Cache-control: public header is
> present in the response. To enable proxy caching for these resources, remove
> query strings from references to static resources, and instead encode the
> parameters into the file names themselves.

## URL format

This encoding strategy expects URLs in the following format where module groups
are `;` delimited and optionally followed by the filter and type:
```
{origin}/{routePath}/{module-group-1};{...};{module-group-N}.{filter}.{type}
```

## URL components:

* `module-group-{X}` - A module group which contains a group identifier, a
  version, and a list of module names.
* `type` - Valid values are `js` and `css`.
* `filter` - Optional. Defaults to `min` when not specified. Valid values for
  JS are `min`, `debug`, and `raw`. Valid values for CSS are `min` and `raw`.

## Module groups

### Core module group

The `core` module group represents the set of YUI's core modules and is
expected in the following format:

```
// e.g., c+3.10.3+get,oop
c+{version}+{modules}
```

### Gallery module group

The `gallery` module group represents the set of YUI's gallery modules and is
expected in the following format:

```
// e.g., g+2013.06.20-02-07+dispatcher,bitly
g+{version}+{modules}
```

Note that the gallery version and all gallery module names are listed without
the `gallery-` prefix.

### Root module group

The root module group represents modules built using [shifter][] or anything
that outputs the same build directory structure. These are expected in the
following format:

```
// e.g., r+os/mit/td/ape-af-0.0.38+af-pageviz,af-dom,af-poll
r+{root}+{modules}
```

[shifter]: http://yui.github.io/shifter/

### Path module group

The path module group represents modules which specified their full path in
their module meta data, as opposed to the root path and the module name pair.

For example, a module from the root module group that was built "the YUI way"
can simply specify the root path `this/is/a/path/` along with the module name
`kamenrider`, and we can automatically resolve the path to
`this/is/a/path/kamenrider/kamenrider-min.js`.

Since it is non-trivial to encode modules that don't follow this convention,
this encoder approaches the problem in two ways:

1. Treat each module as a group and use the full path in the combo url:
```
http://yui.yahooapis.com/{routePath}/some/path/kamenrider;some/path/gogobuster;some/path/doraemon.js
```
1. Compute prefix tree encoding to generate a synthetic root module group:
```
http://yui.yahooapis.com/{routePath}/r+some/path+kamenrider,gogobuster,doraemon.js
```

You can enable the compression by setting `fullpathCompression` to `true` in
the YUI config.

## URL examples

```
// The following JS URLs are equivalent:
http://yui.yahooapis.com/{routePath}/c+3.10.3+oop,yui-base.js
http://yui.yahooapis.com/{routePath}/c+3.10.3+oop,yui-base.min.js

// There is no equiavalent to the following JS URL:
http://yui.yahooapis.com/{routePath}/c+3.10.3+oop,yui-base;g+2013.06.20-02-07+stalker,bitly.debug.js

// The following CSS URLs are equivalent:
http://yui.yahooapis.com/{routePath}/c+3.10.3+cssreset,cssbase.css
http://yui.yahooapis.com/{routePath}/c+3.10.3+cssreset,cssbase.min.css

// There is no equivalent to the following CSS URL:
http://yui.yahooapis.com/{routePath}/c+3.10.3+cssreset,cssbase.raw.css
```

## Integrating the encoder manually

We use the gallery tag `gallery-2013.09.04-21-56` in the example below, but you
should check the [yui3-gallery][] for the latest tag which will get you the
latest version of the pathogen encoder.

Also note that the `debug` filter will print out some useful log statements
(i.e., the number of combo urls that would have been generated as well as the
number of pathogen-encoded combo urls that have been generated).

[yui3-gallery]: https://github.com/yui/yui3-gallery

### Steps

There are 3 required steps for integration with YUI Loader:

1) Deliver the module as part of the application seed

```
// Together with the YUI seed
<script src="http://yui.yahooapis.com/combo?3.10.3/yui/yui-min.js&gallery-2013.09.04-21-56/gallery-pathogen-encoder/gallery-pathogen-encoder-min.js"></script>

// Or separately
<script src="http://yui.yahooapis.com/3.10.3/yui/yui-min.js"></script>
<script src="http://yui.yahooapis.com/gallery-2013.09.04-21-56/gallery-pathogen-encoder/gallery-pathogen-encoder-min.js"></script>
```

2) Add the module to the list of core modules

```
<script>
YUI.Env.core.push('gallery-pathogen-encoder');
</script>
```

3) Configure the YUI instance with the custom combo base

```
<script>
YUI({
    customComboBase: $customComboBase
}).use('node', function (Y) { ... };
</script>
```

For a working example, see [this test][]. You'll need to `npm install`
beforehand to make all the YUI assets locally available.

* As long as steps 1 and 2 happen before instantiation, Loader will start
  producing pathogen-encoded urls.
* This submodule does no work unless the `customComboBase` configuration is
  set. `customComboBase` can be used as a switch for the YUI combo handler.

[this test]: https://github.com/ekashida/gallery/blob/master/src/gallery-pathogen-encoder/tests/unit/index.html

## Integrating the encoder using express-yui

There are 3 required steps for integration with express-yui.

1) Add the module to your application so that it gets deployed to the CDN as
part of your CI

2) Enable the encoder

```
var app = require('express')();
var encoder = require('yui-pathogen-encoder');
...
encoder.enable(app);
...
```

3) Specify the `customComboBase` config

```
app.yui.applyConfig({
    customComboBase: $customComboBase
});
```

Check out the [working example][]. Due to the nature of [locator][], you will
have to `npm link yui-pathogen-encoder` into the example directory after doing
an `npm link` in this module's root directory.

[working example]: https://github.com/ekashida/gallery/tree/master/src/gallery-pathogen-encoder/example
[locator]: https://github.com/yahoo/locator

## Additional features

### Falling back to the default combo url

When `customComboFallback` is set to `true`, Loader will fall back to the
default combo url if any module fails to load via the pathogen-encoded url.

```
<script>
YUI({
    customComboBase: $customComboBase,
    customComboFallback: true
}).use('node', function (Y) { ... };
</script>
```

## License

This software is free to use under the Yahoo! Inc. BSD license. See the
[LICENSE file][] for license text and copyright information.

[LICENSE file]: https://github.com/ekashida/gallery/blob/master/src/gallery-pathogen-encoder/LICENSE


[1] https://developers.google.com/speed/docs/best-practices/caching
