

/**
 *  This decorator sets styles inline, one use case is to avoid http 404 error when attaching model
 *  data to a background image property using inline styles
 *
 * Usage:
 * Needs to be defined first in the Ractive instance arguments as :
 *    var ractive = new Y.Common.Ractive({
 *       ...
 *       decorators: {
 *           style: Y.Common.RactiveDecorators.style
 *        },
 *        ...
 *    });
 *
 * and then can be used as :
 *
 * <img decorator="style:'background-image: url({{base}}48x48)'"/>
 */
Y.Common.RactiveDecorators.style = function (node, content) {
    var ynode = Y.one(node);
    ynode.setAttribute('style', ynode.getAttribute('style') + content);
    return {
        teardown: function () {

        }
    };
};