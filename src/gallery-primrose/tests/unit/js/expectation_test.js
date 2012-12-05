YUI.add('primrose-expectation-test', function (Y) {

  Y.namespace('Primrose').ExpectationTest = new YUITest.TestCase({

    name: "Expectation",

    setUp: function () {
      this.subject = new Y.Primrose.Expectation();
    },

    'run: it runs validate': function () {
      var validateWasCalled = false,
          subject = this.subject;

      subject.validate = function () {
        validateWasCalled = true;
      };

      subject.run();

      Y.assert(validateWasCalled, 'validate should have been called');
    },

    'not: it negates the expectation': function () {
      var subject = this.subject;
      subject.not();
      Y.assert( subject.get('not'), 'it should be negated' );
    },

    'validate:it calls the validator': function () {
      var validatorWasCalled = false,
          subject = this.subject;

      subject.validator = function () {
        validatorWasCalled = true;
      };

      subject.validate();

      Y.assert(validatorWasCalled, 'validator should have been called');
    },

    'validate: it sets the result': function () {
      var subject = this.subject;

      subject.validator = function () {
        return true;
      };

      subject.validate();

      Y.assert(subject.get('passed'), 'it should have passed');
    }

  });

},
'0.0.1',
{
  requires: [
    'test',
    'gallery-primrose'
  ]
});
