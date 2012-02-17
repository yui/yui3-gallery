/**********************************************************************
 * <p>Variable value</p>
 * 
 * @namespace MathFunction
 * @class Variable
 * @extends MathFunction
 * @constructor
 * @param name {String}
 */

function MathVariable(
	/* string */	name)
{
	MathVariable.superclass.constructor.call(this);
	this.name = name;
}

Y.extend(MathVariable, MathFunction,
{
	evaluate: function(
		/* map */	var_list)
	{
		var v = var_list[ this.name ];
		if (Y.Lang.isUndefined(v))
		{
			throw new Error("undefined variable: " + this.name);
		}

		return (v instanceof MathFunction ? v.evaluate(var_list) : v);
	},

	toString: function()
	{
		return this.name;
	}
});

MathFunction.Variable = MathVariable;
