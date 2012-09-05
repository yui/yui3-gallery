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
_yuitest_coverage["/build/gallery-datatable-paginator/gallery-datatable-paginator.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-datatable-paginator/gallery-datatable-paginator.js",
    code: []
};
_yuitest_coverage["/build/gallery-datatable-paginator/gallery-datatable-paginator.js"].code=["YUI.add('gallery-datatable-paginator', function(Y) {","","/**","  Defines a Y.DataTable class extension to add capability to support a Paginator View-Model and allow","   paging of actively displayed data within the DT instance.","","  Works with either client-side pagination (i.e. local data, usually in form of JS Array) or","   in conjunction with remote server-side pagination, via either DataSource or ModelSync.REST.","","  Allows for dealing with sorted data, wherein the local data is sorted in place, and in the case of remote data the \"sortBy\"","  attribute is passed to the remote server.",""," <h4>Usage</h4>","","        var dtable = new Y.DataTable({","            columns:    [ 'firstName','lastName','state','age', 'grade' ],","            data:       enrollment.records,","            scrollable: 'y',","            height:     '450px',","            sortBy:     [{lastName:'asc'}, {grade:-1}],","            paginator:  new PaginatorView({","					model: 		new PaginatorModel({itemsPerPage:50, page:3}),","					container:	'#pagContA'","            }),","            resizePaginator: true","        });",""," <h4>Client OR Server Pagination</h4>",""," A determination of whether the source of `data` is either \"local\" data (i.e. a Javascript Array or Y.ModelList), or is"," provided from a server (either DataSource or ModelSync.REST) is made in the method [_dataChange](#method__dataChange)."," We use a \"duck-type\" evaluation, which may not be completely robust, but has worked so far in testing. The process used to"," evaluate the \"source\" of data can be reviewed in the _dataChange method.",""," For server-side pagination, the OUTGOING request must include (as a minimum);  `page`, `totalItems` and `sortBy` querystring"," parameters.  Likewise, the INCOMING (returned response) must include as \"meta-data\" at least `totalItems`, plus any other"," PaginatorModel attributes.   The key item within the returned response is `totalItems'.",""," We have provided an attribute [serverPaginationMap](#attr_serverPaginationMap) as an object hash to translate both outgoing"," querystring parameter names and incoming (response returned) parameter names in order to match what is expected by the"," PaginatorModel.  Please see this attribute or the examples for how to utilize this map for your use case.",""," <h4>Loading the \"data\" For a Page</h4>"," Once the \"source of data\" is known, the method [processPageRequest](#method_processPageRequest) fires on a `pageChange`.",""," For the case of \"local data\", i.e. where `_pagDataSrc:'local'`, the existing buffer of data is sliced according to the pagination"," state, and the data is loaded silently, and `this.syncUI()` is fired to refresh the DT.",""," The case of \"remote data\" (from a server) is actually more straightforward.  For the case of ModelSync.REST remote data the"," current \"pagination state\" is processed through the [serverPaginationMap](#attr_serverPaginationMap) hash (to convert to"," queryString format) and the ModelList.load() method is called.  For the case of a DataSource, a similar approach is used where"," the [requestStringTemplate](#attr_requestStringTemplate) is read, processed through the serverPaginationMap hash and a"," datasource.load() request is fired.",""," This extension DOES NOT \"cache\" pages for remote data, it simply inserts the full returned data into the DT.  So as a consequence,"," a pagination state change for remote data involves a simple request sent to the server source (either DataSource or ModelSync.REST)"," and the response results are loaded in the DT as in any other \"response\".","","  @module datatable","  @class Y.DataTable.Paginator","  @extensionfor DataTable","  @extends Y.DataTable","  @version 1.0.1","  @since 3.6.0","  @author Todd Smith",""," **/","function DtPaginator() {}","","","DtPaginator.ATTRS = {","","    /**","     * Adds a paginator view (specifically Y.PaginatorView) instance to the DataTable.","     *","     * @attribute paginator","     * @type Y.View","     * @default null","     */","    paginator:  {","        value : null,","        setter: '_setPaginator'","    },","","    /**","     * Defines a hash to convert expected PaginatorModel attributes to outgoing request queryString","     * or returned (incoming response) meta data back to PaginatorModel attributes.","     *","     * @example","     *          serverPaginationMap : {","     *              totalItems :    'totalRows',","     *              page :          {toServer:'requestedPage', fromServer:'returnedPageNo'},","     *              itemIndexStart: 'startRecord',","     *              itemsPerPage:   'numPageRows'","     *          }","     *","     *          // would map to an outgoing request of (for url:/data/orders) ;","     *          /data/orders/{cust_no}?requestedPage={requestedPage}&numPageRows={numPageRows}","     *","     *          // for a JSON response of ...","     *          { \"reply\":\"ok\", \"totalRows\":478, \"returnedPageNo\":17, \"startRecord\":340, \"numPageRows\":20,","     *            \"results\":[ {...} 20 total rows returned {...}] }","     *","     * For default value, see [_defPagMap](#method__defPagMap)","     *","     * @attribute serverPaginationMap","     * @type {Object}","     * @default","     */","    serverPaginationMap:{","        valueFn:    '_defPagMap',","        setter:     '_setPagMap',","        validator:  Y.Lang.isObject","    },","","    /**","     * Attribute to track the full pagination state (i.e. the PaginatorModel) attributes all in one object.","     * Also includes the `sortBy` property internally.","     *","     * @attribute paginationState","     * @type Object","     * @default unset","     * @beta","     */","    paginationState: {","        valueFn: '_defPagState',","        setter:  '_setPagState',","        getter:  '_getPagState'","    },","","    /**","     * (SERVER DataSource only!)","     * Includes the request queryString for a DataSource request (only!), which contains the pagination","     * replacement strings to be appended to the DataSource's \"source\" string.","     *","     * @example","     *          requestStringTemplate:  \"?currentPage={page}&pageRows={itemsPerPage}&sorting={sortBy}\"","     *","     * Note, the replacement parameters within this template should match the settings from the PaginatorModel","     * attributes.","     *","     * In cases where your server expects differing query parameters, you can utilize ATTR [serverPaginationMap](#attr_serverPaginationMap).","     *","     * @attribute requestStringTemplate","     * @type String","     * @default \"\"","     */","    requestStringTemplate: {","        value:      \"\",","        validator:  Y.Lang.isString","    },","","    /**","     * Flag to indicate if the Paginator container should be re-sized to the DataTable size","     * after rendering is complete.","     *","     * This attribute works best with a \"bar\" type of Paginator that is intended to look integral with a DataTable.","     *","     * @attribute paginatorResize","     * @type Boolean","     * @default false","     */","    paginatorResize: {","        value:      false,","        validator:  Y.Lang.isBoolean","    }","","};","","","Y.mix( DtPaginator.prototype, {","    /**","     * Holder for the \"original\" un-paged data that the DataTable was based upon.","     *","     * This property is stored as an Array, from the original \"data\" ModelList, only used","     * for case of \"local\" data, is sliced as needed to re-set each data Page.","     *","     * Populated in method [_dataChange](#method__dataChange)","     *","     * @property _mlistArray","     * @type Array","     * @default null","     * @static","     * @since 3.6.0","     * @protected","     */","    _mlistArray: null,","","","    /**","     * Placeholder for a text flag indicating the source of \"data\" for this DataTable,","     *  this is set initially in method _dataChange.","     *","     * Set to either 'local', 'ds' or 'mlist' in method [_dataChange](#method__dataChange)","     *","     * Populated in _dataChange.  Utilized in processPageRequest","     *","     * @property _pagDataSrc","     * @type String","     * @default null","     * @static","     * @since 3.6.0","     * @protected","     */","    _pagDataSrc: null,","","    /**","     * A convenience property holder for the DataTable's \"paginator\" attribute.","     *","     * @property paginator","     * @type {Y.PaginatorView|View}","     * @default null","     * @public","     * @since 3.6.0","     */","    paginator: null,","","    /**","     * A convenience property holder for the Paginator-View's Model attribute.","     * @property pagModel","     * @type {Y.PaginatorModel|Model}","     * @default null","     * @public","     * @since 3.6.0","     */","    pagModel: null,","","/*----------------------------------------------------------------------------------------------------------*/","/*                  L I F E - C Y C L E    M E T H O D S                                                    */","/*----------------------------------------------------------------------------------------------------------*/","","   /**","    * This initializer sets up the listeners related to the original DataTable instance, to the","    *  PaginatorModel changes and related to the underlying \"data\" attribute the DT is based upon.","    *","    * @method initializer","    * @protected","    * @return this","    * @chainable","    */","    initializer: function(){","       //","       // Setup listeners on PaginatorModel and DT changes ...","       //   Only do these if the \"paginator\" ATTR is set","       //","        if ( this.get('paginator') ) {","","            this.paginator = this.get('paginator');","            this._eventHandles.paginator = [];","","            // Set listener for ModelSync.REST custom event \"response\" ... after .parse is processed","            this._eventHandles.paginator.push( this.data.after( \"response\", this._afterMLResponse, this) );","","            // If PaginatorModel exists, set listener for its pageChange event ...","            if ( this.paginator.get('model') ) {","                this.pagModel = this.get('paginator').get('model');","                this._eventHandles.paginator.push( this.pagModel.after( 'pageChange', Y.bind(this._pageChangeListener,this) ) );","            }","","            // General listener for changes to underlying modellist ...","            //this.set('data',[]);","            if ( this.get('data') && this.get('data').size()>0  )","                this._setLocalData();","            this._eventHandles.paginator.push( this.data.after([\"load\",\"change\",\"add\",\"remove\",\"reset\"], Y.bind(this._dataChange,this)) );","","            // TODO: Need to come up with a way to listen to \"sort\" on \"local\" data ...","            // this._eventHandles.paginator.push( this.data.on(\"sort\", Y.bind(this._onSortData,this)) );","","            // Added listener to sniff for DataSource existence, for its binding","            this._eventHandles.paginator.push( Y.Do.after( this._afterSyncUI, this, '_syncUI', this) );","","           // Try to determine when DT is finished rendering records, this is hacky .. but seems to work","            this._eventHandles.paginator.push( this.after( 'renderView', this._notifyRender) );","","        }","","","        return this;","    },","","    /**","     * Destructor to clean up listener event handlers and the internal storage buffer.","     *","     * @method destructor","     * @protected","     */","    destructor: function () {","        Y.Array.each( this._eventHandles.paginator,function(item){","            item.detach();","        });","        this._mlistArray = null;","        this._eventHandles.paginator = null;","    },","","","/*----------------------------------------------------------------------------------------------------------*/","/*                  P U B L I C      M E T H O D S                                                          */","/*----------------------------------------------------------------------------------------------------------*/","","    /**","     * Primary workhorse method that is fired when the Paginator \"page\" changes,","     *   and returns a new subset of data for the DT","     *   or sends a new request to a remote source to populate the DT","     *","     *  @method processPageRequest","     *  @param  {Integer} page_no Current page number to change to","     *  @param  {Object} pag_state Pagination state object (this is NOT populated in local .. non-server type pagination) including;","     *      @param {Integer} pag_state.indexStart Starting index returned from server response","     *      @param {Integer} pag_state.numRecs Count of records returned from the response","     *  @public","     *  @returns nothing","     */","    processPageRequest: function(page_no, pag_state) {","        var rdata = this._mlistArray,","            pagv  = this.get('paginator'),","            pagm  = pagv.get('model'),","            rpp   = pagm.get('itemsPerPage');","","        var istart, iend, nitem;","    //","    //  Get paginator indices","    //","        if ( pag_state ) {","            istart = pag_state.itemIndexStart;","            iend   = pag_state.itemIndexEnd || istart + rpp;","        } else {","            // usually here on first pass thru, when paginator initiates ...","            istart = ( page_no - 1 ) * rpp;","            iend = istart + rpp;","            iend = ( iend > rdata.length ) ? rdata.length : iend;","            nitem = iend - istart + 1;","        }","","    //","    //  For SERVER based pagination, store the translated replacement object","    //  for the remote request converted from `serverPaginationMap` to","    //  a \"normalized\" format","    //","        if ( this._pagDataSrc !== 'local' ) {","","            var url_obj     = {},","                prop_istart = this._srvPagMapObj('itemIndexStart'),","                prop_nitems = this._srvPagMapObj('totalItems'),","                prop_ipp    = this._srvPagMapObj('itemsPerPage');","","            url_obj[prop_istart] = istart;","            url_obj[prop_ipp]    = rpp;","            url_obj['sortBy']    = Y.JSON.stringify( this.get('sortBy') || {} ) || null;","","            // mix-in the model ATTRS with the url_obj","            url_obj = Y.mix(url_obj,this.pagModel.getAttrs(true));","","            // sometimes 'page' isn't included in getAttrs, make sure it is ...","            url_obj['page']  = this.pagModel.get('page');","","        }","","    //","    //  This is the main guts of retrieving the records,","    //    we already figured out if this was 'local' or 'server' based.","    //","    //   Now, process this page request thru either local data array slicing or","    //    simply firing off a remote server request ...","    //","        switch(this._pagDataSrc) {","","            case 'ds':","","                // fire off a request to DataSource, mixing in as the request string","                //  with ATTR `requestStringTemplate` with the \"url_obj\" map","","                var rqst_str = this.get('requestStringTemplate') || '';","","                this.datasource.load({","                    request:    Y.Lang.sub(rqst_str,url_obj)","                });","","                break;","","            case 'mlist':","            case 'rest':","","                // fire off a ModelSync.REST load \"read\" request, note that it mixes","                //   the ModelList ATTRS with 'url_obj' in creating the request","                this.data.load(url_obj);","","                break;","","            default:","","                var data_new = rdata.slice(istart,iend);","                this.data.reset( data_new, {silent:true} );","                this.syncUI();","","        }","","        this.resizePaginator();","        this.fire('pageUpdate',{ state:pag_state, view:pagv });","    },","","    /**","     * Method to sync the container for the paginator View with the underlying DataTable","     *  'table' element.","     *","     *  Unfortunately, there isn't a distinct, definitive 'render' complete event due to","     *   DT's complex rendering, so I use a timer function to attempt a resize.","     *","     * @method resizePaginator","     * @public","     */","    resizePaginator: function() {","        if ( this.get('paginatorResize') !== true )  return;","","        //TODO:  this is a total HACK, should figure a better way than later ...","       // if ( !this._syncPaginatorSize() )","            Y.later( 25, this, function(){ this._syncPaginatorSize(); } );","    },","","    /**","     * Method to re-initialize the original data, mostly targeted at local data","     *  when a new 'data' is set, untested.","     *","     * @method dataReset","     * @param {Array|ModelList} data Data to be reset to ... either as a JS Array or a Y.ModelList","     * @public","     * @returns this","     * @chainable","     * @beta","     */","    dataReset: function(data){","        if ( data instanceof Y.ModelList ) {","            this._mlistArray = [];","            data.each(function(model){","                this._mlistArray.push( model.toJSON() );","            },this);","        } else if (Y.Lang.isArray(data) ) {","            this._mlistArray = [];","            this._mlistArray = data;","        }","        this.processPageRequest(this.pagModel.get('page'));","        return this;","    },","","","/*----------------------------------------------------------------------------------------------------------*/","/*                  P R I V A T E    M E T H O D S                                                          */","/*----------------------------------------------------------------------------------------------------------*/","","    /**","     * Helper method that searches the 'serverPaginationMap' ATTR and returns the requested","     * property, including if it is nested as \"toServer\" or \"fromServer\" subattribute.","     * ( Used in processPageRequest )","     *","     * @example","     *    _srvPagMapObj(\"itemsPerPage\")","     *         { itemsPerPage : 'numPageRecords' }","     *         { itemsPerPage : {toServer:'pageRows', fromServer:'pageRecordCount' }","     *","     * @method _srvPagMapObj","     * @param {String} prop Property name to search for (expected matches in PaginatorModel ATTRS)","     * @param {String} dir Directional (optional), either \"to\" (matches toServer) or \"from\" (matches fromServer)","     * @return {String} rprop Attribute name from RHS of map","     * @private","     */","    _srvPagMapObj: function(prop,dir){","        var spm   = this.get('serverPaginationMap') || {},","            rprop = spm[prop];","","        dir   = dir || 'to';","","        if ( rprop && dir == 'to' && rprop.toServer )   rprop = rprop.toServer;","        if ( rprop && dir != 'to' && rprop.fromServer ) rprop = rprop.fromServer;","","        return rprop;","    },","","","    /**","     * Method called to ensure that the _dataChange method is called, specifically for the case","     * where a DataSource is used (which is hard to track when it is plugged in ...)","     *","     * @method _afterSyncUI","     * @param o","     * @private","     */","    _afterSyncUI: function(o){","        if ( !this._pagDataSrc) this._dataChange({});","    },","","    /**","     * Method fires after every variety of change event on the DT's \"data\" setting, which","     * is used to sense the origin of where the \"data\" comes from, and sets the","     * this._pagDataSrc property to either \"ds\", \"mlist\" or \"local\".","     *","     * @method _dataChange","     * @param o","     * @private","     */","    _dataChange: function(o){","        if ( this._pagDataSrc ) return;","","        // For no DS and a ModelSync.REST with \"url\" static property === ModelList","        if ( !this.datasource && this.data.url && !this._pagDataSrc ) this._pagDataSrc = 'mlist';","","        // For a DS and no ModelSync.REST === DataSource","        if ( this.datasource && !this.data.url && !this._pagDataSrc ) {","            this._pagDataSrc = 'ds';","            this._eventHandles.paginator.push( this.datasource.get('datasource').after([\"*:response\",\"response\"], Y.bind(this._afterDSResponse,this) ) );","        }","","        // For neither ModelList or DS source .... but \"data\" supplied === Local data","        if ( !this._pagDataSrc && o.models && Y.Lang.isArray(o.models) && o.models.length>0 ) {","            o.preventDefault();","            this._setLocalData(o);","/*            this._pagDataSrc = 'local';","","            //","            //   Store the full local data in property _mlistArray (as an array)","            //","            this._mlistArray = [];","            Y.Array.each(o.models,function(model){","                this._mlistArray.push( model.toJSON() );","            },this);","","            // Set the PaginatorModel totalItems count and process the page change.","            this.pagModel.set('totalItems', o.models.length );","            this.processPageRequest(this.pagModel.get('page'));","*/        }","    },","","","    _setLocalData: function(){","        var mdata = this.get('data');","","        this._pagDataSrc = 'local';","","        //","        //   Store the full local data in property _mlistArray (as an array)","        //","        this._mlistArray = [];","        mdata.each(function(model){","            this._mlistArray.push( model.toJSON() );","        },this);","","        // Set the PaginatorModel totalItems count and process the page change.","        this.pagModel.set('totalItems', mdata.size() );","        this.processPageRequest(this.pagModel.get('page'));","    },","","    /**","     * Method fires after DataTable/DataSource plugin fires it's \"response\" event, which includes","     * the response object, including {results:, meta:} properties.","     *","     * @method _afterDSResponse","     * @param {Object} resp Includes results and meta properties","     * @param {Array} resp.results Array of result Objects","     * @param {Object} resp.meta Object including properties mapped to include pagination properties","     * @private","     */","    _afterDSResponse: function(e) {","        var resp          = e.response,","            totalItemProp = this.get('serverPaginationMap')['totalItems'] || null;","","        if ( resp.results && resp.results.length>0  ) {","            if ( totalItemProp && resp.meta && resp.meta[totalItemProp] && resp.meta[totalItemProp] > 0 ) {","                this.pagModel.set('totalItems', resp.meta[totalItemProp] );","            }","        }","        this.resizePaginator();","    },","","","    /**","     * Method fires after custom ModelSync.REST \"load\" action fires a user-defined \"response\" event.","     * This can be implemented by extending ModelSync.REST by adding .parse() method which fires","     * a custom \"response\" event including {results:, meta:} properties.","     *","     * Usage Note: The user is REQUIRED to provide a custom \"response\" event in the ModelList","     *  parse overridden function in order for this to work properly.","     *","     * @method _afterMLResponse","     * @param {Object} resp Includes results and meta properties","     * @param {Array} resp.results Array of result Objects","     * @param {Object} resp.meta Object including properties mapped to include pagination properties","     * @private","     */","    _afterMLResponse: function(resp){","        var totalItemProp = this.get('serverPaginationMap')['totalItems'] || null;","        if ( resp.results && resp.results.length>0  ) {","            if ( totalItemProp && resp.meta && resp.meta[totalItemProp] && resp.meta[totalItemProp] > 0 ) {","                this.pagModel.set('totalItems', resp.meta[totalItemProp] );","            }","        }","        this.resizePaginator();","    },","","    /**","     * Listener that fires when the Model's 'pageChange' fires, this extracts the current page from the state object and then","     *  hooks up the processPageRequest method.","     *","     * @method _pageListener","     * @param {Object} o Change event facade for the PaginatorModel 'pageChange' event","     * @private","     */","    _pageChangeListener: function(o){","        var newPage = +o.newVal || 1;","        this.processPageRequest(newPage, this.pagModel.getAttrs(true));","    },","","","    /**","     * Method to adjust the CSS width of the paginator container and set it to the","     *  width of the underlying DT.","     *","     * @method _syncPaginatorSize","     * @returns Boolean if success","     * @private","     */","    _syncPaginatorSize: function() {","        var tblCont = this.get('boundingBox').one('table');","        if ( !tblCont ) return false;","","        this.paginator.get('container').setStyle('width',tblCont.getComputedStyle('width'));","        this.fire('paginatorResize');","        return true;","    },","","","    /**","     * Default 'valueFn' function setting for the ATTR `serverPaginationMap`, where","     * the defaults are simply the member names.","     * @method _defPagMap","     * @return {Object} obj","     * @private","     */","    _defPagMap: function() {","        return    {","            totalItems:     'totalItems',","            itemsPerPage:   'itemsPerPage',","            page:           'page',","            itemIndexStart: 'itemIndexStart'","        };","    },","","    /**","     * Setter method for the `serverPaginationMap` attribute, which can be used to","     *  merge the \"default\" object with the user-supplied object.","     * @method _setPagMap","     * @param val","     * @return {Object}","     * @private","     */","    _setPagMap: function(val) {","        var defObj = this._defPagMap();","        return Y.merge(defObj,val);","    },","","","    /**","     * Sets default for the \"paginationState\" DataTable attribute complex object as an","     * object with all of PaginatorModel ATTRS and the `sortBy` setting.","     * @method _defPagState","     * @return {Object}","     * @private","     */","    _defPagState: function(){","        var rtn = {};","        if ( this.get('paginator') && this.get('paginator').model ) {","            rtn = this.get('paginator').model.getAttrs();","            rtn.sortBy = this.get('sortBy');","        }","        return rtn;","    },","","    /**","     * Getter for the \"paginationState\" DataTable attribute complex object.","     * @method _gefPagState","     * @return {Object}","     * @private","     */","    _getPagState: function(){","        var rtn = (this.pagModel) ? this.pagModel.getAttrs(true) : {};","        delete rtn.initialized;","        rtn.sortBy = this.get('sortBy');","        return rtn;","    },","","    /**","     * Sets default for the \"paginationState\" DataTable attribute","     *  complex object.","     * @method _sefPagState","     * @return {Object}","     * @private","     */","    _setPagState: function(val) {","        if ( val.initialized !== undefined )","            delete val.initialized;","        if ( val.sortBy !== undefined )","            this.set('sortBy',val.sortBy);","","        if ( this.pagModel ) this.pagModel.setAttrs(val);","        return val;","    },","","","    /**","     * This is a setter for the 'paginator' attribute, primarily to set the public property `paginator` to the","     * attribute value.","     *","     * @method _setPaginator","     * @param {PaginatorView|View} val The PaginatorView instance to set","     * @return {*}","     * @private","     */","    _setPaginator : function(val){","        if ( !val ) return;","        this.paginator = val;","        this.initializer();","        return val;","    },","","","","    /**","     * A method that fires after the DataTable `renderView` method completes, that is *approximately* when","     * the DataTable has finished rendering.","     *","     * @method _notifyRender","     * @private","     */","    _notifyRender: function() {","        if ( this.get('paginatorResize') === true )","            this.resizePaginator();","        this.fire('render');","    }","","","","    /**","     * Fires after the DataTable 'renderView' event fires","     * @event render","     */","","    /**","     * Fires after the DataTable-Paginator updates the page data and/or sends the remote request for more data","     * @event pageUpdate","     * @param {Object} pagStatus containing following;","     *  @param {Object} pagStatus.pag_state Of Paginator Model `getAttrs()` as an Object","     *  @param {View} pagStatus.view Instance of the Paginator View","     */","","    /**","     * Fires after the Paginator is resized to match the DataTable size (requires attribute \"paginatorResize:true\")","     * @event resize","     */","","});","","Y.DataTable.Paginator = DtPaginator;","Y.Base.mix(Y.DataTable, [Y.DataTable.Paginator]);","","","}, 'gallery-2012.09.05-20-01' ,{requires:['base-build', 'datatable-base', 'event-custom'], skinnable:false});"];
_yuitest_coverage["/build/gallery-datatable-paginator/gallery-datatable-paginator.js"].lines = {"1":0,"68":0,"71":0,"171":0,"246":0,"248":0,"249":0,"252":0,"255":0,"256":0,"257":0,"262":0,"263":0,"264":0,"270":0,"273":0,"278":0,"288":0,"289":0,"291":0,"292":0,"314":0,"319":0,"323":0,"324":0,"325":0,"328":0,"329":0,"330":0,"331":0,"339":0,"341":0,"346":0,"347":0,"348":0,"351":0,"354":0,"365":0,"372":0,"374":0,"378":0,"385":0,"387":0,"391":0,"392":0,"393":0,"397":0,"398":0,"412":0,"416":0,"431":0,"432":0,"433":0,"434":0,"436":0,"437":0,"438":0,"440":0,"441":0,"466":0,"469":0,"471":0,"472":0,"474":0,"487":0,"500":0,"503":0,"506":0,"507":0,"508":0,"512":0,"513":0,"514":0,"533":0,"535":0,"540":0,"541":0,"542":0,"546":0,"547":0,"561":0,"564":0,"565":0,"566":0,"569":0,"588":0,"589":0,"590":0,"591":0,"594":0,"606":0,"607":0,"620":0,"621":0,"623":0,"624":0,"625":0,"637":0,"654":0,"655":0,"667":0,"668":0,"669":0,"670":0,"672":0,"682":0,"683":0,"684":0,"685":0,"696":0,"697":0,"698":0,"699":0,"701":0,"702":0,"716":0,"717":0,"718":0,"719":0,"732":0,"733":0,"734":0,"759":0,"760":0};
_yuitest_coverage["/build/gallery-datatable-paginator/gallery-datatable-paginator.js"].functions = {"DtPaginator:68":0,"initializer:241":0,"(anonymous 2):288":0,"destructor:287":0,"processPageRequest:313":0,"(anonymous 3):416":0,"resizePaginator:411":0,"(anonymous 4):433":0,"dataReset:430":0,"_srvPagMapObj:465":0,"_afterSyncUI:486":0,"_dataChange:499":0,"(anonymous 5):541":0,"_setLocalData:532":0,"_afterDSResponse:560":0,"_afterMLResponse:587":0,"_pageChangeListener:605":0,"_syncPaginatorSize:619":0,"_defPagMap:636":0,"_setPagMap:653":0,"_defPagState:666":0,"_getPagState:681":0,"_setPagState:695":0,"_setPaginator:715":0,"_notifyRender:731":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-datatable-paginator/gallery-datatable-paginator.js"].coveredLines = 124;
_yuitest_coverage["/build/gallery-datatable-paginator/gallery-datatable-paginator.js"].coveredFunctions = 26;
_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 1);
YUI.add('gallery-datatable-paginator', function(Y) {

/**
  Defines a Y.DataTable class extension to add capability to support a Paginator View-Model and allow
   paging of actively displayed data within the DT instance.

  Works with either client-side pagination (i.e. local data, usually in form of JS Array) or
   in conjunction with remote server-side pagination, via either DataSource or ModelSync.REST.

  Allows for dealing with sorted data, wherein the local data is sorted in place, and in the case of remote data the "sortBy"
  attribute is passed to the remote server.

 <h4>Usage</h4>

        var dtable = new Y.DataTable({
            columns:    [ 'firstName','lastName','state','age', 'grade' ],
            data:       enrollment.records,
            scrollable: 'y',
            height:     '450px',
            sortBy:     [{lastName:'asc'}, {grade:-1}],
            paginator:  new PaginatorView({
					model: 		new PaginatorModel({itemsPerPage:50, page:3}),
					container:	'#pagContA'
            }),
            resizePaginator: true
        });

 <h4>Client OR Server Pagination</h4>

 A determination of whether the source of `data` is either "local" data (i.e. a Javascript Array or Y.ModelList), or is
 provided from a server (either DataSource or ModelSync.REST) is made in the method [_dataChange](#method__dataChange).
 We use a "duck-type" evaluation, which may not be completely robust, but has worked so far in testing. The process used to
 evaluate the "source" of data can be reviewed in the _dataChange method.

 For server-side pagination, the OUTGOING request must include (as a minimum);  `page`, `totalItems` and `sortBy` querystring
 parameters.  Likewise, the INCOMING (returned response) must include as "meta-data" at least `totalItems`, plus any other
 PaginatorModel attributes.   The key item within the returned response is `totalItems'.

 We have provided an attribute [serverPaginationMap](#attr_serverPaginationMap) as an object hash to translate both outgoing
 querystring parameter names and incoming (response returned) parameter names in order to match what is expected by the
 PaginatorModel.  Please see this attribute or the examples for how to utilize this map for your use case.

 <h4>Loading the "data" For a Page</h4>
 Once the "source of data" is known, the method [processPageRequest](#method_processPageRequest) fires on a `pageChange`.

 For the case of "local data", i.e. where `_pagDataSrc:'local'`, the existing buffer of data is sliced according to the pagination
 state, and the data is loaded silently, and `this.syncUI()` is fired to refresh the DT.

 The case of "remote data" (from a server) is actually more straightforward.  For the case of ModelSync.REST remote data the
 current "pagination state" is processed through the [serverPaginationMap](#attr_serverPaginationMap) hash (to convert to
 queryString format) and the ModelList.load() method is called.  For the case of a DataSource, a similar approach is used where
 the [requestStringTemplate](#attr_requestStringTemplate) is read, processed through the serverPaginationMap hash and a
 datasource.load() request is fired.

 This extension DOES NOT "cache" pages for remote data, it simply inserts the full returned data into the DT.  So as a consequence,
 a pagination state change for remote data involves a simple request sent to the server source (either DataSource or ModelSync.REST)
 and the response results are loaded in the DT as in any other "response".

  @module datatable
  @class Y.DataTable.Paginator
  @extensionfor DataTable
  @extends Y.DataTable
  @version 1.0.1
  @since 3.6.0
  @author Todd Smith

 **/
_yuitest_coverfunc("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 68);
function DtPaginator() {}


_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 71);
DtPaginator.ATTRS = {

    /**
     * Adds a paginator view (specifically Y.PaginatorView) instance to the DataTable.
     *
     * @attribute paginator
     * @type Y.View
     * @default null
     */
    paginator:  {
        value : null,
        setter: '_setPaginator'
    },

    /**
     * Defines a hash to convert expected PaginatorModel attributes to outgoing request queryString
     * or returned (incoming response) meta data back to PaginatorModel attributes.
     *
     * @example
     *          serverPaginationMap : {
     *              totalItems :    'totalRows',
     *              page :          {toServer:'requestedPage', fromServer:'returnedPageNo'},
     *              itemIndexStart: 'startRecord',
     *              itemsPerPage:   'numPageRows'
     *          }
     *
     *          // would map to an outgoing request of (for url:/data/orders) ;
     *          /data/orders/{cust_no}?requestedPage={requestedPage}&numPageRows={numPageRows}
     *
     *          // for a JSON response of ...
     *          { "reply":"ok", "totalRows":478, "returnedPageNo":17, "startRecord":340, "numPageRows":20,
     *            "results":[ {...} 20 total rows returned {...}] }
     *
     * For default value, see [_defPagMap](#method__defPagMap)
     *
     * @attribute serverPaginationMap
     * @type {Object}
     * @default
     */
    serverPaginationMap:{
        valueFn:    '_defPagMap',
        setter:     '_setPagMap',
        validator:  Y.Lang.isObject
    },

    /**
     * Attribute to track the full pagination state (i.e. the PaginatorModel) attributes all in one object.
     * Also includes the `sortBy` property internally.
     *
     * @attribute paginationState
     * @type Object
     * @default unset
     * @beta
     */
    paginationState: {
        valueFn: '_defPagState',
        setter:  '_setPagState',
        getter:  '_getPagState'
    },

    /**
     * (SERVER DataSource only!)
     * Includes the request queryString for a DataSource request (only!), which contains the pagination
     * replacement strings to be appended to the DataSource's "source" string.
     *
     * @example
     *          requestStringTemplate:  "?currentPage={page}&pageRows={itemsPerPage}&sorting={sortBy}"
     *
     * Note, the replacement parameters within this template should match the settings from the PaginatorModel
     * attributes.
     *
     * In cases where your server expects differing query parameters, you can utilize ATTR [serverPaginationMap](#attr_serverPaginationMap).
     *
     * @attribute requestStringTemplate
     * @type String
     * @default ""
     */
    requestStringTemplate: {
        value:      "",
        validator:  Y.Lang.isString
    },

    /**
     * Flag to indicate if the Paginator container should be re-sized to the DataTable size
     * after rendering is complete.
     *
     * This attribute works best with a "bar" type of Paginator that is intended to look integral with a DataTable.
     *
     * @attribute paginatorResize
     * @type Boolean
     * @default false
     */
    paginatorResize: {
        value:      false,
        validator:  Y.Lang.isBoolean
    }

};


_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 171);
Y.mix( DtPaginator.prototype, {
    /**
     * Holder for the "original" un-paged data that the DataTable was based upon.
     *
     * This property is stored as an Array, from the original "data" ModelList, only used
     * for case of "local" data, is sliced as needed to re-set each data Page.
     *
     * Populated in method [_dataChange](#method__dataChange)
     *
     * @property _mlistArray
     * @type Array
     * @default null
     * @static
     * @since 3.6.0
     * @protected
     */
    _mlistArray: null,


    /**
     * Placeholder for a text flag indicating the source of "data" for this DataTable,
     *  this is set initially in method _dataChange.
     *
     * Set to either 'local', 'ds' or 'mlist' in method [_dataChange](#method__dataChange)
     *
     * Populated in _dataChange.  Utilized in processPageRequest
     *
     * @property _pagDataSrc
     * @type String
     * @default null
     * @static
     * @since 3.6.0
     * @protected
     */
    _pagDataSrc: null,

    /**
     * A convenience property holder for the DataTable's "paginator" attribute.
     *
     * @property paginator
     * @type {Y.PaginatorView|View}
     * @default null
     * @public
     * @since 3.6.0
     */
    paginator: null,

    /**
     * A convenience property holder for the Paginator-View's Model attribute.
     * @property pagModel
     * @type {Y.PaginatorModel|Model}
     * @default null
     * @public
     * @since 3.6.0
     */
    pagModel: null,

/*----------------------------------------------------------------------------------------------------------*/
/*                  L I F E - C Y C L E    M E T H O D S                                                    */
/*----------------------------------------------------------------------------------------------------------*/

   /**
    * This initializer sets up the listeners related to the original DataTable instance, to the
    *  PaginatorModel changes and related to the underlying "data" attribute the DT is based upon.
    *
    * @method initializer
    * @protected
    * @return this
    * @chainable
    */
    initializer: function(){
       //
       // Setup listeners on PaginatorModel and DT changes ...
       //   Only do these if the "paginator" ATTR is set
       //
        _yuitest_coverfunc("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", "initializer", 241);
_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 246);
if ( this.get('paginator') ) {

            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 248);
this.paginator = this.get('paginator');
            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 249);
this._eventHandles.paginator = [];

            // Set listener for ModelSync.REST custom event "response" ... after .parse is processed
            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 252);
this._eventHandles.paginator.push( this.data.after( "response", this._afterMLResponse, this) );

            // If PaginatorModel exists, set listener for its pageChange event ...
            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 255);
if ( this.paginator.get('model') ) {
                _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 256);
this.pagModel = this.get('paginator').get('model');
                _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 257);
this._eventHandles.paginator.push( this.pagModel.after( 'pageChange', Y.bind(this._pageChangeListener,this) ) );
            }

            // General listener for changes to underlying modellist ...
            //this.set('data',[]);
            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 262);
if ( this.get('data') && this.get('data').size()>0  )
                {_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 263);
this._setLocalData();}
            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 264);
this._eventHandles.paginator.push( this.data.after(["load","change","add","remove","reset"], Y.bind(this._dataChange,this)) );

            // TODO: Need to come up with a way to listen to "sort" on "local" data ...
            // this._eventHandles.paginator.push( this.data.on("sort", Y.bind(this._onSortData,this)) );

            // Added listener to sniff for DataSource existence, for its binding
            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 270);
this._eventHandles.paginator.push( Y.Do.after( this._afterSyncUI, this, '_syncUI', this) );

           // Try to determine when DT is finished rendering records, this is hacky .. but seems to work
            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 273);
this._eventHandles.paginator.push( this.after( 'renderView', this._notifyRender) );

        }


        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 278);
return this;
    },

    /**
     * Destructor to clean up listener event handlers and the internal storage buffer.
     *
     * @method destructor
     * @protected
     */
    destructor: function () {
        _yuitest_coverfunc("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", "destructor", 287);
_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 288);
Y.Array.each( this._eventHandles.paginator,function(item){
            _yuitest_coverfunc("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", "(anonymous 2)", 288);
_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 289);
item.detach();
        });
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 291);
this._mlistArray = null;
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 292);
this._eventHandles.paginator = null;
    },


/*----------------------------------------------------------------------------------------------------------*/
/*                  P U B L I C      M E T H O D S                                                          */
/*----------------------------------------------------------------------------------------------------------*/

    /**
     * Primary workhorse method that is fired when the Paginator "page" changes,
     *   and returns a new subset of data for the DT
     *   or sends a new request to a remote source to populate the DT
     *
     *  @method processPageRequest
     *  @param  {Integer} page_no Current page number to change to
     *  @param  {Object} pag_state Pagination state object (this is NOT populated in local .. non-server type pagination) including;
     *      @param {Integer} pag_state.indexStart Starting index returned from server response
     *      @param {Integer} pag_state.numRecs Count of records returned from the response
     *  @public
     *  @returns nothing
     */
    processPageRequest: function(page_no, pag_state) {
        _yuitest_coverfunc("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", "processPageRequest", 313);
_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 314);
var rdata = this._mlistArray,
            pagv  = this.get('paginator'),
            pagm  = pagv.get('model'),
            rpp   = pagm.get('itemsPerPage');

        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 319);
var istart, iend, nitem;
    //
    //  Get paginator indices
    //
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 323);
if ( pag_state ) {
            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 324);
istart = pag_state.itemIndexStart;
            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 325);
iend   = pag_state.itemIndexEnd || istart + rpp;
        } else {
            // usually here on first pass thru, when paginator initiates ...
            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 328);
istart = ( page_no - 1 ) * rpp;
            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 329);
iend = istart + rpp;
            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 330);
iend = ( iend > rdata.length ) ? rdata.length : iend;
            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 331);
nitem = iend - istart + 1;
        }

    //
    //  For SERVER based pagination, store the translated replacement object
    //  for the remote request converted from `serverPaginationMap` to
    //  a "normalized" format
    //
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 339);
if ( this._pagDataSrc !== 'local' ) {

            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 341);
var url_obj     = {},
                prop_istart = this._srvPagMapObj('itemIndexStart'),
                prop_nitems = this._srvPagMapObj('totalItems'),
                prop_ipp    = this._srvPagMapObj('itemsPerPage');

            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 346);
url_obj[prop_istart] = istart;
            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 347);
url_obj[prop_ipp]    = rpp;
            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 348);
url_obj['sortBy']    = Y.JSON.stringify( this.get('sortBy') || {} ) || null;

            // mix-in the model ATTRS with the url_obj
            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 351);
url_obj = Y.mix(url_obj,this.pagModel.getAttrs(true));

            // sometimes 'page' isn't included in getAttrs, make sure it is ...
            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 354);
url_obj['page']  = this.pagModel.get('page');

        }

    //
    //  This is the main guts of retrieving the records,
    //    we already figured out if this was 'local' or 'server' based.
    //
    //   Now, process this page request thru either local data array slicing or
    //    simply firing off a remote server request ...
    //
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 365);
switch(this._pagDataSrc) {

            case 'ds':

                // fire off a request to DataSource, mixing in as the request string
                //  with ATTR `requestStringTemplate` with the "url_obj" map

                _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 372);
var rqst_str = this.get('requestStringTemplate') || '';

                _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 374);
this.datasource.load({
                    request:    Y.Lang.sub(rqst_str,url_obj)
                });

                _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 378);
break;

            case 'mlist':
            case 'rest':

                // fire off a ModelSync.REST load "read" request, note that it mixes
                //   the ModelList ATTRS with 'url_obj' in creating the request
                _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 385);
this.data.load(url_obj);

                _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 387);
break;

            default:

                _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 391);
var data_new = rdata.slice(istart,iend);
                _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 392);
this.data.reset( data_new, {silent:true} );
                _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 393);
this.syncUI();

        }

        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 397);
this.resizePaginator();
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 398);
this.fire('pageUpdate',{ state:pag_state, view:pagv });
    },

    /**
     * Method to sync the container for the paginator View with the underlying DataTable
     *  'table' element.
     *
     *  Unfortunately, there isn't a distinct, definitive 'render' complete event due to
     *   DT's complex rendering, so I use a timer function to attempt a resize.
     *
     * @method resizePaginator
     * @public
     */
    resizePaginator: function() {
        _yuitest_coverfunc("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", "resizePaginator", 411);
_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 412);
if ( this.get('paginatorResize') !== true )  {return;}

        //TODO:  this is a total HACK, should figure a better way than later ...
       // if ( !this._syncPaginatorSize() )
            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 416);
Y.later( 25, this, function(){ _yuitest_coverfunc("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", "(anonymous 3)", 416);
this._syncPaginatorSize(); } );
    },

    /**
     * Method to re-initialize the original data, mostly targeted at local data
     *  when a new 'data' is set, untested.
     *
     * @method dataReset
     * @param {Array|ModelList} data Data to be reset to ... either as a JS Array or a Y.ModelList
     * @public
     * @returns this
     * @chainable
     * @beta
     */
    dataReset: function(data){
        _yuitest_coverfunc("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", "dataReset", 430);
_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 431);
if ( data instanceof Y.ModelList ) {
            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 432);
this._mlistArray = [];
            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 433);
data.each(function(model){
                _yuitest_coverfunc("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", "(anonymous 4)", 433);
_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 434);
this._mlistArray.push( model.toJSON() );
            },this);
        } else {_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 436);
if (Y.Lang.isArray(data) ) {
            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 437);
this._mlistArray = [];
            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 438);
this._mlistArray = data;
        }}
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 440);
this.processPageRequest(this.pagModel.get('page'));
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 441);
return this;
    },


/*----------------------------------------------------------------------------------------------------------*/
/*                  P R I V A T E    M E T H O D S                                                          */
/*----------------------------------------------------------------------------------------------------------*/

    /**
     * Helper method that searches the 'serverPaginationMap' ATTR and returns the requested
     * property, including if it is nested as "toServer" or "fromServer" subattribute.
     * ( Used in processPageRequest )
     *
     * @example
     *    _srvPagMapObj("itemsPerPage")
     *         { itemsPerPage : 'numPageRecords' }
     *         { itemsPerPage : {toServer:'pageRows', fromServer:'pageRecordCount' }
     *
     * @method _srvPagMapObj
     * @param {String} prop Property name to search for (expected matches in PaginatorModel ATTRS)
     * @param {String} dir Directional (optional), either "to" (matches toServer) or "from" (matches fromServer)
     * @return {String} rprop Attribute name from RHS of map
     * @private
     */
    _srvPagMapObj: function(prop,dir){
        _yuitest_coverfunc("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", "_srvPagMapObj", 465);
_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 466);
var spm   = this.get('serverPaginationMap') || {},
            rprop = spm[prop];

        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 469);
dir   = dir || 'to';

        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 471);
if ( rprop && dir == 'to' && rprop.toServer )   {rprop = rprop.toServer;}
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 472);
if ( rprop && dir != 'to' && rprop.fromServer ) {rprop = rprop.fromServer;}

        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 474);
return rprop;
    },


    /**
     * Method called to ensure that the _dataChange method is called, specifically for the case
     * where a DataSource is used (which is hard to track when it is plugged in ...)
     *
     * @method _afterSyncUI
     * @param o
     * @private
     */
    _afterSyncUI: function(o){
        _yuitest_coverfunc("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", "_afterSyncUI", 486);
_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 487);
if ( !this._pagDataSrc) {this._dataChange({});}
    },

    /**
     * Method fires after every variety of change event on the DT's "data" setting, which
     * is used to sense the origin of where the "data" comes from, and sets the
     * this._pagDataSrc property to either "ds", "mlist" or "local".
     *
     * @method _dataChange
     * @param o
     * @private
     */
    _dataChange: function(o){
        _yuitest_coverfunc("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", "_dataChange", 499);
_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 500);
if ( this._pagDataSrc ) {return;}

        // For no DS and a ModelSync.REST with "url" static property === ModelList
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 503);
if ( !this.datasource && this.data.url && !this._pagDataSrc ) {this._pagDataSrc = 'mlist';}

        // For a DS and no ModelSync.REST === DataSource
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 506);
if ( this.datasource && !this.data.url && !this._pagDataSrc ) {
            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 507);
this._pagDataSrc = 'ds';
            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 508);
this._eventHandles.paginator.push( this.datasource.get('datasource').after(["*:response","response"], Y.bind(this._afterDSResponse,this) ) );
        }

        // For neither ModelList or DS source .... but "data" supplied === Local data
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 512);
if ( !this._pagDataSrc && o.models && Y.Lang.isArray(o.models) && o.models.length>0 ) {
            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 513);
o.preventDefault();
            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 514);
this._setLocalData(o);
/*            this._pagDataSrc = 'local';

            //
            //   Store the full local data in property _mlistArray (as an array)
            //
            this._mlistArray = [];
            Y.Array.each(o.models,function(model){
                this._mlistArray.push( model.toJSON() );
            },this);

            // Set the PaginatorModel totalItems count and process the page change.
            this.pagModel.set('totalItems', o.models.length );
            this.processPageRequest(this.pagModel.get('page'));
*/        }
    },


    _setLocalData: function(){
        _yuitest_coverfunc("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", "_setLocalData", 532);
_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 533);
var mdata = this.get('data');

        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 535);
this._pagDataSrc = 'local';

        //
        //   Store the full local data in property _mlistArray (as an array)
        //
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 540);
this._mlistArray = [];
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 541);
mdata.each(function(model){
            _yuitest_coverfunc("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", "(anonymous 5)", 541);
_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 542);
this._mlistArray.push( model.toJSON() );
        },this);

        // Set the PaginatorModel totalItems count and process the page change.
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 546);
this.pagModel.set('totalItems', mdata.size() );
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 547);
this.processPageRequest(this.pagModel.get('page'));
    },

    /**
     * Method fires after DataTable/DataSource plugin fires it's "response" event, which includes
     * the response object, including {results:, meta:} properties.
     *
     * @method _afterDSResponse
     * @param {Object} resp Includes results and meta properties
     * @param {Array} resp.results Array of result Objects
     * @param {Object} resp.meta Object including properties mapped to include pagination properties
     * @private
     */
    _afterDSResponse: function(e) {
        _yuitest_coverfunc("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", "_afterDSResponse", 560);
_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 561);
var resp          = e.response,
            totalItemProp = this.get('serverPaginationMap')['totalItems'] || null;

        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 564);
if ( resp.results && resp.results.length>0  ) {
            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 565);
if ( totalItemProp && resp.meta && resp.meta[totalItemProp] && resp.meta[totalItemProp] > 0 ) {
                _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 566);
this.pagModel.set('totalItems', resp.meta[totalItemProp] );
            }
        }
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 569);
this.resizePaginator();
    },


    /**
     * Method fires after custom ModelSync.REST "load" action fires a user-defined "response" event.
     * This can be implemented by extending ModelSync.REST by adding .parse() method which fires
     * a custom "response" event including {results:, meta:} properties.
     *
     * Usage Note: The user is REQUIRED to provide a custom "response" event in the ModelList
     *  parse overridden function in order for this to work properly.
     *
     * @method _afterMLResponse
     * @param {Object} resp Includes results and meta properties
     * @param {Array} resp.results Array of result Objects
     * @param {Object} resp.meta Object including properties mapped to include pagination properties
     * @private
     */
    _afterMLResponse: function(resp){
        _yuitest_coverfunc("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", "_afterMLResponse", 587);
_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 588);
var totalItemProp = this.get('serverPaginationMap')['totalItems'] || null;
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 589);
if ( resp.results && resp.results.length>0  ) {
            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 590);
if ( totalItemProp && resp.meta && resp.meta[totalItemProp] && resp.meta[totalItemProp] > 0 ) {
                _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 591);
this.pagModel.set('totalItems', resp.meta[totalItemProp] );
            }
        }
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 594);
this.resizePaginator();
    },

    /**
     * Listener that fires when the Model's 'pageChange' fires, this extracts the current page from the state object and then
     *  hooks up the processPageRequest method.
     *
     * @method _pageListener
     * @param {Object} o Change event facade for the PaginatorModel 'pageChange' event
     * @private
     */
    _pageChangeListener: function(o){
        _yuitest_coverfunc("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", "_pageChangeListener", 605);
_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 606);
var newPage = +o.newVal || 1;
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 607);
this.processPageRequest(newPage, this.pagModel.getAttrs(true));
    },


    /**
     * Method to adjust the CSS width of the paginator container and set it to the
     *  width of the underlying DT.
     *
     * @method _syncPaginatorSize
     * @returns Boolean if success
     * @private
     */
    _syncPaginatorSize: function() {
        _yuitest_coverfunc("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", "_syncPaginatorSize", 619);
_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 620);
var tblCont = this.get('boundingBox').one('table');
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 621);
if ( !tblCont ) {return false;}

        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 623);
this.paginator.get('container').setStyle('width',tblCont.getComputedStyle('width'));
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 624);
this.fire('paginatorResize');
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 625);
return true;
    },


    /**
     * Default 'valueFn' function setting for the ATTR `serverPaginationMap`, where
     * the defaults are simply the member names.
     * @method _defPagMap
     * @return {Object} obj
     * @private
     */
    _defPagMap: function() {
        _yuitest_coverfunc("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", "_defPagMap", 636);
_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 637);
return    {
            totalItems:     'totalItems',
            itemsPerPage:   'itemsPerPage',
            page:           'page',
            itemIndexStart: 'itemIndexStart'
        };
    },

    /**
     * Setter method for the `serverPaginationMap` attribute, which can be used to
     *  merge the "default" object with the user-supplied object.
     * @method _setPagMap
     * @param val
     * @return {Object}
     * @private
     */
    _setPagMap: function(val) {
        _yuitest_coverfunc("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", "_setPagMap", 653);
_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 654);
var defObj = this._defPagMap();
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 655);
return Y.merge(defObj,val);
    },


    /**
     * Sets default for the "paginationState" DataTable attribute complex object as an
     * object with all of PaginatorModel ATTRS and the `sortBy` setting.
     * @method _defPagState
     * @return {Object}
     * @private
     */
    _defPagState: function(){
        _yuitest_coverfunc("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", "_defPagState", 666);
_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 667);
var rtn = {};
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 668);
if ( this.get('paginator') && this.get('paginator').model ) {
            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 669);
rtn = this.get('paginator').model.getAttrs();
            _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 670);
rtn.sortBy = this.get('sortBy');
        }
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 672);
return rtn;
    },

    /**
     * Getter for the "paginationState" DataTable attribute complex object.
     * @method _gefPagState
     * @return {Object}
     * @private
     */
    _getPagState: function(){
        _yuitest_coverfunc("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", "_getPagState", 681);
_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 682);
var rtn = (this.pagModel) ? this.pagModel.getAttrs(true) : {};
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 683);
delete rtn.initialized;
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 684);
rtn.sortBy = this.get('sortBy');
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 685);
return rtn;
    },

    /**
     * Sets default for the "paginationState" DataTable attribute
     *  complex object.
     * @method _sefPagState
     * @return {Object}
     * @private
     */
    _setPagState: function(val) {
        _yuitest_coverfunc("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", "_setPagState", 695);
_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 696);
if ( val.initialized !== undefined )
            {_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 697);
delete val.initialized;}
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 698);
if ( val.sortBy !== undefined )
            {_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 699);
this.set('sortBy',val.sortBy);}

        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 701);
if ( this.pagModel ) {this.pagModel.setAttrs(val);}
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 702);
return val;
    },


    /**
     * This is a setter for the 'paginator' attribute, primarily to set the public property `paginator` to the
     * attribute value.
     *
     * @method _setPaginator
     * @param {PaginatorView|View} val The PaginatorView instance to set
     * @return {*}
     * @private
     */
    _setPaginator : function(val){
        _yuitest_coverfunc("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", "_setPaginator", 715);
_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 716);
if ( !val ) {return;}
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 717);
this.paginator = val;
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 718);
this.initializer();
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 719);
return val;
    },



    /**
     * A method that fires after the DataTable `renderView` method completes, that is *approximately* when
     * the DataTable has finished rendering.
     *
     * @method _notifyRender
     * @private
     */
    _notifyRender: function() {
        _yuitest_coverfunc("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", "_notifyRender", 731);
_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 732);
if ( this.get('paginatorResize') === true )
            {_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 733);
this.resizePaginator();}
        _yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 734);
this.fire('render');
    }



    /**
     * Fires after the DataTable 'renderView' event fires
     * @event render
     */

    /**
     * Fires after the DataTable-Paginator updates the page data and/or sends the remote request for more data
     * @event pageUpdate
     * @param {Object} pagStatus containing following;
     *  @param {Object} pagStatus.pag_state Of Paginator Model `getAttrs()` as an Object
     *  @param {View} pagStatus.view Instance of the Paginator View
     */

    /**
     * Fires after the Paginator is resized to match the DataTable size (requires attribute "paginatorResize:true")
     * @event resize
     */

});

_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 759);
Y.DataTable.Paginator = DtPaginator;
_yuitest_coverline("/build/gallery-datatable-paginator/gallery-datatable-paginator.js", 760);
Y.Base.mix(Y.DataTable, [Y.DataTable.Paginator]);


}, 'gallery-2012.09.05-20-01' ,{requires:['base-build', 'datatable-base', 'event-custom'], skinnable:false});
