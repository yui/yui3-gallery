YUI.add('rocket-test', function(Y) {
  var suite = new Y.Test.Suite('Rocket');

  suite.add(new Y.Test.Case({
    name: 'General',

    'all the modules exist': function() {
      Y.Assert.isNotUndefined(Y.Rocket);
      Y.Assert.isNotUndefined(Y.RController);
      Y.Assert.isNotUndefined(Y.RModel);
      Y.Assert.isNotUndefined(Y.RView);
      Y.Assert.isNotUndefined(Y.RLayout);
      Y.Assert.isNotUndefined(Y.RListView);
      Y.Assert.isNotUndefined(Y.RChildViewContainer);
      Y.Assert.isNotUndefined(Y.RRegion);
      Y.Assert.isNotUndefined(Y.RRegionManager);
      Y.Assert.isNotUndefined(Y.REventBroker);
      Y.Assert.isNotUndefined(Y.RUtil);
    }
  }));

  Y.Test.Runner.add(suite);
}, '@VERSION@', {
  requires: ['test', 'gallery-rocket']
});
