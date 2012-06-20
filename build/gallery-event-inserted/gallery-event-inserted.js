YUI.add('gallery-event-inserted', function(Y) {

/*
 * Inserted Event.
 *
 * Uses efficient CSS3 Animation to fire insertion events otherwise falls back
 * to DOMNodeInserted.
 */
var VENDOR = ['', 'WebKit', 'Moz', 'O', 'MS'].filter(function(prefix) {
        return Y.config.win[prefix + 'CSSKeyframesRule'];
    })[0],
    Inserted,
    DOMInserted;

// CSS3 Animation Support
Inserted = {
    NAME: 'INSERTED', // Animation name
    PREFIX: VENDOR ? '-' + VENDOR.toLowerCase() + '-' : VENDOR,
    ANIMATION_START_VENDORS: {
        WebKit: 'webkitAnimationStart',
        O: 'oAnimationStart'
    },
    ANIMATION_START: 'animationstart',
    STYLESHEET: null,

    _init: function() {
        Inserted.ANIMATION_START = Inserted.ANIMATION_START_VENDORS[VENDOR] || Inserted.ANIMATION_START;
        Y.Node.DOM_EVENTS[Inserted.ANIMATION_START] = 1;
        Inserted.STYLESHEET = Y.Node.create('<style type="text/css">@' + Inserted.PREFIX + 'keyframes ' + Inserted.NAME + ' {' +
            'from {clip: rect(1px, auto, auto, auto);} to {clip: rect(0px, auto, auto, auto);}' +
        '}</style>');
        Y.one('head').append(Inserted.STYLESHEET);
    },

    processArgs: function (args, isDelegate) {
        return args.splice(2, 1)[0];
    },

    on: function(node, sub, notifier, filter) {
        var method = filter ? 'delegate' : 'on',
            rule = sub._extra + '{' + Inserted.PREFIX + 'animation-duration: 0.0001s; ' + Inserted.PREFIX + 'animation-name: ' + Inserted.NAME + ' !important;}';

        sub._handle = node[method](Inserted.ANIMATION_START, Y.bind(function(e) {
            if (e._event.animationName === Inserted.NAME && e.target.get('tagName').toLowerCase() === sub._extra) {
                notifier.fire({target: e.target});
            }
        }, this), filter);

        Inserted.STYLESHEET.get('sheet').insertRule(rule, 0);
    },

    delegate: function() {
        this.on.apply(this, arguments);
    },

    detach: function(node, sub, notifier) {
        sub._handle.detach();
    },

    detachDelegate: function() {
        this.detach.apply(this, arguments);
    }
};

// DOMNodeInserted fallback
DOMInserted = {
    TAGS: {},

    _init: function() {
        Y.Node.DOM_EVENTS.DOMNodeInserted = 1;
    },
    
    processArgs: function (args, isDelegate) {
        return args.splice(2, 1)[0];
    },

    on: function(node, sub, notifier, filter) {
        var method = filter ? 'delegate' : 'on';

        if (!DOMInserted.TAGS[sub._extra]) {
            DOMInserted.TAGS[sub._extra] = true;
            Y.all(sub._extra).each(function(item) {
                notifier.fire({target: item});
            });
        }

        sub._handle = node[method]('DOMNodeInserted', Y.bind(function(e) {
            if (e.target.get('tagName').toLowerCase() === sub._extra) {
                notifier.fire({target: e.target});
            }
        }, this), filter);
    },

    delegate: function() {
        this.on.apply(this, arguments);
    },

    detach: function(node, sub, notifier) {
        sub._handle.detach();
    },

    detachDelegate: function() {
        this.detach.apply(this, arguments);
    }
};

// Fallback if CSS3 Animation is not supported
Y.Event.define('inserted', VENDOR ? Inserted : DOMInserted);


}, 'gallery-2012.06.20-20-07' ,{requires:['event', 'node'], skinnable:false});
