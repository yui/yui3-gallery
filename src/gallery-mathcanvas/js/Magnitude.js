/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Magnitude (absolute value) of a number.</p>
 * 
 * @namespace MathFunction
 * @class Magnitude
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathMagnitude(
	/* MathFunction */	f)
{
	MathMagnitude.superclass.constructor.call(this, "abs", f);
}

Y.extend(MathMagnitude, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.abs(this.args[0].evaluate(var_list));
	},

	/**
	 * @method prepareToRender
	 * @param canvas {MathCanvas} the drawing canvas
	 * @param top_left {point} x,y coordinates of the top left of the bounding box
	 * @param font_size {float} percentage of the base font size
	 * @param rect_list {RectList} layout information
	 * @return {int} index of this items info in rect_list
	 */
	prepareToRender: function(
		/* Context2d */		context,
		/* point */			top_left,
		/* percentage */	font_size,
		/* RectList */		rect_list)
	{
		var bar_width = context.getVerticalBarWidth();

		var arg       = this.args[0];
		var arg_index = arg.prepareToRender(context, top_left, font_size, rect_list);
		var arg_info  = rect_list.get(arg_index);

		rect_list.shift(arg_index, bar_width, 0);		// make space for leading bar

		var r =
		{
			top:    top_left.y,
			left:   top_left.x,
			bottom: arg_info.rect.bottom,
			right:  arg_info.rect.right + bar_width
		};

		return rect_list.add(r, arg_info.midline, font_size, this);
	},

	/**
	 * @method render
	 * @param canvas {MathCanvas} the drawing canvas
	 * @param rect_list {RectList} layout information
	 */
	render: function(
		/* Context2d */	context,
		/* RectList */	rect_list)
	{
		var info = rect_list.find(this);
		context.drawVerticalBar(info.rect);

		this.args[0].render(context, rect_list);

		var r  = Y.clone(info.rect, true);
		r.left = r.right - context.getVerticalBarWidth();
		context.drawVerticalBar(r);
	}
});

MathFunction.Magnitude = MathMagnitude;
