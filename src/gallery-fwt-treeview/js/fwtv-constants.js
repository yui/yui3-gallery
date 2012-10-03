'use strict';
/*jslint white: true */
var Lang = Y.Lang,
	// DOT = '.',
	getCName = Y.ClassNameManager.getClassName,
	cName = function (name) {
		return getCName('fw-treeview', name);
	},
	CNAMES = {
		toggle: cName('toggle'),
		icon: cName('icon'),
		selection: cName('selection'),
		content: cName('content'),
		sel_prefix: cName('selected-state')
	},
	CBX = 'contentBox',
	NOT_SELECTED = 0,
	PARTIALLY_SELECTED = 1,
	FULLY_SELECTED = 2;
