/**********************************************************************
 * At most one checkbox can be selected.  If one is turned on, the active
 * one is turned off.
 * 
 * @module gallery-checkboxgroups
 * @class AtMostOneCheckboxGroup
 * @constructor
 * @param cb_list {String|Object|Array} The list of checkboxes to manage
 */

function AtMostOneCheckboxGroup(
	/* string/object/array */	cb_list)
{
	AtMostOneCheckboxGroup.superclass.constructor.call(this, cb_list);
}

Y.extend(AtMostOneCheckboxGroup, CheckboxGroup,
{
	enforceConstraints: function(
		/* array */	cb_list,
		/* int */	index)
	{
		if (!cb_list[index].get('checked'))
		{
			return;
		}

		var count = cb_list.length;
		for (var i=0; i<count; i++)
		{
			if (i != index)
			{
				cb_list[i].set('checked', false);
			}
		}
	}
});

Y.AtMostOneCheckboxGroup = AtMostOneCheckboxGroup;
