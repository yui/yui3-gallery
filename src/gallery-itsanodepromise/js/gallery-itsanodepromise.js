'use strict';
/**
 * This module adds static methods Y.Node.availablePromise() and Y.Node.contentreadyPromise() to the Y.Node class.<br />
 * By using these Promises, you don't need to listen for the Y.on('available') and Y.on('contentready') events,
 * but can use Promises.
 *
 * @module gallery-itsanodepromise
 * @class Y.Node
 * @since 0.1
 *
 * <i>Copyright (c) 2013 Marco Asbreuk - http://theinternetwizard.net</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

var YNode = Y.Node,
    // To check DOMNodeRemoved-event, the browser must support 'mutation events'. To check this:
    supportsMutationEvents = document.implementation.hasFeature("MutationEvents", "2.0"),
    NODECHECK_TIMER = 250; // ms to repeately check for the node's existance. Only for browsers without supportsMutationEvents

// To make these 2 methods static, we must declare their functions first and then add them to the prototype.
// We cannot declare the prototypefunctions directly, for it would become instance-methods instead of static.

/**
 * Promise that will be resolved once a node is available in the DOM.
 * Exactly the same as when listened to Y.on('available'), except you get a Promise in return.
 *
 * @method availablePromise
 * @static
 * @param nodeid {String} Node-selector by id. You must include the #
 * @param [timeout] {int} Timeout in ms, after which the promise will be rejected.
 *         If omitted, the Promise will never be rejected and can only be fulfilled once the node is available.
 * @return {Y.Promise} promised response --> resolve(Y.Node) OR reject(reason).
 * @since 0.1
*/
YNode.availablePromise = function(nodeid, timeout) {
    Y.log('availablePromise', 'info', 'node');
    return new Y.Promise(function (resolve, reject) {
        Y.once(
            'available',
            function() {
                resolve(Y.one(nodeid));
            },
            nodeid
        );
        if (timeout) {
            Y.later(timeout, null, function() {
                var errormessage = 'node ' + nodeid + ' was not available within ' + timeout + ' ms';
                reject(new Error(errormessage));
            });
        }
    });
};

/**
 * Promise that will be resolved once a node's content is ready.
 * Exactly the same as when listened to Y.on('contentready'), except you get a Promise in return.
 *
 * @method contentreadyPromise
 * @static
 * @param nodeid {String} Node-selector by id. You must include the #
 * @param [timeout] {int} Timeout in ms, after which the promise will be rejected.
 *         If omitted, the Promise will never be rejected and can only be fulfilled once the node's content is ready.
 * @return {Y.Promise} promised response --> resolve(Y.Node) OR reject(reason).
 * @since 0.1
*/
YNode.contentreadyPromise = function(nodeid, timeout) {
    Y.log('contentreadyPromise', 'info', 'node');
    return new Y.Promise(function (resolve, reject) {
        Y.once(
            'contentready',
            function() {
                resolve(Y.one(nodeid));
            },
            nodeid
        );
        if (timeout) {
            Y.later(timeout, null, function() {
                var errormessage = 'the content of node ' + nodeid + ' was not ready within ' + timeout + ' ms';
                reject(new Error(errormessage));
            });
        }
    });
};

/**
 * Promise that will be resolved once a node is NOT in the DOM.
 * That is, when it is not in the DOM already, or when it is removed (using the 'DOMNodeRemoved'-event).
 *
 * @method unavailablePromise
 * @static
 * @param nodeid {String} Node-selector by id. You must include the #
 * @param [timeout] {int} Timeout in ms, after which the promise will be rejected.
 *         If omitted, the Promise will never be rejected and can only be fulfilled once the node is removed.
 * @return {Y.Promise} promised response --> resolve(nodeid {String}) OR reject(reason)
 * @since 0.1
*/
YNode.unavailablePromise = function(nodeid, timeout) {
    Y.log('unavailablePromise', 'info', 'node');
    return new Y.Promise(function (resolve, reject) {
        var continousNodeCheck;
        if (!Y.one(nodeid)) {
            resolve(nodeid);
        }
        else {
            if (supportsMutationEvents) {
                Y.once(
                    'DOMNodeRemoved',
                    function() {
                        resolve(nodeid);
                    },
                    nodeid
                );
            }
            else {
                // nu support for MutationEvents (IE<9) --> we need to check by timer continiously
                continousNodeCheck = Y.later(NODECHECK_TIMER, null, function() {
                    if (!Y.one(nodeid)) {
                        continousNodeCheck.cancel();
                        resolve(nodeid);
                    }
                }, null, true);
            }
            if (timeout) {
                Y.later(timeout, null, function() {
                    var errormessage = 'node ' + nodeid + ' was not removed within ' + timeout + ' ms';
                    // if no MutationEvents are supported, then do a final check for the nodes existance
                    if (!supportsMutationEvents && !Y.one(nodeid)) {
                        resolve(nodeid);
                    }
                    else {
                        reject(new Error(errormessage));
                    }
                });
            }
        }
    });
};

// Adding support for the DONNodeRemoved event if browser supports it:
if (supportsMutationEvents) {
    Y.mix(Y.Node.DOM_EVENTS, {
        DOMNodeRemoved: true
    });
}

Y.Node.prototype.availablePromise = YNode.availablePromise;
Y.Node.prototype.contentreadyPromise = YNode.contentreadyPromise;
Y.Node.prototype.unavailablePromise = YNode.unavailablePromise;