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
function Paginator(config) {
    Paginator.superclass.constructor.call(this, config);
}


// Static members
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
        return isFinite(+n) ? +n : null;
    }

},true);


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
            var total = this.get('totalRecords');
            if (Paginator.isNumeric(val)) {
                val = +val;
                return total === Paginator.VALUE_UNLIMITED || total > val ||
                       (total === 0 && val === 0);
            }

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
        var UNLIMITED = Paginator.VALUE_UNLIMITED,
            initialPage, records, perPage, startIndex;

        this._selfSubscribe();

        // Calculate the initial record offset
        initialPage = this.get('initialPage');
        records     = this.get('totalRecords');
        perPage     = this.get('rowsPerPage');
        if (initialPage > 1 && perPage !== UNLIMITED) {
            startIndex = (initialPage - 1) * perPage;
            if (records === UNLIMITED || startIndex < records) {
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
        this.after('totalRecordsChange',this.updateVisibility,this);
        this.after('alwaysVisibleChange',this.updateVisibility,this);

        // Fire the pageChange event when appropriate
        this.after('totalRecordsChange',this._handleStateChange,this);
        this.after('recordOffsetChange',this._handleStateChange,this);
        this.after('rowsPerPageChange',this._handleStateChange,this);

        // Update recordOffset when totalRecords is reduced below
        this.after('totalRecordsChange',this._syncRecordOffset,this);
    },

    renderUI : function () {
        this._renderTemplate(
            this.get('contentBox'),
            this.get('template'),
            Paginator.ID_BASE + this.get('id'),
            true);

        // Show the widget if appropriate
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
        if (!container) {
            return;
        }

        // Hide the container while its contents are rendered
        container.setStyle('display','none');

        container.addClass(this.getClassName());

        var className = this.getClassName('ui');

        // Place the template innerHTML, adding marker spans to the template
        // html to indicate drop zones for ui components
        container.set('innerHTML', template.replace(/\{([a-z0-9_ \-]+)\}/gi,
            '<span class="'+className+' '+className+'-$1"></span>'));

        // Replace each marker with the ui component's render() output
        container.all('span.'+className).each(function(node)
        {
            this.renderUIComponent(node, id_base);
        },
        this);

        if (!hide) {
            // Show the container allowing page reflow
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
        var par    = marker.get('parentNode'),
            clazz  = this.getClassName('ui'),
            name   = new RegExp(clazz+'-(\\w+)').exec(marker.get('className')),
            UIComp = name && Paginator.ui[name[1]],
            comp;

        if (Y.Lang.isFunction(UIComp)) {
            comp = new UIComp(this);
            if (Y.Lang.isFunction(comp.render)) {
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
        var alwaysVisible = this.get('alwaysVisible'),
            totalRecords,visible,rpp,rppOptions,i,len,rppOption,rppValue;

        if (!e || e.type === 'alwaysVisibleChange' || !alwaysVisible) {
            totalRecords = this.get('totalRecords');
            visible      = true;
            rpp          = this.get('rowsPerPage');
            rppOptions   = this.get('rowsPerPageOptions');

            if (Y.Lang.isArray(rppOptions)) {
                for (i = 0, len = rppOptions.length; i < len; ++i) {
                    rppOption = rppOptions[i];
                    rppValue  = Y.Lang.isValue(rppOption.value) ? rppOption.value : rppOption;
                    rpp       = Math.min(rpp,rppValue);
                }
            }

            if (totalRecords !== Paginator.VALUE_UNLIMITED &&
                totalRecords <= rpp) {
                visible = false;
            }

            visible = visible || alwaysVisible;
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
        var records = this.get('totalRecords'),
            perPage = this.get('rowsPerPage');

        // rowsPerPage not set.  Can't calculate
        if (!perPage) {
            return null;
        }

        if (records === Paginator.VALUE_UNLIMITED) {
            return Paginator.VALUE_UNLIMITED;
        }

        return Math.ceil(records/perPage);
    },

    /**
     * Does the requested page have any records?
     * @method hasPage
     * @param page {number} the page in question
     * @return {boolean}
     */
    hasPage : function (page) {
        if (!Y.Lang.isNumber(page) || page < 1) {
            return false;
        }

        var totalPages = this.getTotalPages();

        return (totalPages === Paginator.VALUE_UNLIMITED || totalPages >= page);
    },

    /**
     * Get the page number corresponding to the current record offset.
     * @method getCurrentPage
     * @return {number}
     */
    getCurrentPage : function () {
        var perPage = this.get('rowsPerPage');
        if (!perPage || !this.get('totalRecords')) {
            return 0;
        }
        return Math.floor(this.get('recordOffset') / perPage) + 1;
    },

    /**
     * Are there records on the next page?
     * @method hasNextPage
     * @return {boolean}
     */
    hasNextPage : function () {
        var currentPage = this.getCurrentPage(),
            totalPages  = this.getTotalPages();

        return currentPage && (totalPages === Paginator.VALUE_UNLIMITED || currentPage < totalPages);
    },

    /**
     * Get the page number of the next page, or null if the current page is the
     * last page.
     * @method getNextPage
     * @return {number}
     */
    getNextPage : function () {
        return this.hasNextPage() ? this.getCurrentPage() + 1 : null;
    },

    /**
     * Is there a page before the current page?
     * @method hasPreviousPage
     * @return {boolean}
     */
    hasPreviousPage : function () {
        return (this.getCurrentPage() > 1);
    },

    /**
     * Get the page number of the previous page, or null if the current page
     * is the first page.
     * @method getPreviousPage
     * @return {number}
     */
    getPreviousPage : function () {
        return (this.hasPreviousPage() ? this.getCurrentPage() - 1 : 1);
    },

    /**
     * Get the start and end record indexes of the specified page.
     * @method getPageRecords
     * @param [page] {number} The page (current page if not specified)
     * @return {Array} [start_index, end_index]
     */
    getPageRecords : function (page) {
        if (!Y.Lang.isNumber(page)) {
            page = this.getCurrentPage();
        }

        var perPage = this.get('rowsPerPage'),
            records = this.get('totalRecords'),
            start, end;

        if (!page || !perPage) {
            return null;
        }

        start = (page - 1) * perPage;
        if (records !== Paginator.VALUE_UNLIMITED) {
            if (start >= records) {
                return null;
            }
            end = Math.min(start + perPage, records) - 1;
        } else {
            end = start + perPage - 1;
        }

        return [start,end];
    },

    /**
     * Set the current page to the provided page number if possible.
     * @method setPage
     * @param newPage {number} the new page number
     * @param silent {boolean} whether to forcibly avoid firing the changeRequest event
     */
    setPage : function (page,silent) {
        if (this.hasPage(page) && page !== this.getCurrentPage()) {
            if (silent) {
                this.set('recordOffset', (page - 1) * this.get('rowsPerPage'));
            } else {
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
        return this.get('rowsPerPage');
    },

    /**
     * Set the number of rows per page.
     * @method setRowsPerPage
     * @param rpp {number} the new number of rows per page
     * @param silent {boolean} whether to forcibly avoid firing the changeRequest event
     */
    setRowsPerPage : function (rpp,silent) {
        if (Paginator.isNumeric(rpp) && +rpp > 0 &&
            +rpp !== this.get('rowsPerPage')) {
            if (silent) {
                this.set('rowsPerPage',rpp);
            } else {
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
        return this.get('totalRecords');
    },

    /**
     * Set the total number of records.
     * @method setTotalRecords
     * @param total {number} the new total number of records
     * @param silent {boolean} whether to forcibly avoid firing the changeRequest event
     */
    setTotalRecords : function (total,silent) {
        if (Paginator.isNumeric(total) && +total >= 0 &&
            +total !== this.get('totalRecords')) {
            if (silent) {
                this.set('totalRecords',total);
            } else {
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
        if (Paginator.isNumeric(offset) && +offset >= 0 &&
            +offset !== this.get('recordOffset')) {
            if (silent) {
                this.set('recordOffset',offset);
            } else {
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
        var UNLIMITED = Paginator.VALUE_UNLIMITED,
            M = Math, max = M.max, ceil = M.ceil,
            currentState, state, offset;

        function normalizeOffset(offset,total,rpp) {
            if (offset <= 0 || total === 0) {
                return 0;
            }
            if (total === UNLIMITED || total > offset) {
                return offset - (offset % rpp);
            }
            return total - (total % rpp || rpp);
        }

        currentState = {
            paginator    : this,
            totalRecords : this.get('totalRecords'),
            rowsPerPage  : this.get('rowsPerPage'),
            records      : this.getPageRecords()
        };
        currentState.recordOffset = normalizeOffset(
                                        this.get('recordOffset'),
                                        currentState.totalRecords,
                                        currentState.rowsPerPage);
        currentState.page = ceil(currentState.recordOffset /
                                 currentState.rowsPerPage) + 1;

        if (!changes) {
            return currentState;
        }

        state = {
            paginator    : this,
            before       : currentState,

            rowsPerPage  : changes.rowsPerPage || currentState.rowsPerPage,
            totalRecords : (Paginator.isNumeric(changes.totalRecords) ?
                                max(changes.totalRecords,UNLIMITED) :
                                +currentState.totalRecords)
        };

        if (state.totalRecords === 0) {
            state.recordOffset =
            state.page         = 0;
        } else {
            offset = Paginator.isNumeric(changes.page) ?
                        (changes.page - 1) * state.rowsPerPage :
                        Paginator.isNumeric(changes.recordOffset) ?
                            +changes.recordOffset :
                            currentState.recordOffset;

            state.recordOffset = normalizeOffset(offset,
                                    state.totalRecords,
                                    state.rowsPerPage);

            state.page = ceil(state.recordOffset / state.rowsPerPage) + 1;
        }

        state.records = [ state.recordOffset,
                          state.recordOffset + state.rowsPerPage - 1 ];

        // limit upper index to totalRecords - 1
        if (state.totalRecords !== UNLIMITED &&
            state.recordOffset < state.totalRecords && state.records &&
            state.records[1] > state.totalRecords - 1) {
            state.records[1] = state.totalRecords - 1;
        }

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
        if (Y.Lang.isObject(state)) {
            // get flux state based on current state with before state as well
            this._state = this.getState({});

            // use just the state props from the input obj
            state = {
                page         : state.page,
                rowsPerPage  : state.rowsPerPage,
                totalRecords : state.totalRecords,
                recordOffset : state.recordOffset
            };

            // calculate recordOffset from page if recordOffset not specified.
            // not using Y.Lang.isNumber for support of numeric strings
            if (state.page && state.recordOffset === undefined) {
                state.recordOffset = (state.page - 1) *
                    (state.rowsPerPage || this.get('rowsPerPage'));
            }

            this._batch = true;
            this._pageChanged = false;

            for (var k in state) {
                if (state.hasOwnProperty(k)) {
                    this.set(k,state[k]);
                }
            }

            this._batch = false;
            
            if (this._pageChanged) {
                this._pageChanged = false;

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
        var v = e.newVal,rpp,state;
        if (e.prevVal !== v) {
            if (v !== Paginator.VALUE_UNLIMITED) {
                rpp = this.get('rowsPerPage');

                if (rpp && this.get('recordOffset') >= v) {
                    state = this.getState({
                        totalRecords : e.prevVal,
                        recordOffset : this.get('recordOffset')
                    });

                    this.set('recordOffset', state.before.recordOffset);
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
        if (e.prevVal !== e.newVal) {
            var change = this._state || {},
                state;

            change[e.type.replace(/^.+?:/,'').replace(/Change$/,'')] = e.prevVal;
            state = this.getState(change);

            if (state.page !== state.before.page) {
                if (this._batch) {
                    this._pageChanged = true;
                } else {
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
        if (Y.Lang.isObject(state)) {
            var current = state.before;
            delete state.before;
            this.fire('pageChange',{
                type      : 'pageChange',
                prevVal   : state.page,
                newVal    : current.page,
                prevState : state,
                newState  : current
            });
        }
    }
});

Y.Paginator = Paginator;
