    /**
     A class extension for DataTable that adds "highlight" and "select" actions via mouse selection.

     @module DataTable
     @submodule Selection
     @class Y.DataTable.Selection
     @extends Y.DataTable
     @author Todd Smith
     @version 1.0.0
     @since 3.6.0
     **/
    function DtSelection() {}

    DtSelection.ATTRS = {
        /**
         * Attribute that is set to a Node for the most recent "highlighted" item, either TD or TR
         * @attribute highlighted
         * @type {Node}
         * @default null
         */
        highlighted : {
            value:      null,
            validator:  function(v){ return v instanceof Y.Node; }
        },

        /**
         * Attribute that is set to a Node for the most recent "selected" item, either TD or TR
         * @attribute selected
         * @type {Node}
         * @default null
         */
        selected:{
            value:      null,
            validator:  function(v){ return v instanceof Y.Node; }
        },

        /**
         * Set the current mode for highlighting, either for a single TD (as "cell") or for a
         * full TR (as "row"
         * @attribute highlightMode
         * @type {String}
         * @default 'cell'
         */
        highlightMode:{
            value:      'cell',
            setter:     '_setHighlightMode',
            validator:  Y.Lang.isString
        },

        /**
         * Set the current mode for indicating selections, either for a single TD (as "cell") or for a
         * full TR (as "row"
         * @attribute highlightMode
         * @type {String}
         * @default 'cell'
         */
        selectionMode:{
            value:      'row',
            setter:     '_setSelectionMode',
            validator:  Y.Lang.isString
        },

        /**
         * Readonly attribute which returns the currently selected TR's
         * @attribute selectedRows
         * @type {Array}
         * @readonly
         * @default []
         */
        selectedRows: {
            value:      [],
            readOnly:   true,
            validator:  Y.Lang.isArray,
            getter:     '_getSelectedRows',
            //setter:     '_setSelectedRows'
        },

        /**
         * Attribute that either sets the current "selected" records (by entering an array of DataTable record
         * indices) or returns an array of "selected" records based on the recent selections.
         * @attribute selectedRecords
         * @type {Array}
         * @default []
         */
        selectedRecords: {
            value:      [],
            validator:  Y.Lang.isArray,
            setter:     '_setSelectedRecords',
            getter:     '_getSelectedRecords'
        },

        /**
         * Attribute that sets the initially selected cells TD's or returns the currently selected TD's.
         * @attribute selectedCells
         * @type {Array}
         * @default []
         */
        selectedCells: {
            value:      [],
            validator:  Y.Lang.isArray,
            setter:     '_setSelectedCells',
            getter:     '_getSelectedCells'
        },

        /**
         * Flag to allow either single "selections" (false) or multiple selections (true).
         * For Macintosh OSX-type systems the modifier key "Cmd" is held for multiple selections,
         *  and for Windows or Linux type systems the modifier key is "Ctrl".
         * @attribute selectionMulti
         * @type {Boolean}
         * @default false
         */
        selectionMulti: {
            value:      false,
            setter:     '_setSelectionMulti',
            validator:  Y.Lang.isBoolean
        }

    };


    Y.mix( DtSelection.prototype, {

        /**
         * @property _selections
         * @type Array
         * @default null
         * @static
         * @protected
         */
        _selections: null,

        /**
         * Holder for the classname for the "highlight" TR or TD
         * @property _classHighlight
         * @type String
         * @default null
         * @static
         * @protected
         */
        _classHighlight: null,

        /**
         * Holder for the classname for the "selected" TR or TD
         * @property _classSelected
         * @type String
         * @default null
         * @static
         * @protected
         */
        _classSelected: null,

        /**
         * Holder for the most recent "click" event modifier keys from last click,
         *  used for assessing "multi" selections.
         *
         * Contains properties;  altKey, ctrlKey, shiftKey, metaKey, button and which
         *
         * Filled initially by .initializer and on each Table "click".
         *
         * @property _clickModifiers
         * @type Object
         * @default null
         * @static
         * @protected
         */
        _clickModifiers: null,

//------------------------------------------------------------------------------------------------------
//        L I F E C Y C L E    M E T H O D S
//------------------------------------------------------------------------------------------------------

        /**
         * Sets listeners and initial class names required for this "datatable-selector" module
         * @method initializer
         * @public
         */
        initializer: function(){
            this._selections = [];
            this._eventHandles.selector = [];
            this._eventHandles.selector.push( this.on('highlightedChange',this._highlightChange) );
            this._eventHandles.selector.push( this.on('selectedChange',this._selectedChange) );

            this._classHighlight = 'highlighted';   //this.getClassName('selection','highlighted');
            this._classSelected  = 'selected';      //this.getClassName('selection','selected');

            this._clickModifiers = {
                ctrlKey:null, altKey:null, metaKey:null, shiftKey:null, which:null, button:null
            };
        },

        /**
         * Destructor to clean up listener event handlers and the internal storage buffer.
         * @method destructor
         * @public
         */
        destructor: function () {
            Y.Array.each( this._eventHandles.selector,function(item){
                item.detach();
            });
            this._mlistArray = null;
            this._eventHandles.selector = null;
        },


//------------------------------------------------------------------------------------------------------
//        P U B L I C     M E T H O D S
//------------------------------------------------------------------------------------------------------

        /**
         * Returns the Column object (from the original "columns") associated with the input TD Node.
         * @method getColumnByTd
         * @param {Node} cell Node of TD for which column object is desired
         * @return {Object} column The column object entry associated with the desired cell
         * @public
         */
        getColumnByTd:  function(cell){
            var colName = this.getColumnNameByTd(cell);
            return (colName) ? this.getColumn(colName) : null;
        },


        /**
         * Returns the column "key" or "name" string for the requested TD Node
         * @method getColumnNameByTd
         * @param {Node} cell Node of TD for which column name is desired
         * @return {String} colName Column name or key name
         * @public
         */
        getColumnNameByTd: function(cell){
            var classes = cell.get('className').split(" "),
                regCol  = new RegExp( this.getClassName('col') + '-(.*)');

            var colName;
            Y.Array.some(classes,function(item){
                var colmatch =  item.match(regCol);
                if ( colmatch && Y.Lang.isArray(colmatch) && colmatch[1] ) {
                    colName = colmatch[1];
                    return true;
                }
            });

            return colName || null;
        },

        /**
         * Utility method that will return all selected TD Nodes for the current "selected" set.
         * If selections include a TR row, all child TD's from the row are included.
         *
         * @method getSelectedTds
         * @return {Array} tds Array of selected TD's as Nodes
         * @public
         */
        getSelectedTds: function(){
            var tds = [];
            Y.Array.each(this._selections,function(item){
                if ( item.get('tagName').toLowerCase() === 'td' )
                    tds.push( item );
                else if ( item.get('tagName').toLowerCase() === 'tr' ) {
                    var tdNodes = item.all("td");
                    if ( tdNodes )
                        tdNodes.each(function(item){ tds.push( item )});
                }
            });
            return tds;
        },

        clearSelections: function(){
            this._selections = [];
            this._clearAll(this._classSelected);
        },

        clearHighlighted: function(){
            this._clearAll(this._classHighlight);
        },

        clearAll: function(){
            this.clearSelections();
            this._clearAll(this._classHighlight);
        },

//------------------------------------------------------------------------------------------------------
//        P R I V A T E    M E T H O D S
//------------------------------------------------------------------------------------------------------

        /**
         * Method that updates the "highlighted" classes for the selection and unhighlights the prevVal
         * @method _highlightChange
         * @param o
         * @private
         */
        _highlightChange: function(o) {
            var tar = this._processNodeAction(o,'highlight',true);
        },

        /**
         * Method that updates the "selected" classes for the selection and un-selects the prevVal.
         * This method works with multiple selections (via ATTR `selectionMulti` true) by pushing
         * the current selection to the this._selections property.
         *
         * @method _selectedChange
         * @param o
         * @private
         */
        _selectedChange: function(o){
            // Evaluate a flag to determine whether previous selections should be cleared or "kept"
            var keepPrev;
            if ( Y.UA.os.search('macintosh') === 0 )
                keepPrev =  this.get('selectionMulti') === true && this._clickModifiers.metaKey === true;
             else
                keepPrev =  this.get('selectionMulti') === true && this._clickModifiers.ctrlKey === true;

            // if not-multi mode and more than one selection, clear them first ...
            if ( !keepPrev && this._selections.length>1 ) this._clearAll(this._classSelected);

            // Process the action ... updating 'select' class
            var tar = this._processNodeAction(o,'select', !keepPrev );

            if ( !keepPrev ) this._selections = [];
            this._selections.push(tar);

            this.fire('selected',{
                ochange: o,
                record: this.getRecord(o.newVal)
            });

        },

        /**
         * @event selected
         * @param {Object} obj Return object
         * @param {Object} obj.ochange Change event object passed from attribute 'selected'
         * @param {Object} obj.record DataTable record (Y.Model) instance for the selection
         */

        /**
         * Returns the current "raw" settings of selections (includes multiple selections)
         * @method _getSelected
         * @return {Array} selections Array of selected TR's and/or TD's
         * @private
         */
        _getSelectedRows: function(){
            var trs = [];
            Y.Array.each(this._selections,function(item){
                if ( item.get('tagName').toLowerCase() === 'tr' )
                    trs.push( item );
                else
                    trs.push( item.ancestor('tr') );
            });
            return trs;
        },

        /**
         * Getter method that returns an Array of the selected cells in {record,column} coordinate format.
         * If rows or TR elements were selected, it adds all of the row's child TD's.
         *
         * @method _getSelectedCells
         * @return {Array} cells The selected cells in {record:, column:} format
         * @param {Model} cells.record Record for this cell as a Y.Model
         * @param {Object} cells.column Column for this cell defined in original "columns" DataTable attribute
         * @private
         */
        _getSelectedCells: function(){
            var cells = [], td;
            Y.Array.each(this._selections,function(item){
                if ( item.get('tagName').toLowerCase() === 'td' )
                    cells.push( {record:this.getRecord(item), column:this.getColumnByTd(item) } );
                else if ( item.get('tagName').toLowerCase() === 'tr' ) {
                    var tdNodes = item.all("td");
                    if ( tdNodes )
                        tdNodes.each(function(item){ cells.push( {record:this.getRecord(item), column:this.getColumnByTd(item) } )});
                }
            },this);
            return cells;
        },


        /**
         * Setter method for attribute `selectedCells` that takes an array of cells as input and sets them
         * as the current selected set with appropriate visual class.
         *
         * @method _setSelectedCells
         * @param {Array} val The desired cells to set as selected, in {record:,column:} format
         * @param {String|Number} val.record Record for this cell as either record index or record clientId
         * @param {String|Number} val.column Column for this cell as either the column index or "key" or "name"
         * @return {Array}
         * @private
         */
        _setSelectedCells: function(val){
            this._selections = [];
            if ( Y.Lang.isArray(val) && this.data.size() > val.length ) {
                Y.Array.each(val,function(item) {
                    var row, col, td;
                    if ( item.record ) row = this.getRow( item.record );
                    if ( item.column ) col = this.getColumn(item.column);

                    if ( row && col ) {
                        var ckey = col.key || col.name;
                        if ( ckey ) {
                            td = row.one('.'+this.getClassName('col')+'-'+ckey);
                            this._selections.push(td);
                            td.addClass(this._classSelected);
                        }
                    }

                },this);
            }
            return val;
        },


        /**
         * A setter method for attribute `selectedRecords` that takes as input an array of desired DataTable
         * record indices to be "selected", clears existing selections and sets the "selected" records and
         * highlights the TR's
         *
         * @method _setSelectedRecords
         * @param val {Array} recIndices Array of record indices desired to be set as selected.
         * @return {Array} records Array of DataTable records (Y.Model) for each selection chosen
         * @private
         */
        _setSelectedRecords: function(val){
            this._selections = [];
            if ( Y.Lang.isArray(val) && this.data.size() > val.length ) {
                Y.Array.each(val,function(item){
                    var tr = this.getRow(item);
                    if ( tr ) {
                        this._selections.push( tr );
                        tr.addClass(this._classSelected);
                    }
                },this);
            }
            return val;
        },


        /**
         * A getter method for the `selectedRecords` attribute that returns an array of DataTable records (Y.Model)
         *  based on the current "selected" items, either TR's or TD's.
         *
         *  If TD's were selected it converts them to their base record.
         *
         * @method _getSelectedRecords
         * @return {Array} records Array of records from the DataTable based on the selected items
         * @private
         */
        _getSelectedRecords: function(){
            var recs = [];
            Y.Array.each(this._selections,function(node){
                recs.push(this.getRecord(node));
            },this);
            return recs;
        },

        /**
         * Method used to derive from the clicked selection, either the TR or TD of the selection, and
         * returns the current `selectionMode` or `highlightMode` Node (based on the setting of prefix).
         *
         * This method adds the required class, and if erasePrev is true, removes the class from the prior setting.
         *
         * @method _processNodeAction
         * @param {Object} o Attribute change event object
         * @param {String} prefix
         * @param {Boolean} erasePrev
         * @return {Node} node Returned target Y.Node, either TR or TD based upon current `selectionMode` or `highlightMode`
         * @private
         */
        _processNodeAction: function(o, prefix, erasePrev ){
            var tar = o.newVal,
                tarNew, tarPrev, modeName, className;

            if ( prefix === 'highlight') {
                modeName  = prefix + 'Mode';
                className = this._classHighlight;
            } else if ( prefix === 'select' ) {
                modeName  = 'selectionMode';
                className = this._classSelected;
            }

            if ( this.get(modeName) == "cell" ) {
                tarNew  = tar || null;
                tarPrev = o.prevVal || null;
            } else if ( this.get(modeName) == "row" ) {
                tarNew = (tar.get('tagName').search(/td/i) === 0 ) ? tar.ancestor('tr') : ( tar.get('tagName').search(/tr/i) === 0 ) ? tar : null ;
                tarPrev = o.prevVal;
                if (tarPrev)
                    tarPrev = (tarPrev.get('tagName').search(/td/i) === 0 ) ? tarPrev.ancestor('tr') : ( tarPrev.get('tagName').search(/tr/i) === 0 ) ? tarPrev : null ;
            }

            if ( tarPrev && erasePrev )  tarPrev.removeClass(className);
            if ( tarNew ) tarNew.addClass(className);

            return tarNew;
        },


        /**
         * Method removes the specified `type` class from all nodes within the TBODY data node.
         * @method _clearAll
         * @param {String} type Class name to remove from all nodes attached to TBODY DATA
         * @private
         */
        _clearAll: function(type){
            var nodes = this.get('boundingBox').one("."+this.getClassName('data'));
            if ( nodes )
                nodes.all('.'+type).removeClass(type);
        },

        /**
         * Setter for `highlightMode` attribute, removes prior event handle (if exists) and defines
         * a new delegated "mouseover" handler that updates the `highlighted` attribute.
         *
         * A change to this setting clears all prior highlighting.
         *
         * @method _setHighlightMode
         * @param val
         * @return {*}
         * @private
         */
        _setHighlightMode: function(val){
            if ( this._eventHandles.selectorHighlight ) this._eventHandles.selectorHighlight.detach();
            this._eventHandles.selectorHighlight = this.delegate("mouseover",function(e){
                    var tar = e.currentTarget;
                    this.set(this._classHighlight,tar);
                },"tr td",this);

            this._clearAll(this._classHighlight);
            return val;
        },

        /**
         * Setter for `selectionMode` attribute, removes prior event handle (if exists) and defines
         * a new delegated "click" handler that updates the `selected` attribute.
         *
         * A change to this setting clears all prior selections.
         *
         * @method _setSelectionMode
         * @param val
         * @return {*}
         * @private
         */
        _setSelectionMode: function(val){
            var oSelf = this;
            if ( this._eventHandles.selectorSelect ) this._eventHandles.selectorSelect.detach();
            this._eventHandles.selectorSelect = this.delegate("click",function(e){
                    var tar = e.currentTarget;

                    e.halt(true);

                    oSelf._clickModifiers = {
                        ctrlKey:  e.ctrlKey,
                        altKey:   e.altKey,
                        metaKey:  e.metaKey,
                        shiftKey: e.shiftKey,
                        which:    e.which,
                        button:   e.button
                    };

                    oSelf.set(oSelf._classSelected,tar);

                },"tr td",oSelf);
            this._clearAll(this._classSelected);
            return val;
        }

    });

    Y.DataTable.Selection = DtSelection;
    Y.Base.mix(Y.DataTable, [Y.DataTable.Selection]);

