(function () {
  var Lang    = Y.Lang,
      YArray  = Y.Array,
      Matchers;

  /**
  @class Matchers
  @namespace Primrose
  @constructor
  **/
  Matchers = function () {};

  Matchers.prototype = {

    /**
    @method toBe
    @param {any} expected
    **/
    toBe: function (expected) {
      this._match('to be ' + expected, function (subject) {
        return subject === expected;
      });
    },

    /**
    @method  toBetypeOf
    @param {String} expected
    **/
    toBeTypeof: function (expected) {
      this._match('to be typeof' + expected, function (subject) {
        return typeof subject === expected;
      });
    },
    
    /**
    @method toMatch
    @param {RegExp} expected
    **/
    toMatch: function (expected) {
      this._match('to match ' + expected, function (subject) {
        return expected.test(subject);
      });
    },

    /**
    @method toBeDefined
    **/
    toBeDefined: function () {
      this._match('to be defined', function (subject) {
        return typeof subject !== 'undefined';
      });
    },

    /**
    @method toBeUndefined
    **/
    toBeUndefined: function () {
      this._match('to be defined', function (subject) {
        return typeof subject === 'undefined';
      });
    },

    /**
    @method toBeNaN
    **/
    toBeNaN: function () {
      this._match('to be NaN', function (subject) {
        return isNaN(subject);
      });
    },

    /**
    @method toInclude
    @param {Array|String} expected
    **/
    toInclude: function (expected) {
      this._match('to contain ' + expected, function (subject) {
        if (typeof subject === 'string') {
          return subject.indexOf(expected) !== -1;
        }
        else if (Lang.isArray(subject)) {
          return YArray.indexOf(subject, expected) !== -1;
        }
      });
    },

    /**
    sets up the matcher

    @method match
    @param {String} description
    @param {Function} validator
    @protected
    **/
    _match: function (description, validator) {
      this.set('matcher', description);
      this.validator = validator;
    }

  };

  Matchers.NAME = 'primrose:matchers';

  Matchers.ATTRS = {
    /**
    description of the matcher

    @attribute matcher
    @type {String}
    **/
    matcher: {
      value: ''
    }
  };

  // export to the Primrose namespace
  Y.namespace('Primrose').Matchers = Matchers;
}());
