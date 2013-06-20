gallery-beacon-listener
=======================

YUI3 Beacon Listener - Create one or more listeners to watch for nodes with specified selectors to enter either the viewport or a specified region

//Basic usage:

	YUI().use('gallery-beacon-listener', 'transition', function(e){
		var BeaconListener = Y.Perturbatio.BeaconListener,
			myListener;
		//listen for all elements with a class of 'beacon'
		myListener = new BeaconListener({
			beacons: '.beacon'
		});

		Y.on('beaconlistener:found', function(e){
			e.beacon.show(true);
		});

		Y.on('beaconlistener:lost', function(e){
			e.beacon.hide(true);
		});
	});

//Advanced usage:

	YUI().use('gallery-beacon-listener', 'transition', function(e){
		var BeaconListener = Y.Perturbatio.BeaconListener,
			myListener;
		// listen for all elements with a class of 'beacon'
		// but only if they are fully inside the region defined by #my-region
		myListener = new BeaconListener({
			beacons: '.beacon',
			region: '#my-region',
			fullyInside: true,
			pollInterval: 200
		});

		Y.on('beaconlistener:found', function(e){
			e.beacon.show(true);
		});

		Y.on('beaconlistener:lost', function(e){
			e.beacon.hide(true);
		});
	});
