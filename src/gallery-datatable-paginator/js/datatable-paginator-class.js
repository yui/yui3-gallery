/**
  Defines a class extension to add capability to support a Paginator View-Model and allow
   paging of actively displayed data within the DT instance.

  Works with either client-side pagination (i.e. local data, usually in form of JS Array) or
   in conjunction with remote server-side pagination, via either DataSource or ModelSync.REST.

  Allows for dealing with sorted data, wherein the local data is sorted in place, and in the
   case of remote data the "sortBy" attribute is passed to the remote server.
  @example
    var dtable = new Y.DataTable({
        columns:    [ 'firstName','lastName','state','age', 'grade' ],
        data:       enrollment.records,
        scrollable: 'y',
        height:     '450px',
        paginator:  new PaginatorView({
            model:  new PaginatorModel({itemsPerPage:50, page:1})
        })

    });

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
     * @attribute paginator A Paginator-View instance to hook into this DataTable
     * @type function Y.View
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
     *  Populated in _bindPaginator
     *  Utilized in processPageRequest
     *
     * @property _mlistArray
     * @type Array
     * @default null
     * @static
     * @since 3.6.0
     * @private
     * @example
     *  this._mlistArray = data.slice(125,375);
     *
     */
    _mlistArray: null,


    /**
     * Placeholder for a text flag indicating the duck-typed source of data for this
     *  DataTable,
     *     this is set in _bindPaginator to either of 'ds', 'mlist' or 'local'
     *
     *  Populated in _bindPaginator
     *  Utilized in processPageRequest
     *
     * @property _pagDataSrc
     * @type String
     * @default null
     * @static
     * @since 3.6.0
     * @private
     */
    _pagDataSrc: null,


/*----------------------------------------------------------------------------------------------------------*/
/*                  L I F E - C Y C L E    M E T H O D S                                                    */
/*----------------------------------------------------------------------------------------------------------*/

   /**
    * This initializer sets up the listeners related to the original DataTable instance and
    *  also related to the underlying "data" attribute the DT is based upon.
    *
    * @method initializer
    * @public
    */
    initializer: function(){
       //
       // Setup listeners on DT's bindUI method and on 'data' loads
       //
        this._eventHandles.paginator = [];
        this._eventHandles.paginator.push( Y.Do.after( this._bindPaginator, this, '_bindUI', this) );
        this._eventHandles.paginator.push( this.get('data').after(["load","change","reset","add","remove"], Y.bind(this._bindPaginator,this)) );

       // had to do this, specifically for DataSource ... (no better way?)
       //   since DataSource is a plugin, it may not be plugged when DT instantiates,
       //   so this captures the .set('data',...) event, and redirects to _bindPaginator
        this._eventHandles.paginator.push( Y.Do.after( this._afterSetData, this, '_setData', this) );

       // hacky .. but works
        this._eventHandles.paginator.push( this.after( 'renderView', this._notifyRender) );

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
     * @param data {Array|ModelList} Data to be reset to
     * @public
     * @returns nothing
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
     * @method processPageRequest
     * @param page_no {Integer} Current page number to change to
     * @param pag_state {Object} Pagination state object, includes {indexStart:, numRecs:, sortBy: }
     * @public
     * @returns nothing
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
     *
     * @method _notifyRender
     * @private
     */
    _notifyRender: function() {
        this.fire('render');
    },

    /**
     * @method _afterSetData
     * @param e
     * @private
     */
    _afterSetData:  function(e){
        //console.log('aftersetdata ... data.size=' + this.data.size() );
        if ( this.data.size && this.data.size()>0 )
            this._bindPaginator();
    },

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
     * Listener that fires when the Mode's 'pageChange' fires, this
     *  extracts the current page from the state object and then
     *  hooks up the processPageRequest method.
     *
     * @method _pageListener
     * @param o
     * @private
     */
    _pageListener: function(o){
        if (o.state.page) {
            this.processPageRequest(o.state.page, o.state);
        }
    },

    /**
     * This is a setter for the 'paginator' attribute,
     *   might not be necessary ..
     *
     * @method _setPaginator
     * @param val
     * @return {*}
     * @private
     */
    _setPaginator : function(val){
        if ( !val ) return;
        this.paginator = val;
        return val;
    }


});

Y.DataTable.Paginator = DtPaginator;
Y.Base.mix(Y.DataTable, [Y.DataTable.Paginator]);

// requires: "datatable-base", "base-build", "event-custom"