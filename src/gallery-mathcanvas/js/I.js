/**********************************************************************
 * <p>i (square root of -1)</p>
 * 
 * @namespace MathFunction
 * @class I
 * @extends MathFunction
 * @constructor
 */

function MathI()
{
	MathI.superclass.constructor.call(this);
}

Y.extend(MathI, MathFunction,
{
	evaluate: function()
	{
		return Y.ComplexMath.I;
	},

	toString: function()
	{
		return 'i';
	}
});

MathFunction.I = MathI;
