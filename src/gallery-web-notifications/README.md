Gallery Web Notifications (gallery-web-notifications)
=====================================================

This module provides web notifications API, an end-user notification outside the context of a web page.  This module normalizes the APIs across Firefox, Chrome and Safari and provides a consistent API for applications.

This module has been tested on Firefox 24, Chrome 30 and Safari 7.
Check [caniuse.com](http://caniuse.com/#search=notifications) for browser support.

How to use the module
---------------------

Include `gallery-web-notifications` and use it like:

    YUI().use('gallery-web-notifications', function (Y) {
        try {
            var notification = new Y.WebNotifications();
            notification.show('title', 'message');
        } catch (e) {}
    });
