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
_yuitest_coverage["/build/gallery-paginator-view/gallery-paginator-view.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-paginator-view/gallery-paginator-view.js",
    code: []
};
_yuitest_coverage["/build/gallery-paginator-view/gallery-paginator-view.js"].code=["YUI.add('gallery-paginator-view', function(Y) {","","/**"," A Model class extension to be used to track \"pagination state\" of a paged set of control elements."," For example, can be used to track the pagination status of a DataTable where the user selects limited"," portions for display, against a larger data set.",""," The primary tools for maintaining \"page state\" is through the following attributes;","","    * `totalItems` &nbsp;&nbsp;  Which represents the \"Total count of items of interest\" (See attribute [totalItems](#attr_totalItems) )","    * `itemsPerPage` &nbsp;&nbsp; Which represents the \"Count of items on each page\" (See attribute [itemsPerPage](#attr_itemsPerPage) )","    *  `page` &nbsp;&nbsp;  The currently selected page, within all pages required that encompass the above two attributes (See attribute [page](#attr_page) )",""," <h4>Usage</h4>","","        // setup a paginator model for 500 'foo' items, paged at 50 per page ...","        var pagModel = new Y.PaginatorModel({","            totalItems:     500,","            itemsPerPage:   50","        });","        pagModel.get('totalPages');  // returns 10","","        pagModel.set('page',3);","        pagModel.getAttrs(['lastPage','page','itemIndexStart','itemIndexEnd']);","        // returns ... { lastPage:1, page:3, itemIndexStart:100, itemIndexEnd:149 }",""," @class Y.PaginatorModel"," @extends Y.Model"," @version 1.0.1"," @since 3.6.0","**/","Y.PaginatorModel = Y.Base.create('paginatorModel', Y.Model,[],{","","    /**","     * Placeholder for calculated # of pages required","     *","     * @property _npages","     * @type {Number}","     * @protected","     */","    _npages: null,","","    /**","     * Placeholder for Event subscribers created by this model, kept for detaching on destroy.","     *","     * @property _subscr","     * @type {Array}","     * @protected","     */","    _subscr: null,","","    /**","     * Creates self-listeners to recalculate paginator settings on items / itemsPerPage","     *  changes.  Also sets listener to track 'lastPage' changes.","     *","     * @method initializer","     * @private","     * @return this","     */","    initializer: function(){","","        this._recalcPagnParams();","","        this._subscr = [];","        this._subscr.push( this.after('totalItemsChange',this._recalcPagnParams) );","        this._subscr.push( this.after('itemsPerPageChange',this._recalcPagnParams) );","","        this._subscr.push( this.on('pageChange', this._changePage) );","","        return this;","    },","","    /**","     * Default destructor method, cleans up the listeners that were created.","     *","     * @method destructor","     * @private","     */","    destructor: function () {","        Y.Array.each(this._subscr,function(item){","            item.detach();","        });","        this._subscr = null;","    },","","    /**","     * Method responds to changes to \"page\" (via `pageChange` attribute change), validates the change compared to the","     *  current paginator settings, and stores the prior page in \"lastPage\".","     *","     * If a page change is invalid (i.e. less than 1, non-numeric or greater than `totalPages` the change is prevented.","     *","     * @method _changePage","     * @param {EventFacade} e","     * @return Nothing","     * @private","     */","    _changePage: function(e) {","        var newPg = e.newVal,","            validp = true;","","        if ( newPg < 1 || !this.get('totalPages') || !this.get('itemsPerPage') ) validp = false;","        if ( this.get('totalPages') && newPg > this.get('totalPages') ) validp = false;","","        if (validp)","            this.set('lastPage', e.prevVal);","        else","            e.preventDefault();","    },","","    /**","     * Method to calculate the current paginator settings, specifically the","     *  number of pages required, including a modulus calc for extra records requiring a final page.","     *","     * This method resets the `page` to 1 (first page) upon completion.","     *","     * @method _recalcPagnParams","     * @return {Boolean} Indicating the \"success\" or failure of recalculating the pagination state.","     * @private","     */","    _recalcPagnParams: function(){","        var nipp = this.get('itemsPerPage'),","            ni   = this.get('totalItems');","","        if ( ni && nipp && ni > 0 && nipp > 0 ) {","            np = Math.floor( ni / nipp );","            if ( ni % nipp > 0 ) np++;","            //this.set('totalPages',np);","            this._npages = np;","            this.set('page',1);","            return true;","        }","        return false;","    },","","    /**","     * Getter for returning the start index for the current `page`","     * @method _getItemIndexStart","     * @return {Integer} Index of first item on the current `page`","     * @private","     */","    _getItemIndexStart: function() {","        return ( this.get('page') - 1 ) * this.get('itemsPerPage');","    },","","    /**","     * Getter for returning the ending index for the current `page`","     * @method _getItemIndexEnd","     * @return {Integer} Index of the last item on the current `page`","     * @private","     */","    _getItemIndexEnd: function(){","        var ni   = this.get('totalItems'),","            iend = this.get('itemIndexStart') + this.get('itemsPerPage');","        return ( iend > ni ) ? ni : iend;","    }","","    /**","     * Fires after the `page` attribute is changed","     * @event pageChange","     * @param {EventFacade} e","     */","    /**","     * Fires after the `itemsPerPage` attribute is changed","     * @event itemsPerPageChange","     * @param {EventFacade} e","     */","    /**","     * Fires after the `totalItems` attribute is changed","     * @event totalItemsChange","     * @param {EventFacade} e","     */","    /**","     * Fires after the `totalPages` attribute is changed","     * @event totalPagesChange","     * @param {EventFacade} e","     */","    /**","     * Fires after the `lastPage` attribute is changed","     * @event lastPageChange","     * @param {EventFacade} e","     */","","},{","    ATTRS:{","","        /**","         * Total number of items used by this paginator-model.","         *","         * @attribute totalItems","         * @type {Integer}","         * @default null","         */","        totalItems:        {","            value:      null,","            validator:  Y.Lang.isNumber","        },","","        /**","         * Number of items per page for this paginator.","         *","         * @attribute itemsPerPage","         * @type {Integer}","         * @default null","         */","        itemsPerPage :   {","            value:      null,","            validator:  Y.Lang.isNumber","        },","","        /**","         * The current page selected for this paginator-model.","         *","         * This is intended as the **primary** change parameter to be .set() by the user, for interacting","         * with the Paginator Model.","         *","         * @attribute page","         * @type {Integer}","         * @default 1","         */","        page:    {","            value:      1,","            validator:  Y.Lang.isNumber","        },","","        /**","         * The last active `page` that was selected, this is populated by a `pageChange` listener on the Model.","         *","         * @attribute lastPage","         * @type {Integer}","         * @default null","         */","        lastPage: {","            value:      null,","            validator:  Y.Lang.isNumber","        },","","        /**","         * The total number of pages required to complete this pagination state (based upon `totalItems` and","         * `itemsPerPage`, specifically).","         *","         * This attribute is set / maintained by the method [_recalcPagnParams](#method__recalcPagnParams) and","         * shouldn't be set by the user.","         *","         * @attribute totalPages","         * @type Integer","         * @default null","         */","        totalPages: {","            value:      null,","            validator:  Y.Lang.isNumber,","            getter:     function(){ return this._npages; }","        },","","        /**","         * The index for the starting item on the current `page` within the pagination state.","         *","         * This attribute is calculated on the fly in a getter method [_getItemIndexStart](#method__getItemIndexStart) and","         * should not be \"set\" by the user, as it will be disregarded.","         *","         * @attribute itemIndexStart","         * @type Integer","         * @default null","         */","        itemIndexStart: {","            value :     null,","            validator:  Y.Lang.isNumber,","            getter:     '_getItemIndexStart'","        },","","        /**","         * The index for the ending item on the current `page` within the pagination state.","         *","         * This attribute is calculated on the fly in a getter method [_getItemIndexEnd](#method__getItemIndexEnd) and","         * should not be \"set\" by the user, as it will be disregarded.","         *","         * @attribute itemIndexEnd","         * @type Integer","         * @default null","         */","        itemIndexEnd: {","            value :     null,","            validator:  Y.Lang.isNumber,","            getter:     '_getItemIndexEnd'","        }","    }","","});","","","","/**"," A View class extension to serve as a User Interface for the tracking of \"pagination state\" of"," a set of data.  This PaginatorView was specifically designed to work with PaginatorModel"," serving as the \"model\" (in MVC parlance), although would work with any user-supplied model under conditions"," where similar attributes and attribute changes are mapped.",""," The PaginatorView was originally designed to function with DataTable (See Y.DataTable.Paginator) for managing the UI"," and page state of paginated tables, although it isn't necessarily limited to that application.  This View responds to"," the model's attribute `xxxxChange` events and updates the UI accordingly.",""," The PaginatorView utilizes an HTML template concept, where certain replaceable tokens uniquely related to this view,"," in addition to all of the model's attributes, can be defined for positioning within the Paginator container.",""," <h4>Usage</h4>","","        // Setup a paginator view based on a data model for 500 items, paged at 50 per page ...","        var pagView = new Y.PaginatorView(","            container:  '#myPagDIV',","            paginatorTemplate:  '#script-tmpl-mypag',","            model:  new Y.PaginatorModel({","                totalItems:     500,","                itemsPerPage:   50","            })","        }).render();",""," <h4>View 'container'</h4>"," The [container](#attr_container) attribute is the only **REQUIRED** attribute for this View, primarily because we need to know *where* to"," construct it positionally on the page.",""," This view has been designed such that the `container` setting can be either (a) an actual Y.Node instance OR"," (b) a DOM css selector ID ... assumed if the container setting is a {String} with the first character is '#'.",""," <h4>Paginator HTML Template</h4>"," The \"HTML template\" for this PaginatorView is the guts of displaying the user interface.  We refer to this as the \"template\" because it"," typically contains standard HTML but also includes \"replacement tokens\" identified by ```{your token here}``` curly braces.",""," A definition of HTML Template for the paginator can be achieved through several methods;"," <ul>","    <li>Including the HTML template as content within the original `container` DOM element ... template retrived via .getHTML()</li>","    <li>Setting the <a href=\"#attr_paginatorTemplate\">paginatorTemplate</a> attribute to either the template 'string', or giving a SCRIPT template DOM[id] or Y.Node</li>","    <li>Doing neither of the above ... where the default template is used (from <a href=\"#property_TMPL_PAGINATOR\">TMPL_PAGINATOR</a> static property)</li>"," </ul>"," (Note: If for some reason it is desired to not have a \"template\" (because you are rendering one outside of this view), setting"," ```paginatorTemplate:''``` will override the default.)",""," A noteworthy component of the \"HTML template\" includes the token **```{pageLinks}```**, which signifies where links generated by this"," view for each page selector are to be placed.  In some instances (e.g. a Paginator Bar, with an INPUT[text] for page #) you may not"," desire to have every link generated ... (think of a paginator with hundreds of pages, thus hundreds of links).",""," A sub-template is used to generate the \"{pageLinks}\" content, please see attribute [pageLinkTemplate](#attr_pageLinkTemplate) for"," information.",""," For a listing of all recognized *\"replaceable tokens\"* that can be included in the template is shown on the [render](#method_render) method"," API page.",""," <h6>Data Attribute</h6>"," A key takeaway for using this View is that page links (i.e. actionable selectable elements, such as A, BUTTON, DIV, etc...) for a specific"," page use an HTML \"data\" attribute which defines the page associated with the link.",""," The data attribute used within the view is `data-pglink`, and can have a value setting of \"first\", \"last\", \"prev\", \"next\" or any"," numeric page number.",""," For example, the following are all valid page link identifiers;","","        <a href=\"#\" data-pglink=\"last\" title=\"Last Page\">Last</a>","        <button data-pglink=\"6\" class=\"myBtn\">Page 6</button>","        <select><option data-pglink=\"19\" value=\"19\">Page 19 : Rows 9501 - 10000</option></select>","",""," <h4>Connecting to \"other\" UI Elements / Widgets</h4>"," This View can be restricted to situations where the use desires to construct their own unique `pageLinkTemplate` and create their own"," `events` attribute to set listeners.",""," For example, the PaginatorView's [render](#event_render) event can be listened for to ensure"," that the paginator has been initialized and setup.",""," Additionally the [pageChange](#event_pageChange) event (of the view) can be listened for to do any updating to user-specified page links and"," or a supporting YUI Widget.",""," Please see the examples for a guide on how to achieve this.","",""," @class Y.PaginatorView"," @extends Y.View"," @version 1.0.1"," @since 3.6.0"," **/","Y.PaginatorView = Y.Base.create('paginatorView', Y.View, [], {","","","//================   S T A T I C     P R O P E R T I E S     ====================","","    /**","    Default HTML content to be used as basis for Paginator.  This default is only used if the paginatorTemplate","    attribute is unused OR the container does not contain the HTML template.","","    The paginator HTML content includes replacement tokens throughout.","","    The DEFAULT setting is;","","            <a href=\"#\" data-pglink=\"first\" class=\"{pageLinkClass}\" title=\"First Page\">First</a> |","            <a href=\"#\" data-pglink=\"prev\" class=\"{pageLinkClass}\" title=\"Prior Page\">Prev</a> |","            {pageLinks}","            | <a href=\"#\" data-pglink=\"next\" class=\"{pageLinkClass}\" title=\"Next Page\">Next</a> |","            <a href=\"#\" data-pglink=\"last\" class=\"{pageLinkClass}\" title=\"Last Page\">Last</a>","","    @property TMPL_PAGINATOR","    @type String","    **/","","    TMPL_PAGINATOR :  '<a href=\"#\" data-pglink=\"first\" class=\"{pageLinkClass}\" title=\"First Page\">First</a> | '","        + '<a href=\"#\" data-pglink=\"prev\" class=\"{pageLinkClass}\" title=\"Prior Page\">Prev</a> | '","        + '{pageLinks}'","        + ' | <a href=\"#\" data-pglink=\"next\" class=\"{pageLinkClass}\" title=\"Next Page\">Next</a> | '","        + '<a href=\"#\" data-pglink=\"last\" class=\"{pageLinkClass}\" title=\"Last Page\">Last</a>',","","    /**","     Default HTML content that will be used to prepare individual links within the Paginator and inserted","     at the location denoted **{pageLinks}** replacement token in the template.","","     The DEFAULT setting is;","","            <a href=\"#\" data-pglink=\"{page}\" class=\"{pageLinkClass}\" title=\"Page {page}\">{page}</a>","","     @property TMPL_LINK","     @type {String}","     **/","    TMPL_LINK : '<a href=\"#\" data-pglink=\"{page}\" class=\"{pageLinkClass}\" title=\"Page {page}\">{page}</a>',","","    TMPL_basic : '{firstPage} {prevPage} {pageLinks} {nextPage} {lastPage}',","","","    TMPL_pglinks:   '{pageLinks}',","","    /**","     Default HTML template for the Rows Per Page SELECT box signified by the **{selectRowsPerPage}** replacement toke","     within the paginator template.","","     The DEFAULT setting is;","","            <select class=\"{selectRPPClass}\"></select>","","     @property TMPL_selectRPP","     @type String","     **/","    TMPL_selectRPP:  '<select class=\"{selectRPPClass}\"></select>',","","    /**","     Default HTML template for the Page SELECT box signified by the **{selectPage}** replacement token with the","     paginator template.","","     The DEFAULT setting is;","","            <select class=\"{selectPageClass}\"></select>","","     @property TMPL_selectPage","     @type String","     **/","    TMPL_selectPage: '<select class=\"{selectPageClass}\"></select>',","","    /**","     Default HTML template for the \"Rows Per Page\" INPUT[text] control signified by the **{inputRowsPerPage}** replacement","     token within the paginator template.","","     The DEFAULT setting is;","","            <input type=\"text\" class=\"{inputRPPClass}\" value=\"{itemsPerPage}\"/>","","     @property TMPL_inputRPP","     @type String","     **/","    TMPL_inputRPP:   '<input type=\"text\" class=\"{inputRPPClass}\" value=\"{itemsPerPage}\"/>',","","    /**","     Default HTML template for the \"Page\" INPUT[text] control signified by the **{inputPage}** replacement token with the","     paginator template.","","     The DEFAULT setting is;","","            <input type=\"text\" class=\"{inputPageClass}\" value=\"{page}\"/>","","     @property TMPL_inputPage","     @type String","     **/","    TMPL_inputPage:  '<input type=\"text\" class=\"{inputPageClass}\" value=\"{page}\"/>',","","","    /**","     A public property, provided as a convenience property, equivalent to the \"model\" attribute.","","     @property model","     @type Y.PaginatorModel","     @default null","     @public","     **/","    model: null,","","//================   P R I V A T E    P R O P E R T I E S     ====================","","    /**","     * Placeholder property to store the initial container HTML for used later in the","     *  render method.  This property is populated by the View initializer.","     *","     * @property _pagHTML","     * @protected","     */","    _pagHTML:       null,","","    /**","     * Class placeholders for UI elements","     *","     */","    _cssPre:            'yui3-pagview',","    _classContainer:    null,","    _classLinkPage:     null,","    _classLinkPageList: null,","    _classLinkPageActive: null,","    _classSelectRPP:    null,","    _classSelectPage:   null,","    _classInputRPP:     null,","    _classInputPage:    null,","","","    /**","     * Holder for Event subscribers created by this View, saved so they can be cleaned up later.","     *","     * @property _subscr","     * @type Array","     * @default null","     * @protected","     */","    _subscr: null,","","","    /**","     * Helper function, because I was too lazy to figure out how to get widget getClassName working","     *","     * @method _myClassName","     * @param String variable number of strings, to be concatenated","     * @return String","     * @private","     */","    _myClassName: function() {","        if (arguments && arguments.length>0) {","            var rtn = this._cssPre;","            for(var i=0; i<arguments.length; i++)","                rtn += '-' + arguments[i];","            return rtn;","        }","        return '';","    },","","    /**","     * Initializer sets up classes and the initial container and HTML templating for this View.","     *","     * @method initializer","     * @private","     * @return this","     */","    initializer: function(){","        //","        //  Init class names","        //","        this._classContainer  = this._myClassName('container');","        this._classLinkPage   = this._myClassName('link','page');","        this._classLinkPageList = this._myClassName('link','page','list');","        this._classLinkPageActive  = this._myClassName('link','page','active');","        this._classInputPage  = this._myClassName('input','page');","        this._classSelectPage = this._myClassName('select','page');","        this._classSelectRPP  = this._myClassName('select','rowsperpage');","        this._classInputRPP   = this._myClassName('input','rowsperpage');","","    //","    //  Setup the container for the paginator, and retrieve the \"HTML template\"","    //    from any of the following in order;","    //      (a) the \"container\" HTML,","    //      (b) user specified template via 'paginatorTemplate' attribute,","    //      (c) finally, the default internal template via valueFn.","    //","        var cont = this.get('container');","        if (Y.Lang.isString(cont) && pagTmpl[0] === '#' )","            this.set('container', Y.one(cont) );","","        cont = this.get('container');","        if ( cont instanceof Y.Node && cont.getHTML() ) {","","            this._pagHTML = cont.getHTML();","","        } else if ( cont instanceof Y.Node && this.get('paginatorTemplate') ) {","","            var pagTmpl = this.get('paginatorTemplate');","","            // is user-supplied setting, but they forgot to convert via Y.one().getHTML,","            //  do it for them ...","            if ( pagTmpl && pagTmpl[0] === '#' )","                this._pagHTML = Y.one( pagTmpl).getHTML();","            else if ( pagTmpl )","                this._pagHTML = pagTmpl;","        }","","        //","        // Setup the container and model listeners","        //","        this._bindUI();","","        return this;","    },","","","    /**","     * Setup listeners on this View, specifically on all UI elements and","     *  \"most importantly\", listen to \"pageChange\" on the underlying Model.","     *","     * @method _bindUI","     * @return this","     * @private","     */","    _bindUI: function(){","        var pag_cont =  this.get('container');","        this._subscr = [];","","        //","        // Set a listener on the Model change events ... page most important!","        //","        if ( this.get('model') ) {","            this.model = this.get('model');","            this._subscr.push( this.model.after('pageChange', Y.bind(this._modelPageChange,this)) );","            this._subscr.push( this.model.after('itemsPerPageChange', Y.bind(this._modelStateChange,this)) );","            this._subscr.push( this.model.after('totalItemsChange', Y.bind(this._modelStateChange,this)) );","        }","","        // update rowOptions","        this._subscr.push( this.after('render', Y.bind(this._updateRPPSelect,this)) );","","        // delegate container events, done here instead of \"events\" property to give more flexibility","        this._subscr.push( pag_cont.delegate( 'click',  this._clickChangePage,'.'+this._classLinkPage, this) );","        this._subscr.push( pag_cont.delegate( 'change', this._selectChangeRowOptions, '.'+this._classSelectRPP, this) );","        this._subscr.push( pag_cont.delegate( 'change', this._inputChangePage, '.'+this._classInputPage, this) );","        this._subscr.push( pag_cont.delegate( 'change', this._selectChangeRowOptions, '.'+this._classInputRPP, this) );","","        // after rendering and/or, resize if required ...","        this._subscr.push( this.after(['render','pageChange'], this.resizePaginator) );","","        return this;","    },","","","    /**","     * Default destructor method, cleans up the listeners that were created and","     *  cleans up the view contents.","     *","     * @method destructor","     * @private","     */","    destructor: function () {","        Y.Array.each(this._subscr,function(item){","            item.detach();","        });","        this._subscr = null;","    },","","","    /**","     Renders the current settings of the Paginator using the supplied HTML content from the","     for the paginator template and Y.Lang.sub for replacement of tokens and of Model attributes.","","     NOTE: The render method is not called on every page \"click\", but is called if the Model changes","     `totalItems` or `itemsPerPage`.","","     <h6>Recognized tokens:</h6>","     Recognizeable tokens are supported, specifically as *placeholders* within the html template where generated content","     can be inserted and ultimately rendered in the view container.","","     Tokens replaced within this method include all of the PaginatorModel attributes;","","        **{page}**, **{totalItems}**, **{itemsPerPage}**, **{lastPage}**, **{totalPages}**, **{itemIndexStart}**, **{itemIndexEnd}**","","     Additionally, specific tokens intended for view HTML construction and recognized by PaginatorView are;","     <ul>","        <li><b>{pageLinks}</b> : The placeholder within the html template where the View-generated page links will","        <br/>be inserted via a loop over all pages (DEFAULT: see <a href=\"#property_TMPL_LINK\">TMPL_LINK</a>)</li>","        <li><b>{inputPage}</b> : An INPUT[type=text] box which the view listens for change events on (Default: see <a href=\"#property_TMPL_inputPage\">TMPL_inputPage</a>)</li>","        <li><b>{selectRowsPerPage}</b> : A SELECT type pulldown that will be populated with the <a href=\"#attr_pageOptions\">pageOptions</a>","     array <br/>of \"Rows per Page\" selections (Default: see <a href=\"#property_TMPL_selectRPP\">TMPL_selectRPP</a>)</li>","        <li><b>{inputRowsPerPage}</b> : An INPUT[type=text] box what will be listened to for changes to \"Rows per Page\" (Default: see <a href=\"#property_TMPL_inputRPP\">TMPL_inputRPP</a>)</li>","        <li><b>{selectPage}</b> (Not implemented at this time!)</li>","        <li><b>{pageStartIndex}</b> : Represents the starting index for a specific \"page\" (intended for use within <a href=\"#attr_pageLinkTemplate\">pageLinkTemplate</a> )</li>","        <li><b>{pageEndIndex}</b> : Represents the ending index for a specific \"page\" (intended for use within <a href=\"#attr_pageLinkTemplate\">pageLinkTemplate</a> )</li>","     </ul>","","     And if that wasn't enough, the CSS class names supported by this view are also provided via tokens as;","        **{pagClass}**, **{pageLinkClass}**, **{inputPageClass}**, **{selectRPPClass}**, **{selectPageClass}**, **{inputRPPClass}**","","","     This method utilizes the Y.substitute tool (with recursion) for token replacement.","","     The `container` visibility is disabled during construction and insertion of DOM elements into the `container` node.","","     This method fires the `render` event, for View listeners.","","     @method render","     @public","     @returns this","     **/","    render: function() {","        var pag_cont = this.get('container'),","            model    = this.get('model'),","            nsize    = model.get('totalItems'),","            nperpage = model.get('itemsPerPage'),","            npage    = model.get('totalPages'),","            cpage    = model.get('page') || 1;","","       if ( !nsize || !nperpage || !pag_cont ) return this;","","        //","        //  Constructing the Paginator HTML,","        //      first construct the individual Page links ...","        //","        var pl_html   = '',","            plinkTMPL = this.get('pageLinkTemplate'), // || this.TMPL_LINK;","            plIStart  = 0,","            plIEnd    = 0;","","        // ... only burn thru this if the token is included in template ...","        if ( this._pagHTML.search(/{pageLinks}/) !== -1 ) {","            for(var i=0; i<npage; i++) {","                plClass = this._classLinkPage + ' ' + this._classLinkPageList;  //plItemCSS;","                if ( i+1 === cpage )","                    plClass += ' '+ this._classLinkPageActive; //this._cssActivePage;","","                plIStart = i*nperpage + 1,","                plIEnd   = plIStart + nperpage - 1;","                if ( plIEnd >= nsize ) plIEnd = nsize;","","                pl_html += Y.Lang.sub( plinkTMPL, {","                    page:           (i+1),","                    pageLinkClass:  plClass || '',","                    pageStartIndex: plIStart,","                    pageEndIndex:   plIEnd","                });","            }","        }","","    // ... then build the full HTML","        var pg_html = this._pagHTML;","        pag_cont.setStyle('visibility','hidden');","        pag_cont.setHTML('');         //pag_cont.empty();","","    // and load it into the container","        pg_html = '<div class=\"{pagClass}\" tabindex=\"-1\">' + pg_html + '</div>';","        var plink_tmpl = Y.substitute( pg_html, Y.mix({","            pageLinks:          pl_html || '',","            pageLinkClass:      this._classLinkPage,","            pagClass:           this._classContainer,","            selectRowsPerPage:  this.TMPL_selectRPP || '',","            selectPage:         this.TMPL_selectPage || '',","            inputPage:          this.TMPL_inputPage || '',","            inputRowsPerPage:   this.TMPL_inputRPP || '',","            selectRPPClass:     this._classSelectRPP,","            selectPageClass:    this._classSelectPage,","            inputRPPClass:      this._classInputRPP,","            inputPageClass:     this._classInputPage","        },model.getAttrs()),null,true);","","        pag_cont.append(plink_tmpl);","","    //","    //  Turn the View visibility on, and set the initial page","    //","        pag_cont.setStyle('visibility','');","","        this._processPageChange(cpage);","","        this.fire('render');","","        return this;","    },","","","    /**","     * Main handler that accomodates Page changes and updates visual cues for highlighting","     *  the selected page link and the active Page selector link list.","     *","     * This method also fires the View's \"pageChange\" event.","     *","     * NOTE: This method is *private* because page changes should be made by the user at","     * the Model level (Model.set('page',...) and not using the _processPageChange method.","     *","     * @method _processPageChange","     * @param {Integer} cpage","     * @private","     */","    _processPageChange: function(cpage) {","        var model      = this.get('model'),","            npage      = model.get('totalPages'),","            lastPage   = model.get('lastPage'),","            maxpls     = this.get('maxPageLinks'),","            pag_cont   = this.get('container'),","            linkOffset = this.get('linkListOffset'),","            plNodes    = pag_cont.all('.'+ this._classLinkPageList);","","        //","        //  Toggle highlighting of active page selector (if enabled)","        //","        if ( plNodes && this.get('linkHighLight') ) {","","            var plNodeCurrent = (plNodes && (cpage-1) < plNodes.size()) ? plNodes.item(cpage-1) : null;","            // this check is only for visual elements that have pageLinks","            //   (i.e. paginator bar won't have these )","            if ( plNodeCurrent )","                plNodeCurrent.addClass( this._classLinkPageActive );","            if ( lastPage && lastPage !== cpage ) {","                plNodeCurrent = (plNodes && (lastPage-1) < plNodes.size()) ? plNodes.item(lastPage-1) : null;","                if (plNodeCurrent) plNodeCurrent.removeClass( this._classLinkPageActive );","            }","        }","","        // Update INPUT Page # field, if defined ...","        if ( pag_cont.one('.'+this._classInputPage) ) {","            pag_cont.one('.'+this._classInputPage).set('value',cpage);","        }","","        // Update SELECT Items Per Page # field, if defined ...","        if ( pag_cont.one('.'+this._classInputRPP) ) {","            pag_cont.one('.'+this._classInputRPP).set('value',model.get('itemsPerPage'));","        }","","        //","        //  Toggle \"disabled\" on First/Prev or Next/Last selectors","        //","        if ( cpage === 1 && !this.get('circular') ) {","","            this._disablePageSelector(['first','prev']);","            this._disablePageSelector(['last','next'],true);","","        } else if ( cpage === npage && !this.get('circular') ) {","","            this._disablePageSelector(['first','prev'],true);","            this._disablePageSelector(['last','next']);","","        } else   // enable all selectors ...","            this._disablePageSelector(['first','prev','last','next'],true);","","         this.fire('pageChange',{state: model.getAttrs() });","","    //","    //  Following code is only if user requests limited pageLinks,","    //    Only continue if partial links are requested ...","    //","        if ( npage <= maxpls || !plNodes || ( plNodes && plNodes.size() ==0 ) ) return;","","        var moreNodeL  = Y.Node.create('<span class=\"'+this._myClassName('more')+'\">'+this.get('pageLinkFiller')+'</span>'),","            moreNodeR  = Y.Node.create('<span class=\"'+this._myClassName('more')+'\">'+this.get('pageLinkFiller')+'</span>');","","        // Clear out any old remaining 'more' nodes ...","        pag_cont.all('.'+this._myClassName('more')).remove();","","        // determine offsets either side of current page","        var offs = this._calcOffset(cpage,linkOffset);","","        //","        // Hide all page # links outside of offsets ...","        //","        plNodes.each(function(node,index){","            if ( index == 0 && this.get('alwaysShowFirst') || index == npage-1 && this.get('alwaysShowLast') ) return true;","            if ( index+1 < offs.left || index+1 > offs.right )","                node.addClass( this._myClassName('hide') );","            else","                node.removeClass( this._myClassName('hide') );","        },this);","","        //","        //  add the node either side of current page element PLUS offset","        //","        //var oleft =","        if ( offs.left - linkOffset > 0 )","            plNodes.item(offs.left-1).insert(moreNodeL,'before');","","        if ( offs.right + linkOffset <= npage )","            plNodes.item(offs.right-1).insert( moreNodeR,'after');","","        return true;","","    },","","    /**","     * Helper method to calculate offset either side of Selected Page link","     *  for abbreviated Page List.","     *","     *  Called by _processPageChange","     *","     * @method _calcOffset","     * @param cpage {Integer} Current page number","     * @param offset {Integer} Number of links both sides of page number to return for (usually 1)","     * @return {Object} containing left {Integer} and right {Integer} properties","     * @private","     */","    _calcOffset: function(cpage, offset) {","        var npage     = this.get('model').get('totalPages'),","            left_off  = ( cpage-offset < 1 ) ? 1 : (cpage-offset),","            right_off = ( cpage+offset > npage) ? npage : (cpage+offset);","        return {left:left_off, right:right_off};","    },","","","    /**","     * Method that toggles the visibility of Page Link selector fields based upon","     * their data-pglink attribute setting.","     *","     *  Called by _processPageChange","     *","     * @method _disablePageSelector","     * @param linkSel","     * @param visible","     * @private","     */","    _disablePageSelector : function(linkSel, visible){","        linkSel = ( !Y.Lang.isArray(linkSel) ) ? [ linkSel ] : linkSel;","        visible = ( visible ) ? visible : false;","        var sel_srch = '[data-{suffix}=\"{sdata}\"]',","            pag_cont = this.get('container');","","        Y.Array.each(linkSel,function(pgid){","            var node = pag_cont.one(Y.Lang.sub(sel_srch,{suffix:'pglink',sdata:pgid}) );","            if ( node ) {","                if (visible) {","                    //node.setStyle('visibility','');","                    node.removeClass(this._myClassName('disabled'));","                } else {","                    //node.setStyle('visibility','hidden');","                    node.addClass(this._myClassName('disabled'));","                }","            }","        },this);","    },","","    /**","     * Setter for the \"model\" attribute, that for convenience also sets a public property to this View.","     *","     * @method _setModel","     * @param val","     * @return {*}","     * @private","     */","    _setModel : function(val){","        if ( !val ) return;","        this.model = val;","        return val;","    },","","","    /**","     * Handler responds to Model's `pageChange` event","     *","     *  Listener set in _bindUI","     *","     * @method _modelPageChange","     * @param {EventFacade} e","     * @private","     */","    _modelPageChange: function(e) {","        var newPage = e.newVal;","        if ( newPage )","            this._processPageChange(newPage);","    },","","    /**","     * Handler responds to Model's `itemsPerPageChange` event","     *","     *  Listener set in _bindUI","     *","     * @method _modelStateChange","     * @param {EventFacade} e","     * @private","     */","    _modelStateChange: function(e) {","        var newRPP = e.newVal;","        if (newRPP && !e.silent ) this.render();","    },","","","    /**","     * Method fired after the Paginator View is rendered,","     *   so that the SELECT[rowsPerPage] control can be updated","     *","     *  Listener set in _bindUI","     *","     * @method _updateRPPSelect","     * @private","     */","    _updateRPPSelect: function() {","        var pag_cont  = this.get('container'),","            model     = this.get('model'),","            selPage   = pag_cont.one('.'+this._classSelectRPP),","            pgOptions = this.get('pageOptions');","","        // this part is to load \"pageOptions\" array","        if ( pgOptions && selPage ) {","            if ( Y.Lang.isArray(pgOptions) ) {","                //","                //  Clear out any initial options, and add new options","                //    using DOMNode methods ... seems to work better.","                //","                var opts = selPage.getDOMNode().options;","                opts.length = 0;","","                Y.Array.each(pgOptions, function(optVal) {","                    var opt = new Option(optVal);","                    opts[opts.length] = opt;","                });","            }","        }","","        // set current rowsPerPage to selected in combobox","        if ( selPage ) {","            var isAll = ( model && model.get('itemsPerPage') === model.get('totalItems') ) ? true : false;","            var opts = selPage.get('options');","            opts.each(function(opt) {","                if ( opt.get('value') == model.get('itemsPerPage')","                    || (opt.get('value').search(/all/i)!==-1 && isAll) )","                    opt.set('selected',true);","                //else if ( model.get('itemsPerPage') )","            },this);","        }","","        if ( pag_cont.one('.'+this._classSelectPage) )","            this._updatePageSelect();","    },","","    /**","     Method that responds to changes in the SELECT box for \"page\"","","     @method _updatePageSelect","     @private","     @beta","     **/","    _updatePageSelect: function() {","        var pag_cont  = this.get('container'),","            model     = this.get('model'),","            selPage   = pag_cont.one('.'+this._classSelectPage);","","","        /*  clearly, this method is incomplete .... */","    },","","","    /**","     * Handler responding to INPUT[text] box page change.","     *","     * Listener set in _bindUI","     *","     * @method _inputChangePage","     * @param {EventFacade} e","     * @private","     */","    _inputChangePage: function(e) {","        var tar = e.target,","            val = +tar.get('value') || 1,","            model = this.get('model');","","        if (val<1 || val>model.get('totalPages') ) {","            val = 1;","            tar.set('value',val);","        }","        model.set('page',val);","    },","","    /**","     * Handler responding to a Page Selector \"click\" event.  The clicked Node is","     * reviewed for its data-pglink=\"\" setting, and processed from that.","     *","     * Changed page is then sent back to the Model, which reprocesses the","     *  paginator settings (i.e. indices) and fires a `pageChange` event.","     *","     *  Listener set in _bindUI","     *","     * @method _clickChangePage","     * @param {EventFacade} e","     * @private","     */","    _clickChangePage: function(e) {","        var tar   = e.target,","            model = this.get('model');","        e.preventDefault();","","        if (e.target.hasClass(this._myClassName('disabled')) || e.currentTarget.hasClass(this._myClassName('disabled'))) return;","","        var page  = tar.getData('pglink') || e.currentTarget.getData('pglink'),","            npage = model.get('totalPages'),","            cpage = model.get('page'); //tar.get('text');","","        if ( cpage && cpage === page ) return;","","        switch(page) {","            case 'first':","                page = 1;","                break;","            case 'last':","                page = npage;","                break;","            case 'prev':","                page = (!cpage) ? 1 : (cpage === 1) ? npage : cpage - 1;","                break;","            case 'next':","                page = (!cpage) ? 1 : (cpage === npage ) ? 1 : cpage + 1;","                break;","            default:","                page = +page;","","        }","","        model.set('page',page);","    },","","    /**","     * Handler that responds to SELECT changes for no. of rows per page","     *","     * Listener set in _bindUI","     *","     * @method _selectChangeRowOptions","     * @param {EventFacade} e","     * @private","     */","    _selectChangeRowOptions: function(e){","        var tar = e.target,","            val = +tar.get('value') || tar.get('value');","","        if ( Y.Lang.isString(val) && val.toLowerCase() === 'all' ) {","            val = this.get('model').get('totalItems');","        }","        this.get('model').set('itemsPerPage',val);","        this.render();","    }","","","    /**","     * Fires after the Paginator has been completely rendered.","     * @event render","     */","","    /**","     * Fires after the _processPageChange method has updated the pagination state.","     * @event pageChange","     * @param {Object} state The PaginatorModel `getAttrs()` \"state\" after updating to the current page as an object.","     * @since 3.5.0","     */","","","},{","    /**","     * The default set of attributes which will be available for instances of this class","     *","     * @property ATTRS","     * @type Object","     * @static","     */","    ATTRS:{","","        /**","         * The base PaginatorModel that serves as data / change provider for this View.","         *","		 *	@example","         *      paginator:  new Y.PaginatorModel({","         *          itemsPerPage:  250","         *      }),","         *      OR","         *  	paginator:  myPagModel // where myPagModel is an instance previously created ...","         *","         * @attribute model","         * @default null","         * @type {Y.PaginatorModel}","         */","        model: {","            value:     null,","           // validator: function(v){ return v instanceof Y.PaginatorModel; },","            setter:    '_setModel'","        },","","        /**","          The container holder for the contents of this View.  Can be entered either as","          a Y.Node instance or as a DOM \"id\" attribute (if prepended by \"#\").","","		 	@example","                container: Y.one(\"#myDiv\"),","                OR","                container: \"#myDiv\"","","          NOTE: If the container node contains HTML <b>it will be used as the paginatorTemplate</b>","","","          @attribute container","          @default null","          @type {Node|String}","          @required","         **/","        container: {","            value: null","        },","","        /**","         An array that will be used to populate the rows per page SELECT box ( using string replacement \"{selectRowsPerPage}\" or","         class selector \"yui3-pagview-select-rowsperpage\" ).","","          @attribute pageOptions","          @type {Array}","          @default [ 10, 20, 'All' ]","         **/","        pageOptions: {","            value:      [ 10, 20, 'All' ],","            validator:  Y.Lang.isArray","        },","","        /**","          A string that defines the Paginator HTML contents.  Can either be entered as a {String} including replacement parameters","          or as a {Node} instance whose contents will be read via .getHTML() or a DOM \"id\" element (indicated by '#' in first character)","          <br/><br/>","          To disable creation of any template (in order to do your own replacements of the template), set this to ''.","","            @example","                paginatorTemplate:  '<div data-pglink=\"first\">FIRST</div> {pageLinks} <div data-pglink=\"last\">LAST</div>',","                paginatorTemplate:  Y.one('#script-id-tmpl'),","                paginatorTemplate:  Y.one('#script-id-tmpl').getHTML(),","                paginatorTemplate:  '#script-id-tmpl',   // where","","          @attribute paginatorTemplate","          @type {Node|String}","          @default See TMPL_PAGINATOR static property","         **/","        paginatorTemplate:  {","            valueFn: function(){","                return this.TMPL_PAGINATOR;","            }","        },","","        /**","         Defines the HTML template to be used for each individual page within the Paginator.  This can be used along","         with replacement tokens to create UI elements for each page link.  The template is used to construct the","         `{pageLinks}` replacement token with the paginator body.","","         Recognized replacement tokens most appropriate to this attribute are `{page}`, `{pageStartIndex}` and","         `{pageEndIndex}`.","","         A few examples of this template are listed below;","         @example","                pageLinkTemplate: '<a href=\"#\" data-pglink=\"{page}\" class=\"\" title=\"Page No. {page}\">{page}</a>'","","         @attribute pageLinkTemplate","         @type String","         @default See TMPL_LINK static property","         **/","        pageLinkTemplate:   {","            valueFn: function(){","                return this.TMPL_LINK;","            }","        },","","        // May not be necessary anymore","        linkHighLight: {","            value:      true,","            validator:  Y.Lang.isBoolean","        },","","        /**","         Used to set the maximum number of page links that will be displayed for individual pages within `{pageLinks}`.","         This is the primary attribute to use to setup **abbreviated page links**, to avoid a long line of page links","         that travel across the page!","","         Setting this to some number less than the total number of pages will begin abbreviating the links.","         <br/>(See also attributes [`linkListOffset`](#attr_linkListOffset) and [`pageLinkFiller`](#attr_pageLinkFiller), which work in conjunction with this attribute).","","         @attribute maxPageLinks","         @type Integer","         @default 9999","         **/","        maxPageLinks:   {","            value:      9999,","            validator:  Y.Lang.isNumber","        },","","        /**","         Setting that represents the number of links adjacent to the current page that should be displayed for instances where","         an *abbreviated* page link list is desired.","         <br/>(See [maxPageLinks](#attr_maxPageLinks) and [pageLinkFiller](#attr_pageLinkFiller) attributes).","","         For example, a setting of this attribute to 1, will result in 3 page links (current page plus 1 each side),","         <br/>likewise a setting of 2, will results in 5 page links in the center of the paginator, etc.","","         @attribute linkListOffset","         @type Integer","         @default 1","         **/","        linkListOffset: {","            value:      1,","            validator:  Y.Lang.isNumber","        },","","        /**","         Setting the the \".. more\" indicator to be used specifically for *abbreviated* page link lists.","         <br/>(See [maxPageLinks](#attr_maxPageLinks) and [linkListOffset](#attr_linkListOffset) attributes).","","         @attribute pageLinkFiller","         @type String","         @default '...'","         **/","        pageLinkFiller: {","            value:      '...',","            validator:  Y.Lang.isString","        },","","        /**","         Flag to indicate whether the first page link **within the `{pageLinks}` template** is to be displayed or not.","         <br/>Specifically intended for *abbreviated* page link lists (See [maxPageLinks](#attr_maxPageLinks) attribute).","","         For Example;","         <br/>If our paginator state currently has 9 pages, and the current page is 5, if `alwaysShowLast:false` and `alwaysShowFirst:false`","            the link list will resemble;<br/>First | Prev | ... 4 5 6 ... | Next | Last","","            Likewise, with `'alwaysShowLast:true` (and alwaysShowFirst:true) the link list will resemble;","         <br/>First | Prev | 1 ... 4 5 6 ... 9 | Next | Last","","         @attribute alwaysShowFirst","         @type Boolean","         @default false","         **/","        alwaysShowFirst:{","            value:      false,","            validator:  Y.Lang.isBoolean","        },","","        /**","         Flag to indicate whether the last page link **within the `{pageLinks}` template** is to be displayed or not.","         <br/>Specifically intended for *abbreviated* page link lists (See [maxPageLinks](#attr_maxPageLinks) attribute).","","         See `alowsShowFirst` for an example.","","         @attribute alwaysShowLast","         @type Boolean","         @default false","         **/","        alwaysShowLast:{","            value:      false,","            validator:  Y.Lang.isBoolean","        },","","        /**","         Not implemented at this time.","         @attribute selectPageFormat","         @type String","         @default 'Page {page}'","         @beta","         **/","        selectPageFormat: {","            value:      'Page {page}',","            validator:  Y.Lang.isString","        },","","        /**","         Flag indicating whether \"circular\" behavior of the Paginator View is desired.  If `true` the paginator","         will stop \"disabling\" First|Previous or Next|Last toggling and will continue at either 1st page or last","         page selections.  (i.e. when on *last* page, a *next* click will return to page 1)","","         @attribute circular","         @type Boolean","         @default false","         **/","        circular : {","            value:      false,","            validator:  Y.Lang.isBoolean","        }","","    }","","});","","","","}, 'gallery-2012.08.29-20-10' ,{skinnable:true, requires:['base-build','model','view','substitute']});"];
_yuitest_coverage["/build/gallery-paginator-view/gallery-paginator-view.js"].lines = {"1":0,"32":0,"62":0,"64":0,"65":0,"66":0,"68":0,"70":0,"80":0,"81":0,"83":0,"98":0,"101":0,"102":0,"104":0,"105":0,"107":0,"121":0,"124":0,"125":0,"126":0,"128":0,"129":0,"130":0,"132":0,"142":0,"152":0,"154":0,"251":0,"378":0,"534":0,"535":0,"536":0,"537":0,"538":0,"540":0,"554":0,"555":0,"556":0,"557":0,"558":0,"559":0,"560":0,"561":0,"570":0,"571":0,"572":0,"574":0,"575":0,"577":0,"579":0,"581":0,"585":0,"586":0,"587":0,"588":0,"594":0,"596":0,"609":0,"610":0,"615":0,"616":0,"617":0,"618":0,"619":0,"623":0,"626":0,"627":0,"628":0,"629":0,"632":0,"634":0,"646":0,"647":0,"649":0,"696":0,"703":0,"709":0,"715":0,"716":0,"717":0,"718":0,"719":0,"721":0,"723":0,"725":0,"735":0,"736":0,"737":0,"740":0,"741":0,"755":0,"760":0,"762":0,"764":0,"766":0,"784":0,"795":0,"797":0,"800":0,"801":0,"802":0,"803":0,"804":0,"809":0,"810":0,"814":0,"815":0,"821":0,"823":0,"824":0,"826":0,"828":0,"829":0,"832":0,"834":0,"840":0,"842":0,"846":0,"849":0,"854":0,"855":0,"856":0,"857":0,"859":0,"866":0,"867":0,"869":0,"870":0,"872":0,"889":0,"892":0,"908":0,"909":0,"910":0,"913":0,"914":0,"915":0,"916":0,"918":0,"921":0,"936":0,"937":0,"938":0,"952":0,"953":0,"954":0,"967":0,"968":0,"982":0,"988":0,"989":0,"994":0,"995":0,"997":0,"998":0,"999":0,"1005":0,"1006":0,"1007":0,"1008":0,"1009":0,"1011":0,"1016":0,"1017":0,"1028":0,"1047":0,"1051":0,"1052":0,"1053":0,"1055":0,"1072":0,"1074":0,"1076":0,"1078":0,"1082":0,"1084":0,"1086":0,"1087":0,"1089":0,"1090":0,"1092":0,"1093":0,"1095":0,"1096":0,"1098":0,"1102":0,"1115":0,"1118":0,"1119":0,"1121":0,"1122":0,"1221":0,"1243":0};
_yuitest_coverage["/build/gallery-paginator-view/gallery-paginator-view.js"].functions = {"initializer:60":0,"(anonymous 2):80":0,"destructor:79":0,"_changePage:97":0,"_recalcPagnParams:120":0,"_getItemIndexStart:141":0,"_getItemIndexEnd:151":0,"getter:251":0,"_myClassName:533":0,"initializer:550":0,"_bindUI:608":0,"(anonymous 3):646":0,"destructor:645":0,"render:695":0,"(anonymous 4):854":0,"_processPageChange:783":0,"_calcOffset:888":0,"(anonymous 5):913":0,"_disablePageSelector:907":0,"_setModel:935":0,"_modelPageChange:951":0,"_modelStateChange:966":0,"(anonymous 6):997":0,"(anonymous 7):1008":0,"_updateRPPSelect:981":0,"_updatePageSelect:1027":0,"_inputChangePage:1046":0,"_clickChangePage:1071":0,"_selectChangeRowOptions:1114":0,"valueFn:1220":0,"valueFn:1242":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-paginator-view/gallery-paginator-view.js"].coveredLines = 194;
_yuitest_coverage["/build/gallery-paginator-view/gallery-paginator-view.js"].coveredFunctions = 32;
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1);
YUI.add('gallery-paginator-view', function(Y) {

/**
 A Model class extension to be used to track "pagination state" of a paged set of control elements.
 For example, can be used to track the pagination status of a DataTable where the user selects limited
 portions for display, against a larger data set.

 The primary tools for maintaining "page state" is through the following attributes;

    * `totalItems` &nbsp;&nbsp;  Which represents the "Total count of items of interest" (See attribute [totalItems](#attr_totalItems) )
    * `itemsPerPage` &nbsp;&nbsp; Which represents the "Count of items on each page" (See attribute [itemsPerPage](#attr_itemsPerPage) )
    *  `page` &nbsp;&nbsp;  The currently selected page, within all pages required that encompass the above two attributes (See attribute [page](#attr_page) )

 <h4>Usage</h4>

        // setup a paginator model for 500 'foo' items, paged at 50 per page ...
        var pagModel = new Y.PaginatorModel({
            totalItems:     500,
            itemsPerPage:   50
        });
        pagModel.get('totalPages');  // returns 10

        pagModel.set('page',3);
        pagModel.getAttrs(['lastPage','page','itemIndexStart','itemIndexEnd']);
        // returns ... { lastPage:1, page:3, itemIndexStart:100, itemIndexEnd:149 }

 @class Y.PaginatorModel
 @extends Y.Model
 @version 1.0.1
 @since 3.6.0
**/
_yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 32);
Y.PaginatorModel = Y.Base.create('paginatorModel', Y.Model,[],{

    /**
     * Placeholder for calculated # of pages required
     *
     * @property _npages
     * @type {Number}
     * @protected
     */
    _npages: null,

    /**
     * Placeholder for Event subscribers created by this model, kept for detaching on destroy.
     *
     * @property _subscr
     * @type {Array}
     * @protected
     */
    _subscr: null,

    /**
     * Creates self-listeners to recalculate paginator settings on items / itemsPerPage
     *  changes.  Also sets listener to track 'lastPage' changes.
     *
     * @method initializer
     * @private
     * @return this
     */
    initializer: function(){

        _yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "initializer", 60);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 62);
this._recalcPagnParams();

        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 64);
this._subscr = [];
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 65);
this._subscr.push( this.after('totalItemsChange',this._recalcPagnParams) );
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 66);
this._subscr.push( this.after('itemsPerPageChange',this._recalcPagnParams) );

        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 68);
this._subscr.push( this.on('pageChange', this._changePage) );

        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 70);
return this;
    },

    /**
     * Default destructor method, cleans up the listeners that were created.
     *
     * @method destructor
     * @private
     */
    destructor: function () {
        _yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "destructor", 79);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 80);
Y.Array.each(this._subscr,function(item){
            _yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "(anonymous 2)", 80);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 81);
item.detach();
        });
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 83);
this._subscr = null;
    },

    /**
     * Method responds to changes to "page" (via `pageChange` attribute change), validates the change compared to the
     *  current paginator settings, and stores the prior page in "lastPage".
     *
     * If a page change is invalid (i.e. less than 1, non-numeric or greater than `totalPages` the change is prevented.
     *
     * @method _changePage
     * @param {EventFacade} e
     * @return Nothing
     * @private
     */
    _changePage: function(e) {
        _yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "_changePage", 97);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 98);
var newPg = e.newVal,
            validp = true;

        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 101);
if ( newPg < 1 || !this.get('totalPages') || !this.get('itemsPerPage') ) {validp = false;}
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 102);
if ( this.get('totalPages') && newPg > this.get('totalPages') ) {validp = false;}

        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 104);
if (validp)
            {_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 105);
this.set('lastPage', e.prevVal);}
        else
            {_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 107);
e.preventDefault();}
    },

    /**
     * Method to calculate the current paginator settings, specifically the
     *  number of pages required, including a modulus calc for extra records requiring a final page.
     *
     * This method resets the `page` to 1 (first page) upon completion.
     *
     * @method _recalcPagnParams
     * @return {Boolean} Indicating the "success" or failure of recalculating the pagination state.
     * @private
     */
    _recalcPagnParams: function(){
        _yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "_recalcPagnParams", 120);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 121);
var nipp = this.get('itemsPerPage'),
            ni   = this.get('totalItems');

        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 124);
if ( ni && nipp && ni > 0 && nipp > 0 ) {
            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 125);
np = Math.floor( ni / nipp );
            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 126);
if ( ni % nipp > 0 ) {np++;}
            //this.set('totalPages',np);
            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 128);
this._npages = np;
            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 129);
this.set('page',1);
            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 130);
return true;
        }
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 132);
return false;
    },

    /**
     * Getter for returning the start index for the current `page`
     * @method _getItemIndexStart
     * @return {Integer} Index of first item on the current `page`
     * @private
     */
    _getItemIndexStart: function() {
        _yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "_getItemIndexStart", 141);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 142);
return ( this.get('page') - 1 ) * this.get('itemsPerPage');
    },

    /**
     * Getter for returning the ending index for the current `page`
     * @method _getItemIndexEnd
     * @return {Integer} Index of the last item on the current `page`
     * @private
     */
    _getItemIndexEnd: function(){
        _yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "_getItemIndexEnd", 151);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 152);
var ni   = this.get('totalItems'),
            iend = this.get('itemIndexStart') + this.get('itemsPerPage');
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 154);
return ( iend > ni ) ? ni : iend;
    }

    /**
     * Fires after the `page` attribute is changed
     * @event pageChange
     * @param {EventFacade} e
     */
    /**
     * Fires after the `itemsPerPage` attribute is changed
     * @event itemsPerPageChange
     * @param {EventFacade} e
     */
    /**
     * Fires after the `totalItems` attribute is changed
     * @event totalItemsChange
     * @param {EventFacade} e
     */
    /**
     * Fires after the `totalPages` attribute is changed
     * @event totalPagesChange
     * @param {EventFacade} e
     */
    /**
     * Fires after the `lastPage` attribute is changed
     * @event lastPageChange
     * @param {EventFacade} e
     */

},{
    ATTRS:{

        /**
         * Total number of items used by this paginator-model.
         *
         * @attribute totalItems
         * @type {Integer}
         * @default null
         */
        totalItems:        {
            value:      null,
            validator:  Y.Lang.isNumber
        },

        /**
         * Number of items per page for this paginator.
         *
         * @attribute itemsPerPage
         * @type {Integer}
         * @default null
         */
        itemsPerPage :   {
            value:      null,
            validator:  Y.Lang.isNumber
        },

        /**
         * The current page selected for this paginator-model.
         *
         * This is intended as the **primary** change parameter to be .set() by the user, for interacting
         * with the Paginator Model.
         *
         * @attribute page
         * @type {Integer}
         * @default 1
         */
        page:    {
            value:      1,
            validator:  Y.Lang.isNumber
        },

        /**
         * The last active `page` that was selected, this is populated by a `pageChange` listener on the Model.
         *
         * @attribute lastPage
         * @type {Integer}
         * @default null
         */
        lastPage: {
            value:      null,
            validator:  Y.Lang.isNumber
        },

        /**
         * The total number of pages required to complete this pagination state (based upon `totalItems` and
         * `itemsPerPage`, specifically).
         *
         * This attribute is set / maintained by the method [_recalcPagnParams](#method__recalcPagnParams) and
         * shouldn't be set by the user.
         *
         * @attribute totalPages
         * @type Integer
         * @default null
         */
        totalPages: {
            value:      null,
            validator:  Y.Lang.isNumber,
            getter:     function(){ _yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "getter", 251);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 251);
return this._npages; }
        },

        /**
         * The index for the starting item on the current `page` within the pagination state.
         *
         * This attribute is calculated on the fly in a getter method [_getItemIndexStart](#method__getItemIndexStart) and
         * should not be "set" by the user, as it will be disregarded.
         *
         * @attribute itemIndexStart
         * @type Integer
         * @default null
         */
        itemIndexStart: {
            value :     null,
            validator:  Y.Lang.isNumber,
            getter:     '_getItemIndexStart'
        },

        /**
         * The index for the ending item on the current `page` within the pagination state.
         *
         * This attribute is calculated on the fly in a getter method [_getItemIndexEnd](#method__getItemIndexEnd) and
         * should not be "set" by the user, as it will be disregarded.
         *
         * @attribute itemIndexEnd
         * @type Integer
         * @default null
         */
        itemIndexEnd: {
            value :     null,
            validator:  Y.Lang.isNumber,
            getter:     '_getItemIndexEnd'
        }
    }

});



/**
 A View class extension to serve as a User Interface for the tracking of "pagination state" of
 a set of data.  This PaginatorView was specifically designed to work with PaginatorModel
 serving as the "model" (in MVC parlance), although would work with any user-supplied model under conditions
 where similar attributes and attribute changes are mapped.

 The PaginatorView was originally designed to function with DataTable (See Y.DataTable.Paginator) for managing the UI
 and page state of paginated tables, although it isn't necessarily limited to that application.  This View responds to
 the model's attribute `xxxxChange` events and updates the UI accordingly.

 The PaginatorView utilizes an HTML template concept, where certain replaceable tokens uniquely related to this view,
 in addition to all of the model's attributes, can be defined for positioning within the Paginator container.

 <h4>Usage</h4>

        // Setup a paginator view based on a data model for 500 items, paged at 50 per page ...
        var pagView = new Y.PaginatorView(
            container:  '#myPagDIV',
            paginatorTemplate:  '#script-tmpl-mypag',
            model:  new Y.PaginatorModel({
                totalItems:     500,
                itemsPerPage:   50
            })
        }).render();

 <h4>View 'container'</h4>
 The [container](#attr_container) attribute is the only **REQUIRED** attribute for this View, primarily because we need to know *where* to
 construct it positionally on the page.

 This view has been designed such that the `container` setting can be either (a) an actual Y.Node instance OR
 (b) a DOM css selector ID ... assumed if the container setting is a {String} with the first character is '#'.

 <h4>Paginator HTML Template</h4>
 The "HTML template" for this PaginatorView is the guts of displaying the user interface.  We refer to this as the "template" because it
 typically contains standard HTML but also includes "replacement tokens" identified by ```{your token here}``` curly braces.

 A definition of HTML Template for the paginator can be achieved through several methods;
 <ul>
    <li>Including the HTML template as content within the original `container` DOM element ... template retrived via .getHTML()</li>
    <li>Setting the <a href="#attr_paginatorTemplate">paginatorTemplate</a> attribute to either the template 'string', or giving a SCRIPT template DOM[id] or Y.Node</li>
    <li>Doing neither of the above ... where the default template is used (from <a href="#property_TMPL_PAGINATOR">TMPL_PAGINATOR</a> static property)</li>
 </ul>
 (Note: If for some reason it is desired to not have a "template" (because you are rendering one outside of this view), setting
 ```paginatorTemplate:''``` will override the default.)

 A noteworthy component of the "HTML template" includes the token **```{pageLinks}```**, which signifies where links generated by this
 view for each page selector are to be placed.  In some instances (e.g. a Paginator Bar, with an INPUT[text] for page #) you may not
 desire to have every link generated ... (think of a paginator with hundreds of pages, thus hundreds of links).

 A sub-template is used to generate the "{pageLinks}" content, please see attribute [pageLinkTemplate](#attr_pageLinkTemplate) for
 information.

 For a listing of all recognized *"replaceable tokens"* that can be included in the template is shown on the [render](#method_render) method
 API page.

 <h6>Data Attribute</h6>
 A key takeaway for using this View is that page links (i.e. actionable selectable elements, such as A, BUTTON, DIV, etc...) for a specific
 page use an HTML "data" attribute which defines the page associated with the link.

 The data attribute used within the view is `data-pglink`, and can have a value setting of "first", "last", "prev", "next" or any
 numeric page number.

 For example, the following are all valid page link identifiers;

        <a href="#" data-pglink="last" title="Last Page">Last</a>
        <button data-pglink="6" class="myBtn">Page 6</button>
        <select><option data-pglink="19" value="19">Page 19 : Rows 9501 - 10000</option></select>


 <h4>Connecting to "other" UI Elements / Widgets</h4>
 This View can be restricted to situations where the use desires to construct their own unique `pageLinkTemplate` and create their own
 `events` attribute to set listeners.

 For example, the PaginatorView's [render](#event_render) event can be listened for to ensure
 that the paginator has been initialized and setup.

 Additionally the [pageChange](#event_pageChange) event (of the view) can be listened for to do any updating to user-specified page links and
 or a supporting YUI Widget.

 Please see the examples for a guide on how to achieve this.


 @class Y.PaginatorView
 @extends Y.View
 @version 1.0.1
 @since 3.6.0
 **/
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 378);
Y.PaginatorView = Y.Base.create('paginatorView', Y.View, [], {


//================   S T A T I C     P R O P E R T I E S     ====================

    /**
    Default HTML content to be used as basis for Paginator.  This default is only used if the paginatorTemplate
    attribute is unused OR the container does not contain the HTML template.

    The paginator HTML content includes replacement tokens throughout.

    The DEFAULT setting is;

            <a href="#" data-pglink="first" class="{pageLinkClass}" title="First Page">First</a> |
            <a href="#" data-pglink="prev" class="{pageLinkClass}" title="Prior Page">Prev</a> |
            {pageLinks}
            | <a href="#" data-pglink="next" class="{pageLinkClass}" title="Next Page">Next</a> |
            <a href="#" data-pglink="last" class="{pageLinkClass}" title="Last Page">Last</a>

    @property TMPL_PAGINATOR
    @type String
    **/

    TMPL_PAGINATOR :  '<a href="#" data-pglink="first" class="{pageLinkClass}" title="First Page">First</a> | '
        + '<a href="#" data-pglink="prev" class="{pageLinkClass}" title="Prior Page">Prev</a> | '
        + '{pageLinks}'
        + ' | <a href="#" data-pglink="next" class="{pageLinkClass}" title="Next Page">Next</a> | '
        + '<a href="#" data-pglink="last" class="{pageLinkClass}" title="Last Page">Last</a>',

    /**
     Default HTML content that will be used to prepare individual links within the Paginator and inserted
     at the location denoted **{pageLinks}** replacement token in the template.

     The DEFAULT setting is;

            <a href="#" data-pglink="{page}" class="{pageLinkClass}" title="Page {page}">{page}</a>

     @property TMPL_LINK
     @type {String}
     **/
    TMPL_LINK : '<a href="#" data-pglink="{page}" class="{pageLinkClass}" title="Page {page}">{page}</a>',

    TMPL_basic : '{firstPage} {prevPage} {pageLinks} {nextPage} {lastPage}',


    TMPL_pglinks:   '{pageLinks}',

    /**
     Default HTML template for the Rows Per Page SELECT box signified by the **{selectRowsPerPage}** replacement toke
     within the paginator template.

     The DEFAULT setting is;

            <select class="{selectRPPClass}"></select>

     @property TMPL_selectRPP
     @type String
     **/
    TMPL_selectRPP:  '<select class="{selectRPPClass}"></select>',

    /**
     Default HTML template for the Page SELECT box signified by the **{selectPage}** replacement token with the
     paginator template.

     The DEFAULT setting is;

            <select class="{selectPageClass}"></select>

     @property TMPL_selectPage
     @type String
     **/
    TMPL_selectPage: '<select class="{selectPageClass}"></select>',

    /**
     Default HTML template for the "Rows Per Page" INPUT[text] control signified by the **{inputRowsPerPage}** replacement
     token within the paginator template.

     The DEFAULT setting is;

            <input type="text" class="{inputRPPClass}" value="{itemsPerPage}"/>

     @property TMPL_inputRPP
     @type String
     **/
    TMPL_inputRPP:   '<input type="text" class="{inputRPPClass}" value="{itemsPerPage}"/>',

    /**
     Default HTML template for the "Page" INPUT[text] control signified by the **{inputPage}** replacement token with the
     paginator template.

     The DEFAULT setting is;

            <input type="text" class="{inputPageClass}" value="{page}"/>

     @property TMPL_inputPage
     @type String
     **/
    TMPL_inputPage:  '<input type="text" class="{inputPageClass}" value="{page}"/>',


    /**
     A public property, provided as a convenience property, equivalent to the "model" attribute.

     @property model
     @type Y.PaginatorModel
     @default null
     @public
     **/
    model: null,

//================   P R I V A T E    P R O P E R T I E S     ====================

    /**
     * Placeholder property to store the initial container HTML for used later in the
     *  render method.  This property is populated by the View initializer.
     *
     * @property _pagHTML
     * @protected
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
     * @type Array
     * @default null
     * @protected
     */
    _subscr: null,


    /**
     * Helper function, because I was too lazy to figure out how to get widget getClassName working
     *
     * @method _myClassName
     * @param String variable number of strings, to be concatenated
     * @return String
     * @private
     */
    _myClassName: function() {
        _yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "_myClassName", 533);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 534);
if (arguments && arguments.length>0) {
            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 535);
var rtn = this._cssPre;
            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 536);
for(var i=0; i<arguments.length; i++)
                {_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 537);
rtn += '-' + arguments[i];}
            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 538);
return rtn;
        }
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 540);
return '';
    },

    /**
     * Initializer sets up classes and the initial container and HTML templating for this View.
     *
     * @method initializer
     * @private
     * @return this
     */
    initializer: function(){
        //
        //  Init class names
        //
        _yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "initializer", 550);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 554);
this._classContainer  = this._myClassName('container');
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 555);
this._classLinkPage   = this._myClassName('link','page');
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 556);
this._classLinkPageList = this._myClassName('link','page','list');
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 557);
this._classLinkPageActive  = this._myClassName('link','page','active');
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 558);
this._classInputPage  = this._myClassName('input','page');
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 559);
this._classSelectPage = this._myClassName('select','page');
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 560);
this._classSelectRPP  = this._myClassName('select','rowsperpage');
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 561);
this._classInputRPP   = this._myClassName('input','rowsperpage');

    //
    //  Setup the container for the paginator, and retrieve the "HTML template"
    //    from any of the following in order;
    //      (a) the "container" HTML,
    //      (b) user specified template via 'paginatorTemplate' attribute,
    //      (c) finally, the default internal template via valueFn.
    //
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 570);
var cont = this.get('container');
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 571);
if (Y.Lang.isString(cont) && pagTmpl[0] === '#' )
            {_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 572);
this.set('container', Y.one(cont) );}

        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 574);
cont = this.get('container');
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 575);
if ( cont instanceof Y.Node && cont.getHTML() ) {

            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 577);
this._pagHTML = cont.getHTML();

        } else {_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 579);
if ( cont instanceof Y.Node && this.get('paginatorTemplate') ) {

            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 581);
var pagTmpl = this.get('paginatorTemplate');

            // is user-supplied setting, but they forgot to convert via Y.one().getHTML,
            //  do it for them ...
            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 585);
if ( pagTmpl && pagTmpl[0] === '#' )
                {_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 586);
this._pagHTML = Y.one( pagTmpl).getHTML();}
            else {_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 587);
if ( pagTmpl )
                {_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 588);
this._pagHTML = pagTmpl;}}
        }}

        //
        // Setup the container and model listeners
        //
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 594);
this._bindUI();

        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 596);
return this;
    },


    /**
     * Setup listeners on this View, specifically on all UI elements and
     *  "most importantly", listen to "pageChange" on the underlying Model.
     *
     * @method _bindUI
     * @return this
     * @private
     */
    _bindUI: function(){
        _yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "_bindUI", 608);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 609);
var pag_cont =  this.get('container');
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 610);
this._subscr = [];

        //
        // Set a listener on the Model change events ... page most important!
        //
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 615);
if ( this.get('model') ) {
            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 616);
this.model = this.get('model');
            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 617);
this._subscr.push( this.model.after('pageChange', Y.bind(this._modelPageChange,this)) );
            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 618);
this._subscr.push( this.model.after('itemsPerPageChange', Y.bind(this._modelStateChange,this)) );
            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 619);
this._subscr.push( this.model.after('totalItemsChange', Y.bind(this._modelStateChange,this)) );
        }

        // update rowOptions
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 623);
this._subscr.push( this.after('render', Y.bind(this._updateRPPSelect,this)) );

        // delegate container events, done here instead of "events" property to give more flexibility
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 626);
this._subscr.push( pag_cont.delegate( 'click',  this._clickChangePage,'.'+this._classLinkPage, this) );
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 627);
this._subscr.push( pag_cont.delegate( 'change', this._selectChangeRowOptions, '.'+this._classSelectRPP, this) );
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 628);
this._subscr.push( pag_cont.delegate( 'change', this._inputChangePage, '.'+this._classInputPage, this) );
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 629);
this._subscr.push( pag_cont.delegate( 'change', this._selectChangeRowOptions, '.'+this._classInputRPP, this) );

        // after rendering and/or, resize if required ...
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 632);
this._subscr.push( this.after(['render','pageChange'], this.resizePaginator) );

        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 634);
return this;
    },


    /**
     * Default destructor method, cleans up the listeners that were created and
     *  cleans up the view contents.
     *
     * @method destructor
     * @private
     */
    destructor: function () {
        _yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "destructor", 645);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 646);
Y.Array.each(this._subscr,function(item){
            _yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "(anonymous 3)", 646);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 647);
item.detach();
        });
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 649);
this._subscr = null;
    },


    /**
     Renders the current settings of the Paginator using the supplied HTML content from the
     for the paginator template and Y.Lang.sub for replacement of tokens and of Model attributes.

     NOTE: The render method is not called on every page "click", but is called if the Model changes
     `totalItems` or `itemsPerPage`.

     <h6>Recognized tokens:</h6>
     Recognizeable tokens are supported, specifically as *placeholders* within the html template where generated content
     can be inserted and ultimately rendered in the view container.

     Tokens replaced within this method include all of the PaginatorModel attributes;

        **{page}**, **{totalItems}**, **{itemsPerPage}**, **{lastPage}**, **{totalPages}**, **{itemIndexStart}**, **{itemIndexEnd}**

     Additionally, specific tokens intended for view HTML construction and recognized by PaginatorView are;
     <ul>
        <li><b>{pageLinks}</b> : The placeholder within the html template where the View-generated page links will
        <br/>be inserted via a loop over all pages (DEFAULT: see <a href="#property_TMPL_LINK">TMPL_LINK</a>)</li>
        <li><b>{inputPage}</b> : An INPUT[type=text] box which the view listens for change events on (Default: see <a href="#property_TMPL_inputPage">TMPL_inputPage</a>)</li>
        <li><b>{selectRowsPerPage}</b> : A SELECT type pulldown that will be populated with the <a href="#attr_pageOptions">pageOptions</a>
     array <br/>of "Rows per Page" selections (Default: see <a href="#property_TMPL_selectRPP">TMPL_selectRPP</a>)</li>
        <li><b>{inputRowsPerPage}</b> : An INPUT[type=text] box what will be listened to for changes to "Rows per Page" (Default: see <a href="#property_TMPL_inputRPP">TMPL_inputRPP</a>)</li>
        <li><b>{selectPage}</b> (Not implemented at this time!)</li>
        <li><b>{pageStartIndex}</b> : Represents the starting index for a specific "page" (intended for use within <a href="#attr_pageLinkTemplate">pageLinkTemplate</a> )</li>
        <li><b>{pageEndIndex}</b> : Represents the ending index for a specific "page" (intended for use within <a href="#attr_pageLinkTemplate">pageLinkTemplate</a> )</li>
     </ul>

     And if that wasn't enough, the CSS class names supported by this view are also provided via tokens as;
        **{pagClass}**, **{pageLinkClass}**, **{inputPageClass}**, **{selectRPPClass}**, **{selectPageClass}**, **{inputRPPClass}**


     This method utilizes the Y.substitute tool (with recursion) for token replacement.

     The `container` visibility is disabled during construction and insertion of DOM elements into the `container` node.

     This method fires the `render` event, for View listeners.

     @method render
     @public
     @returns this
     **/
    render: function() {
        _yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "render", 695);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 696);
var pag_cont = this.get('container'),
            model    = this.get('model'),
            nsize    = model.get('totalItems'),
            nperpage = model.get('itemsPerPage'),
            npage    = model.get('totalPages'),
            cpage    = model.get('page') || 1;

       _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 703);
if ( !nsize || !nperpage || !pag_cont ) {return this;}

        //
        //  Constructing the Paginator HTML,
        //      first construct the individual Page links ...
        //
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 709);
var pl_html   = '',
            plinkTMPL = this.get('pageLinkTemplate'), // || this.TMPL_LINK;
            plIStart  = 0,
            plIEnd    = 0;

        // ... only burn thru this if the token is included in template ...
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 715);
if ( this._pagHTML.search(/{pageLinks}/) !== -1 ) {
            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 716);
for(var i=0; i<npage; i++) {
                _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 717);
plClass = this._classLinkPage + ' ' + this._classLinkPageList;  //plItemCSS;
                _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 718);
if ( i+1 === cpage )
                    {_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 719);
plClass += ' '+ this._classLinkPageActive;} //this._cssActivePage;

                _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 721);
plIStart = i*nperpage + 1,
                plIEnd   = plIStart + nperpage - 1;
                _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 723);
if ( plIEnd >= nsize ) {plIEnd = nsize;}

                _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 725);
pl_html += Y.Lang.sub( plinkTMPL, {
                    page:           (i+1),
                    pageLinkClass:  plClass || '',
                    pageStartIndex: plIStart,
                    pageEndIndex:   plIEnd
                });
            }
        }

    // ... then build the full HTML
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 735);
var pg_html = this._pagHTML;
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 736);
pag_cont.setStyle('visibility','hidden');
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 737);
pag_cont.setHTML('');         //pag_cont.empty();

    // and load it into the container
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 740);
pg_html = '<div class="{pagClass}" tabindex="-1">' + pg_html + '</div>';
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 741);
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

        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 755);
pag_cont.append(plink_tmpl);

    //
    //  Turn the View visibility on, and set the initial page
    //
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 760);
pag_cont.setStyle('visibility','');

        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 762);
this._processPageChange(cpage);

        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 764);
this.fire('render');

        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 766);
return this;
    },


    /**
     * Main handler that accomodates Page changes and updates visual cues for highlighting
     *  the selected page link and the active Page selector link list.
     *
     * This method also fires the View's "pageChange" event.
     *
     * NOTE: This method is *private* because page changes should be made by the user at
     * the Model level (Model.set('page',...) and not using the _processPageChange method.
     *
     * @method _processPageChange
     * @param {Integer} cpage
     * @private
     */
    _processPageChange: function(cpage) {
        _yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "_processPageChange", 783);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 784);
var model      = this.get('model'),
            npage      = model.get('totalPages'),
            lastPage   = model.get('lastPage'),
            maxpls     = this.get('maxPageLinks'),
            pag_cont   = this.get('container'),
            linkOffset = this.get('linkListOffset'),
            plNodes    = pag_cont.all('.'+ this._classLinkPageList);

        //
        //  Toggle highlighting of active page selector (if enabled)
        //
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 795);
if ( plNodes && this.get('linkHighLight') ) {

            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 797);
var plNodeCurrent = (plNodes && (cpage-1) < plNodes.size()) ? plNodes.item(cpage-1) : null;
            // this check is only for visual elements that have pageLinks
            //   (i.e. paginator bar won't have these )
            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 800);
if ( plNodeCurrent )
                {_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 801);
plNodeCurrent.addClass( this._classLinkPageActive );}
            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 802);
if ( lastPage && lastPage !== cpage ) {
                _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 803);
plNodeCurrent = (plNodes && (lastPage-1) < plNodes.size()) ? plNodes.item(lastPage-1) : null;
                _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 804);
if (plNodeCurrent) {plNodeCurrent.removeClass( this._classLinkPageActive );}
            }
        }

        // Update INPUT Page # field, if defined ...
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 809);
if ( pag_cont.one('.'+this._classInputPage) ) {
            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 810);
pag_cont.one('.'+this._classInputPage).set('value',cpage);
        }

        // Update SELECT Items Per Page # field, if defined ...
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 814);
if ( pag_cont.one('.'+this._classInputRPP) ) {
            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 815);
pag_cont.one('.'+this._classInputRPP).set('value',model.get('itemsPerPage'));
        }

        //
        //  Toggle "disabled" on First/Prev or Next/Last selectors
        //
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 821);
if ( cpage === 1 && !this.get('circular') ) {

            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 823);
this._disablePageSelector(['first','prev']);
            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 824);
this._disablePageSelector(['last','next'],true);

        } else {_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 826);
if ( cpage === npage && !this.get('circular') ) {

            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 828);
this._disablePageSelector(['first','prev'],true);
            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 829);
this._disablePageSelector(['last','next']);

        } else   // enable all selectors ...
            {_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 832);
this._disablePageSelector(['first','prev','last','next'],true);}}

         _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 834);
this.fire('pageChange',{state: model.getAttrs() });

    //
    //  Following code is only if user requests limited pageLinks,
    //    Only continue if partial links are requested ...
    //
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 840);
if ( npage <= maxpls || !plNodes || ( plNodes && plNodes.size() ==0 ) ) {return;}

        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 842);
var moreNodeL  = Y.Node.create('<span class="'+this._myClassName('more')+'">'+this.get('pageLinkFiller')+'</span>'),
            moreNodeR  = Y.Node.create('<span class="'+this._myClassName('more')+'">'+this.get('pageLinkFiller')+'</span>');

        // Clear out any old remaining 'more' nodes ...
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 846);
pag_cont.all('.'+this._myClassName('more')).remove();

        // determine offsets either side of current page
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 849);
var offs = this._calcOffset(cpage,linkOffset);

        //
        // Hide all page # links outside of offsets ...
        //
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 854);
plNodes.each(function(node,index){
            _yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "(anonymous 4)", 854);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 855);
if ( index == 0 && this.get('alwaysShowFirst') || index == npage-1 && this.get('alwaysShowLast') ) {return true;}
            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 856);
if ( index+1 < offs.left || index+1 > offs.right )
                {_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 857);
node.addClass( this._myClassName('hide') );}
            else
                {_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 859);
node.removeClass( this._myClassName('hide') );}
        },this);

        //
        //  add the node either side of current page element PLUS offset
        //
        //var oleft =
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 866);
if ( offs.left - linkOffset > 0 )
            {_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 867);
plNodes.item(offs.left-1).insert(moreNodeL,'before');}

        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 869);
if ( offs.right + linkOffset <= npage )
            {_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 870);
plNodes.item(offs.right-1).insert( moreNodeR,'after');}

        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 872);
return true;

    },

    /**
     * Helper method to calculate offset either side of Selected Page link
     *  for abbreviated Page List.
     *
     *  Called by _processPageChange
     *
     * @method _calcOffset
     * @param cpage {Integer} Current page number
     * @param offset {Integer} Number of links both sides of page number to return for (usually 1)
     * @return {Object} containing left {Integer} and right {Integer} properties
     * @private
     */
    _calcOffset: function(cpage, offset) {
        _yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "_calcOffset", 888);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 889);
var npage     = this.get('model').get('totalPages'),
            left_off  = ( cpage-offset < 1 ) ? 1 : (cpage-offset),
            right_off = ( cpage+offset > npage) ? npage : (cpage+offset);
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 892);
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
        _yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "_disablePageSelector", 907);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 908);
linkSel = ( !Y.Lang.isArray(linkSel) ) ? [ linkSel ] : linkSel;
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 909);
visible = ( visible ) ? visible : false;
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 910);
var sel_srch = '[data-{suffix}="{sdata}"]',
            pag_cont = this.get('container');

        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 913);
Y.Array.each(linkSel,function(pgid){
            _yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "(anonymous 5)", 913);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 914);
var node = pag_cont.one(Y.Lang.sub(sel_srch,{suffix:'pglink',sdata:pgid}) );
            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 915);
if ( node ) {
                _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 916);
if (visible) {
                    //node.setStyle('visibility','');
                    _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 918);
node.removeClass(this._myClassName('disabled'));
                } else {
                    //node.setStyle('visibility','hidden');
                    _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 921);
node.addClass(this._myClassName('disabled'));
                }
            }
        },this);
    },

    /**
     * Setter for the "model" attribute, that for convenience also sets a public property to this View.
     *
     * @method _setModel
     * @param val
     * @return {*}
     * @private
     */
    _setModel : function(val){
        _yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "_setModel", 935);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 936);
if ( !val ) {return;}
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 937);
this.model = val;
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 938);
return val;
    },


    /**
     * Handler responds to Model's `pageChange` event
     *
     *  Listener set in _bindUI
     *
     * @method _modelPageChange
     * @param {EventFacade} e
     * @private
     */
    _modelPageChange: function(e) {
        _yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "_modelPageChange", 951);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 952);
var newPage = e.newVal;
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 953);
if ( newPage )
            {_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 954);
this._processPageChange(newPage);}
    },

    /**
     * Handler responds to Model's `itemsPerPageChange` event
     *
     *  Listener set in _bindUI
     *
     * @method _modelStateChange
     * @param {EventFacade} e
     * @private
     */
    _modelStateChange: function(e) {
        _yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "_modelStateChange", 966);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 967);
var newRPP = e.newVal;
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 968);
if (newRPP && !e.silent ) {this.render();}
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
        _yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "_updateRPPSelect", 981);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 982);
var pag_cont  = this.get('container'),
            model     = this.get('model'),
            selPage   = pag_cont.one('.'+this._classSelectRPP),
            pgOptions = this.get('pageOptions');

        // this part is to load "pageOptions" array
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 988);
if ( pgOptions && selPage ) {
            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 989);
if ( Y.Lang.isArray(pgOptions) ) {
                //
                //  Clear out any initial options, and add new options
                //    using DOMNode methods ... seems to work better.
                //
                _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 994);
var opts = selPage.getDOMNode().options;
                _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 995);
opts.length = 0;

                _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 997);
Y.Array.each(pgOptions, function(optVal) {
                    _yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "(anonymous 6)", 997);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 998);
var opt = new Option(optVal);
                    _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 999);
opts[opts.length] = opt;
                });
            }
        }

        // set current rowsPerPage to selected in combobox
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1005);
if ( selPage ) {
            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1006);
var isAll = ( model && model.get('itemsPerPage') === model.get('totalItems') ) ? true : false;
            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1007);
var opts = selPage.get('options');
            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1008);
opts.each(function(opt) {
                _yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "(anonymous 7)", 1008);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1009);
if ( opt.get('value') == model.get('itemsPerPage')
                    || (opt.get('value').search(/all/i)!==-1 && isAll) )
                    {_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1011);
opt.set('selected',true);}
                //else if ( model.get('itemsPerPage') )
            },this);
        }

        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1016);
if ( pag_cont.one('.'+this._classSelectPage) )
            {_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1017);
this._updatePageSelect();}
    },

    /**
     Method that responds to changes in the SELECT box for "page"

     @method _updatePageSelect
     @private
     @beta
     **/
    _updatePageSelect: function() {
        _yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "_updatePageSelect", 1027);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1028);
var pag_cont  = this.get('container'),
            model     = this.get('model'),
            selPage   = pag_cont.one('.'+this._classSelectPage);


        /*  clearly, this method is incomplete .... */
    },


    /**
     * Handler responding to INPUT[text] box page change.
     *
     * Listener set in _bindUI
     *
     * @method _inputChangePage
     * @param {EventFacade} e
     * @private
     */
    _inputChangePage: function(e) {
        _yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "_inputChangePage", 1046);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1047);
var tar = e.target,
            val = +tar.get('value') || 1,
            model = this.get('model');

        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1051);
if (val<1 || val>model.get('totalPages') ) {
            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1052);
val = 1;
            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1053);
tar.set('value',val);
        }
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1055);
model.set('page',val);
    },

    /**
     * Handler responding to a Page Selector "click" event.  The clicked Node is
     * reviewed for its data-pglink="" setting, and processed from that.
     *
     * Changed page is then sent back to the Model, which reprocesses the
     *  paginator settings (i.e. indices) and fires a `pageChange` event.
     *
     *  Listener set in _bindUI
     *
     * @method _clickChangePage
     * @param {EventFacade} e
     * @private
     */
    _clickChangePage: function(e) {
        _yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "_clickChangePage", 1071);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1072);
var tar   = e.target,
            model = this.get('model');
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1074);
e.preventDefault();

        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1076);
if (e.target.hasClass(this._myClassName('disabled')) || e.currentTarget.hasClass(this._myClassName('disabled'))) {return;}

        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1078);
var page  = tar.getData('pglink') || e.currentTarget.getData('pglink'),
            npage = model.get('totalPages'),
            cpage = model.get('page'); //tar.get('text');

        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1082);
if ( cpage && cpage === page ) {return;}

        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1084);
switch(page) {
            case 'first':
                _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1086);
page = 1;
                _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1087);
break;
            case 'last':
                _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1089);
page = npage;
                _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1090);
break;
            case 'prev':
                _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1092);
page = (!cpage) ? 1 : (cpage === 1) ? npage : cpage - 1;
                _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1093);
break;
            case 'next':
                _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1095);
page = (!cpage) ? 1 : (cpage === npage ) ? 1 : cpage + 1;
                _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1096);
break;
            default:
                _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1098);
page = +page;

        }

        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1102);
model.set('page',page);
    },

    /**
     * Handler that responds to SELECT changes for no. of rows per page
     *
     * Listener set in _bindUI
     *
     * @method _selectChangeRowOptions
     * @param {EventFacade} e
     * @private
     */
    _selectChangeRowOptions: function(e){
        _yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "_selectChangeRowOptions", 1114);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1115);
var tar = e.target,
            val = +tar.get('value') || tar.get('value');

        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1118);
if ( Y.Lang.isString(val) && val.toLowerCase() === 'all' ) {
            _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1119);
val = this.get('model').get('totalItems');
        }
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1121);
this.get('model').set('itemsPerPage',val);
        _yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1122);
this.render();
    }


    /**
     * Fires after the Paginator has been completely rendered.
     * @event render
     */

    /**
     * Fires after the _processPageChange method has updated the pagination state.
     * @event pageChange
     * @param {Object} state The PaginatorModel `getAttrs()` "state" after updating to the current page as an object.
     * @since 3.5.0
     */


},{
    /**
     * The default set of attributes which will be available for instances of this class
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    ATTRS:{

        /**
         * The base PaginatorModel that serves as data / change provider for this View.
         *
		 *	@example
         *      paginator:  new Y.PaginatorModel({
         *          itemsPerPage:  250
         *      }),
         *      OR
         *  	paginator:  myPagModel // where myPagModel is an instance previously created ...
         *
         * @attribute model
         * @default null
         * @type {Y.PaginatorModel}
         */
        model: {
            value:     null,
           // validator: function(v){ return v instanceof Y.PaginatorModel; },
            setter:    '_setModel'
        },

        /**
          The container holder for the contents of this View.  Can be entered either as
          a Y.Node instance or as a DOM "id" attribute (if prepended by "#").

		 	@example
                container: Y.one("#myDiv"),
                OR
                container: "#myDiv"

          NOTE: If the container node contains HTML <b>it will be used as the paginatorTemplate</b>


          @attribute container
          @default null
          @type {Node|String}
          @required
         **/
        container: {
            value: null
        },

        /**
         An array that will be used to populate the rows per page SELECT box ( using string replacement "{selectRowsPerPage}" or
         class selector "yui3-pagview-select-rowsperpage" ).

          @attribute pageOptions
          @type {Array}
          @default [ 10, 20, 'All' ]
         **/
        pageOptions: {
            value:      [ 10, 20, 'All' ],
            validator:  Y.Lang.isArray
        },

        /**
          A string that defines the Paginator HTML contents.  Can either be entered as a {String} including replacement parameters
          or as a {Node} instance whose contents will be read via .getHTML() or a DOM "id" element (indicated by '#' in first character)
          <br/><br/>
          To disable creation of any template (in order to do your own replacements of the template), set this to ''.

            @example
                paginatorTemplate:  '<div data-pglink="first">FIRST</div> {pageLinks} <div data-pglink="last">LAST</div>',
                paginatorTemplate:  Y.one('#script-id-tmpl'),
                paginatorTemplate:  Y.one('#script-id-tmpl').getHTML(),
                paginatorTemplate:  '#script-id-tmpl',   // where

          @attribute paginatorTemplate
          @type {Node|String}
          @default See TMPL_PAGINATOR static property
         **/
        paginatorTemplate:  {
            valueFn: function(){
                _yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "valueFn", 1220);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1221);
return this.TMPL_PAGINATOR;
            }
        },

        /**
         Defines the HTML template to be used for each individual page within the Paginator.  This can be used along
         with replacement tokens to create UI elements for each page link.  The template is used to construct the
         `{pageLinks}` replacement token with the paginator body.

         Recognized replacement tokens most appropriate to this attribute are `{page}`, `{pageStartIndex}` and
         `{pageEndIndex}`.

         A few examples of this template are listed below;
         @example
                pageLinkTemplate: '<a href="#" data-pglink="{page}" class="" title="Page No. {page}">{page}</a>'

         @attribute pageLinkTemplate
         @type String
         @default See TMPL_LINK static property
         **/
        pageLinkTemplate:   {
            valueFn: function(){
                _yuitest_coverfunc("/build/gallery-paginator-view/gallery-paginator-view.js", "valueFn", 1242);
_yuitest_coverline("/build/gallery-paginator-view/gallery-paginator-view.js", 1243);
return this.TMPL_LINK;
            }
        },

        // May not be necessary anymore
        linkHighLight: {
            value:      true,
            validator:  Y.Lang.isBoolean
        },

        /**
         Used to set the maximum number of page links that will be displayed for individual pages within `{pageLinks}`.
         This is the primary attribute to use to setup **abbreviated page links**, to avoid a long line of page links
         that travel across the page!

         Setting this to some number less than the total number of pages will begin abbreviating the links.
         <br/>(See also attributes [`linkListOffset`](#attr_linkListOffset) and [`pageLinkFiller`](#attr_pageLinkFiller), which work in conjunction with this attribute).

         @attribute maxPageLinks
         @type Integer
         @default 9999
         **/
        maxPageLinks:   {
            value:      9999,
            validator:  Y.Lang.isNumber
        },

        /**
         Setting that represents the number of links adjacent to the current page that should be displayed for instances where
         an *abbreviated* page link list is desired.
         <br/>(See [maxPageLinks](#attr_maxPageLinks) and [pageLinkFiller](#attr_pageLinkFiller) attributes).

         For example, a setting of this attribute to 1, will result in 3 page links (current page plus 1 each side),
         <br/>likewise a setting of 2, will results in 5 page links in the center of the paginator, etc.

         @attribute linkListOffset
         @type Integer
         @default 1
         **/
        linkListOffset: {
            value:      1,
            validator:  Y.Lang.isNumber
        },

        /**
         Setting the the ".. more" indicator to be used specifically for *abbreviated* page link lists.
         <br/>(See [maxPageLinks](#attr_maxPageLinks) and [linkListOffset](#attr_linkListOffset) attributes).

         @attribute pageLinkFiller
         @type String
         @default '...'
         **/
        pageLinkFiller: {
            value:      '...',
            validator:  Y.Lang.isString
        },

        /**
         Flag to indicate whether the first page link **within the `{pageLinks}` template** is to be displayed or not.
         <br/>Specifically intended for *abbreviated* page link lists (See [maxPageLinks](#attr_maxPageLinks) attribute).

         For Example;
         <br/>If our paginator state currently has 9 pages, and the current page is 5, if `alwaysShowLast:false` and `alwaysShowFirst:false`
            the link list will resemble;<br/>First | Prev | ... 4 5 6 ... | Next | Last

            Likewise, with `'alwaysShowLast:true` (and alwaysShowFirst:true) the link list will resemble;
         <br/>First | Prev | 1 ... 4 5 6 ... 9 | Next | Last

         @attribute alwaysShowFirst
         @type Boolean
         @default false
         **/
        alwaysShowFirst:{
            value:      false,
            validator:  Y.Lang.isBoolean
        },

        /**
         Flag to indicate whether the last page link **within the `{pageLinks}` template** is to be displayed or not.
         <br/>Specifically intended for *abbreviated* page link lists (See [maxPageLinks](#attr_maxPageLinks) attribute).

         See `alowsShowFirst` for an example.

         @attribute alwaysShowLast
         @type Boolean
         @default false
         **/
        alwaysShowLast:{
            value:      false,
            validator:  Y.Lang.isBoolean
        },

        /**
         Not implemented at this time.
         @attribute selectPageFormat
         @type String
         @default 'Page {page}'
         @beta
         **/
        selectPageFormat: {
            value:      'Page {page}',
            validator:  Y.Lang.isString
        },

        /**
         Flag indicating whether "circular" behavior of the Paginator View is desired.  If `true` the paginator
         will stop "disabling" First|Previous or Next|Last toggling and will continue at either 1st page or last
         page selections.  (i.e. when on *last* page, a *next* click will return to page 1)

         @attribute circular
         @type Boolean
         @default false
         **/
        circular : {
            value:      false,
            validator:  Y.Lang.isBoolean
        }

    }

});



}, 'gallery-2012.08.29-20-10' ,{skinnable:true, requires:['base-build','model','view','substitute']});
