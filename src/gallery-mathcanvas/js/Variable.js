/**
 * @module gallery-mathcanvas
 */

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
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
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

	/**
	 * @method toString
	 * @return text representation of the function
	 */
	toString: function()
	{
		return this.name;
	}
});

MathFunction.Variable = MathVariable;
