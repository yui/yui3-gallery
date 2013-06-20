YUI.add('module-tests', function(Y) {

	var suite = new Y.Test.Suite('gallery-beacon-listener'),
		BeaconListener = Y.BeaconListener;
		
	suite.add(new Y.Test.Case({
		name: 'Automated Tests',
		setUp: function(){
			this.listener = new BeaconListener();
		},
		takeDown: function(){
			delete this.listener;
		},
		testIsNotListening: function() {
			var listener = new BeaconListener({
				beacons: '.beacon'
			});
			
			Y.Assert.isFalse(listener.isListening());
		},
		testIsListening: function() {
			var listener = new BeaconListener({
				beacons: '.beacon'
			});
			listener.start();
			Y.Assert.isTrue(listener.isListening());
		   	listener.stop();
		}
	}));

	Y.Test.Runner.add(suite);


},'@VERSION@', { requires: [ 'test', 'gallery-beacon-listener' ] });
