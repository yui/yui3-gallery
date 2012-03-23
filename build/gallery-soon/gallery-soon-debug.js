YUI.add('gallery-soon', function(Y) {

/*!
 * based on setImmediate.js. https://github.com/NobleJS/setImmediate
 * Copyright (c) 2011 Barnesandnoble.com, llc and Donavon West
 * https://github.com/NobleJS/setImmediate/blob/master/MIT-LICENSE.txt
 */

/**
 * Similar to Y.later, but sooner.
 * 
 * based on setImmediate.js. https://github.com/NobleJS/setImmediate
 * 
 * Copyright (c) 2011 Barnesandnoble.com, llc and Donavon West
 * 
 * https://github.com/NobleJS/setImmediate/blob/master/MIT-LICENSE.txt
 * @module gallery-lazy-load
 */
(function (Y) {
    'use strict';
    
    var _callbackFunctions = {},
        _string_soon = 'soon',
        _window = Y.config.win,
       
        _call,
        _soon,
        _store;
    
    /*
     * Calls a callback function by id and removes it from the list.
     * @method _call
     * @param {String} id
     * @private
     * @returns {Boolean} true if a function was called.
     */
    _call = function (id) {
        var callbackFunction = _callbackFunctions[id];
        
        if (callbackFunction) {
            callbackFunction();
            delete _callbackFunctions[id];
            return true;
        }
        
        return false;
    };
    
    /**
     * Y.soon accepts a callback function. The callback function will be called once, as soon as possible,
     * in a future turn of the JavaScript event loop.  If the function requires a specific execution
     * context or arguments, wrap it with Y.bind.  Y.soon returns an object with a cancel method. If the
     * cancel method is called before the callback function, the callback function won't be called.
     * 
     * based on setImmediate.js. https://github.com/NobleJS/setImmediate
     * 
     * Copyright (c) 2011 Barnesandnoble.com, llc and Donavon West
     * 
     * https://github.com/NobleJS/setImmediate/blob/master/MIT-LICENSE.txt
     * @method soon
     * @for YUI
     * @param {Function} callback function
     * @returns {Object}
     * <dl>
     *     <dt>
     *         cancel
     *     </dt>
     *     <dd>
     *         If the cancel method is called before the callback function,
     *         the callback function won't be called.
     *     </dd>
     * </dl>
     */
    
    // Check for process.nextTick in Node.js.
    if (Y.UA.nodejs && typeof process !== 'undefined' && 'nextTick' in process) {
        _soon = function (callbackFunction) {
            var id = Y.guid(_string_soon),
                response = _store(id, callbackFunction);
            
            process.nextTick(function () {
                _call(id);
            });
            
            return response;
        };
    } else if (!((function () {
        // Check for a native or already polyfilled implementation of setImmediate.
        var setImmediate = 0;
        
        Y.Array.some([
            'setImmediate',
            'mozSetImmediate',
            'msSetImmediate',
            'oSetImmediate',
            'webkitSetImmediate'
        ], function (method) {
            if (method in _window) {
                setImmediate = _window[method];
                return true;
            }
            
            return false;
        });
                
        if (setImmediate) {
            _soon = function (callbackFunction) {
                var id = Y.guid(_string_soon),
                    response = _store(id, callbackFunction);
                
                setImmediate(function () {
                    _call(id);
                });
                
                return response;
            };
        }
        
        return _soon;
    }()) || (function () {
        // Check for postMessage support but make sure we're not in a WebWorker.
        if (('postMessage' in _window) && !('importScripts' in _window)) {
            // Check if postMessage is asynchronous.
            var oldOnMessage = _window.onmessage,
                postMessage = _window.postMessage,
                postMessageIsAsynchronous = true;
                
            _window.onmessage = function () {
                postMessageIsAsynchronous = false;
            };
            
            postMessage('', '*');
            _window.onmessage = oldOnMessage;
            
            if (postMessageIsAsynchronous) {
                Y.on('message', function (eventFacade) {
                    var event = eventFacade._event;
                        
                    // Only listen to messages from this document.
                    if (event.source === _window && _call(event.data)) {
                        // Other listeners should't care about this message.
                        eventFacade.halt(true);
                    }
                });
                
                _soon = function (callbackFunction) {
                    var id = Y.guid(_string_soon),
                        response = _store(id, callbackFunction);

                    postMessage(id, '*');

                    return response;
                };
            }
        }
        
        return _soon;
    }()) || (function () {
        // Check for MessageChannel support.
        // It's very unlikely that a browser supports MessageChannel but fails the previous check for postMessage.
        // I put them in this order because in my test, postMessage was way faster than MessageChannel in the most
        // popular browsers.
        if ('MessageChannel' in _window) {
            var messageChannel = new MessageChannel(),
                port2 = messageChannel.port2;
                
            messageChannel.port1.onmessage = function (event) {
                _call(event.data);
            };
            
            _soon = function (callbackFunction) {
                var id = Y.guid(_string_soon),
                    response = _store(id, callbackFunction);
                    
                port2.postMessage(id);
                
                return response;
            };
        }
        
        return _soon;
    }()) || (function () {
        // Check for a script node's readystatechange event.
        var Node = Y.Node,
            
            scriptNode = Node.create('<script />');
        
        if ('onreadystatechange' in scriptNode.getDOMNode()) {
            Y.mix(Node.DOM_EVENTS, {
                readystatechange: true
            });
            
            _soon = function (callbackFunction) {
                var id = Y.guid(_string_soon),
                    response = _store(id, callbackFunction),
                    scriptNode = Node.create('<script />');

                scriptNode.on('readystatechange', function () {
                    _call(id);
                    scriptNode.remove(true);
                });
                
                scriptNode.appendTo('body');

                return response;
            };
        }
        
        scriptNode.destroy();
        
        return _soon;
    }()))) {
        // Fallback to Y.later when nothing else works.
        _soon = function (callbackFunction) {
            var id = Y.guid(_string_soon),
                response = _store(id, callbackFunction);

            Y.later(0, null, _call, [
                id
            ]);

            return response;
        };
    }
    
    /*
     * Stores a callback function by id and returns an object with a cancel method.
     * @method _store
     * @param {String} id
     * @param {Function} callbackFunction
     * @private
     * @returns {Object}
     * <dl>
     *     <dt>
     *         cancel
     *     </dt>
     *     <dd>
     *         If the cancel method is called before the callback function,
     *         the callback function won't be called.
     *     </dd>
     * </dl>
     */
    _store = function (id, callbackFunction) {
        _callbackFunctions[id] = callbackFunction;
        
        return {
            cancel: function () {
                delete _callbackFunctions[id];
            }
        };
    };
    
    Y.soon = _soon;
}(Y));


}, 'gallery-2012.03.23-18-00' ,{requires:['node-base'], skinnable:false});
