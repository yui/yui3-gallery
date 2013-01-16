YUI.add('primrose-method-spy-test', function (Y) {

  Y.namespace('Primrose').MethodSpyTest = new YUITest.TestCase({

    name: "MethodSpy",

    setUp: function () {
      var that = this;

      this.wasRun = false;

      this.meth = function () {
        that.wasRun = true;
      };

      this.obj = {
        meth: this.meth
      };

      this.spy = new Y.Primrose.MethodSpy({
        host:       this.obj,
        targetName: 'meth'
      });
    },

    'it displaces method': function () {
      Y.Assert.areNotEqual(this.meth, this.obj.meth);
    },

    'it records the number of runs': function () {
      this.obj.meth();
      Y.Assert.areEqual(1, this.spy.get('occurrences'));

      this.obj.meth();
      Y.Assert.areEqual(2, this.spy.get('occurrences'));
    },

    'it runs the original function': function () {
      this.obj.meth();
      Y.assert(this.wasRun);
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
