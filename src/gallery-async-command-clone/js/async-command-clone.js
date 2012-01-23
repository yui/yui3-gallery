/**
 * @module gallery-async-command-clone
 */
(function (Y) {
    'use strict';

    /**
     * Asynchronous command clone plugin.
     * @class AsyncCommandClone
     * @extends Y.Plugin.Base
     * @namespace Y.Plugin
     * @param {Object} config Configuration Object.
     */
    var _class = Y.extend(function (config) {
        _class.superclass.constructor.call(this, config);
    }, Y.Plugin.Base, {
        /**
         * Clones the host AsyncCommand instance in a new unused state.
         * @method clone
         * @return {AsyncCommand}
         */
        clone: function () {
            var config = this.get('host').getAttrs([
                'args',
                'ctx',
                'fn'
            ]);
            
            config.args = config.args.slice(1);
            
            return new Y.AsyncCommand(config);
        }
    }, {
        NAME: 'async-command-clone',
        NS: 'clone'
    });

    Y.Plugin.AsyncCommandClone = _class;
}(Y));