YUI({
	modules: {
		'gallery-inview-event': {
			fullpath: "/build/gallery-inview-event/gallery-inview-event.js"
		}
	}
}).add('module-tests', function(Y) {

	var suite = new Y.Test.Suite('gallery-inview-event');

	suite.add(new Y.Test.Case({
		name: 'basic sanity',
		'setUp': function() {
			console.log("==SETUP gallery-inview-event ===");
			var that = this;
			var input = '<div id="test-inview-div"><div style="height:9000px;border:1px solid red;">huge box</div><div id="mynode">small box</div></div>';
			Y.one('body').append(Y.Node.create(input));

			setTimeout(function() {
				Y.one("#mynode").on('inview', function() {
					Y.one("#mynode").setContent('yes i am in view');
					that.inviewfired = true;
					console.log("that.inviewfired = true;");
				})
				window.scrollTo(0, 20000);
			}, 1000);

		},
		'test fire': function() {
			var that = this;
			this.wait(function() {
				Y.Assert.areEqual(that.inviewfired, true);
			}, 2000);
		},
		'tearDown': function() {

		},
	}));

	Y.Test.Runner.add(suite);


}, '', {
	requires: ['test', 'gallery-inview-event', 'node-event-simulate']
});