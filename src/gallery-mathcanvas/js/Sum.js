/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Sum of values.</p>
 * 
 * @namespace MathFunction
 * @class Sum
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 */

function MathSum()
{
	MathMax.superclass.constructor.call(this, "+", new Y.Array(arguments));
}

Y.extend(MathSum, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.add(this.evaluateArgs(var_list));
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

		var total_rect =
		{
			top:    top_left.y,
			left:   top_left.x,
			bottom: top_left.y + context.getLineHeight(font_size),
			right:  top_left.x
		};

		var total_midline = RectList.ycenter(total_rect);
		var orig_midline  = total_midline;

		var space_width = context.getStringWidth(font_size, ' ');
		var plus_width  = context.getStringWidth(font_size, '+');
		var minus_width = context.getStringWidth(font_size, '-');

		Y.Array.each(this.args, function(arg, index)
		{
			var f = this;
			if (arg instanceof MathNegate)
			{
				if (index > 0)
				{
					arg_top_left.x += space_width;
				}
				arg_top_left.x += minus_width + space_width;

				f   = arg;
				arg = arg.args[0];
			}
			else if (index > 0)
			{
				arg_top_left.x += plus_width + 2*space_width;
			}

			var arg_index  = arg.prepareToRender(context, arg_top_left, font_size, rect_list);
			var arg_info   = rect_list.get(arg_index);
			arg_top_left.x = arg_info.rect.right;

			if (arg.parenthesizeForRender(f))
			{
				var paren_width = context.getParenthesisWidth(arg_info.rect);
				rect_list.shift(arg_index, paren_width, 0);
				arg_top_left.x  += 2*paren_width;
				total_rect.right = arg_info.rect.right + paren_width;
			}

			total_rect    = RectList.cover(total_rect, arg_info.rect);
			total_midline = Math.max(total_midline, arg_info.midline);
		},
		this);

		// adjust the argument rectangles so all the midlines are the same
		// (ourMidline is guaranteed to stay constant)

		if (this.args.length > 1 && total_midline > orig_midline)
		{
			Y.Array.each(this.args, function(arg)
			{
				if (arg instanceof MathNegate)
				{
					arg = arg.args[0];
				}

				var index = rect_list.findIndex(arg);
				rect_list.setMidline(index, total_midline);
				total_rect = RectList.cover(total_rect, rect_list.get(index).rect);
			});
		}

		return rect_list.add(total_rect, total_midline, font_size, this);
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
		var info        = rect_list.find(this);
		var x           = info.rect.left;
		var space_width = context.getStringWidth(info.font_size, ' ');

		Y.Array.each(this.args, function(arg, index)
		{
			var f = this;
			if (arg instanceof MathNegate)
			{
				context.drawString(x, info.midline, info.font_size, '-');
				f   = arg;
				arg = arg.args[0];
			}
			else if (index > 0)
			{
				context.drawString(x, info.midline, info.font_size, '+');
			}

			arg.render(context, rect_list);

			var arg_info = rect_list.find(arg);
			x            = arg_info.rect.right;

			if (arg.parenthesizeForRender(f))
			{
				context.drawParentheses(arg_info.rect);
				x += context.getParenthesisWidth(arg_info.rect);
			}

			x += space_width;
		},
		this);
	},

	/**
	 * @method toString
	 * @return text representation of the function
	 */
	toString: function()
	{
		return Y.Array.reduce(this.args, '', function(s, arg, index)
		{
			if (arg instanceof MathNegate)
			{
				s += '-';
				arg = arg.args[0];
			}
			else if (index > 0)
			{
				s += '+';
			}

			return s + this._printArg(arg);
		},
		this);
	}
});

MathFunction.Sum = MathSum;
