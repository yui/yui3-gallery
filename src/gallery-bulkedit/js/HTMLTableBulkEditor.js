/**
 * @module gallery-bulkedit
 */

/**
 * <p>HTMLTableBulkEditor builds an HTML table with one tbody for each
 * record.</p>
 *
 * @class HTMLTableBulkEditor
 * @extends BulkEditor 
 * @constructor
 * @param config {Object}
 */
function HTMLTableBulkEditor()
{
	HTMLTableBulkEditor.superclass.constructor.apply(this, arguments);
}

HTMLTableBulkEditor.NAME = "htmltablebulkedit";

HTMLTableBulkEditor.ATTRS =
{
	/**
	 * Configuration for each column: key, label, formatter.
	 *
	 * @config columns
	 * @type {Array}
	 * @writeonce
	 */
	columns:
	{
		validator: Y.Lang.isObject,
		writeOnce: true
	},

	/**
	 * <p>Array of event delegations that will be attached to the container
	 * via Y.delegate().  Each item is an object defining type, nodes, fn.
	 * The function will be called in the context of the BulkEditor
	 * instance.</p>
	 * 
	 * <p>Attaching events to the container before the table is created does
	 * not work in all browsers.</p>
	 *
	 * @config events
	 * @type {Array}
	 * @writeonce
	 */
	events:
	{
		validator: Y.Lang.isObject,
		writeOnce: true
	}
};

var cell_class = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'cell'),
	cell_class_prefix = cell_class + '-',
	odd_class = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'odd'),
	even_class = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'even'),
	msg_class = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'record-message'),
	liner_class = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'liner');

/**
 * Renders an input element in the cell.
 *
 * @method inputFormatter
 * @static
 * @param o {Object} cell, key, value, field, column, record
 */
HTMLTableBulkEditor.inputFormatter = function(o)
{
	o.cell.set('innerHTML', BulkEditor.markup.input.call(this, o));
};

/**
 * Renders a textarea element in the cell.
 *
 * @method textareaFormatter
 * @static
 * @param o {Object} cell, key, value, field, column, record
 */
HTMLTableBulkEditor.textareaFormatter = function(o)
{
	o.cell.set('innerHTML', BulkEditor.markup.textarea.call(this, o));
};

/**
 * Renders a select element in the cell.
 *
 * @method selectFormatter
 * @static
 * @param o {Object} cell, key, value, field, column, record
 */
HTMLTableBulkEditor.selectFormatter = function(o)
{
	o.cell.set('innerHTML', BulkEditor.markup.select.call(this, o));
};

/**
 * Map of field type to cell formatter.
 *
 * @property Y.HTMLTableBulkEditor.defaults
 * @type {Object}
 * @static
 */
HTMLTableBulkEditor.defaults =
{
	input:
	{
		formatter: HTMLTableBulkEditor.inputFormatter
	},

	select:
	{
		formatter: HTMLTableBulkEditor.selectFormatter
	},

	textarea:
	{
		formatter: HTMLTableBulkEditor.textareaFormatter
	}
};

function moveFocus(e)
{
	e.halt();

	var info = this.getRecordAndFieldKey(e.target);
	if (!info)
	{
		return;
	}

	var bd = this.getRecordContainer(e.target);
	if (bd && e.keyCode == 38)
	{
		bd = bd.previousSibling;
	}
	else if (bd)
	{
		bd = bd.nextSibling;
	}

	var id = bd && this.getRecordId(bd);
	if (id)
	{
		var field = this.getFieldElement(id, info.field_key);
		if (field)
		{
			try
			{
				field.focus();
				field.select();
			}
			catch (ex)
			{
				// no way to determine in IE if focus will fail
				// no way to determine if browser allows focus to select elements
			}
		}
	}
}

Y.extend(HTMLTableBulkEditor, BulkEditor,
{
	_renderContainer: function(
		/* element */	container)
	{
		var table_class = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME);

		if (!this.table ||
			container.get('firstChild').get('tagName').toLowerCase() != 'table' ||
			!container.get('firstChild').hasClass(table_class))
		{
			var s = Y.Lang.sub('<table class="{t}"><thead class="{hd}"><tr>',
			{
				t:  table_class,
				hd: Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'hd')
			});

			var row_markup = '<th class="{cell} {prefix}{key}">{label}</th>';

			Y.Array.each(this.get('columns'), function(column)
			{
				s += Y.Lang.sub(row_markup,
				{
					cell:   cell_class,
					prefix: cell_class_prefix,
					key:    column.key,
					label:  column.label || '&nbsp;'
				});
			});

			s += '</tr></thead></table>';

			container.set('innerHTML', s);
			this.table = container.get('firstChild');

			Y.on('key', moveFocus, this.table, 'down:38,40+ctrl', this);

			Y.Object.each(this.get('events'), function(e)
			{
				Y.delegate(e.type, e.fn, this.table, e.nodes, this);
			},
			this);
		}
		else
		{
			while (this.table.get('children').size() > 1)
			{
				this.table.get('lastChild').remove();
			}
		}
	},

	_renderRecordContainer: function(
		/* element */	container,
		/* object */	record)
	{
		var body = Y.Node.create('<tbody></tbody>');
		body.set('id', this.getRecordContainerId(record));
		body.set('className',
			BulkEditor.record_container_class + ' ' +
			((this.table.get('children').size() % 2) ? odd_class : even_class));	// accounts for th row

		var msg_row = Y.Node.create('<tr></tr>');
		msg_row.set('className', BulkEditor.record_msg_container_class);

		var msg_cell = Y.Node.create('<td></td>');
		msg_cell.set('colSpan', this.get('columns').length);
		msg_cell.set('className', msg_class);
		msg_cell.set('innerHTML', BulkEditor.error_msg_markup);

		msg_row.appendChild(msg_cell);
		body.appendChild(msg_row);

		var row = Y.Node.create('<tr></tr>');
		body.appendChild(row);

		this.table.appendChild(body);
		return row;
	},

	_renderRecord: function(
		/* element */	row,
		/* object */	record)
	{
		Y.Array.each(this.get('columns'), function(column)
		{
			var key    = column.key;
			var field  = this.getFieldConfig(key);

			// create cell

			var cell = Y.Node.create('<td></td>');
			cell.set('className', cell_class + ' ' + cell_class_prefix + key);

			// create liner

			var liner = Y.Node.create('<div></div>');
			liner.set('className', liner_class);

			// fill in liner

			var f = null;
			if (Y.Lang.isFunction(column.formatter))
			{
				f = column.formatter;
			}
			else if (field.type && HTMLTableBulkEditor.defaults[ field.type ])
			{
				f = HTMLTableBulkEditor.defaults[ field.type ].formatter;
			}
			else
			{
				if (field.type)
				{
					Y.log('no defaults for type ' + field.type + ', using type "input"', 'warn', 'HTMLTableBulkEditor');
				}

				f = HTMLTableBulkEditor.defaults.input.formatter;
			}

			if (f)
			{
				f.call(this,
				{
					cell:   liner,
					key:    key,
					value:  record[key],
					field:  field,
					column: column,
					record: record
				});
			}

			// append cell

			cell.appendChild(liner);
			row.appendChild(cell);
		},
		this);
	}
});

Y.HTMLTableBulkEditor = HTMLTableBulkEditor;
