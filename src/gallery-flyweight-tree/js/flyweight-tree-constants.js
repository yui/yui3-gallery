'use strict';
/*jslint white: true */
var Lang = Y.Lang,
	DOT = '.',
	DEFAULT_POOL = '_default',
	getCName = Y.ClassNameManager.getClassName,
	cName = function (name) {
		return getCName('flyweight-tree-node', name);
	},
	CNAME_NODE = cName(''),
	CNAME_CHILDREN = cName('children'),
	CNAME_COLLAPSED = cName('collapsed'),
	CNAME_EXPANDED = cName('expanded'),
	CNAME_NOCHILDREN = cName('no-children'),
	CNAME_FIRSTCHILD = cName('first-child'),
	CNAME_LASTCHILD = cName('last-child'),
	CNAME_LOADING = cName('loading'),
	BYPASS_PROXY = "_bypassProxy",
	VALUE = 'value',
	YArray = Y.Array,
	FWMgr,
	FWNode;

