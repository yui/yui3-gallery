YUI.add('primrose-suite-test', function (Y) {

  Y.namespace('Primrose').SuiteTest = new YUITest.TestCase({

    name: "Suite",

    setUp: function () {
      this.subject = new Y.Primrose.Suite();
    },

    'add: it should add children': function () {
      var subject = this.subject,
          child = new Y.Primrose.Suite();

      subject.add(child);

      Y.ArrayAssert.contains(child, subject.get('children'));
      Y.Assert.areEqual(subject.get('children').length, 1);
    },

    'run: it should run all children': function () {
      var childOne = Y.Mock(new Y.Primrose.Suite()),
          childTwo = Y.Mock(new Y.Primrose.Suite());

      Y.Mock.expect(childOne, { method: 'run' });
      Y.Mock.expect(childTwo, { method: 'run' });

      this.subject.add(childOne);
      this.subject.add(childTwo);

      this.subject.run();

      Y.Mock.verify(childOne);
      Y.Mock.verify(childTwo);
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
