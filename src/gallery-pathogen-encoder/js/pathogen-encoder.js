YUI.add('gallery-pathogen-encoder', function (Y, NAME) {

var resolve = Y.Loader.prototype.resolve,

    NAMESPACE       = 'p/',
    GROUP_DELIM     = ';',
    SUB_GROUP_DELIM = '+',
    MODULE_DELIM    = ',',

    FILTER_RE       = /-(min|debug).js/,
    EXTENSION_RE    = /\.(?:js|css)$/,
    GALLERY_RE      = /^(?:yui:)?gallery-([^\/]+)/,
    TYPES           = { js: true, css: true },

    customComboBase,
    maxURLLength,
    galleryVersion;

/**
Build each combo url from the bottom up. There's probably room for optimization
here, but let's keep it simple for now.
@method buildCombo
@param {Array} groups Grouped module meta.
@param {String} comboBase The base of the combo url.
@param {String} comboTail The tail of the combo url (e.g. .debug.js).
@return {String} A combo url.
*/
Y.Loader.prototype.buildCombo = function (groups, comboBase, comboTail) {
    var comboUrl = comboBase,
        currLen  = comboBase.length + comboTail.length,
        currDelim,
        currKey,
        prepend,
        modules,
        token,
        group,
        len,
        i;

    for (i = 0, len = groups.length; i < len; i += 1) {
        group       = groups[i];
        currDelim   = comboUrl === comboBase ? '' : GROUP_DELIM;
        currKey     = group.key;
        modules     = group.modules;

        while (modules.length) {
            prepend = currDelim + currKey;
            prepend = prepend ? prepend + SUB_GROUP_DELIM : MODULE_DELIM;
            token   = prepend + modules[0];

            if (currLen + token.length < maxURLLength) {
                comboUrl += token;
                currLen  += token.length;
                modules.shift();
            } else {
                return comboUrl + comboTail;
            }

            currDelim = currKey = '';
        }
    }

    comboUrl += comboTail;

    // If no modules were encoded in the combo url.
    if (comboUrl.length === comboBase.length + comboTail.length) {
        comboUrl = null;
    }

    return comboUrl;
};

/**
Aggregate modules into groups with unique keys. The key is "$name+$version" for
core and gallery groups, and just "$root" for all other groups.
@method aggregateGroups
@param {Array} modules A list of module meta.
@return {Object} Aggregated groups of module meta.
*/
Y.Loader.prototype.aggregateGroups = function (modules) {
    var source = {},
        galleryMatch,
        comboBase,
        version,
        group,
        meta,
        name,
        mod,
        key,
        len,
        i;

    // Group all the modules for efficient combo encoding.
    for (i = 0, len = modules.length; i < len; i += 1) {
        mod     = modules[i];
        group   = mod.group;
        name    = mod.name;

        // Skip modules that should be loaded singly. This is kind of confusing
        // because it mimics the behavior of the loader (also confusing):
        // https://github.com/ekashida/yui3/blob/632167a36d57da7a884aacf0f4488dd5b8619c7c/src/loader/js/loader.js#L2563
        meta = this.groups && this.groups[group];
        if (meta) {
            if (!meta.combine || mod.fullpath) {
                continue;
            }
        } else if (!this.combine) {
            continue;
        }
        if (!mod.combine && mod.ext) {
            continue;
        }

        // YUI core module group. Assumption: core modules are the only ones
        // that don't declare its group name.
        if (!group) {
            version = YUI.version;
            group   = 'core';
        }
        // YUI gallery module group.
        else if (group === 'gallery') {
            if (!galleryVersion) {
                galleryMatch   = GALLERY_RE.exec(this.groups.gallery.root);
                galleryVersion = galleryMatch && galleryMatch[1];
            }
            version = galleryVersion;
            name    = name.split('gallery-').pop(); // remove prefix
        }
        // All other YUI module groups.
        else {
            comboBase = meta.comboBase;

            // Combo base is not set or the combo base is unrecognized.
            if (
                !comboBase ||
                comboBase.indexOf('.yimg.com/zz/combo?') === -1
            ) {
                continue;
            }

            version = meta.root;
            group   = '';
            name    = name.split(EXTENSION_RE).shift(); // remove extension

            // Trim '/' from both ends of the version (root).
            if (version[version.length - 1] === '/') {
                version = version.slice(0, -1);
            }
            if (version[0] === '/') {
                version = version.slice(1);
            }
        }

        // Segment core/gallery modules by group and version, and all other
        // modules by root:
        // YUI core:    `core+3.12.0`
        // YUI gallery: `gallery+2013.06.20-02-07`
        // YUI etc:     `os/mit/td/td-applet-weather-0.0.86`
        key = group ? group + SUB_GROUP_DELIM + version : version;
        source[key] = source[key] || [];

        source[key].push(name);

        if (Y.config.customComboFallback) {
            if (group === 'gallery') {
                name = 'gallery-' + name;
            }
            this.pathogenSeen[name] = true;
        }
    }

    return source;
};

/**
Sort the aggregated groups, and the modules within them. Minimizes cache misses
in Yahoo's infrastructure by encoding predictable combo urls across browsers
since iterating over an object does not guarantee order.
@method sortAggregatedGroups
@param {Object} groups Aggregated groups.
@return {Array} Sorted groups.
**/
Y.Loader.prototype.sortAggregatedGroups = function (groups) {
    var sorted = [],
        key,
        len,
        i;

    for (key in groups) {
        if (groups.hasOwnProperty(key)) {
            sorted.push({
                key: key,
                modules: groups[key]
            });
        }
    }

    // Sort the groups.
    sorted.sort(function (a, b) {
        return a.key > b.key;
    });

    // Sort the modules.
    for (i = 0, len = sorted.length; i < len; i += 1) {
        sorted[i].modules.sort();
    }

    return sorted;
};

/**
Build each combo url from the bottom up. There's probably room for optimization
here, but let's keep it simple for now.
@method customResolve
@param {Array} modules A list of module meta.
@param {String} type Either `js` or `css`.
@return {String} Combo url.
*/
Y.Loader.prototype.customResolve = function (modules, type) {
    var source      = this.aggregateGroups(modules),
        groups      = this.sortAggregatedGroups(source),
        comboUrls   = [],
        comboTail,
        filter,
        match,
        url;

    // Determine the combo tail (e.g., '.debug.js'). Assumption: `filter` is
    // global to the resolve() and should match the filter on loader.
    if (!filter) {
        match     = FILTER_RE.exec(Y.config.loaderPath);
        filter    = match && match[1] || 'raw';
        filter    = (type === 'css' && filter === 'debug') ? 'raw' : 'min';
        comboTail = filter === 'min' ? '' : '.' + filter;
        comboTail = comboTail + '.' + type;
    }

    url = this.buildCombo(groups, customComboBase, comboTail);
    while (url) {
        comboUrls.push(url);
        url = this.buildCombo(groups, customComboBase, comboTail);
    }

    return comboUrls;
};

/**
Determines whether or not we should fallback to default combo urls by checking
to see if Loader re-requests any module that we've already seen.
@method shouldFallback
@param {Object} resolved Resolved module metadata by original `resolve`.
@return {Boolean} Whether or not to fallback.
**/
Y.Loader.prototype.shouldFallback = function (resolved) {
    var modules,
        name,
        type;

    if (this.fallbackMode) {
        return this.fallbackMode;
    }

    for (type in TYPES) {
        if (TYPES.hasOwnProperty(type)) {
            modules = resolved[type + 'Mods'];
            for (i = 0, len = modules.length; i < len; i += 1) {
                name = modules[i].name;

                if (this.pathogenSeen[name]) {
                    Y.log('Detected a request for a module that we have already seen: ' + name, 'warn', NAME);
                    Y.log('Falling back to default combo urls', 'warn', NAME);

                    this.fallbackMode = true;
                    return this.fallbackMode;
                }
            }
        }
    }
};

/**
Wraps Loader's `resolve` method and uses the module metadata returned by it to
encode pathogen urls. Note that we will incur the cost of encoding default
combo urls until we replace the encoding logic in core.
@method resolve
**/
Y.Loader.prototype.resolve = function () {
    var resolved = resolve.apply(this, arguments),
        combine  = this.combine,
        resolvedUrls,
        resolvedMods,
        comboUrls,
        singles,
        urlKey,
        modKey,
        group,
        type,
        url,
        len,
        i;

    // Check to see if anything needs to be combined.
    if (!combine) {
        for (group in this.groups) {
            if (this.groups.hasOwnProperty(group)) {
                if (!combine && group.combine) {
                    combine = group.combine;
                    break;
                }
            }
        }
    }

    // Add the pathogen namespace to the combo base.
    if (Y.config.customComboBase) {
        customComboBase = Y.config.customComboBase + NAMESPACE;
    }

    // Fallback to the default combo url if we need to.
    if (Y.config.customComboFallback) {
        this.pathogenSeen = this.pathogenSeen || {};

        if (this.shouldFallback(resolved)) {
            return resolved;
        }
    }

    if (customComboBase && combine) {
        maxURLLength = this.maxURLLength;

        for (type in TYPES) {
            /*jslint forin: false*/
            if (!TYPES.hasOwnProperty(type)) {
            /*jslint forin: true*/
                continue;
            }

            singles = [];
            urlKey  = type;
            modKey  = type + 'Mods';

            resolved[urlKey] = resolvedUrls = resolved[urlKey] || [];
            resolved[modKey] = resolvedMods = resolved[modKey] || [];

            for (i = 0, len = resolvedUrls.length; i < len; i += 1) {
                url = resolvedUrls[i];
                if (
                    typeof url === 'object' ||
                    (typeof url === 'string' && url.indexOf('/combo?') === -1)
                ) {
                    singles.push(url);
                }
            }

            // Generate custom combo urls.
            comboUrls = this.customResolve(resolvedMods, type);

            if (JSON) {
                Y.log('Default encoding resulted in ' + resolved[type].length + ' URLs', 'info', NAME);
                Y.log(JSON.stringify(resolved[type], null, 4), 'info', NAME);
                Y.log('Custom encoding resulted in ' + comboUrls.length + ' URLs', 'info', NAME);
                Y.log(JSON.stringify(comboUrls, null, 4), 'info', NAME);
            }

            resolved[type] = [].concat(comboUrls, singles);
        }
    }

    return resolved;
};

}, '@BETA@', { requires: ['loader-base'] });
