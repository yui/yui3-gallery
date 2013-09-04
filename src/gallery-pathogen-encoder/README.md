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

[1] https://developers.google.com/speed/docs/best-practices/caching
