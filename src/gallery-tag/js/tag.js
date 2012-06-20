var Tag = Y.namespace('Tag');

function TagPlugin(config) {
    TagPlugin.superclass.constructor.apply(this, arguments);
}

TagPlugin.NAME = 'tagPlugin';
TagPlugin.NS = 'tag';
TagPlugin.ATTRS = {};

TagPlugin._buildCfg = {
    custom: {
        NS: function(prop, receiver, supplier) {
            receiver.NS = TagPlugin.NS;
        }
    }
};

Y.extend(TagPlugin, Y.Plugin.Base, {});

function listen(name, plugin) {
    Y.on('inserted', function(e) {
        e.target.plug(plugin);
    }, name);
}

function register(name, plugin) {
    if (plugin) {
        listen(name, plugin);
    } else { // Need to load plugin
        Y.use('tag-' + name, function(Y) {
            if (Y.namespace('Tag.Tags')[name]) {
                listen(name, Y.namespace('Tag.Tags')[name]);
            }
        });
    }
}

Tag.register = register;
Tag.Plugin = TagPlugin;