YUI.add('gallery-dimensions', function(Y) {

"use strict";

/**********************************************************************
 * <p>Functions for measuring the size of a node.</p>
 * 
 * @module node
 * @submodule gallery-dimensions
 * @class Node
 */

var em_div = null,

	the_horiz_styles =
	[
		'marginLeft',
		'borderLeftWidth',
		'paddingLeft',
		'paddingRight',
		'borderRightWidth',
		'marginRight'
	],

	the_vert_styles =
	[
		'marginTop',
		'borderTopWidth',
		'paddingTop',
		'paddingBottom',
		'borderBottomWidth',
		'marginBottom'
	];

/**********************************************************************
 * <p>Returns the size of one em in pixels.</p>
 * 
 * @method emToPx
 * @static
 */

Y.Node.emToPx = function(
	/* float */	em_count)
{
	if (!em_div)
	{
		em_div                  = Y.config.doc.createElement('div');
		em_div.style.position   = 'absolute';
		em_div.style.top        = '-10000px';
		em_div.style.left       = '-10000px';
		em_div.style.visibility = 'hidden';
		em_div.style.width      = '10em';
		em_div.style.height     = '10em';
		Y.config.doc.body.appendChild(em_div);
	}
	return em_count * (em_div.offsetWidth / 10.0);
};

/**********************************************************************
 * <p>Computes the size of everything surrounding the element's content.</p>
 * 
 * @method horizMarginBorderPadding
 */

Y.Node.prototype.horizMarginBorderPadding = function()
{
	var w = 0;

	Y.each(the_horiz_styles, function(style)
	{
		w += this.parseDimensionStyle(style);
	},
	this);

	return w;
};

/**********************************************************************
 * <p>Computes the size of everything surrounding the element's content.</p>
 * 
 * @method vertMarginBorderPadding
 */

Y.Node.prototype.vertMarginBorderPadding = function()
{
	var h = 0;

	Y.each(the_vert_styles, function(style)
	{
		h += this.parseDimensionStyle(style);
	},
	this);

	return h;
};

/**********************************************************************
 * <p>Returns the size of the style in pixels.</p>
 * 
 * @method parseDimensionStyle
 */

Y.Node.prototype.parseDimensionStyle = function(
	/* string */	style)
{
	var s = this.getComputedStyle(style);
	if (!s || !/^[0-9]/.test(s))	// ignore values like "medium"
	{
		return 0;
	}

	var v = parseFloat(s, 10);
	if (/em$/.test(s))
	{
		v *= Y.Node.emToPx(1);
	}

	return Math.round(v);
};


}, 'gallery-2011.06.22-20-13' ,{requires:['node-style']});
