

/**
 * IMG tag decorator to avoid http 404 error when attaching model data to the src attribute
 *
 * Usage:
 * Needs to be defined first in the Ractive instance arguments as :
 *    var ractive = new Y.Common.Ractive({
 *       ...
 *       decorators: {
 *           imgSrc: Y.Common.RactiveDecorators.imgSource
 *        },
 *        ...
 *    });
 * 
 * and then can be used as :
 * 
 * <img decorator="imgSrc:'{{base}}48x48'"/>
 */ 
Y.Common.RactiveDecorators.imgSource = function (node, content) {
    node.src = content;
    return {
        teardown: function () {

        }
    };

};