YUI.add('gallery-datasource-async-function-tests', function(Y) {
"use strict";

	Y.Test.Runner.add(new Y.Test.Case(
	{
		name: 'Algorithms',

		testSwap: function()
		{
			var ds = new Y.DataSource.AsyncFunction(
			{
				source: function(callback, request)
				{
					Y.later(10, null, function()
					{
						callback(null,
						{
							data: [1,2,3],
							meta: { foo: 'bar' }
						});
					});
				}
			});

			var test = this;
			ds.sendRequest(
			{
				request: null,
				callback:
				{
					success: function(e)
					{
						test.resume(function()
						{
							Y.Assert.areSame(3, e.response.results.length);
							Y.Assert.areSame('bar', e.response.meta.foo);
						});
					},
					failure: function(e)
					{
						test.resume(function()
						{
							Y.Assert.fail('AsyncFunctionDataSource returned failure.');
						});
					}
				}
			});

			test.wait(1000);
		},
	}));

}, '@VERSION@', {requires:['gallery-datasource-async-function','test']});
