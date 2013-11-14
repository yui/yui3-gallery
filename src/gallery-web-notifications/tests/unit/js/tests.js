/*jslint browser: true, nomen: true */
/*global YUI: true, webkitNotifications: true */

YUI.add('gallery-web-notifications-tests', function (Y) {
    "use strict";

    var suite = new Y.Test.Suite('gallery-web-notifications');

    suite.add(new Y.Test.Case({
        name: 'Gallery Web Notifications Test',

        _should: {
            ignore: {
                'test close method': true
            }
        },

        'test close method': function () {
            var notification = new Y.WebNotifications(),
                notify,
                ok,
                saved;

            notify = window.Notification || window.webkitNotification;
            saved  = notify.close;

            ok     = false;
            notify.close = function () {
                ok = true;
            };
            notification.show();
            notification.close();

            notify.close = saved;
            Y.Assert.isTrue(ok);
        },

        'test permission method': function () {
            var notification = new Y.WebNotifications();
            Y.Assert.areEqual('granted', notification.permission(0));
        },

        'test permission method for default case': function () {
            var notification = new Y.WebNotifications();
            Y.Assert.areEqual('default', notification.permission());
        },

        'test request method for permission denied case': function () {
            var notification = new Y.WebNotifications(),
                ok = false;

            // Override permission to return denied always
            notification.permission = function () {
                return 'denied';
            };

            notification.request(function () {
                ok = true;
            });
            Y.Assert.isTrue(ok);
        },

        'test request method for permission default case': function () {
            var notification = new Y.WebNotifications(),
                ok = '';

            notification.permission = function () {
                return 'default';
            };
            // Override requestPermission method for testing
            if (window.Notification) {
                window.Notification.requestPermission = function () {
                    return 'granted';
                };
            } else if (typeof webkitNotifications !== 'undefined') {
                webkitNotifications.requestPermission = function () {
                    return 'granted';
                };
            }

            // Before the request is being made, pretend that the
            // user would grant permission
            notification.permission = function () {
                return 'granted';
            };

            notification.request(function () {
                ok = notification.permission();
            });
            Y.Assert.areEqual('granted', ok);
        },

        'test show method for denied case': function () {
            var notification = new Y.WebNotifications(),
                ok = true;

            notification.permission = function () {
                return 'denied';
            };
            notification.request = function () {
                ok = false;
            };

            notification.show('test');
            Y.Assert.isTrue(ok);
        },

        'test show method for default case': function () {
            var notification = new Y.WebNotifications(),
                ok = false;

            notification.permission = function () {
                return 'default';
            };
            notification.request = function () {
                ok = true;
            };

            notification.show('test');
            Y.Assert.isTrue(ok);
        },

        'test show method for granted case': function () {
            var notification = new Y.WebNotifications(),
                ok = false;

            notification.request = function (callback) {
                callback('granted');
            };
            if (window.Notification) {
                window.Notification = function () {
                    ok = true;
                };
            } else if (typeof webkitNotifications !== 'undefined') {
                webkitNotifications.createNotification = function () {
                    ok = true;
                };
            }

            notification.show('test');
            Y.Assert.isTrue(ok);
        }
    }));

    Y.Test.Runner.add(suite);


}, '@VERSION@', { requires: [ 'test' ] });
