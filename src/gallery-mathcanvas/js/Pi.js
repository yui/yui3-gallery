/**********************************************************************
 * <p>Pi</p>
 * 
 * @namespace MathFunction
 * @class Pi
 * @extends MathFunction
 * @constructor
 */

function MathPi()
{
	MathPi.superclass.constructor.call(this);
}

Y.extend(MathPi, MathFunction,
{
	evaluate: function()
	{
		return Math.PI;
	},

	toString: function()
	{
		return '\u03c0';
	}
});

MathFunction.Pi = MathPi;
