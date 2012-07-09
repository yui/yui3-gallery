/**
 * @module gallery-checkboxgroups
 */

/**********************************************************************
 * At most one checkbox can be selected.  If one is turned on, the active
 * one is turned off.
 * 
 * @class AtMostOneCheckboxGroup
 * @extends CheckboxGroup
 * @constructor
 * @param cb_list {String|Node|NodeList} The list of checkboxes to manage
 */

function AtMostOneCheckboxGroup(
	/* string/Node/NodeList */	cb_list)
{
	AtMostOneCheckboxGroup.superclass.constructor.call(this, cb_list);
}

Y.extend(AtMostOneCheckboxGroup, CheckboxGroup,
{
	/**
	 * @method enforceConstraints
	 * @param cb_list {String|Object|Array} The list of checkboxes
	 * @param index {Int} The index of the checkbox that changed
	 */
	enforceConstraints: function(
		/* NodeList */	cb_list,
		/* int */	index)
	{
		if (!cb_list.item(index).get('checked'))
		{
			return;
		}

		var count = cb_list.size();
		for (var i=0; i<count; i++)
		{
			if (i != index)
			{
				cb_list.item(i).set('checked', false);
			}
		}
	}
});

Y.AtMostOneCheckboxGroup = AtMostOneCheckboxGroup;
