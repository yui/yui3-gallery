YUI.add('gallery-dimensions', function(Y) {

"use strict";

/**********************************************************************
 * Functions for measuring the size of a node.
 * 
 * @module node
 * @submodule gallery-dimensions
 * @class Node~dimensions
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
 * @method emToPx
 * @return {Number} the size of one em in pixels
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
 * @method totalWidth
 * @return {Number} the total width used by the element, including margin, border, and padding  (Margin is not included in offsetWidth.)
 */

Y.Node.prototype.totalWidth = function()
{
	return	this._node.offsetWidth +
			this.parseDimensionStyle('marginLeft') +
			this.parseDimensionStyle('marginRight');
};

/**********************************************************************
 * @method totalHeight
 * @return {Number} the total height used by the element, including margin, border, and padding  (Margin is not included in offsetHeight.)
 */

Y.Node.prototype.totalHeight = function()
{
	return	this._node.offsetHeight +
			this.parseDimensionStyle('marginTop') +
			this.parseDimensionStyle('marginBottom');
};

/**********************************************************************
 * @method insideWidth
 * @return {Number} the available width inside the widget.  (Padding is included in clientWidth.)
 */

Y.Node.prototype.insideWidth = function()
{
	return	this._node.clientWidth -
			this.parseDimensionStyle('paddingLeft') -
			this.parseDimensionStyle('paddingRight');
};

/**********************************************************************
 * @method insideHeight
 * @return {Number} the available height inside the widget.  (Padding is included in clientHeight.)
 */

Y.Node.prototype.insideHeight = function()
{
	return	this._node.clientHeight -
			this.parseDimensionStyle('paddingTop') -
			this.parseDimensionStyle('paddingBottom');
};

/**********************************************************************
 * @method horizMarginBorderPadding
 * @return {Number} the width of everything surrounding the element's content
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
 * @method vertMarginBorderPadding
 * @return {Number} the height of everything surrounding the element's content
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
 * @method parseDimensionStyle
 * @param style {String} the style to parse
 * @return {Number} the size of the style in pixels
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


}, 'gallery-2011.07.06-19-30' ,{requires:['node-style']});
