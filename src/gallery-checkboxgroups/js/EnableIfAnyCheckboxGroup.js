/**
 * @module gallery-checkboxgroups
 */

/**********************************************************************
 * Enables the given list of nodes if any checkboxes are checked.
 * 
 * @class EnableIfAnyCheckboxGroup
 * @extends CheckboxGroup
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
	/**
	 * @method enforceConstraints
	 * @param cb_list {String|Object|Array} The list of checkboxes
	 * @param index {Int} The index of the checkbox that changed
	 */
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
