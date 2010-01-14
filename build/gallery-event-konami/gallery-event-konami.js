YUI.add('gallery-event-konami', function(Y) {

/**
 * Based on the Konami code (http://en.wikipedia.org/wiki/Konami_Code).
 * Subscribers to this event should do something special.  The event will be
 * fired only once for each subscriber.  With great power comes great
 * responsibility, after all.
 *
 * @module event-konami
 */

/**
 * Provides a subscribable event named &quot;konami&quot;.
 *
 * @event konami
 * @for YUI
 * @param type {String} 'konami'
 * @param fn {Function} the callback function
 * @param id {String|Node|etc} the element to bind (typically document)
 * @param o {Object} optional context object
 * @param args 0..n additional arguments that should be provided 
 * to the listener.
 * @return {Event.Handle} the detach handle
 */
var progress = {},
    handlers = {},
    keys = [38,38,40,40,37,39,37,39,66,65],
    eventDef;

eventDef = {
    on: function (type, fn, el) {
        var args = Y.Array(arguments,0,true),
            ename;

        el = args[2] = Y.get(el);

        if (el) {
            ename = ('konami_' + Y.stamp(el)).replace(/,/g,'_');

            if (!Y.getEvent(ename)) {
                progress[ename] = 0;
                handlers[ename] = {};

                handlers[ename].dom = el.on('keydown', function (e) {
                    if (e.keyCode === keys[progress[ename]]) {
                        if (++progress[ename] === keys.length) {
                            Y.fire(ename,e);
                            handlers[ename].dom.detach();
                            handlers[ename].proxy.detach();
                            delete handlers[ename];
                        }
                    } else {
                        progress[ename] = 0;
                    }
                });
            }

            args[0] = ename;
            args.splice(2,1);

            handlers[ename].proxy = Y.on.apply(Y,args);
        }
    }
};

Y.Env.evt.plugins.konami = eventDef;
if (Y.Node) {
    Y.Node.DOM_EVENTS.konami = eventDef;
}


}, 'gallery-2009.10.27' ,{requires:['node-base','event-custom']});
