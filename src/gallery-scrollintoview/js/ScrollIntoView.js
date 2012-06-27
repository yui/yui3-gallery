"use strict";

/**
 * @module gallery-scrollintoview
 */

/**
 * <p>Only scrolls the browser if the object is not currently visible.</p>
 * 
 * <p>This requires that all scrollable elements have position:relative.
 * Otherwise, this algorithm will skip over them with unpredictable
 * results.</p>
 * 
 * @main gallery-scrollintoview
 * @class Node~scrollIntoView
 */

/**
 * @method scrollIntoView
 * @chainable
 */
Y.Node.prototype.scrollIntoView = function()
{
	var ancestor = Y.Node.getDOMNode(this.get('offsetParent'));
	if (!ancestor)
	{
		return this;
	}

	var r =
	{
		top:    this.get('offsetTop'),
		bottom: this.get('offsetTop') + this.get('offsetHeight'),
		left:   this.get('offsetLeft'),
		right:  this.get('offsetLeft') + this.get('offsetWidth')
	};

	r.move = function(
		/* int */	dx,
		/* int */	dy)
	{
		this.top    += dy;
		this.bottom += dy;
		this.left   += dx;
		this.right  += dx;
	};

	while (1)
	{
		while (1)
		{
			var hit_top = (ancestor.offsetParent === null);

			var a = Y.one(ancestor),
				b = (Y.Node.getDOMNode(a) === Y.config.doc.body),
				w = b ? Y.DOM.winWidth() : ancestor.clientWidth,
				h = b ? Y.DOM.winHeight() : ancestor.clientHeight;
			if (ancestor.scrollWidth - a.horizMarginBorderPadding() > w ||
				ancestor.scrollHeight - a.vertMarginBorderPadding() > h)
			{
				break;
			}
			else if (hit_top)
			{
				return this;
			}

			r.move(ancestor.offsetLeft - ancestor.scrollLeft, ancestor.offsetTop - ancestor.scrollTop);
			ancestor = ancestor.offsetParent || ancestor.parentNode;
		}

		var scrollX = (hit_top ? Y.config.doc.documentElement.scrollLeft || Y.config.doc.body.scrollLeft : ancestor.scrollLeft);
		var scrollY = (hit_top ? Y.config.doc.documentElement.scrollTop || Y.config.doc.body.scrollTop : ancestor.scrollTop);

		var d =
		{
			top:    scrollY,
			bottom: scrollY + ancestor.clientHeight,
			left:   scrollX,
			right:  scrollX + ancestor.clientWidth
		};

		var dy = 0;
		if (a.getStyle('overflowY') == 'hidden')
		{
			// don't scroll
		}
		else if (r.top < d.top)
		{
			dy = r.top - d.top;
		}
		else if (r.bottom > d.bottom)
		{
			dy = Math.min(r.bottom - d.bottom, r.top - d.top);
		}

		var dx = 0;
		if (a.getStyle('overflowX') == 'hidden')
		{
			// don't scroll
		}
		else if (r.left < d.left)
		{
			dx = r.left - d.left;
		}
		else if (r.right > d.right)
		{
			dx = Math.min(r.right - d.right, r.left - d.left);
		}

		if (hit_top)
		{
			if (dx || dy)
			{
				window.scrollBy(dx, dy);
			}
			break;
		}
		else
		{
			ancestor.scrollLeft += dx;
			ancestor.scrollTop  += dy;

			r.move(ancestor.offsetLeft - ancestor.scrollLeft, ancestor.offsetTop - ancestor.scrollTop);

			ancestor = ancestor.offsetParent;
		}
	}

	return this;
};
