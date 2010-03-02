var keys = {
        enter    : 13,
        esc      : 27,
        backspace: 8,
        tab      : 9,
        pageUp   : 33,
        pageDown : 34,
        left     : 37,
        up       : 38,
        right    : 39,
        down     : 40
    };

Y.Object.each( keys, function ( keyCode, name ) {
    Y.Event.define( name, {
        publishConfig: { emitFacade: false },

        on: function ( node, sub, ce ) {
            sub._evtGuid = Y.guid() + '|';

            node.on( sub._evtGuid + 'keydown', function ( e ) {
                if ( e.keyCode === keyCode ) {
                    e.type = name;
                    ce.fire( e );
                }
            });
        },

        detach: function (node, sub, ce) {
            node.detach(sub._evtGuid + '*');
        }
    } );
} );

Y.Event.define( 'arrow', {
    publishConfig: { emitFacade: false },

    on: function ( node, sub, ce ) {
        var directions = this._directions;

        sub._evtGuid = Y.guid() + '|';

        node.on( 'keydown', function ( e ) {
            if ( e.keyCode > 36 && e.keyCode < 41 ) {
                e.originalType = e.type;
                e.type = 'arrow';
                e.direction = directions[ e.keyCode ];

                ce.fire( e );
            }
        } );
    },

    detach: function ( node, sub, ce ) {
        node.detach( sub._evtGuid + '*' );
    },

    _directions: {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    }
} );
