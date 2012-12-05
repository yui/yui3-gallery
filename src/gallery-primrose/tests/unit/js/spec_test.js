YUI.add('primrose-spec-test', function (Y) {

  Y.namespace('Primrose').SpecTest = new YUITest.TestCase({

    name: "Spec",

    setUp: function () {
      this.subject = new Y.Primrose.Spec();
    },

    'add: it add an expectation': function () {
      var subject = this.subject;
      subject.add(new Y.Primrose.Expectation());
      Y.Assert.areEqual( subject.get('expectations').length, 1);
    },

    'expect: it created an expectation for add': function () {
      var subject = this.subject;

      subject.expect('some subject');
      Y.Assert.areEqual( subject.get('expectations').length, 1);
    },

    'run: it runs beforeList': function () {
      var subject = this.subject,
          beforeWasCalled = false;
          beforeMock = function () {
            beforeWasCalled = true;
          };

      subject.get('beforeList').push(beforeMock);
      subject.run();

      Y.assert(beforeWasCalled, 'the before block should have been called');
    },

    'run: it should run the block': function () {
      var subject = this.subject,
          blockWasCalled = false,
          blockMock = function () {
            blockWasCalled = true;
          };

      subject.set('block', blockMock);

      subject.run();

      Y.assert(blockWasCalled, 'the spec block should have been called');
    },

    'run: it runs expectations': function () {
      var subject = this.subject,
          expectMock = Y.Mock(new Y.Primrose.Expectation());

      Y.Mock.verify(expectMock, {
        method: 'run'
      });

      subject.get('expectations').push(expectMock);

      subject.run();

      Y.Mock.verify(expectMock);
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
