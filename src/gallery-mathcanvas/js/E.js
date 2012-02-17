/**********************************************************************
 * <p>e</p>
 * 
 * @namespace MathFunction
 * @class E
 * @extends MathFunction
 * @constructor
 */

function MathE()
{
	MathE.superclass.constructor.call(this);
}

Y.extend(MathE, MathFunction,
{
	evaluate: function()
	{
		return Math.E;
	},

	toString: function()
	{
		return 'e';
	}
});

MathFunction.E = MathE;
