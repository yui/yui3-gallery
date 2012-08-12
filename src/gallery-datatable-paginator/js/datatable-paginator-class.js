/**
  Defines a Y.DataTable class extension to add capability to support a Paginator View-Model and allow
   paging of actively displayed data within the DT instance.

  Works with either client-side pagination (i.e. local data, usually in form of JS Array) or
   in conjunction with remote server-side pagination, via either DataSource or ModelSync.REST.

  Allows for dealing with sorted data, wherein the local data is sorted in place, and in the case of remote data the "sortBy" attribute is passed to the remote server.

 <h4>Usage</h4>

        var dtable = new Y.DataTable({
            columns:    [ 'firstName','lastName','state','age', 'grade' ],
            data:       enrollment.records,
            scrollable: 'y',
            height:     '450px',
            paginator:  new PaginatorView({
                model:  new PaginatorModel({itemsPerPage:50, page:1})
            })

        });

 <h4>Client OR Server Pagination</h4>

 A determination of whether the source of `data` is either "local" data (i.e. a Javascript Array or Y.ModelList), or is
 provided from a server (either DataSource or ModelSync.REST) is made in the method [_bindPaginator](#method__bindPaginator).
 We use a "duck-type" evaluation, which may not be completely robust, but has worked so far in testing.

 For remote data, the initial call to `.set('data',...)` and/or `data.load(...)` returns a null array, of zero length, while
 the request is being retrieved.  We use this fact to discern that it is not "local" data.  Then we evaluate whether the
 `datasource` plugin exists, and if so we assume the source is DataSource, and set `_pagDataSrc:'ds'`.  Otherwise, if the
 `data` property (i.e. the ModelList) contains an attribute `totalRecs` we expect that data will be retrieved via ModelSync.REST
 and set `_pagDataSrc:'mlist'`.

 <h4>Loading the `data` For a Page</h4>
 Once the "source of data" is known, the method [processPageRequest](#method_processPageRequest) fires on a `pageChange`.

 For the case of "local data", i.e. where `_pagDataSrc:'local'`, the existing buffer of data is sliced according to the pagination
 state, and the data is loaded silently, and `this.syncUI()` is fired to refresh the DT.

 The case of "remote data" (from a server) is actually more straightforward.  This extension DOES NOT "cache" pages for remote
 data, it simply inserts the full returned data into the DT.  So as a consequence, a pagination state change for remote data
 involves a simple request sent to the server source (either DataSource or ModelSync.REST) and the response results are
 loaded in the DT.



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
     * Adds a paginator view (specifically, Y.PaginatorView) instance to the DataTable.
     *
     * @attribute paginator
     * @type Y.View
     * @default null
     */
    paginator:  {
        value : null,
        setter: '_setPaginator'
    }
}


Y.mix( DtPaginator.prototype, {
    /**
     * Holder for the "original" un-paged data that the DataTable was based upon.
     *
     * This property is stored as an Array, from the original "data" ModelList.
     * For remote data, it is used as-is.
     * For local data, is sliced as needed to re-set each data Page.
     *
     * Populated in _bindPaginator and utilized in processPageRequest
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
     * Placeholder for a text flag indicating the duck-typed source of data for this
     *  DataTable, this is set in `_bindPaginator` to either of 'ds', 'mlist' or 'local'
     *
     *  Populated in _bindPaginator
     *  Utilized in processPageRequest
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
     * A convenience property (which is identical to the attribute `paginator`) for use by the user.
     *
     * @property paginator
     * @type {Y.PaginatorView|View}
     * @default null
     * @public
     * @since 3.6.0
     */
    paginator: null,

/*----------------------------------------------------------------------------------------------------------*/
/*                  L I F E - C Y C L E    M E T H O D S                                                    */
/*----------------------------------------------------------------------------------------------------------*/

   /**
    * This initializer sets up the listeners related to the original DataTable instance and
    *  also related to the underlying "data" attribute the DT is based upon.
    *
    * @method initializer
    * @private
    * @return this
    * @chainable
    */
    initializer: function(){
       //
       // Setup listeners on DT's bindUI method and on 'data' loads
       //
        this._eventHandles.paginator = [];
        this._eventHandles.paginator.push( Y.Do.after( this._bindPaginator, this, '_bindUI', this) );
        this._eventHandles.paginator.push( this.get('data').after(["load","change","reset","add","remove"], Y.bind(this._bindPaginator,this)) );

       //
       // Had to do this, specifically for DataSource ... (no better way?)
       //   since DataSource is a plugin, it may not be plugged when DT instantiates,
       //   so this captures the .set('data',...) event, and redirects to _bindPaginator
       //
        this._eventHandles.paginator.push( Y.Do.after( this._afterSetData, this, '_setData', this) );

       // Try to determine when DT is finished rendering records, this is hacky .. but seems to work
        this._eventHandles.paginator.push( this.after( 'renderView', this._notifyRender) );

        return this
    },

    /**
     * Destructor to clean up listener event handlers and the internal storage buffer.
     *
     * @method destructor
     * @public
     */
    destructor: function () {
        Y.Array.each( this._eventHandles.paginator,function(item){
            item.detach();
        });
        this._mlistArray = null;
        this._subscr = null;
    },


/*----------------------------------------------------------------------------------------------------------*/
/*                  P U B L I C      M E T H O D S                                                          */
/*----------------------------------------------------------------------------------------------------------*/

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
            iend   = pag_state.itemIndexEnd;
        } else {
            // usually here on first pass thru, when paginator initiates ...
            istart = ( page_no - 1 ) * rpp;
            iend = istart + rpp;
            iend = ( iend > rdata.length ) ? rdata.length : iend;
            nitem = iend - istart + 1;
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

                var ds,qsTmpl,qs;

                ds = this.datasource || this.datasourcepag;

                qsTmpl  = ds.get('queryStringTemplate');
                qs      = Y.Lang.sub( qsTmpl, {
                            startIndex: istart,
                            numRecs:    rpp,
                            sortBy:     Y.JSON.stringify( this.get('sortBy') || {} ) || null
                        });

                ds.load({  request: qs });
                break;

            case 'mlist':
            case 'rest':

                this.get('data').load({
                    startIndex: istart,
                    numRecs:    rpp,
                    sortBy:     Y.JSON.stringify( this.get('sortBy') || {} ) || null
                });

                break;

            default:

                var data_new = rdata.slice(istart,iend);
                this.data.reset( data_new, {silent:true} );
                this.syncUI();

        }

        this.fire('pageupdate',{ state:pag_state, view:pagv });
    },


/*----------------------------------------------------------------------------------------------------------*/
/*                  P R I V A T E    M E T H O D S                                                          */
/*----------------------------------------------------------------------------------------------------------*/

    /**
     * Listener hooked to the original DT's "syncUI" event, only stores the ModelList for
     *  the DT on the first pass through.
     *
     *  For server-generated data, this method determines the server type (DataSource or ModelSync.REST)
     *   and sets the property flag _pagDataSrc to either 'ds' or 'mlist'
     *
     *
     * @method _bindPaginator
     * @since 3.6.0
     * @private
     * @returns true or false
     */
    _bindPaginator: function() {
        //
        // First time through, before DT ModelList has been read,
        //  store the "base" ModelList ....
        //
        // Otherwise ... just pass thru this
        //
        if ( !this._mlistArray && this.data && this.data.size && this.data.size()>0 ) {

            // Store the "base" ModelList internally ...
            this._mlistArray = [];
            this.data.each(function(model){
                this._mlistArray.push( model.toJSON() );
            },this);

            //
            // If paginator is connected, push the total No. of Rows
            //   for the paginator, render it, and set a "pageChange" listener
            //
            var pag     = this.paginator,
                pgmodel = pag.get('model');

            if ( pag && pgmodel ) {

                var totalRecs = null;

                // Duck checking for local / array data ...
                if ( this._mlistArray.length > 0) {
                    this._pagDataSrc = 'array';
                    totalRecs = this._mlistArray.length;
                }

                // Duck checking for ModelList / REST ...
                var mlTotalRecs = (this.data.getAttrs().totalRecs) ? this.data.get('totalRecs') : null;
                if ( mlTotalRecs ) {
                    this._pagDataSrc = 'mlist';
                    totalRecs = mlTotalRecs;
                }

                // check if DS ... if so, get the totalrecords from the DS
                //  ( datasourcepag was the NS for a testing plugin extension, leave it here for now ...)

                if ( this.datasource || this.datasourcepag ) {
                    var dsds;
                    if ( this.datasource ) {
                        dsds = this.datasource || null;
                    } else {
                        dsds = this.datasourcepag || null;
                    }

                    if ( dsds && dsds.get('state') && dsds.get('state') && dsds.get('state').totalItems ) {
                        this._pagDataSrc = 'ds';
                        totalRecs = dsds.get('state').totalItems;
                    }
                }

                if ( !totalRecs ) return false;

            //
            //  Setup the Paginator Model and View ...
            //
                this.paginator = pag;

                pgmodel.set('totalItems', totalRecs, {silent:true});
                pag.set('dt',this);
                pag.render();

                pgmodel.set('page',0);
                pag.on('pageChange',this._pageListener, this);
                pgmodel.set('page',1);

                this.processPageRequest(pgmodel.get('page'));

                this.fire('paginatorSetup', {model:pgmodel, view:pag} );
            }
        }
    },

    /**
     * Listener that fires when the Model's 'pageChange' fires, this extracts the current page from the state object and then
     *  hooks up the processPageRequest method.
     *
     * @method _pageListener
     * @param {Object} o which contains a `state` object containing the `Model.getAttrs()` attributes
     * @private
     */
    _pageListener: function(o){
        if (o.state.page) {
            this.processPageRequest(o.state.page, o.state);
        }
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
        this.fire('render');
    },

    /**
     * A connector method that will re-bind the Paginator instance to this DataTable after an underlying
     * change to "data" (via `*:change`, `*:reset`, `*:add`, `*:remove` events)
     *
     * @method _afterSetData
     * @param {EventFacade} e
     * @private
     */
    _afterSetData:  function(e){
        //console.log('aftersetdata ... data.size=' + this.data.size() );
        if ( this.data.size && this.data.size()>0 )
            this._bindPaginator();
    }

    /**
     * Fires after the DataTable 'renderView' event fires
     * @event render
     */

    /**
     * Fires after the DataTable-Paginator updates the page data and/or sends the remote request for more data
     * @event pageupdate
     * @param {Object} pagStatus containing following;
     *  @param {Object} pagStatus.pag_state Of Paginator Model `getAttrs()` as an Object
     *  @param {View} pagStatus.view Instance of the Paginator View
     */

    /**
     * Fires after the DataTable-Paginator has setup properly, rendered the View and is ready to accept page changes
     * @event paginatorSetup
     * @param {Object} pagObj Containing following;
     *  @param {Model} pagObj.model Instance of Paginator Model
     *  @param {View} pagObj.view Instance of the Paginator View
     */

});

Y.DataTable.Paginator = DtPaginator;
Y.Base.mix(Y.DataTable, [Y.DataTable.Paginator]);

// requires: "datatable-base", "base-build", "event-custom"
