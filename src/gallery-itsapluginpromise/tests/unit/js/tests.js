YUI.add('module-tests', function(Y) {

    var suite = new Y.Test.Suite('gallery-itsapluginpromise');

    suite.add(new Y.Test.Case({
        name: 'test 1',
        'check widget.hasPlugin normal way':  function() {
            var cal = new Y.Calendar(),
                hasplugin = cal.hasPlugin('dd'),
                pluggedin;
            cal.plug(Y.Plugin.Drag);
            pluggedin = !Y.Lang.isUndefined(hasplugin) && (!Y.Lang.isBoolean(hasplugin) || hasplugin);
            Y.Assert.isNotUndefined(pluggedin, 'widget.hasPlugin returned false when using widget.plug()');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 2',
        'check widget.hasPlugin when pluggedin after render':  function() {
            var cal = new Y.Calendar(),
                hasplugin = cal.hasPlugin('dd'),
                pluggedin;
            cal.plugAfterRenderPromise(Y.Plugin.Drag);
            pluggedin = !Y.Lang.isUndefined(hasplugin) && (!Y.Lang.isBoolean(hasplugin) || hasplugin);
            Y.Assert.isFalse(pluggedin, 'widget.hasPlugin returned false when using widget.plugAfterRenderPromise() without rendering the widget');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 3',
        'check widget.hasPlugin when pluggedin after render and check after render':  function() {
            var cal = new Y.Calendar();
            cal.plugAfterRenderPromise(Y.Plugin.Drag);
            cal.renderPromise().then(
                function() {
                    var hasplugin = cal.hasPlugin('dd'),
                    pluggedin;
                    pluggedin = !Y.Lang.isUndefined(hasplugin) && (!Y.Lang.isBoolean(hasplugin) || hasplugin);
                    Y.Assert.isNotUndefined(pluggedin, 'widget.hasPlugin returned false when using widget.plugAfterRenderPromise() and checked after the widget was rendered.');
                },
                function(reason) {
                    Y.Assert.fail(reason);
                }
            );
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 4',
        'check widget.hasPluginReady when pluggedin after render':  function() {
            var cal = new Y.Calendar();
            cal.plugAfterRenderPromise(Y.Plugin.Drag);
            Y.Assert.isFalse(cal.hasPluginReady('dd'), 'widget.hasPluginReady returned true when using widget.plugAfterRenderPromise() without rendering the widget');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 5',
        'check widget.hasPluginReady when pluggedin after render and check after render':  function() {
            var cal = new Y.Calendar();
            cal.plugAfterRenderPromise(Y.Plugin.Drag);
            cal.renderPromise().then(
                function() {
                    Y.Assert.isTrue(cal.hasPluginReady('dd'), 'widget.hasPluginReady returned false when using widget.plugAfterRenderPromise() and checked after the widget was rendered.');
                },
                function(reason) {
                    Y.Assert.fail(reason);
                }
            );
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 6',
        'check widget.plugAfterReadyPromise':  function() {
            var pluggedin = false,
                pluggedinbeforerender = false;
            Y.namespace('Plugin').CustomPlugin = Y.Base.create('customplugin', Y.Plugin.Base, [], {
                initializer : function() {
                    pluggedin = true;
                }
            }, {
                NS : 'custplugin'
            });
            var cal = new Y.Calendar();
            // both plugAfterRenderPromise() and plugAfterReadyPromise() can be used
            cal.plugAfterReadyPromise(Y.Plugin.CustomPlugin);

            // simulate delay
            Y.later(1000, null, function() {
                cal.render();
            });

            // check plugin after 0.5 second
            Y.later(500, null, function() {
                pluggedinbeforerender = pluggedin;
            });

            Y.later(1500, null, function() {
                Y.Assert.isTrue(
                    (!pluggedinbeforerender && pluggedin && cal.hasPlugin('dd')),
                    'widget.plugAfterReadyPromise did not resolve at the right time.'
                );
            });
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 7',
        'check widget.plugAfterRenderPromise':  function() {
            var pluggedin = false,
                pluggedinbeforerender = false;
            Y.namespace('Plugin').CustomPlugin = Y.Base.create('customplugin', Y.Plugin.Base, [], {
                initializer : function() {
                    pluggedin = true;
                }
            }, {
                NS : 'custplugin'
            });
            var cal = new Y.Calendar();
            // both plugAfterRenderPromise() and plugAfterReadyPromise() can be used
            cal.plugAfterRenderPromise(Y.Plugin.CustomPlugin);

            // simulate delay
            Y.later(1000, null, function() {
                cal.render();
            });

            // check plugin after 0.5 second
            Y.later(500, null, function() {
                pluggedinbeforerender = pluggedin;
            });

            Y.later(1500, null, function() {
                Y.Assert.isTrue(
                    (!pluggedinbeforerender && pluggedin && cal.hasPlugin('dd')),
                    'widget.plugAfterRenderPromise did not resolve at the right time.'
                );
            });
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 8',
        'check widget.plugPromise':  function() {
            var ready = false;
            Y.namespace('Plugin').CustomPlugin = Y.Base.create('customplugin', Y.Plugin.Base, [], {
                promiseBeforeReady : function() {
                    return new Y.Promise(function (resolve) {
                        // we simulate delay of the readypromise using Y.later
                        Y.later(3000, null, function() {
                            ready = true;
                            resolve();
                        });
                    });
                }
            }, {
                NS : 'custplugin'
            });
            var cal = new Y.Calendar().render();
            // both plugAfterRenderPromise() and plugAfterReadyPromise() can be used
            cal.plugPromise(Y.Plugin.CustomPlugin).then(
                function() {
                    Y.Assert.isTrue(ready, 'widget.plugPromise is resolved before plugin.promiseBeforeReady() is finished.');
                },
                function(reason) {
                    Y.Assert.fail('widget.plugPromise got rejected: '+reason);
                }
            );
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 9',
        'check plugin.readyPromise':  function() {
            var ready = false;
            Y.namespace('Plugin').CustomPlugin = Y.Base.create('customplugin', Y.Plugin.Base, [], {
                promiseBeforeReady : function() {
                    return new Y.Promise(function (resolve) {
                        // we simulate delay of the readypromise using Y.later
                        Y.later(3000, null, function() {
                            ready = true;
                            resolve();
                        });
                    });
                }
            }, {
                NS : 'custplugin'
            });
            var cal = new Y.Calendar().render().plug(Y.Plugin.CustomPlugin);
            // as soon customplugin is ready --> Assert
            cal.custplugin.readyPromise().then(
                function() {
                    Y.Assert.isTrue(ready, 'plugin.readyPromise is resolved before plugin.promiseBeforeReady() is finished.');
                },
                function(reason) {
                    Y.Assert.fail('plugin.readyPromise got rejected: '+reason);
                }
            );
        }
    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'gallery-itsapluginpromise', 'test', 'yui-later', 'gallery-itsawidgetrenderpromise', 'plugin', 'base-build', 'calendar', 'dd-plugin' ] });