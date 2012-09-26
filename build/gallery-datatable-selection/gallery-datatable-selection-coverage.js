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
_yuitest_coverage["/build/gallery-datatable-selection/gallery-datatable-selection.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-datatable-selection/gallery-datatable-selection.js",
    code: []
};
_yuitest_coverage["/build/gallery-datatable-selection/gallery-datatable-selection.js"].code=["YUI.add('gallery-datatable-selection', function(Y) {","","/**"," A class extension for DataTable that adds \"highlight\" and \"select\" actions via mouse selection."," The extension works in either \"cell\" mode or \"row\" mode (set via attribute [selectionMode](#attr_selectionMode)).",""," Highlighting is controlled by the [highlightMode](#attr_highlightMode) attribute (either \"cell\" or \"row\")."," (Highlighting provides a \"mouseover\" indication only).",""," Selection is provided via \"click\" listeners.",""," This extension includes the ability to select \"multiple\" items, by setting the [selectionMulti](#attr_selectionMulti)"," attribute (enabled using browser multi-select click modifier, i.e. \"Cmd\" key on Mac OSX or \"Ctrl\" key on Windows / Linux).",""," Additionally, a \"range\" selection capability is provided by using the browser range selector click key modifier,"," specifically the Shift key on most systems.",""," The extension has been written to allow preserving the \"selected\" rows or cells during \"sort\" operations.",""," Specific attributes are provided that can be read for current selections, including the ATTRS [selectedRows](#attr_selectedRows),"," and [selectedCells](#attr_selectedCells).",""," Typical usage would be to set the \"selectionMode\" attribute (and selectionMulti if desired), and then to listen to for the"," [selection](#event_selection) event to respond to each \"click\" selection.",""," @module DataTable"," @submodule Selection"," @class Y.DataTable.Selection"," @extends Y.DataTable"," @author Todd Smith"," @version 1.0.0"," @since 3.6.0"," **/","function DtSelection() {}","","DtSelection.ATTRS = {","    /**","     * Node for the most recent \"highlighted\" item, either TD or TR","     * @attribute highlighted","     * @type {Node}","     * @default null","     */","    highlighted : {","        value:      null,","        validator:  function(v){ return (v instanceof Y.Node) || v === null; }","    },","","    /**","     * Node for the most recent \"selected\" item, either TD or TR","     * @attribute selected","     * @type {Node}","     * @default null","     */","    selected:{","        value:      null,","        validator:  function(v){ return (v instanceof Y.Node) || v === null; }","    },","","    /**","     * Set the current mode for highlighting, either for a single TD (as \"cell\") or for a","     * full TR (as \"row\")","     * @attribute highlightMode","     * @type {String}","     * @default null","     */","    highlightMode:{","        value:      null,","        setter:     '_setHighlightMode',","        validator:  function(v){","            if (!Y.Lang.isString(v)) return false;","            return (v === null || v === 'cell' || v ==='row' ) ? true : false;","        }","    },","","    /**","     * Set the current mode for indicating selections, either for a single TD (as \"cell\") or for a","     * full TR (as \"row\")","     *","     * @attribute selectionMode","     * @type {String}","     * @default null","     */","    selectionMode:{","        value:      null,","        setter:     '_setSelectionMode',","        validator:  function(v){","            if (!Y.Lang.isString(v)) return false;","            return (v === null || v === 'cell' || v ==='row' ) ? true : false;","        }","    },","","    /**","     * Attribute that holds the selected TR's associated with either the selected \"rows\" or the","     *  TR's that are related to the selected \"cells\", duplicates are excluded.","     *","     * On input, accepts an Array of record indices for rows that should be set as \"selected\".","     * (Please refer to method [_setSelectedRows](#method__setSelectedRows))","     *","     *          dt.set('selectedRows',[ 1, 5, 9, 11]);","     *          // selects the 2nd, 6th, 10th and 12th records","     *","     * For reading this setting, it returns an Array of objects containing {tr,record,recordIndex} for each","     *  selected \"row\"; where \"tr\" is a Y.Node instance and \"record\" is the Model for the TR and \"recordIndex\" is the","     *  record index within the current dataset.","     * (Please refer to method [_getSelectedRows](#method__getSelectedRows))","     *","     * @attribute selectedRows","     * @type {Array}","     * @default []","     */","    selectedRows: {","        value:      [],","        validator:  Y.Lang.isArray,","        getter:     '_getSelectedRows',","        setter:     '_setSelectedRows'","    },","","    /**","     * Attribute that holds the selected TD's associated with the selected \"cells\", or related to the","     *  selected \"rows\" if that is the `selectionMode`.","     *","     *  On input, an Array can be provided to pre-set as \"selected\" cells, defined as each element being","     *  in {record,column} format; where \"record\" is the record index (or clientId) and \"column\" is either","     *  the column index or the key/name for the column.","     *  (Please see method [_setSelectedCells](#method__setSelectedCells) for reference).","     *","     *          dt.set('selectedCells',[{record:0,column:'fname'}, {record:187,column:7} ]);","     *","     *  For reading the selected cells (via \"get\"), an array is returned with contains {Object} elements","     *  that describe the row / column combinations of each currently selected cell.","     *  (Please see method [_getSelectedCells](#method__getSelectedCells) for full information on the returned objects).","     *","     * @attribute selectedCells","     * @type {Array}","     * @default []","     */","    selectedCells: {","        value:      [],","        validator:  Y.Lang.isArray,","        setter:     '_setSelectedCells',","        getter:     '_getSelectedCells'","    },","","    /**","     * Flag to allow either single \"selections\" (false) or multiple selections (true).","     * For Macintosh OSX-type systems the modifier key \"Cmd\" is held for multiple selections,","     *  and for Windows or Linux type systems the modifier key is \"Ctrl\".","     * @attribute selectionMulti","     * @type {Boolean}","     * @default false","     */","    selectionMulti: {","        value:      false,","        setter:     '_setSelectionMulti',","        validator:  Y.Lang.isBoolean","    }","","};","","","Y.mix( DtSelection.prototype, {","","    /**","     * @property _selections","     * @type Array","     * @default null","     * @static","     * @protected","     */","    _selections: null,","","    /**","     * Holder for the classname for the \"highlight\" TR or TD","     * @property _classHighlight","     * @type String","     * @default null","     * @static","     * @protected","     */","    _classHighlight: null,","","    /**","     * Holder for the classname for the \"selected\" TR or TD","     * @property _classSelected","     * @type String","     * @default null","     * @static","     * @protected","     */","    _classSelected: null,","","    /**","     * Holder for the most recent \"click\" event modifier keys from last click,","     *  used for assessing \"multi\" selections.","     *","     * Contains properties;  altKey, ctrlKey, shiftKey, metaKey, button and which","     *","     * Filled initially by .initializer and on each Table \"click\".","     *","     * @property _clickModifiers","     * @type Object","     * @default null","     * @static","     * @protected","     */","    _clickModifiers: null,","","//------------------------------------------------------------------------------------------------------","//        L I F E C Y C L E    M E T H O D S","//------------------------------------------------------------------------------------------------------","","    /**","     * Initializes and sets initial bindings for the datatable-selection module","     * @method initializer","     * @protected","     */","    initializer: function(){","        this._bindSelector();","    },","","    /**","     * Destructor to clean up bindings.","     * @method destructor","     * @protected","     */","    destructor: function () {","        this._unbindSelector();","    },","","","","//------------------------------------------------------------------------------------------------------","//        P U B L I C     M E T H O D S","//------------------------------------------------------------------------------------------------------","","    /**","     * Method to enable the datatable-selection module","     * @method disableSelection","     * @public","     */","    enableSelection: function(){","        this.disableSelection();","        this._bindSelector();","    },","","    /**","     * Method to disable the datatable-selection module (cleans up listeners and user interface).","     * @method disableSelection","     * @public","     */","    disableSelection: function(){","        this.clearAll();","        this._unbindSelector();","    },","","    /**","     * Returns the Column object (from the original \"columns\") associated with the input TD Node.","     * @method getColumnByTd","     * @param {Node} cell Node of TD for which column object is desired","     * @return {Object} column The column object entry associated with the desired cell","     * @public","     */","    getColumnByTd:  function(cell){","        var colName = this.getColumnNameByTd(cell);","        return (colName) ? this.getColumn(colName) : null;","    },","","","    /**","     * Returns the column \"key\" or \"name\" string for the requested TD Node","     * @method getColumnNameByTd","     * @param {Node} cell Node of TD for which column name is desired","     * @return {String} colName Column name or key name","     * @public","     */","    getColumnNameByTd: function(cell){","        var classes = cell.get('className').split(\" \"),","            regCol  = new RegExp( this.getClassName('col') + '-(.*)');","","        var colName;","        Y.Array.some(classes,function(item){","            var colmatch =  item.match(regCol);","            if ( colmatch && Y.Lang.isArray(colmatch) && colmatch[1] ) {","                colName = colmatch[1];","                return true;","            }","        });","","        return colName || null;","    },","","    /**","     * Utility method that will return all selected TD Nodes for the current \"selected\" set.","     * If selections include a TR row, all child TD's from the row are included.","     *","     * @method getSelectedTds","     * @return {Array} tds Array of selected TD's as Nodes","     * @public","     */","    getSelectedTds: function(){","        var tds = [];","        Y.Array.each(this._selections,function(item){","            if ( item.get('tagName').toLowerCase() === 'td' )","                tds.push( item );","            else if ( item.get('tagName').toLowerCase() === 'tr' ) {","                var tdNodes = item.all(\"td\");","                if ( tdNodes )","                    tdNodes.each(function(item){ tds.push( item )});","            }","        });","        return tds;","    },","","    /**","     * Removes all \"selected\" classes from DataTable and resets internal selections counters and \"selected\" attribute.","     * @method clearSelections","     * @public","     */","    clearSelections: function(){","        this._selections = [];","        this.set('selected',null);","        this._clearAll(this._classSelected);","    },","","    /**","     * Removes all \"highlight\" classes from DataTable and resets `highlighted` attribute.","     * @method clearHighlighted","     * @public","     */","    clearHighlighted: function(){","        this.set('highlighted',null);","        this._clearAll(this._classHighlight);","    },","","    /**","     * Removes all highlighting and selections on the DataTable.","     * @method clearAll","     * @public","     */","    clearAll: function(){","        this.clearSelections();","        this.clearHighlighted();","    },","","//------------------------------------------------------------------------------------------------------","//        P R I V A T E    M E T H O D S","//------------------------------------------------------------------------------------------------------","","    /**","     * Cleans up listener event handlers and static properties.","     * @method _unbindSelector","     * @private","     */","    _unbindSelector: function(){","","        Y.Array.each( this._eventHandles.selector,function(item){","            item.detach();","        });","        this._eventHandles.selector = null;","","        if ( this._eventHandles.selectorSelect )","            this._eventHandles.selectorSelect.detach();","        this._eventHandles.selectorSelect = null;","","        this._clickModifiers = null;","","    },","","    /**","     * Sets listeners and initial class names required for this \"datatable-selector\" module","     *","     * Note:  Delegated \"click\" listeners are defined in _setSelectedMode and _setHightlightMode methods","     *","     * @method _bindSelector","     * @private","     */","    _bindSelector: function(){","        this._selections = [];","        this._eventHandles.selector = [];","","        this._eventHandles.selector.push( this.on('highlightedChange',this._highlightChange) );","        this._eventHandles.selector.push( this.on('selectedChange',this._selectedChange) );","","        // set CSS classes for highlighting and selected,","        //    currently as  \".yui3-datatable-sel-highlighted\" and \".yui3-datatable-sel-selected\"","        this._classHighlight = this.getClassName('sel','highlighted');","        this._classSelected  = this.getClassName('sel','selected');","","        //","        //  These listeners are here solely for \"sort\" actions, to allow preserving the \"selections\"","        //   pre-sort and re-applying them after the TBODY has been sorted and displayed","        //","        this._eventHandles.selector.push( this.data.before('*:reset', Y.bind('_beforeResetDataSelect', this) ) );","        this._eventHandles.selector.push( this.data.after('*:reset', Y.bind('_afterResetDataSelect', this) ) );","","        // track click modifier keys from last click, this is the tempalte","        this._clickModifiers = {","            ctrlKey:null, altKey:null, metaKey:null, shiftKey:null, which:null, button:null","        };","    },","","    /**","     * Method that updates the \"highlighted\" classes for the selection and unhighlights the prevVal","     * @method _highlightChange","     * @param o","     * @private","     */","    _highlightChange: function(o) {","        var tar = this._processNodeAction(o,'highlight',true);","    },","","    /**","     * Method that updates the \"selected\" classes for the selection and un-selects the prevVal.","     * This method works with multiple selections (via ATTR `selectionMulti` true) by pushing","     * the current selection to the this._selections property.","     *","     * @method _selectedChange","     * @param o","     * @private","     */","    _selectedChange: function(o){","        // Evaluate a flag to determine whether previous selections should be cleared or \"kept\"","        var keepPrev, keepRange;","        if ( Y.UA.os.search('macintosh') === 0 )","            keepPrev =  this.get('selectionMulti') === true && this._clickModifiers.metaKey === true;","         else","            keepPrev =  this.get('selectionMulti') === true && this._clickModifiers.ctrlKey === true;","","        keepRange = this.get('selectionMulti') === true && this._clickModifiers.shiftKey === true;","","        // clear any SHIFT selected text first ...","        this._clearDOMSelection();","","        // if not-multi mode and more than one selection, clear them first ...","        if ( !keepPrev && !keepRange && this._selections.length>1 ) this.clearSelections();","","        if ( keepRange ) {","","            this._processRange(o);","","        }  else {","","            // Process the action ... updating 'select' class","            var tar = this._processNodeAction(o,'select', !keepPrev );","","            if ( !keepPrev ) this._selections = [];","            this._selections.push(tar);","","        }","","        this.fire('selected',{","            ochange: o,","            record: this.getRecord(o.newVal)","        });","","        //","        //  Fire a generic \"selection\" event that returns selected data according to the current \"selectionMode\" setting","        //","        var sobj = { selectionMode : this.get('selectionMode')  };","","        if(this.get('selectionMode').toLowerCase()==='cell')","            sobj['cells'] = this.get('selectedCells');","        else if (this.get('selectionMode').toLowerCase()==='row')","            sobj['rows'] = this.get('selectedRows');","","        this.fire('selection',sobj);","    },","","    /**","     * @event selected","     * @deprecated","     * @param {Object} obj Return object","     * @param {Object} obj.ochange Change event object passed from attribute 'selected'","     * @param {Object} obj.record DataTable record (Y.Model) instance for the selection","     */","","    /**","     * Event that fires on every DataTable \"select\" event, returns current selections, either cells or rows depending","     * on the current \"selectionMode\".","     * @event selection","     * @param {Object} obj Return object","     * @param {Object} obj.selectionMode Current setting of attribute [selectionMode](#attr_selectionMode)","     * @param {Object} obj.cells Returns the current setting of the attribute [selectedCells](#attr_selectedCells)","     * @param {Object} obj.rows Returns the current setting of the attribute [selectedRows](#attr_selectedRows)","     */","","","    /**","     * Called when a \"range\" selection is detected (i.e. SHIFT key held during click) that selects","     * a range of TD's or TR's (depending on [selectionMode](#attr_selectionMode) setting.","     *","     * @method _processRange","     * @param {Node} o Last clicked TD of range selection","     * @private","     */","    _processRange: function(o) {","        var tarNew  = o.newVal,","            tarPrev = o.prevVal || null;","","        if ( tarNew && tarPrev ) {","            var newRec  = this.getRecord(tarNew),","                newRecI = this.data.indexOf(newRec),","                newCol  = this.getColumnNameByTd(tarNew),","                newColI = Y.Array.indexOf(this.get('columns'),this.getColumn(newCol)),","                prevRec  = this.getRecord(tarPrev),","                prevRecI = this.data.indexOf(prevRec),","                prevCol  = this.getColumnNameByTd(tarPrev),","                prevColI = Y.Array.indexOf(this.get('columns'),this.getColumn(prevCol));","","            // Calculate range offset ... delCol (horiz) and delRow (vertically)","            var delCol = newColI - prevColI,","                delRow = newRecI - prevRecI;","","            // if we have valid deltas, update the range cells.","            if ( delCol !== null && delRow !== null) {","","                if (Y.Lang.isArray(this._selections) ) {","                    this.clearSelections();","                }","","                // Select a range of CELLS (i.e. TD's) ...","                if ( this.get('selectionMode') === 'cell' ) {","                    var coldir = (delCol<0) ? -1 : 1,","                        rowdir = (delRow<0) ? -1 : 1,","                        cell = tarPrev;","","                    for(var j=0; j<=Math.abs(delRow); j++)","                        for(var i=0; i<=Math.abs(delCol); i++) {","                            cell = this.getCell(tarPrev,[rowdir*(j),coldir*(i)]);","                            if (cell) {","                                cell.addClass(this._classSelected);","                                this._selections.push(cell);","                            }","                        }","                // Select a range of ROWS (i.e. TR's)","                } else if ( this.get('selectionMode') === 'row' ) {","","                    var rowdir = (delRow<0) ? -1 : 1,","                        tr = this.getRow(prevRecI);","","                    for(var j=0; j<=Math.abs(delRow); j++) {","                        tr = this.getRow(prevRecI+rowdir*(j));","                        if (tr) {","                            tr.addClass(this._classSelected);","                            this._selections.push(tr);","                        }","                    }","","                }","","            }","","        }","","    },","","","    /**","     * Returns the current settings of row selections, includes multiple selections.  If the","     * current `selectionMode` is \"cell\" mode, this function returns the unique \"records\" associated with","     * the selected cells.","     *","     * **Returned** `rows` {Array} of objects in format;","     * <ul>","     *   <li>`rows.tr` {Node} Node instance of the TR that was selected</li>","     *   <li>`rows.record` {Model} The Model associated with the data record for the selected TR</li>","     *   <li>`rows.recordIndex` {Integer} The record index of the selected TR within the current \"data\" set</li>","     * </ul>","","     * @method _getSelectedRows","     * @return {Array} rows Array of selected \"rows\" as objects in {tr,record,recordIndex} format","     * @private","     */","    _getSelectedRows: function(){","        var trs  = [],","            rows = [],","            tr, rec;","        Y.Array.each(this._selections,function(item){","            tr = ( item.get('tagName').toLowerCase() === 'tr' ) ? item : item.ancestor('tr');","            // if and only if, it's a TR and not in \"trs\" array ... then add it","            if ( tr.get('tagName').toLowerCase() === 'tr' && trs.indexOf(tr) === -1) {","                rec = this.data.getByClientId(tr.getData('yui3-record'));","                trs.push(tr);","                rows.push({","                    tr:     tr,   // this is an OLD, stale TR from pre-sort","                    record: rec,","                    recordIndex: this.data.indexOf(rec)","                });","            }","        },this);","        return rows;","    },","","","","    /**","     * Getter method that returns an Array of the selected cells in record/column coordinate format.","     * If rows or TR elements were selected, it adds all of the row's child TD's.","     *","     * **Returned** `cells` {Array} of objects in format;","     * <ul>","     *   <li>`cells.td` {Node} TD Node for this cell.</li>","     *   <li>`cells.record` {Model} Record for this cell as a Y.Model</li>","     *   <li>`cells.recordIndex` {Integer} Record index for this cell in the current \"data\" set</li>","     *   <li>`cells.column` {Object} Column for this cell defined in original \"columns\" DataTable attribute</li>","     *   <li>`cells.columnName` {String} Column name or key associated with this cell</li>","     *   <li>`cells.columnIndex` {Integer} Column index of the column, within the \"columns\" data</li>","     * </ul>","     *","     * @method _getSelectedCells","     * @return {Array} cells The selected cells in {record,recordIndex,column,columnName,columnIndex} format","     * @private","     */","    _getSelectedCells: function(){","        var cells = [],","            cols  = this.get('columns'),","            col, tr, rec;","","        Y.Array.each(this._selections,function(item){","            if (!item) return;","            if ( item.get('tagName').toLowerCase() === 'td' ) {","                col = this.getColumnByTd(item);","                tr  = item.ancestor(\"tr\");","                rec = this.data.getByClientId(tr.getData('yui3-record'));","","                cells.push({","                    td:          item,","                    record:      rec,","                    recordIndex: this.data.indexOf(rec),","                    column:      col,","                    columnName:  col.key || col.name,","                    columnIndex: Y.Array.indexOf(cols,col)","                });","            } else if ( item.get('tagName').toLowerCase() === 'tr' ) {","                tr = item;","                rec = this.data.getByClientId(tr.getData('yui3-record'));","                var tdNodes = tr.all(\"td\");","                if ( tdNodes ) {","                    tdNodes.each(function(td){","                        col = this.getColumnByTd(td);","                        cells.push({","                            td:          td,","                            record:      rec,","                            recordIndex: this.data.indexOf(rec),","                            column:      col,","                            columnName:  col.key || col.name,","                            columnIndex: Y.Array.indexOf(cols,col)","                        });","                    },this);","                }","            }","        },this);","        return cells;","    },","","    /**","     * Setter method for attribute `selectedCells` that takes an array of cells as input and sets them","     * as the current selected set with appropriate visual class.","     *","     * @method _setSelectedCells","     * @param {Array} val The desired cells to set as selected, in {record:,column:} format","     * @param {String|Number} val.record Record for this cell as either record index or record clientId","     * @param {String|Number} val.column Column for this cell as either the column index or \"key\" or \"name\"","     * @return {Array}","     * @private","     */","    _setSelectedCells: function(val){","        this._selections = [];","        if ( Y.Lang.isArray(val) && this.data.size() > val.length ) {","            Y.Array.each(val,function(item) {","                var row, col, td;","                if ( item.record ) row = this.getRow( item.record );","                if ( item.column ) col = this.getColumn(item.column);","","                if ( row && col ) {","                    var ckey = col.key || col.name;","                    if ( ckey ) {","                        td = row.one('.'+this.getClassName('col')+'-'+ckey);","                        this._selections.push(td);","                        td.addClass(this._classSelected);","                    }","                }","","            },this);","        }","        return val;","    },","","    /**","     * A setter method for attribute `selectedRows` that takes as input an array of desired DataTable","     * record indices to be \"selected\", clears existing selections and sets the \"selected\" records and","     * highlights the TR's","     *","     * @method _setSelectedRows","     * @param val {Array} recIndices Array of record indices desired to be set as selected.","     * @return {Array} records Array of DataTable records (Y.Model) for each selection chosen","     * @private","     */","    _setSelectedRows: function(val){","        this._selections = [];","        if ( Y.Lang.isArray(val) && this.data.size() > val.length ) {","            Y.Array.each(val,function(item){","                var tr = this.getRow(item);","                if ( tr ) {","                    this._selections.push( tr );","                    tr.addClass(this._classSelected);","                }","            },this);","        }","        return val;","    },","","    /**","     * Method is fired BEFORE a \"reset\" action takes place on the \"data\", usually related to a column sort.","     * This is used to preserve the pre-sorted data (temporarily in _selections) prior to sorting so that","     * we can reapply the \"selections\" after the sort is completed (see [_afterResetDataSelect](#method__afterResetDataSelect))","     *","     * @method _beforeResetDataSelect","     * @private","     */","    _beforeResetDataSelect: function() {","        if( !this._selections || this._selections.length === 0 ) return;","","        // Save a copy of the current pre-sort rows and/or cells ...","        var rows  = this.get('selectedRows'),   // array as {record,tr}","            cells = this.get('selectedCells'),  // array as {record,td,column,columnIndex,columnName}","            tr, td;","","        // Clear out the selections, reset selected and remove \"selected\" CSS on table","        this._selections = [];","        this.set('selected',null);","        this._clearAll(this._classSelected);","","        //","        //  Loop over all of the rows or cells (depending on mode),","        //    and push a temporary record to the _selections array,","        //    to be used in _afterResetDataSelect to reconstruct selections","        //","        if( this.get('selectionMode') === 'row' && rows && rows.length > 0 ) {","","            // Push the Model data only to the _selections array ...","            Y.Array.each(rows,function(r){","                if ( r && r.record )","                    this._selections.push( r.record );","            },this);","","        } else if ( this.get('selectionMode') === 'cell' && cells && cells.length > 0 ) {","","            // Push the Model data and column index only to the _selections array","            Y.Array.each(cells,function(r){","                if(r && r.record && r.columnIndex)","                    this._selections.push({record:r.record, colIndex:r.columnIndex});","            },this);","        }","","    },","","    /**","     * Method is fired AFTER a \"reset\" action takes place on the \"data\", usually related to a column sort.","     * This function reads the pre-sorted selections that were stored by  [_beforeResetDataSelect](#method__beforeResetDataSelect)","     * temporarily in this._selections.","     *","     * Depending upon the current \"selectionMode\", either post-sorted TBODY selections are re-applied, by determining either","     * the TR's (from the Model data) or the TD's (from the Model and Column Index data).","     *","     * @method _afterResetDataSelect","     * @private","     */","    _afterResetDataSelect: function() {","        if( !this._selections || this._selections.length === 0 ) return;","        var tr, td;","        var buffer = [];","","        Y.Array.each(this._selections,function(item){","            if( this.get('selectionMode') === 'row' && item ) {","                // the \"item\" is a Model pushed prior to the \"sort\" action ...","                tr = this.getRow(item);","                if( tr ){","                    buffer.push(tr);","                    tr.addClass(this._classSelected);","                }","            } else if (this.get('selectionMode') === 'cell' && item ) {","                // the item is an object as {record,colIndex} pushed prior to \"sort\" action ...","                tr = this.getRow(item.record),","                td = (tr) ? tr.all(\"td\").item(item.colIndex) : null;","                if(tr && td) {","                    buffer.push(td);","                    td.addClass(this._classSelected);","                }","            }","        },this);","","        // swap out the temporary buffer, for the current selections ...","        this._selections = buffer;","","    },","","    /**","     * Method used to derive from the clicked selection, either the TR or TD of the selection, and","     * returns the current `selectionMode` or `highlightMode` Node (based on the setting of prefix).","     *","     * This method adds the required class, and if erasePrev is true, removes the class from the prior setting.","     *","     * @method _processNodeAction","     * @param {Object} o Attribute change event object","     * @param {String} prefix","     * @param {Boolean} erasePrev","     * @return {Node} node Returned target Y.Node, either TR or TD based upon current `selectionMode` or `highlightMode`","     * @private","     */","    _processNodeAction: function(o, prefix, erasePrev ){","        var tar = o.newVal,","            tarNew, tarPrev, modeName, className;","","        if ( prefix === 'highlight') {","            modeName  = prefix + 'Mode';","            className = this._classHighlight;","        } else if ( prefix === 'select' ) {","            modeName  = 'selectionMode';","            className = this._classSelected;","        }","","        if ( this.get(modeName) == \"cell\" ) {","            tarNew  = tar || null;","            tarPrev = o.prevVal || null;","        } else if ( this.get(modeName) == \"row\" ) {","            if ( tar ) {","                tarNew = (tar.get('tagName').search(/td/i) === 0 ) ? tar.ancestor('tr') : ( tar.get('tagName').search(/tr/i) === 0 ) ? tar : null ;","            }","            tarPrev = o.prevVal;","            if (tarPrev)","                tarPrev = (tarPrev.get('tagName').search(/td/i) === 0 ) ? tarPrev.ancestor('tr') : ( tarPrev.get('tagName').search(/tr/i) === 0 ) ? tarPrev : null ;","        }","","        if ( tarPrev && erasePrev )  tarPrev.removeClass(className);","        if ( tarNew ) tarNew.addClass(className);","","        return tarNew;","    },","","","    /**","     * Method removes the specified `type` CSS class from all nodes within the TBODY data node.","     * @method _clearAll","     * @param {String} type Class name to remove from all nodes attached to TBODY DATA","     * @private","     */","    _clearAll: function(type){","        var nodes = this.get('boundingBox').one(\".\"+this.getClassName('data'));","        if ( nodes )","            nodes.all('.'+type).removeClass(type);","    },","","    /**","     * Setter for `highlightMode` attribute, removes prior event handle (if exists) and defines","     * a new delegated \"mouseover\" handler that updates the `highlighted` attribute.","     *","     * A change to this setting clears all prior highlighting.","     *","     * @method _setHighlightMode","     * @param val","     * @return {*}","     * @private","     */","    _setHighlightMode: function(val){","        if ( this._eventHandles.selectorHighlight ) this._eventHandles.selectorHighlight.detach();","        this._eventHandles.selectorHighlight = this.delegate(\"mouseover\",function(e){","                var tar = e.currentTarget;","                this.set('highlighted',tar);","            },\"tr td\",this);","","        this._clearAll(this._classHighlight);","        return val;","    },","","    /**","     * Setter for `selectionMode` attribute, removes prior event handle (if exists) and defines","     * a new delegated \"click\" handler that updates the `selected` attribute.","     *","     * A change to this setting clears all prior selections.","     *","     * @method _setSelectionMode","     * @param val","     * @return {*}","     * @private","     */","    _setSelectionMode: function(val){","        var oSelf = this;","        if ( this._eventHandles.selectorSelect ) this._eventHandles.selectorSelect.detach();","        this._eventHandles.selectorSelect = this.delegate(\"click\",function(e){","                var tar = e.currentTarget;","","                e.halt(true);","","                oSelf._clickModifiers = {","                    ctrlKey:  e.ctrlKey,","                    altKey:   e.altKey,","                    metaKey:  e.metaKey,","                    shiftKey: e.shiftKey,","                    which:    e.which,","                    button:   e.button","                };","","                oSelf.set('selected',tar);","","            },\"tr td\",oSelf);","        this._clearAll(this._classSelected);","        return val;","    },","","    /**","     * Helper method to clear DOM \"selected\" text or ranges","     * @method _clearDOMSelection","     * @private","     */","    _clearDOMSelection: function(){","        var sel = (Y.config.win.getSelection) ? Y.config.win.getSelection() : (Y.config.doc.selection) ? Y.config.doc.selection : null;","        if ( sel && sel.empty ) sel.empty();    // works on chrome","        if ( sel && sel.removeAllRanges ) sel.removeAllRanges();    // works on FireFox","    }","","});","","Y.DataTable.Selection = DtSelection;","Y.Base.mix(Y.DataTable, [Y.DataTable.Selection]);","","","","}, 'gallery-2012.09.26-20-36' ,{skinnable:true, requires:['base-build','datatable-base','event']});"];
_yuitest_coverage["/build/gallery-datatable-selection/gallery-datatable-selection.js"].lines = {"1":0,"34":0,"36":0,"45":0,"56":0,"70":0,"71":0,"87":0,"88":0,"161":0,"218":0,"227":0,"242":0,"243":0,"252":0,"253":0,"264":0,"265":0,"277":0,"280":0,"281":0,"282":0,"283":0,"284":0,"285":0,"289":0,"301":0,"302":0,"303":0,"304":0,"305":0,"306":0,"307":0,"308":0,"311":0,"320":0,"321":0,"322":0,"331":0,"332":0,"341":0,"342":0,"356":0,"357":0,"359":0,"361":0,"362":0,"363":0,"365":0,"378":0,"379":0,"381":0,"382":0,"386":0,"387":0,"393":0,"394":0,"397":0,"409":0,"423":0,"424":0,"425":0,"427":0,"429":0,"432":0,"435":0,"437":0,"439":0,"444":0,"446":0,"447":0,"451":0,"459":0,"461":0,"462":0,"463":0,"464":0,"466":0,"497":0,"500":0,"501":0,"511":0,"515":0,"517":0,"518":0,"522":0,"523":0,"527":0,"528":0,"529":0,"530":0,"531":0,"532":0,"536":0,"538":0,"541":0,"542":0,"543":0,"544":0,"545":0,"575":0,"578":0,"579":0,"581":0,"582":0,"583":0,"584":0,"591":0,"615":0,"619":0,"620":0,"621":0,"622":0,"623":0,"624":0,"626":0,"634":0,"635":0,"636":0,"637":0,"638":0,"639":0,"640":0,"641":0,"653":0,"668":0,"669":0,"670":0,"671":0,"672":0,"673":0,"675":0,"676":0,"677":0,"678":0,"679":0,"680":0,"686":0,"700":0,"701":0,"702":0,"703":0,"704":0,"705":0,"706":0,"710":0,"722":0,"725":0,"730":0,"731":0,"732":0,"739":0,"742":0,"743":0,"744":0,"747":0,"750":0,"751":0,"752":0,"770":0,"771":0,"772":0,"774":0,"775":0,"777":0,"778":0,"779":0,"780":0,"782":0,"784":0,"786":0,"787":0,"788":0,"794":0,"812":0,"815":0,"816":0,"817":0,"818":0,"819":0,"820":0,"823":0,"824":0,"825":0,"826":0,"827":0,"828":0,"830":0,"831":0,"832":0,"835":0,"836":0,"838":0,"849":0,"850":0,"851":0,"866":0,"867":0,"868":0,"869":0,"872":0,"873":0,"888":0,"889":0,"890":0,"891":0,"893":0,"895":0,"904":0,"907":0,"908":0,"917":0,"918":0,"919":0,"924":0,"925":0};
_yuitest_coverage["/build/gallery-datatable-selection/gallery-datatable-selection.js"].functions = {"DtSelection:34":0,"validator:45":0,"validator:56":0,"validator:69":0,"validator:86":0,"initializer:217":0,"destructor:226":0,"enableSelection:241":0,"disableSelection:251":0,"getColumnByTd:263":0,"(anonymous 2):281":0,"getColumnNameByTd:276":0,"(anonymous 4):308":0,"(anonymous 3):302":0,"getSelectedTds:300":0,"clearSelections:319":0,"clearHighlighted:330":0,"clearAll:340":0,"(anonymous 5):356":0,"_unbindSelector:354":0,"_bindSelector:377":0,"_highlightChange:408":0,"_selectedChange:421":0,"_processRange:496":0,"(anonymous 6):578":0,"_getSelectedRows:574":0,"(anonymous 8):639":0,"(anonymous 7):619":0,"_getSelectedCells:614":0,"(anonymous 9):670":0,"_setSelectedCells:667":0,"(anonymous 10):702":0,"_setSelectedRows:699":0,"(anonymous 11):742":0,"(anonymous 12):750":0,"_beforeResetDataSelect:721":0,"(anonymous 13):774":0,"_afterResetDataSelect:769":0,"_processNodeAction:811":0,"_clearAll:848":0,"(anonymous 14):867":0,"_setHighlightMode:865":0,"(anonymous 15):890":0,"_setSelectionMode:887":0,"_clearDOMSelection:916":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-datatable-selection/gallery-datatable-selection.js"].coveredLines = 216;
_yuitest_coverage["/build/gallery-datatable-selection/gallery-datatable-selection.js"].coveredFunctions = 46;
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 1);
YUI.add('gallery-datatable-selection', function(Y) {

/**
 A class extension for DataTable that adds "highlight" and "select" actions via mouse selection.
 The extension works in either "cell" mode or "row" mode (set via attribute [selectionMode](#attr_selectionMode)).

 Highlighting is controlled by the [highlightMode](#attr_highlightMode) attribute (either "cell" or "row").
 (Highlighting provides a "mouseover" indication only).

 Selection is provided via "click" listeners.

 This extension includes the ability to select "multiple" items, by setting the [selectionMulti](#attr_selectionMulti)
 attribute (enabled using browser multi-select click modifier, i.e. "Cmd" key on Mac OSX or "Ctrl" key on Windows / Linux).

 Additionally, a "range" selection capability is provided by using the browser range selector click key modifier,
 specifically the Shift key on most systems.

 The extension has been written to allow preserving the "selected" rows or cells during "sort" operations.

 Specific attributes are provided that can be read for current selections, including the ATTRS [selectedRows](#attr_selectedRows),
 and [selectedCells](#attr_selectedCells).

 Typical usage would be to set the "selectionMode" attribute (and selectionMulti if desired), and then to listen to for the
 [selection](#event_selection) event to respond to each "click" selection.

 @module DataTable
 @submodule Selection
 @class Y.DataTable.Selection
 @extends Y.DataTable
 @author Todd Smith
 @version 1.0.0
 @since 3.6.0
 **/
_yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 34);
function DtSelection() {}

_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 36);
DtSelection.ATTRS = {
    /**
     * Node for the most recent "highlighted" item, either TD or TR
     * @attribute highlighted
     * @type {Node}
     * @default null
     */
    highlighted : {
        value:      null,
        validator:  function(v){ _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "validator", 45);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 45);
return (v instanceof Y.Node) || v === null; }
    },

    /**
     * Node for the most recent "selected" item, either TD or TR
     * @attribute selected
     * @type {Node}
     * @default null
     */
    selected:{
        value:      null,
        validator:  function(v){ _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "validator", 56);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 56);
return (v instanceof Y.Node) || v === null; }
    },

    /**
     * Set the current mode for highlighting, either for a single TD (as "cell") or for a
     * full TR (as "row")
     * @attribute highlightMode
     * @type {String}
     * @default null
     */
    highlightMode:{
        value:      null,
        setter:     '_setHighlightMode',
        validator:  function(v){
            _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "validator", 69);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 70);
if (!Y.Lang.isString(v)) {return false;}
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 71);
return (v === null || v === 'cell' || v ==='row' ) ? true : false;
        }
    },

    /**
     * Set the current mode for indicating selections, either for a single TD (as "cell") or for a
     * full TR (as "row")
     *
     * @attribute selectionMode
     * @type {String}
     * @default null
     */
    selectionMode:{
        value:      null,
        setter:     '_setSelectionMode',
        validator:  function(v){
            _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "validator", 86);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 87);
if (!Y.Lang.isString(v)) {return false;}
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 88);
return (v === null || v === 'cell' || v ==='row' ) ? true : false;
        }
    },

    /**
     * Attribute that holds the selected TR's associated with either the selected "rows" or the
     *  TR's that are related to the selected "cells", duplicates are excluded.
     *
     * On input, accepts an Array of record indices for rows that should be set as "selected".
     * (Please refer to method [_setSelectedRows](#method__setSelectedRows))
     *
     *          dt.set('selectedRows',[ 1, 5, 9, 11]);
     *          // selects the 2nd, 6th, 10th and 12th records
     *
     * For reading this setting, it returns an Array of objects containing {tr,record,recordIndex} for each
     *  selected "row"; where "tr" is a Y.Node instance and "record" is the Model for the TR and "recordIndex" is the
     *  record index within the current dataset.
     * (Please refer to method [_getSelectedRows](#method__getSelectedRows))
     *
     * @attribute selectedRows
     * @type {Array}
     * @default []
     */
    selectedRows: {
        value:      [],
        validator:  Y.Lang.isArray,
        getter:     '_getSelectedRows',
        setter:     '_setSelectedRows'
    },

    /**
     * Attribute that holds the selected TD's associated with the selected "cells", or related to the
     *  selected "rows" if that is the `selectionMode`.
     *
     *  On input, an Array can be provided to pre-set as "selected" cells, defined as each element being
     *  in {record,column} format; where "record" is the record index (or clientId) and "column" is either
     *  the column index or the key/name for the column.
     *  (Please see method [_setSelectedCells](#method__setSelectedCells) for reference).
     *
     *          dt.set('selectedCells',[{record:0,column:'fname'}, {record:187,column:7} ]);
     *
     *  For reading the selected cells (via "get"), an array is returned with contains {Object} elements
     *  that describe the row / column combinations of each currently selected cell.
     *  (Please see method [_getSelectedCells](#method__getSelectedCells) for full information on the returned objects).
     *
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


_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 161);
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
     * Initializes and sets initial bindings for the datatable-selection module
     * @method initializer
     * @protected
     */
    initializer: function(){
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "initializer", 217);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 218);
this._bindSelector();
    },

    /**
     * Destructor to clean up bindings.
     * @method destructor
     * @protected
     */
    destructor: function () {
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "destructor", 226);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 227);
this._unbindSelector();
    },



//------------------------------------------------------------------------------------------------------
//        P U B L I C     M E T H O D S
//------------------------------------------------------------------------------------------------------

    /**
     * Method to enable the datatable-selection module
     * @method disableSelection
     * @public
     */
    enableSelection: function(){
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "enableSelection", 241);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 242);
this.disableSelection();
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 243);
this._bindSelector();
    },

    /**
     * Method to disable the datatable-selection module (cleans up listeners and user interface).
     * @method disableSelection
     * @public
     */
    disableSelection: function(){
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "disableSelection", 251);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 252);
this.clearAll();
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 253);
this._unbindSelector();
    },

    /**
     * Returns the Column object (from the original "columns") associated with the input TD Node.
     * @method getColumnByTd
     * @param {Node} cell Node of TD for which column object is desired
     * @return {Object} column The column object entry associated with the desired cell
     * @public
     */
    getColumnByTd:  function(cell){
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "getColumnByTd", 263);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 264);
var colName = this.getColumnNameByTd(cell);
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 265);
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
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "getColumnNameByTd", 276);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 277);
var classes = cell.get('className').split(" "),
            regCol  = new RegExp( this.getClassName('col') + '-(.*)');

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 280);
var colName;
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 281);
Y.Array.some(classes,function(item){
            _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "(anonymous 2)", 281);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 282);
var colmatch =  item.match(regCol);
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 283);
if ( colmatch && Y.Lang.isArray(colmatch) && colmatch[1] ) {
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 284);
colName = colmatch[1];
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 285);
return true;
            }
        });

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 289);
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
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "getSelectedTds", 300);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 301);
var tds = [];
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 302);
Y.Array.each(this._selections,function(item){
            _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "(anonymous 3)", 302);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 303);
if ( item.get('tagName').toLowerCase() === 'td' )
                {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 304);
tds.push( item );}
            else {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 305);
if ( item.get('tagName').toLowerCase() === 'tr' ) {
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 306);
var tdNodes = item.all("td");
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 307);
if ( tdNodes )
                    {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 308);
tdNodes.each(function(item){ _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "(anonymous 4)", 308);
tds.push( item )});}
            }}
        });
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 311);
return tds;
    },

    /**
     * Removes all "selected" classes from DataTable and resets internal selections counters and "selected" attribute.
     * @method clearSelections
     * @public
     */
    clearSelections: function(){
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "clearSelections", 319);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 320);
this._selections = [];
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 321);
this.set('selected',null);
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 322);
this._clearAll(this._classSelected);
    },

    /**
     * Removes all "highlight" classes from DataTable and resets `highlighted` attribute.
     * @method clearHighlighted
     * @public
     */
    clearHighlighted: function(){
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "clearHighlighted", 330);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 331);
this.set('highlighted',null);
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 332);
this._clearAll(this._classHighlight);
    },

    /**
     * Removes all highlighting and selections on the DataTable.
     * @method clearAll
     * @public
     */
    clearAll: function(){
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "clearAll", 340);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 341);
this.clearSelections();
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 342);
this.clearHighlighted();
    },

//------------------------------------------------------------------------------------------------------
//        P R I V A T E    M E T H O D S
//------------------------------------------------------------------------------------------------------

    /**
     * Cleans up listener event handlers and static properties.
     * @method _unbindSelector
     * @private
     */
    _unbindSelector: function(){

        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_unbindSelector", 354);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 356);
Y.Array.each( this._eventHandles.selector,function(item){
            _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "(anonymous 5)", 356);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 357);
item.detach();
        });
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 359);
this._eventHandles.selector = null;

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 361);
if ( this._eventHandles.selectorSelect )
            {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 362);
this._eventHandles.selectorSelect.detach();}
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 363);
this._eventHandles.selectorSelect = null;

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 365);
this._clickModifiers = null;

    },

    /**
     * Sets listeners and initial class names required for this "datatable-selector" module
     *
     * Note:  Delegated "click" listeners are defined in _setSelectedMode and _setHightlightMode methods
     *
     * @method _bindSelector
     * @private
     */
    _bindSelector: function(){
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_bindSelector", 377);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 378);
this._selections = [];
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 379);
this._eventHandles.selector = [];

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 381);
this._eventHandles.selector.push( this.on('highlightedChange',this._highlightChange) );
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 382);
this._eventHandles.selector.push( this.on('selectedChange',this._selectedChange) );

        // set CSS classes for highlighting and selected,
        //    currently as  ".yui3-datatable-sel-highlighted" and ".yui3-datatable-sel-selected"
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 386);
this._classHighlight = this.getClassName('sel','highlighted');
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 387);
this._classSelected  = this.getClassName('sel','selected');

        //
        //  These listeners are here solely for "sort" actions, to allow preserving the "selections"
        //   pre-sort and re-applying them after the TBODY has been sorted and displayed
        //
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 393);
this._eventHandles.selector.push( this.data.before('*:reset', Y.bind('_beforeResetDataSelect', this) ) );
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 394);
this._eventHandles.selector.push( this.data.after('*:reset', Y.bind('_afterResetDataSelect', this) ) );

        // track click modifier keys from last click, this is the tempalte
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 397);
this._clickModifiers = {
            ctrlKey:null, altKey:null, metaKey:null, shiftKey:null, which:null, button:null
        };
    },

    /**
     * Method that updates the "highlighted" classes for the selection and unhighlights the prevVal
     * @method _highlightChange
     * @param o
     * @private
     */
    _highlightChange: function(o) {
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_highlightChange", 408);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 409);
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
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_selectedChange", 421);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 423);
var keepPrev, keepRange;
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 424);
if ( Y.UA.os.search('macintosh') === 0 )
            {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 425);
keepPrev =  this.get('selectionMulti') === true && this._clickModifiers.metaKey === true;}
         else
            {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 427);
keepPrev =  this.get('selectionMulti') === true && this._clickModifiers.ctrlKey === true;}

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 429);
keepRange = this.get('selectionMulti') === true && this._clickModifiers.shiftKey === true;

        // clear any SHIFT selected text first ...
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 432);
this._clearDOMSelection();

        // if not-multi mode and more than one selection, clear them first ...
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 435);
if ( !keepPrev && !keepRange && this._selections.length>1 ) {this.clearSelections();}

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 437);
if ( keepRange ) {

            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 439);
this._processRange(o);

        }  else {

            // Process the action ... updating 'select' class
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 444);
var tar = this._processNodeAction(o,'select', !keepPrev );

            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 446);
if ( !keepPrev ) {this._selections = [];}
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 447);
this._selections.push(tar);

        }

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 451);
this.fire('selected',{
            ochange: o,
            record: this.getRecord(o.newVal)
        });

        //
        //  Fire a generic "selection" event that returns selected data according to the current "selectionMode" setting
        //
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 459);
var sobj = { selectionMode : this.get('selectionMode')  };

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 461);
if(this.get('selectionMode').toLowerCase()==='cell')
            {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 462);
sobj['cells'] = this.get('selectedCells');}
        else {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 463);
if (this.get('selectionMode').toLowerCase()==='row')
            {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 464);
sobj['rows'] = this.get('selectedRows');}}

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 466);
this.fire('selection',sobj);
    },

    /**
     * @event selected
     * @deprecated
     * @param {Object} obj Return object
     * @param {Object} obj.ochange Change event object passed from attribute 'selected'
     * @param {Object} obj.record DataTable record (Y.Model) instance for the selection
     */

    /**
     * Event that fires on every DataTable "select" event, returns current selections, either cells or rows depending
     * on the current "selectionMode".
     * @event selection
     * @param {Object} obj Return object
     * @param {Object} obj.selectionMode Current setting of attribute [selectionMode](#attr_selectionMode)
     * @param {Object} obj.cells Returns the current setting of the attribute [selectedCells](#attr_selectedCells)
     * @param {Object} obj.rows Returns the current setting of the attribute [selectedRows](#attr_selectedRows)
     */


    /**
     * Called when a "range" selection is detected (i.e. SHIFT key held during click) that selects
     * a range of TD's or TR's (depending on [selectionMode](#attr_selectionMode) setting.
     *
     * @method _processRange
     * @param {Node} o Last clicked TD of range selection
     * @private
     */
    _processRange: function(o) {
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_processRange", 496);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 497);
var tarNew  = o.newVal,
            tarPrev = o.prevVal || null;

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 500);
if ( tarNew && tarPrev ) {
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 501);
var newRec  = this.getRecord(tarNew),
                newRecI = this.data.indexOf(newRec),
                newCol  = this.getColumnNameByTd(tarNew),
                newColI = Y.Array.indexOf(this.get('columns'),this.getColumn(newCol)),
                prevRec  = this.getRecord(tarPrev),
                prevRecI = this.data.indexOf(prevRec),
                prevCol  = this.getColumnNameByTd(tarPrev),
                prevColI = Y.Array.indexOf(this.get('columns'),this.getColumn(prevCol));

            // Calculate range offset ... delCol (horiz) and delRow (vertically)
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 511);
var delCol = newColI - prevColI,
                delRow = newRecI - prevRecI;

            // if we have valid deltas, update the range cells.
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 515);
if ( delCol !== null && delRow !== null) {

                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 517);
if (Y.Lang.isArray(this._selections) ) {
                    _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 518);
this.clearSelections();
                }

                // Select a range of CELLS (i.e. TD's) ...
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 522);
if ( this.get('selectionMode') === 'cell' ) {
                    _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 523);
var coldir = (delCol<0) ? -1 : 1,
                        rowdir = (delRow<0) ? -1 : 1,
                        cell = tarPrev;

                    _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 527);
for(var j=0; j<=Math.abs(delRow); j++)
                        {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 528);
for(var i=0; i<=Math.abs(delCol); i++) {
                            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 529);
cell = this.getCell(tarPrev,[rowdir*(j),coldir*(i)]);
                            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 530);
if (cell) {
                                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 531);
cell.addClass(this._classSelected);
                                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 532);
this._selections.push(cell);
                            }
                        }}
                // Select a range of ROWS (i.e. TR's)
                } else {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 536);
if ( this.get('selectionMode') === 'row' ) {

                    _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 538);
var rowdir = (delRow<0) ? -1 : 1,
                        tr = this.getRow(prevRecI);

                    _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 541);
for(var j=0; j<=Math.abs(delRow); j++) {
                        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 542);
tr = this.getRow(prevRecI+rowdir*(j));
                        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 543);
if (tr) {
                            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 544);
tr.addClass(this._classSelected);
                            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 545);
this._selections.push(tr);
                        }
                    }

                }}

            }

        }

    },


    /**
     * Returns the current settings of row selections, includes multiple selections.  If the
     * current `selectionMode` is "cell" mode, this function returns the unique "records" associated with
     * the selected cells.
     *
     * **Returned** `rows` {Array} of objects in format;
     * <ul>
     *   <li>`rows.tr` {Node} Node instance of the TR that was selected</li>
     *   <li>`rows.record` {Model} The Model associated with the data record for the selected TR</li>
     *   <li>`rows.recordIndex` {Integer} The record index of the selected TR within the current "data" set</li>
     * </ul>

     * @method _getSelectedRows
     * @return {Array} rows Array of selected "rows" as objects in {tr,record,recordIndex} format
     * @private
     */
    _getSelectedRows: function(){
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_getSelectedRows", 574);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 575);
var trs  = [],
            rows = [],
            tr, rec;
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 578);
Y.Array.each(this._selections,function(item){
            _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "(anonymous 6)", 578);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 579);
tr = ( item.get('tagName').toLowerCase() === 'tr' ) ? item : item.ancestor('tr');
            // if and only if, it's a TR and not in "trs" array ... then add it
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 581);
if ( tr.get('tagName').toLowerCase() === 'tr' && trs.indexOf(tr) === -1) {
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 582);
rec = this.data.getByClientId(tr.getData('yui3-record'));
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 583);
trs.push(tr);
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 584);
rows.push({
                    tr:     tr,   // this is an OLD, stale TR from pre-sort
                    record: rec,
                    recordIndex: this.data.indexOf(rec)
                });
            }
        },this);
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 591);
return rows;
    },



    /**
     * Getter method that returns an Array of the selected cells in record/column coordinate format.
     * If rows or TR elements were selected, it adds all of the row's child TD's.
     *
     * **Returned** `cells` {Array} of objects in format;
     * <ul>
     *   <li>`cells.td` {Node} TD Node for this cell.</li>
     *   <li>`cells.record` {Model} Record for this cell as a Y.Model</li>
     *   <li>`cells.recordIndex` {Integer} Record index for this cell in the current "data" set</li>
     *   <li>`cells.column` {Object} Column for this cell defined in original "columns" DataTable attribute</li>
     *   <li>`cells.columnName` {String} Column name or key associated with this cell</li>
     *   <li>`cells.columnIndex` {Integer} Column index of the column, within the "columns" data</li>
     * </ul>
     *
     * @method _getSelectedCells
     * @return {Array} cells The selected cells in {record,recordIndex,column,columnName,columnIndex} format
     * @private
     */
    _getSelectedCells: function(){
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_getSelectedCells", 614);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 615);
var cells = [],
            cols  = this.get('columns'),
            col, tr, rec;

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 619);
Y.Array.each(this._selections,function(item){
            _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "(anonymous 7)", 619);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 620);
if (!item) {return;}
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 621);
if ( item.get('tagName').toLowerCase() === 'td' ) {
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 622);
col = this.getColumnByTd(item);
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 623);
tr  = item.ancestor("tr");
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 624);
rec = this.data.getByClientId(tr.getData('yui3-record'));

                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 626);
cells.push({
                    td:          item,
                    record:      rec,
                    recordIndex: this.data.indexOf(rec),
                    column:      col,
                    columnName:  col.key || col.name,
                    columnIndex: Y.Array.indexOf(cols,col)
                });
            } else {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 634);
if ( item.get('tagName').toLowerCase() === 'tr' ) {
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 635);
tr = item;
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 636);
rec = this.data.getByClientId(tr.getData('yui3-record'));
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 637);
var tdNodes = tr.all("td");
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 638);
if ( tdNodes ) {
                    _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 639);
tdNodes.each(function(td){
                        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "(anonymous 8)", 639);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 640);
col = this.getColumnByTd(td);
                        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 641);
cells.push({
                            td:          td,
                            record:      rec,
                            recordIndex: this.data.indexOf(rec),
                            column:      col,
                            columnName:  col.key || col.name,
                            columnIndex: Y.Array.indexOf(cols,col)
                        });
                    },this);
                }
            }}
        },this);
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 653);
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
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_setSelectedCells", 667);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 668);
this._selections = [];
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 669);
if ( Y.Lang.isArray(val) && this.data.size() > val.length ) {
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 670);
Y.Array.each(val,function(item) {
                _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "(anonymous 9)", 670);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 671);
var row, col, td;
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 672);
if ( item.record ) {row = this.getRow( item.record );}
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 673);
if ( item.column ) {col = this.getColumn(item.column);}

                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 675);
if ( row && col ) {
                    _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 676);
var ckey = col.key || col.name;
                    _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 677);
if ( ckey ) {
                        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 678);
td = row.one('.'+this.getClassName('col')+'-'+ckey);
                        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 679);
this._selections.push(td);
                        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 680);
td.addClass(this._classSelected);
                    }
                }

            },this);
        }
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 686);
return val;
    },

    /**
     * A setter method for attribute `selectedRows` that takes as input an array of desired DataTable
     * record indices to be "selected", clears existing selections and sets the "selected" records and
     * highlights the TR's
     *
     * @method _setSelectedRows
     * @param val {Array} recIndices Array of record indices desired to be set as selected.
     * @return {Array} records Array of DataTable records (Y.Model) for each selection chosen
     * @private
     */
    _setSelectedRows: function(val){
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_setSelectedRows", 699);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 700);
this._selections = [];
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 701);
if ( Y.Lang.isArray(val) && this.data.size() > val.length ) {
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 702);
Y.Array.each(val,function(item){
                _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "(anonymous 10)", 702);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 703);
var tr = this.getRow(item);
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 704);
if ( tr ) {
                    _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 705);
this._selections.push( tr );
                    _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 706);
tr.addClass(this._classSelected);
                }
            },this);
        }
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 710);
return val;
    },

    /**
     * Method is fired BEFORE a "reset" action takes place on the "data", usually related to a column sort.
     * This is used to preserve the pre-sorted data (temporarily in _selections) prior to sorting so that
     * we can reapply the "selections" after the sort is completed (see [_afterResetDataSelect](#method__afterResetDataSelect))
     *
     * @method _beforeResetDataSelect
     * @private
     */
    _beforeResetDataSelect: function() {
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_beforeResetDataSelect", 721);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 722);
if( !this._selections || this._selections.length === 0 ) {return;}

        // Save a copy of the current pre-sort rows and/or cells ...
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 725);
var rows  = this.get('selectedRows'),   // array as {record,tr}
            cells = this.get('selectedCells'),  // array as {record,td,column,columnIndex,columnName}
            tr, td;

        // Clear out the selections, reset selected and remove "selected" CSS on table
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 730);
this._selections = [];
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 731);
this.set('selected',null);
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 732);
this._clearAll(this._classSelected);

        //
        //  Loop over all of the rows or cells (depending on mode),
        //    and push a temporary record to the _selections array,
        //    to be used in _afterResetDataSelect to reconstruct selections
        //
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 739);
if( this.get('selectionMode') === 'row' && rows && rows.length > 0 ) {

            // Push the Model data only to the _selections array ...
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 742);
Y.Array.each(rows,function(r){
                _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "(anonymous 11)", 742);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 743);
if ( r && r.record )
                    {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 744);
this._selections.push( r.record );}
            },this);

        } else {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 747);
if ( this.get('selectionMode') === 'cell' && cells && cells.length > 0 ) {

            // Push the Model data and column index only to the _selections array
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 750);
Y.Array.each(cells,function(r){
                _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "(anonymous 12)", 750);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 751);
if(r && r.record && r.columnIndex)
                    {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 752);
this._selections.push({record:r.record, colIndex:r.columnIndex});}
            },this);
        }}

    },

    /**
     * Method is fired AFTER a "reset" action takes place on the "data", usually related to a column sort.
     * This function reads the pre-sorted selections that were stored by  [_beforeResetDataSelect](#method__beforeResetDataSelect)
     * temporarily in this._selections.
     *
     * Depending upon the current "selectionMode", either post-sorted TBODY selections are re-applied, by determining either
     * the TR's (from the Model data) or the TD's (from the Model and Column Index data).
     *
     * @method _afterResetDataSelect
     * @private
     */
    _afterResetDataSelect: function() {
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_afterResetDataSelect", 769);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 770);
if( !this._selections || this._selections.length === 0 ) {return;}
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 771);
var tr, td;
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 772);
var buffer = [];

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 774);
Y.Array.each(this._selections,function(item){
            _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "(anonymous 13)", 774);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 775);
if( this.get('selectionMode') === 'row' && item ) {
                // the "item" is a Model pushed prior to the "sort" action ...
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 777);
tr = this.getRow(item);
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 778);
if( tr ){
                    _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 779);
buffer.push(tr);
                    _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 780);
tr.addClass(this._classSelected);
                }
            } else {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 782);
if (this.get('selectionMode') === 'cell' && item ) {
                // the item is an object as {record,colIndex} pushed prior to "sort" action ...
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 784);
tr = this.getRow(item.record),
                td = (tr) ? tr.all("td").item(item.colIndex) : null;
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 786);
if(tr && td) {
                    _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 787);
buffer.push(td);
                    _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 788);
td.addClass(this._classSelected);
                }
            }}
        },this);

        // swap out the temporary buffer, for the current selections ...
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 794);
this._selections = buffer;

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
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_processNodeAction", 811);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 812);
var tar = o.newVal,
            tarNew, tarPrev, modeName, className;

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 815);
if ( prefix === 'highlight') {
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 816);
modeName  = prefix + 'Mode';
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 817);
className = this._classHighlight;
        } else {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 818);
if ( prefix === 'select' ) {
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 819);
modeName  = 'selectionMode';
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 820);
className = this._classSelected;
        }}

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 823);
if ( this.get(modeName) == "cell" ) {
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 824);
tarNew  = tar || null;
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 825);
tarPrev = o.prevVal || null;
        } else {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 826);
if ( this.get(modeName) == "row" ) {
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 827);
if ( tar ) {
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 828);
tarNew = (tar.get('tagName').search(/td/i) === 0 ) ? tar.ancestor('tr') : ( tar.get('tagName').search(/tr/i) === 0 ) ? tar : null ;
            }
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 830);
tarPrev = o.prevVal;
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 831);
if (tarPrev)
                {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 832);
tarPrev = (tarPrev.get('tagName').search(/td/i) === 0 ) ? tarPrev.ancestor('tr') : ( tarPrev.get('tagName').search(/tr/i) === 0 ) ? tarPrev : null ;}
        }}

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 835);
if ( tarPrev && erasePrev )  {tarPrev.removeClass(className);}
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 836);
if ( tarNew ) {tarNew.addClass(className);}

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 838);
return tarNew;
    },


    /**
     * Method removes the specified `type` CSS class from all nodes within the TBODY data node.
     * @method _clearAll
     * @param {String} type Class name to remove from all nodes attached to TBODY DATA
     * @private
     */
    _clearAll: function(type){
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_clearAll", 848);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 849);
var nodes = this.get('boundingBox').one("."+this.getClassName('data'));
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 850);
if ( nodes )
            {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 851);
nodes.all('.'+type).removeClass(type);}
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
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_setHighlightMode", 865);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 866);
if ( this._eventHandles.selectorHighlight ) {this._eventHandles.selectorHighlight.detach();}
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 867);
this._eventHandles.selectorHighlight = this.delegate("mouseover",function(e){
                _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "(anonymous 14)", 867);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 868);
var tar = e.currentTarget;
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 869);
this.set('highlighted',tar);
            },"tr td",this);

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 872);
this._clearAll(this._classHighlight);
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 873);
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
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_setSelectionMode", 887);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 888);
var oSelf = this;
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 889);
if ( this._eventHandles.selectorSelect ) {this._eventHandles.selectorSelect.detach();}
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 890);
this._eventHandles.selectorSelect = this.delegate("click",function(e){
                _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "(anonymous 15)", 890);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 891);
var tar = e.currentTarget;

                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 893);
e.halt(true);

                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 895);
oSelf._clickModifiers = {
                    ctrlKey:  e.ctrlKey,
                    altKey:   e.altKey,
                    metaKey:  e.metaKey,
                    shiftKey: e.shiftKey,
                    which:    e.which,
                    button:   e.button
                };

                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 904);
oSelf.set('selected',tar);

            },"tr td",oSelf);
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 907);
this._clearAll(this._classSelected);
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 908);
return val;
    },

    /**
     * Helper method to clear DOM "selected" text or ranges
     * @method _clearDOMSelection
     * @private
     */
    _clearDOMSelection: function(){
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_clearDOMSelection", 916);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 917);
var sel = (Y.config.win.getSelection) ? Y.config.win.getSelection() : (Y.config.doc.selection) ? Y.config.doc.selection : null;
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 918);
if ( sel && sel.empty ) {sel.empty();}    // works on chrome
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 919);
if ( sel && sel.removeAllRanges ) {sel.removeAllRanges();}    // works on FireFox
    }

});

_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 924);
Y.DataTable.Selection = DtSelection;
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 925);
Y.Base.mix(Y.DataTable, [Y.DataTable.Selection]);



}, 'gallery-2012.09.26-20-36' ,{skinnable:true, requires:['base-build','datatable-base','event']});
