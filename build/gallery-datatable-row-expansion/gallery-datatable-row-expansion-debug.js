YUI.add('gallery-datatable-row-expansion', function(Y) {

"use strict";

/**********************************************************************
 * <p>Plugin for DataTable to show additional information for each row via
 * a twistdown.  The result of the template is displayed across all the
 * columns following the twistdown column.</p>
 *
 * @module gallery-datatable-row-expansion
 * @namespace Plugin
 * @class DataTableRowExpansion
 * @extends Plugin.Base
 * @constructor
 * @param config {Object} configuration
 */

function RowExpansion(
	/* object */ config)
{
	RowExpansion.superclass.constructor.call(this, config);
}

RowExpansion.NAME = "DataTableRowExpansionPlugin";
RowExpansion.NS   = "rowexpander";

RowExpansion.ATTRS =
{
	/**
	 * (Required) String template or function that returns a string.
	 *
	 * @config template
	 * @type {String|Function}
	 */
	template:
	{
		value:     '',
		validator: function(value)
		{
			return (Y.Lang.isString(value) || Y.Lang.isFunction(value));
		}
	},

	/**
	 * (Required) Id of a column (usually not displayed) that yields a
	 * unique value for each record.  Used to maintain the twistdown state
	 * when paginating.
	 *
	 * @config uniqueIdKey
	 * @type {String}
	 */
	uniqueIdKey:
	{
		value:     '',
		validator: Y.Lang.isString
	}
};

/**
 * The key used to indicate which column contains the twistdown.
 *
 * @property Y.RowExpansion.column_key
 * @type {String}
 * @value "row-expander"
 */
RowExpansion.column_key = 'row-expander';

/**
 * The class added to rows created by this plugin.
 *
 * @property Y.RowExpansion.row_class
 * @type {String}
 * @value "row-expansion"
 */
RowExpansion.row_class = 'row-expansion';

function formatTwistdown(o)
{
	var plugin = this.rowexpander;
	var row_id = o.data[ plugin.get('uniqueIdKey') ];
	var open   = plugin.open_rows[ row_id ];

	o.td.addClass('row-toggle');
	o.td.replaceClass('row-(open|closed)', open ? 'row-open' : 'row-closed');

	o.td.on('click', function()
	{
		plugin.open_rows[ row_id ] = ! plugin.open_rows[ row_id ];
		Y.later(0, this, function()
		{
			this.syncUI();
		});
	},
	this);

	o.cell.set('innerHTML', '<a class="row-expand-nub" href="javascript:void(0);"></a>');

	if (open)
	{
		var pre_cells = '';
		for (var i=0; i<=plugin.col_count.pre; i++)
		{
			pre_cells += '<td class="yui3-datatable-cell pre-row-expansion">&nbsp;</td>';
		}

		var tmpl = plugin.get('template');
		if (Y.Lang.isFunction(tmpl))
		{
			var s = tmpl.call(this, o.data);
		}
		else
		{
			var s = Y.Lang.sub(tmpl, o.data);
		}

		var row       = o.cell.ancestor();
		var extra_row = Y.Lang.sub(
			'<tr class="{c}">' +
				'{pre}' +
				'<td colspan="{post}" class="yui3-datatable-cell post-row-expansion">{tmpl}</td>' +
			'</tr>',
			{
				c:    row.get('className') + ' ' + RowExpansion.row_class,
				pre:  pre_cells,
				post: plugin.col_count.post,
				tmpl: s
			});

		row.insert(extra_row, 'after');
	}
}

function analyzeColumns()
{
	function countColumns(result, col)
	{
		if (col.key == RowExpansion.column_key)
		{
			col.nodeFormatter = formatTwistdown;
			result.found      = true;
		}
		else if (col.children)
		{
			result = Y.reduce(col.children, result, countColumns);
		}
		else
		{
			result[ result.found ? 'post' : 'pre' ]++;
		}
		return result;
	}

	this.col_count = Y.reduce(
		this.get('host').get('columns'),
		{ pre:0, post:0, found:false },
		countColumns);
}

var shift_map =
{
	above:    [-1,  0],
	below:    [ 1,  0],
	next:     [ 0,  1],
	prev:     [ 0, -1],
	previous: [ 0, -1]
};

/*
Returns the `<td>` Node from the given row and column index.  Alternately,
the `seed` can be a Node.  If so, the nearest ancestor cell is returned.
If the `seed` is a cell, it is returned.  If there is no cell at the given
coordinates, `null` is returned.

Optionally, include an offset array or string to return a cell near the
cell identified by the `seed`.  The offset can be an array containing the
number of rows to shift followed by the number of columns to shift, or one
of "above", "below", "next", or "previous".

<pre><code>// Previous cell in the previous row
var cell = table.getCell(e.target, [-1, -1]);

// Next cell
var cell = table.getCell(e.target, 'next');
var cell = table.getCell(e.taregt, [0, 1];</pre></code>

@method getCell
@param {Number[]|Node} seed Array of row and column indexes, or a Node that
   is either the cell itself or a descendant of one.
@param {Number[]|String} [shift] Offset by which to identify the returned
   cell Node
@return {Node}
@since 3.5.0
**/
function getCell(seed, shift)
{
	var tbody = this.get('container'),
		row, cell;

	if (seed && tbody)
	{
		if (Y.Lang.isString(shift))
		{
			if (shift_map[shift])
			{
				shift = shift_map[shift];
			}
			else
			{
				throw Error('unknown shift in getCell: ' + shift);
			}
		}

		if (Y.Lang.isArray(seed))
		{
			row  = tbody.get('children').item(0);
			cell = row && row.get('children').item(seed[1]);
			if (shift)
			{
				shift[0] += seed[0];
			}
			else
			{
				shift = [ seed[0], 0 ];
			}
		}
		else if (seed._node)
		{
			cell = seed.ancestor('.' + this.getClassName('cell'), true);
			if (cell.ancestor('tr.' + RowExpansion.row_class))
			{
				throw Error('getCell cannot be called with an element from an expansion row');
			}
		}

		if (cell && shift)
		{
			var firstRowIndex = tbody.get('firstChild.rowIndex');
			if (Y.Lang.isArray(shift))
			{
				row       = cell.ancestor();
				var delta = Math.sign(shift[0]);
				if (delta !== 0)
				{
					var rows  = tbody.get('children');
					var index = row.get('rowIndex') - firstRowIndex;
					var count = Math.abs(shift[0]);
					for (var i=0; i<count && row; i++)
					{
						index += delta;
						row    = rows.item(index);
						if (row && row.hasClass(RowExpansion.row_class))
						{
							index += delta;
							row    = rows.item(index);
						}
					}
				}

				index = cell.get('cellIndex') + shift[1];
				cell  = row && row.get('children').item(index);
			}
		}
	}

	return (cell || null);
}

/*
Returns the `<tr>` Node from the given row index, Model, or Model's
`clientId`.  If the rows haven't been rendered yet, or if the row can't be
found by the input, `null` is returned.

@method getRow
@param {Number|String|Model} id Row index, Model instance, or clientId
@return {Node}
@since 3.5.0
**/
function getRow(id)
{
	var tbody = this.get('container') || null;

	if (id)
	{
		id = this._idMap[id.get ? id.get('clientId') : id] || id;
	}

	return tbody &&
		Y.one(Y.Lang.isNumber(id) ? this.getCell([id,0]).ancestor() : '#' + id);
}

function replaceGetters()
{
	var body = this.get('host').body;
	if (body instanceof Y.DataTable.BodyView)
	{
		this.orig_getCell = body.getCell;
		this.orig_getRow  = body.getRow;

		body.getCell = getCell;
		body.getRow  = getRow;
	}
}

function restoreGetters()
{
	var body = this.get('host').body;
	if (this.orig_getCell)
	{
		body.getCell = this.orig_getCell;
	}

	if (this.orig_getRow)
	{
		body.getRow = this.orig_getRow;
	}
}

Y.extend(RowExpansion, Y.Plugin.Base,
{
	initializer: function(config)
	{
		this.open_rows = {};
		this.on('uniqueIdKeyChange', function()
		{
			this.open_rows = {};
		});

		analyzeColumns.call(this);
		this.afterHostEvent('columnsChange', analyzeColumns);

		this.afterHostEvent('renderTable', replaceGetters);
	},

	destructor: function()
	{
		restoreGetters.call(this);
	}
});

Y.namespace("Plugin");
Y.Plugin.DataTableRowExpansion = RowExpansion;


}, 'gallery-2012.04.12-13-50' ,{requires:['datatable','plugin','gallery-funcprog','gallery-node-optimizations','gallery-math'], skinnable:true});
