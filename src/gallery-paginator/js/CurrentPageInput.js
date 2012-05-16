/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 * @module gallery-paginator
 */

/**
 * Generates an input field for setting the current page.
 *
 * @class Paginator.ui.CurrentPageInput
 * @constructor
 * @param p {Pagintor} Paginator instance to attach to
 */
Paginator.ui.CurrentPageInput = function(
	/* Paginator */	p)
{
	this.paginator = p;

	p.on('destroy',               this.destroy, this);
	p.after('recordOffsetChange', this.update,  this);
	p.after('rowsPerPageChange',  this.update,  this);
	p.after('totalRecordsChange', this.update,  this);
	p.after('disabledChange',     this.update,  this);

	p.after('pageInputClassChange', this.update, this);
};

/**
 * CSS class assigned to the span
 * @attribute pageInputClass
 * @default 'yui-paginator-page-input'
 */
Paginator.ATTRS.pageInputClass =
{
	value : Y.ClassNameManager.getClassName(Paginator.NAME, 'page-input'),
	validator : Y.Lang.isString
};

/**
 * Used as innerHTML for the span.
 * @attribute pageInputTemplate
 * @default '{currentPage} of {totalPages}'
 */
Paginator.ATTRS.pageInputTemplate =
{
	value : '{currentPage} of {totalPages}',
	validator : Y.Lang.isString
};

Paginator.ui.CurrentPageInput.prototype =
{
	/**
	 * Removes the span node and clears event listeners.
	 * @method destroy
	 * @private
	 */
	destroy: function()
	{
		this.span.remove().destroy(true);
		this.span       = null;
		this.input      = null;
		this.page_count = null;
	},

	/**
	 * Generate the nodes and return the appropriate node given the current
	 * pagination state.
	 * @method render
	 * @param id_base {string} used to create unique ids for generated nodes
	 * @return {HTMLElement}
	 */
	render: function(
		id_base)
	{
		if (this.span) {
			this.span.remove().destroy(true);
		}

		this.span = Y.Node.create(
			'<span id="'+id_base+'-page-input">' +
			Y.substitute(this.paginator.get('pageInputTemplate'),
			{
				currentPage: '<input class="yui-page-input"></input>',
				totalPages:  '<span class="yui-page-count"></span>'
			}) +
			'</span>');
		this.span.set('className', this.paginator.get('pageInputClass'));

		this.input = this.span.one('input');
		this.input.on('change', this._onChange, this);
		this.input.on('key', this._onReturnKey, 'down:13', this);

		this.page_count = this.span.one('span.yui-page-count');

		this.update();

		return this.span;
	},

	/**
	 * Swap the link and span nodes if appropriate.
	 * @method update
	 * @param e {CustomEvent} The calling change event
	 */
	update: function(
		/* CustomEvent */ e)
	{
		if (e && e.prevVal === e.newVal)
		{
			return;
		}

		this.span.set('className', this.paginator.get('pageInputClass'));
		this.input.set('value', this.paginator.getCurrentPage());
		this.input.set('disabled', this.paginator.get('disabled'));
		this.page_count.set('innerHTML', this.paginator.getTotalPages());
	},

	_onChange: function(e)
	{
		this.paginator.setPage(parseInt(this.input.get('value'), 10));
	},

	_onReturnKey: function(e)
	{
		e.halt(true);
		this.paginator.setPage(parseInt(this.input.get('value'), 10));
	}
};
