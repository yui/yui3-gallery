YUI.add('tag-tests', function(Y) {
    var suite = new Y.Test.Suite("Tag Tests");

    suite.add(new Y.Test.Case({
        name: "register",

        "tags should be registerable/unregisterable": function() {
            var name = 'foo';

            Y.Tag.register(name, {});
            Y.Assert.areSame(Y.Tag.registered(name), true);

            Y.Assert.isObject(Y.Tag.registered());

            Y.Tag.unregister(name);
            Y.Assert.areSame(Y.Tag.registered(name), false);
        },

        "attributes should be registerable/unregisterable": function() {
            var name = '[foo]';

            Y.Tag.register(name, {});
            Y.Assert.areSame(Y.Tag.registered(name), true);

            Y.Assert.isObject(Y.Tag.registered());

            Y.Tag.unregister(name);
            Y.Assert.areSame(Y.Tag.registered(name), false);
        }
    }));

    suite.add(new Y.Test.Case({
        name: "plugin",

        "nodes should have the tag plugin": function() {
            Y.Assert.isObject(Y.Node.create('div').tag);
        },

        "tags should have methods mixed in": function() {
            var name = 'foo',
                node;

            Y.Tag.register(name, {
                someTagMethod: function() {}
            });

            node = Y.Node.create('<' + name + ' />');

            Y.Assert.isObject(node.tag);
            Y.Assert.isFunction(node.tag.someTagMethod);

            Y.Tag.unregister(name);
        },

        "attributes should have methods mixed in": function() {
            var name = 'foo',
                attr = '[' + name + ']',
                node;

            Y.Tag.register(attr, {
                someAttrMethod: function() {}
            });

            node = Y.Node.create('<div ' + name + ' />');

            Y.Assert.isObject(node.tag);
            Y.Assert.isFunction(node.tag.someAttrMethod);

            Y.Tag.unregister(attr);
        }
    }));

    suite.add(new Y.Test.Case({
        name: "event",

        "tags should fire inserted event": function() {
            var name = 'foo',
                self = this,
                node;

            Y.Tag.register(name, {
                created: function() {
                    this.onHostEvent('tag:inserted', function(e) {
                        self.resume(function() {
                            Y.Assert.areSame(e.target, node);
                        });

                        Y.Tag.unregister(name);
                    });
                }
            });

            node = Y.Node.create('<' + name + ' />');
            Y.one('body').append(node);
            self.wait();
        },

        "attributes should fire inserted event": function() {
            var name = 'foo',
                attr = '[' + name + ']',
                self = this,
                node;

            Y.Tag.register(attr, {
                created: function() {
                    this.onHostEvent('tag:inserted', function(e) {
                        self.resume(function() {
                            Y.Assert.areSame(e.target, node);
                        });

                        Y.Tag.unregister(name);
                    });
                }
            });

            node = Y.Node.create('<div ' + name + ' />');
            Y.one('body').append(node);
            self.wait();
        }
    }));

    Y.Test.Runner.add(suite);
}, '@VERSION@', {requires:['test', 'gallery-tag']});