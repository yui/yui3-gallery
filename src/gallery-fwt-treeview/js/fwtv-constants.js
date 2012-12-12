/**
 * Creates a Treeview using the FlyweightTreeManager Widget to handle its nodes.
 * It creates the tree based on an object passed as the `tree` attribute in the constructor.
 * @example
 *
	var tv = new Y.FWTreeView({tree: [
		{
			label:'label 0',
			children: [
				{
					label: 'label 0-0',
					children: [
						{label: 'label 0-0-0'},
						{label: 'label 0-0-1'}
					]
				},
				{label: 'label 0-1'}
			]
		},
		{label: 'label 1'}

	]});
	tv.render('#container');

 * @module gallery-fwt-treeview
 */
'use strict';
/*jslint white: true */
var Lang = Y.Lang,
    FWTV,
    FWTN,
    HASH = '#',
	getCName = Y.ClassNameManager.getClassName,
	cName = function (name) {
		return getCName('fw-treeview', name);
	},
	CBX = 'contentBox',
    EXPANDED = 'expanded',
    SEL_ENABLED = 'selectionEnabled',
    SELECTED = 'selected',
    CHANGE = 'Change',
	NOT_SELECTED = 0,
	PARTIALLY_SELECTED = 1,
	FULLY_SELECTED = 2;
