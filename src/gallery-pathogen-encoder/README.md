# Pathogen Encoder

This module monkey-patches [YUI
Loader](http://yuilibrary.com/yui/docs/yui/loader.html) to generate
pathogen-encoded combo urls. It should be loaded as part of an application's
seed, and added to the [list of core
modules](http://yuilibrary.com/yui/docs/api/classes/config.html#property_core).
Meant for bucket testing purposes only!

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

* `module-group-{n}` - A module group which contains a version and a list of
  module names.
* `type` - Valid values are `js` and `css`.
* `filter` - Optional. Defaults to `min` when not specified. Valid values for
  JS are `min`, `debug`, and `raw`. Valid values for CSS are `min` and `raw`.

## Module groups

### Core module group

The `core` module group represents the set of YUI's core modules and is
expected in the following format:

```
// e.g., core+3.10.3+get,oop
core+{version}+{modules}
```

### Gallery module group

The `gallery` module group represents the set of YUI's gallery modules and is
expected in the following format:

```
// e.g., gallery+2013.06.20-02-07+dispatcher,bitly
gallery+{version}+{modules}
```

Note that the gallery version and all gallery module names are listed without
the `gallery-` prefix.

### Application module group

The application module group represents all other YUI modules built the YUI-way
(i.e., [shifter](http://yui.github.io/shifter/) or anything that uses shifter
under the covers) and deployed to the CDN. These are expected in the following
format:

```
// e.g., os/mit/td/ape-af-0.0.38+af-pageviz,af-dom,af-poll
{root}+{modules}
```

## URL examples

```
// The following JS URLs are equivalent:
http://yui.yahooapis.com/{routePath}/core+3.10.3+oop,yui-base.js
http://yui.yahooapis.com/{routePath}/core+3.10.3+oop,yui-base.min.js

// There is no equiavalent to the following JS URL:
http://yui.yahooapis.com/{routePath}/core+3.10.3+oop,yui-base;gallery+2013.06.20-02-07+stalker,bitly.debug.js

// The following CSS URLs are equivalent:
http://yui.yahooapis.com/{routePath}/core+3.10.3+cssreset,cssbase.css
http://yui.yahooapis.com/{routePath}/core+3.10.3+cssreset,cssbase.min.css

// There is no equivalent to the following CSS URL:
http://yui.yahooapis.com/{routePath}/core+3.10.3+cssreset,cssbase.raw.css
```

## Integrating the encoder

We use the gallery tag `gallery-2013.09.04-21-56` in the example below, but you
should check the [yui3-gallery](https://github.com/yui/yui3-gallery) for the
latest tag which will get you the latest version of the pathogen encoder.

Also note that the `debug` filter will print out some useful log statements
(i.e., the number of combo urls that would have been generated as well as the
number of pathogen-encoded combo urls that have been generated).

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

For a working example, see [this
test](https://github.com/ekashida/gallery/blob/master/src/gallery-pathogen-encoder/tests/unit/index.html).
You'll need to `npm install` beforehand to make all the YUI assets locally
available.

* As long as steps 1 and 2 happen before instantiation, Loader will start
  producing pathogen-encoded urls.
* This submodule does no work unless the `customComboBase` configuration is
  set. `customComboBase` can be used as a switch for the YUI combo handler.

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



[1] https://developers.google.com/speed/docs/best-practices/caching
