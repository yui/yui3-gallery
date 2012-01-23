/**********************************************************************
 * <p>Constant value</p>
 * 
 * @namespace MathFunction
 * @class Value
 * @extends MathFunction
 * @constructor
 * @param value {number}
 */

function MathValue(
	/* float */	value)
{
	MathValue.superclass.constructor.call(this);

	var is_string = Y.Lang.isString(value);
	if (is_string &&
		(value.indexOf('.') >= 0 ||
		 (!/x/i.test(value) && /e/i.test(value))))
	{
		this.value = parseFloat(value);
	}
	else if (is_string)
	{
		this.value = parseInt(value);	// do not force base, to allow hex
	}
	else
	{
		this.value = value;
	}
}

Y.extend(MathValue, MathFunction,
{
	evaluate: function()
	{
		return this.value;
	},

	toString: function()
	{
		return this.value;
	}
});

MathFunction.Value = MathValue;
