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
function DtPaginator() {}


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
     * Includes the request queryString for a DataSource request (only!), which contains the pagination
     * replacement strings to be appended to the DataSource's "source" string.
     *
     * @example
     *          requestStringTemplate:  "?currentPage={page}&pageRows={itemsPerPage}&sorting={sortBy}"
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
        if ( this.get('paginator') ) {

            this.paginator = this.get('paginator');
            this._eventHandles.paginator = [];

            // Set listener for ModelSync.REST custom event "response" ... after .parse is processed
            this._eventHandles.paginator.push( this.data.after( "response", this._afterMLResponse, this) );

            // If PaginatorModel exists, set listener for its pageChange event ...
            if ( this.paginator.get('model') ) {
                this.pagModel = this.get('paginator').get('model');
                this._eventHandles.paginator.push( this.pagModel.after( 'pageChange', Y.bind(this._pageChangeListener,this) ) );
            }

            // General listener for changes to underlying modellist ...
            this._eventHandles.paginator.push( this.data.after(["load","change","add","remove","reset"], Y.bind(this._dataChange,this)) );

            // Added listener to sniff for DataSource existence, for its binding
            this._eventHandles.paginator.push( Y.Do.after( this._afterSyncUI, this, '_syncUI', this) );
        }

       // Try to determine when DT is finished rendering records, this is hacky .. but seems to work
        this._eventHandles.paginator.push( this.after( 'renderView', this._notifyRender) );

        return this;
    },

    /**
     * Destructor to clean up listener event handlers and the internal storage buffer.
     *
     * @method destructor
     * @protected
     */
    destructor: function () {
        Y.Array.each( this._eventHandles.paginator,function(item){
            item.detach();
        });
        this._mlistArray = null;
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
        var rdata = this._mlistArray,
            pagv  = this.get('paginator'),
            pagm  = pagv.get('model'),
            rpp   = pagm.get('itemsPerPage');

        var istart, iend, nitem;
    //
    //  Get paginator indices
    //
        if ( pag_state ) {
            istart = pag_state.itemIndexStart;
            iend   = pag_state.itemIndexEnd || istart + rpp;
        } else {
            // usually here on first pass thru, when paginator initiates ...
            istart = ( page_no - 1 ) * rpp;
            iend = istart + rpp;
            iend = ( iend > rdata.length ) ? rdata.length : iend;
            nitem = iend - istart + 1;
        }

    //
    //  For SERVER based pagination, store the translated replacement object
    //  for the remote request converted from `serverPaginationMap` to
    //  a "normalized" format
    //
        if ( this._pagDataSrc !== 'local' ) {

            var url_obj     = {},
                prop_istart = this._srvPagMapObj('itemIndexStart'),
                prop_nitems = this._srvPagMapObj('totalItems'),
                prop_ipp    = this._srvPagMapObj('itemsPerPage');

            url_obj[prop_istart] = istart;
            url_obj[prop_ipp]    = rpp;
            url_obj['sortBy']    = Y.JSON.stringify( this.get('sortBy') || {} ) || null;

            // mix-in the model ATTRS with the url_obj
            url_obj = Y.mix(url_obj,this.pagModel.getAttrs(true));

            // sometimes 'page' isn't included in getAttrs, make sure it is ...
            url_obj['page']  = this.pagModel.get('page');

        }

    //
    //  This is the main guts of retrieving the records,
    //    we already figured out if this was 'local' or 'server' based.
    //
    //   Now, process this page request thru either local data array slicing or
    //    simply firing off a remote server request ...
    //
        switch(this._pagDataSrc) {

            case 'ds':

                // fire off a request to DataSource, mixing in as the request string
                //  with ATTR `requestStringTemplate` with the "url_obj" map

                var rqst_str = this.get('requestStringTemplate') || '';

                this.datasource.load({
                    request:    Y.Lang.sub(rqst_str,url_obj)
                });

                break;

            case 'mlist':
            case 'rest':

                // fire off a ModelSync.REST load "read" request, note that it mixes
                //   the ModelList ATTRS with 'url_obj' in creating the request
                this.data.load(url_obj);

                break;

            default:

                var data_new = rdata.slice(istart,iend);
                this.data.reset( data_new, {silent:true} );
                this.syncUI();

        }

        this.resizePaginator();
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
        if ( this.get('paginatorResize') !== true )  return;

        //TODO:  this is a total HACK, should figure a better way than later ...
       // if ( !this._syncPaginatorSize() )
            Y.later( 25, this, function(){ this._syncPaginatorSize(); } );
    },

    /**
     * Method to re-initialize the original data, mostly targeted at local data
     *  when a new 'data' is set, untested.
     *
     * @method dataReset
     * @param {Array|ModelList} data Data to be reset to ... either as a JS Array or a Y.ModelList
     * @public
     * @returns nothing
     * @beta
     */
    dataReset: function(data){
        if ( data instanceof Y.ModelList ) {
            this._mlistArray = [];
            data.each(function(model){
                this._mlistArray.push( model.toJSON() );
            },this);
        } else if (Y.Lang.isArray(data) ) {
            this._mlistArray = [];
            this._mlistArray = data;
        }
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
        var spm   = this.get('serverPaginationMap') || {},
            rprop = spm[prop];

        dir   = dir || 'to';

        if ( rprop && dir == 'to' && rprop.toServer )   rprop = rprop.toServer;
        if ( rprop && dir != 'to' && rprop.fromServer ) rprop = rprop.fromServer;

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
        if ( !this._pagDataSrc) this._dataChange({});
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
        if ( this._pagDataSrc ) return;

        // For no DS and a ModelSync.REST with "url" static property === ModelList
        if ( !this.datasource && this.data.url && !this._pagDataSrc ) this._pagDataSrc = 'mlist';

        // For a DS and no ModelSync.REST === DataSource
        if ( this.datasource && !this.data.url && !this._pagDataSrc ) {
            this._pagDataSrc = 'ds';
            this._eventHandles.paginator.push( this.datasource.get('datasource').after(["*:response","response"], Y.bind(this._afterDSResponse,this) ) );
            //Y.log('set "ds" and listener on *:response');
        }

        // For neither ModelList or DS source .... but "data" supplied === Local data
        if ( !this._pagDataSrc && Y.Lang.isArray(o.models) && o.models.length>0 ) {

            o.preventDefault();

            this._pagDataSrc = 'local';

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
        }
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
        var resp          = e.response,
            totalItemProp = this.get('serverPaginationMap')['totalItems'] || null;

        if ( resp.results && resp.results.length>0  ) {
            if ( totalItemProp && resp.meta && resp.meta[totalItemProp] && resp.meta[totalItemProp] > 0 ) {
                this.pagModel.set('totalItems', resp.meta[totalItemProp] );
            }
        }
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
        var totalItemProp = this.get('serverPaginationMap')['totalItems'] || null;
        if ( resp.results && resp.results.length>0  ) {
            if ( totalItemProp && resp.meta && resp.meta[totalItemProp] && resp.meta[totalItemProp] > 0 ) {
                this.pagModel.set('totalItems', resp.meta[totalItemProp] );
                //Y.log('afterMLResponse ... totalItems=' + resp.meta[totalItemProp] );
            }
        }
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
        var newPage = +o.newVal || 1;
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
        var tblCont = this.get('boundingBox').one('table');
        if ( !tblCont ) return false;

        this.paginator.get('container').setStyle('width',tblCont.getComputedStyle('width'));
        this.fire('paginatorResize');
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
        var defObj = this._defPagMap();
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
        var rtn = {};
        if ( this.get('paginator').model ) {
            rtn = this.get('paginator').model.getAttrs();
            rtn.sortBy = this.get('sortBy');
        }
        return rtn;
    },

    /**
     * Getter for the "paginationState" DataTable attribute complex object.
     * @method _gefPagState
     * @return {Object}
     * @private
     */
    _getPagState: function(){
        var rtn = this.pagModel.getAttrs(true);
        delete rtn.initialized;
        rtn.sortBy = this.get('sortBy');
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
        if ( val.initialized !== undefined )
            delete val.initialized;
        if ( val.sortBy !== undefined )
            this.set('sortBy',val.sortBy);

        this.pagModel.setAttrs(val);
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
        if ( !val ) return;
        this.paginator = val;
        this.initializer();
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
        if ( this.get('paginatorResize') === true )
            this.resizePaginator();
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

Y.DataTable.Paginator = DtPaginator;
Y.Base.mix(Y.DataTable, [Y.DataTable.Paginator]);

// requires: "base-build", "datatable-base",  "event-custom", "json"


}, 'gallery-2012.08.29-20-10' ,{requires:['base-build', 'datatable-base', 'event-custom'], skinnable:false});
