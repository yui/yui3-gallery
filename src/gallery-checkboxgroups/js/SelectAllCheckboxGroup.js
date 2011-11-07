/**********************************************************************
 * All checkboxes can be selected and a select-all checkbox is available
 * to check all. This check-all box is automatically changed if any other
 * checkbox changes state.
 * 
 * @class SelectAllCheckboxGroup
 * @extends CheckboxGroup
 * @constructor
 * @param select_all_cb {String|Object} The checkbox that triggers "select all"
 * @param cb_list {String|Node|NodeList} The list of checkboxes to manage
 */

function SelectAllCheckboxGroup(
	/* string/Node */			select_all_cb,
	/* string/Node/NodeList */	cb_list)
{
	this.select_all_cb = Y.one(select_all_cb);
	this.select_all_cb.on('click', this.toggleSelectAll, this);

	SelectAllCheckboxGroup.superclass.constructor.call(this, cb_list);
}

Y.extend(SelectAllCheckboxGroup, CheckboxGroup,
{
	getSelectAllCheckbox: function()
	{
		return this.select_all_cb;
	},

	toggleSelectAll: function()
	{
		var checked = this.select_all_cb.get('checked');
		var count   = this.cb_list.size();
		for (var i=0; i<count; i++)
		{
			var cb = this.cb_list.item(i);
			if (!cb.get('disabled'))
			{
				cb.set('checked', checked);
			}
		}
	},

	enforceConstraints: function(
		/* NodeList */	cb_list,
		/* int */		index)
	{
		this.select_all_cb.set('checked', this.allChecked());
	}
});

Y.SelectAllCheckboxGroup = SelectAllCheckboxGroup;
