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
_yuitest_coverage["/build/gallery-paginator/gallery-paginator.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-paginator/gallery-paginator.js",
    code: []
};
_yuitest_coverage["/build/gallery-paginator/gallery-paginator.js"].code=["YUI.add('gallery-paginator', function(Y) {","","\"use strict\";","/*","Copyright (c) 2009, Yahoo! Inc. All rights reserved.","Code licensed under the BSD License:","http://developer.yahoo.net/yui/license.txt","*/","","/**"," * The Paginator widget provides a set of controls to navigate through"," * paged data."," * "," * @module gallery-paginator"," */","","/**"," * To instantiate a Paginator, pass a configuration object to the contructor."," * The configuration object should contain the following properties:"," * <ul>"," *   <li>rowsPerPage : <em>n</em> (int)</li>"," *   <li>totalRecords : <em>n</em> (int or Paginator.VALUE_UNLIMITED)</li>"," * </ul>"," *"," * @class Paginator"," * @extends Widget"," * @constructor"," * @param config {Object} Object literal to set instance and ui component"," * configuration."," */","function Paginator(config) {","    Paginator.superclass.constructor.call(this, config);","}","","","// Static members","Y.mix(Paginator, {","    NAME: \"paginator\",","","    /**","     * Base of id strings used for ui components.","     * @static","     * @property Paginator.ID_BASE","     * @type string","     * @private","     */","    ID_BASE : 'yui-pg-',","","    /**","     * Used to identify unset, optional configurations, or used explicitly in","     * the case of totalRecords to indicate unlimited pagination.","     * @static","     * @property Paginator.VALUE_UNLIMITED","     * @type number","     * @final","     */","    VALUE_UNLIMITED : -1,","","    /**","     * Default template used by Paginator instances.  Update this if you want","     * all new Paginators to use a different default template.","     * @static","     * @property Paginator.TEMPLATE_DEFAULT","     * @type string","     */","    TEMPLATE_DEFAULT : \"{FirstPageLink} {PreviousPageLink} {PageLinks} {NextPageLink} {LastPageLink}\",","","    /**","     * Common alternate pagination format, including page links, links for","     * previous, next, first and last pages as well as a rows-per-page","     * dropdown.  Offered as a convenience.","     * @static","     * @property Paginator.TEMPLATE_ROWS_PER_PAGE","     * @type string","     */","    TEMPLATE_ROWS_PER_PAGE : \"{FirstPageLink} {PreviousPageLink} {PageLinks} {NextPageLink} {LastPageLink} {RowsPerPageDropdown}\",","","    /**","     * Storage object for UI Components","     * @static","     * @property Paginator.ui","     */","    ui : {},","","    /**","     * Similar to Y.Lang.isNumber, but allows numeric strings.  This is","     * is used for attribute validation in conjunction with getters that return","     * numbers.","     *","     * @method Paginator.isNumeric","     * @param v {Number|String} value to be checked for number or numeric string","     * @return {Boolean} true if the input is coercable into a finite number","     * @static","     */","    isNumeric : function (v) {","        return isFinite(+v);","    },","","    /**","     * Return a number or null from input","     *","     * @method Paginator.toNumber","     * @param n {Number|String} a number or numeric string","     * @return Number","     * @static","     */","    toNumber : function (n) {","        return isFinite(+n) ? +n : null;","    }","","},true);","","","Paginator.ATTRS =","{","    /**","     * REQUIRED. Number of records constituting a &quot;page&quot;","     * @attribute rowsPerPage","     * @type integer","     */","    rowsPerPage: {","        value     : 0,","        validator : Paginator.isNumeric,","        setter    : Paginator.toNumber","    },","","    /**","     * Total number of records to paginate through","     * @attribute totalRecords","     * @type integer","     * @default 0","     */","    totalRecords: {","        value     : 0,","        validator : Paginator.isNumeric,","        setter    : Paginator.toNumber","    },","","    /**","     * Zero based index of the record considered first on the current page.","     * For page based interactions, don't modify this attribute directly;","     * use setPage(n).","     * @attribute recordOffset","     * @type integer","     * @default 0","     */","    recordOffset: {","        value     : 0,","        validator : function (val) {","            var total = this.get('totalRecords');","            if (Paginator.isNumeric(val)) {","                val = +val;","                return total === Paginator.VALUE_UNLIMITED || total > val ||","                       (total === 0 && val === 0);","            }","","            return false;","        },","        setter    : Paginator.toNumber","    },","","    /**","     * Page to display on initial paint","     * @attribute initialPage","     * @type integer","     * @default 1","     */","    initialPage: {","        value     : 1,","        validator : Paginator.isNumeric,","        setter    : Paginator.toNumber","    },","","    /**","     * Template used to render controls.  The string will be used as","     * innerHTML on all specified container nodes.  Bracketed keys","     * (e.g. {pageLinks}) in the string will be replaced with an instance","     * of the so named ui component.","     * @see Paginator.TEMPLATE_DEFAULT","     * @see Paginator.TEMPLATE_ROWS_PER_PAGE","     * @attribute template","     * @type string","     */","    template: {","        value : Paginator.TEMPLATE_DEFAULT,","        validator : Y.Lang.isString","    },","","    /**","     * Display pagination controls even when there is only one page.  Set","     * to false to forgo rendering and/or hide the containers when there","     * is only one page of data.  Note if you are using the rowsPerPage","     * dropdown ui component, visibility will be maintained as long as the","     * number of records exceeds the smallest page size.","     * @attribute alwaysVisible","     * @type boolean","     * @default true","     */","    alwaysVisible: {","        value : true,","        validator : Y.Lang.isBoolean","    },","","    // Read only attributes","","    /**","     * Unique id assigned to this instance","     * @attribute id","     * @type integer","     * @final","     */","    id: {","        value    : Y.guid(),","        readOnly : true","    }","};","","","/**"," * Event fired when a change in pagination values is requested,"," * either by interacting with the various ui components or via the"," * setStartIndex(n) etc APIs."," * Subscribers will receive the proposed state as the first parameter."," * The proposed state object will contain the following keys:"," * <ul>"," *   <li>paginator - the Paginator instance</li>"," *   <li>page</li>"," *   <li>totalRecords</li>"," *   <li>recordOffset - index of the first record on the new page</li>"," *   <li>rowsPerPage</li>"," *   <li>records - array containing [start index, end index] for the records on the new page</li>"," *   <li>before - object literal with all these keys for the current state</li>"," * </ul>"," * @event changeRequest"," */","","/**"," * Event fired when attribute changes have resulted in the calculated"," * current page changing."," * @event pageChange"," */","","","// Instance members and methods","Y.extend(Paginator, Y.Widget,","{","    // Instance members","","    /**","     * Flag used to indicate multiple attributes are being updated via setState","     * @property _batch","     * @type boolean","     * @protected","     */","    _batch : false,","","    /**","     * Used by setState to indicate when a page change has occurred","     * @property _pageChanged","     * @type boolean","     * @protected","     */","    _pageChanged : false,","","    /**","     * Temporary state cache used by setState to keep track of the previous","     * state for eventual pageChange event firing","     * @property _state","     * @type Object","     * @protected","     */","    _state : null,","","","    // Instance methods","","    initializer : function(config) {","        var UNLIMITED = Paginator.VALUE_UNLIMITED,","            initialPage, records, perPage, startIndex;","","        this._selfSubscribe();","","        // Calculate the initial record offset","        initialPage = this.get('initialPage');","        records     = this.get('totalRecords');","        perPage     = this.get('rowsPerPage');","        if (initialPage > 1 && perPage !== UNLIMITED) {","            startIndex = (initialPage - 1) * perPage;","            if (records === UNLIMITED || startIndex < records) {","                this.set('recordOffset',startIndex);","            }","        }","    },","","    /**","     * Subscribes to instance attribute change events to automate certain","     * behaviors.","     * @method _selfSubscribe","     * @protected","     */","    _selfSubscribe : function () {","        // Listen for changes to totalRecords and alwaysVisible ","        this.after('totalRecordsChange',this.updateVisibility,this);","        this.after('alwaysVisibleChange',this.updateVisibility,this);","","        // Fire the pageChange event when appropriate","        this.after('totalRecordsChange',this._handleStateChange,this);","        this.after('recordOffsetChange',this._handleStateChange,this);","        this.after('rowsPerPageChange',this._handleStateChange,this);","","        // Update recordOffset when totalRecords is reduced below","        this.after('totalRecordsChange',this._syncRecordOffset,this);","    },","","    renderUI : function () {","        this._renderTemplate(","            this.get('contentBox'),","            this.get('template'),","            Paginator.ID_BASE + this.get('id'),","            true);","","        // Show the widget if appropriate","        this.updateVisibility();","    },","","    /**","     * Creates the individual ui components and renders them into a container.","     *","     * @method _renderTemplate","     * @param container {HTMLElement} where to add the ui components","     * @param template {String} the template to use as a guide for rendering","     * @param id_base {String} id base for the container's ui components","     * @param hide {Boolean} leave the container hidden after assembly","     * @protected","     */","    _renderTemplate : function (container, template, id_base, hide) {","        if (!container) {","            return;","        }","","        // Hide the container while its contents are rendered","        container.setStyle('display','none');","","        container.addClass(this.getClassName());","","        var className = this.getClassName('ui');","","        // Place the template innerHTML, adding marker spans to the template","        // html to indicate drop zones for ui components","        container.set('innerHTML', template.replace(/\\{([a-z0-9_ \\-]+)\\}/gi,","            '<span class=\"'+className+' '+className+'-$1\"></span>'));","","        // Replace each marker with the ui component's render() output","        container.all('span.'+className).each(function(node)","        {","            this.renderUIComponent(node, id_base);","        },","        this);","","        if (!hide) {","            // Show the container allowing page reflow","            container.setStyle('display','');","        }","    },","","    /**","     * Replaces a marker node with a rendered UI component, determined by the","     * yui-paginator-ui-(UI component class name) in the marker's className. e.g.","     * yui-paginator-ui-PageLinks => new Y.Paginator.ui.PageLinks(this)","     *","     * @method renderUIComponent","     * @param marker {HTMLElement} the marker node to replace","     * @param id_base {String} string base the component's generated id","     */","    renderUIComponent : function (marker, id_base) {","        var par    = marker.get('parentNode'),","            clazz  = this.getClassName('ui'),","            name   = new RegExp(clazz+'-(\\\\w+)').exec(marker.get('className')),","            UIComp = name && Paginator.ui[name[1]],","            comp;","","        if (Y.Lang.isFunction(UIComp)) {","            comp = new UIComp(this);","            if (Y.Lang.isFunction(comp.render)) {","                par.replaceChild(comp.render(id_base),marker);","            }","        }","    },","","    /**","     * Hides the widget if there is only one page of data and attribute","     * alwaysVisible is false.  Conversely, it displays the widget if either","     * there is more than one page worth of data or alwaysVisible is turned on.","     * @method updateVisibility","     */","    updateVisibility : function (e) {","        var alwaysVisible = this.get('alwaysVisible'),","            totalRecords,visible,rpp,rppOptions,i,len,rppOption,rppValue;","","        if (!e || e.type === 'alwaysVisibleChange' || !alwaysVisible) {","            totalRecords = this.get('totalRecords');","            visible      = true;","            rpp          = this.get('rowsPerPage');","            rppOptions   = this.get('rowsPerPageOptions');","","            if (Y.Lang.isArray(rppOptions)) {","                for (i = 0, len = rppOptions.length; i < len; ++i) {","                    rppOption = rppOptions[i];","                    rppValue  = Y.Lang.isValue(rppOption.value) ? rppOption.value : rppOption;","                    rpp       = Math.min(rpp,rppValue);","                }","            }","","            if (totalRecords !== Paginator.VALUE_UNLIMITED &&","                totalRecords <= rpp) {","                visible = false;","            }","","            visible = visible || alwaysVisible;","            this.get('contentBox').setStyle('display', visible ? '' : 'none');","        }","    },","","    /**","     * Get the total number of pages in the data set according to the current","     * rowsPerPage and totalRecords values.  If totalRecords is not set, or","     * set to Y.Paginator.VALUE_UNLIMITED, returns Y.Paginator.VALUE_UNLIMITED.","     * @method getTotalPages","     * @return {number}","     */","    getTotalPages : function () {","        var records = this.get('totalRecords'),","            perPage = this.get('rowsPerPage');","","        // rowsPerPage not set.  Can't calculate","        if (!perPage) {","            return null;","        }","","        if (records === Paginator.VALUE_UNLIMITED) {","            return Paginator.VALUE_UNLIMITED;","        }","","        return Math.ceil(records/perPage);","    },","","    /**","     * Does the requested page have any records?","     * @method hasPage","     * @param page {number} the page in question","     * @return {boolean}","     */","    hasPage : function (page) {","        if (!Y.Lang.isNumber(page) || page < 1) {","            return false;","        }","","        var totalPages = this.getTotalPages();","","        return (totalPages === Paginator.VALUE_UNLIMITED || totalPages >= page);","    },","","    /**","     * Get the page number corresponding to the current record offset.","     * @method getCurrentPage","     * @return {number}","     */","    getCurrentPage : function () {","        var perPage = this.get('rowsPerPage');","        if (!perPage || !this.get('totalRecords')) {","            return 0;","        }","        return Math.floor(this.get('recordOffset') / perPage) + 1;","    },","","    /**","     * Are there records on the next page?","     * @method hasNextPage","     * @return {boolean}","     */","    hasNextPage : function () {","        var currentPage = this.getCurrentPage(),","            totalPages  = this.getTotalPages();","","        return currentPage && (totalPages === Paginator.VALUE_UNLIMITED || currentPage < totalPages);","    },","","    /**","     * Get the page number of the next page, or null if the current page is the","     * last page.","     * @method getNextPage","     * @return {number}","     */","    getNextPage : function () {","        return this.hasNextPage() ? this.getCurrentPage() + 1 : null;","    },","","    /**","     * Is there a page before the current page?","     * @method hasPreviousPage","     * @return {boolean}","     */","    hasPreviousPage : function () {","        return (this.getCurrentPage() > 1);","    },","","    /**","     * Get the page number of the previous page, or null if the current page","     * is the first page.","     * @method getPreviousPage","     * @return {number}","     */","    getPreviousPage : function () {","        return (this.hasPreviousPage() ? this.getCurrentPage() - 1 : 1);","    },","","    /**","     * Get the start and end record indexes of the specified page.","     * @method getPageRecords","     * @param [page] {number} The page (current page if not specified)","     * @return {Array} [start_index, end_index]","     */","    getPageRecords : function (page) {","        if (!Y.Lang.isNumber(page)) {","            page = this.getCurrentPage();","        }","","        var perPage = this.get('rowsPerPage'),","            records = this.get('totalRecords'),","            start, end;","","        if (!page || !perPage) {","            return null;","        }","","        start = (page - 1) * perPage;","        if (records !== Paginator.VALUE_UNLIMITED) {","            if (start >= records) {","                return null;","            }","            end = Math.min(start + perPage, records) - 1;","        } else {","            end = start + perPage - 1;","        }","","        return [start,end];","    },","","    /**","     * Set the current page to the provided page number if possible.","     * @method setPage","     * @param newPage {number} the new page number","     * @param silent {boolean} whether to forcibly avoid firing the changeRequest event","     */","    setPage : function (page,silent) {","        if (this.hasPage(page) && page !== this.getCurrentPage()) {","            if (silent) {","                this.set('recordOffset', (page - 1) * this.get('rowsPerPage'));","            } else {","                this.fire('changeRequest',this.getState({'page':page}));","            }","        }","    },","","    /**","     * Get the number of rows per page.","     * @method getRowsPerPage","     * @return {number} the current setting of the rowsPerPage attribute","     */","    getRowsPerPage : function () {","        return this.get('rowsPerPage');","    },","","    /**","     * Set the number of rows per page.","     * @method setRowsPerPage","     * @param rpp {number} the new number of rows per page","     * @param silent {boolean} whether to forcibly avoid firing the changeRequest event","     */","    setRowsPerPage : function (rpp,silent) {","        if (Paginator.isNumeric(rpp) && +rpp > 0 &&","            +rpp !== this.get('rowsPerPage')) {","            if (silent) {","                this.set('rowsPerPage',rpp);","            } else {","                this.fire('changeRequest',","                    this.getState({'rowsPerPage':+rpp}));","            }","        }","    },","","    /**","     * Get the total number of records.","     * @method getTotalRecords","     * @return {number} the current setting of totalRecords attribute","     */","    getTotalRecords : function () {","        return this.get('totalRecords');","    },","","    /**","     * Set the total number of records.","     * @method setTotalRecords","     * @param total {number} the new total number of records","     * @param silent {boolean} whether to forcibly avoid firing the changeRequest event","     */","    setTotalRecords : function (total,silent) {","        if (Paginator.isNumeric(total) && +total >= 0 &&","            +total !== this.get('totalRecords')) {","            if (silent) {","                this.set('totalRecords',total);","            } else {","                this.fire('changeRequest',","                    this.getState({'totalRecords':+total}));","            }","        }","    },","","    /**","     * Get the index of the first record on the current page","     * @method getStartIndex","     * @return {number} the index of the first record on the current page","     */","    getStartIndex : function () {","        return this.get('recordOffset');","    },","","    /**","     * Move the record offset to a new starting index.  This will likely cause","     * the calculated current page to change.  You should probably use setPage.","     * @method setStartIndex","     * @param offset {number} the new record offset","     * @param silent {boolean} whether to forcibly avoid firing the changeRequest event","     */","    setStartIndex : function (offset,silent) {","        if (Paginator.isNumeric(offset) && +offset >= 0 &&","            +offset !== this.get('recordOffset')) {","            if (silent) {","                this.set('recordOffset',offset);","            } else {","                this.fire('changeRequest',","                    this.getState({'recordOffset':+offset}));","            }","        }","    },","","    /**","     * Get an object literal describing the current state of the paginator.  If","     * an object literal of proposed values is passed, the proposed state will","     * be returned as an object literal with the following keys:","     * <ul>","     * <li>paginator - instance of the Paginator</li>","     * <li>page - number</li>","     * <li>totalRecords - number</li>","     * <li>recordOffset - number</li>","     * <li>rowsPerPage - number</li>","     * <li>records - [ start_index, end_index ]</li>","     * <li>before - (OPTIONAL) { state object literal for current state }</li>","     * </ul>","     * @method getState","     * @return {object}","     * @param changes {object} OPTIONAL object literal with proposed values","     * Supported change keys include:","     * <ul>","     * <li>rowsPerPage</li>","     * <li>totalRecords</li>","     * <li>recordOffset OR</li>","     * <li>page</li>","     * </ul>","     */","    getState : function (changes) {","        var UNLIMITED = Paginator.VALUE_UNLIMITED,","            M = Math, max = M.max, ceil = M.ceil,","            currentState, state, offset;","","        function normalizeOffset(offset,total,rpp) {","            if (offset <= 0 || total === 0) {","                return 0;","            }","            if (total === UNLIMITED || total > offset) {","                return offset - (offset % rpp);","            }","            return total - (total % rpp || rpp);","        }","","        currentState = {","            paginator    : this,","            totalRecords : this.get('totalRecords'),","            rowsPerPage  : this.get('rowsPerPage'),","            records      : this.getPageRecords()","        };","        currentState.recordOffset = normalizeOffset(","                                        this.get('recordOffset'),","                                        currentState.totalRecords,","                                        currentState.rowsPerPage);","        currentState.page = ceil(currentState.recordOffset /","                                 currentState.rowsPerPage) + 1;","","        if (!changes) {","            return currentState;","        }","","        state = {","            paginator    : this,","            before       : currentState,","","            rowsPerPage  : changes.rowsPerPage || currentState.rowsPerPage,","            totalRecords : (Paginator.isNumeric(changes.totalRecords) ?","                                max(changes.totalRecords,UNLIMITED) :","                                +currentState.totalRecords)","        };","","        if (state.totalRecords === 0) {","            state.recordOffset =","            state.page         = 0;","        } else {","            offset = Paginator.isNumeric(changes.page) ?","                        (changes.page - 1) * state.rowsPerPage :","                        Paginator.isNumeric(changes.recordOffset) ?","                            +changes.recordOffset :","                            currentState.recordOffset;","","            state.recordOffset = normalizeOffset(offset,","                                    state.totalRecords,","                                    state.rowsPerPage);","","            state.page = ceil(state.recordOffset / state.rowsPerPage) + 1;","        }","","        state.records = [ state.recordOffset,","                          state.recordOffset + state.rowsPerPage - 1 ];","","        // limit upper index to totalRecords - 1","        if (state.totalRecords !== UNLIMITED &&","            state.recordOffset < state.totalRecords && state.records &&","            state.records[1] > state.totalRecords - 1) {","            state.records[1] = state.totalRecords - 1;","        }","","        return state;","    },","","    /**","     * Convenience method to facilitate setting state attributes rowsPerPage,","     * totalRecords, recordOffset in batch.  Also supports calculating","     * recordOffset from state.page if state.recordOffset is not provided.","     * Fires only a single pageChange event, if appropriate.","     * This will not fire a changeRequest event.","     * @method setState","     * @param state {Object} Object literal of attribute:value pairs to set","     */","    setState : function (state) {","        if (Y.Lang.isObject(state)) {","            // get flux state based on current state with before state as well","            this._state = this.getState({});","","            // use just the state props from the input obj","            state = {","                page         : state.page,","                rowsPerPage  : state.rowsPerPage,","                totalRecords : state.totalRecords,","                recordOffset : state.recordOffset","            };","","            // calculate recordOffset from page if recordOffset not specified.","            // not using Y.Lang.isNumber for support of numeric strings","            if (state.page && state.recordOffset === undefined) {","                state.recordOffset = (state.page - 1) *","                    (state.rowsPerPage || this.get('rowsPerPage'));","            }","","            this._batch = true;","            this._pageChanged = false;","","            for (var k in state) {","                if (state.hasOwnProperty(k)) {","                    this.set(k,state[k]);","                }","            }","","            this._batch = false;","            ","            if (this._pageChanged) {","                this._pageChanged = false;","","                this._firePageChange(this.getState(this._state));","            }","        }","    },","","    /**","     * Sets recordOffset to the starting index of the previous page when","     * totalRecords is reduced below the current recordOffset.","     * @method _syncRecordOffset","     * @param e {Event} totalRecordsChange event","     * @protected","     */","    _syncRecordOffset : function (e) {","        var v = e.newValue,rpp,state;","        if (e.prevValue !== v) {","            if (v !== Paginator.VALUE_UNLIMITED) {","                rpp = this.get('rowsPerPage');","","                if (rpp && this.get('recordOffset') >= v) {","                    state = this.getState({","                        totalRecords : e.prevValue,","                        recordOffset : this.get('recordOffset')","                    });","","                    this.set('recordOffset', state.before.recordOffset);","                    this._firePageChange(state);","                }","            }","        }","    },","","    /**","     * Fires the pageChange event when the state attributes have changed in","     * such a way as to locate the current recordOffset on a new page.","     * @method _handleStateChange","     * @param e {Event} the attribute change event","     * @protected","     */","    _handleStateChange : function (e) {","        if (e.prevValue !== e.newValue) {","            var change = this._state || {},","                state;","","            change[e.type.replace(/Change$/,'')] = e.prevValue;","            state = this.getState(change);","","            if (state.page !== state.before.page) {","                if (this._batch) {","                    this._pageChanged = true;","                } else {","                    this._firePageChange(state);","                }","            }","        }","    },","","    /**","     * Fires a pageChange event in the form of a standard attribute change","     * event with additional properties prevState and newState.","     * @method _firePageChange","     * @param state {Object} the result of getState(oldState)","     * @protected","     */","    _firePageChange : function (state) {","        if (Y.Lang.isObject(state)) {","            var current = state.before;","            delete state.before;","            this.fire('pageChange',{","                type      : 'pageChange',","                prevValue : state.page,","                newValue  : current.page,","                prevState : state,","                newState  : current","            });","        }","    }","});","","Y.Paginator = Paginator;","/*","Copyright (c) 2009, Yahoo! Inc. All rights reserved.","Code licensed under the BSD License:","http://developer.yahoo.net/yui/license.txt","*/","","/**"," * @module gallery-paginator"," */","","/**"," * Generates an input field for setting the current page."," *"," * @class Paginator.ui.CurrentPageInput"," * @constructor"," * @param p {Pagintor} Paginator instance to attach to"," */","Paginator.ui.CurrentPageInput = function(","	/* Paginator */	p)","{","	this.paginator = p;","","	p.on('destroy',               this.destroy, this);","	p.after('recordOffsetChange', this.update,  this);","	p.after('rowsPerPageChange',  this.update,  this);","	p.after('totalRecordsChange', this.update,  this);","	p.after('disabledChange',     this.update,  this);","","	p.after('pageInputClassChange', this.update, this);","};","","/**"," * CSS class assigned to the span"," * @attribute pageInputClass"," * @default 'yui-paginator-page-input'"," */","Paginator.ATTRS.pageInputClass =","{","	value : Y.ClassNameManager.getClassName(Paginator.NAME, 'page-input'),","	validator : Y.Lang.isString","};","","/**"," * Used as innerHTML for the span."," * @attribute pageInputTemplate"," * @default '{currentPage} of {totalPages}'"," */","Paginator.ATTRS.pageInputTemplate =","{","	value : '{currentPage} of {totalPages}',","	validator : Y.Lang.isString","};","","Paginator.ui.CurrentPageInput.prototype =","{","	/**","	 * Removes the span node and clears event listeners.","	 * @method destroy","	 * @private","	 */","	destroy: function()","	{","		this.span.remove().destroy(true);","		this.span       = null;","		this.input      = null;","		this.page_count = null;","	},","","	/**","	 * Generate the nodes and return the appropriate node given the current","	 * pagination state.","	 * @method render","	 * @param id_base {string} used to create unique ids for generated nodes","	 * @return {HTMLElement}","	 */","	render: function(","		id_base)","	{","		if (this.span) {","			this.span.remove().destroy(true);","		}","","		this.span = Y.Node.create(","			'<span id=\"'+id_base+'-page-input\">' +","			Y.substitute(this.paginator.get('pageInputTemplate'),","			{","				currentPage: '<input class=\"yui-page-input\"></input>',","				totalPages:  '<span class=\"yui-page-count\"></span>'","			}) +","			'</span>');","		this.span.set('className', this.paginator.get('pageInputClass'));","","		this.input = this.span.one('input');","		this.input.on('change', this._onChange, this);","		this.input.on('key', this._onReturnKey, 'down:13', this);","","		this.page_count = this.span.one('span.yui-page-count');","","		this.update();","","		return this.span;","	},","","	/**","	 * Swap the link and span nodes if appropriate.","	 * @method update","	 * @param e {CustomEvent} The calling change event","	 */","	update: function(","		/* CustomEvent */ e)","	{","		if (e && e.prevVal === e.newVal)","		{","			return;","		}","","		this.span.set('className', this.paginator.get('pageInputClass'));","		this.input.set('value', this.paginator.getCurrentPage());","		this.input.set('disabled', this.paginator.get('disabled'));","		this.page_count.set('innerHTML', this.paginator.getTotalPages());","	},","","	_onChange: function(e)","	{","		this.paginator.setPage(parseInt(this.input.get('value'), 10));","	},","","	_onReturnKey: function(e)","	{","		e.halt(true);","		this.paginator.setPage(parseInt(this.input.get('value'), 10));","	}","};","/*","Copyright (c) 2009, Yahoo! Inc. All rights reserved.","Code licensed under the BSD License:","http://developer.yahoo.net/yui/license.txt","*/","","/**"," * @module gallery-paginator"," */","","/**"," * ui Component to generate the textual report of current pagination status."," * E.g. \"Now viewing page 1 of 13\"."," *"," * @class Paginator.ui.CurrentPageReport"," * @constructor"," * @param p {Pagintor} Paginator instance to attach to"," */","Paginator.ui.CurrentPageReport = function (p) {","    this.paginator = p;","","    p.on('destroy',this.destroy,this);","    p.after('recordOffsetChange', this.update,this);","    p.after('rowsPerPageChange', this.update,this);","    p.after('totalRecordsChange',this.update,this);","","    p.after('pageReportClassChange', this.update,this);","    p.after('pageReportTemplateChange', this.update,this);","};","","/**"," * CSS class assigned to the span containing the info."," * @attribute pageReportClass"," * @default 'yui-paginator-current'"," */","Paginator.ATTRS.pageReportClass =","{","    value : Y.ClassNameManager.getClassName(Paginator.NAME, 'current'),","    validator : Y.Lang.isString","};","","/**"," * Used as innerHTML for the span.  Place holders in the form of {name}"," * will be replaced with the so named value from the key:value map"," * generated by the function held in the pageReportValueGenerator attribute."," * @attribute pageReportTemplate"," * @default '({currentPage} of {totalPages})'"," * @see pageReportValueGenerator attribute"," */","Paginator.ATTRS.pageReportTemplate =","{","    value : '({currentPage} of {totalPages})',","    validator : Y.Lang.isString","};","","/**"," * Function to generate the value map used to populate the"," * pageReportTemplate.  The function is passed the Paginator instance as a"," * parameter.  The default function returns a map with the following keys:"," * <ul>"," * <li>currentPage</li>"," * <li>totalPages</li>"," * <li>startIndex</li>"," * <li>endIndex</li>"," * <li>startRecord</li>"," * <li>endRecord</li>"," * <li>totalRecords</li>"," * </ul>"," * @attribute pageReportValueGenarator"," */","Paginator.ATTRS.pageReportValueGenerator =","{","    value : function (paginator) {","        var curPage = paginator.getCurrentPage(),","            records = paginator.getPageRecords();","","        return {","            'currentPage' : records ? curPage : 0,","            'totalPages'  : paginator.getTotalPages(),","            'startIndex'  : records ? records[0] : 0,","            'endIndex'    : records ? records[1] : 0,","            'startRecord' : records ? records[0] + 1 : 0,","            'endRecord'   : records ? records[1] + 1 : 0,","            'totalRecords': paginator.get('totalRecords')","        };","    },","    validator : Y.Lang.isFunction","};","","/**"," * Replace place holders in a string with the named values found in an"," * object literal."," * @static"," * @method sprintf"," * @param template {string} The content string containing place holders"," * @param values {object} The key:value pairs used to replace the place holders"," * @return {string}"," */","Paginator.ui.CurrentPageReport.sprintf = function (template, values) {","    return template.replace(/\\{([\\w\\s\\-]+)\\}/g, function (x,key) {","            return (key in values) ? values[key] : '';","        });","};","","Paginator.ui.CurrentPageReport.prototype = {","","    /**","     * Span node containing the formatted info","     * @property span","     * @type HTMLElement","     * @private","     */","    span : null,","","","    /**","     * Removes the link/span node and clears event listeners","     * removal.","     * @method destroy","     * @private","     */","    destroy : function () {","        this.span.remove(true);","        this.span = null;","    },","","    /**","     * Generate the span containing info formatted per the pageReportTemplate","     * attribute.","     * @method render","     * @param id_base {string} used to create unique ids for generated nodes","     * @return {HTMLElement}","     */","    render : function (id_base) {","        if (this.span) {","            this.span.remove(true);","        }","","        this.span = Y.Node.create(","            '<span id=\"'+id_base+'-page-report\"></span>');","        this.span.set('className', this.paginator.get('pageReportClass'));","        this.update();","","        return this.span;","    },","    ","    /**","     * Regenerate the content of the span if appropriate. Calls","     * CurrentPageReport.sprintf with the value of the pageReportTemplate","     * attribute and the value map returned from pageReportValueGenerator","     * function.","     * @method update","     * @param e {CustomEvent} The calling change event","     */","    update : function (e) {","        if (e && e.prevVal === e.newVal) {","            return;","        }","","        this.span.set('className', this.paginator.get('pageReportClass'));","        this.span.set('innerHTML', Paginator.ui.CurrentPageReport.sprintf(","            this.paginator.get('pageReportTemplate'),","            this.paginator.get('pageReportValueGenerator')(this.paginator)));","    }","};","/*","Copyright (c) 2009, Yahoo! Inc. All rights reserved.","Code licensed under the BSD License:","http://developer.yahoo.net/yui/license.txt","*/","","/**"," * @module gallery-paginator"," */","","/**"," * ui Component to generate the link to jump to the first page."," *"," * @class Paginator.ui.FirstPageLink"," * @constructor"," * @param p {Pagintor} Paginator instance to attach to"," */","Paginator.ui.FirstPageLink = function (p) {","    this.paginator = p;","","    p.on('destroy',this.destroy,this);","    p.after('recordOffsetChange',this.update,this);","    p.after('rowsPerPageChange',this.update,this);","    p.after('totalRecordsChange',this.update,this);","    p.after('disabledChange',this.update,this);","","    p.after('firstPageLinkLabelChange',this.rebuild,this);","    p.after('firstPageLinkClassChange',this.rebuild,this);","};","","/**"," * Used as innerHTML for the first page link/span."," * @attribute firstPageLinkLabel"," * @default '&lt;&lt; first'"," */","Paginator.ATTRS.firstPageLinkLabel =","{","    value : '&lt;&lt; first',","    validator : Y.Lang.isString","};","","/**"," * CSS class assigned to the link/span"," * @attribute firstPageLinkClass"," * @default 'yui-paginator-first'"," */","Paginator.ATTRS.firstPageLinkClass =","{","    value : Y.ClassNameManager.getClassName(Paginator.NAME, 'first'),","    validator : Y.Lang.isString","};","","// Instance members and methods","Paginator.ui.FirstPageLink.prototype = {","","    /**","     * The currently placed HTMLElement node","     * @property current","     * @type HTMLElement","     * @private","     */","    current   : null,","","    /**","     * Link node","     * @property link","     * @type HTMLElement","     * @private","     */","    link      : null,","","    /**","     * Span node (inactive link)","     * @property span","     * @type HTMLElement","     * @private","     */","    span      : null,","","","    /**","     * Removes the link/span node and clears event listeners.","     * @method destroy","     * @private","     */","    destroy : function () {","        this.link.remove(true);","        this.span.remove(true);","        this.current = this.link = this.span = null;","    },","","    /**","     * Generate the nodes and return the appropriate node given the current","     * pagination state.","     * @method render","     * @param id_base {string} used to create unique ids for generated nodes","     * @return {HTMLElement}","     */","    render : function (id_base) {","        var p     = this.paginator,","            c     = p.get('firstPageLinkClass'),","            label = p.get('firstPageLinkLabel');","","        if (this.link) {","            this.link.remove(true);","            this.span.remove(true);","        }","","        this.link = Y.Node.create(","            '<a href=\"#\" id=\"'+id_base+'-first-link\">'+label+'</a>');","        this.link.set('className', c);","        this.link.on('click',this.onClick,this);","","        this.span = Y.Node.create(","            '<span id=\"'+id_base+'-first-span\">'+label+'</span>');","        this.span.set('className', c);","","        this.current = p.getCurrentPage() > 1 ? this.link : this.span;","        return this.current;","    },","","    /**","     * Swap the link and span nodes if appropriate.","     * @method update","     * @param e {CustomEvent} The calling change event","     */","    update : function (e) {","        if (e && e.prevVal === e.newVal) {","            return;","        }","","        var par = this.current ? this.current.get('parentNode') : null;","        if (this.paginator.getCurrentPage() > 1 && !this.paginator.get('disabled')) {","            if (par && this.current === this.span) {","                par.replaceChild(this.link,this.current);","                this.current = this.link;","            }","        } else {","            if (par && this.current === this.link) {","                par.replaceChild(this.span,this.current);","                this.current = this.span;","            }","        }","    },","","    /**","     * Rebuild the markup.","     * @method rebuild","     * @param e {CustomEvent} The calling change event","     */","    rebuild : function (e) {","        if (e && e.prevVal === e.newVal) {","            return;","        }","","        var p     = this.paginator,","            c     = p.get('firstPageLinkClass'),","            label = p.get('firstPageLinkLabel');","","        this.link.set('className', c);","        this.link.set('innerHTML', label);","","        this.span.set('className', c);","        this.span.set('innerHTML', label);","    },","","    /**","     * Listener for the link's onclick event.  Pass new value to setPage method.","     * @method onClick","     * @param e {DOMEvent} The click event","     */","    onClick : function (e) {","        e.halt();","        this.paginator.setPage(1);","    }","};","/*","Copyright (c) 2009, Yahoo! Inc. All rights reserved.","Code licensed under the BSD License:","http://developer.yahoo.net/yui/license.txt","*/","","/**"," * @module gallery-paginator"," */","","/**"," * ui Component to display a menu for selecting the range of items to display."," *"," * @class Paginator.ui.ItemRangeDropdown"," * @constructor"," * @param p {Pagintor} Paginator instance to attach to"," */","Paginator.ui.ItemRangeDropdown = function(","	/* Paginator */	p)","{","	this.paginator = p;","","	p.on('destroy',               this.destroy, this);","	p.after('recordOffsetChange', this.update,  this);","	p.after('rowsPerPageChange',  this.update,  this);","	p.after('totalRecordsChange', this.update,  this);","	p.after('disabledChange',     this.update,  this);","","	p.after('itemRangeDropdownClassChange', this.update, this);","};","","/**"," * CSS class assigned to the span"," * @attribute itemRangeDropdownClass"," * @default 'yui-paginator-ir-dropdown'"," */","Paginator.ATTRS.itemRangeDropdownClass =","{","	value : Y.ClassNameManager.getClassName(Paginator.NAME, 'ir-dropdown'),","	validator : Y.Lang.isString","};","","/**"," * Used as innerHTML for the span."," * @attribute itemRangeDropdownTemplate"," * @default '{currentRange} of {totalItems}'"," */","Paginator.ATTRS.itemRangeDropdownTemplate =","{","	value : '{currentRange} of {totalItems}',","	validator : Y.Lang.isString","};","","Paginator.ui.ItemRangeDropdown.prototype =","{","	/**","	 * Removes the link/span node and clears event listeners.","	 * @method destroy","	 * @private","	 */","	destroy: function()","	{","		this.span.remove().destroy(true);","		this.span       = null;","		this.menu       = null;","		this.page_count = null;","	},","","	/**","	 * Generate the nodes and return the appropriate node given the current","	 * pagination state.","	 * @method render","	 * @param id_base {string} used to create unique ids for generated nodes","	 * @return {HTMLElement}","	 */","	render: function(","		id_base)","	{","		if (this.span) {","			this.span.remove().destroy(true);","		}","","		this.span = Y.Node.create(","			'<span id=\"'+id_base+'-item-range\">' +","			Y.substitute(this.paginator.get('itemRangeDropdownTemplate'),","			{","				currentRange: '<select class=\"yui-current-item-range\"></select>',","				totalItems:   '<span class=\"yui-item-count\"></span>'","			}) +","			'</span>');","		this.span.set('className', this.paginator.get('itemRangeDropdownClass'));","","		this.menu = this.span.one('select');","		this.menu.on('change', this._onChange, this);","","		this.page_count = this.span.one('span.yui-item-count');","","		this.prev_page_count = -1;","		this.prev_page_size  = -1;","		this.prev_rec_count  = -1;","		this.update();","","		return this.span;","	},","","	/**","	 * Swap the link and span nodes if appropriate.","	 * @method update","	 * @param e {CustomEvent} The calling change event","	 */","	update: function(","		/* CustomEvent */ e)","	{","		if (e && e.prevVal === e.newVal)","		{","			return;","		}","","		var page    = this.paginator.getCurrentPage();","		var count   = this.paginator.getTotalPages();","		var size    = this.paginator.getRowsPerPage();","		var recs    = this.paginator.getTotalRecords();","","		if (count != this.prev_page_count ||","			size  != this.prev_page_size  ||","			recs  != this.prev_rec_count)","		{","			var options    = Y.Node.getDOMNode(this.menu).options;","			options.length = 0;","","			for (var i=1; i<=count; i++)","			{","				var range = this.paginator.getPageRecords(i);","","				options[i-1] = new Option((range[0]+1) + ' - ' + (range[1]+1), i);","			}","","			this.page_count.set('innerHTML', recs);","","			this.prev_page_count = count;","			this.prev_page_size  = size;","			this.prev_rec_count  = recs;","		}","","		this.span.set('className', this.paginator.get('itemRangeDropdownClass'));","		this.menu.set('selectedIndex', page-1);","		this.menu.set('disabled', this.paginator.get('disabled'));","	},","","	_onChange: function(e)","	{","		this.paginator.setPage(parseInt(this.menu.get('value'), 10));","	}","};","/*","Copyright (c) 2009, Yahoo! Inc. All rights reserved.","Code licensed under the BSD License:","http://developer.yahoo.net/yui/license.txt","*/","","/**"," * @module gallery-paginator"," */","","/**"," * ui Component to generate the link to jump to the last page."," *"," * @class Paginator.ui.LastPageLink"," * @constructor"," * @param p {Pagintor} Paginator instance to attach to"," */","Paginator.ui.LastPageLink = function (p) {","    this.paginator = p;","","    p.on('destroy',this.destroy,this);","    p.after('recordOffsetChange',this.update,this);","    p.after('rowsPerPageChange',this.update,this);","    p.after('totalRecordsChange',this.update,this);","    p.after('disabledChange',this.update,this);","","    p.after('lastPageLinkClassChange', this.rebuild, this);","    p.after('lastPageLinkLabelChange', this.rebuild, this);","};","","/**","  * CSS class assigned to the link/span","  * @attribute lastPageLinkClass","  * @default 'yui-paginator-last'","  */","Paginator.ATTRS.lastPageLinkClass =","{","     value : Y.ClassNameManager.getClassName(Paginator.NAME, 'last'),","     validator : Y.Lang.isString","};","","/**"," * Used as innerHTML for the last page link/span."," * @attribute lastPageLinkLabel"," * @default 'last &gt;&gt;'"," */","Paginator.ATTRS.lastPageLinkLabel =","{","    value : 'last &gt;&gt;',","    validator : Y.Lang.isString","};","","Paginator.ui.LastPageLink.prototype = {","","    /**","     * Currently placed HTMLElement node","     * @property current","     * @type HTMLElement","     * @private","     */","    current   : null,","","    /**","     * Link HTMLElement node","     * @property link","     * @type HTMLElement","     * @private","     */","    link      : null,","","    /**","     * Span node (inactive link)","     * @property span","     * @type HTMLElement","     * @private","     */","    span      : null,","","    /**","     * Empty place holder node for when the last page link is inappropriate to","     * display in any form (unlimited paging).","     * @property na","     * @type HTMLElement","     * @private","     */","    na        : null,","","","    /**","     * Removes the link/span node and clears event listeners","     * @method destroy","     * @private","     */","    destroy : function () {","        this.link.remove(true);","        this.span.remove(true);","        this.na.remove(true);","        this.current = this.link = this.span = this.na = null;","    },","","    /**","     * Generate the nodes and return the appropriate node given the current","     * pagination state.","     * @method render","     * @param id_base {string} used to create unique ids for generated nodes","     * @return {HTMLElement}","     */","    render : function (id_base) {","        var p     = this.paginator,","            c     = p.get('lastPageLinkClass'),","            label = p.get('lastPageLinkLabel'),","            last  = p.getTotalPages();","","        if (this.link) {","            this.link.remove(true);","            this.span.remove(true);","            this.na.remove(true);","        }","","        this.link = Y.Node.create(","            '<a href=\"#\" id=\"'+id_base+'-last-link\">'+label+'</a>');","        this.link.set('className', c);","        this.link.on('click',this.onClick,this);","","        this.span = Y.Node.create(","            '<span id=\"'+id_base+'-last-span\">'+label+'</span>');","        this.span.set('className', c);","","        this.na = Y.Node.create(","            '<span id=\"'+id_base+'-last-na\"></span>');","","        switch (last) {","            case Paginator.VALUE_UNLIMITED :","                this.current = this.na;","                break;","","            case p.getCurrentPage() :","                this.current = this.span;","                break;","","            default :","                this.current = this.link;","        }","","        return this.current;","    },","","    /**","     * Swap the link, span, and na nodes if appropriate.","     * @method update","     * @param e {CustomEvent} The calling change event (ignored)","     */","    update : function (e) {","        if (e && e.prevVal === e.newVal) {","            return;","        }","","        var par   = this.current ? this.current.get('parentNode') : null,","            after = this.link,","            total = this.paginator.getTotalPages();","","        if (par) {","            if (total === Paginator.VALUE_UNLIMITED) {","                after = this.na;","            } else if (total === this.paginator.getCurrentPage() ||","                        this.paginator.get('disabled')) {","                after = this.span;","            }","","            if (this.current !== after) {","                par.replaceChild(after,this.current);","                this.current = after;","            }","        }","    },","","    /**","     * Rebuild the markup.","     * @method rebuild","     * @param e {CustomEvent} The calling change event (ignored)","     */","    rebuild : function (e) {","        if (e && e.prevVal === e.newVal) {","            return;","        }","","        var p     = this.paginator,","            c     = p.get('lastPageLinkClass'),","            label = p.get('lastPageLinkLabel');","","        this.link.set('className', c);","        this.link.set('innerHTML', label);","","        this.span.set('className', c);","        this.span.set('innerHTML', label);","    },","","    /**","     * Listener for the link's onclick event.  Passes to setPage method.","     * @method onClick","     * @param e {DOMEvent} The click event","     */","    onClick : function (e) {","        e.halt();","        this.paginator.setPage(this.paginator.getTotalPages());","    }","};","/*","Copyright (c) 2009, Yahoo! Inc. All rights reserved.","Code licensed under the BSD License:","http://developer.yahoo.net/yui/license.txt","*/","","/**"," * @module gallery-paginator"," */","","/**"," * ui Component to generate the link to jump to the next page."," *"," * @class Paginator.ui.NextPageLink"," * @constructor"," * @param p {Pagintor} Paginator instance to attach to"," */","Paginator.ui.NextPageLink = function (p) {","    this.paginator = p;","","    p.on('destroy',this.destroy,this);","    p.after('recordOffsetChange', this.update,this);","    p.after('rowsPerPageChange', this.update,this);","    p.after('totalRecordsChange', this.update,this);","    p.after('disabledChange', this.update,this);","","    p.after('nextPageLinkClassChange', this.rebuild, this);","    p.after('nextPageLinkLabelChange', this.rebuild, this);","};","","/**"," * CSS class assigned to the link/span"," * @attribute nextPageLinkClass"," * @default 'yui-paginator-next'"," */","Paginator.ATTRS.nextPageLinkClass =","{","    value : Y.ClassNameManager.getClassName(Paginator.NAME, 'next'),","    validator : Y.Lang.isString","};","","/**"," * Used as innerHTML for the next page link/span."," * @attribute nextPageLinkLabel"," * @default 'next &gt;'"," */","Paginator.ATTRS.nextPageLinkLabel =","{","    value : 'next &gt;',","    validator : Y.Lang.isString","};","","Paginator.ui.NextPageLink.prototype = {","","    /**","     * Currently placed HTMLElement node","     * @property current","     * @type HTMLElement","     * @private","     */","    current   : null,","","    /**","     * Link node","     * @property link","     * @type HTMLElement","     * @private","     */","    link      : null,","","    /**","     * Span node (inactive link)","     * @property span","     * @type HTMLElement","     * @private","     */","    span      : null,","","","    /**","     * Removes the link/span node and clears event listeners","     * @method destroy","     * @private","     */","    destroy : function () {","        this.link.remove(true);","        this.span.remove(true);","        this.current = this.link = this.span = null;","    },","","    /**","     * Generate the nodes and return the appropriate node given the current","     * pagination state.","     * @method render","     * @param id_base {string} used to create unique ids for generated nodes","     * @return {HTMLElement}","     */","    render : function (id_base) {","        var p     = this.paginator,","            c     = p.get('nextPageLinkClass'),","            label = p.get('nextPageLinkLabel'),","            last  = p.getTotalPages();","","        if (this.link) {","            this.link.remove(true);","            this.span.remove(true);","        }","","        this.link = Y.Node.create(","            '<a href=\"#\" id=\"'+id_base+'-next-link\">'+label+'</a>');","        this.link.set('className', c);","        this.link.on('click',this.onClick,this);","","        this.span = Y.Node.create(","            '<span id=\"'+id_base+'-next-span\">'+label+'</span>');","        this.span.set('className', c);","","        this.current = p.getCurrentPage() === last ? this.span : this.link;","","        return this.current;","    },","","    /**","     * Swap the link and span nodes if appropriate.","     * @method update","     * @param e {CustomEvent} The calling change event","     */","    update : function (e) {","        if (e && e.prevVal === e.newVal) {","            return;","        }","","        var last = this.paginator.getTotalPages(),","            par  = this.current ? this.current.get('parentNode') : null;","","        if (this.paginator.getCurrentPage() !== last && !this.paginator.get('disabled')) {","            if (par && this.current === this.span) {","                par.replaceChild(this.link,this.current);","                this.current = this.link;","            }","        } else if (this.current === this.link) {","            if (par) {","                par.replaceChild(this.span,this.current);","                this.current = this.span;","            }","        }","    },","","    /**","     * Rebuild the markup.","     * @method rebuild","     * @param e {CustomEvent} The calling change event","     */","    rebuild : function (e) {","        if (e && e.prevVal === e.newVal) {","            return;","        }","","        var p     = this.paginator,","            c     = p.get('nextPageLinkClass'),","            label = p.get('nextPageLinkLabel');","","        this.link.set('className', c);","        this.link.set('innerHTML', label);","","        this.span.set('className', c);","        this.span.set('innerHTML', label);","    },","","    /**","     * Listener for the link's onclick event.  Passes to setPage method.","     * @method onClick","     * @param e {DOMEvent} The click event","     */","    onClick : function (e) {","        e.halt();","        this.paginator.setPage(this.paginator.getNextPage());","    }","};","/*","Copyright (c) 2009, Yahoo! Inc. All rights reserved.","Code licensed under the BSD License:","http://developer.yahoo.net/yui/license.txt","*/","","/**"," * @module gallery-paginator"," */","","/**"," * ui Component to generate the page links"," *"," * @class Paginator.ui.PageLinks"," * @constructor"," * @param p {Pagintor} Paginator instance to attach to"," */","Paginator.ui.PageLinks = function (p) {","    this.paginator = p;","","    p.on('destroy',this.destroy,this);","    p.after('recordOffsetChange',this.update,this);","    p.after('rowsPerPageChange',this.update,this);","    p.after('totalRecordsChange',this.update,this);","    p.after('disabledChange',this.update,this);","","    p.after('pageLinksContainerClassChange', this.rebuild,this);","    p.after('pageLinkClassChange', this.rebuild,this);","    p.after('currentPageClassChange', this.rebuild,this);","    p.after('pageLinksChange', this.rebuild,this);","};","","/**"," * CSS class assigned to the span containing the page links."," * @attribute pageLinksContainerClass"," * @default 'yui-paginator-pages'"," */","Paginator.ATTRS.pageLinksContainerClass =","{","    value : Y.ClassNameManager.getClassName(Paginator.NAME, 'pages'),","    validator : Y.Lang.isString","};","","/**"," * CSS class assigned to each page link/span."," * @attribute pageLinkClass"," * @default 'yui-paginator-page'"," */","Paginator.ATTRS.pageLinkClass =","{","    value : Y.ClassNameManager.getClassName(Paginator.NAME, 'page'),","    validator : Y.Lang.isString","};","","/**"," * CSS class assigned to the current page span."," * @attribute currentPageClass"," * @default 'yui-paginator-current-page'"," */","Paginator.ATTRS.currentPageClass =","{","    value : Y.ClassNameManager.getClassName(Paginator.NAME, 'current-page'),","    validator : Y.Lang.isString","};","","/**"," * Maximum number of page links to display at one time."," * @attribute pageLinks"," * @default 10"," */","Paginator.ATTRS.pageLinks =","{","    value : 10,","    validator : Paginator.isNumeric","};","","/**"," * Function used generate the innerHTML for each page link/span.  The"," * function receives as parameters the page number and a reference to the"," * paginator object."," * @attribute pageLabelBuilder"," * @default function (page, paginator) { return page; }"," */","Paginator.ATTRS.pageLabelBuilder =","{","    value : function (page, paginator) { return page; },","    validator : Y.Lang.isFunction","};","","/**"," * Calculates start and end page numbers given a current page, attempting"," * to keep the current page in the middle"," * @static"," * @method calculateRange"," * @param {int} currentPage  The current page"," * @param {int} [totalPages] Maximum number of pages"," * @param {int} [numPages]   Preferred number of pages in range"," * @return {Array} [start_page_number, end_page_number]"," */","Paginator.ui.PageLinks.calculateRange = function (currentPage,totalPages,numPages) {","    var UNLIMITED = Paginator.VALUE_UNLIMITED,","        start, end, delta;","","    // Either has no pages, or unlimited pages.  Show none.","    if (!currentPage || numPages === 0 || totalPages === 0 ||","        (totalPages === UNLIMITED && numPages === UNLIMITED)) {","        return [0,-1];","    }","","    // Limit requested pageLinks if there are fewer totalPages","    if (totalPages !== UNLIMITED) {","        numPages = numPages === UNLIMITED ?","                    totalPages :","                    Math.min(numPages,totalPages);","    }","","    // Determine start and end, trying to keep current in the middle","    start = Math.max(1,Math.ceil(currentPage - (numPages/2)));","    if (totalPages === UNLIMITED) {","        end = start + numPages - 1;","    } else {","        end = Math.min(totalPages, start + numPages - 1);","    }","","    // Adjust the start index when approaching the last page","    delta = numPages - (end - start + 1);","    start = Math.max(1, start - delta);","","    return [start,end];","};","","","Paginator.ui.PageLinks.prototype = {","","    /**","     * Current page","     * @property current","     * @type number","     * @private","     */","    current     : 0,","","    /**","     * Span node containing the page links","     * @property container","     * @type HTMLElement","     * @private","     */","    container   : null,","","","    /**","     * Removes the page links container node and clears event listeners","     * @method destroy","     * @private","     */","    destroy : function () {","        this.container.remove(true);","        this.container = null;","    },","","    /**","     * Generate the nodes and return the container node containing page links","     * appropriate to the current pagination state.","     * @method render","     * @param id_base {string} used to create unique ids for generated nodes","     * @return {HTMLElement}","     */","    render : function (id_base) {","","        if (this.container) {","            this.container.remove(true);","        }","","        // Set up container","        this.container = Y.Node.create(","            '<span id=\"'+id_base+'-pages\"></span>');","        this.container.on('click',this.onClick,this);","","        // Call update, flagging a need to rebuild","        this.update({newVal : null, rebuild : true});","","        return this.container;","    },","","    /**","     * Update the links if appropriate","     * @method update","     * @param e {CustomEvent} The calling change event","     */","    update : function (e) {","        if (e && e.prevVal === e.newVal) {","            return;","        }","","        var p           = this.paginator,","            currentPage = p.getCurrentPage();","","        // Replace content if there's been a change","        if (this.current !== currentPage || !currentPage || e.rebuild) {","            var labelBuilder = p.get('pageLabelBuilder'),","                range        = Paginator.ui.PageLinks.calculateRange(","                                currentPage,","                                p.getTotalPages(),","                                p.get('pageLinks')),","                start        = range[0],","                end          = range[1],","                content      = '',","                disabled     = p.get('disabled'),","                i;","","            for (i = start; i <= end; ++i) {","                if (i === currentPage) {","                    content +=","                        '<span class=\"' + p.get('currentPageClass') + ' ' +","                                          p.get('pageLinkClass') + '\">' +","                        labelBuilder(i,p) + '</span>';","                } else if (disabled) {","                    content +=","                        '<span class=\"' + p.get('pageLinkClass') +","                           ' disabled\" page=\"' + i + '\">' + labelBuilder(i,p) + '</span>';","                } else {","                    content +=","                        '<a href=\"#\" class=\"' + p.get('pageLinkClass') +","                           '\" page=\"' + i + '\">' + labelBuilder(i,p) + '</a>';","                }","            }","","            this.container.set('className', p.get('pageLinksContainerClass'));","            this.container.set('innerHTML', content);","        }","    },","","    /**","     * Force a rebuild of the page links.","     * @method rebuild","     * @param e {CustomEvent} The calling change event","     */","    rebuild     : function (e) {","        e.rebuild = true;","        this.update(e);","    },","","    /**","     * Listener for the container's onclick event.  Looks for qualifying link","     * clicks, and pulls the page number from the link's page attribute.","     * Sends link's page attribute to the Paginator's setPage method.","     * @method onClick","     * @param e {DOMEvent} The click event","     */","    onClick : function (e) {","        var t = e.target;","        if (t && t.hasClass(this.paginator.get('pageLinkClass'))) {","","            e.halt();","","            this.paginator.setPage(parseInt(t.getAttribute('page'),10));","        }","    }","","};","/*","Copyright (c) 2009, Yahoo! Inc. All rights reserved.","Code licensed under the BSD License:","http://developer.yahoo.net/yui/license.txt","*/","","/**"," * @module gallery-paginator"," */","","/**"," * ui Component to generate the link to jump to the previous page."," *"," * @class Paginator.ui.PreviousPageLink"," * @constructor"," * @param p {Pagintor} Paginator instance to attach to"," */","Paginator.ui.PreviousPageLink = function (p) {","    this.paginator = p;","","    p.on('destroy',this.destroy,this);","    p.after('recordOffsetChange',this.update,this);","    p.after('rowsPerPageChange',this.update,this);","    p.after('totalRecordsChange',this.update,this);","    p.after('disabledChange',this.update,this);","","    p.after('previousPageLinkLabelChange',this.update,this);","    p.after('previousPageLinkClassChange',this.update,this);","};","","/**"," * CSS class assigned to the link/span"," * @attribute previousPageLinkClass"," * @default 'yui-paginator-previous'"," */","Paginator.ATTRS.previousPageLinkClass =","{","    value : Y.ClassNameManager.getClassName(Paginator.NAME, 'previous'),","    validator : Y.Lang.isString","};","","/**"," * Used as innerHTML for the previous page link/span."," * @attribute previousPageLinkLabel"," * @default '&lt; prev'"," */","Paginator.ATTRS.previousPageLinkLabel =","{","    value : '&lt; prev',","    validator : Y.Lang.isString","};","","Paginator.ui.PreviousPageLink.prototype = {","","    /**","     * Currently placed HTMLElement node","     * @property current","     * @type HTMLElement","     * @private","     */","    current   : null,","","    /**","     * Link node","     * @property link","     * @type HTMLElement","     * @private","     */","    link      : null,","","    /**","     * Span node (inactive link)","     * @property span","     * @type HTMLElement","     * @private","     */","    span      : null,","","","    /**","     * Removes the link/span node and clears event listeners","     * @method destroy","     * @private","     */","    destroy : function () {","        this.link.remove(true);","        this.span.remove(true);","        this.current = this.link = this.span = null;","    },","","    /**","     * Generate the nodes and return the appropriate node given the current","     * pagination state.","     * @method render","     * @param id_base {string} used to create unique ids for generated nodes","     * @return {HTMLElement}","     */","    render : function (id_base) {","        var p     = this.paginator,","            c     = p.get('previousPageLinkClass'),","            label = p.get('previousPageLinkLabel');","","        if (this.link) {","            this.link.remove(true);","            this.span.remove(true);","        }","","        this.link= Y.Node.create(","            '<a href=\"#\" id=\"'+id_base+'-prev-link\">'+label+'</a>');","        this.link.set('className', c);","        this.link.on('click',this.onClick,this);","","        this.span = Y.Node.create(","            '<span id=\"'+id_base+'-prev-span\">'+label+'</span>');","        this.span.set('className', c);","","        this.current = p.getCurrentPage() > 1 ? this.link : this.span;","        return this.current;","    },","","    /**","     * Swap the link and span nodes if appropriate.","     * @method update","     * @param e {CustomEvent} The calling change event","     */","    update : function (e) {","        if (e && e.prevVal === e.newVal) {","            return;","        }","","        var par = this.current ? this.current.get('parentNode') : null;","        if (this.paginator.getCurrentPage() > 1 && !this.paginator.get('disabled')) {","            if (par && this.current === this.span) {","                par.replaceChild(this.link,this.current);","                this.current = this.link;","            }","        } else {","            if (par && this.current === this.link) {","                par.replaceChild(this.span,this.current);","                this.current = this.span;","            }","        }","    },","","    /**","     * Listener for the link's onclick event.  Passes to setPage method.","     * @method onClick","     * @param e {DOMEvent} The click event","     */","    onClick : function (e) {","        e.halt();","        this.paginator.setPage(this.paginator.getPreviousPage());","    }","};","/*","Copyright (c) 2009, Yahoo! Inc. All rights reserved.","Code licensed under the BSD License:","http://developer.yahoo.net/yui/license.txt","*/","","/**"," * @module gallery-paginator"," */","","/**"," * ui Component to generate the rows-per-page dropdown"," *"," * @class Paginator.ui.RowsPerPageDropdown"," * @constructor"," * @param p {Pagintor} Paginator instance to attach to"," */","Paginator.ui.RowsPerPageDropdown = function (p) {","    this.paginator = p;","","    p.on('destroy',this.destroy,this);","    p.after('rowsPerPageChange',this.update,this);","    p.after('totalRecordsChange',this._handleTotalRecordsChange,this);","    p.after('disabledChange',this.update,this);","","    p.after('rowsPerPageDropdownClassChange',this.rebuild,this);","    p.after('rowsPerPageDropdownTitleChange',this.rebuild,this);","    p.after('rowsPerPageOptionsChange',this.rebuild,this);","};","","/**"," * CSS class assigned to the select node"," * @attribute rowsPerPageDropdownClass"," * @default 'yui-paginator-rpp-options'"," */","Paginator.ATTRS.rowsPerPageDropdownClass =","{","    value : Y.ClassNameManager.getClassName(Paginator.NAME, 'rpp-options'),","    validator : Y.Lang.isString","};","","/**"," * CSS class assigned to the select node"," * @attribute rowsPerPageDropdownTitle"," * @default 'Rows per page'"," */","Paginator.ATTRS.rowsPerPageDropdownTitle =","{","    value : 'Rows per page',","    validator : Y.Lang.isString","};","","/**"," * Array of available rows-per-page sizes.  Converted into select options."," * Array values may be positive integers or object literals in the form<br>"," * { value : NUMBER, text : STRING }"," * @attribute rowsPerPageOptions"," * @default []"," */","Paginator.ATTRS.rowsPerPageOptions =","{","    value : [],","    validator : Y.Lang.isArray","};","","Paginator.ui.RowsPerPageDropdown.prototype = {","","    /**","     * select node","     * @property select","     * @type HTMLElement","     * @private","     */","    select  : null,","","","    /**","     * option node for the optional All value","     *","     * @property all","     * @type HTMLElement","     * @protected","     */","    all : null,","","","    /**","     * Removes the select node and clears event listeners","     * @method destroy","     * @private","     */","    destroy : function () {","        this.select.remove().destroy(true);","        this.all = this.select = null;","    },","","    /**","     * Generate the select and option nodes and returns the select node.","     * @method render","     * @param id_base {string} used to create unique ids for generated nodes","     * @return {HTMLElement}","     */","    render : function (id_base) {","        if (this.select) {","            this.select.remove().destroy(true);","        }","","        this.select = Y.Node.create(","            '<select id=\"'+id_base+'-rpp\"></select>');","        this.select.on('change',this.onChange,this);","","        this.rebuild();","","        return this.select;","    },","","    /**","     * (Re)generate the select options.","     * @method rebuild","     */","    rebuild : function (e) {","        var p       = this.paginator,","            sel     = this.select,","            options = p.get('rowsPerPageOptions'),","            opts    = Y.Node.getDOMNode(sel).options,","            opt,cfg,val,i,len;","","        this.all = null;","","        sel.set('className', this.paginator.get('rowsPerPageDropdownClass'));","        sel.set('title', this.paginator.get('rowsPerPageDropdownTitle'));","","        for (i = 0, len = options.length; i < len; ++i) {","            cfg = options[i];","            opt = opts[i] || sel.appendChild(Y.Node.create('<option/>'));","            val = Y.Lang.isValue(cfg.value) ? cfg.value : cfg;","            opt.set('innerHTML', Y.Lang.isValue(cfg.text) ? cfg.text : cfg);","","            if (Y.Lang.isString(val) && val.toLowerCase() === 'all') {","                this.all  = opt;","                opt.set('value', p.get('totalRecords'));","            } else{","                opt.set('value', val);","            }","","        }","","        while (opts.length > options.length) {","            sel.get('lastChild').remove(true);","        }","","        this.update();","    },","","    /**","     * Select the appropriate option if changed.","     * @method update","     * @param e {CustomEvent} The calling change event","     */","    update : function (e) {","        if (e && e.prevVal === e.newVal) {","            return;","        }","","        var rpp     = this.paginator.get('rowsPerPage')+'',","            options = Y.Node.getDOMNode(this.select).options,","            i,len;","","        for (i = 0, len = options.length; i < len; ++i) {","            if (options[i].value === rpp) {","                options[i].selected = true;","                break;","            }","        }","","        this.select.set('disabled', this.paginator.get('disabled'));","    },","","    /**","     * Listener for the select's onchange event.  Sent to setRowsPerPage method.","     * @method onChange","     * @param e {DOMEvent} The change event","     */","    onChange : function (e) {","        this.paginator.setRowsPerPage(","            parseInt(Y.Node.getDOMNode(this.select).options[this.select.get('selectedIndex')].value,10));","    },","","    /**","     * Updates the all option value (and Paginator's rowsPerPage attribute if","     * necessary) in response to a change in the Paginator's totalRecords.","     *","     * @method _handleTotalRecordsChange","     * @param e {Event} attribute change event","     * @protected","     */","    _handleTotalRecordsChange : function (e) {","        if (!this.all || (e && e.prevVal === e.newVal)) {","            return;","        }","","        this.all.set('value', e.newVal);","        if (this.all.get('selected')) {","            this.paginator.set('rowsPerPage',e.newVal);","        }","    }","};","/**"," * @module gallery-paginator"," */","","/**********************************************************************"," * Adds per-page error notification to Paginator.ui.PageLinks."," *"," * @class Paginator.ui.ValidationPageLinks"," * @constructor"," * @param p {Pagintor} Paginator instance to attach to"," */","","Paginator.ui.ValidationPageLinks = function(","	/* Paginator */	p)","{","	Paginator.ui.ValidationPageLinks.superclass.constructor.call(this, p);","","	p.after('pageStatusChange', this.rebuild, this);","};","","var vpl_status_prefix = 'yui3-has';","","/**"," * Array of status strings for each page.  If the status value for a page"," * is not empty, it is used to build a CSS class for the page:"," * yui3-has&lt;status&gt;"," *"," * @attribute pageStatus"," */","Paginator.ATTRS.pageStatus =","{","	value:     [],","	validator: Y.Lang.isArray","};","","Y.extend(Paginator.ui.ValidationPageLinks, Paginator.ui.PageLinks,","{","	update: function(e)","	{","		if (e && e.prevVal === e.newVal)","		{","			return;","		}","","		var currentPage	= this.paginator.getCurrentPage();","","		var curr_markup = '<span class=\"{link} {curr} {status}\">{label}</span>';","		var link_markup = '<a href=\"#\" class=\"{link} {status}\" page=\"{page}\">{label}</a>';","		var dis_markup  = '<span class=\"{link} disabled {status}\" page=\"{page}\">{label}</span>';","","		if (this.current !== currentPage || !currentPage || e.rebuild)","		{","			var linkClass    = this.paginator.get('pageLinkClass'),","				status       = this.paginator.get('pageStatus'),","				labelBuilder = this.paginator.get('pageLabelBuilder'),","				disabled     = this.paginator.get('disabled');","","			var range =","				Paginator.ui.PageLinks.calculateRange(","					currentPage, this.paginator.getTotalPages(), this.paginator.get('pageLinks'));","","			var content = '';","			for (var i=range[0]; i<=range[1]; i++)","			{","				content += Y.Lang.sub(i === currentPage ? curr_markup : disabled ? dis_markup : link_markup,","				{","					link:   linkClass,","					curr:   (i === currentPage ? this.paginator.get('currentPageClass') : ''),","					status: status[i-1] ? vpl_status_prefix + status[i-1] : '',","					page:   i,","					label:  labelBuilder(i, this.paginator)","				});","			}","","			this.container.set('innerHTML', content);","		}","	}","","});","","","}, 'gallery-2012.09.26-20-36' ,{skinnable:true, requires:['widget','event-key','substitute']});"];
_yuitest_coverage["/build/gallery-paginator/gallery-paginator.js"].lines = {"1":0,"3":0,"31":0,"32":0,"37":0,"96":0,"108":0,"114":0,"150":0,"151":0,"152":0,"153":0,"157":0,"245":0,"278":0,"281":0,"284":0,"285":0,"286":0,"287":0,"288":0,"289":0,"290":0,"303":0,"304":0,"307":0,"308":0,"309":0,"312":0,"316":0,"323":0,"337":0,"338":0,"342":0,"344":0,"346":0,"350":0,"354":0,"356":0,"360":0,"362":0,"376":0,"382":0,"383":0,"384":0,"385":0,"397":0,"400":0,"401":0,"402":0,"403":0,"404":0,"406":0,"407":0,"408":0,"409":0,"410":0,"414":0,"416":0,"419":0,"420":0,"432":0,"436":0,"437":0,"440":0,"441":0,"444":0,"454":0,"455":0,"458":0,"460":0,"469":0,"470":0,"471":0,"473":0,"482":0,"485":0,"495":0,"504":0,"514":0,"524":0,"525":0,"528":0,"532":0,"533":0,"536":0,"537":0,"538":0,"539":0,"541":0,"543":0,"546":0,"556":0,"557":0,"558":0,"560":0,"571":0,"581":0,"583":0,"584":0,"586":0,"598":0,"608":0,"610":0,"611":0,"613":0,"625":0,"636":0,"638":0,"639":0,"641":0,"672":0,"676":0,"677":0,"678":0,"680":0,"681":0,"683":0,"686":0,"692":0,"696":0,"699":0,"700":0,"703":0,"713":0,"714":0,"717":0,"723":0,"727":0,"730":0,"734":0,"737":0,"740":0,"753":0,"755":0,"758":0,"767":0,"768":0,"772":0,"773":0,"775":0,"776":0,"777":0,"781":0,"783":0,"784":0,"786":0,"799":0,"800":0,"801":0,"802":0,"804":0,"805":0,"810":0,"811":0,"825":0,"826":0,"829":0,"830":0,"832":0,"833":0,"834":0,"836":0,"850":0,"851":0,"852":0,"853":0,"864":0,"882":0,"885":0,"887":0,"888":0,"889":0,"890":0,"891":0,"893":0,"901":0,"912":0,"918":0,"927":0,"928":0,"929":0,"930":0,"943":0,"944":0,"947":0,"955":0,"957":0,"958":0,"959":0,"961":0,"963":0,"965":0,"976":0,"978":0,"981":0,"982":0,"983":0,"984":0,"989":0,"994":0,"995":0,"1016":0,"1017":0,"1019":0,"1020":0,"1021":0,"1022":0,"1024":0,"1025":0,"1033":0,"1047":0,"1068":0,"1071":0,"1074":0,"1096":0,"1097":0,"1098":0,"1102":0,"1120":0,"1121":0,"1132":0,"1133":0,"1136":0,"1138":0,"1139":0,"1141":0,"1153":0,"1154":0,"1157":0,"1158":0,"1180":0,"1181":0,"1183":0,"1184":0,"1185":0,"1186":0,"1187":0,"1189":0,"1190":0,"1198":0,"1209":0,"1216":0,"1249":0,"1250":0,"1251":0,"1262":0,"1266":0,"1267":0,"1268":0,"1271":0,"1273":0,"1274":0,"1276":0,"1278":0,"1280":0,"1281":0,"1290":0,"1291":0,"1294":0,"1295":0,"1296":0,"1297":0,"1298":0,"1301":0,"1302":0,"1303":0,"1314":0,"1315":0,"1318":0,"1322":0,"1323":0,"1325":0,"1326":0,"1335":0,"1336":0,"1356":0,"1359":0,"1361":0,"1362":0,"1363":0,"1364":0,"1365":0,"1367":0,"1375":0,"1386":0,"1392":0,"1401":0,"1402":0,"1403":0,"1404":0,"1417":0,"1418":0,"1421":0,"1429":0,"1431":0,"1432":0,"1434":0,"1436":0,"1437":0,"1438":0,"1439":0,"1441":0,"1452":0,"1454":0,"1457":0,"1458":0,"1459":0,"1460":0,"1462":0,"1466":0,"1467":0,"1469":0,"1471":0,"1473":0,"1476":0,"1478":0,"1479":0,"1480":0,"1483":0,"1484":0,"1485":0,"1490":0,"1510":0,"1511":0,"1513":0,"1514":0,"1515":0,"1516":0,"1517":0,"1519":0,"1520":0,"1528":0,"1539":0,"1545":0,"1587":0,"1588":0,"1589":0,"1590":0,"1601":0,"1606":0,"1607":0,"1608":0,"1609":0,"1612":0,"1614":0,"1615":0,"1617":0,"1619":0,"1621":0,"1624":0,"1626":0,"1627":0,"1630":0,"1631":0,"1634":0,"1637":0,"1646":0,"1647":0,"1650":0,"1654":0,"1655":0,"1656":0,"1657":0,"1659":0,"1662":0,"1663":0,"1664":0,"1675":0,"1676":0,"1679":0,"1683":0,"1684":0,"1686":0,"1687":0,"1696":0,"1697":0,"1717":0,"1718":0,"1720":0,"1721":0,"1722":0,"1723":0,"1724":0,"1726":0,"1727":0,"1735":0,"1746":0,"1752":0,"1785":0,"1786":0,"1787":0,"1798":0,"1803":0,"1804":0,"1805":0,"1808":0,"1810":0,"1811":0,"1813":0,"1815":0,"1817":0,"1819":0,"1828":0,"1829":0,"1832":0,"1835":0,"1836":0,"1837":0,"1838":0,"1840":0,"1841":0,"1842":0,"1843":0,"1854":0,"1855":0,"1858":0,"1862":0,"1863":0,"1865":0,"1866":0,"1875":0,"1876":0,"1896":0,"1897":0,"1899":0,"1900":0,"1901":0,"1902":0,"1903":0,"1905":0,"1906":0,"1907":0,"1908":0,"1916":0,"1927":0,"1938":0,"1949":0,"1962":0,"1964":0,"1978":0,"1979":0,"1983":0,"1985":0,"1989":0,"1990":0,"1996":0,"1997":0,"1998":0,"2000":0,"2004":0,"2005":0,"2007":0,"2011":0,"2036":0,"2037":0,"2049":0,"2050":0,"2054":0,"2056":0,"2059":0,"2061":0,"2070":0,"2071":0,"2074":0,"2078":0,"2079":0,"2090":0,"2091":0,"2092":0,"2096":0,"2097":0,"2101":0,"2107":0,"2108":0,"2118":0,"2119":0,"2130":0,"2131":0,"2133":0,"2135":0,"2157":0,"2158":0,"2160":0,"2161":0,"2162":0,"2163":0,"2164":0,"2166":0,"2167":0,"2175":0,"2186":0,"2192":0,"2225":0,"2226":0,"2227":0,"2238":0,"2242":0,"2243":0,"2244":0,"2247":0,"2249":0,"2250":0,"2252":0,"2254":0,"2256":0,"2257":0,"2266":0,"2267":0,"2270":0,"2271":0,"2272":0,"2273":0,"2274":0,"2277":0,"2278":0,"2279":0,"2290":0,"2291":0,"2311":0,"2312":0,"2314":0,"2315":0,"2316":0,"2317":0,"2319":0,"2320":0,"2321":0,"2329":0,"2340":0,"2353":0,"2359":0,"2386":0,"2387":0,"2397":0,"2398":0,"2401":0,"2403":0,"2405":0,"2407":0,"2415":0,"2421":0,"2423":0,"2424":0,"2426":0,"2427":0,"2428":0,"2429":0,"2430":0,"2432":0,"2433":0,"2434":0,"2436":0,"2441":0,"2442":0,"2445":0,"2454":0,"2455":0,"2458":0,"2462":0,"2463":0,"2464":0,"2465":0,"2469":0,"2478":0,"2491":0,"2492":0,"2495":0,"2496":0,"2497":0,"2513":0,"2516":0,"2518":0,"2521":0,"2530":0,"2536":0,"2540":0,"2542":0,"2545":0,"2547":0,"2548":0,"2549":0,"2551":0,"2553":0,"2558":0,"2562":0,"2563":0,"2565":0,"2575":0};
_yuitest_coverage["/build/gallery-paginator/gallery-paginator.js"].functions = {"Paginator:31":0,"isNumeric:95":0,"toNumber:107":0,"validator:149":0,"initializer:277":0,"_selfSubscribe:301":0,"renderUI:315":0,"(anonymous 2):354":0,"_renderTemplate:336":0,"renderUIComponent:375":0,"updateVisibility:396":0,"getTotalPages:431":0,"hasPage:453":0,"getCurrentPage:468":0,"hasNextPage:481":0,"getNextPage:494":0,"hasPreviousPage:503":0,"getPreviousPage:513":0,"getPageRecords:523":0,"setPage:555":0,"getRowsPerPage:570":0,"setRowsPerPage:580":0,"getTotalRecords:597":0,"setTotalRecords:607":0,"getStartIndex:624":0,"setStartIndex:635":0,"normalizeOffset:676":0,"getState:671":0,"setState:752":0,"_syncRecordOffset:798":0,"_handleStateChange:824":0,"_firePageChange:849":0,"CurrentPageInput:882":0,"destroy:925":0,"render:940":0,"update:973":0,"_onChange:987":0,"_onReturnKey:992":0,"CurrentPageReport:1016":0,"value:1070":0,"(anonymous 3):1097":0,"sprintf:1096":0,"destroy:1119":0,"render:1131":0,"update:1152":0,"FirstPageLink:1180":0,"destroy:1248":0,"render:1261":0,"update:1289":0,"rebuild:1313":0,"onClick:1334":0,"ItemRangeDropdown:1356":0,"destroy:1399":0,"render:1414":0,"update:1449":0,"_onChange:1488":0,"LastPageLink:1510":0,"destroy:1586":0,"render:1600":0,"update:1645":0,"rebuild:1674":0,"onClick:1695":0,"NextPageLink:1717":0,"destroy:1784":0,"render:1797":0,"update:1827":0,"rebuild:1853":0,"onClick:1874":0,"PageLinks:1896":0,"value:1964":0,"calculateRange:1978":0,"destroy:2035":0,"render:2047":0,"update:2069":0,"rebuild:2117":0,"onClick:2129":0,"PreviousPageLink:2157":0,"destroy:2224":0,"render:2237":0,"update:2265":0,"onClick:2289":0,"RowsPerPageDropdown:2311":0,"destroy:2385":0,"render:2396":0,"rebuild:2414":0,"update:2453":0,"onChange:2477":0,"_handleTotalRecordsChange:2490":0,"ValidationPageLinks:2513":0,"update:2538":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-paginator/gallery-paginator.js"].coveredLines = 589;
_yuitest_coverage["/build/gallery-paginator/gallery-paginator.js"].coveredFunctions = 91;
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1);
YUI.add('gallery-paginator', function(Y) {

_yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 3);
"use strict";
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 * The Paginator widget provides a set of controls to navigate through
 * paged data.
 * 
 * @module gallery-paginator
 */

/**
 * To instantiate a Paginator, pass a configuration object to the contructor.
 * The configuration object should contain the following properties:
 * <ul>
 *   <li>rowsPerPage : <em>n</em> (int)</li>
 *   <li>totalRecords : <em>n</em> (int or Paginator.VALUE_UNLIMITED)</li>
 * </ul>
 *
 * @class Paginator
 * @extends Widget
 * @constructor
 * @param config {Object} Object literal to set instance and ui component
 * configuration.
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 31);
function Paginator(config) {
    _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "Paginator", 31);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 32);
Paginator.superclass.constructor.call(this, config);
}


// Static members
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 37);
Y.mix(Paginator, {
    NAME: "paginator",

    /**
     * Base of id strings used for ui components.
     * @static
     * @property Paginator.ID_BASE
     * @type string
     * @private
     */
    ID_BASE : 'yui-pg-',

    /**
     * Used to identify unset, optional configurations, or used explicitly in
     * the case of totalRecords to indicate unlimited pagination.
     * @static
     * @property Paginator.VALUE_UNLIMITED
     * @type number
     * @final
     */
    VALUE_UNLIMITED : -1,

    /**
     * Default template used by Paginator instances.  Update this if you want
     * all new Paginators to use a different default template.
     * @static
     * @property Paginator.TEMPLATE_DEFAULT
     * @type string
     */
    TEMPLATE_DEFAULT : "{FirstPageLink} {PreviousPageLink} {PageLinks} {NextPageLink} {LastPageLink}",

    /**
     * Common alternate pagination format, including page links, links for
     * previous, next, first and last pages as well as a rows-per-page
     * dropdown.  Offered as a convenience.
     * @static
     * @property Paginator.TEMPLATE_ROWS_PER_PAGE
     * @type string
     */
    TEMPLATE_ROWS_PER_PAGE : "{FirstPageLink} {PreviousPageLink} {PageLinks} {NextPageLink} {LastPageLink} {RowsPerPageDropdown}",

    /**
     * Storage object for UI Components
     * @static
     * @property Paginator.ui
     */
    ui : {},

    /**
     * Similar to Y.Lang.isNumber, but allows numeric strings.  This is
     * is used for attribute validation in conjunction with getters that return
     * numbers.
     *
     * @method Paginator.isNumeric
     * @param v {Number|String} value to be checked for number or numeric string
     * @return {Boolean} true if the input is coercable into a finite number
     * @static
     */
    isNumeric : function (v) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "isNumeric", 95);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 96);
return isFinite(+v);
    },

    /**
     * Return a number or null from input
     *
     * @method Paginator.toNumber
     * @param n {Number|String} a number or numeric string
     * @return Number
     * @static
     */
    toNumber : function (n) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "toNumber", 107);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 108);
return isFinite(+n) ? +n : null;
    }

},true);


_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 114);
Paginator.ATTRS =
{
    /**
     * REQUIRED. Number of records constituting a &quot;page&quot;
     * @attribute rowsPerPage
     * @type integer
     */
    rowsPerPage: {
        value     : 0,
        validator : Paginator.isNumeric,
        setter    : Paginator.toNumber
    },

    /**
     * Total number of records to paginate through
     * @attribute totalRecords
     * @type integer
     * @default 0
     */
    totalRecords: {
        value     : 0,
        validator : Paginator.isNumeric,
        setter    : Paginator.toNumber
    },

    /**
     * Zero based index of the record considered first on the current page.
     * For page based interactions, don't modify this attribute directly;
     * use setPage(n).
     * @attribute recordOffset
     * @type integer
     * @default 0
     */
    recordOffset: {
        value     : 0,
        validator : function (val) {
            _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "validator", 149);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 150);
var total = this.get('totalRecords');
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 151);
if (Paginator.isNumeric(val)) {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 152);
val = +val;
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 153);
return total === Paginator.VALUE_UNLIMITED || total > val ||
                       (total === 0 && val === 0);
            }

            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 157);
return false;
        },
        setter    : Paginator.toNumber
    },

    /**
     * Page to display on initial paint
     * @attribute initialPage
     * @type integer
     * @default 1
     */
    initialPage: {
        value     : 1,
        validator : Paginator.isNumeric,
        setter    : Paginator.toNumber
    },

    /**
     * Template used to render controls.  The string will be used as
     * innerHTML on all specified container nodes.  Bracketed keys
     * (e.g. {pageLinks}) in the string will be replaced with an instance
     * of the so named ui component.
     * @see Paginator.TEMPLATE_DEFAULT
     * @see Paginator.TEMPLATE_ROWS_PER_PAGE
     * @attribute template
     * @type string
     */
    template: {
        value : Paginator.TEMPLATE_DEFAULT,
        validator : Y.Lang.isString
    },

    /**
     * Display pagination controls even when there is only one page.  Set
     * to false to forgo rendering and/or hide the containers when there
     * is only one page of data.  Note if you are using the rowsPerPage
     * dropdown ui component, visibility will be maintained as long as the
     * number of records exceeds the smallest page size.
     * @attribute alwaysVisible
     * @type boolean
     * @default true
     */
    alwaysVisible: {
        value : true,
        validator : Y.Lang.isBoolean
    },

    // Read only attributes

    /**
     * Unique id assigned to this instance
     * @attribute id
     * @type integer
     * @final
     */
    id: {
        value    : Y.guid(),
        readOnly : true
    }
};


/**
 * Event fired when a change in pagination values is requested,
 * either by interacting with the various ui components or via the
 * setStartIndex(n) etc APIs.
 * Subscribers will receive the proposed state as the first parameter.
 * The proposed state object will contain the following keys:
 * <ul>
 *   <li>paginator - the Paginator instance</li>
 *   <li>page</li>
 *   <li>totalRecords</li>
 *   <li>recordOffset - index of the first record on the new page</li>
 *   <li>rowsPerPage</li>
 *   <li>records - array containing [start index, end index] for the records on the new page</li>
 *   <li>before - object literal with all these keys for the current state</li>
 * </ul>
 * @event changeRequest
 */

/**
 * Event fired when attribute changes have resulted in the calculated
 * current page changing.
 * @event pageChange
 */


// Instance members and methods
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 245);
Y.extend(Paginator, Y.Widget,
{
    // Instance members

    /**
     * Flag used to indicate multiple attributes are being updated via setState
     * @property _batch
     * @type boolean
     * @protected
     */
    _batch : false,

    /**
     * Used by setState to indicate when a page change has occurred
     * @property _pageChanged
     * @type boolean
     * @protected
     */
    _pageChanged : false,

    /**
     * Temporary state cache used by setState to keep track of the previous
     * state for eventual pageChange event firing
     * @property _state
     * @type Object
     * @protected
     */
    _state : null,


    // Instance methods

    initializer : function(config) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "initializer", 277);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 278);
var UNLIMITED = Paginator.VALUE_UNLIMITED,
            initialPage, records, perPage, startIndex;

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 281);
this._selfSubscribe();

        // Calculate the initial record offset
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 284);
initialPage = this.get('initialPage');
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 285);
records     = this.get('totalRecords');
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 286);
perPage     = this.get('rowsPerPage');
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 287);
if (initialPage > 1 && perPage !== UNLIMITED) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 288);
startIndex = (initialPage - 1) * perPage;
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 289);
if (records === UNLIMITED || startIndex < records) {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 290);
this.set('recordOffset',startIndex);
            }
        }
    },

    /**
     * Subscribes to instance attribute change events to automate certain
     * behaviors.
     * @method _selfSubscribe
     * @protected
     */
    _selfSubscribe : function () {
        // Listen for changes to totalRecords and alwaysVisible 
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "_selfSubscribe", 301);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 303);
this.after('totalRecordsChange',this.updateVisibility,this);
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 304);
this.after('alwaysVisibleChange',this.updateVisibility,this);

        // Fire the pageChange event when appropriate
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 307);
this.after('totalRecordsChange',this._handleStateChange,this);
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 308);
this.after('recordOffsetChange',this._handleStateChange,this);
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 309);
this.after('rowsPerPageChange',this._handleStateChange,this);

        // Update recordOffset when totalRecords is reduced below
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 312);
this.after('totalRecordsChange',this._syncRecordOffset,this);
    },

    renderUI : function () {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "renderUI", 315);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 316);
this._renderTemplate(
            this.get('contentBox'),
            this.get('template'),
            Paginator.ID_BASE + this.get('id'),
            true);

        // Show the widget if appropriate
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 323);
this.updateVisibility();
    },

    /**
     * Creates the individual ui components and renders them into a container.
     *
     * @method _renderTemplate
     * @param container {HTMLElement} where to add the ui components
     * @param template {String} the template to use as a guide for rendering
     * @param id_base {String} id base for the container's ui components
     * @param hide {Boolean} leave the container hidden after assembly
     * @protected
     */
    _renderTemplate : function (container, template, id_base, hide) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "_renderTemplate", 336);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 337);
if (!container) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 338);
return;
        }

        // Hide the container while its contents are rendered
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 342);
container.setStyle('display','none');

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 344);
container.addClass(this.getClassName());

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 346);
var className = this.getClassName('ui');

        // Place the template innerHTML, adding marker spans to the template
        // html to indicate drop zones for ui components
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 350);
container.set('innerHTML', template.replace(/\{([a-z0-9_ \-]+)\}/gi,
            '<span class="'+className+' '+className+'-$1"></span>'));

        // Replace each marker with the ui component's render() output
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 354);
container.all('span.'+className).each(function(node)
        {
            _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "(anonymous 2)", 354);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 356);
this.renderUIComponent(node, id_base);
        },
        this);

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 360);
if (!hide) {
            // Show the container allowing page reflow
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 362);
container.setStyle('display','');
        }
    },

    /**
     * Replaces a marker node with a rendered UI component, determined by the
     * yui-paginator-ui-(UI component class name) in the marker's className. e.g.
     * yui-paginator-ui-PageLinks => new Y.Paginator.ui.PageLinks(this)
     *
     * @method renderUIComponent
     * @param marker {HTMLElement} the marker node to replace
     * @param id_base {String} string base the component's generated id
     */
    renderUIComponent : function (marker, id_base) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "renderUIComponent", 375);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 376);
var par    = marker.get('parentNode'),
            clazz  = this.getClassName('ui'),
            name   = new RegExp(clazz+'-(\\w+)').exec(marker.get('className')),
            UIComp = name && Paginator.ui[name[1]],
            comp;

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 382);
if (Y.Lang.isFunction(UIComp)) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 383);
comp = new UIComp(this);
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 384);
if (Y.Lang.isFunction(comp.render)) {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 385);
par.replaceChild(comp.render(id_base),marker);
            }
        }
    },

    /**
     * Hides the widget if there is only one page of data and attribute
     * alwaysVisible is false.  Conversely, it displays the widget if either
     * there is more than one page worth of data or alwaysVisible is turned on.
     * @method updateVisibility
     */
    updateVisibility : function (e) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "updateVisibility", 396);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 397);
var alwaysVisible = this.get('alwaysVisible'),
            totalRecords,visible,rpp,rppOptions,i,len,rppOption,rppValue;

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 400);
if (!e || e.type === 'alwaysVisibleChange' || !alwaysVisible) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 401);
totalRecords = this.get('totalRecords');
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 402);
visible      = true;
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 403);
rpp          = this.get('rowsPerPage');
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 404);
rppOptions   = this.get('rowsPerPageOptions');

            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 406);
if (Y.Lang.isArray(rppOptions)) {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 407);
for (i = 0, len = rppOptions.length; i < len; ++i) {
                    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 408);
rppOption = rppOptions[i];
                    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 409);
rppValue  = Y.Lang.isValue(rppOption.value) ? rppOption.value : rppOption;
                    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 410);
rpp       = Math.min(rpp,rppValue);
                }
            }

            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 414);
if (totalRecords !== Paginator.VALUE_UNLIMITED &&
                totalRecords <= rpp) {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 416);
visible = false;
            }

            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 419);
visible = visible || alwaysVisible;
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 420);
this.get('contentBox').setStyle('display', visible ? '' : 'none');
        }
    },

    /**
     * Get the total number of pages in the data set according to the current
     * rowsPerPage and totalRecords values.  If totalRecords is not set, or
     * set to Y.Paginator.VALUE_UNLIMITED, returns Y.Paginator.VALUE_UNLIMITED.
     * @method getTotalPages
     * @return {number}
     */
    getTotalPages : function () {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "getTotalPages", 431);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 432);
var records = this.get('totalRecords'),
            perPage = this.get('rowsPerPage');

        // rowsPerPage not set.  Can't calculate
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 436);
if (!perPage) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 437);
return null;
        }

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 440);
if (records === Paginator.VALUE_UNLIMITED) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 441);
return Paginator.VALUE_UNLIMITED;
        }

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 444);
return Math.ceil(records/perPage);
    },

    /**
     * Does the requested page have any records?
     * @method hasPage
     * @param page {number} the page in question
     * @return {boolean}
     */
    hasPage : function (page) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "hasPage", 453);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 454);
if (!Y.Lang.isNumber(page) || page < 1) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 455);
return false;
        }

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 458);
var totalPages = this.getTotalPages();

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 460);
return (totalPages === Paginator.VALUE_UNLIMITED || totalPages >= page);
    },

    /**
     * Get the page number corresponding to the current record offset.
     * @method getCurrentPage
     * @return {number}
     */
    getCurrentPage : function () {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "getCurrentPage", 468);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 469);
var perPage = this.get('rowsPerPage');
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 470);
if (!perPage || !this.get('totalRecords')) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 471);
return 0;
        }
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 473);
return Math.floor(this.get('recordOffset') / perPage) + 1;
    },

    /**
     * Are there records on the next page?
     * @method hasNextPage
     * @return {boolean}
     */
    hasNextPage : function () {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "hasNextPage", 481);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 482);
var currentPage = this.getCurrentPage(),
            totalPages  = this.getTotalPages();

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 485);
return currentPage && (totalPages === Paginator.VALUE_UNLIMITED || currentPage < totalPages);
    },

    /**
     * Get the page number of the next page, or null if the current page is the
     * last page.
     * @method getNextPage
     * @return {number}
     */
    getNextPage : function () {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "getNextPage", 494);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 495);
return this.hasNextPage() ? this.getCurrentPage() + 1 : null;
    },

    /**
     * Is there a page before the current page?
     * @method hasPreviousPage
     * @return {boolean}
     */
    hasPreviousPage : function () {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "hasPreviousPage", 503);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 504);
return (this.getCurrentPage() > 1);
    },

    /**
     * Get the page number of the previous page, or null if the current page
     * is the first page.
     * @method getPreviousPage
     * @return {number}
     */
    getPreviousPage : function () {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "getPreviousPage", 513);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 514);
return (this.hasPreviousPage() ? this.getCurrentPage() - 1 : 1);
    },

    /**
     * Get the start and end record indexes of the specified page.
     * @method getPageRecords
     * @param [page] {number} The page (current page if not specified)
     * @return {Array} [start_index, end_index]
     */
    getPageRecords : function (page) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "getPageRecords", 523);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 524);
if (!Y.Lang.isNumber(page)) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 525);
page = this.getCurrentPage();
        }

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 528);
var perPage = this.get('rowsPerPage'),
            records = this.get('totalRecords'),
            start, end;

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 532);
if (!page || !perPage) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 533);
return null;
        }

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 536);
start = (page - 1) * perPage;
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 537);
if (records !== Paginator.VALUE_UNLIMITED) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 538);
if (start >= records) {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 539);
return null;
            }
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 541);
end = Math.min(start + perPage, records) - 1;
        } else {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 543);
end = start + perPage - 1;
        }

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 546);
return [start,end];
    },

    /**
     * Set the current page to the provided page number if possible.
     * @method setPage
     * @param newPage {number} the new page number
     * @param silent {boolean} whether to forcibly avoid firing the changeRequest event
     */
    setPage : function (page,silent) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "setPage", 555);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 556);
if (this.hasPage(page) && page !== this.getCurrentPage()) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 557);
if (silent) {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 558);
this.set('recordOffset', (page - 1) * this.get('rowsPerPage'));
            } else {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 560);
this.fire('changeRequest',this.getState({'page':page}));
            }
        }
    },

    /**
     * Get the number of rows per page.
     * @method getRowsPerPage
     * @return {number} the current setting of the rowsPerPage attribute
     */
    getRowsPerPage : function () {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "getRowsPerPage", 570);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 571);
return this.get('rowsPerPage');
    },

    /**
     * Set the number of rows per page.
     * @method setRowsPerPage
     * @param rpp {number} the new number of rows per page
     * @param silent {boolean} whether to forcibly avoid firing the changeRequest event
     */
    setRowsPerPage : function (rpp,silent) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "setRowsPerPage", 580);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 581);
if (Paginator.isNumeric(rpp) && +rpp > 0 &&
            +rpp !== this.get('rowsPerPage')) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 583);
if (silent) {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 584);
this.set('rowsPerPage',rpp);
            } else {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 586);
this.fire('changeRequest',
                    this.getState({'rowsPerPage':+rpp}));
            }
        }
    },

    /**
     * Get the total number of records.
     * @method getTotalRecords
     * @return {number} the current setting of totalRecords attribute
     */
    getTotalRecords : function () {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "getTotalRecords", 597);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 598);
return this.get('totalRecords');
    },

    /**
     * Set the total number of records.
     * @method setTotalRecords
     * @param total {number} the new total number of records
     * @param silent {boolean} whether to forcibly avoid firing the changeRequest event
     */
    setTotalRecords : function (total,silent) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "setTotalRecords", 607);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 608);
if (Paginator.isNumeric(total) && +total >= 0 &&
            +total !== this.get('totalRecords')) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 610);
if (silent) {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 611);
this.set('totalRecords',total);
            } else {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 613);
this.fire('changeRequest',
                    this.getState({'totalRecords':+total}));
            }
        }
    },

    /**
     * Get the index of the first record on the current page
     * @method getStartIndex
     * @return {number} the index of the first record on the current page
     */
    getStartIndex : function () {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "getStartIndex", 624);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 625);
return this.get('recordOffset');
    },

    /**
     * Move the record offset to a new starting index.  This will likely cause
     * the calculated current page to change.  You should probably use setPage.
     * @method setStartIndex
     * @param offset {number} the new record offset
     * @param silent {boolean} whether to forcibly avoid firing the changeRequest event
     */
    setStartIndex : function (offset,silent) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "setStartIndex", 635);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 636);
if (Paginator.isNumeric(offset) && +offset >= 0 &&
            +offset !== this.get('recordOffset')) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 638);
if (silent) {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 639);
this.set('recordOffset',offset);
            } else {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 641);
this.fire('changeRequest',
                    this.getState({'recordOffset':+offset}));
            }
        }
    },

    /**
     * Get an object literal describing the current state of the paginator.  If
     * an object literal of proposed values is passed, the proposed state will
     * be returned as an object literal with the following keys:
     * <ul>
     * <li>paginator - instance of the Paginator</li>
     * <li>page - number</li>
     * <li>totalRecords - number</li>
     * <li>recordOffset - number</li>
     * <li>rowsPerPage - number</li>
     * <li>records - [ start_index, end_index ]</li>
     * <li>before - (OPTIONAL) { state object literal for current state }</li>
     * </ul>
     * @method getState
     * @return {object}
     * @param changes {object} OPTIONAL object literal with proposed values
     * Supported change keys include:
     * <ul>
     * <li>rowsPerPage</li>
     * <li>totalRecords</li>
     * <li>recordOffset OR</li>
     * <li>page</li>
     * </ul>
     */
    getState : function (changes) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "getState", 671);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 672);
var UNLIMITED = Paginator.VALUE_UNLIMITED,
            M = Math, max = M.max, ceil = M.ceil,
            currentState, state, offset;

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 676);
function normalizeOffset(offset,total,rpp) {
            _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "normalizeOffset", 676);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 677);
if (offset <= 0 || total === 0) {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 678);
return 0;
            }
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 680);
if (total === UNLIMITED || total > offset) {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 681);
return offset - (offset % rpp);
            }
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 683);
return total - (total % rpp || rpp);
        }

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 686);
currentState = {
            paginator    : this,
            totalRecords : this.get('totalRecords'),
            rowsPerPage  : this.get('rowsPerPage'),
            records      : this.getPageRecords()
        };
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 692);
currentState.recordOffset = normalizeOffset(
                                        this.get('recordOffset'),
                                        currentState.totalRecords,
                                        currentState.rowsPerPage);
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 696);
currentState.page = ceil(currentState.recordOffset /
                                 currentState.rowsPerPage) + 1;

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 699);
if (!changes) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 700);
return currentState;
        }

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 703);
state = {
            paginator    : this,
            before       : currentState,

            rowsPerPage  : changes.rowsPerPage || currentState.rowsPerPage,
            totalRecords : (Paginator.isNumeric(changes.totalRecords) ?
                                max(changes.totalRecords,UNLIMITED) :
                                +currentState.totalRecords)
        };

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 713);
if (state.totalRecords === 0) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 714);
state.recordOffset =
            state.page         = 0;
        } else {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 717);
offset = Paginator.isNumeric(changes.page) ?
                        (changes.page - 1) * state.rowsPerPage :
                        Paginator.isNumeric(changes.recordOffset) ?
                            +changes.recordOffset :
                            currentState.recordOffset;

            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 723);
state.recordOffset = normalizeOffset(offset,
                                    state.totalRecords,
                                    state.rowsPerPage);

            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 727);
state.page = ceil(state.recordOffset / state.rowsPerPage) + 1;
        }

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 730);
state.records = [ state.recordOffset,
                          state.recordOffset + state.rowsPerPage - 1 ];

        // limit upper index to totalRecords - 1
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 734);
if (state.totalRecords !== UNLIMITED &&
            state.recordOffset < state.totalRecords && state.records &&
            state.records[1] > state.totalRecords - 1) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 737);
state.records[1] = state.totalRecords - 1;
        }

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 740);
return state;
    },

    /**
     * Convenience method to facilitate setting state attributes rowsPerPage,
     * totalRecords, recordOffset in batch.  Also supports calculating
     * recordOffset from state.page if state.recordOffset is not provided.
     * Fires only a single pageChange event, if appropriate.
     * This will not fire a changeRequest event.
     * @method setState
     * @param state {Object} Object literal of attribute:value pairs to set
     */
    setState : function (state) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "setState", 752);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 753);
if (Y.Lang.isObject(state)) {
            // get flux state based on current state with before state as well
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 755);
this._state = this.getState({});

            // use just the state props from the input obj
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 758);
state = {
                page         : state.page,
                rowsPerPage  : state.rowsPerPage,
                totalRecords : state.totalRecords,
                recordOffset : state.recordOffset
            };

            // calculate recordOffset from page if recordOffset not specified.
            // not using Y.Lang.isNumber for support of numeric strings
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 767);
if (state.page && state.recordOffset === undefined) {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 768);
state.recordOffset = (state.page - 1) *
                    (state.rowsPerPage || this.get('rowsPerPage'));
            }

            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 772);
this._batch = true;
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 773);
this._pageChanged = false;

            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 775);
for (var k in state) {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 776);
if (state.hasOwnProperty(k)) {
                    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 777);
this.set(k,state[k]);
                }
            }

            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 781);
this._batch = false;
            
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 783);
if (this._pageChanged) {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 784);
this._pageChanged = false;

                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 786);
this._firePageChange(this.getState(this._state));
            }
        }
    },

    /**
     * Sets recordOffset to the starting index of the previous page when
     * totalRecords is reduced below the current recordOffset.
     * @method _syncRecordOffset
     * @param e {Event} totalRecordsChange event
     * @protected
     */
    _syncRecordOffset : function (e) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "_syncRecordOffset", 798);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 799);
var v = e.newValue,rpp,state;
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 800);
if (e.prevValue !== v) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 801);
if (v !== Paginator.VALUE_UNLIMITED) {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 802);
rpp = this.get('rowsPerPage');

                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 804);
if (rpp && this.get('recordOffset') >= v) {
                    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 805);
state = this.getState({
                        totalRecords : e.prevValue,
                        recordOffset : this.get('recordOffset')
                    });

                    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 810);
this.set('recordOffset', state.before.recordOffset);
                    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 811);
this._firePageChange(state);
                }
            }
        }
    },

    /**
     * Fires the pageChange event when the state attributes have changed in
     * such a way as to locate the current recordOffset on a new page.
     * @method _handleStateChange
     * @param e {Event} the attribute change event
     * @protected
     */
    _handleStateChange : function (e) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "_handleStateChange", 824);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 825);
if (e.prevValue !== e.newValue) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 826);
var change = this._state || {},
                state;

            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 829);
change[e.type.replace(/Change$/,'')] = e.prevValue;
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 830);
state = this.getState(change);

            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 832);
if (state.page !== state.before.page) {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 833);
if (this._batch) {
                    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 834);
this._pageChanged = true;
                } else {
                    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 836);
this._firePageChange(state);
                }
            }
        }
    },

    /**
     * Fires a pageChange event in the form of a standard attribute change
     * event with additional properties prevState and newState.
     * @method _firePageChange
     * @param state {Object} the result of getState(oldState)
     * @protected
     */
    _firePageChange : function (state) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "_firePageChange", 849);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 850);
if (Y.Lang.isObject(state)) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 851);
var current = state.before;
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 852);
delete state.before;
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 853);
this.fire('pageChange',{
                type      : 'pageChange',
                prevValue : state.page,
                newValue  : current.page,
                prevState : state,
                newState  : current
            });
        }
    }
});

_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 864);
Y.Paginator = Paginator;
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 * @module gallery-paginator
 */

/**
 * Generates an input field for setting the current page.
 *
 * @class Paginator.ui.CurrentPageInput
 * @constructor
 * @param p {Pagintor} Paginator instance to attach to
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 882);
Paginator.ui.CurrentPageInput = function(
	/* Paginator */	p)
{
	_yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "CurrentPageInput", 882);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 885);
this.paginator = p;

	_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 887);
p.on('destroy',               this.destroy, this);
	_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 888);
p.after('recordOffsetChange', this.update,  this);
	_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 889);
p.after('rowsPerPageChange',  this.update,  this);
	_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 890);
p.after('totalRecordsChange', this.update,  this);
	_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 891);
p.after('disabledChange',     this.update,  this);

	_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 893);
p.after('pageInputClassChange', this.update, this);
};

/**
 * CSS class assigned to the span
 * @attribute pageInputClass
 * @default 'yui-paginator-page-input'
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 901);
Paginator.ATTRS.pageInputClass =
{
	value : Y.ClassNameManager.getClassName(Paginator.NAME, 'page-input'),
	validator : Y.Lang.isString
};

/**
 * Used as innerHTML for the span.
 * @attribute pageInputTemplate
 * @default '{currentPage} of {totalPages}'
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 912);
Paginator.ATTRS.pageInputTemplate =
{
	value : '{currentPage} of {totalPages}',
	validator : Y.Lang.isString
};

_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 918);
Paginator.ui.CurrentPageInput.prototype =
{
	/**
	 * Removes the span node and clears event listeners.
	 * @method destroy
	 * @private
	 */
	destroy: function()
	{
		_yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "destroy", 925);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 927);
this.span.remove().destroy(true);
		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 928);
this.span       = null;
		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 929);
this.input      = null;
		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 930);
this.page_count = null;
	},

	/**
	 * Generate the nodes and return the appropriate node given the current
	 * pagination state.
	 * @method render
	 * @param id_base {string} used to create unique ids for generated nodes
	 * @return {HTMLElement}
	 */
	render: function(
		id_base)
	{
		_yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "render", 940);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 943);
if (this.span) {
			_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 944);
this.span.remove().destroy(true);
		}

		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 947);
this.span = Y.Node.create(
			'<span id="'+id_base+'-page-input">' +
			Y.substitute(this.paginator.get('pageInputTemplate'),
			{
				currentPage: '<input class="yui-page-input"></input>',
				totalPages:  '<span class="yui-page-count"></span>'
			}) +
			'</span>');
		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 955);
this.span.set('className', this.paginator.get('pageInputClass'));

		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 957);
this.input = this.span.one('input');
		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 958);
this.input.on('change', this._onChange, this);
		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 959);
this.input.on('key', this._onReturnKey, 'down:13', this);

		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 961);
this.page_count = this.span.one('span.yui-page-count');

		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 963);
this.update();

		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 965);
return this.span;
	},

	/**
	 * Swap the link and span nodes if appropriate.
	 * @method update
	 * @param e {CustomEvent} The calling change event
	 */
	update: function(
		/* CustomEvent */ e)
	{
		_yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "update", 973);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 976);
if (e && e.prevVal === e.newVal)
		{
			_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 978);
return;
		}

		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 981);
this.span.set('className', this.paginator.get('pageInputClass'));
		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 982);
this.input.set('value', this.paginator.getCurrentPage());
		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 983);
this.input.set('disabled', this.paginator.get('disabled'));
		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 984);
this.page_count.set('innerHTML', this.paginator.getTotalPages());
	},

	_onChange: function(e)
	{
		_yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "_onChange", 987);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 989);
this.paginator.setPage(parseInt(this.input.get('value'), 10));
	},

	_onReturnKey: function(e)
	{
		_yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "_onReturnKey", 992);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 994);
e.halt(true);
		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 995);
this.paginator.setPage(parseInt(this.input.get('value'), 10));
	}
};
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 * @module gallery-paginator
 */

/**
 * ui Component to generate the textual report of current pagination status.
 * E.g. "Now viewing page 1 of 13".
 *
 * @class Paginator.ui.CurrentPageReport
 * @constructor
 * @param p {Pagintor} Paginator instance to attach to
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1016);
Paginator.ui.CurrentPageReport = function (p) {
    _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "CurrentPageReport", 1016);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1017);
this.paginator = p;

    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1019);
p.on('destroy',this.destroy,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1020);
p.after('recordOffsetChange', this.update,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1021);
p.after('rowsPerPageChange', this.update,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1022);
p.after('totalRecordsChange',this.update,this);

    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1024);
p.after('pageReportClassChange', this.update,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1025);
p.after('pageReportTemplateChange', this.update,this);
};

/**
 * CSS class assigned to the span containing the info.
 * @attribute pageReportClass
 * @default 'yui-paginator-current'
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1033);
Paginator.ATTRS.pageReportClass =
{
    value : Y.ClassNameManager.getClassName(Paginator.NAME, 'current'),
    validator : Y.Lang.isString
};

/**
 * Used as innerHTML for the span.  Place holders in the form of {name}
 * will be replaced with the so named value from the key:value map
 * generated by the function held in the pageReportValueGenerator attribute.
 * @attribute pageReportTemplate
 * @default '({currentPage} of {totalPages})'
 * @see pageReportValueGenerator attribute
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1047);
Paginator.ATTRS.pageReportTemplate =
{
    value : '({currentPage} of {totalPages})',
    validator : Y.Lang.isString
};

/**
 * Function to generate the value map used to populate the
 * pageReportTemplate.  The function is passed the Paginator instance as a
 * parameter.  The default function returns a map with the following keys:
 * <ul>
 * <li>currentPage</li>
 * <li>totalPages</li>
 * <li>startIndex</li>
 * <li>endIndex</li>
 * <li>startRecord</li>
 * <li>endRecord</li>
 * <li>totalRecords</li>
 * </ul>
 * @attribute pageReportValueGenarator
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1068);
Paginator.ATTRS.pageReportValueGenerator =
{
    value : function (paginator) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "value", 1070);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1071);
var curPage = paginator.getCurrentPage(),
            records = paginator.getPageRecords();

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1074);
return {
            'currentPage' : records ? curPage : 0,
            'totalPages'  : paginator.getTotalPages(),
            'startIndex'  : records ? records[0] : 0,
            'endIndex'    : records ? records[1] : 0,
            'startRecord' : records ? records[0] + 1 : 0,
            'endRecord'   : records ? records[1] + 1 : 0,
            'totalRecords': paginator.get('totalRecords')
        };
    },
    validator : Y.Lang.isFunction
};

/**
 * Replace place holders in a string with the named values found in an
 * object literal.
 * @static
 * @method sprintf
 * @param template {string} The content string containing place holders
 * @param values {object} The key:value pairs used to replace the place holders
 * @return {string}
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1096);
Paginator.ui.CurrentPageReport.sprintf = function (template, values) {
    _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "sprintf", 1096);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1097);
return template.replace(/\{([\w\s\-]+)\}/g, function (x,key) {
            _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "(anonymous 3)", 1097);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1098);
return (key in values) ? values[key] : '';
        });
};

_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1102);
Paginator.ui.CurrentPageReport.prototype = {

    /**
     * Span node containing the formatted info
     * @property span
     * @type HTMLElement
     * @private
     */
    span : null,


    /**
     * Removes the link/span node and clears event listeners
     * removal.
     * @method destroy
     * @private
     */
    destroy : function () {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "destroy", 1119);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1120);
this.span.remove(true);
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1121);
this.span = null;
    },

    /**
     * Generate the span containing info formatted per the pageReportTemplate
     * attribute.
     * @method render
     * @param id_base {string} used to create unique ids for generated nodes
     * @return {HTMLElement}
     */
    render : function (id_base) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "render", 1131);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1132);
if (this.span) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1133);
this.span.remove(true);
        }

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1136);
this.span = Y.Node.create(
            '<span id="'+id_base+'-page-report"></span>');
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1138);
this.span.set('className', this.paginator.get('pageReportClass'));
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1139);
this.update();

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1141);
return this.span;
    },
    
    /**
     * Regenerate the content of the span if appropriate. Calls
     * CurrentPageReport.sprintf with the value of the pageReportTemplate
     * attribute and the value map returned from pageReportValueGenerator
     * function.
     * @method update
     * @param e {CustomEvent} The calling change event
     */
    update : function (e) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "update", 1152);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1153);
if (e && e.prevVal === e.newVal) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1154);
return;
        }

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1157);
this.span.set('className', this.paginator.get('pageReportClass'));
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1158);
this.span.set('innerHTML', Paginator.ui.CurrentPageReport.sprintf(
            this.paginator.get('pageReportTemplate'),
            this.paginator.get('pageReportValueGenerator')(this.paginator)));
    }
};
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 * @module gallery-paginator
 */

/**
 * ui Component to generate the link to jump to the first page.
 *
 * @class Paginator.ui.FirstPageLink
 * @constructor
 * @param p {Pagintor} Paginator instance to attach to
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1180);
Paginator.ui.FirstPageLink = function (p) {
    _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "FirstPageLink", 1180);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1181);
this.paginator = p;

    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1183);
p.on('destroy',this.destroy,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1184);
p.after('recordOffsetChange',this.update,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1185);
p.after('rowsPerPageChange',this.update,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1186);
p.after('totalRecordsChange',this.update,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1187);
p.after('disabledChange',this.update,this);

    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1189);
p.after('firstPageLinkLabelChange',this.rebuild,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1190);
p.after('firstPageLinkClassChange',this.rebuild,this);
};

/**
 * Used as innerHTML for the first page link/span.
 * @attribute firstPageLinkLabel
 * @default '&lt;&lt; first'
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1198);
Paginator.ATTRS.firstPageLinkLabel =
{
    value : '&lt;&lt; first',
    validator : Y.Lang.isString
};

/**
 * CSS class assigned to the link/span
 * @attribute firstPageLinkClass
 * @default 'yui-paginator-first'
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1209);
Paginator.ATTRS.firstPageLinkClass =
{
    value : Y.ClassNameManager.getClassName(Paginator.NAME, 'first'),
    validator : Y.Lang.isString
};

// Instance members and methods
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1216);
Paginator.ui.FirstPageLink.prototype = {

    /**
     * The currently placed HTMLElement node
     * @property current
     * @type HTMLElement
     * @private
     */
    current   : null,

    /**
     * Link node
     * @property link
     * @type HTMLElement
     * @private
     */
    link      : null,

    /**
     * Span node (inactive link)
     * @property span
     * @type HTMLElement
     * @private
     */
    span      : null,


    /**
     * Removes the link/span node and clears event listeners.
     * @method destroy
     * @private
     */
    destroy : function () {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "destroy", 1248);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1249);
this.link.remove(true);
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1250);
this.span.remove(true);
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1251);
this.current = this.link = this.span = null;
    },

    /**
     * Generate the nodes and return the appropriate node given the current
     * pagination state.
     * @method render
     * @param id_base {string} used to create unique ids for generated nodes
     * @return {HTMLElement}
     */
    render : function (id_base) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "render", 1261);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1262);
var p     = this.paginator,
            c     = p.get('firstPageLinkClass'),
            label = p.get('firstPageLinkLabel');

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1266);
if (this.link) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1267);
this.link.remove(true);
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1268);
this.span.remove(true);
        }

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1271);
this.link = Y.Node.create(
            '<a href="#" id="'+id_base+'-first-link">'+label+'</a>');
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1273);
this.link.set('className', c);
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1274);
this.link.on('click',this.onClick,this);

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1276);
this.span = Y.Node.create(
            '<span id="'+id_base+'-first-span">'+label+'</span>');
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1278);
this.span.set('className', c);

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1280);
this.current = p.getCurrentPage() > 1 ? this.link : this.span;
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1281);
return this.current;
    },

    /**
     * Swap the link and span nodes if appropriate.
     * @method update
     * @param e {CustomEvent} The calling change event
     */
    update : function (e) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "update", 1289);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1290);
if (e && e.prevVal === e.newVal) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1291);
return;
        }

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1294);
var par = this.current ? this.current.get('parentNode') : null;
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1295);
if (this.paginator.getCurrentPage() > 1 && !this.paginator.get('disabled')) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1296);
if (par && this.current === this.span) {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1297);
par.replaceChild(this.link,this.current);
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1298);
this.current = this.link;
            }
        } else {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1301);
if (par && this.current === this.link) {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1302);
par.replaceChild(this.span,this.current);
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1303);
this.current = this.span;
            }
        }
    },

    /**
     * Rebuild the markup.
     * @method rebuild
     * @param e {CustomEvent} The calling change event
     */
    rebuild : function (e) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "rebuild", 1313);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1314);
if (e && e.prevVal === e.newVal) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1315);
return;
        }

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1318);
var p     = this.paginator,
            c     = p.get('firstPageLinkClass'),
            label = p.get('firstPageLinkLabel');

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1322);
this.link.set('className', c);
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1323);
this.link.set('innerHTML', label);

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1325);
this.span.set('className', c);
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1326);
this.span.set('innerHTML', label);
    },

    /**
     * Listener for the link's onclick event.  Pass new value to setPage method.
     * @method onClick
     * @param e {DOMEvent} The click event
     */
    onClick : function (e) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "onClick", 1334);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1335);
e.halt();
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1336);
this.paginator.setPage(1);
    }
};
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 * @module gallery-paginator
 */

/**
 * ui Component to display a menu for selecting the range of items to display.
 *
 * @class Paginator.ui.ItemRangeDropdown
 * @constructor
 * @param p {Pagintor} Paginator instance to attach to
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1356);
Paginator.ui.ItemRangeDropdown = function(
	/* Paginator */	p)
{
	_yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "ItemRangeDropdown", 1356);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1359);
this.paginator = p;

	_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1361);
p.on('destroy',               this.destroy, this);
	_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1362);
p.after('recordOffsetChange', this.update,  this);
	_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1363);
p.after('rowsPerPageChange',  this.update,  this);
	_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1364);
p.after('totalRecordsChange', this.update,  this);
	_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1365);
p.after('disabledChange',     this.update,  this);

	_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1367);
p.after('itemRangeDropdownClassChange', this.update, this);
};

/**
 * CSS class assigned to the span
 * @attribute itemRangeDropdownClass
 * @default 'yui-paginator-ir-dropdown'
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1375);
Paginator.ATTRS.itemRangeDropdownClass =
{
	value : Y.ClassNameManager.getClassName(Paginator.NAME, 'ir-dropdown'),
	validator : Y.Lang.isString
};

/**
 * Used as innerHTML for the span.
 * @attribute itemRangeDropdownTemplate
 * @default '{currentRange} of {totalItems}'
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1386);
Paginator.ATTRS.itemRangeDropdownTemplate =
{
	value : '{currentRange} of {totalItems}',
	validator : Y.Lang.isString
};

_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1392);
Paginator.ui.ItemRangeDropdown.prototype =
{
	/**
	 * Removes the link/span node and clears event listeners.
	 * @method destroy
	 * @private
	 */
	destroy: function()
	{
		_yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "destroy", 1399);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1401);
this.span.remove().destroy(true);
		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1402);
this.span       = null;
		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1403);
this.menu       = null;
		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1404);
this.page_count = null;
	},

	/**
	 * Generate the nodes and return the appropriate node given the current
	 * pagination state.
	 * @method render
	 * @param id_base {string} used to create unique ids for generated nodes
	 * @return {HTMLElement}
	 */
	render: function(
		id_base)
	{
		_yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "render", 1414);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1417);
if (this.span) {
			_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1418);
this.span.remove().destroy(true);
		}

		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1421);
this.span = Y.Node.create(
			'<span id="'+id_base+'-item-range">' +
			Y.substitute(this.paginator.get('itemRangeDropdownTemplate'),
			{
				currentRange: '<select class="yui-current-item-range"></select>',
				totalItems:   '<span class="yui-item-count"></span>'
			}) +
			'</span>');
		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1429);
this.span.set('className', this.paginator.get('itemRangeDropdownClass'));

		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1431);
this.menu = this.span.one('select');
		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1432);
this.menu.on('change', this._onChange, this);

		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1434);
this.page_count = this.span.one('span.yui-item-count');

		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1436);
this.prev_page_count = -1;
		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1437);
this.prev_page_size  = -1;
		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1438);
this.prev_rec_count  = -1;
		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1439);
this.update();

		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1441);
return this.span;
	},

	/**
	 * Swap the link and span nodes if appropriate.
	 * @method update
	 * @param e {CustomEvent} The calling change event
	 */
	update: function(
		/* CustomEvent */ e)
	{
		_yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "update", 1449);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1452);
if (e && e.prevVal === e.newVal)
		{
			_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1454);
return;
		}

		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1457);
var page    = this.paginator.getCurrentPage();
		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1458);
var count   = this.paginator.getTotalPages();
		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1459);
var size    = this.paginator.getRowsPerPage();
		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1460);
var recs    = this.paginator.getTotalRecords();

		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1462);
if (count != this.prev_page_count ||
			size  != this.prev_page_size  ||
			recs  != this.prev_rec_count)
		{
			_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1466);
var options    = Y.Node.getDOMNode(this.menu).options;
			_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1467);
options.length = 0;

			_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1469);
for (var i=1; i<=count; i++)
			{
				_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1471);
var range = this.paginator.getPageRecords(i);

				_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1473);
options[i-1] = new Option((range[0]+1) + ' - ' + (range[1]+1), i);
			}

			_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1476);
this.page_count.set('innerHTML', recs);

			_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1478);
this.prev_page_count = count;
			_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1479);
this.prev_page_size  = size;
			_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1480);
this.prev_rec_count  = recs;
		}

		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1483);
this.span.set('className', this.paginator.get('itemRangeDropdownClass'));
		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1484);
this.menu.set('selectedIndex', page-1);
		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1485);
this.menu.set('disabled', this.paginator.get('disabled'));
	},

	_onChange: function(e)
	{
		_yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "_onChange", 1488);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1490);
this.paginator.setPage(parseInt(this.menu.get('value'), 10));
	}
};
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 * @module gallery-paginator
 */

/**
 * ui Component to generate the link to jump to the last page.
 *
 * @class Paginator.ui.LastPageLink
 * @constructor
 * @param p {Pagintor} Paginator instance to attach to
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1510);
Paginator.ui.LastPageLink = function (p) {
    _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "LastPageLink", 1510);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1511);
this.paginator = p;

    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1513);
p.on('destroy',this.destroy,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1514);
p.after('recordOffsetChange',this.update,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1515);
p.after('rowsPerPageChange',this.update,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1516);
p.after('totalRecordsChange',this.update,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1517);
p.after('disabledChange',this.update,this);

    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1519);
p.after('lastPageLinkClassChange', this.rebuild, this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1520);
p.after('lastPageLinkLabelChange', this.rebuild, this);
};

/**
  * CSS class assigned to the link/span
  * @attribute lastPageLinkClass
  * @default 'yui-paginator-last'
  */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1528);
Paginator.ATTRS.lastPageLinkClass =
{
     value : Y.ClassNameManager.getClassName(Paginator.NAME, 'last'),
     validator : Y.Lang.isString
};

/**
 * Used as innerHTML for the last page link/span.
 * @attribute lastPageLinkLabel
 * @default 'last &gt;&gt;'
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1539);
Paginator.ATTRS.lastPageLinkLabel =
{
    value : 'last &gt;&gt;',
    validator : Y.Lang.isString
};

_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1545);
Paginator.ui.LastPageLink.prototype = {

    /**
     * Currently placed HTMLElement node
     * @property current
     * @type HTMLElement
     * @private
     */
    current   : null,

    /**
     * Link HTMLElement node
     * @property link
     * @type HTMLElement
     * @private
     */
    link      : null,

    /**
     * Span node (inactive link)
     * @property span
     * @type HTMLElement
     * @private
     */
    span      : null,

    /**
     * Empty place holder node for when the last page link is inappropriate to
     * display in any form (unlimited paging).
     * @property na
     * @type HTMLElement
     * @private
     */
    na        : null,


    /**
     * Removes the link/span node and clears event listeners
     * @method destroy
     * @private
     */
    destroy : function () {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "destroy", 1586);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1587);
this.link.remove(true);
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1588);
this.span.remove(true);
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1589);
this.na.remove(true);
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1590);
this.current = this.link = this.span = this.na = null;
    },

    /**
     * Generate the nodes and return the appropriate node given the current
     * pagination state.
     * @method render
     * @param id_base {string} used to create unique ids for generated nodes
     * @return {HTMLElement}
     */
    render : function (id_base) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "render", 1600);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1601);
var p     = this.paginator,
            c     = p.get('lastPageLinkClass'),
            label = p.get('lastPageLinkLabel'),
            last  = p.getTotalPages();

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1606);
if (this.link) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1607);
this.link.remove(true);
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1608);
this.span.remove(true);
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1609);
this.na.remove(true);
        }

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1612);
this.link = Y.Node.create(
            '<a href="#" id="'+id_base+'-last-link">'+label+'</a>');
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1614);
this.link.set('className', c);
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1615);
this.link.on('click',this.onClick,this);

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1617);
this.span = Y.Node.create(
            '<span id="'+id_base+'-last-span">'+label+'</span>');
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1619);
this.span.set('className', c);

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1621);
this.na = Y.Node.create(
            '<span id="'+id_base+'-last-na"></span>');

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1624);
switch (last) {
            case Paginator.VALUE_UNLIMITED :
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1626);
this.current = this.na;
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1627);
break;

            case p.getCurrentPage() :
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1630);
this.current = this.span;
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1631);
break;

            default :
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1634);
this.current = this.link;
        }

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1637);
return this.current;
    },

    /**
     * Swap the link, span, and na nodes if appropriate.
     * @method update
     * @param e {CustomEvent} The calling change event (ignored)
     */
    update : function (e) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "update", 1645);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1646);
if (e && e.prevVal === e.newVal) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1647);
return;
        }

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1650);
var par   = this.current ? this.current.get('parentNode') : null,
            after = this.link,
            total = this.paginator.getTotalPages();

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1654);
if (par) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1655);
if (total === Paginator.VALUE_UNLIMITED) {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1656);
after = this.na;
            } else {_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1657);
if (total === this.paginator.getCurrentPage() ||
                        this.paginator.get('disabled')) {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1659);
after = this.span;
            }}

            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1662);
if (this.current !== after) {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1663);
par.replaceChild(after,this.current);
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1664);
this.current = after;
            }
        }
    },

    /**
     * Rebuild the markup.
     * @method rebuild
     * @param e {CustomEvent} The calling change event (ignored)
     */
    rebuild : function (e) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "rebuild", 1674);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1675);
if (e && e.prevVal === e.newVal) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1676);
return;
        }

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1679);
var p     = this.paginator,
            c     = p.get('lastPageLinkClass'),
            label = p.get('lastPageLinkLabel');

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1683);
this.link.set('className', c);
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1684);
this.link.set('innerHTML', label);

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1686);
this.span.set('className', c);
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1687);
this.span.set('innerHTML', label);
    },

    /**
     * Listener for the link's onclick event.  Passes to setPage method.
     * @method onClick
     * @param e {DOMEvent} The click event
     */
    onClick : function (e) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "onClick", 1695);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1696);
e.halt();
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1697);
this.paginator.setPage(this.paginator.getTotalPages());
    }
};
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 * @module gallery-paginator
 */

/**
 * ui Component to generate the link to jump to the next page.
 *
 * @class Paginator.ui.NextPageLink
 * @constructor
 * @param p {Pagintor} Paginator instance to attach to
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1717);
Paginator.ui.NextPageLink = function (p) {
    _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "NextPageLink", 1717);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1718);
this.paginator = p;

    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1720);
p.on('destroy',this.destroy,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1721);
p.after('recordOffsetChange', this.update,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1722);
p.after('rowsPerPageChange', this.update,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1723);
p.after('totalRecordsChange', this.update,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1724);
p.after('disabledChange', this.update,this);

    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1726);
p.after('nextPageLinkClassChange', this.rebuild, this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1727);
p.after('nextPageLinkLabelChange', this.rebuild, this);
};

/**
 * CSS class assigned to the link/span
 * @attribute nextPageLinkClass
 * @default 'yui-paginator-next'
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1735);
Paginator.ATTRS.nextPageLinkClass =
{
    value : Y.ClassNameManager.getClassName(Paginator.NAME, 'next'),
    validator : Y.Lang.isString
};

/**
 * Used as innerHTML for the next page link/span.
 * @attribute nextPageLinkLabel
 * @default 'next &gt;'
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1746);
Paginator.ATTRS.nextPageLinkLabel =
{
    value : 'next &gt;',
    validator : Y.Lang.isString
};

_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1752);
Paginator.ui.NextPageLink.prototype = {

    /**
     * Currently placed HTMLElement node
     * @property current
     * @type HTMLElement
     * @private
     */
    current   : null,

    /**
     * Link node
     * @property link
     * @type HTMLElement
     * @private
     */
    link      : null,

    /**
     * Span node (inactive link)
     * @property span
     * @type HTMLElement
     * @private
     */
    span      : null,


    /**
     * Removes the link/span node and clears event listeners
     * @method destroy
     * @private
     */
    destroy : function () {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "destroy", 1784);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1785);
this.link.remove(true);
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1786);
this.span.remove(true);
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1787);
this.current = this.link = this.span = null;
    },

    /**
     * Generate the nodes and return the appropriate node given the current
     * pagination state.
     * @method render
     * @param id_base {string} used to create unique ids for generated nodes
     * @return {HTMLElement}
     */
    render : function (id_base) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "render", 1797);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1798);
var p     = this.paginator,
            c     = p.get('nextPageLinkClass'),
            label = p.get('nextPageLinkLabel'),
            last  = p.getTotalPages();

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1803);
if (this.link) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1804);
this.link.remove(true);
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1805);
this.span.remove(true);
        }

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1808);
this.link = Y.Node.create(
            '<a href="#" id="'+id_base+'-next-link">'+label+'</a>');
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1810);
this.link.set('className', c);
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1811);
this.link.on('click',this.onClick,this);

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1813);
this.span = Y.Node.create(
            '<span id="'+id_base+'-next-span">'+label+'</span>');
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1815);
this.span.set('className', c);

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1817);
this.current = p.getCurrentPage() === last ? this.span : this.link;

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1819);
return this.current;
    },

    /**
     * Swap the link and span nodes if appropriate.
     * @method update
     * @param e {CustomEvent} The calling change event
     */
    update : function (e) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "update", 1827);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1828);
if (e && e.prevVal === e.newVal) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1829);
return;
        }

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1832);
var last = this.paginator.getTotalPages(),
            par  = this.current ? this.current.get('parentNode') : null;

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1835);
if (this.paginator.getCurrentPage() !== last && !this.paginator.get('disabled')) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1836);
if (par && this.current === this.span) {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1837);
par.replaceChild(this.link,this.current);
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1838);
this.current = this.link;
            }
        } else {_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1840);
if (this.current === this.link) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1841);
if (par) {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1842);
par.replaceChild(this.span,this.current);
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1843);
this.current = this.span;
            }
        }}
    },

    /**
     * Rebuild the markup.
     * @method rebuild
     * @param e {CustomEvent} The calling change event
     */
    rebuild : function (e) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "rebuild", 1853);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1854);
if (e && e.prevVal === e.newVal) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1855);
return;
        }

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1858);
var p     = this.paginator,
            c     = p.get('nextPageLinkClass'),
            label = p.get('nextPageLinkLabel');

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1862);
this.link.set('className', c);
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1863);
this.link.set('innerHTML', label);

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1865);
this.span.set('className', c);
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1866);
this.span.set('innerHTML', label);
    },

    /**
     * Listener for the link's onclick event.  Passes to setPage method.
     * @method onClick
     * @param e {DOMEvent} The click event
     */
    onClick : function (e) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "onClick", 1874);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1875);
e.halt();
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1876);
this.paginator.setPage(this.paginator.getNextPage());
    }
};
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 * @module gallery-paginator
 */

/**
 * ui Component to generate the page links
 *
 * @class Paginator.ui.PageLinks
 * @constructor
 * @param p {Pagintor} Paginator instance to attach to
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1896);
Paginator.ui.PageLinks = function (p) {
    _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "PageLinks", 1896);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1897);
this.paginator = p;

    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1899);
p.on('destroy',this.destroy,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1900);
p.after('recordOffsetChange',this.update,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1901);
p.after('rowsPerPageChange',this.update,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1902);
p.after('totalRecordsChange',this.update,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1903);
p.after('disabledChange',this.update,this);

    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1905);
p.after('pageLinksContainerClassChange', this.rebuild,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1906);
p.after('pageLinkClassChange', this.rebuild,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1907);
p.after('currentPageClassChange', this.rebuild,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1908);
p.after('pageLinksChange', this.rebuild,this);
};

/**
 * CSS class assigned to the span containing the page links.
 * @attribute pageLinksContainerClass
 * @default 'yui-paginator-pages'
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1916);
Paginator.ATTRS.pageLinksContainerClass =
{
    value : Y.ClassNameManager.getClassName(Paginator.NAME, 'pages'),
    validator : Y.Lang.isString
};

/**
 * CSS class assigned to each page link/span.
 * @attribute pageLinkClass
 * @default 'yui-paginator-page'
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1927);
Paginator.ATTRS.pageLinkClass =
{
    value : Y.ClassNameManager.getClassName(Paginator.NAME, 'page'),
    validator : Y.Lang.isString
};

/**
 * CSS class assigned to the current page span.
 * @attribute currentPageClass
 * @default 'yui-paginator-current-page'
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1938);
Paginator.ATTRS.currentPageClass =
{
    value : Y.ClassNameManager.getClassName(Paginator.NAME, 'current-page'),
    validator : Y.Lang.isString
};

/**
 * Maximum number of page links to display at one time.
 * @attribute pageLinks
 * @default 10
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1949);
Paginator.ATTRS.pageLinks =
{
    value : 10,
    validator : Paginator.isNumeric
};

/**
 * Function used generate the innerHTML for each page link/span.  The
 * function receives as parameters the page number and a reference to the
 * paginator object.
 * @attribute pageLabelBuilder
 * @default function (page, paginator) { return page; }
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1962);
Paginator.ATTRS.pageLabelBuilder =
{
    value : function (page, paginator) { _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "value", 1964);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1964);
return page; },
    validator : Y.Lang.isFunction
};

/**
 * Calculates start and end page numbers given a current page, attempting
 * to keep the current page in the middle
 * @static
 * @method calculateRange
 * @param {int} currentPage  The current page
 * @param {int} [totalPages] Maximum number of pages
 * @param {int} [numPages]   Preferred number of pages in range
 * @return {Array} [start_page_number, end_page_number]
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1978);
Paginator.ui.PageLinks.calculateRange = function (currentPage,totalPages,numPages) {
    _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "calculateRange", 1978);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1979);
var UNLIMITED = Paginator.VALUE_UNLIMITED,
        start, end, delta;

    // Either has no pages, or unlimited pages.  Show none.
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1983);
if (!currentPage || numPages === 0 || totalPages === 0 ||
        (totalPages === UNLIMITED && numPages === UNLIMITED)) {
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1985);
return [0,-1];
    }

    // Limit requested pageLinks if there are fewer totalPages
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1989);
if (totalPages !== UNLIMITED) {
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1990);
numPages = numPages === UNLIMITED ?
                    totalPages :
                    Math.min(numPages,totalPages);
    }

    // Determine start and end, trying to keep current in the middle
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1996);
start = Math.max(1,Math.ceil(currentPage - (numPages/2)));
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1997);
if (totalPages === UNLIMITED) {
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 1998);
end = start + numPages - 1;
    } else {
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2000);
end = Math.min(totalPages, start + numPages - 1);
    }

    // Adjust the start index when approaching the last page
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2004);
delta = numPages - (end - start + 1);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2005);
start = Math.max(1, start - delta);

    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2007);
return [start,end];
};


_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2011);
Paginator.ui.PageLinks.prototype = {

    /**
     * Current page
     * @property current
     * @type number
     * @private
     */
    current     : 0,

    /**
     * Span node containing the page links
     * @property container
     * @type HTMLElement
     * @private
     */
    container   : null,


    /**
     * Removes the page links container node and clears event listeners
     * @method destroy
     * @private
     */
    destroy : function () {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "destroy", 2035);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2036);
this.container.remove(true);
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2037);
this.container = null;
    },

    /**
     * Generate the nodes and return the container node containing page links
     * appropriate to the current pagination state.
     * @method render
     * @param id_base {string} used to create unique ids for generated nodes
     * @return {HTMLElement}
     */
    render : function (id_base) {

        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "render", 2047);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2049);
if (this.container) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2050);
this.container.remove(true);
        }

        // Set up container
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2054);
this.container = Y.Node.create(
            '<span id="'+id_base+'-pages"></span>');
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2056);
this.container.on('click',this.onClick,this);

        // Call update, flagging a need to rebuild
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2059);
this.update({newVal : null, rebuild : true});

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2061);
return this.container;
    },

    /**
     * Update the links if appropriate
     * @method update
     * @param e {CustomEvent} The calling change event
     */
    update : function (e) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "update", 2069);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2070);
if (e && e.prevVal === e.newVal) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2071);
return;
        }

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2074);
var p           = this.paginator,
            currentPage = p.getCurrentPage();

        // Replace content if there's been a change
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2078);
if (this.current !== currentPage || !currentPage || e.rebuild) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2079);
var labelBuilder = p.get('pageLabelBuilder'),
                range        = Paginator.ui.PageLinks.calculateRange(
                                currentPage,
                                p.getTotalPages(),
                                p.get('pageLinks')),
                start        = range[0],
                end          = range[1],
                content      = '',
                disabled     = p.get('disabled'),
                i;

            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2090);
for (i = start; i <= end; ++i) {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2091);
if (i === currentPage) {
                    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2092);
content +=
                        '<span class="' + p.get('currentPageClass') + ' ' +
                                          p.get('pageLinkClass') + '">' +
                        labelBuilder(i,p) + '</span>';
                } else {_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2096);
if (disabled) {
                    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2097);
content +=
                        '<span class="' + p.get('pageLinkClass') +
                           ' disabled" page="' + i + '">' + labelBuilder(i,p) + '</span>';
                } else {
                    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2101);
content +=
                        '<a href="#" class="' + p.get('pageLinkClass') +
                           '" page="' + i + '">' + labelBuilder(i,p) + '</a>';
                }}
            }

            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2107);
this.container.set('className', p.get('pageLinksContainerClass'));
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2108);
this.container.set('innerHTML', content);
        }
    },

    /**
     * Force a rebuild of the page links.
     * @method rebuild
     * @param e {CustomEvent} The calling change event
     */
    rebuild     : function (e) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "rebuild", 2117);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2118);
e.rebuild = true;
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2119);
this.update(e);
    },

    /**
     * Listener for the container's onclick event.  Looks for qualifying link
     * clicks, and pulls the page number from the link's page attribute.
     * Sends link's page attribute to the Paginator's setPage method.
     * @method onClick
     * @param e {DOMEvent} The click event
     */
    onClick : function (e) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "onClick", 2129);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2130);
var t = e.target;
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2131);
if (t && t.hasClass(this.paginator.get('pageLinkClass'))) {

            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2133);
e.halt();

            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2135);
this.paginator.setPage(parseInt(t.getAttribute('page'),10));
        }
    }

};
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 * @module gallery-paginator
 */

/**
 * ui Component to generate the link to jump to the previous page.
 *
 * @class Paginator.ui.PreviousPageLink
 * @constructor
 * @param p {Pagintor} Paginator instance to attach to
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2157);
Paginator.ui.PreviousPageLink = function (p) {
    _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "PreviousPageLink", 2157);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2158);
this.paginator = p;

    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2160);
p.on('destroy',this.destroy,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2161);
p.after('recordOffsetChange',this.update,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2162);
p.after('rowsPerPageChange',this.update,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2163);
p.after('totalRecordsChange',this.update,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2164);
p.after('disabledChange',this.update,this);

    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2166);
p.after('previousPageLinkLabelChange',this.update,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2167);
p.after('previousPageLinkClassChange',this.update,this);
};

/**
 * CSS class assigned to the link/span
 * @attribute previousPageLinkClass
 * @default 'yui-paginator-previous'
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2175);
Paginator.ATTRS.previousPageLinkClass =
{
    value : Y.ClassNameManager.getClassName(Paginator.NAME, 'previous'),
    validator : Y.Lang.isString
};

/**
 * Used as innerHTML for the previous page link/span.
 * @attribute previousPageLinkLabel
 * @default '&lt; prev'
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2186);
Paginator.ATTRS.previousPageLinkLabel =
{
    value : '&lt; prev',
    validator : Y.Lang.isString
};

_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2192);
Paginator.ui.PreviousPageLink.prototype = {

    /**
     * Currently placed HTMLElement node
     * @property current
     * @type HTMLElement
     * @private
     */
    current   : null,

    /**
     * Link node
     * @property link
     * @type HTMLElement
     * @private
     */
    link      : null,

    /**
     * Span node (inactive link)
     * @property span
     * @type HTMLElement
     * @private
     */
    span      : null,


    /**
     * Removes the link/span node and clears event listeners
     * @method destroy
     * @private
     */
    destroy : function () {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "destroy", 2224);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2225);
this.link.remove(true);
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2226);
this.span.remove(true);
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2227);
this.current = this.link = this.span = null;
    },

    /**
     * Generate the nodes and return the appropriate node given the current
     * pagination state.
     * @method render
     * @param id_base {string} used to create unique ids for generated nodes
     * @return {HTMLElement}
     */
    render : function (id_base) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "render", 2237);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2238);
var p     = this.paginator,
            c     = p.get('previousPageLinkClass'),
            label = p.get('previousPageLinkLabel');

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2242);
if (this.link) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2243);
this.link.remove(true);
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2244);
this.span.remove(true);
        }

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2247);
this.link= Y.Node.create(
            '<a href="#" id="'+id_base+'-prev-link">'+label+'</a>');
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2249);
this.link.set('className', c);
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2250);
this.link.on('click',this.onClick,this);

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2252);
this.span = Y.Node.create(
            '<span id="'+id_base+'-prev-span">'+label+'</span>');
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2254);
this.span.set('className', c);

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2256);
this.current = p.getCurrentPage() > 1 ? this.link : this.span;
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2257);
return this.current;
    },

    /**
     * Swap the link and span nodes if appropriate.
     * @method update
     * @param e {CustomEvent} The calling change event
     */
    update : function (e) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "update", 2265);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2266);
if (e && e.prevVal === e.newVal) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2267);
return;
        }

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2270);
var par = this.current ? this.current.get('parentNode') : null;
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2271);
if (this.paginator.getCurrentPage() > 1 && !this.paginator.get('disabled')) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2272);
if (par && this.current === this.span) {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2273);
par.replaceChild(this.link,this.current);
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2274);
this.current = this.link;
            }
        } else {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2277);
if (par && this.current === this.link) {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2278);
par.replaceChild(this.span,this.current);
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2279);
this.current = this.span;
            }
        }
    },

    /**
     * Listener for the link's onclick event.  Passes to setPage method.
     * @method onClick
     * @param e {DOMEvent} The click event
     */
    onClick : function (e) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "onClick", 2289);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2290);
e.halt();
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2291);
this.paginator.setPage(this.paginator.getPreviousPage());
    }
};
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 * @module gallery-paginator
 */

/**
 * ui Component to generate the rows-per-page dropdown
 *
 * @class Paginator.ui.RowsPerPageDropdown
 * @constructor
 * @param p {Pagintor} Paginator instance to attach to
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2311);
Paginator.ui.RowsPerPageDropdown = function (p) {
    _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "RowsPerPageDropdown", 2311);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2312);
this.paginator = p;

    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2314);
p.on('destroy',this.destroy,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2315);
p.after('rowsPerPageChange',this.update,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2316);
p.after('totalRecordsChange',this._handleTotalRecordsChange,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2317);
p.after('disabledChange',this.update,this);

    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2319);
p.after('rowsPerPageDropdownClassChange',this.rebuild,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2320);
p.after('rowsPerPageDropdownTitleChange',this.rebuild,this);
    _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2321);
p.after('rowsPerPageOptionsChange',this.rebuild,this);
};

/**
 * CSS class assigned to the select node
 * @attribute rowsPerPageDropdownClass
 * @default 'yui-paginator-rpp-options'
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2329);
Paginator.ATTRS.rowsPerPageDropdownClass =
{
    value : Y.ClassNameManager.getClassName(Paginator.NAME, 'rpp-options'),
    validator : Y.Lang.isString
};

/**
 * CSS class assigned to the select node
 * @attribute rowsPerPageDropdownTitle
 * @default 'Rows per page'
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2340);
Paginator.ATTRS.rowsPerPageDropdownTitle =
{
    value : 'Rows per page',
    validator : Y.Lang.isString
};

/**
 * Array of available rows-per-page sizes.  Converted into select options.
 * Array values may be positive integers or object literals in the form<br>
 * { value : NUMBER, text : STRING }
 * @attribute rowsPerPageOptions
 * @default []
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2353);
Paginator.ATTRS.rowsPerPageOptions =
{
    value : [],
    validator : Y.Lang.isArray
};

_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2359);
Paginator.ui.RowsPerPageDropdown.prototype = {

    /**
     * select node
     * @property select
     * @type HTMLElement
     * @private
     */
    select  : null,


    /**
     * option node for the optional All value
     *
     * @property all
     * @type HTMLElement
     * @protected
     */
    all : null,


    /**
     * Removes the select node and clears event listeners
     * @method destroy
     * @private
     */
    destroy : function () {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "destroy", 2385);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2386);
this.select.remove().destroy(true);
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2387);
this.all = this.select = null;
    },

    /**
     * Generate the select and option nodes and returns the select node.
     * @method render
     * @param id_base {string} used to create unique ids for generated nodes
     * @return {HTMLElement}
     */
    render : function (id_base) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "render", 2396);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2397);
if (this.select) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2398);
this.select.remove().destroy(true);
        }

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2401);
this.select = Y.Node.create(
            '<select id="'+id_base+'-rpp"></select>');
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2403);
this.select.on('change',this.onChange,this);

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2405);
this.rebuild();

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2407);
return this.select;
    },

    /**
     * (Re)generate the select options.
     * @method rebuild
     */
    rebuild : function (e) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "rebuild", 2414);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2415);
var p       = this.paginator,
            sel     = this.select,
            options = p.get('rowsPerPageOptions'),
            opts    = Y.Node.getDOMNode(sel).options,
            opt,cfg,val,i,len;

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2421);
this.all = null;

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2423);
sel.set('className', this.paginator.get('rowsPerPageDropdownClass'));
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2424);
sel.set('title', this.paginator.get('rowsPerPageDropdownTitle'));

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2426);
for (i = 0, len = options.length; i < len; ++i) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2427);
cfg = options[i];
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2428);
opt = opts[i] || sel.appendChild(Y.Node.create('<option/>'));
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2429);
val = Y.Lang.isValue(cfg.value) ? cfg.value : cfg;
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2430);
opt.set('innerHTML', Y.Lang.isValue(cfg.text) ? cfg.text : cfg);

            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2432);
if (Y.Lang.isString(val) && val.toLowerCase() === 'all') {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2433);
this.all  = opt;
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2434);
opt.set('value', p.get('totalRecords'));
            } else{
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2436);
opt.set('value', val);
            }

        }

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2441);
while (opts.length > options.length) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2442);
sel.get('lastChild').remove(true);
        }

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2445);
this.update();
    },

    /**
     * Select the appropriate option if changed.
     * @method update
     * @param e {CustomEvent} The calling change event
     */
    update : function (e) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "update", 2453);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2454);
if (e && e.prevVal === e.newVal) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2455);
return;
        }

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2458);
var rpp     = this.paginator.get('rowsPerPage')+'',
            options = Y.Node.getDOMNode(this.select).options,
            i,len;

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2462);
for (i = 0, len = options.length; i < len; ++i) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2463);
if (options[i].value === rpp) {
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2464);
options[i].selected = true;
                _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2465);
break;
            }
        }

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2469);
this.select.set('disabled', this.paginator.get('disabled'));
    },

    /**
     * Listener for the select's onchange event.  Sent to setRowsPerPage method.
     * @method onChange
     * @param e {DOMEvent} The change event
     */
    onChange : function (e) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "onChange", 2477);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2478);
this.paginator.setRowsPerPage(
            parseInt(Y.Node.getDOMNode(this.select).options[this.select.get('selectedIndex')].value,10));
    },

    /**
     * Updates the all option value (and Paginator's rowsPerPage attribute if
     * necessary) in response to a change in the Paginator's totalRecords.
     *
     * @method _handleTotalRecordsChange
     * @param e {Event} attribute change event
     * @protected
     */
    _handleTotalRecordsChange : function (e) {
        _yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "_handleTotalRecordsChange", 2490);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2491);
if (!this.all || (e && e.prevVal === e.newVal)) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2492);
return;
        }

        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2495);
this.all.set('value', e.newVal);
        _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2496);
if (this.all.get('selected')) {
            _yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2497);
this.paginator.set('rowsPerPage',e.newVal);
        }
    }
};
/**
 * @module gallery-paginator
 */

/**********************************************************************
 * Adds per-page error notification to Paginator.ui.PageLinks.
 *
 * @class Paginator.ui.ValidationPageLinks
 * @constructor
 * @param p {Pagintor} Paginator instance to attach to
 */

_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2513);
Paginator.ui.ValidationPageLinks = function(
	/* Paginator */	p)
{
	_yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "ValidationPageLinks", 2513);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2516);
Paginator.ui.ValidationPageLinks.superclass.constructor.call(this, p);

	_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2518);
p.after('pageStatusChange', this.rebuild, this);
};

_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2521);
var vpl_status_prefix = 'yui3-has';

/**
 * Array of status strings for each page.  If the status value for a page
 * is not empty, it is used to build a CSS class for the page:
 * yui3-has&lt;status&gt;
 *
 * @attribute pageStatus
 */
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2530);
Paginator.ATTRS.pageStatus =
{
	value:     [],
	validator: Y.Lang.isArray
};

_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2536);
Y.extend(Paginator.ui.ValidationPageLinks, Paginator.ui.PageLinks,
{
	update: function(e)
	{
		_yuitest_coverfunc("/build/gallery-paginator/gallery-paginator.js", "update", 2538);
_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2540);
if (e && e.prevVal === e.newVal)
		{
			_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2542);
return;
		}

		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2545);
var currentPage	= this.paginator.getCurrentPage();

		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2547);
var curr_markup = '<span class="{link} {curr} {status}">{label}</span>';
		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2548);
var link_markup = '<a href="#" class="{link} {status}" page="{page}">{label}</a>';
		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2549);
var dis_markup  = '<span class="{link} disabled {status}" page="{page}">{label}</span>';

		_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2551);
if (this.current !== currentPage || !currentPage || e.rebuild)
		{
			_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2553);
var linkClass    = this.paginator.get('pageLinkClass'),
				status       = this.paginator.get('pageStatus'),
				labelBuilder = this.paginator.get('pageLabelBuilder'),
				disabled     = this.paginator.get('disabled');

			_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2558);
var range =
				Paginator.ui.PageLinks.calculateRange(
					currentPage, this.paginator.getTotalPages(), this.paginator.get('pageLinks'));

			_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2562);
var content = '';
			_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2563);
for (var i=range[0]; i<=range[1]; i++)
			{
				_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2565);
content += Y.Lang.sub(i === currentPage ? curr_markup : disabled ? dis_markup : link_markup,
				{
					link:   linkClass,
					curr:   (i === currentPage ? this.paginator.get('currentPageClass') : ''),
					status: status[i-1] ? vpl_status_prefix + status[i-1] : '',
					page:   i,
					label:  labelBuilder(i, this.paginator)
				});
			}

			_yuitest_coverline("/build/gallery-paginator/gallery-paginator.js", 2575);
this.container.set('innerHTML', content);
		}
	}

});


}, 'gallery-2012.09.26-20-36' ,{skinnable:true, requires:['widget','event-key','substitute']});
