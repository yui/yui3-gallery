YUI.add('primrose-api-test', function (Y) {

  Y.namespace('Primrose').APITest = new YUITest.TestCase({

    name: "API",

    'spyOn: it creates a spy based on the type': function () {
      var view = {
        render: function () {},
        on: function () {}
      }, spy;

      spy = Y.Primrose.spyOn( view, 'method', 'render' );

      Y.Assert.areEqual( 'primrose.methodSpy', spy.constructor.NAME );
      Y.Assert.areEqual('render', spy.get('targetName'));

      spy = Y.Primrose.spyOn( view, 'event', 'rendered' );

      Y.Assert.areEqual( 'primrose.eventSpy', spy.constructor.NAME );
      Y.Assert.areEqual('rendered', spy.get('targetName'));
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
