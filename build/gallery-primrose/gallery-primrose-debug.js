YUI.add('gallery-primrose', function (Y, NAME) {

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

      Y.Do.before( this.report, this, '_runBeforeList', this, 'enter', 'beforeEach' );
      Y.Do.before( this.report, this, '_runBeforeList', this, 'exit',  'beforeEach' );
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
/**
Mixin to provide before each ability

@class BeforeEach
@namespace Primrose
@extends BaseCore
@constructor
**/
Y.namespace('Primrose').BeforeEach = Y.Base.create('primrose:beforeEach',
  Y.BaseCore,
  [],
{
  /**
  add a beforeEach blocks to the suite

  @method addBefores
  @param {Array[Function]} befores
  **/
  addBefores: function (befores) {
    var allBefores = this.get('beforeList').concat(befores);
    this.set('beforeList', allBefores);
  }

});
/**
A Suite defines a `describe` block

@class Suite
@namespace Primrose
@extends Base
@uses Primrose.BeforeEach
@uses Primrose.Reportable
@constructor
**/
Y.namespace('Primrose').Suite = Y.Base.create('primrose:suite',
  Y.Base,
  [Y.Primrose.BeforeEach, Y.Primrose.Reportable],
{

  /**
  add a spec or a suite to the suite

  @method add
  @param {Primrose.Spec|Primrose.Suite} child
  **/
  add: function (child) {
    var befores = this.get('beforeList');

    this.get('children').push(child);

    // enable bubbling
    child.addTarget(this);

    // add any beforeEach blocks to the child
    if (befores.length) {
      child.addBefores( befores );
    }
  },

  /**
  run the suite and children

  @method run
  **/
  run: function () {
    // run all children
    Y.Array.invoke(this.get('children'), 'run');
  }

},
{

  ATTRS: {

    /**
    @attribute description
    @type {String}
    **/
    description: {},

    /**
    @attribute children
    @type {Array[Primrose.Spec|Primrose.Suite]}
    **/
    children: {
      value: []
    },

    /**
    @attribute beforeList
    @type {Array[Function]}
    **/
    beforeList: {
      value: []
    }

  }

});
/**
A Spec defines an `it` block

@class Spec
@namespace Primrose
@extends Base
@uses Primrose.BeforeEach
@uses Primrose.Reportable
@constructor
**/
Y.namespace('Primrose').Spec = Y.Base.create('primrose:spec',
  Y.Base,
  [Y.Primrose.BeforeEach, Y.Primrose.Reportable],
{

  /**
  create an expectation

  @method expect
  @param {any} subject
  @return {Primrose.Expectation}
  **/
  expect: function (subject) {
    return this.add(new Y.Primrose.Expectation({
      subject: subject
    }));
  },

  /**
  add an expectation to the spec

  @method add
  @param {Primrose.Expectation} expectation
  @return {Primrose.Expectation}
  **/
  add: function (expectation) {
    // add the expectation to the spec
    this.get('expectations').push(expectation);

    // enable bubbling
    expectation.addTarget(this);

    return expectation;
  },

  /**
  safe internal runner to keep track of exceptions

  @method _exec
  @protected
  **/
  _exec: function (runner, description) {
    try {
      runner.call(this);
    }
    catch (ex) {
      this.reportError(ex, description);
    }
  },

  /**
  execute the specification

  @method run
  **/
  run: function () {
    this._exec(this._runBeforeList, 'beforeEach');

    this._exec(function () {
      // execute the `it` block - pass in the `expect` method
      this.get('block').call( this, Y.bind(this.expect, this) );

      // validate all expectations
      Y.Array.invoke(this.get('expectations'), 'run');
    }, this.get('description'));
  },

  /**
  execute any beforeEach blocks

  @method _runBeforeList
  @protected
  **/
  _runBeforeList: function () {
    Y.Array.each(this.get('beforeList'), function (before) {
      before();
    });
  }

},
{
  ATTRS: {

    /**
    @attribute description
    @type {String}
    **/
    description: {
      value: '',

      // prefix the description with 'it'
      setter: function (val) {
        return 'it ' + val;
      }
    },

    /**
    @attribute block
    @type {Function}
    **/
    block: {
      value: function () {}
    },

    /**
    @attribute expectations
    @type {Array[Primrose.Expectation]}
    **/
    expectations: {
      value: []
    },

    /**
    @attribute beforeList
    @type {Array[Function]}
    **/
    beforeList: {
      value: []
    }

  }
});
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
(function () {
  var LogReporter = function () {};

  LogReporter.prototype = {

    /**
    indent level

    @property _level
    @type {Integer}
    @default 0
    @protected
    **/
    _level: 0,

    /**
    observes a Suite, Spec or Expectation

    @method observe
    @param {Object} o
    **/
    observe: function (o) {
      o.after('report:enter',   this._handleEnter,  this);
      o.after('report:exit',    this._handleExit,   this);
      o.after('report:result',  this._handleResult, this);
      o.after('report:error',   this._handleError,  this);
    },

    _indentionSpaces: function () {
      var spaces = '';

      for (i = 0; i < this._level; i++) {
        spaces += '.';
      }

      return spaces;
    },

    /**
    handles the `enter` event

    @method _handleEnter
    @param {EventFacade} ev
    @protected
    **/
    _handleEnter: function (ev) {
      this._report([
        this._indentionSpaces(),
        ev.description
      ]);

      this._level++;
    },

    /**
    handles the `exit` event

    @method _handleExit
    @param {EventFacade} ev
    @protected
    **/
    _handleExit: function (/* ev */) {
      this._level--;
    },

    /**
    handles the `result` event

    @method _handleResult
    @param {EventFacade} ev
    @protected
    **/
    _handleResult: function (ev) {
      this._report([
        this._indentionSpaces(),
        ev.passed ? '✔' : '✖',
        ev.description
      ]);
    },

    /**
    handles the `error` event

    @method _handleError
    @param {EventFacade} ev
    @protected
    **/
    _handleError: function (ev) {
      var ex = ev.exception;

      this._report([
        this._indentionSpaces(),
        ev.description,
        '=>',
        ex.name + ': ',
        ex.message
      ], 'warn');
    },

    _report: function (detail, level) {
      level = level || 'info';
      Y.message(detail.join(' '), level);
    }

  };

  Y.namespace('Primrose').LogReporter = LogReporter;

}());
(function () {
  Y.namespace('Primrose');

  var topSuites   = [],
      _reporters  = [],
      ancestor;

  /**
  create a new Primrose.Suite and sub suites/specs

  @method describe
  @param {String} description
  @param {Function} block the describe block
  **/
  Y.Primrose.describe = function (description, block) {
    var suite = new Y.Primrose.Suite({
      description: description
    });

    if (ancestor) {
      ancestor.add(suite);
    }
    else {
      topSuites.push(suite);
    }

    // set up the ancestor for the nested `describe` calls
    ancestor = (function (old) {
      ancestor = suite;
      block.call(suite);

      return old;
    }(ancestor));

    return suite;
  };

  /**
  add a block to run before each spec in the current describe subtree

  @method beforeEach
  @param {Function} before
  **/
  Y.Primrose.beforeEach = function (before) {
    if (!ancestor) {
      throw new Error('"beforeEach" was defined out side of a `describe`');
    }

    ancestor.addBefores([before]);
  };

  /**
  create a new Primrose.Spec for the current suite

  @method it
  @param {String} description
  @param {Function} specification
  **/
  Y.Primrose.it = function (description, block) {
    if (!ancestor) {
      throw new Error([
        '"it',
        description + '"',
        'was defined out side of a `describe`'
      ].join(' '));
    }

    var spec = new Y.Primrose.Spec({
      description:  description,
      block:        block
    });

    ancestor.add(spec);
  };

  /**
  add a reporter to listen for results

  @method addReporter
  @param {Reporter} reporter
  **/
  Y.Primrose.addReporter = function (reporter) {
    _reporters.push(reporter);
    Y.Array.each(topSuites, function (suite) {
      reporter.observe(suite);
    });
  };

  /**
  run all the suites

  @method run
  **/
  Y.Primrose.run = function () {
    var startTime = new Date(),
        duration;

    Y.message('Running Primrose specs');
    Y.message('--------------------------');

    Y.Array.invoke(topSuites, 'run');
    
    duration = new Date() - startTime;

    Y.message('--------------------------');
    Y.message('Completed Primrose specs in: ' + duration + 'ms');
  };
}());


}, 'gallery-2012.12.05-21-01', {"requires": ["base", "base-core", "event-custom", "collection"]});
