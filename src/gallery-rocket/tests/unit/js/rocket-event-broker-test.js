YUI.add('rocket-event-broker-test', function(Y) {
  var suite = new Y.Test.Suite('EventBroker');

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
  requires: ['test', 'gallery-rocket-event-broker']
});
