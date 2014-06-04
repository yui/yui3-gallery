YUI.add('gallery-itsagarbagecollector-node', function (Y, NAME) {

/**
 *
 * Background process that keeps the internal Y.Node._instances healty by periodic remove node-instances that left the DOM
 *
 * @module gallery-itsagarbagecollector-node
 * @since 0.1
 *
 * <i>Copyright (c) 2014 Marco Asbreuk - http://itsasbreuk.nl</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

var INTERVAL = 2000,
    BATCHCOUNT = 10,
    lastPos = 0;

Y.later(INTERVAL, null, function() {
    var i = 0,
        earlyExit = false,
        exitCount = lastPos+BATCHCOUNT;
    Y.Object.some(
        Y.Node._instances,
        function(nodeinstance) {
            // start with position last left: we don't want to process only the first items every time
            if (++i>lastPos) {
                if (!Y.DOM.contains(Y.config.doc, nodeinstance.getDOMNode())) {
                    // not in the DOC, now the node MIGHT have been removed,
                    // but it could also mean someone defined Y.Node.create() but didn't had the change yet to insert
                    // so, we first set a flag and expect these nodes to be inserted before the next loop
/*jshint expr:true */
                    nodeinstance._isFlaggedGC ? nodeinstance.destroy(false) : (nodeinstance._isFlaggedGC=true);
/*jshint expr:false */
                }
                earlyExit = (i>=exitCount);
            }
            return earlyExit;
        }
    );
    lastPos = earlyExit ? i : 0;
}, null, true);



}, 'gallery-2014.06.04-21-38', {"requires": ["yui-base", "dom-core", "node-core", "yui-later"]});
