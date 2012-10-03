if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["/build/gallery-layout/gallery-layout.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-layout/gallery-layout.js",
    code: []
};
_yuitest_coverage["/build/gallery-layout/gallery-layout.js"].code=["YUI.add('gallery-layout', function(Y) {","","\"use strict\";","","/**"," * Provides fluid layout for the content on a page."," *"," * @module gallery-layout"," */","","/**"," * <p>Manages header (layout-hd), body (layout-bd), footer (layout-ft)"," * stacked vertically to either fit inside the viewport (fit-to-viewport)"," * or adjust to the size of the body content (fit-to-content).</p>"," * "," * <p>The body content is sub-divided into modules, arranged either in rows"," * or columns.  The layout is automatically detected based on the marker"," * classes attached to the two layers of divs inside layout-bd:  either"," * layout-module-row > layout-module or layout-module-col > layout-module</p>"," * "," * <p>Each module has an optional header (layout-m-hd), a body"," * (layout-m-bd), and an optional footer (layout-m-ft).  You can have"," * multiple layout-m-bd's, but only one can be visible at a time.  If you"," * change the DOM in any way that affects the height of any module header,"," * body, or footer, or if you switch bodies, you must call"," * <code>elementResized()</code> to reflow the layout.  (Technically, you"," * do not have to call <code>elementResized()</code> if you modify a module"," * body in fit-to-viewport mode, but if you later decide to switch to"," * fit-to-content, your optimization will cause trouble.)</p>"," * "," * <p>If you want a row, column, or module to have a fixed size, add the"," * class layout-not-managed to the layout-module-row, layout-module-column,"," * or layout-module.  Then use CSS to set the width of layout-module (for a"," * row) or layout-module-col (for a col), or the height of layout-m-bd.</p>"," * "," * <p>If the body content is a single module, it expands as the content"," * expands (fit-to-content) until it would push the footer below the fold."," * Then it switches to fit-to-viewport so the scrollbar appears on the"," * module instead of the entire viewport.  (If you do not want this"," * behavior in a particular case, add the class FORCE_FIT to"," * layout-bd.)</p>"," * "," * <p>Note that a non-zero margin-top on the top element or a non-zero"," * margin-bottom on the bottom element inside any container will break the"," * layout because browsers lie about the total height of the container in"," * this case.  Use padding instead of margin on elements inside headers and"," * footers.</p>"," *"," * @class PageLayout"," * @extends Base"," * @constructor"," * @param config {Object}"," */","","function PageLayout()","{","	PageLayout.superclass.constructor.apply(this, arguments);","}","","PageLayout.NAME = \"pagelayout\";","","/**"," * @property FIT_TO_VIEWPORT"," * @static"," */","PageLayout.FIT_TO_VIEWPORT = 0;","","/**"," * @property FIT_TO_CONTENT"," * @static"," */","PageLayout.FIT_TO_CONTENT = 1;","","PageLayout.ATTRS =","{","	/**","	 * FIT_TO_VIEWPORT sizes the rows to fit everything inside the","	 * browser's viewport.  FIT_TO_CONTENT sizes the rows to eliminate all","	 * scrollbars on module bodies.  Note that you can configure this","	 * property by putting the CSS class \"FIT_TO_VIEWPORT\" or","	 * \"FIT_TO_CONTENT\" on layout-bd.","	 *","	 * @attribute mode","	 * @type PageLayout.FIT_TO_VIEWPORT or PageLayout.FIT_TO_CONTENT","	 * @default PageLayout.FIT_TO_VIEWPORT","	 */","	mode:","	{","		value:     PageLayout.FIT_TO_VIEWPORT,","		validator: function(value)","		{","			return (value === PageLayout.FIT_TO_VIEWPORT || value === PageLayout.FIT_TO_CONTENT);","		}","	},","","	/**","	 * Minimum page width, measured in em's.  The page content will not","	 * collapse narrower than this width.  If the viewport is smaller, the","	 * brower's horizontal scrollbar will appear.","	 * ","	 * @attribute minWidth","	 * @type {Number} em's","	 * @default 73 (em) 950px @ 13px font","	 */","	minWidth:","	{","		value:     73,","		validator: function(value)","		{","			return (Y.Lang.isNumber(value) && value > 0);","		}","	},","","	/**","	 * Minimum page height in FIT_TO_VIEWPORT mode, measured in em's.  The","	 * page content will not collapse lower than this height.  If the","	 * viewport is smaller, the brower's vertical scrollbar will appear.","	 * ","	 * @attribute minHeight","	 * @type {Number} em's","	 * @default 44 (em) 570px @ 13px font","	 */","	minHeight:","	{","		value:     44,","		validator: function(value)","		{","			return (Y.Lang.isNumber(value) && value > 0);","		}","	},","","	/**","	 * In FIT_TO_CONTENT mode, set this to true to make the footer stick to","	 * the bottom of the viewport.  The default is for the footer to scroll","	 * along with the rest of the page content.","	 *","	 * @attribute stickyFooter","	 * @type {Boolean}","	 * @default false","	 */","	stickyFooter:","	{","		value:     false,","		validator: Y.Lang.isBoolean","	},","","	/**","	 * When organizing modules into columns in FIT_TO_CONTENT mode, set","	 * this to false to allow each column to be a different height.","	 *","	 * @attribute matchColumnHeights","	 * @type {Boolean}","	 * @default true","	 */","	matchColumnHeights:","	{","		value:     true,","		validator: Y.Lang.isBoolean","	},","","	/**","	 * Selector identifying the element which contains layout-(hd|bd|ft).","	 * This cannot be used to attach PageLayout to only part of the page.","	 * It should only be used when the page content is unavoidably embedded","	 * inside an element which fills the page.","	 * ","	 * @attribute body","	 * @type {String|Node}","	 * @default \"body\"","	 */","	body:","	{","		value:     'body',","		validator: function(value)","		{","			return (Y.Lang.isString(value) || value._node);","		}","	}","};","","/**"," * @event beforeReflow"," * @description Fires before the layout is reflowed."," */","/**"," * @event afterReflow"," * @description Fires after the layout is completely reflowed, including viewport scrollbar changes."," */","","/**"," * @event beforeExpandModule"," * @description Fires before a module is expanded."," * @param bd {Node} the module body (layout-m-bd)"," */","/**"," * @event afterExpandModule"," * @description Fires after a module is expanded."," * @param bd {Node} the module body (layout-m-bd)"," */","","/**"," * @event beforeCollapseModule"," * @description Fires before a module is collapsed."," * @param bd {Node} the module body (layout-m-bd)"," */","/**"," * @event afterCollapseModule"," * @description Fires after a module is collapsed."," * @param bd {Node} the module body (layout-m-bd)"," */","","/**"," * @event beforeResizeModule"," * @description Fires before a module is resized."," * @param bd {Node} the module body (layout-m-bd)"," * @param height {Number} new height in pixels or \"auto\""," * @param width {Number} new width in pixels or \"auto\""," */","/**"," * @event afterResizeModule"," * @description Fires after a module is resized."," * @param bd {Node} the module body (layout-m-bd)"," * @param height {Number} new height in pixels"," * @param width {Number} new width in pixels"," */","","/**"," * @property fit_to_viewport_class"," * @type {String}"," * @default \"FIT_TO_VIEWPORT\""," * @static"," */","PageLayout.fit_to_viewport_class = 'FIT_TO_VIEWPORT';","","/**"," * @property fit_to_content_class"," * @type {String}"," * @default \"FIT_TO_CONTENT\""," * @static"," */","PageLayout.fit_to_content_class = 'FIT_TO_CONTENT';","","/**"," * @property force_fit_class"," * @type {String}"," * @default \"FORCE_FIT\""," * @static"," */","PageLayout.force_fit_class = 'FORCE_FIT';","","/**"," * @property page_header_class"," * @type {String}"," * @default \"layout-hd\""," * @static"," */","PageLayout.page_header_class = 'layout-hd';","","/**"," * @property page_body_class"," * @type {String}"," * @default \"layout-bd\""," * @static"," */","PageLayout.page_body_class = 'layout-bd';","","/**"," * @property page_footer_class"," * @type {String}"," * @default \"layout-ft\""," * @static"," */","PageLayout.page_footer_class = 'layout-ft';","","/**"," * @property module_rows_class"," * @type {String}"," * @value \"layout-module-row\""," * @static"," */","PageLayout.module_rows_class = 'layout-module-row';","","/**"," * @property module_cols_class"," * @type {String}"," * @value \"layout-module-col\""," * @static"," */","PageLayout.module_cols_class = 'layout-module-col';","","/**"," * @property module_class"," * @type {String}"," * @default \"layout-module\""," * @static"," */","PageLayout.module_class = 'layout-module';","","/**"," * @property module_header_class"," * @type {String}"," * @default \"layout-m-hd\""," * @static"," */","PageLayout.module_header_class = 'layout-m-hd';","","/**"," * @property module_body_class"," * @type {String}"," * @default \"layout-m-bd\""," * @static"," */","PageLayout.module_body_class = 'layout-m-bd';","","/**"," * @property module_footer_class"," * @type {String}"," * @default \"layout-m-ft\""," * @static"," */","PageLayout.module_footer_class = 'layout-m-ft';","","/**"," * @property not_managed_class"," * @type {String}"," * @default \"layout-not-managed\""," * @static"," */","PageLayout.not_managed_class = 'layout-not-managed';","","/**"," * @property collapse_vert_nub_class"," * @type {String}"," * @default \"layout-vert-collapse-nub\""," * @static"," */","PageLayout.collapse_vert_nub_class = 'layout-vert-collapse-nub';","","/**"," * @property collapse_left_nub_class"," * @type {String}"," * @default \"layout-left-collapse-nub\""," * @static"," */","PageLayout.collapse_left_nub_class = 'layout-left-collapse-nub';","","/**"," * @property collapse_right_nub_class"," * @type {String}"," * @default \"layout-right-collapse-nub\""," * @static"," */","PageLayout.collapse_right_nub_class = 'layout-right-collapse-nub';","","/**"," * @property expand_vert_nub_class"," * @type {String}"," * @default \"layout-vert-expand-nub\""," * @static"," */","PageLayout.expand_vert_nub_class = 'layout-vert-expand-nub';","","/**"," * @property expand_left_nub_class"," * @type {String}"," * @default \"layout-left-expand-nub\""," * @static"," */","PageLayout.expand_left_nub_class = 'layout-left-expand-nub';","","/**"," * @property expand_right_nub_class"," * @type {String}"," * @default \"layout-right-expand-nub\""," * @static"," */","PageLayout.expand_right_nub_class = 'layout-right-expand-nub';","","/**"," * @property collapsed_vert_class"," * @type {String}"," * @default \"layout-collapsed-vert\""," * @static"," */","PageLayout.collapsed_vert_class = 'layout-collapsed-vert';","","/**"," * @property collapsed_horiz_class"," * @type {String}"," * @default \"layout-collapsed-horiz\""," * @static"," */","PageLayout.collapsed_horiz_class = 'layout-collapsed-horiz';","","/**"," * @property min_module_height"," * @type {Number}"," * @default 10 (px)"," * @static"," */","PageLayout.min_module_height = 10; // px","","PageLayout.unmanaged_size = -1; // smaller than any module size (collapsed size = - normal size)","","var mode_regex          = /\\bFIT_TO_[A-Z_]+/,","	row_height_class_re = /(?:^|\\s)height:([0-9]+)%/,","	col_width_class_re  = /(?:^|\\s)width:([0-9]+)%/,","","	reflow_delay = 100, // ms","","	plugin_info =","	{","		row:","		{","			module:     'gallery-layout-rows',","			plugin:     'PageLayoutRows',","			outer_size: row_height_class_re,","			inner_size: col_width_class_re","		},","		col:","		{","			module:     'gallery-layout-cols',","			plugin:     'PageLayoutCols',","			outer_size: col_width_class_re,","			inner_size: row_height_class_re","		}","	};","/*","	dd_group_name:            'satg-layout-dd-group',","	drag_target_class:        'satg-layout-dd-target',","	drag_nub_class:           'satg-layout-dragnub',","	module_header_drag_class: 'satg-layout-draggable',","	module_no_drag_class:     'satg-layout-drag-disabled',","	bomb_sight_class:         'satg-layout-bomb-sight satg-layout-bomb-sight-rows',","","	the_dd_targets = {};","	the_dd_nubs    = {};","*/","","function init()","{","	this.viewport =","	{","		w:   0,","		h:   0,","		bcw: 0","	};","","	// find header, body, footer","","	var page_blocks = Y.one(this.get('body')).get('children');","","	var list = page_blocks.filter('.'+PageLayout.page_header_class);","	if (list.size() > 1)","	{","		throw Error('There must be at most one div with class ' + PageLayout.page_header_class);","	}","	this.header_container = (list.isEmpty() ? null : list.item(0));","","	list = page_blocks.filter('.'+PageLayout.page_body_class);","	if (list.size() != 1)","	{","		throw Error('There must be exactly one div with class ' + PageLayout.page_body_class);","	}","	this.body_container = list.item(0);","","	this.body_horiz_mbp = this.body_container.horizMarginBorderPadding();","	this.body_vert_mbp  = this.body_container.vertMarginBorderPadding();","","	var m = this.body_container.get('className').match(mode_regex);","	if (m && m.length)","	{","		this.set('mode', PageLayout[ m[0] ]);","	}","","	list = page_blocks.filter('.'+PageLayout.page_footer_class);","	if (list.size() > 1)","	{","		throw Error('There must be at most one div with class ' + PageLayout.page_footer_class);","	}","	this.footer_container = (list.isEmpty() ? null : list.item(0));","","	Y.one(Y.config.win).on('resize', resize, this);","","	updateFitClass.call(this);","	reparentFooter.call(this);","	this.rescanBody();","","	// stay in sync","","	this.after('modeChange', function()","	{","		updateFitClass.call(this);","","		if (this.body_container)","		{","			this.body_container.scrollTop = 0;","		}","","		reparentFooter.call(this);","		resize.call(this);","	});","","	this.after('minWidthChange', resize);","	this.after('minHeightChange', resize);","","	this.after('stickyFooterChange', function()","	{","		reparentFooter.call(this);","		resize.call(this);","	});","","	this.after('matchColumnHeightsChange', resize);","}","","/*"," * Normalize the list of sizes so they add up to 100%."," */","function normalizeSizes(","	/* array */	list,","	/* regex */	pattern)","{","	// collect sizes","","	var sizes = Y.map(list, function(module)","	{","		if (module.hasClass(PageLayout.not_managed_class))","		{","			return PageLayout.unmanaged_size;","		}","","		var m = module.get('className').match(pattern);","		return (m && m.length ? parseInt(m[1], 10) : 0);","	});","","	// analyze","","	var info = Y.reduce(sizes, [0,0], function(value, size)","	{","		if (size > 0)","		{","			value[0] += size;","		}","		else if (size === 0)","		{","			value[1]++;","		}","		return value;","	});","","	var sum = info[0], blank_count = info[1];","","	// fill in blanks","","	if (blank_count > 0)","	{","		var blank_size = Math.max((100 - sum) / blank_count, 10);","","		sizes = Y.map(sizes, function(size)","		{","			return (size === 0 ? blank_size : size);","		});","","		sum = Y.reduce(sizes, 0, function(sum, size, i)","		{","			return (size < 0 ? sum : sum + size);","		});","	}","","	// normalize","","	return Y.map(sizes, function(size)","	{","		return (size > 0 ? size * (100.0 / sum) : size);","	});","}","","function updateFitClass()","{","	this.body_container.replaceClass('FIT_TO_(VIEWPORT|CONTENT)',","		this.get('mode') === PageLayout.FIT_TO_VIEWPORT ? 'FIT_TO_VIEWPORT' : 'FIT_TO_CONTENT');","}","","function reparentFooter()","{","	if (!this.footer_container)","	{","		return;","	}","","	if (this.get('mode') === PageLayout.FIT_TO_VIEWPORT || this.get('stickyFooter'))","	{","		this.body_container.get('parentNode').insertBefore(this.footer_container, this.body_container.next(function(node)","		{","			return node.get('tagName').toLowerCase() != 'script';","		}));","	}","	else","	{","		this.body_container.appendChild(this.footer_container);","	}","}","","function resize()","{","	if (!this.layout_plugin || !this.body_container)","	{","		return;","	}","","	// check if viewport changed","","	var mode          = this.single_module ? Y.PageLayout.FIT_TO_VIEWPORT : this.get('mode');","	var sticky_footer = this.get('stickyFooter');","","	this.body_container.setStyle('overflowX',","		mode === Y.PageLayout.FIT_TO_CONTENT ? 'auto' : 'hidden');","	this.body_container.setStyle('overflowY',","		mode === Y.PageLayout.FIT_TO_CONTENT ? 'scroll' : 'hidden');","","	var viewport =","	{","		w: Y.DOM.winWidth(),","		h: Y.DOM.winHeight()","	};","","	var resize_event = arguments[0] && arguments[0].type == 'resize';	// IE7 generates no-op's","	if (resize_event &&","		(viewport.w === this.viewport.w &&","		 viewport.h === this.viewport.h))","	{","		return;","	}","","	this.viewport = viewport;","","	this.fire('beforeReflow');	// after confirming that viewport really has changed","","	// set width of hd,bd,ft and height of bd","","	var min_width  = Y.Node.emToPx(this.get('minWidth'));","	var body_width = Math.max(this.viewport.w, min_width);","	if (this.header_container)","	{","		this.header_container.setStyle('width', body_width+'px');","	}","	this.body_container.setStyle('width', (body_width - this.body_horiz_mbp)+'px');","	if (this.footer_container)","	{","		this.footer_container.setStyle('width', sticky_footer ? body_width+'px' : 'auto');","	}","	body_width = this.body_container.get('clientWidth') - this.body_horiz_mbp;","","	this.viewport.bcw = this.body_container.get('clientWidth');","","	var h     = this.viewport.h;","	var h_min = Y.Node.emToPx(this.get('minHeight'));","	if (mode === Y.PageLayout.FIT_TO_VIEWPORT && h < h_min)","	{","		h = h_min;","		Y.one(document.documentElement).setStyle('overflowY', 'auto');","	}","	else if (!window.console || !window.console.layout_force_viewport_scrollbars)	// remove inactive vertical scrollbar in IE","	{","		Y.one(document.documentElement).setStyle('overflowY', 'hidden');","	}","","	if (this.header_container)","	{","		h -= this.header_container.get('offsetHeight');","	}","	if (this.footer_container &&","		(mode === Y.PageLayout.FIT_TO_VIEWPORT || sticky_footer))","	{","		h -= this.footer_container.get('offsetHeight');","	}","","	if (mode === Y.PageLayout.FIT_TO_VIEWPORT)","	{","		var body_height = h - this.body_vert_mbp;","	}","	else if (h < 0)						// FIT_TO_CONTENT doesn't enforce min height","	{","		h = 10 + this.body_vert_mbp;	// arbitrary, positive number","	}","","	this.body_container.setStyle('height', (h - this.body_vert_mbp)+'px');","","	// resize modules","","	this.layout_plugin.resize(this, mode, body_width, body_height);","","	// show body and footer","","	this.body_container.setStyle('visibility', 'visible');","	if (this.footer_container)","	{","		this.footer_container.setStyle('visibility', 'visible');","	}","","	Y.later(100, this, checkViewportSize);","}","","/*"," * Check if the viewport size has changed, usually due to the browser"," * removing no-longer-needed scrollbars.  If the viewport size is"," * stable, fires the afterReflow event."," */","function checkViewportSize()","{","	if (Y.DOM.winWidth()                       != this.viewport.w ||","		Y.DOM.winHeight()                      != this.viewport.h ||","		this.body_container.get('clientWidth') != this.viewport.bcw)","	{","		resize.call(this);","	}","	else","	{","		this.fire('afterReflow');","	}","}","","/*"," * Expand the module containing the event target."," */","function expandModule(","	/* event */	e)","{","	var node = e.currentTarget;","","	function expand(","		/* string */	parent_class_name,","		/* string */	collapsed_class)","	{","		var p = node.getAncestorByClassName(this.layout_plugin.collapse_classes[parent_class_name]);","		if (p && p.hasClass(collapsed_class))","		{","			var children = this._analyzeModule(p);","			this.fire('beforeExpandModule', { bd: children.bd });","","			p.removeClass(collapsed_class);","			resize.call(this);","","			this.fire('afterExpandModule', { bd: children.bd });","		}","	}","","	if (node.hasClass(PageLayout.expand_vert_nub_class))","	{","		expand.call(this, 'vert_parent_class', PageLayout.collapsed_vert_class);","	}","	else","	{","		expand.call(this, 'horiz_parent_class', PageLayout.collapsed_horiz_class);","	}","}","","/*"," * Collapse the module containing the event target."," */","function collapseModule(","	/* event */	e)","{","	var node = e.currentTarget;","","	function collapse(","		/* string */	parent_class_name,","		/* string */	collapsed_class)","	{","		var p = node.getAncestorByClassName(this.layout_plugin.collapse_classes[parent_class_name]);","		if (p && !p.hasClass(collapsed_class))","		{","			var children = this._analyzeModule(p);","			this.fire('beforeCollapseModule', { bd: children.bd });","","			p.addClass(collapsed_class);","			resize.call(this);","","			this.fire('afterCollapseModule', { bd: children.bd });","		}","	}","","	if (node.hasClass(PageLayout.collapse_vert_nub_class))","	{","		collapse.call(this, 'vert_parent_class', PageLayout.collapsed_vert_class);","	}","	else","	{","		collapse.call(this, 'horiz_parent_class', PageLayout.collapsed_horiz_class);","	}","}","","Y.extend(PageLayout, Y.Base,","{","	initializer: function()","	{","		Y.on('domready', init, this);","	},","","	/**","	 * Call this after manually adding or removing modules on the page.","	 * ","	 * @method rescanBody","	 */","	rescanBody: function()","	{","		Y.detach('PageLayoutCollapse|click');","","		this.body_info =","		{","			outers:      [],","			modules:     [],	// list of modules inside each row","			outer_sizes: [],	// list of percentages","			inner_sizes: []		// list of lists of percentages","		};","","		var outer_list  = this.body_container.all('div.' + PageLayout.module_rows_class);","		var plugin_data = plugin_info.row;","		if (outer_list.isEmpty())","		{","			outer_list  = this.body_container.all('div.' + PageLayout.module_cols_class);","			plugin_data = plugin_info.col;","		}","		if (outer_list.isEmpty())","		{","			throw Error('There must be at least one ' + PageLayout.module_rows_class + ' or ' + PageLayout.module_cols_class + ' inside ' + PageLayout.page_body_class + '.');","		}","		this.body_info.outers = outer_list;","","		var collapse_nub_pattern =","			'(' +","			PageLayout.collapse_vert_nub_class + '|' +","			PageLayout.collapse_left_nub_class + '|' +","			PageLayout.collapse_right_nub_class +","			')';","","		var expand_nub_pattern =","			'(' +","			PageLayout.expand_vert_nub_class + '|' +","			PageLayout.expand_left_nub_class + '|' +","			PageLayout.expand_right_nub_class +","			')';","","		var row_count = this.body_info.outers.size();","		Y.each(this.body_info.outers, function(row)","		{","			var row_id = row.generateID();","			this.body_info.outer_sizes.push(100.0/row_count);","","			var list = row.all('div.' + PageLayout.module_class);","			if (list.isEmpty())","			{","				this.body_info.outers  = [];","				this.body_info.modules = [];","				throw Error('There must be at least one ' + PageLayout.module_class + ' inside ' + PageLayout.module_rows_class + '.');","			}","","			this.body_info.modules.push(list);","","			Y.each(list, function(module)","			{","				var nub = module.getFirstElementByClassName(collapse_nub_pattern);","				if (nub)","				{","					nub.on('PageLayoutCollapse|click', collapseModule, this);","				}","","				nub = module.getFirstElementByClassName(expand_nub_pattern);","				if (nub)","				{","					nub.on('PageLayoutCollapse|click', expandModule, this);","				}","			},","			this);","/*","			if (PageLayoutDDProxy)","			{","				var has_nubs = false;","				Y.each(list, function(module)","				{","					var id = module.generateID();","					module.removeClass(PageLayout.module_no_drag_class);","","					if (the_dd_nubs[id])","					{","						has_nubs = (the_dd_nubs[id] != 'none');","					}","					else","					{","						var nub = module.getFirstElementByClassName(PageLayout.drag_nub_class);","						if (nub)","						{","							var children = this._analyzeModule(module);","							if (children.hd)","							{","								children.hd.addClass(PageLayout.module_header_drag_class);","								the_dd_nubs[id] =","									new PageLayoutDDProxy(this, id, children.hd, PageLayout.dd_group_name);","								has_nubs = true;","							}","						}","","						if (!the_dd_nubs[id])","						{","							the_dd_nubs[id] = 'none';","						}","					}","				},","				this);","","				if (!the_dd_targets[ row_id ] &&","					(has_nubs || row.hasClass(PageLayout.drag_target_class)))","				{","					the_dd_targets[ row_id ] = new DDTarget(row_id, PageLayout.dd_group_name);","				}","","				if (list.size() == 1)","				{","					list.item(0).addClass(PageLayout.module_no_drag_class);","				}","			}","*/","			this.body_info.inner_sizes.push(","				normalizeSizes(list, plugin_data.inner_size));","		},","		this);","","		this.body_info.outer_sizes =","			normalizeSizes(this.body_info.outers, plugin_data.outer_size);","","		this.single_module = false;","		if (this.body_info.outers.size() == 1 && this.body_info.modules[0].size() == 1 &&","			!this.body_container.hasClass(PageLayout.force_fit_class))","		{","			plugin_data        = plugin_info.row;","			this.single_module = true;","		}","","		var self = this;","		Y.use(plugin_data.module, function(Y)","		{","			self.layout_plugin = Y[ plugin_data.plugin ];","			updateFitClass.call(self);	// plugin may modify it","			resize.call(self);","		});","	},","","	/**","	 * @method getHeaderHeight","	 * @return {Number} the height of the sticky header in pixels","	 */","	getHeaderHeight: function()","	{","		return (this.header_container ? this.header_container.get('offsetHeight') : 0);","	},","","	/**","	 * @method getHeaderContainer","	 * @return {Node} the header container (layout-hd) or null if there is no header","	 */","	getHeaderContainer: function()","	{","		return this.header_container;","	},","","	/**","	 * @method getBodyHeight","	 * @return {Number} the height of the scrolling body in pixels","	 */","	getBodyHeight: function()","	{","		return this.body_container.get('offsetHeight');","	},","","	/**","	 * @method getBodyContainer","	 * @return {Node} the body container (layout-bd)","	 */","	getBodyContainer: function()","	{","		return this.body_container;","	},","","	/**","	 * @method getFooterHeight","	 * @return {Number} the height of the sticky footer in pixels or zero if the footer is not sticky","	 */","	getFooterHeight: function()","	{","		return (this.get('stickyFooter') && this.footer_container ?","				this.footer_container.get('offsetHeight') : 0);","	},","","	/**","	 * @method getFooterContainer","	 * @return {Node} the footer container (layout-ft), or null if there is no footer","	 */","	getFooterContainer: function()","	{","		return this.footer_container;","	},","","	/**","	 * @method moduleIsCollapsed","	 * @param node {String|Node} .layout-module","	 * @return {Boolean} true if module is collapsed","	 */","	moduleIsCollapsed: function(","		/* string/Node */	node)","	{","		var collapsed_pattern =","			'(' +","			PageLayout.collapsed_horiz_class + '|' +","			PageLayout.collapses_vert_class +","			')';","","		node = Y.one(node);","		if (node.getFirstElementByClassName(this.layout_plugin.collapse_classes.collapse_parent_pattern))","		{","			node = node.get('parentNode');","		}","","		return node.hasClass(collapsed_pattern);","	},","","	/**","	 * Expand the specified module.","	 * ","	 * @method expandModule","	 * @param node {String|Node} .layout-module","	 */","	expandModule: function(","		/* string/Node */	node)","	{","		node    = Y.one(node);","		var nub = node.getFirstElementByClassName(PageLayout.expand_vert_nub_class);","		if (!nub)","		{","			var expand_horiz_nub_pattern =","				'(' +","				PageLayout.expand_left_nub_class + '|' +","				PageLayout.expand_right_nub_class +","				')';","","			nub = node.getFirstElementByClassName(expand_horiz_nub_pattern);","		}","","		if (nub)","		{","			expandModule.call(this, { currentTarget: nub });","		}","	},","","	/**","	 * Collapse the specified module.","	 * ","	 * @method collapseModule","	 * @param node {String|Node} .layout-module","	 */","	collapseModule: function(","		/* string/Node */	node)","	{","		node    = Y.one(node);","		var nub = node.getFirstElementByClassName(PageLayout.collapse_vert_nub_class);","		if (!nub)","		{","			var collapse_horiz_nub_pattern =","				'(' +","				PageLayout.collapse_left_nub_class + '|' +","				PageLayout.collapse_right_nub_class +","				')';","","			nub = node.getFirstElementByClassName(collapse_horiz_nub_pattern);","		}","","		if (nub)","		{","			collapseModule.call(this, { currentTarget: nub });","		}","	},","","	/**","	 * Toggle the collapsed state of the specified layout-module.","	 * ","	 * @method toggleModule","	 * @param module {String|Node} .layout-module","	 */","	toggleModule: function(","		/* string/Node */	module)","	{","		module = Y.one(module);	// optimization","		if (this.moduleIsCollapsed(module))","		{","			this.expandModule(module);","		}","		else","		{","			this.collapseModule(module);","		}","	},","","	/**","	 * Call this when something changes size, to request a reflow of the","	 * layout.","	 * ","	 * @method elementResized","	 * @param el {String|Node} element that changed size","	 * @return {Boolean} true if the element is inside the managed containers","	 */","	elementResized: function(","		/* string/Node */	el)","	{","		el = Y.one(el);","","		if ((this.header_container && this.header_container.contains(el)) ||","			(this.body_container && this.body_container.contains(el)) ||","			(this.footer_container && this.footer_container.contains(el)))","		{","			if (this.refresh_timer)","			{","				this.refresh_timer.cancel();","			}","","			var t1 = (new Date()).getTime();","			this.refresh_timer = Y.later(reflow_delay, this, function()","			{","				this.refresh_timer = null;","","				// if JS is really busy, wait a bit longer","","				var t2 = (new Date()).getTime();","				if (t2 > t1 + 2*reflow_delay)","				{","					this.elementResized(el);","				}","				else","				{","					resize.call(this);","				}","			});","","			return true;","		}","		else","		{","			return false;","		}","	},","","	/**","	 * Returns the components of the module.","	 * ","	 * @method _analyzeModule","	 * @private","	 * @param root {Node} .layout-module","	 * @return {Object} root,hd,bd,ft","	 */","	_analyzeModule: function(","		/* node */	root)","	{","		var result =","		{","			root: root,","			hd:   null,","			bd:   null,","			ft:   null","		};","","		// two step process avoid scanning into the module body","","		var bd = root.one('.'+PageLayout.module_body_class);","		if (!bd)","		{","			return result;","		}","","		var list = bd.siblings().filter('.'+PageLayout.module_body_class);","		list.unshift(bd);","		result.bd = list.find(function(n)","		{","			return (n.get('offsetWidth') > 0);","		});","		if (!result.bd)","		{	","			result.bd = bd;","		}","","		if (result.bd)","		{","			result.hd = result.bd.siblings().filter('.'+PageLayout.module_header_class).item(0);","			result.ft = result.bd.siblings().filter('.'+PageLayout.module_footer_class).item(0);","		}","","		return result;","	},","","	/**","	 * Set the width of a module.","	 * ","	 * @method _setWidth","	 * @private","	 * @param children {Object} root,hd,bd,ft","	 * @param w {Number} width in pixels","	 */","	_setWidth: function(","		/* object */	children,","		/* int */		w)","	{","		children.root.setStyle('width', w+'px');","	}","});","","Y.PageLayout = PageLayout;","","","}, 'gallery-2012.10.03-20-02' ,{optional:['gallery-layout-rows','gallery-layout-cols'], requires:['base','gallery-funcprog','gallery-node-optimizations','gallery-dimensions','gallery-nodelist-extras2'], skinnable:true});"];
_yuitest_coverage["/build/gallery-layout/gallery-layout.js"].lines = {"1":0,"3":0,"55":0,"57":0,"60":0,"66":0,"72":0,"74":0,"92":0,"110":0,"128":0,"176":0,"233":0,"241":0,"249":0,"257":0,"265":0,"273":0,"281":0,"289":0,"297":0,"305":0,"313":0,"321":0,"329":0,"337":0,"345":0,"353":0,"361":0,"369":0,"377":0,"385":0,"393":0,"401":0,"403":0,"405":0,"440":0,"442":0,"451":0,"453":0,"454":0,"456":0,"458":0,"460":0,"461":0,"463":0,"465":0,"467":0,"468":0,"470":0,"471":0,"473":0,"476":0,"477":0,"479":0,"481":0,"483":0,"485":0,"486":0,"487":0,"491":0,"493":0,"495":0,"497":0,"500":0,"501":0,"504":0,"505":0,"507":0,"509":0,"510":0,"513":0,"519":0,"525":0,"527":0,"529":0,"532":0,"533":0,"538":0,"540":0,"542":0,"544":0,"546":0,"548":0,"551":0,"555":0,"557":0,"559":0,"561":0,"564":0,"566":0,"572":0,"574":0,"578":0,"580":0,"584":0,"586":0,"588":0,"591":0,"593":0,"595":0,"600":0,"604":0,"606":0,"608":0,"613":0,"614":0,"616":0,"618":0,"621":0,"627":0,"628":0,"632":0,"635":0,"637":0,"641":0,"642":0,"643":0,"645":0,"647":0,"648":0,"650":0,"652":0,"654":0,"656":0,"657":0,"658":0,"660":0,"661":0,"663":0,"665":0,"668":0,"670":0,"672":0,"675":0,"678":0,"680":0,"682":0,"684":0,"687":0,"691":0,"695":0,"696":0,"698":0,"701":0,"709":0,"711":0,"715":0,"719":0,"726":0,"729":0,"731":0,"735":0,"736":0,"738":0,"739":0,"741":0,"742":0,"744":0,"748":0,"750":0,"754":0,"761":0,"764":0,"766":0,"770":0,"771":0,"773":0,"774":0,"776":0,"777":0,"779":0,"783":0,"785":0,"789":0,"793":0,"797":0,"807":0,"809":0,"817":0,"818":0,"819":0,"821":0,"822":0,"824":0,"826":0,"828":0,"830":0,"837":0,"844":0,"845":0,"847":0,"848":0,"850":0,"851":0,"853":0,"854":0,"855":0,"858":0,"860":0,"862":0,"863":0,"865":0,"868":0,"869":0,"871":0,"923":0,"928":0,"931":0,"932":0,"935":0,"936":0,"939":0,"940":0,"942":0,"943":0,"944":0,"954":0,"963":0,"972":0,"981":0,"990":0,"1000":0,"1011":0,"1017":0,"1018":0,"1020":0,"1023":0,"1035":0,"1036":0,"1037":0,"1039":0,"1045":0,"1048":0,"1050":0,"1063":0,"1064":0,"1065":0,"1067":0,"1073":0,"1076":0,"1078":0,"1091":0,"1092":0,"1094":0,"1098":0,"1113":0,"1115":0,"1119":0,"1121":0,"1124":0,"1125":0,"1127":0,"1131":0,"1132":0,"1134":0,"1138":0,"1142":0,"1146":0,"1161":0,"1171":0,"1172":0,"1174":0,"1177":0,"1178":0,"1179":0,"1181":0,"1183":0,"1185":0,"1188":0,"1190":0,"1191":0,"1194":0,"1209":0,"1213":0};
_yuitest_coverage["/build/gallery-layout/gallery-layout.js"].functions = {"PageLayout:55":0,"validator:90":0,"validator:108":0,"validator:126":0,"validator:174":0,"(anonymous 2):491":0,"(anonymous 3):507":0,"init:440":0,"(anonymous 4):525":0,"(anonymous 5):538":0,"(anonymous 6):559":0,"(anonymous 7):564":0,"(anonymous 8):572":0,"normalizeSizes:519":0,"updateFitClass:578":0,"(anonymous 9):593":0,"reparentFooter:584":0,"resize:604":0,"checkViewportSize:709":0,"expand:731":0,"expandModule:726":0,"collapse:766":0,"collapseModule:761":0,"initializer:795":0,"(anonymous 11):860":0,"(anonymous 10):845":0,"(anonymous 12):940":0,"rescanBody:805":0,"getHeaderHeight:952":0,"getHeaderContainer:961":0,"getBodyHeight:970":0,"getBodyContainer:979":0,"getFooterHeight:988":0,"getFooterContainer:998":0,"moduleIsCollapsed:1008":0,"expandModule:1032":0,"collapseModule:1060":0,"toggleModule:1088":0,"(anonymous 13):1125":0,"elementResized:1110":0,"(anonymous 14):1179":0,"_analyzeModule:1158":0,"_setWidth:1205":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-layout/gallery-layout.js"].coveredLines = 275;
_yuitest_coverage["/build/gallery-layout/gallery-layout.js"].coveredFunctions = 44;
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1);
YUI.add('gallery-layout', function(Y) {

_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 3);
"use strict";

/**
 * Provides fluid layout for the content on a page.
 *
 * @module gallery-layout
 */

/**
 * <p>Manages header (layout-hd), body (layout-bd), footer (layout-ft)
 * stacked vertically to either fit inside the viewport (fit-to-viewport)
 * or adjust to the size of the body content (fit-to-content).</p>
 * 
 * <p>The body content is sub-divided into modules, arranged either in rows
 * or columns.  The layout is automatically detected based on the marker
 * classes attached to the two layers of divs inside layout-bd:  either
 * layout-module-row > layout-module or layout-module-col > layout-module</p>
 * 
 * <p>Each module has an optional header (layout-m-hd), a body
 * (layout-m-bd), and an optional footer (layout-m-ft).  You can have
 * multiple layout-m-bd's, but only one can be visible at a time.  If you
 * change the DOM in any way that affects the height of any module header,
 * body, or footer, or if you switch bodies, you must call
 * <code>elementResized()</code> to reflow the layout.  (Technically, you
 * do not have to call <code>elementResized()</code> if you modify a module
 * body in fit-to-viewport mode, but if you later decide to switch to
 * fit-to-content, your optimization will cause trouble.)</p>
 * 
 * <p>If you want a row, column, or module to have a fixed size, add the
 * class layout-not-managed to the layout-module-row, layout-module-column,
 * or layout-module.  Then use CSS to set the width of layout-module (for a
 * row) or layout-module-col (for a col), or the height of layout-m-bd.</p>
 * 
 * <p>If the body content is a single module, it expands as the content
 * expands (fit-to-content) until it would push the footer below the fold.
 * Then it switches to fit-to-viewport so the scrollbar appears on the
 * module instead of the entire viewport.  (If you do not want this
 * behavior in a particular case, add the class FORCE_FIT to
 * layout-bd.)</p>
 * 
 * <p>Note that a non-zero margin-top on the top element or a non-zero
 * margin-bottom on the bottom element inside any container will break the
 * layout because browsers lie about the total height of the container in
 * this case.  Use padding instead of margin on elements inside headers and
 * footers.</p>
 *
 * @class PageLayout
 * @extends Base
 * @constructor
 * @param config {Object}
 */

_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 55);
function PageLayout()
{
	_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "PageLayout", 55);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 57);
PageLayout.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 60);
PageLayout.NAME = "pagelayout";

/**
 * @property FIT_TO_VIEWPORT
 * @static
 */
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 66);
PageLayout.FIT_TO_VIEWPORT = 0;

/**
 * @property FIT_TO_CONTENT
 * @static
 */
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 72);
PageLayout.FIT_TO_CONTENT = 1;

_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 74);
PageLayout.ATTRS =
{
	/**
	 * FIT_TO_VIEWPORT sizes the rows to fit everything inside the
	 * browser's viewport.  FIT_TO_CONTENT sizes the rows to eliminate all
	 * scrollbars on module bodies.  Note that you can configure this
	 * property by putting the CSS class "FIT_TO_VIEWPORT" or
	 * "FIT_TO_CONTENT" on layout-bd.
	 *
	 * @attribute mode
	 * @type PageLayout.FIT_TO_VIEWPORT or PageLayout.FIT_TO_CONTENT
	 * @default PageLayout.FIT_TO_VIEWPORT
	 */
	mode:
	{
		value:     PageLayout.FIT_TO_VIEWPORT,
		validator: function(value)
		{
			_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "validator", 90);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 92);
return (value === PageLayout.FIT_TO_VIEWPORT || value === PageLayout.FIT_TO_CONTENT);
		}
	},

	/**
	 * Minimum page width, measured in em's.  The page content will not
	 * collapse narrower than this width.  If the viewport is smaller, the
	 * brower's horizontal scrollbar will appear.
	 * 
	 * @attribute minWidth
	 * @type {Number} em's
	 * @default 73 (em) 950px @ 13px font
	 */
	minWidth:
	{
		value:     73,
		validator: function(value)
		{
			_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "validator", 108);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 110);
return (Y.Lang.isNumber(value) && value > 0);
		}
	},

	/**
	 * Minimum page height in FIT_TO_VIEWPORT mode, measured in em's.  The
	 * page content will not collapse lower than this height.  If the
	 * viewport is smaller, the brower's vertical scrollbar will appear.
	 * 
	 * @attribute minHeight
	 * @type {Number} em's
	 * @default 44 (em) 570px @ 13px font
	 */
	minHeight:
	{
		value:     44,
		validator: function(value)
		{
			_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "validator", 126);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 128);
return (Y.Lang.isNumber(value) && value > 0);
		}
	},

	/**
	 * In FIT_TO_CONTENT mode, set this to true to make the footer stick to
	 * the bottom of the viewport.  The default is for the footer to scroll
	 * along with the rest of the page content.
	 *
	 * @attribute stickyFooter
	 * @type {Boolean}
	 * @default false
	 */
	stickyFooter:
	{
		value:     false,
		validator: Y.Lang.isBoolean
	},

	/**
	 * When organizing modules into columns in FIT_TO_CONTENT mode, set
	 * this to false to allow each column to be a different height.
	 *
	 * @attribute matchColumnHeights
	 * @type {Boolean}
	 * @default true
	 */
	matchColumnHeights:
	{
		value:     true,
		validator: Y.Lang.isBoolean
	},

	/**
	 * Selector identifying the element which contains layout-(hd|bd|ft).
	 * This cannot be used to attach PageLayout to only part of the page.
	 * It should only be used when the page content is unavoidably embedded
	 * inside an element which fills the page.
	 * 
	 * @attribute body
	 * @type {String|Node}
	 * @default "body"
	 */
	body:
	{
		value:     'body',
		validator: function(value)
		{
			_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "validator", 174);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 176);
return (Y.Lang.isString(value) || value._node);
		}
	}
};

/**
 * @event beforeReflow
 * @description Fires before the layout is reflowed.
 */
/**
 * @event afterReflow
 * @description Fires after the layout is completely reflowed, including viewport scrollbar changes.
 */

/**
 * @event beforeExpandModule
 * @description Fires before a module is expanded.
 * @param bd {Node} the module body (layout-m-bd)
 */
/**
 * @event afterExpandModule
 * @description Fires after a module is expanded.
 * @param bd {Node} the module body (layout-m-bd)
 */

/**
 * @event beforeCollapseModule
 * @description Fires before a module is collapsed.
 * @param bd {Node} the module body (layout-m-bd)
 */
/**
 * @event afterCollapseModule
 * @description Fires after a module is collapsed.
 * @param bd {Node} the module body (layout-m-bd)
 */

/**
 * @event beforeResizeModule
 * @description Fires before a module is resized.
 * @param bd {Node} the module body (layout-m-bd)
 * @param height {Number} new height in pixels or "auto"
 * @param width {Number} new width in pixels or "auto"
 */
/**
 * @event afterResizeModule
 * @description Fires after a module is resized.
 * @param bd {Node} the module body (layout-m-bd)
 * @param height {Number} new height in pixels
 * @param width {Number} new width in pixels
 */

/**
 * @property fit_to_viewport_class
 * @type {String}
 * @default "FIT_TO_VIEWPORT"
 * @static
 */
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 233);
PageLayout.fit_to_viewport_class = 'FIT_TO_VIEWPORT';

/**
 * @property fit_to_content_class
 * @type {String}
 * @default "FIT_TO_CONTENT"
 * @static
 */
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 241);
PageLayout.fit_to_content_class = 'FIT_TO_CONTENT';

/**
 * @property force_fit_class
 * @type {String}
 * @default "FORCE_FIT"
 * @static
 */
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 249);
PageLayout.force_fit_class = 'FORCE_FIT';

/**
 * @property page_header_class
 * @type {String}
 * @default "layout-hd"
 * @static
 */
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 257);
PageLayout.page_header_class = 'layout-hd';

/**
 * @property page_body_class
 * @type {String}
 * @default "layout-bd"
 * @static
 */
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 265);
PageLayout.page_body_class = 'layout-bd';

/**
 * @property page_footer_class
 * @type {String}
 * @default "layout-ft"
 * @static
 */
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 273);
PageLayout.page_footer_class = 'layout-ft';

/**
 * @property module_rows_class
 * @type {String}
 * @value "layout-module-row"
 * @static
 */
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 281);
PageLayout.module_rows_class = 'layout-module-row';

/**
 * @property module_cols_class
 * @type {String}
 * @value "layout-module-col"
 * @static
 */
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 289);
PageLayout.module_cols_class = 'layout-module-col';

/**
 * @property module_class
 * @type {String}
 * @default "layout-module"
 * @static
 */
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 297);
PageLayout.module_class = 'layout-module';

/**
 * @property module_header_class
 * @type {String}
 * @default "layout-m-hd"
 * @static
 */
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 305);
PageLayout.module_header_class = 'layout-m-hd';

/**
 * @property module_body_class
 * @type {String}
 * @default "layout-m-bd"
 * @static
 */
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 313);
PageLayout.module_body_class = 'layout-m-bd';

/**
 * @property module_footer_class
 * @type {String}
 * @default "layout-m-ft"
 * @static
 */
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 321);
PageLayout.module_footer_class = 'layout-m-ft';

/**
 * @property not_managed_class
 * @type {String}
 * @default "layout-not-managed"
 * @static
 */
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 329);
PageLayout.not_managed_class = 'layout-not-managed';

/**
 * @property collapse_vert_nub_class
 * @type {String}
 * @default "layout-vert-collapse-nub"
 * @static
 */
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 337);
PageLayout.collapse_vert_nub_class = 'layout-vert-collapse-nub';

/**
 * @property collapse_left_nub_class
 * @type {String}
 * @default "layout-left-collapse-nub"
 * @static
 */
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 345);
PageLayout.collapse_left_nub_class = 'layout-left-collapse-nub';

/**
 * @property collapse_right_nub_class
 * @type {String}
 * @default "layout-right-collapse-nub"
 * @static
 */
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 353);
PageLayout.collapse_right_nub_class = 'layout-right-collapse-nub';

/**
 * @property expand_vert_nub_class
 * @type {String}
 * @default "layout-vert-expand-nub"
 * @static
 */
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 361);
PageLayout.expand_vert_nub_class = 'layout-vert-expand-nub';

/**
 * @property expand_left_nub_class
 * @type {String}
 * @default "layout-left-expand-nub"
 * @static
 */
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 369);
PageLayout.expand_left_nub_class = 'layout-left-expand-nub';

/**
 * @property expand_right_nub_class
 * @type {String}
 * @default "layout-right-expand-nub"
 * @static
 */
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 377);
PageLayout.expand_right_nub_class = 'layout-right-expand-nub';

/**
 * @property collapsed_vert_class
 * @type {String}
 * @default "layout-collapsed-vert"
 * @static
 */
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 385);
PageLayout.collapsed_vert_class = 'layout-collapsed-vert';

/**
 * @property collapsed_horiz_class
 * @type {String}
 * @default "layout-collapsed-horiz"
 * @static
 */
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 393);
PageLayout.collapsed_horiz_class = 'layout-collapsed-horiz';

/**
 * @property min_module_height
 * @type {Number}
 * @default 10 (px)
 * @static
 */
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 401);
PageLayout.min_module_height = 10; // px

_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 403);
PageLayout.unmanaged_size = -1; // smaller than any module size (collapsed size = - normal size)

_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 405);
var mode_regex          = /\bFIT_TO_[A-Z_]+/,
	row_height_class_re = /(?:^|\s)height:([0-9]+)%/,
	col_width_class_re  = /(?:^|\s)width:([0-9]+)%/,

	reflow_delay = 100, // ms

	plugin_info =
	{
		row:
		{
			module:     'gallery-layout-rows',
			plugin:     'PageLayoutRows',
			outer_size: row_height_class_re,
			inner_size: col_width_class_re
		},
		col:
		{
			module:     'gallery-layout-cols',
			plugin:     'PageLayoutCols',
			outer_size: col_width_class_re,
			inner_size: row_height_class_re
		}
	};
/*
	dd_group_name:            'satg-layout-dd-group',
	drag_target_class:        'satg-layout-dd-target',
	drag_nub_class:           'satg-layout-dragnub',
	module_header_drag_class: 'satg-layout-draggable',
	module_no_drag_class:     'satg-layout-drag-disabled',
	bomb_sight_class:         'satg-layout-bomb-sight satg-layout-bomb-sight-rows',

	the_dd_targets = {};
	the_dd_nubs    = {};
*/

_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 440);
function init()
{
	_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "init", 440);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 442);
this.viewport =
	{
		w:   0,
		h:   0,
		bcw: 0
	};

	// find header, body, footer

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 451);
var page_blocks = Y.one(this.get('body')).get('children');

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 453);
var list = page_blocks.filter('.'+PageLayout.page_header_class);
	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 454);
if (list.size() > 1)
	{
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 456);
throw Error('There must be at most one div with class ' + PageLayout.page_header_class);
	}
	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 458);
this.header_container = (list.isEmpty() ? null : list.item(0));

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 460);
list = page_blocks.filter('.'+PageLayout.page_body_class);
	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 461);
if (list.size() != 1)
	{
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 463);
throw Error('There must be exactly one div with class ' + PageLayout.page_body_class);
	}
	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 465);
this.body_container = list.item(0);

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 467);
this.body_horiz_mbp = this.body_container.horizMarginBorderPadding();
	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 468);
this.body_vert_mbp  = this.body_container.vertMarginBorderPadding();

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 470);
var m = this.body_container.get('className').match(mode_regex);
	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 471);
if (m && m.length)
	{
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 473);
this.set('mode', PageLayout[ m[0] ]);
	}

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 476);
list = page_blocks.filter('.'+PageLayout.page_footer_class);
	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 477);
if (list.size() > 1)
	{
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 479);
throw Error('There must be at most one div with class ' + PageLayout.page_footer_class);
	}
	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 481);
this.footer_container = (list.isEmpty() ? null : list.item(0));

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 483);
Y.one(Y.config.win).on('resize', resize, this);

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 485);
updateFitClass.call(this);
	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 486);
reparentFooter.call(this);
	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 487);
this.rescanBody();

	// stay in sync

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 491);
this.after('modeChange', function()
	{
		_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "(anonymous 2)", 491);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 493);
updateFitClass.call(this);

		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 495);
if (this.body_container)
		{
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 497);
this.body_container.scrollTop = 0;
		}

		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 500);
reparentFooter.call(this);
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 501);
resize.call(this);
	});

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 504);
this.after('minWidthChange', resize);
	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 505);
this.after('minHeightChange', resize);

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 507);
this.after('stickyFooterChange', function()
	{
		_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "(anonymous 3)", 507);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 509);
reparentFooter.call(this);
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 510);
resize.call(this);
	});

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 513);
this.after('matchColumnHeightsChange', resize);
}

/*
 * Normalize the list of sizes so they add up to 100%.
 */
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 519);
function normalizeSizes(
	/* array */	list,
	/* regex */	pattern)
{
	// collect sizes

	_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "normalizeSizes", 519);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 525);
var sizes = Y.map(list, function(module)
	{
		_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "(anonymous 4)", 525);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 527);
if (module.hasClass(PageLayout.not_managed_class))
		{
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 529);
return PageLayout.unmanaged_size;
		}

		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 532);
var m = module.get('className').match(pattern);
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 533);
return (m && m.length ? parseInt(m[1], 10) : 0);
	});

	// analyze

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 538);
var info = Y.reduce(sizes, [0,0], function(value, size)
	{
		_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "(anonymous 5)", 538);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 540);
if (size > 0)
		{
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 542);
value[0] += size;
		}
		else {_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 544);
if (size === 0)
		{
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 546);
value[1]++;
		}}
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 548);
return value;
	});

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 551);
var sum = info[0], blank_count = info[1];

	// fill in blanks

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 555);
if (blank_count > 0)
	{
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 557);
var blank_size = Math.max((100 - sum) / blank_count, 10);

		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 559);
sizes = Y.map(sizes, function(size)
		{
			_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "(anonymous 6)", 559);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 561);
return (size === 0 ? blank_size : size);
		});

		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 564);
sum = Y.reduce(sizes, 0, function(sum, size, i)
		{
			_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "(anonymous 7)", 564);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 566);
return (size < 0 ? sum : sum + size);
		});
	}

	// normalize

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 572);
return Y.map(sizes, function(size)
	{
		_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "(anonymous 8)", 572);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 574);
return (size > 0 ? size * (100.0 / sum) : size);
	});
}

_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 578);
function updateFitClass()
{
	_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "updateFitClass", 578);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 580);
this.body_container.replaceClass('FIT_TO_(VIEWPORT|CONTENT)',
		this.get('mode') === PageLayout.FIT_TO_VIEWPORT ? 'FIT_TO_VIEWPORT' : 'FIT_TO_CONTENT');
}

_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 584);
function reparentFooter()
{
	_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "reparentFooter", 584);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 586);
if (!this.footer_container)
	{
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 588);
return;
	}

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 591);
if (this.get('mode') === PageLayout.FIT_TO_VIEWPORT || this.get('stickyFooter'))
	{
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 593);
this.body_container.get('parentNode').insertBefore(this.footer_container, this.body_container.next(function(node)
		{
			_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "(anonymous 9)", 593);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 595);
return node.get('tagName').toLowerCase() != 'script';
		}));
	}
	else
	{
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 600);
this.body_container.appendChild(this.footer_container);
	}
}

_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 604);
function resize()
{
	_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "resize", 604);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 606);
if (!this.layout_plugin || !this.body_container)
	{
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 608);
return;
	}

	// check if viewport changed

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 613);
var mode          = this.single_module ? Y.PageLayout.FIT_TO_VIEWPORT : this.get('mode');
	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 614);
var sticky_footer = this.get('stickyFooter');

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 616);
this.body_container.setStyle('overflowX',
		mode === Y.PageLayout.FIT_TO_CONTENT ? 'auto' : 'hidden');
	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 618);
this.body_container.setStyle('overflowY',
		mode === Y.PageLayout.FIT_TO_CONTENT ? 'scroll' : 'hidden');

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 621);
var viewport =
	{
		w: Y.DOM.winWidth(),
		h: Y.DOM.winHeight()
	};

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 627);
var resize_event = arguments[0] && arguments[0].type == 'resize';	// IE7 generates no-op's
	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 628);
if (resize_event &&
		(viewport.w === this.viewport.w &&
		 viewport.h === this.viewport.h))
	{
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 632);
return;
	}

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 635);
this.viewport = viewport;

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 637);
this.fire('beforeReflow');	// after confirming that viewport really has changed

	// set width of hd,bd,ft and height of bd

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 641);
var min_width  = Y.Node.emToPx(this.get('minWidth'));
	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 642);
var body_width = Math.max(this.viewport.w, min_width);
	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 643);
if (this.header_container)
	{
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 645);
this.header_container.setStyle('width', body_width+'px');
	}
	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 647);
this.body_container.setStyle('width', (body_width - this.body_horiz_mbp)+'px');
	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 648);
if (this.footer_container)
	{
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 650);
this.footer_container.setStyle('width', sticky_footer ? body_width+'px' : 'auto');
	}
	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 652);
body_width = this.body_container.get('clientWidth') - this.body_horiz_mbp;

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 654);
this.viewport.bcw = this.body_container.get('clientWidth');

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 656);
var h     = this.viewport.h;
	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 657);
var h_min = Y.Node.emToPx(this.get('minHeight'));
	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 658);
if (mode === Y.PageLayout.FIT_TO_VIEWPORT && h < h_min)
	{
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 660);
h = h_min;
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 661);
Y.one(document.documentElement).setStyle('overflowY', 'auto');
	}
	else {_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 663);
if (!window.console || !window.console.layout_force_viewport_scrollbars)	// remove inactive vertical scrollbar in IE
	{
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 665);
Y.one(document.documentElement).setStyle('overflowY', 'hidden');
	}}

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 668);
if (this.header_container)
	{
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 670);
h -= this.header_container.get('offsetHeight');
	}
	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 672);
if (this.footer_container &&
		(mode === Y.PageLayout.FIT_TO_VIEWPORT || sticky_footer))
	{
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 675);
h -= this.footer_container.get('offsetHeight');
	}

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 678);
if (mode === Y.PageLayout.FIT_TO_VIEWPORT)
	{
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 680);
var body_height = h - this.body_vert_mbp;
	}
	else {_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 682);
if (h < 0)						// FIT_TO_CONTENT doesn't enforce min height
	{
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 684);
h = 10 + this.body_vert_mbp;	// arbitrary, positive number
	}}

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 687);
this.body_container.setStyle('height', (h - this.body_vert_mbp)+'px');

	// resize modules

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 691);
this.layout_plugin.resize(this, mode, body_width, body_height);

	// show body and footer

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 695);
this.body_container.setStyle('visibility', 'visible');
	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 696);
if (this.footer_container)
	{
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 698);
this.footer_container.setStyle('visibility', 'visible');
	}

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 701);
Y.later(100, this, checkViewportSize);
}

/*
 * Check if the viewport size has changed, usually due to the browser
 * removing no-longer-needed scrollbars.  If the viewport size is
 * stable, fires the afterReflow event.
 */
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 709);
function checkViewportSize()
{
	_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "checkViewportSize", 709);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 711);
if (Y.DOM.winWidth()                       != this.viewport.w ||
		Y.DOM.winHeight()                      != this.viewport.h ||
		this.body_container.get('clientWidth') != this.viewport.bcw)
	{
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 715);
resize.call(this);
	}
	else
	{
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 719);
this.fire('afterReflow');
	}
}

/*
 * Expand the module containing the event target.
 */
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 726);
function expandModule(
	/* event */	e)
{
	_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "expandModule", 726);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 729);
var node = e.currentTarget;

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 731);
function expand(
		/* string */	parent_class_name,
		/* string */	collapsed_class)
	{
		_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "expand", 731);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 735);
var p = node.getAncestorByClassName(this.layout_plugin.collapse_classes[parent_class_name]);
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 736);
if (p && p.hasClass(collapsed_class))
		{
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 738);
var children = this._analyzeModule(p);
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 739);
this.fire('beforeExpandModule', { bd: children.bd });

			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 741);
p.removeClass(collapsed_class);
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 742);
resize.call(this);

			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 744);
this.fire('afterExpandModule', { bd: children.bd });
		}
	}

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 748);
if (node.hasClass(PageLayout.expand_vert_nub_class))
	{
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 750);
expand.call(this, 'vert_parent_class', PageLayout.collapsed_vert_class);
	}
	else
	{
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 754);
expand.call(this, 'horiz_parent_class', PageLayout.collapsed_horiz_class);
	}
}

/*
 * Collapse the module containing the event target.
 */
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 761);
function collapseModule(
	/* event */	e)
{
	_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "collapseModule", 761);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 764);
var node = e.currentTarget;

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 766);
function collapse(
		/* string */	parent_class_name,
		/* string */	collapsed_class)
	{
		_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "collapse", 766);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 770);
var p = node.getAncestorByClassName(this.layout_plugin.collapse_classes[parent_class_name]);
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 771);
if (p && !p.hasClass(collapsed_class))
		{
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 773);
var children = this._analyzeModule(p);
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 774);
this.fire('beforeCollapseModule', { bd: children.bd });

			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 776);
p.addClass(collapsed_class);
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 777);
resize.call(this);

			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 779);
this.fire('afterCollapseModule', { bd: children.bd });
		}
	}

	_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 783);
if (node.hasClass(PageLayout.collapse_vert_nub_class))
	{
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 785);
collapse.call(this, 'vert_parent_class', PageLayout.collapsed_vert_class);
	}
	else
	{
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 789);
collapse.call(this, 'horiz_parent_class', PageLayout.collapsed_horiz_class);
	}
}

_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 793);
Y.extend(PageLayout, Y.Base,
{
	initializer: function()
	{
		_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "initializer", 795);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 797);
Y.on('domready', init, this);
	},

	/**
	 * Call this after manually adding or removing modules on the page.
	 * 
	 * @method rescanBody
	 */
	rescanBody: function()
	{
		_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "rescanBody", 805);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 807);
Y.detach('PageLayoutCollapse|click');

		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 809);
this.body_info =
		{
			outers:      [],
			modules:     [],	// list of modules inside each row
			outer_sizes: [],	// list of percentages
			inner_sizes: []		// list of lists of percentages
		};

		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 817);
var outer_list  = this.body_container.all('div.' + PageLayout.module_rows_class);
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 818);
var plugin_data = plugin_info.row;
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 819);
if (outer_list.isEmpty())
		{
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 821);
outer_list  = this.body_container.all('div.' + PageLayout.module_cols_class);
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 822);
plugin_data = plugin_info.col;
		}
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 824);
if (outer_list.isEmpty())
		{
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 826);
throw Error('There must be at least one ' + PageLayout.module_rows_class + ' or ' + PageLayout.module_cols_class + ' inside ' + PageLayout.page_body_class + '.');
		}
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 828);
this.body_info.outers = outer_list;

		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 830);
var collapse_nub_pattern =
			'(' +
			PageLayout.collapse_vert_nub_class + '|' +
			PageLayout.collapse_left_nub_class + '|' +
			PageLayout.collapse_right_nub_class +
			')';

		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 837);
var expand_nub_pattern =
			'(' +
			PageLayout.expand_vert_nub_class + '|' +
			PageLayout.expand_left_nub_class + '|' +
			PageLayout.expand_right_nub_class +
			')';

		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 844);
var row_count = this.body_info.outers.size();
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 845);
Y.each(this.body_info.outers, function(row)
		{
			_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "(anonymous 10)", 845);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 847);
var row_id = row.generateID();
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 848);
this.body_info.outer_sizes.push(100.0/row_count);

			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 850);
var list = row.all('div.' + PageLayout.module_class);
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 851);
if (list.isEmpty())
			{
				_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 853);
this.body_info.outers  = [];
				_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 854);
this.body_info.modules = [];
				_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 855);
throw Error('There must be at least one ' + PageLayout.module_class + ' inside ' + PageLayout.module_rows_class + '.');
			}

			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 858);
this.body_info.modules.push(list);

			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 860);
Y.each(list, function(module)
			{
				_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "(anonymous 11)", 860);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 862);
var nub = module.getFirstElementByClassName(collapse_nub_pattern);
				_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 863);
if (nub)
				{
					_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 865);
nub.on('PageLayoutCollapse|click', collapseModule, this);
				}

				_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 868);
nub = module.getFirstElementByClassName(expand_nub_pattern);
				_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 869);
if (nub)
				{
					_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 871);
nub.on('PageLayoutCollapse|click', expandModule, this);
				}
			},
			this);
/*
			if (PageLayoutDDProxy)
			{
				var has_nubs = false;
				Y.each(list, function(module)
				{
					var id = module.generateID();
					module.removeClass(PageLayout.module_no_drag_class);

					if (the_dd_nubs[id])
					{
						has_nubs = (the_dd_nubs[id] != 'none');
					}
					else
					{
						var nub = module.getFirstElementByClassName(PageLayout.drag_nub_class);
						if (nub)
						{
							var children = this._analyzeModule(module);
							if (children.hd)
							{
								children.hd.addClass(PageLayout.module_header_drag_class);
								the_dd_nubs[id] =
									new PageLayoutDDProxy(this, id, children.hd, PageLayout.dd_group_name);
								has_nubs = true;
							}
						}

						if (!the_dd_nubs[id])
						{
							the_dd_nubs[id] = 'none';
						}
					}
				},
				this);

				if (!the_dd_targets[ row_id ] &&
					(has_nubs || row.hasClass(PageLayout.drag_target_class)))
				{
					the_dd_targets[ row_id ] = new DDTarget(row_id, PageLayout.dd_group_name);
				}

				if (list.size() == 1)
				{
					list.item(0).addClass(PageLayout.module_no_drag_class);
				}
			}
*/
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 923);
this.body_info.inner_sizes.push(
				normalizeSizes(list, plugin_data.inner_size));
		},
		this);

		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 928);
this.body_info.outer_sizes =
			normalizeSizes(this.body_info.outers, plugin_data.outer_size);

		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 931);
this.single_module = false;
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 932);
if (this.body_info.outers.size() == 1 && this.body_info.modules[0].size() == 1 &&
			!this.body_container.hasClass(PageLayout.force_fit_class))
		{
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 935);
plugin_data        = plugin_info.row;
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 936);
this.single_module = true;
		}

		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 939);
var self = this;
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 940);
Y.use(plugin_data.module, function(Y)
		{
			_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "(anonymous 12)", 940);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 942);
self.layout_plugin = Y[ plugin_data.plugin ];
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 943);
updateFitClass.call(self);	// plugin may modify it
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 944);
resize.call(self);
		});
	},

	/**
	 * @method getHeaderHeight
	 * @return {Number} the height of the sticky header in pixels
	 */
	getHeaderHeight: function()
	{
		_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "getHeaderHeight", 952);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 954);
return (this.header_container ? this.header_container.get('offsetHeight') : 0);
	},

	/**
	 * @method getHeaderContainer
	 * @return {Node} the header container (layout-hd) or null if there is no header
	 */
	getHeaderContainer: function()
	{
		_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "getHeaderContainer", 961);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 963);
return this.header_container;
	},

	/**
	 * @method getBodyHeight
	 * @return {Number} the height of the scrolling body in pixels
	 */
	getBodyHeight: function()
	{
		_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "getBodyHeight", 970);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 972);
return this.body_container.get('offsetHeight');
	},

	/**
	 * @method getBodyContainer
	 * @return {Node} the body container (layout-bd)
	 */
	getBodyContainer: function()
	{
		_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "getBodyContainer", 979);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 981);
return this.body_container;
	},

	/**
	 * @method getFooterHeight
	 * @return {Number} the height of the sticky footer in pixels or zero if the footer is not sticky
	 */
	getFooterHeight: function()
	{
		_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "getFooterHeight", 988);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 990);
return (this.get('stickyFooter') && this.footer_container ?
				this.footer_container.get('offsetHeight') : 0);
	},

	/**
	 * @method getFooterContainer
	 * @return {Node} the footer container (layout-ft), or null if there is no footer
	 */
	getFooterContainer: function()
	{
		_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "getFooterContainer", 998);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1000);
return this.footer_container;
	},

	/**
	 * @method moduleIsCollapsed
	 * @param node {String|Node} .layout-module
	 * @return {Boolean} true if module is collapsed
	 */
	moduleIsCollapsed: function(
		/* string/Node */	node)
	{
		_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "moduleIsCollapsed", 1008);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1011);
var collapsed_pattern =
			'(' +
			PageLayout.collapsed_horiz_class + '|' +
			PageLayout.collapses_vert_class +
			')';

		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1017);
node = Y.one(node);
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1018);
if (node.getFirstElementByClassName(this.layout_plugin.collapse_classes.collapse_parent_pattern))
		{
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1020);
node = node.get('parentNode');
		}

		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1023);
return node.hasClass(collapsed_pattern);
	},

	/**
	 * Expand the specified module.
	 * 
	 * @method expandModule
	 * @param node {String|Node} .layout-module
	 */
	expandModule: function(
		/* string/Node */	node)
	{
		_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "expandModule", 1032);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1035);
node    = Y.one(node);
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1036);
var nub = node.getFirstElementByClassName(PageLayout.expand_vert_nub_class);
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1037);
if (!nub)
		{
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1039);
var expand_horiz_nub_pattern =
				'(' +
				PageLayout.expand_left_nub_class + '|' +
				PageLayout.expand_right_nub_class +
				')';

			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1045);
nub = node.getFirstElementByClassName(expand_horiz_nub_pattern);
		}

		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1048);
if (nub)
		{
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1050);
expandModule.call(this, { currentTarget: nub });
		}
	},

	/**
	 * Collapse the specified module.
	 * 
	 * @method collapseModule
	 * @param node {String|Node} .layout-module
	 */
	collapseModule: function(
		/* string/Node */	node)
	{
		_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "collapseModule", 1060);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1063);
node    = Y.one(node);
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1064);
var nub = node.getFirstElementByClassName(PageLayout.collapse_vert_nub_class);
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1065);
if (!nub)
		{
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1067);
var collapse_horiz_nub_pattern =
				'(' +
				PageLayout.collapse_left_nub_class + '|' +
				PageLayout.collapse_right_nub_class +
				')';

			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1073);
nub = node.getFirstElementByClassName(collapse_horiz_nub_pattern);
		}

		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1076);
if (nub)
		{
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1078);
collapseModule.call(this, { currentTarget: nub });
		}
	},

	/**
	 * Toggle the collapsed state of the specified layout-module.
	 * 
	 * @method toggleModule
	 * @param module {String|Node} .layout-module
	 */
	toggleModule: function(
		/* string/Node */	module)
	{
		_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "toggleModule", 1088);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1091);
module = Y.one(module);	// optimization
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1092);
if (this.moduleIsCollapsed(module))
		{
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1094);
this.expandModule(module);
		}
		else
		{
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1098);
this.collapseModule(module);
		}
	},

	/**
	 * Call this when something changes size, to request a reflow of the
	 * layout.
	 * 
	 * @method elementResized
	 * @param el {String|Node} element that changed size
	 * @return {Boolean} true if the element is inside the managed containers
	 */
	elementResized: function(
		/* string/Node */	el)
	{
		_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "elementResized", 1110);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1113);
el = Y.one(el);

		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1115);
if ((this.header_container && this.header_container.contains(el)) ||
			(this.body_container && this.body_container.contains(el)) ||
			(this.footer_container && this.footer_container.contains(el)))
		{
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1119);
if (this.refresh_timer)
			{
				_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1121);
this.refresh_timer.cancel();
			}

			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1124);
var t1 = (new Date()).getTime();
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1125);
this.refresh_timer = Y.later(reflow_delay, this, function()
			{
				_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "(anonymous 13)", 1125);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1127);
this.refresh_timer = null;

				// if JS is really busy, wait a bit longer

				_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1131);
var t2 = (new Date()).getTime();
				_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1132);
if (t2 > t1 + 2*reflow_delay)
				{
					_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1134);
this.elementResized(el);
				}
				else
				{
					_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1138);
resize.call(this);
				}
			});

			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1142);
return true;
		}
		else
		{
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1146);
return false;
		}
	},

	/**
	 * Returns the components of the module.
	 * 
	 * @method _analyzeModule
	 * @private
	 * @param root {Node} .layout-module
	 * @return {Object} root,hd,bd,ft
	 */
	_analyzeModule: function(
		/* node */	root)
	{
		_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "_analyzeModule", 1158);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1161);
var result =
		{
			root: root,
			hd:   null,
			bd:   null,
			ft:   null
		};

		// two step process avoid scanning into the module body

		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1171);
var bd = root.one('.'+PageLayout.module_body_class);
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1172);
if (!bd)
		{
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1174);
return result;
		}

		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1177);
var list = bd.siblings().filter('.'+PageLayout.module_body_class);
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1178);
list.unshift(bd);
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1179);
result.bd = list.find(function(n)
		{
			_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "(anonymous 14)", 1179);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1181);
return (n.get('offsetWidth') > 0);
		});
		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1183);
if (!result.bd)
		{	
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1185);
result.bd = bd;
		}

		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1188);
if (result.bd)
		{
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1190);
result.hd = result.bd.siblings().filter('.'+PageLayout.module_header_class).item(0);
			_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1191);
result.ft = result.bd.siblings().filter('.'+PageLayout.module_footer_class).item(0);
		}

		_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1194);
return result;
	},

	/**
	 * Set the width of a module.
	 * 
	 * @method _setWidth
	 * @private
	 * @param children {Object} root,hd,bd,ft
	 * @param w {Number} width in pixels
	 */
	_setWidth: function(
		/* object */	children,
		/* int */		w)
	{
		_yuitest_coverfunc("/build/gallery-layout/gallery-layout.js", "_setWidth", 1205);
_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1209);
children.root.setStyle('width', w+'px');
	}
});

_yuitest_coverline("/build/gallery-layout/gallery-layout.js", 1213);
Y.PageLayout = PageLayout;


}, 'gallery-2012.10.03-20-02' ,{optional:['gallery-layout-rows','gallery-layout-cols'], requires:['base','gallery-funcprog','gallery-node-optimizations','gallery-dimensions','gallery-nodelist-extras2'], skinnable:true});
