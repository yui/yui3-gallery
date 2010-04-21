YUI.add('gallery-outside-events', function(Y) {

/**
 * Outside events are synthetic DOM events that fire when a corresponding native
 * or synthetic DOM event occurs outside a bound element.
 *
 * Many common outside events are pre-defined, and new outside events are cinch
 * to define.
 *
 * @module gallery-outside-events
 */

// Outside events are pre-defined for each of these native DOM events
var nativeEvents = [
        'blur', 'change', 'click', 'dblclick', 'focus', 'keydown', 'keypress',
        'keyup', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup',
        'select', 'submit'
    ];

/**
 * Defines a new outside event to correspond with the given DOM event.
 *
 * New outside events are named <code><event>outside</code> by default, but may
 * optionally be given any name.
 *
 * @method Y.Event.defineOutside
 * @param {String} event DOM event
 * @param {String} name (optional) custom outside event name
 */
Y.Event.defineOutside = function (event, name) {
    name = name || event + 'outside';
    
    Y.Event.define(name, {
        
        publishConfig: { emitFacade: false },
        
        detach: function (node, sub, evt) {
            if (this.subscriberCount(evt) === 1) {
                evt.handle.detach();
            }
        },
        
        init: function (node, sub, evt) {
            var doc = Y.one('doc');
            
            function outside(el) {
                return el !== doc && el !== node && !el.ancestor(function (p) {
                        return p === node;
                    });
            }
            
            evt.handle = doc.on(event, function (e) {
                if (outside(e.target)) {
                    evt.fire(e);
                }
            });
        },
        
        on: function (node, sub, evt) {
            if (this.subscriberCount(evt) === 1) {
                this.init(node, sub, evt);
            }
        },
        
        subscriberCount: function (evt) {
            return Y.Object.keys(evt.getSubs()[0]).length;
        }
    });
};

// Define outside events for some common native DOM events
Y.each(nativeEvents, function (event) {
    Y.Event.defineOutside(event);
});


}, 'gallery-2010.04.21-21-51' ,{requires:['event-focus', 'event-synthetic']});
