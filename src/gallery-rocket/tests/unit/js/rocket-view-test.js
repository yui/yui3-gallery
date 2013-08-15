YUI.add('rocket-view-test', function(Y) {
  var suite = new Y.Test.Suite('View');

  suite.add(new Y.Test.Case({
    name: 'Lifecycle'
  }));

  suite.add(new Y.Test.Case({
    name: 'Attributes'
  }));

  suite.add(new Y.Test.Case({
    name: 'Methods'
  }));

  Y.Test.Runner.add(suite);
}, '@VERSION@', {
  requires: ['test', 'gallery-rocket-view']
});
