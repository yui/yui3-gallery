/**
 * Provides methods for registering mixins with types of Nodes.
 *
 * @module gallery-tag
 */
var Tag = Y.namespace('Tag'),
    registered = {},
    has_attrs = false; // Attribute support is a slower code path

function getParts(name) {
    return name.replace(' ', '').toLowerCase().split(',');
}

/**
 * @method register
 * @description Registers a new tag mixin.
 * @param {string} name N/A
 * @param {object} mixin N/A
 */
Tag.register = function(name, mixin) {
    var parts = getParts(name);

    Y.Array.each(parts, function(part) {
        if (part.indexOf('[') >= 0) {
            has_attrs = true;
        }

        registered[part] = {
            mixin: mixin,
            handle: Y.on('inserted', function(e) {
                e.target.fire('tag:inserted');
            }, part)
        };
    });
};

/**
 * @method unregister
 * @description Unregister a tag mixin.
 * @param {string} name N/A
 */
Tag.unregister = function(name) {
    var parts = getParts(name);

    Y.Array.each(parts, function(part) {
        if (registered[part]) {
            registered[part].handle.detach();
            delete registered[part];
        }
    });
};

/**
 * @method registered
 * @description Gets all currently registered tag mixins.
 * @param {string} name N/A
 */
Tag.registered = function(name) {
    return name ? name in registered : Object.keys(registered);
};

function TagPlugin(config) {
    TagPlugin.superclass.constructor.apply(this, arguments);
}

TagPlugin.NAME = 'tagPlugin';
TagPlugin.NS = 'tag';
TagPlugin.ATTRS = {};

// YUI doesn't properly camelize data attrs (#2532464)
function groupAttrs(raw) {
    var attrs = {
        grouped: {
            data: {}
        },
        ungrouped: {}
    };

    // Helper to camelize names
    function formatName(name) {
        return name.replace(/-([a-z])/g, function(s, l) {return l.toUpperCase();});
    }

    // Helper to parse ints
    function formatValue(value) {
        var match = /^i:(-?[0-9]+)$/.exec(value);

        if (match) {
            return parseInt(match[1], 10);
        }

        return value;
    }

    Y.Array.each(raw, function(attr) {
        var name = attr.name,
            value = attr.value,
            data = 'data-',
            index = name.indexOf(':'),
            group;

        if (name.indexOf(data) === 0) { // data attributes
            name = formatName(name.substr(data.length));
            attrs.grouped.data[name] = formatValue(value);
        } else if (index >= 0) {    // namespaced attributes (x:y)
            group = name.substr(0, index);
            if (!attrs.grouped[group]) {attrs.grouped[group] = {};}
            name = formatName(name.substr(index + 1));
            attrs.grouped[group][name] = formatValue(value);
        }
        else {
            attrs.ungrouped[name] = formatValue(value);
        }
    });

    return attrs;
}

Y.extend(TagPlugin, Y.Plugin.Base, {
    // This function needs to be fast since it gets called on Node creation.
    initializer: function() {
        var host = this.get('host'),
            tag = (host.get('tagName') || '').toLowerCase(),
            mixins = [],
            attrs;

        // Look for a registered tag
        if (registered[tag]) {
            attrs = attrs || groupAttrs(host.getDOMNode().attributes);
            mixins.push({obj: registered[tag].mixin, config: attrs.grouped.data});
        }

        if (has_attrs) {
            attrs = attrs || groupAttrs(host.getDOMNode().attributes);
            // Look for a registered attribute
            Y.each(attrs.ungrouped, function(dummy, attr) {
                var selector = '[' + attr + ']';
                if (selector in registered) {
                    mixins.push({obj: registered[selector].mixin, config: attrs.grouped[attr] || {}});
                }
            });
        }

        if (mixins.length) {
            // Need to cache host instance since it hasn't fully initialized. Otherwise it's possible
            // to get into an infinite loop of mixins referring to nodes which haven't been cached yet.
            Y.Node._instances[host._yuid] = host;

            Y.Array.each(mixins, function(mixin) {
                Y.mix(this, mixin.obj);

                if (mixin.obj.created) {
                    mixin.obj.created.call(this, mixin.config);
                }
            }, this);
        }
    }
});

Y.Node.plug(TagPlugin);