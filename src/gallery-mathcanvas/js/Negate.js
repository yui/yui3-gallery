/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Negate a number.</p>
 * 
 * @namespace MathFunction
 * @class Negate
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathNegate(
	/* MathFunction */	f)
{
	MathNegate.superclass.constructor.call(this, "-", f);
}

Y.extend(MathNegate, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.subtract(0, this.args[0].evaluate(var_list));
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
		var arg_top_left = Y.clone(top_left, true);
		arg_top_left.x  += context.getStringWidth(font_size, '-');

		var arg = this.args[0];
		if (arg instanceof MathQuotient)
		{
			arg_top_left.x += context.getStringWidth(font_size, ' ');
		}

		var total_rect =
		{
			top:    top_left.y,
			left:   top_left.x,
			bottom: top_left.y + context.getLineHeight(font_size),
			right:  arg_top_left.x
		};

		var arg_index = arg.prepareToRender(context, arg_top_left, font_size, rect_list);
		var arg_info  = rect_list.get(arg_index);

		if (arg.parenthesizeForRender(this))
		{
			var paren_width = context.getParenthesisWidth(arg_info.rect);
			rect_list.shift(arg_index, paren_width, 0);
			total_rect.right = arg_info.rect.right + paren_width;
		}

		total_rect = RectList.cover(total_rect, arg_info.rect);

		return rect_list.add(total_rect, arg_info.midline, font_size, this);
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
		context.drawString(info.rect.left, info.midline, info.font_size, '-');

		var arg = this.args[0];
		arg.render(context, rect_list);

		if (arg.parenthesizeForRender(this))
		{
			var arg_info = rect_list.find(arg);
			context.drawParentheses(arg_info.rect);
		}
	},

	/**
	 * @method toString
	 * @return text representation of the function
	 */
	toString: function()
	{
		return '-' + this._printArg(0);
	}
});

MathFunction.Negate = MathNegate;
