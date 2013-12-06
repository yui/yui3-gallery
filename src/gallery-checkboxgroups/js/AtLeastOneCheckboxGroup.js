/**
 * @module gallery-checkboxgroups
 */

/**********************************************************************
 * At least one checkbox must be selected.  If the last one is turned off,
 * the active, adjacent one is turned on.  The exact algorithm is explained
 * in "Tog on Interface".  The checkboxes are assumed to be ordered in the
 * order they were added.
 * 
 * @class AtLeastOneCheckboxGroup
 * @extends CheckboxGroup
 * @constructor
 * @param cb_list {String|Node|NodeList} The list of checkboxes to manage
 */

function AtLeastOneCheckboxGroup(
	/* string/Node/NodeList */	cb_list)
{
	this.direction = AtLeastOneDirection.SLIDE_UP;
	AtLeastOneCheckboxGroup.superclass.constructor.call(this, cb_list);

	if (this.allUnchecked())
	{
		this.cb_list.item(0).set('checked', true);
	}
}

var AtLeastOneDirection =
{
	SLIDE_UP:   0,
	SLIDE_DOWN: 1
};

function getNextActiveIndex(
	/* NodeList */	cb_list,
	/* int */		index)
{
	if (cb_list.size() < 2)
		{
		return index;
		}

	var new_index = index;
	do
		{
		if (new_index === 0)
			{
			this.direction = AtLeastOneDirection.SLIDE_DOWN;
			}
		else if (new_index == cb_list.size()-1)
			{
			this.direction = AtLeastOneDirection.SLIDE_UP;
			}

		if (this.direction == AtLeastOneDirection.SLIDE_UP)
			{
			new_index = Math.max(0, new_index-1);
			}
		else
			{
			new_index = Math.min(cb_list.size()-1, new_index+1);
			}
		}
		while (cb_list.item(new_index).get('disabled'));

	return new_index;
}

Y.extend(AtLeastOneCheckboxGroup, CheckboxGroup,
{
	/**
	 * @method enforceConstraints
	 * @param cb_list {String|Object|Array} The list of checkboxes
	 * @param index {Int} The index of the checkbox that changed
	 */
	enforceConstraints: function(
		/* NodeList */	cb_list,
		/* int */		index)
	{
		if (cb_list.item(index).get('checked') || !this.allUnchecked())
		{
			this.direction = AtLeastOneDirection.SLIDE_UP;
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
		cb_list.item(new_index).set('checked', true);
		this.ignore_change = false;
	}
});

Y.AtLeastOneCheckboxGroup = AtLeastOneCheckboxGroup;
