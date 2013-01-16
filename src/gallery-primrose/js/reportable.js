(function () {

  /**
  Reportable handles the results of a suite.

  @class Reportable
  @namespace Primrose
  @extends BaseCore
  @constructor
  **/
  var Reportable = function () {};

  Reportable.prototype = {

    initializer: function () {
      Y.Do.before( this.report, this, 'run', this, 'enter');
      Y.Do.after(  this.report, this, 'run', this, 'exit');

      Y.Do.before( this.report, this, '_runBeforeList', this, 'enter', 'beforeEaches' );
      Y.Do.before( this.report, this, '_runBeforeList', this, 'exit',  'beforeEaches' );
    },

    /**
    @method report
    @param {String} executionPoint
    @param {String} [blockType]
    @todo split this function into smaller pieces
    **/
    report: function (executionPoint, blockType) {
      var description = blockType || this.get('description'),
          passed      = this.get('passed');

      if (Y.Lang.isUndefined( passed ) ) {
        this.fire('report:' + executionPoint, {
          description: description
        });
      }
      else if (executionPoint === 'exit') {
        this.fire('report:result', {
          description: description,
          passed: passed
        });
      }
    },

    /**
    Fires an error event

    @method reportError
    @param {Error} exception
    @param {String} description
    **/
    reportError: function (exception, description) {
      this.fire('report:error', {
        description: description || this.get('description'),
        exception: exception
      });
    }

  };

  Reportable.NAME = 'primrose:reportable';

  // export to the Primrose namespace
  Y.namespace('Primrose').Reportable = Reportable;

}());
