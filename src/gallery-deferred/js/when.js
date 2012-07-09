
/**
 * Returns a promise for a (possibly) asynchronous call.
 * Calls a given function that receives the new promise as parameter and must call resolve()
 * or reject() at a certain point
 * @method defer
 * @param {Function} fn A function that encloses an async call.
 * @return {Promise} a promise
 * @static
 * @for YUI
 */
Y.defer = function (fn, context) {
	var promise = new Y.Promise();
	fn(promise);
	return promise;
};

/**
 * Waits for a series of asynchronous calls to be completed
 * @method when
 * @param {Promise|Array|Function} deferred Any number of Promise instances or arrays of instances. If a function is provided, it is executed at once
 * @return {Promise} a promise
 * @static
 * @for YUI
 */
Y.when = function () {
	var deferreds = Y.Promise._flatten(YArray(arguments)),
		args = [],
		resolved = 0,
		rejected = 0;
			
	return Y.defer(function (promise) {
		function notify(i, _args) {
			args[i] = _args;
			if (resolved + rejected === deferreds.length) {
				if (rejected > 0) {
					promise.reject.apply(promise, args);
				} else {
					promise.resolve.apply(promise, args);
				}
			}
		}
		
		function done(index) {
			resolved++;
			notify(index, SLICE.call(arguments, 1));
		}
		
		function fail(index) {
			rejected++;
			notify(index, SLICE.call(arguments, 1));
		}

		YArray.each(deferreds, function (deferred, i) {
			if (Y.Lang.isFunction(deferred)) {
				done(i, deferred());
			} else {
				deferred.then(Y.bind(done, deferred, i), Y.bind(fail, deferred, i));
			}
		});
	});
};