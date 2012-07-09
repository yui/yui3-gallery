/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 * @module gallery-paginator
 */

/**
 * ui Component to display a menu for selecting the range of items to display.
 *
 * @class Paginator.ui.ItemRangeDropdown
 * @constructor
 * @param p {Pagintor} Paginator instance to attach to
 */
Paginator.ui.ItemRangeDropdown = function(
	/* Paginator */	p)
{
	this.paginator = p;

	p.on('destroy',               this.destroy, this);
	p.after('recordOffsetChange', this.update,  this);
	p.after('rowsPerPageChange',  this.update,  this);
	p.after('totalRecordsChange', this.update,  this);
	p.after('disabledChange',     this.update,  this);

	p.after('itemRangeDropdownClassChange', this.update, this);
};

/**
 * CSS class assigned to the span
 * @attribute itemRangeDropdownClass
 * @default 'yui-paginator-ir-dropdown'
 */
Paginator.ATTRS.itemRangeDropdownClass =
{
	value : Y.ClassNameManager.getClassName(Paginator.NAME, 'ir-dropdown'),
	validator : Y.Lang.isString
};

/**
 * Used as innerHTML for the span.
 * @attribute itemRangeDropdownTemplate
 * @default '{currentRange} of {totalItems}'
 */
Paginator.ATTRS.itemRangeDropdownTemplate =
{
	value : '{currentRange} of {totalItems}',
	validator : Y.Lang.isString
};

Paginator.ui.ItemRangeDropdown.prototype =
{
	/**
	 * Removes the link/span node and clears event listeners.
	 * @method destroy
	 * @private
	 */
	destroy: function()
	{
		this.span.remove().destroy(true);
		this.span       = null;
		this.menu       = null;
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
			'<span id="'+id_base+'-item-range">' +
			Y.substitute(this.paginator.get('itemRangeDropdownTemplate'),
			{
				currentRange: '<select class="yui-current-item-range"></select>',
				totalItems:   '<span class="yui-item-count"></span>'
			}) +
			'</span>');
		this.span.set('className', this.paginator.get('itemRangeDropdownClass'));

		this.menu = this.span.one('select');
		this.menu.on('change', this._onChange, this);

		this.page_count = this.span.one('span.yui-item-count');

		this.prev_page_count = -1;
		this.prev_page_size  = -1;
		this.prev_rec_count  = -1;
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

		var page    = this.paginator.getCurrentPage();
		var count   = this.paginator.getTotalPages();
		var size    = this.paginator.getRowsPerPage();
		var recs    = this.paginator.getTotalRecords();

		if (count != this.prev_page_count ||
			size  != this.prev_page_size  ||
			recs  != this.prev_rec_count)
		{
			var options    = Y.Node.getDOMNode(this.menu).options;
			options.length = 0;

			for (var i=1; i<=count; i++)
			{
				var range = this.paginator.getPageRecords(i);

				options[i-1] = new Option((range[0]+1) + ' - ' + (range[1]+1), i);
			}

			this.page_count.set('innerHTML', recs);

			this.prev_page_count = count;
			this.prev_page_size  = size;
			this.prev_rec_count  = recs;
		}

		this.span.set('className', this.paginator.get('itemRangeDropdownClass'));
		this.menu.set('selectedIndex', page-1);
		this.menu.set('disabled', this.paginator.get('disabled'));
	},

	_onChange: function(e)
	{
		this.paginator.setPage(parseInt(this.menu.get('value'), 10));
	}
};
