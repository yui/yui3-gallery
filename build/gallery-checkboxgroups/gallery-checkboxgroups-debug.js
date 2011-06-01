YUI.add('gallery-checkboxgroups', function(Y) {

var Y_NodeList = Y.NodeList,
    ArrayProto = Array.prototype,
    ArrayMethods = [
        /** Returns a new NodeList combining the given NodeList(s) 
          * @for NodeList
          * @method concat
          * @param {NodeList | Array} valueN Arrays/NodeLists and/or values to
          * concatenate to the resulting NodeList
          * @return {NodeList} A new NodeList comprised of this NodeList joined with the input.
          */
        'concat',
        /** Removes the first last from the NodeList and returns it.
          * @for NodeList
          * @method pop
          * @return {Node} The last item in the NodeList.
          */
        'pop',
        /** Adds the given Node(s) to the end of the NodeList. 
          * @for NodeList
          * @method push
          * @param {Node | DOMNode} nodeN One or more nodes to add to the end of the NodeList. 
          */
        'push',
        /** Removes the first item from the NodeList and returns it.
          * @for NodeList
          * @method shift
          * @return {Node} The first item in the NodeList.
          */
        'shift',
        /** Returns a new NodeList comprising the Nodes in the given range. 
          * @for NodeList
          * @method slice
          * @param {Number} begin Zero-based index at which to begin extraction.
          As a negative index, start indicates an offset from the end of the sequence. slice(-2) extracts the second-to-last element and the last element in the sequence.
          * @param {Number} end Zero-based index at which to end extraction. slice extracts up to but not including end.
          slice(1,4) extracts the second element through the fourth element (elements indexed 1, 2, and 3).
          As a negative index, end indicates an offset from the end of the sequence. slice(2,-1) extracts the third element through the second-to-last element in the sequence.
          If end is omitted, slice extracts to the end of the sequence.
          * @return {NodeList} A new NodeList comprised of this NodeList joined with the input.
          */
        'slice',
        /** Changes the content of the NodeList, adding new elements while removing old elements.
          * @for NodeList
          * @method splice
          * @param {Number} index Index at which to start changing the array. If negative, will begin that many elements from the end.
          * @param {Number} howMany An integer indicating the number of old array elements to remove. If howMany is 0, no elements are removed. In this case, you should specify at least one new element. If no howMany parameter is specified (second syntax above, which is a SpiderMonkey extension), all elements after index are removed.
          * {Node | DOMNode| element1, ..., elementN 
          The elements to add to the array. If you don't specify any elements, splice simply removes elements from the array.
          * @return {NodeList} The element(s) removed.
          */
        'splice',
        /** Adds the given Node(s) to the beginning of the NodeList. 
          * @for NodeList
          * @method push
          * @param {Node | DOMNode} nodeN One or more nodes to add to the NodeList. 
          */
        'unshift'
    ];


Y.Array.each(ArrayMethods, function(name) {
    Y_NodeList.prototype[name] = function() {
        var args = [],
            i,
            arg;

        for (i=0; i<arguments.length; i++) { // use DOM nodes/nodeLists 
            arg = arguments[i];
            args.push(arg._node || arg._nodes || arg);
        }
        return Y.Node.scrubVal(ArrayProto[name].apply(this._nodes, args));
    };
});
"use strict";

/**********************************************************************
 * <p>Base class for enforcing constraints on groups of checkboxes.</p>
 *
 * <p>Derived classes must override <code>enforceConstraints()</code>.</p>
 * 
 * @module gallery-checkboxgroups
 * @class CheckboxGroup
 * @constructor
 * @param cb_list {String|Node|NodeList} The list of checkboxes to manage
 */

function CheckboxGroup(
	/* string/Node/NodeList */	cb_list)
{
	this.cb_list = new Y.NodeList('');
	this.ev_list = [];
	this.splice(0, 0, cb_list);

	this.ignore_change = false;
}

function checkboxChanged(
	/* event */		e,
	/* object */	obj)
{
	this.checkboxChanged(e.target);
}

CheckboxGroup.prototype =
{
	/**
	 * @return {NodeList} List of managed checkboxes
	 */
	getCheckboxList: function()
	{
		return this.cb_list;
	},

	/**
	 * Same functionality as <code>Array.splice()</code>.  Operates on the
	 * list of managed checkboxes.
	 * 
	 * @param start {Int} Insertion index
	 * @param delete_count {Int} Number of items to remove, starting from <code>start</code>
	 * @param cb_list {String|Node|NodeList} The list of checkboxes to insert at <code>start</code>
	 */
	splice: function(
		/* int */					start,
		/* int */					delete_count,
		/* string/Node/NodeList */	cb_list)
	{
		for (var i=start; i<delete_count; i++)
		{
			this.ev_list[i].detach();
		}

		if (Y.Lang.isString(cb_list))
		{
			cb_list = Y.all(cb_list);
		}

		if (cb_list instanceof Y.NodeList)
		{
			cb_list.each(function(cb, i)
			{
				var j=start+i, k=(i===0 ? delete_count : 0);
				this.cb_list.splice(j, k, cb);
				this.ev_list.splice(j, k, cb.on('click', checkboxChanged, this));
			},
			this);
		}
		else if (cb_list instanceof Y.Node)
		{
			this.cb_list.splice(start, delete_count, cb_list);
			this.ev_list.splice(start, delete_count, cb_list.on('click', checkboxChanged, this));
		}
		else
		{
			this.cb_list.splice(start, delete_count);
			this.ev_list.splice(start, delete_count);
		}
	},

	checkboxChanged: function(
		/* checkbox */	cb)
	{
		if (this.ignore_change || this.cb_list.isEmpty() || this.allDisabled())
		{
			return;
		}

		cb = Y.one(cb);

		this.cb_list.each(function(cb1, i)
		{
			if (cb1 == cb)
			{
				this.enforceConstraints(this.cb_list, i);
			}
		},
		this);
	},

	/**
	 * Derived classes must override this function to implement the desired behavior.
	 * 
	 * @param cb_list {String|Object|Array} The list of checkboxes
	 * @param index {Int} The index of the checkbox that changed
	 */
	enforceConstraints: function(
		/* NodeList */	cb_list,
		/* int */		index)
	{
	},

	/**
	 * @return {boolean} <code>true</code> if all checkboxes are checked
	 */
	allChecked: function()
	{
		var count = this.cb_list.size();
		for (var i=0; i<count; i++)
		{
			var cb = this.cb_list.item(i);
			if (!cb.get('disabled') && !cb.get('checked'))
			{
				return false;
			}
		}

		return true;
	},

	/**
	 * @return {boolean} <code>true</code> if all checkboxes are unchecked
	 */
	allUnchecked: function()
	{
		var count = this.cb_list.size();
		for (var i=0; i<count; i++)
		{
			if (this.cb_list.item(i).get('checked'))
			{
				return false;
			}
		}

		return true;
	},

	/**
	 * @return {boolean} <code>true</code> if all checkboxes are disabled
	 */
	allDisabled: function()
	{
		var count = this.cb_list.size();
		for (var i=0; i<count; i++)
		{
			if (!this.cb_list.item(i).get('disabled'))
			{
				return false;
			}
		}

		return true;
	}
};

Y.CheckboxGroup = CheckboxGroup;
/**********************************************************************
 * At least one checkbox must be selected.  If the last one is turned off,
 * the active, adjacent one is turned on.  The exact algorithm is explained
 * in "Tog on Interface".  The checkboxes are assumed to be ordered in the
 * order they were added.
 * 
 * @module gallery-checkboxgroups
 * @class AtLeastOneCheckboxGroup
 * @constructor
 * @param cb_list {String|Node|NodeList} The list of checkboxes to manage
 */

function AtLeastOneCheckboxGroup(
	/* string/Node/NodeList */	cb_list)
{
	this.direction = AtLeastOneDirection.SLIDE_UP;
	AtLeastOneCheckboxGroup.superclass.constructor.call(this, cb_list);
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
/**********************************************************************
 * At most one checkbox can be selected.  If one is turned on, the active
 * one is turned off.
 * 
 * @module gallery-checkboxgroups
 * @class AtMostOneCheckboxGroup
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
/**********************************************************************
 * All checkboxes can be selected and a select-all checkbox is available
 * to check all. This check-all box is automatically changed if any other
 * checkbox changes state.
 * 
 * @module gallery-checkboxgroups
 * @class SelectAllCheckboxGroup
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
/**********************************************************************
 * Enables the given list of nodes if any checkboxes are checked.
 * 
 * @module gallery-checkboxgroups
 * @class EnableIfAnyCheckboxGroup
 * @constructor
 * @param cb_list {String|Node|NodeList} The list of checkboxes to manage
 * @param nodes {String|NodeList} The nodes to enable/disable
 */

function EnableIfAnyCheckboxGroup(
	/* string/Node/NodeList */	cb_list,
	/* string/NodeList */		nodes)
{
	this.nodes = Y.Lang.isString(nodes) ? Y.all(nodes) : nodes;
	EnableIfAnyCheckboxGroup.superclass.constructor.call(this, cb_list);
	this.enforceConstraints(this.cb_list, 0);
}

Y.extend(EnableIfAnyCheckboxGroup, CheckboxGroup,
{
	enforceConstraints: function(
		/* NodeList */	cb_list,
		/* int */		index)
	{
		var disable = this.allUnchecked();
		this.nodes.each(function(node)
		{
			node.set('disabled', disable);
		});
	}
});

Y.EnableIfAnyCheckboxGroup = EnableIfAnyCheckboxGroup;


}, 'gallery-2011.06.01-20-18' ,{requires:['node-base']});
