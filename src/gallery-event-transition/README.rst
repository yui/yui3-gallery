===================================
YUI3 CSS Transition Synthetic Event
===================================

Defines normalized CSS3 transition events for the various browser
environments. Currently, the only supported event is ``transitionend`` due
to the current state of browser support. Delegation is not currently
supported for this event.

Example usage:
--------------

HTML::

    <div id="myelement">Hi!</div>

CSS::

    #myelement {
        background-color: #000;
        color: #FFF;
        height: 100px;
        width: 100px;
        -webkit-transition: all 0.3s ease-out;
        -moz-transition: all 0.3s ease-out;
        -ms-transition: all 0.3s ease-out;
        -o-transition: all 0.3s ease-out;
        transition: all 0.3s ease-out;
    }

    #myelement.wow {
        background-color: #FFF;
        color: #000;
    }

JS::

    Y.one('#myelement').on('transitionend', function (e) {
        console.log("transition end!");
    });

    Y.one('#myelement').addClass('wow');
