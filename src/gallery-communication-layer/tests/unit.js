/*
 * Copyright (c) 2011 Yahoo! Inc. All rights reserved.
 */

YUI.add('TestCL-tests', function (Y) {

    var suite = new YUITest.TestSuite('TestCL-tests'),
        Value = YUITest.Mock.Value,
        A     = YUITest.Assert,
        OA    = YUITest.ObjectAssert,
        proto = Y.CommunicationLayer.prototype,
        CL,
        Global,
        createTestCase,
        baseConfig;

    baseConfig = {

        // setUp for every testcase
        setUp: function () {
            Y.CommunicationLayer.prototype = Y.clone(proto);
            Y.CommunicationLayer.prototype._init = function () {};

            this._beforeSetUp();
            // -- Start common set up

            Global = {};

            Y.config.win = {
                location: {
                    pathname: 'some pathname',
                    href: 'http://search.yahoo.com/search?p=searchx&fr=sfp&pqstr=searchx#search',
                },
                parent: 'some parent'
            };

            CL = new Y.CommunicationLayer();

            // -- End common set up
            this._afterSetUp();
        },

        // tearDown for every testcase
        tearDown: function () {
            this._beforeTearDown();
            // -- Start common tear down

            CL = null;
            Y.config.win = null;
            Global = null;

            // -- End common tear down
            this._afterTearDown();
        },

        // These methods are meant to be overriden
        _beforeSetUp:    function () {},
        _afterSetUp:     function () {},
        _beforeTearDown: function () {},
        _afterTearDown:  function () {}

    };

    createTestCase = function (config) {
        var mergedConfig = Y.merge(baseConfig, config);
        return new YUITest.TestCase(mergedConfig);
    };

    suite.add(
        createTestCase({
            name: 'CL constructor',
            _beforeSetUp: function () {
                Y.CommunicationLayer.prototype._createEventProxy = function (str) {
                    return str;
                };
            },
            'test instance initialization': function () {
                A.areSame(Y.config.win, CL._WIN, 'CL should be initialized with Y.config.win');
                A.isTypeOf('string', CL._APPREADY, 'Event name to signify app-readiness should be a string');
                A.isTypeOf('number', CL._BUFFER_TIMEOUT, 'Buffer timeout should be set as a number');
                A.isTypeOf('number', CL._CALLBACK_TIMEOUT, 'Callback timeout should be set as a number');
                A.isInstanceOf(Object, CL._proxyFor, 'Object to store event proxies should be defined');
                A.isInstanceOf(Object, CL._subscriptionFor, 'Object to store open connections should be defined');
                A.isTypeOf('string', CL._parentProxy, 'Event proxy should be created for the parent');
            }
        })
    );

    suite.add(
        createTestCase({
            name: 'Window message handler',
            _afterSetUp: function () {
                Global.e = {
                    source: 'some source',
                    origin: 'some origin',
                    data: {
                        guid: 'some guid',
                        name: 'some name',
                        data: {
                        }
                    }
                };

                Y.JSON = {
                    parse: function (obj) {
                        return obj;
                    }
                };

                CL._addListener = function (win, msg, handler) {
                    handler(Global.e);
                };

                CL._proxyFor = {
                    'some guidsome origin': {
                        fire: function (name, data) {
                            Global._eventProxy = {
                                name: name,
                                data: data
                            };
                        }
                    }
                };

                CL._postMessage = function (source, message, origin) {
                    Global._postMessage = {
                        source: source,
                        origin: origin,
                        message: message
                    };
                };
            },
            'test window message handler': function () {
                CL._initWindowMessageHandler();

                A.areEqual(Global.e.data.name, Global._eventProxy.name, 'e.data.name should be used as the internal event name');
                A.areEqual(Global.e.origin, Global._eventProxy.data.origin, 'e.origin should be passed on as event data');
                A.areEqual(Global.e.source, Global._eventProxy.data.source, 'e.source should be passed on as event data');
            },
            'test cl callback facade (unactivated)': function () {
                Global.e.data.cbid = null;
                CL._initWindowMessageHandler();

                A.isUndefined(Global._eventProxy.data.callback, 'Callback facade should not be passed on as event data unless e.data.cbid is set');
            },
            'test cl callback facade (activated)': function () {
                var first = 'first arg',
                    second = 'second arg';

                Global.e.data.cbid = 'some cbid';
                CL._initWindowMessageHandler();
                Global._eventProxy.data.callback(first, second);

                A.isFunction(Global._eventProxy.data.callback, 'Callback facade should be passed on as event data when e.data.cbid is set');
                A.areEqual(Global.e.source, Global._postMessage.source, 'Callback facade should execute with the correct source');
                A.areEqual(Global.e.origin, Global._postMessage.origin, 'Callback facade should execute with the correct origin');
                A.areEqual(first, Global._postMessage.message.data.args[0], 'Callback facade should be passed the correct first argument');
                A.areEqual(second, Global._postMessage.message.data.args[1], 'Callback facade should be passed the correct second argument');
            },
            'test _validateEventData': function () {
                var valid = {
                        name: 'event name',
                        guid: 'app guid'
                    },
                    invalid = {
                        name: 'event name',
                    };
                A.isTrue(CL._validateEventData(valid), 'Should return true if valid');
                A.isFalse(CL._validateEventData(invalid), 'Should return false if valid');
            },
            'test _proxyRouter': function () {
                var proxy;

                CL._proxyFor = {
                    eventName: 'handshake proxy',
                    uniqueIdentifier: 'standard proxy'
                };

                proxy = CL._proxyRouter({
                }, {
                    name: 'eventName'
                });
                A.areEqual('handshake proxy', proxy);

                proxy = undefined;
                proxy = CL._proxyRouter({
                    origin: 'Identifier'
                }, {
                    name: 'foo',
                    guid: 'unique'
                });
                A.areEqual('standard proxy', proxy);
            }
        })
    );

    suite.add(
        createTestCase({
            name: 'Establishing a connection between parent and child',
            _afterSetUp: function () {
                Global.e = {
                    source: 'some source',
                    origin: 'some origin'
                };

                CL._getHandshakeToken = function () {
                    return 'some token';
                };

                CL._createEventProxy = function (token) {
                    Global._createEventProxy = {
                        token: token
                    };

                    return {
                        once: function (token, handler) {
                            handler(Global.e);
                        }
                    };
                };

                CL._deleteEventProxy = function (token) {
                    Global._deleteEventProxy = {
                        token: token
                    };
                };

                CL._postMessage = function (source, message, origin) {
                    Global._postMessage = {
                        source: source,
                        message: message,
                        origin: origin
                    };
                };

                CL._parentProxy = {
                    fire: function (name) {
                        Global._parentProxy = {
                            name: name
                        };
                    }
                };

                Y.one = function (node) {
                    return node;
                };
            },
            'test child-side connection flow': function () {
                CL._initParentConnection();

                A.areEqual('some token', Global._createEventProxy.token, 'The handshake event proxy should be created using the token');
                A.areEqual('some token', Global._deleteEventProxy.token, 'The handshake event proxy should be deleted using the token');
                A.areEqual(Global.e.source, CL._parentSource, 'The parent source should be set');
                A.areEqual(Global.e.origin, CL._parentOrigin, 'The parent origin should be set');
                A.areSame(CL._parentProxy, CL._proxyFor[Global.e.guid+Global.e.origin], 'Parent proxy should be recorded under the correct proxy key');
                A.areEqual(CL._APPREADY, Global._parentProxy.name, 'Any buffered events should be flushed');
                A.areEqual('some parent', Global._postMessage.source, 'The source should be set correctly');
                A.areEqual('some token', Global._postMessage.message.name, 'The message should be set correctly');
                A.areEqual('*', Global._postMessage.origin, 'The origin should be set correctly as a wildcard');
            },
            'test parent-side connection flow': function () {
                var iframe = YUITest.Mock();
                YUITest.Mock.expect(iframe, {
                    method: 'test',
                    args: ['iframe'],
                    returns: true
                });
                YUITest.Mock.expect(iframe, {
                    method: 'get',
                    args: ['src'],
                    returns: 'some token'
                });
                CL.register(iframe);

                A.areEqual('some token', Global._deleteEventProxy.token, 'The handshake event proxy should be deleted');
                A.areEqual('some source', Global._postMessage.source, 'The source should be set correctly');
                A.areEqual('some token',  Global._postMessage.message.name, 'The message should be set correctly');
                A.areEqual('some origin', Global._postMessage.origin, 'The origin should be set correctly');
            }
        })
    );

    suite.add(
        createTestCase({
            name: 'CL proxy',
            'test api of proxy instance': function () {
                var eventProxy = {},
                    expectedMethodInvoked = false,
                    clProxy;

                clProxy = CL._createCLProxy(eventProxy, {
                    origin: 'origin',
                    source: 'source',
                    guid: 'guid'
                });

                // Test for "on" method
                eventProxy.on = {
                    apply: function () {
                        expectedMethodInvoked = true;
                    }
                };
                clProxy.on('eventName', function () {});
                A.isTrue(expectedMethodInvoked, 'CL proxy "on" method should invoke a method on event proxy');

                // Test for "ready" method
                eventProxy.on = function () {
                    expectedMethodInvoked = true;
                };
                expectedMethodInvoked = false;
                clProxy.ready();
                A.isTrue(expectedMethodInvoked, 'CL proxy "ready" method should invoke a method on event proxy');

                // Test for "once" method
                delete eventProxy.on;
                expectedMethodInvoked = false;
                eventProxy.once = {
                    apply: function () {
                        expectedMethodInvoked = true;
                    }
                };
                clProxy.once('eventName', function () {});
                A.isTrue(expectedMethodInvoked, 'CL proxy "once" method should invoke a method on event proxy');

                // Test for "purge" method
                delete eventProxy.once;
                expectedMethodInvoked = false;
                eventProxy.detachAll = function () {
                    expectedMethodInvoked = true;
                };
                clProxy.purge();
                A.isTrue(expectedMethodInvoked, 'CL proxy "purge" method should invoke a method on event proxy');

                // Test for "fire" method
                expectedMethodInvoked = false;
                CL._fireWindowMessageEvent = function () {
                    expectedMethodInvoked = true;
                };
                clProxy.fire();
                A.isTrue(expectedMethodInvoked, 'CL proxy "fire" method should invoke _fireWindowMessageEvent');

                // Test for "open" method
                expectedMethodInvoked = false;
                CL._createConnectionObject = function () {
                    expectedMethodInvoked = true;
                };
                clProxy.open();
                A.isTrue(expectedMethodInvoked, 'CL proxy "open" method should invoke _fireWindowMessageEvent');
            }
        })
    );

    suite.add(
        createTestCase({
            name: 'Window message abstraction',
            _afterSetUp: function () {
                var proxy = {
                    on: function (name, handler) {
                        Global._createEventProxy = {
                            name: name,
                            handler: handler
                        }
                    },
                    once: function (name, handler) {
                        Global._createEventProxy = {
                            name: name,
                            handler: handler
                        }
                    }
                };
                Global.proxy = proxy;

                CL._createEventProxy = function () {
                    Global.eventProxyCreated = true;
                    return proxy;
                };

                CL._registerCallback = function () {
                    return 'some cbid';
                };

                CL._postMessage = function (win, msg, org) {
                    Global._postMessage = {
                        window: win,
                        message: msg,
                        origin: org
                    };
                };
            },
            'test subscribing to parent event': function () {
                var onMethodInvoked = false,
                    onceMethodInvoked = false;

                CL._parentProxy = {
                    on: {
                        apply: function (proxy, args) {
                            onMethodInvoked = true;
                        }
                    },
                    once: {
                        apply: function (proxy, args) {
                            onceMethodInvoked = true;
                        }
                    }
                };
                CL._onParentMessageEvent({});
                A.isTrue(onMethodInvoked, '"on" method should be invoked on the parent proxy');
                A.isFalse(onceMethodInvoked, '"once" method should not be invoked on the parent proxy');

                onMethodInvoked = false;
                onceMethodInvoked = false;
                CL._onParentMessageEvent({ once: true });
                A.isFalse(onMethodInvoked, '"on" method should not be invoked on the parent proxy');
                A.isTrue(onceMethodInvoked, '"once" method should be invoked on the parent proxy');
            },
            'test firing a window message': function () {
                CL._fireWindowMessageEvent('some name', 'some window', 'some origin', {
                    data: 'some data',
                    callback: function () {}
                });

                A.areEqual('some window', Global._postMessage.window, 'Window ref should be passed through to _postMessage');
                A.areEqual('some origin', Global._postMessage.origin, 'Origin should be passed through to _postMessage');
                A.areEqual('some name',   Global._postMessage.message.name, 'Event name should be passed through to _postMessage');
                A.areEqual('some data',   Global._postMessage.message.data, 'Event data should be passed through to _postMessage');
                A.areEqual('some cbid',   Global._postMessage.message.cbid, 'Callback ID should be passed through to _postMessage');
            }
        })
    );

    suite.add(
        createTestCase({
            name: 'Establishing a persistent connection via open/close',
            'test that open requires event name and callback': function () {
                var executed;
                CL._fireParentMessageEvent = function (name) {
                    executed = true;
                };
                CL.open('charlize');
                A.isUndefined(executed, 'Event should not be fired unless a callback is provided');
            },
            'test that a subscription was created when opening a connection via a CL proxy': function () {
                var origin = 'origin',
                    source = 'source',
                    guid = 'guid',
                    proxy,
                    connection,
                    firedName,
                    firedCbid,
                    firedData;

                CL._subscriptionFor = {};
                CL._fireWindowMessageEvent = function (name, source, origin, config) {
                    firedName = name;
                    firedData = config.data;
                    firedCbid = config.callback;
                };
                CL._proxyFor = {};
                CL._proxyFor[guid+origin] = {
                    on: function () {
                        return {
                            detach: function () {}
                        };
                    }
                };

                proxy = CL._createCLProxy(null, {
                    origin: origin,
                    source: source,
                    guid: guid
                });
                A.isNotUndefined(proxy, 'A CL proxy should have been successfully instantiated');

                connection = proxy.open('theron', function () {});
                A.isNotUndefined(connection, 'A connection object should be returned when a connection is opened');
                A.isNotUndefined(CL._subscriptionFor.theron, 'A subscription should be created when a connection is opened');

                connection.write('data');
                A.areEqual('data', firedData, 'Data should be fired successfully');
                A.areEqual('theron', firedName, 'Event name should be fired successfully');
                A.isString(firedCbid, 'Callback ID should be fired successfully');

                connection.write('newdata');
                A.areEqual('newdata', firedData, 'Data should be fired successfully');
                A.areEqual('theron', firedName, 'Event name should be fired successfully');
                A.isString(firedCbid, 'Callback ID should be fired successfully');

                connection.close();
                A.isUndefined(CL._subscriptionFor.theron, 'A subscription should be deleted when a connection is closed');

                firedCbid = null;
                firedName = null;
                firedData = null;
                connection.write('data');
                A.isNull(firedData, 'Data should not be fired after the connection is closed');
                A.isNull(firedName, 'Event name should not be fired after the connection is closed');
                A.isNull(firedCbid, 'Callback ID should not be fired after the connection is closed');
            },
            'test that a subscription was created when opening a connection via the CL': function () {
                var connection,
                    firedName,
                    firedCbid,
                    firedData;

                CL._fireWindowMessageEvent = function (name, source, origin, config) {
                    firedName = name;
                    firedData = config.data;
                    firedCbid = config.callback;
                };

                CL._subscriptionFor = {};
                CL._parentAppIsReady = function () { return true; };
                CL._parentGuid = 'guid';
                CL._parentSource = 'source';
                CL._parentOrigin = 'origin';
                CL._proxyFor = {};
                CL._proxyFor[CL._parentGuid+CL._parentOrigin] = {
                    on: function () {
                        return {
                            detach: function () {}
                        };
                    }
                };

                connection = CL.open('searchx', function () {});
                A.isNotUndefined(connection, 'A connection object should be returned when a connection is opened');
                A.isNotUndefined(CL._subscriptionFor.searchx, 'A subscription should be created when a connection is opened');

                connection.write('data');
                A.areEqual('data', firedData, 'Data should be fired successfully');
                A.areEqual('searchx', firedName, 'Event name should be fired successfully');
                A.isString(firedCbid, 'Callback ID should be fired successfully');

                connection.write('newdata');
                A.areEqual('newdata', firedData, 'Data should be fired successfully');
                A.areEqual('searchx', firedName, 'Event name should be fired successfully');
                A.isString(firedCbid, 'Callback ID should be fired successfully');

                connection.close();
                A.isUndefined(CL._subscriptionFor.searchx, 'A subscription should be deleted when a connection is closed');

                firedCbid = null;
                firedName = null;
                firedData = null;
                connection.write('data');
                A.isNull(firedData, 'Data should not be fired after the connection is closed');
                A.isNull(firedName, 'Event name should not be fired after the connection is closed');
                A.isNull(firedCbid, 'Callback ID should not be fired after the connection is closed');
            }
        })
    );

    YUITest.TestRunner.add(suite);

}, '0.0.1', {requires: ['gallery-communication-layer']});
