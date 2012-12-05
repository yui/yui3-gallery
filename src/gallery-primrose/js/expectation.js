/**
@class Expectation
@namespace Primrose
@extends Base
@uses Primrose.Matchers
@uses Primrose.Reportable
@constructor
**/
Y.namespace('Primrose').Expectation = Y.Base.create('primrose:expectation',
  Y.Base,
  [Y.Primrose.Matchers, Y.Primrose.Reportable],
{

  /**
  @method run
  **/
  run: function () {
    return this.validate();
  },

  /**
  reverse the validation

  @method not
  **/
  not: function () {
    this.set('not', true);
    return this;
  },

  /**
  to be overwritten by the matcher

  @method validator
  @param {any} subject
  @return {Boolean}
  @default false
  **/
  validator: function (/* subject */) {
    return false;
  },

  /**
  validate the matcher

  @method validate
  **/
  validate: function () {
    var passed = this.validator.call(
      this,
      this.get('subject')
    );

    if (this.get('not')) {
      passed = !passed;
    }

    this.set('passed', passed);

    return passed;
  }

},
{
  ATTRS: {

    /**
    @attribute description
    @type {String}
    **/
    description: {
      getter: function () {
        var not = this.get('not') ? 'not ' : '',
            description;
        
        description = {
          subject:  this.get('subject'),
          not:      not,
          matcher:  this.get('matcher')
        };

        return Y.Lang.sub(
          'expect {subject} {not}{matcher}',
          description
        );
      }
    },

    /**
    @attribute not
    @type {Boolean}
    **/
    not: {
      value: false
    },

    /**
    @attribute subject
    @type {any}
    **/
    subject: {},

    /**
    @attribute passed
    @type {Boolean}
    **/
    passed: {
      value: false
    }
  }
});
