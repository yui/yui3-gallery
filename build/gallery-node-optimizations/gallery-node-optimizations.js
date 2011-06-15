YUI.add('gallery-node-optimizations', function(Y) {

"use strict";

/**
 * Optimizations for searching DOM tree.
 *
 * @module gallery-node-optimizations
 * @class Y.Node
 */

var class_name_re = /^\.([-_a-z0-9]+)$/i;
var tag_name_re   = /^[a-z]+$/i;

/**********************************************************************
 * <p>Patch to speed up search for a single class name or single tag name.
 * To use a regular expression, call getAncestorByClassName().</p>
 * 
 * @method ancestor
 * @param fn {String|Function} selector string or boolean method for testing elements
 * @param test_self {Boolean} pass true to include the element itself in the scan
 * @return {Node}
 */

var orig_ancestor = Y.Node.prototype.ancestor;

Y.Node.prototype.ancestor = function(
	/* string */	fn,
	/* bool */		test_self)
{
	if (Y.Lang.isString(fn))
	{
		var m = class_name_re.exec(fn);
		if (m && m.length)
		{
			return this.getAncestorByClassName(m[1], test_self);
		}

		if (tag_name_re.test(fn))
		{
			return this.getAncestorByTagName(fn, test_self);
		}
	}

	return orig_ancestor.apply(this, arguments);
};

/**********************************************************************
 * <p>Searches for an ancestor by class name.  This is significantly faster
 * than using Y.node.ancestor('.classname'), and it accepts a regular
 * expression.</p>
 * 
 * @method getAncestorByClassName
 * @param class_name {String|Regexp} class to search for
 * @param test_self {Boolean} pass true to include the element itself in the scan
 * @return {Node}
 */

Y.Node.prototype.getAncestorByClassName = function(
	/* string */	class_name,
	/* bool */		test_self)
{
	var e = this._node;
	if (!test_self)
	{
		e = e.parentNode;
	}

	while (e && !Y.DOM.hasClass(e, class_name))
	{
		e = e.parentNode;
		if (!e || !e.tagName)
		{
			return null;	// might be hidden, which is outside <fieldset>
		}
	}
	return Y.one(e);
};

/**********************************************************************
 * <p>Searches for an ancestor by tag name.  This is significantly faster
 * than using Y.node.ancestor('tagname').</p>
 * 
 * @method getAncestorByTagName
 * @param tag_name {String} tag name to search for
 * @param test_self {Boolean} pass true to include the element itself in the scan
 * @return {Node}
 */

Y.Node.prototype.getAncestorByTagName = function(
	/* string */	tag_name,
	/* bool */		test_self)
{
	var e = this._node;
	if (!test_self)
	{
		e = e.parentNode;
	}

	tag_name = tag_name.toLowerCase();
	while (e && e.tagName.toLowerCase() != tag_name)
	{
		e = e.parentNode;
		if (!e || !e.tagName)
		{
			return null;	// might be hidden, which is outside <fieldset>
		}
	}
	return Y.one(e);
};

/**********************************************************************
 * <p>Patch to speed up search for a single class name or single tag name.
 * To use a regular expression, call getElementsByClassName().</p>
 * 
 * @method all
 * @param fn {String|Function} selector string or boolean method for testing elements
 * @param test_self {Boolean} pass true to include the element itself in the scan
 * @return {Node}
 */

var orig_all = Y.Node.prototype.all;

Y.Node.prototype.all = function(
	/* string */ selector)
{
	if (Y.Lang.isString(selector))
	{
		var m = class_name_re.exec(selector);
		if (m && m.length)
		{
			return this.getElementsByClassName(m[1]);
		}

		if (tag_name_re.test(selector))
		{
			return this.getElementsByTagName(selector);
		}
	}

	return orig_all.apply(this, arguments);
};

/**********************************************************************
 * <p>Searches for descendants by class name.  Unlike Y.all(), this
 * function accepts a regular expression.</p>
 * 
 * @method getElementsByClassName
 * @param class_name {String|Regexp} class to search for
 * @param tag_name {String} optional tag name to filter by
 * @return {NodeList}
 */

Y.Node.prototype.getElementsByClassName = function(
	/* string */	class_name,
	/* string */	tag_name)
{
	var descendants = this.getElementsByTagName(tag_name || '*');

	var list  = null;
	var count = descendants.size();
	for (var i=0; i<count; i++)
	{
		var e = descendants.item(i);
		if (Y.DOM.hasClass(Y.Node.getDOMNode(e), class_name))
		{
			if (!list)
			{
				list = new Y.NodeList(e);	// can't construct empty list
			}
			else
			{
				list.push(e);
			}
		}
	}

	if (!list)	// can't construct empty list
	{
		list = new Y.NodeList('#surely-this-cannot-possibly-exist-on-your-page');
	}

	return list;
};


}, 'gallery-2011.06.15-19-18' ,{requires:['node-base']});
