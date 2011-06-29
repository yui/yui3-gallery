YUI.add('gallery-test-extras', function(Y) {

"use strict";

/**********************************************************************
 * <p>Additional assertions for unit tests.</p>
 * 
 * @module gallery-test-extras
 * @class Assert
 */

var logToLog10 = 1/Math.log(10);

Y.mix(Y.Assert,
{
	/**
	 * Asserts that the mantissas of two values are with epsilon of each
	 * other.  (The test automatically fails if the exponents are different.)
	 * 
	 * @param expected {Number} the expected value
	 * @param actual {Number} the actual value to test
	 * @param epsilon {Number} the maximum allowed difference in the mantissas
	 */
	areWithinEpsilon: function(expected, actual, epsilon)
	{
		if (Y.Lang.isUndefined(epsilon))
		{
			epsilon = 1e-9;
		}

		if (expected !== 0)
		{
			var scale = Math.pow(10, Math.floor(Math.log(Math.abs(expected))*logToLog10));
			expected /= scale;
			actual   /= scale;
		}

		Y.Assert.isTrue(Math.abs(expected-actual) <= epsilon, 'Values should be within '+epsilon+'\nExpected: '+expected+' (number)\nActual:'+actual+ ' (number)\n-----');
	},

	/**
	 * Asserts that both real and imaginary parts of two complex values are
	 * with epsilon of each other.  (The test automatically fails if the
	 * exponents are different.)
	 * 
	 * @param expected {ComplexNumber} the expected value
	 * @param actual {ComplexNumber} the actual value to test
	 * @param epsilon {ComplexNumber} the maximum allowed difference in the mantissas
	 */
	complexWithinEpsilon: function(expected, actual, epsilon)
	{
		Y.Assert.areWithinEpsilon(expected.r, actual.r, epsilon);
		Y.Assert.areWithinEpsilon(expected.i, actual.i, epsilon);
	}
});


}, 'gallery-2011.06.29-23-18' ,{requires:['test'], optional:['gallery-complexnumber']});
