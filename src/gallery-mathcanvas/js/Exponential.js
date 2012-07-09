/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Exponential.</p>
 * 
 * @namespace MathFunction
 * @class Exponential
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param b {MathFunction} base
 * @param e {MathFunction} exponent
 */

function MathExponential(
	/* MathFunction */	b,
	/* MathFunction */	e)
{
	MathExponential.superclass.constructor.call(this, "^", b, e);
}

Y.extend(MathExponential, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.pow(this.args[0].evaluate(var_list),
								 this.args[1].evaluate(var_list));
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
		var space_width = context.getStringWidth(font_size, ' ');

		var arg_top_left = Y.clone(top_left, true);
		arg_top_left.x += space_width;

		// get rectangle for base

		var b_arg_index = this.args[0].prepareToRender(context, arg_top_left, font_size, rect_list);
		var b_arg_info  = rect_list.get(b_arg_index);
		arg_top_left.x  = b_arg_info.rect.right;

		if (this.args[0].parenthesizeForRender(this))
		{
			var paren_width = context.getParenthesisWidth(b_arg_info.rect);
			rect_list.shift(b_arg_index, paren_width, 0);
			arg_top_left.x += 2*paren_width;
		}

		// get rectangle for exponent

		var e_font_size = context.getSuperSubFontSize(font_size);

		var e_arg_index = this.args[1].prepareToRender(context, arg_top_left, e_font_size, rect_list);
		var e_arg_info  = rect_list.get(e_arg_index);

		// calculate our rectangle

		var total_rect =
		{
			top:    top_left.y,
			left:   top_left.x,
			bottom: top_left.y + RectList.height(e_arg_info.rect) + context.getSuperscriptHeight(b_arg_info.rect),
			right:  e_arg_info.rect.right
		};

		// shift the base down to the correct position inside ourRect

		if (total_rect.bottom > b_arg_info.rect.bottom)
		{
			rect_list.shift(b_arg_index, 0, total_rect.bottom - b_arg_info.rect.bottom);
		}
		else
		{
			total_rect.bottom = b_arg_info.rect.bottom;
		}

		return rect_list.add(total_rect, b_arg_info.midline, font_size, this);
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
		if (this.args[0].parenthesizeForRender(this))
		{
			var info = rect_list.find(this.args[0]);
			context.drawParentheses(info.rect);
		}

		this.args[0].render(context, rect_list);
		this.args[1].render(context, rect_list);
	},

	/**
	 * @method toString
	 * @return text representation of the function
	 */
	toString: function()
	{
		return this._printArg(0) + '^' + this._printArg(1);
	}
});

MathFunction.Exponential = MathExponential;
