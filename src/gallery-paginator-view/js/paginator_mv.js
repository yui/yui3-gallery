/**
 * Created with JetBrains PhpStorm.
 * User: todd
 * Date: 8/5/12
 * Time: 11:37 PM
 * To change this template use File | Settings | File Templates.
 */
YUI.add("paginator-mv", function(Y){

//=============================================================================================
//   Define the Paginator MODEL -
//      To track data changes to current paginator state, no. items, items per row, etc...
//=============================================================================================


    Y.PaginatorModel = Y.Base.create('paginatorModel', Y.Model,[],{

        /**
         * @property _npages {Number} Placeholder for calculated # of pages required
         * @private
         */
        _npages: null,

        /**
         * @property _subscr {Array} Event subscribers created by this model
         * @private
         */
        _subscr: null,

        /**
         * Creates self-listeners to recalculate paginator settings on items / itemsPerPage
         *  changes.  Also sets listener to track 'lastPage' changes.
         *
         * @method initializer
         * @return {*}
         */
        initializer: function(){

            this._recalcPagnParams();

            this._subscr = [];
            this._subscr.push( this.after('totalItemsChange',this._recalcPagnParams) );
            this._subscr.push( this.after('itemsPerPageChange',this._recalcPagnParams) );

            this._subscr.push( this.on('pageChange', this._changePage) );

            return this;
        },

        /**
         * Default destructor method, cleans up the listeners that were created.
         *
         * @method destructor
         */
        destructor: function () {
            Y.Array.each(this._subscr,function(item){
                item.detach();
            });
            this._subscr = null;
        },

        /**
         * Method responds to changes to "page", validates the change compared to the
         *  current paginator settings, and stores the prior page in "lastPage".
         *
         * @method _changePage
         * @param e
         * @private
         */
        _changePage: function(e) {
            var newPg = e.newVal,
                validp = true;

            if ( newPg < 1 || !this.get('totalPages') || !this.get('itemsPerPage') ) validp = false;
            if ( this.get('totalPages') && newPg > this.get('totalPages') ) validp = false;

            if (validp)
                this.set('lastPage', e.prevVal);
            else
                e.preventDefault();
        },

        /**
         * Method to calculate the current paginator settings, specifically the
         *  number of pages required, including a modulus calc for extra records.
         *
         * @method _recalcPagnParams
         * @return {Boolean}
         * @private
         */
        _recalcPagnParams: function(){
            var nipp = this.get('itemsPerPage'),
                ni   = this.get('totalItems');

            if ( ni && nipp && ni > 0 && nipp > 0 ) {
                np = Math.floor( ni / nipp );
                if ( ni % nipp > 0 ) np++;
                //this.set('totalPages',np);
                this._npages = np;
                this.set('page',1);
                return true;
            }
            return false;
        },

        /**
         * Getter for returning the start index for the current page
         * @method _getItemIndexStart
         * @return {*}
         * @private
         */
        _getItemIndexStart: function() {
            return ( this.get('page') - 1 ) * this.get('itemsPerPage');
        },

        /**
         * Getter for returning the ending index for the current page
         * @method _getItemIndexEnd
         * @return {*}
         * @private
         */
        _getItemIndexEnd: function(){
            var ni   = this.get('totalItems'),
                iend = this.get('itemIndexStart') + this.get('itemsPerPage');
            return ( iend > ni ) ? ni : iend;
        }

    },{
        ATTRS:{

            totalItems:        {
                value:      null,
                validator:  Y.Lang.isNumber
            },

            itemsPerPage :   {
                value:      null,
                validator:  Y.Lang.isNumber
            },

            page:    {
                value:      1,
                validator:  Y.Lang.isNumber
            },

            lastPage: {
                value:      null,
                validator:  Y.Lang.isNumber
            },

            totalPages: {
                value:      null,
                validator:  Y.Lang.isNumber,
                getter:     function(){ return this._npages; }
            },

            itemIndexStart: {
                value :     null,
                validator:  Y.Lang.isNumber,
                getter:     '_getItemIndexStart'
            },

            itemIndexEnd: {
                value :     null,
                validator:  Y.Lang.isNumber,
                getter:     '_getItemIndexEnd'
            }
        }

    });


//=============================================================================================
//   Define the Paginator VIEW -
//      To display the Paginator UI and process changes back to to the Y.PaginatorModel
//=============================================================================================

    /**
     *
     * Uses a data attribute to track link / image / button / etc... actions ...
     *   e.g. data-pglink="first | 7 | next"
     *
     *
     *
     * @type {*}
     */

    Y.PaginatorView = Y.Base.create('paginatorView', Y.View, [], {

        /**
         * Various "templates" for default rendering of this View.
         *
         * @property ... (various)
         */
        TMPL_PAGINATOR :  '<a href="#" data-pglink="first" class="{pageLinkClass}" title="First Page">First</a> | '
            + '<a href="#" data-pglink="prev" class="{pageLinkClass}" title="Prior Page">Prev</a> | '
            + '{pageLinks}'
            + ' | <a href="#" data-pglink="next" class="{pageLinkClass}" title="Next Page">Next</a> | '
            + '<a href="#" data-pglink="last" class="{pageLinkClass}" title="Last Page">Last</a>',

        TMPL_LINK : '<a href="#" data-pglink="{page}" class="{pageLinkClass}" title="Page {page}">{page}</a>',

        TMPL_basic : '{firstPage} {prevPage} {pageLinks} {nextPage} {lastPage}',

        TMPL_pglinks:   '{pageLinks}',

        TMPL_selectRPP:  '<select class="{selectRPPClass}"></select>',
        TMPL_selectPage: '<select class="{selectPageClass}"></select>',
        TMPL_inputRPP:   '<input type="text" class="{inputRPPClass}" value="{itemsPerPage}"/>',
        TMPL_inputPage:  '<input type="text" class="{inputPageClass}" value="{page}"/>',

        /**
         * Placeholder property to store the initial container HTML for used later in the
         *  render method.  This property is populated by the View initializer.
         *
         * @property _pagHTML
         * @private
         */
        _pagHTML:       null,

        /**
         * Class placeholders for UI elements
         *
         */
        _cssPre:            'yui3-pagview',
        _classContainer:    null,
        _classLinkPage:     null,
        _classLinkPageList: null,
        _classLinkPageActive: null,
        _classSelectRPP:    null,
        _classSelectPage:   null,
        _classInputRPP:     null,
        _classInputPage:    null,


        /**
         * Holder for Event subscribers created by this View, saved so they can be cleaned up later.
         *
         * @property _subscr
         * @private
         */
        _subscr: null,


        /**
         * Helper function, because I was too lazy to figure out how to get widget getClassName working
         *
         * @method _myClassName
         * @return {String}
         * @private
         */
        _myClassName: function() {
            if (arguments && arguments.length>0) {
                var rtn = this._cssPre;
                for(var i=0; i<arguments.length; i++)
                    rtn += '-' + arguments[i];
                return rtn;
            }
            return '';
        },

        /**
         * Initializer setups up classes and the initial container and HTML templating for
         *  this View.
         *
         * @method initializer
         * @return {*}
         */
        initializer: function(){
            //
            //  Init class names
            //
            this._classContainer  = this._myClassName('container');
            this._classLinkPage   = this._myClassName('link','page');
            this._classLinkPageList = this._myClassName('link','page','list');
            this._classLinkPageActive  = this._myClassName('link','page','active');
            this._classInputPage  = this._myClassName('input','page');
            this._classSelectPage = this._myClassName('select','page');
            this._classSelectRPP  = this._myClassName('select','rowsperpage');
            this._classInputRPP   = this._myClassName('input','rowsperpage');

        //
        //  Setup the container for the paginator, and retrieve the "HTML template"
        //    from any of the following in order;
        //      (a) the "container" HTML,
        //      (b) user specified template via 'paginatorTemplate' attribute,
        //      (c) finally, the default internal template via valueFn.
        //
            var cont = this.get('container');
            if (Y.Lang.isString(cont) && pagTmpl[0] === '#' )
                this.set('container', Y.one(cont) );

            cont = this.get('container');
            if ( cont instanceof Y.Node && cont.getHTML() ) {

                this._pagHTML = cont.getHTML();

            } else if ( cont instanceof Y.Node && this.get('paginatorTemplate') ) {

                var pagTmpl = this.get('paginatorTemplate');

                // is user-supplied setting, but they forgot to convert via Y.one().getHTML,
                //  do it for them ...
                if ( pagTmpl && pagTmpl[0] === '#' )
                    this._pagHTML = Y.one( pagTmpl).getHTML();
                else if ( pagTmpl )
                    this._pagHTML = pagTmpl;
            }

            //
            // Setup the container and model listeners
            //
            this._bindUI();

            return this;
        },


        /**
         * Setup listeners on this View, specifically on all UI elements and
         *  "most importantly", listen to "pageChange" on the underlying Model.
         *
         * @return {*}
         * @private
         */
        _bindUI: function(){
            var pag_cont =  this.get('container');
            this._subscr = [];

            //
            // Set a listener on the Model change events ... page most important!
            //
            if ( this.get('model') ) {
                this.model = this.get('model');
                this._subscr.push( this.model.after('pageChange', Y.bind(this._modelPageChange,this)) );
                this._subscr.push( this.model.after('itemsPerPageChange', Y.bind(this._modelStateChange,this)) );
                this._subscr.push( this.model.after('totalItemsChange', Y.bind(this._modelStateChange,this)) );
            }

            // update rowOptions
            this._subscr.push( this.after('render', Y.bind(this._updateRPPSelect,this)) );

            // delegate container events, done here instead of "events" property to give more flexibility
            this._subscr.push( pag_cont.delegate( 'click',  this._clickChangePage,'.'+this._classLinkPage, this) );
            this._subscr.push( pag_cont.delegate( 'change', this._selectChangeRowOptions, '.'+this._classSelectRPP, this) );
            this._subscr.push( pag_cont.delegate( 'change', this._inputChangePage, '.'+this._classInputPage, this) );
            this._subscr.push( pag_cont.delegate( 'change', this._selectChangeRowOptions, '.'+this._classInputRPP, this) );

            // after rendering and/or, resize if required ...
            this._subscr.push( this.after(['render','pageChange'], this._resizePaginator) );

            return this;
        },


        /**
         * Default destructor method, cleans up the listeners that were created and
         *  cleans up the view contents.
         *
         * @method destructor
         */
        destructor: function () {
            Y.Array.each(this._subscr,function(item){
                item.detach();
            });
            this._subscr = null;
        },


        /**
         * Render the current settings of the Paginator, using the supplied HTML content from the
         *  original "srcNode", using Y.Lang.sub for replacement of Model attributes.
         *
         * @method render
         * @private
         */
       render: function(){
            var pag_cont = this.get('container'),
                model    = this.get('model'),
                nsize    = model.get('totalItems'),
                nperpage = model.get('itemsPerPage'),
                npage    = model.get('totalPages'),
                cpage    = model.get('page') || 1;

           if ( !nsize || !nperpage || !pag_cont ) return;

            //
            //  Constructing the Paginator HTML,
            //      first construct the individual Page links ...
            //
            var pl_html   = '',
                plinkTMPL = this.get('pageLinkTemplate'), // || this.TMPL_LINK;
                plIStart  = 0,
                plIEnd    = 0;

            // ... only burn thru this if the token is included in template ...
            if ( this._pagHTML.search(/{pageLinks}/) !== -1 ) {
                for(var i=0; i<npage; i++) {
                    plClass = this._classLinkPage + ' ' + this._classLinkPageList;  //plItemCSS;
                    if ( i+1 === cpage )
                        plClass += ' '+ this._classLinkPageActive; //this._cssActivePage;

                    plIStart = i*nperpage + 1,
                    plIEnd   = plIStart + nperpage - 1;
                    if ( plIEnd >= nsize ) plIEnd = nsize;

                    pl_html += Y.Lang.sub( plinkTMPL, {
                        page:           (i+1),
                        pageLinkClass:  plClass || '',
                        pageStartIndex: plIStart,
                        pageEndIndex:   plIEnd
                    });
                }
            }

        // ... then build the full HTML
            var pg_html = this._pagHTML;
            pag_cont.setStyle('visibility','hidden');
            pag_cont.setHTML('');         //pag_cont.empty();

        // and load it into the container
            pg_html = '<div class="{pagClass}" tabindex="-1">' + pg_html + '</div>';
            var plink_tmpl = Y.substitute( pg_html, Y.mix({
                pageLinks:          pl_html || '',
                pageLinkClass:      this._classLinkPage,
                pagClass:           this._classContainer,
                selectRowsPerPage:  this.TMPL_selectRPP || '',
                selectPage:         this.TMPL_selectPage || '',
                inputPage:          this.TMPL_inputPage || '',
                inputRowsPerPage:   this.TMPL_inputRPP || '',
                selectRPPClass:     this._classSelectRPP,
                selectPageClass:    this._classSelectPage,
                inputRPPClass:      this._classInputRPP,
                inputPageClass:     this._classInputPage
            },model.getAttrs()),null,true);

            pag_cont.append(plink_tmpl);

        //
        //  Turn the View visibility on, and set the initial page
        //
            pag_cont.setStyle('visibility','');

            this._processPageChange(cpage);

            this.fire('render');

            return this;
        },


        /**
         * Main handler that accomodates Page changes, updates visual cues for highlighting
         *  the selected page link and the active Page selector link list.
         *
         * This method also fires the View's "pageChange" event.
         *
         * @method _processPageChange
         * @param cpage
         * @private
         */
        _processPageChange: function(cpage) {
            var model      = this.get('model'),
                npage      = model.get('totalPages'),
                lastPage   = model.get('lastPage'),
                maxpls     = this.get('maxPageLinks'),
                pag_cont   = this.get('container'),
                linkOffset = this.get('linkListOffset'),
                plNodes    = pag_cont.all('.'+ this._classLinkPageList);  //this._cssPageLinkItems) : null;

            //
            //  Toggle highlighting of active page selector (if enabled)
            //
            if ( plNodes && this.get('linkHighLight') ) {

                var plNodeCurrent = (plNodes && (cpage-1) < plNodes.size()) ? plNodes.item(cpage-1) : null;
                // this check is only for visual elements that have pageLinks
                //   (i.e. paginator bar won't have these )
                if ( plNodeCurrent )
                    plNodeCurrent.addClass( this._classLinkPageActive );
                if ( lastPage && lastPage !== cpage ) {
                    plNodeCurrent = (plNodes && (lastPage-1) < plNodes.size()) ? plNodes.item(lastPage-1) : null;
                    if (plNodeCurrent) plNodeCurrent.removeClass( this._classLinkPageActive );
                }
            }

            // Update INPUT Page # field, if defined ...
            if ( pag_cont.one('.'+this._classInputPage) ) {
                pag_cont.one('.'+this._classInputPage).set('value',cpage);
            }

            // Update SELECT Items Per Page # field, if defined ...
            if ( pag_cont.one('.'+this._classInputRPP) ) {
                pag_cont.one('.'+this._classInputRPP).set('value',model.get('itemsPerPage'));
            }

            //
            //  Toggle "disabled" on First/Prev or Next/Last selectors
            //
            if ( cpage === 1 && !this.get('circular') ) {

                this._disablePageSelector(['first','prev']);
                this._disablePageSelector(['last','next'],true);

            } else if ( cpage === npage && !this.get('circular') ) {

                this._disablePageSelector(['first','prev'],true);
                this._disablePageSelector(['last','next']);

            } else   // enable all selectors ...
                this._disablePageSelector(['first','prev','last','next'],true);

             this.fire('pageChange',{state: model.getAttrs() });

        //
        //  Following code is only if user requests limited pageLinks,
        //    Only continue if partial links are requested ...
        //
            if ( npage <= maxpls || !plNodes || ( plNodes && plNodes.size() ==0 ) ) return;

            var moreNodeL  = Y.Node.create('<span class="'+this._myClassName('more')+'">'+this.get('pageLinkFiller')+'</span>'),
                moreNodeR  = Y.Node.create('<span class="'+this._myClassName('more')+'">'+this.get('pageLinkFiller')+'</span>');

            // Clear out any old remaining 'more' nodes ...
            pag_cont.all('.'+this._myClassName('more')).remove();

            // determine offsets either side of current page
            var offs = this._calcOffset(cpage,linkOffset);

            //
            // Hide all page # links outside of offsets ...
            //
            plNodes.each(function(node,index){
                if ( index == 0 && this.get('alwaysShowFirst') || index == npage-1 && this.get('alwaysShowLast') ) return true;
                if ( index+1 < offs.left || index+1 > offs.right )
                    node.addClass( this._myClassName('hide') );
                else
                    node.removeClass( this._myClassName('hide') );
            },this);

            //
            //  add the node either side of current page element PLUS offset
            //
            //var oleft =
            if ( offs.left - linkOffset > 0 )
                plNodes.item(offs.left-1).insert(moreNodeL,'before');

            if ( offs.right + linkOffset <= npage )
                plNodes.item(offs.right-1).insert( moreNodeR,'after');

            return true;

        },

        /**
         * Helper method to calculate offset either side of Selected Page link
         *  for abbreviated Page List.
         *
         *  Called by _processPageChange
         *
         * @param cpage
         * @param offset
         * @return {Object} as {left:Integer, right:Integer}
         * @private
         */
        _calcOffset: function(cpage, offset) {
            var npage     = this.get('model').get('totalPages'),
                left_off  = ( cpage-offset < 1 ) ? 1 : (cpage-offset),
                right_off = ( cpage+offset > npage) ? npage : (cpage+offset);
            return {left:left_off, right:right_off};
        },


        /**
         * Method that toggles the visibility of Page Link selector fields based upon
         * their data-pglink attribute setting.
         *
         *  Called by _processPageChange
         *
         * @method _disablePageSelector
         * @param linkSel
         * @param visible
         * @private
         */
        _disablePageSelector : function(linkSel, visible){
            linkSel = ( !Y.Lang.isArray(linkSel) ) ? [ linkSel ] : linkSel;
            visible = ( visible ) ? visible : false;
            var sel_srch = '[data-{suffix}="{sdata}"]',
                pag_cont = this.get('container');

            Y.Array.each(linkSel,function(pgid){
                var node = pag_cont.one(Y.Lang.sub(sel_srch,{suffix:'pglink',sdata:pgid}) );
                if ( node ) {
                    if (visible) {
                        //node.setStyle('visibility','');
                        node.removeClass(this._myClassName('disabled'));
                    } else {
                        //node.setStyle('visibility','hidden');
                        node.addClass(this._myClassName('disabled'));
                    }
                }
            },this);
        },

        _setModel : function(val){
            if ( !val ) return;
            this.model = val;
            return val;
        },


        /**
         * Handler responds to Model's "pageChange" event
         *
         *  Listener set in _bindUI
         *
         * @method _modelPageChange
         * @param e
         * @private
         */
        _modelPageChange: function(e) {
            var newPage = e.newVal;
            if ( newPage )
                this._processPageChange(newPage);
        },

        /**
         * Handler responds to Model's "itemsPerPageChange" event
         *
         *  Listener set in _bindUI
         *
         * @method _modelStateChange
         * @param e
         * @private
         */
        _modelStateChange: function(e) {
            var newRPP = e.newVal;
            if (newRPP && !e.silent ) this.render();
        },


        /**
         * Method fired after the Paginator View is rendered,
         *   so that the SELECT[rowsPerPage] control can be updated
         *
         *  Listener set in _bindUI
         *
         * @method _updateRPPSelect
         * @private
         */
        _updateRPPSelect: function() {
            var pag_cont  = this.get('container'),
                model     = this.get('model'),
                selPage   = pag_cont.one('.'+this._classSelectRPP),
                pgOptions = this.get('pageOptions');

            // this part is to load "pageOptions" array
            if ( pgOptions && selPage ) {
                if ( Y.Lang.isArray(pgOptions) ) {
                    //
                    //  Clear out any initial options, and add new options
                    //    using DOMNode methods ... seems to work better.
                    //
                    var opts = selPage.getDOMNode().options;
                    opts.length = 0;

                    Y.Array.each(pgOptions, function(optVal) {
                        var opt = new Option(optVal);
                        opts[opts.length] = opt;
                    });
                }
            }

            // set current rowsPerPage to selected in combobox
            if ( selPage ) {
                var isAll = ( model && model.get('itemsPerPage') === model.get('totalItems') ) ? true : false;
                var opts = selPage.get('options');
                opts.each(function(opt) {
                    if ( opt.get('value') == model.get('itemsPerPage')
                        || (opt.get('value').search(/all/i)!==-1 && isAll) )
                        opt.set('selected',true);
                    //else if ( model.get('itemsPerPage') )
                },this);
            }

            if ( pag_cont.one('.'+this._classSelectPage) )
                this._updatePageSelect();
        },


        _updatePageSelect: function() {
            var pag_cont  = this.get('container'),
                model     = this.get('model'),
                selPage   = pag_cont.one('.'+this._classSelectPage);

            console.log('updatePageSelect fired after render ...');

            /*  clearly, this method is incomplete .... */
        },


        /**
         * Handler responding to INPUT[text] box page change.
         *
         * Listener set in _bindUI
         *
         * @method _inputChangePage
         * @param e
         * @private
         */
        _inputChangePage: function(e) {
            var tar = e.target,
                val = +tar.get('value') || 1,
                model = this.get('model');

            if (val<1 || val>model.get('totalPages') ) {
                val = 1;
                tar.set('value',val);
            }
            model.set('page',val);
        },

        /**
         * Handler responding to a Page Selector "click" event.  The clicked Node is
         * reviewed for its data-pglink="" setting, and processed from that.
         *
         * Changed page is then sent back to the Model, which reprocesses the
         *  paginator settings (i.e. indices) and fires a pageChange event.
         *
         *  Listener set in _bindUI
         *
         * @method _clickChangePage
         * @param e
         * @private
         */
        _clickChangePage: function(e) {
            var tar   = e.target,
                model = this.get('model');
            e.preventDefault();

            if (e.target.hasClass(this._myClassName('disabled')) || e.currentTarget.hasClass(this._myClassName('disabled'))) return;

            var page  = tar.getData('pglink') || e.currentTarget.getData('pglink'),
                npage = model.get('totalPages'),
                cpage = model.get('page'); //tar.get('text');

            if ( cpage && cpage === page ) return;

            switch(page) {
                case 'first':
                    page = 1;
                    break;
                case 'last':
                    page = npage;
                    break;
                case 'prev':
                    page = (!cpage) ? 1 : (cpage === 1) ? npage : cpage - 1;
                    break;
                case 'next':
                    page = (!cpage) ? 1 : (cpage === npage ) ? 1 : cpage + 1;
                    break;
                default:
                    page = +page;

            }

            model.set('page',page);
        },

        /**
         * Handler that responds to SELECT changes for no. of rows per page
         *
         * Listener set in _bindUI
         *
         * @method _selectChangeRowOptions
         * @param e
         * @private
         */
        _selectChangeRowOptions: function(e){
            var tar = e.target,
                val = +tar.get('value') || tar.get('value');

            if ( Y.Lang.isString(val) && val.toLowerCase() === 'all' ) {
                val = this.get('model').get('totalItems');
            }
            this.get('model').set('itemsPerPage',val);
            this.render();
        },

        /**
         * Method to sync the container for the paginator View with the underlying DataTable
         *  'table' element.
         *
         *  Unfortunately, there isn't a distinct, definitive 'render' complete event due to
         *   DT's complex rendering, so I use a timer function to attempt a resize.
         *
         * @method _resizePaginator
         * @private
         */
        _resizePaginator: function() {
            if ( this.get('paginatorResize') !== true || !this.get('dt') )  return;

            //TODO:  this is a total HACK, should figure a better way than later ...
            if ( !this._syncPaginatorSize() )
                Y.later(100,this,function(){ this._syncPaginatorSize(); } );
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
            var tblCont = this.get('dt').get('boundingBox').one('table');
            if ( !tblCont ) return false;

            this.get('container').setStyle('width',tblCont.getComputedStyle('width'));
            this.fire('resize');
            return true;
        }


    },{
        ATTRS:{

            model: {
                value:     null,
               // validator: function(v){ return v instanceof Y.PaginatorModel; },
                setter:    '_setModel'
            },

            srcNode: {
                value: null
            },
            pageOptions: {
                value:      [ 10, 20, 'All' ],
                validator:  Y.Lang.isArray
            },

            paginatorTemplate:  {
                valueFn: function(){
                    return this.TMPL_PAGINATOR;
                }
            },

            pageLinkTemplate:   {
                valueFn: function(){
                    return this.TMPL_LINK;
                }
            },

            linkHighLight: {
                value:      true,
                validator:  Y.Lang.isBoolean
            },

            maxPageLinks:   {
                value:      9999,
                validator:  Y.Lang.isNumber
            },

            linkListOffset: {
                value:      1,
                validator:  Y.Lang.isNumber
            },

            pageLinkFiller: {
                value:      '...',
                validator:  Y.Lang.isString
            },

            alwaysShowFirst:{
                value:      false,
                validator:  Y.Lang.isBoolean
            },

            alwaysShowLast:{
                value:      false,
                validator:  Y.Lang.isBoolean
            },

            selectPageFormat: {
                value:      'Page {page}',
                validator:  Y.Lang.isString
            },

            // a little wonky, may need to set DT 'width' attribute for this to work
            paginatorResize: {
                value:      false,
                validator:  Y.Lang.isBoolean
            },

            circular : {
                value:      false,
                validator:  Y.Lang.isBoolean
            },


            dt: {
                value:      null,
                validator:  function(v){ return v instanceof Y.DataTable }
            }
        }

    });


}, "0.1");
