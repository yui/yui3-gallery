/**********************************************************************
 * At least one checkbox must be selected.  If the last one is turned off,
 * the active, adjacent one is turned on.  The exact algorithm is explained
 * in "Tog on Interface".  The checkboxes are assumed to be ordered in the
 * order they were added.
 * 
 * @module gallery-checkboxgroups
 * @class AtLeastOneCheckboxGroup
 * @constructor
 * @param cb_list {String|Object|Array} The list of checkboxes to manage
 */

function AtLeastOneCheckboxGroup(
	/* string/object/array */	cb_list)
{
	AtLeastOneCheckboxGroup.superclass.constructor.call(this, cb_list);
}

function getNextActiveIndex(
	/* array */	cb_list,
	/* int */	index)
{
	if (cb_list.length < 2)
		{
		return index;
		}

	var new_index = index;
	do
		{
		if (new_index === 0)
			{
			this.direction = Direction.SLIDE_DOWN;
			}
		else if (new_index == cb_list.length-1)
			{
			this.direction = Direction.SLIDE_UP;
			}

		if (this.direction == Direction.SLIDE_UP)
			{
			new_index = Math.max(0, new_index-1);
			}
		else
			{
			new_index = Math.min(cb_list.length-1, new_index+1);
			}
		}
		while (cb_list[new_index].get('disabled'));

	return new_index;
}

Y.extend(AtLeastOneCheckboxGroup, CheckboxGroup,
{
	enforceConstraints: function(
		/* array */	cb_list,
		/* int */	index)
	{
		if (cb_list[index].get('checked') || !this.allUnchecked())
		{
			this.direction = Direction.SLIDE_UP;
			return;
		}

		// slide to the adjacent checkbox, skipping over disabled ones

		var new_index = getNextActiveIndex.call(this, cb_list, index);
		if (new_index == index)											// may have hit the end and bounced back
			{
			new_index = getNextActiveIndex.call(this, cb_list, index);	// if newID == id, then there is only one enabled
			}

		// turn the new checkbox on

		this.ignore_change = true;
		cb_list[new_index].set('checked', true);
		this.ignore_change = false;
	}
});

Y.AtLeastOneCheckboxGroup = AtLeastOneCheckboxGroup;
