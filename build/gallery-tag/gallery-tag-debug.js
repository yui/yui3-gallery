YUI.add('gallery-tag', function(Y) {

var Tag = Y.namespace('Tag'),
    tags = {};

Tag.register = function(name, mixin) {
    Tag.unregister(name);

    tags[name] = {
        mixin: mixin,
        handle: Y.on('inserted', function(e) {
            e.target.fire('tag:inserted');
        }, name)
    };
};

Tag.unregister = function(name) {
    if (tags[name]) {
        tags[name].handle.detach();
        delete tags[name];
    }
};

Tag.registered = function(name) {
    return name ? name in tags : Object.keys(tags);
};

function TagPlugin(config) {
    TagPlugin.superclass.constructor.apply(this, arguments);
}

TagPlugin.NAME = 'tagPlugin';
TagPlugin.NS = 'tag';
TagPlugin.ATTRS = {
    name: {
        valueFn: function() {
            return (this.get('host').get('tagName') || '').toLowerCase();
        }
    }
};

// Fixes a bug in YUI (#2532464) and parses ints
function camelize(attrs) {
    var camelized = {};

    Y.each(attrs, function(value, key) {
        var match = /^i:(-?[0-9]+)$/.exec(value);

        if (match) {
            value = parseInt(match[1], 10);
        }

        key = key.replace(/-([a-z])/g, function(s, l) {return l.toUpperCase();});
        camelized[key] = value;
    });

    return camelized;
}

Y.extend(TagPlugin, Y.Plugin.Base, {
    initializer: function() {
        var tag = tags[this.get('name')];
        
        if (!tag) {return;}

        Y.mix(this, tag.mixin);

        if (tag.mixin.created) {
            tag.mixin.created.call(this, camelize(this.get('host').getData()));
        }
    }
});

Y.Node.plug(TagPlugin);


}, 'gallery-2012.06.27-22-22' ,{requires:['node', 'base', 'plugin', 'gallery-event-inserted'], skinnable:false});
