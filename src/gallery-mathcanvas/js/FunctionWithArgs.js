/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Function that takes one or more arguments.</p>
 * 
 * @namespace MathFunction
 * @class FunctionWithArgs
 * @extends MathFunction
 * @constructor
 * @param name {String} the name of the function
 * @param args {MathFunction|Array} the arguments
 */

function MathFunctionWithArgs(
	/* string */		name,
	/* MathFunction */	args)
{
	MathFunctionWithArgs.superclass.constructor.call(this);
	this.name = name;

	if (Y.Lang.isArray(args) && Y.Lang.isArray(args[0]))
	{
		args = args[0];
	}

	this.args = [];
	if (Y.Lang.isArray(args))
	{
		for (var i=0; i<args.length; i++)
		{
			this.appendArg(args[i]);
		}
	}
	else
	{
		for (var i=1; i<arguments.length; i++)
		{
			this.appendArg(arguments[i]);
		}
	}
}

Y.extend(MathFunctionWithArgs, MathFunction,
{
	/**
	 * @method getArgCount
	 * @return {int} number of arguments
	 */
	getArgCount: function()
	{
		return this.args.length;
	},

	/**
	 * @method getArg
	 * @return {MathFunction} requested argument, or undefined
	 */
	getArg: function(
		/* int */ index)
	{
		return this.args[index];
	},

	/**
	 * @method appendArg
	 * @param f {MathFunction}
	 */
	appendArg: function(
		/* MathFunction */	f)
	{
		f.parent = this;
		this.args.push(f);
	},

	/**
	 * @method removeArg
	 * @param f {MathFunction}
	 */
	removeArg: function(
		/* MathFunction */	f)
	{
		var i = Y.Array.indexOf(this.args, f);
		if (i >= 0)
		{
			f.parent = null;
			this.args.splice(i,1);
		}
	},

	/**
	 * If origArg is an argument, replaces origArg with newArg.
	 * 
	 * @method replaceArg
	 * @param origArg {MathFunction} original argument
	 * @param newArg {MathFunction} new argument
	 */
	replaceArg: function(
		/* MathFunction */	origArg,
		/* MathFunction */	newArg)
	{
		var i = Y.Array.indexOf(this.args, origArg);
		if (i >= 0)
		{
			origArg.parent = null;
			newArg.parent  = this;
			this.args[i]   = newArg;
		}
	},

	/**
	 * @method evaluateArgs
	 * @protected
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return list of argument values, from calling evaluate()
	 */
	evaluateArgs: function(
		/* map */	var_list)
	{
		return Y.Array.map(this.args, function(arg)
		{
			return arg.evaluate(var_list);
		});
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
		var r =
		{
			top:    top_left.y,
			left:   top_left.x,
			bottom: top_left.y + context.getLineHeight(font_size),
			right:  top_left.x + context.getStringWidth(font_size, this.name)
		};

		var midline = RectList.ycenter(r);

		// get rectangle for each argument

		var orig_midline = midline;

		var arg_top_left = { x: r.right, y: r.top };
		var sep_width    = context.getStringWidth(font_size, ', ');
		var arg_count    = this.args.length;

		var arg_i = [];
		for (var i=0; i<arg_count; i++)
		{
			var j     = this.args[i].prepareToRender(context, arg_top_left, font_size, rect_list);
			var info  = rect_list.get(j);
			var arg_r = info.rect;

			arg_top_left.x = arg_r.right + sep_width;
			r              = RectList.cover(r, arg_r);

			midline = Math.max(midline, info.midline);
			arg_i.push(j);
		}

		// adjust the argument rectangles so all the midlines are the same
		// (our midline is guaranteed to stay constant)

		if (arg_count > 1 && midline > orig_midline)
		{
			for (var i=0; i<arg_count; i++)
			{
				var j = arg_i[i];
				rect_list.setMidline(j, midline);
				r = RectList.cover(r, rect_list.get(j).rect);
			}
		}

		// Now that the midlines are the same, the height of our rectangle is
		// the height of the parentheses.  We have to shift all the arguments
		// to the right to make space for the left parenthesis.  By shifting
		// the rightmost one first, we avoid overlapping anything.

		var paren_w = context.getParenthesisWidth(r);

		for (var i=0; i<arg_count; i++)
		{
			rect_list.shift(arg_i[i], paren_w, 0);
		}

		// make space for 2 parentheses

		r.right += 2 * paren_w;

		return rect_list.add(r, midline, font_size, this);
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
		context.drawString(info.rect.left, info.midline, info.font_size, this.name);

		var r  =
		{
			top:    info.rect.top,
			bottom: info.rect.bottom
		};

		for (var i=0; i<this.args.length; i++)
		{
			this.args[i].render(context, rect_list);

			var info  = rect_list.find(this.args[i]);
			var arg_r = info.rect;
			if (i === 0)
			{
				r.left = arg_r.left;
			}

			if (i < this.args.length-1)
			{
				context.drawString(arg_r.right, info.midline, info.font_size, ',');
			}
			else
			{
				r.right = arg_r.right;
				context.drawParentheses(r);
			}
		}
	},

	/**
	 * @method toString
	 * @return text representation of the function
	 */
	toString: function()
	{
		return this.name + '(' + this.args.join(',') + ')';
	},

	/**
	 * Print an argument, with parentheses if necessary.
	 * 
	 * @method _printArg
	 * @protected
	 * @param index {number|MathFunction} argument index or MathFunction
	 * @return {string} the string representation of the argument
	 */
	_printArg: function(
		/* int */	index)
	{
		var arg = index instanceof MathFunction ? index : this.args[index];
		if (arg.parenthesizeForPrint(this))
		{
			return '(' + arg + ')';
		}
		else
		{
			return arg.toString();
		}
	}
});

MathFunction.FunctionWithArgs = MathFunctionWithArgs;
