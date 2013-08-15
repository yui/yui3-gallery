YUI.add('rocket-util-test', function(Y) {
  var suite = new Y.Test.Suite('Util');

  suite.add(new Y.Test.Case({
    name: 'Methods'
  }));

  Y.Test.Runner.add(suite);
}, '@VERSION@', {
  requires: ['test', 'gallery-rocket-util']
});
