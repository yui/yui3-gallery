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
_yuitest_coverage["/build/gallery-datatable-selection/gallery-datatable-selection.js"].code=["YUI.add('gallery-datatable-selection', function(Y) {","","/**"," A class extension for DataTable that adds \"highlight\" and \"select\" actions via mouse selection."," The extension works in either \"cell\" mode or \"row\" mode (set via attribute [selectionMode](#attr_selectionMode)).",""," Highlighting is controlled by the [highlightMode](#attr_highlightMode) attribute (either \"cell\" or \"row\")."," (Highlighting provides a \"mouseover\" indication only).",""," Selection is provided via \"click\" listeners.",""," This extension includes the ability to select \"multiple\" items, by setting the [selectionMulti](#attr_selectionMulti)"," attribute (enabled using browser multi-select click modifier, i.e. \"Cmd\" key on Mac OSX or \"Ctrl\" key on Windows / Linux).",""," Additionally, a \"range\" selection capability is provided by using the browser range selector click key modifier,"," specifically the Shift key on most systems.",""," The extension has been written to allow preserving the \"selected\" rows or cells during \"sort\" operations.",""," Specific attributes are provided that can be read for current selections, including the ATTRS [selectedRows](#attr_selectedRows),"," and [selectedCells](#attr_selectedCells).",""," @module DataTable"," @submodule Selection"," @class Y.DataTable.Selection"," @extends Y.DataTable"," @author Todd Smith"," @version 1.0.0"," @since 3.6.0"," **/","function DtSelection() {}","","DtSelection.ATTRS = {","    /**","     * Node for the most recent \"highlighted\" item, either TD or TR","     * @attribute highlighted","     * @type {Node}","     * @default null","     */","    highlighted : {","        value:      null,","        validator:  function(v){ return (v instanceof Y.Node) || v === null; }","    },","","    /**","     * Node for the most recent \"selected\" item, either TD or TR","     * @attribute selected","     * @type {Node}","     * @default null","     */","    selected:{","        value:      null,","        validator:  function(v){ return (v instanceof Y.Node) || v === null; }","    },","","    /**","     * Set the current mode for highlighting, either for a single TD (as \"cell\") or for a","     * full TR (as \"row\")","     * @attribute highlightMode","     * @type {String}","     * @default 'cell'","     */","    highlightMode:{","        value:      null,","        setter:     '_setHighlightMode',","        validator:  function(v){","            if (!Y.Lang.isString(v)) return false;","            return (v === null || v === 'cell' || v ==='row' ) ? true : false;","        }","    },","","    /**","     * Set the current mode for indicating selections, either for a single TD (as \"cell\") or for a","     * full TR (as \"row\")","     *","     * @attribute highlightMode","     * @type {String}","     * @default 'cell'","     */","    selectionMode:{","        value:      null,","        setter:     '_setSelectionMode',","        validator:  function(v){","            if (!Y.Lang.isString(v)) return false;","            return (v === null || v === 'cell' || v ==='row' ) ? true : false;","        }","    },","","    /**","     * Attribute that holds the selected TR's associated with either the selected \"rows\" or the","     *  TR's that are related to the selected \"cells\", duplicates are excluded.","     *","     * On input, accepts an Array of record indices for rows that should be set as \"selected\".","     * (Please refer to method [_setSelectedRows](#method__setSelectedRows))","     *","     *          dt.set('selectedRows',[ 1, 5, 9, 11]);","     *          // selects the 2nd, 6th, 10th and 12th records","     *","     * For reading this setting, it returns an Array of objects containing {tr,record,recordIndex} for each","     *  selected \"row\"; where \"tr\" is a Y.Node instance and \"record\" is the Model for the TR and \"recordIndex\" is the","     *  record index within the current dataset.","     * (Please refer to method [_getSelectedRows](#method__getSelectedRows))","     *","     * @attribute selectedRows","     * @type {Array}","     * @default []","     */","    selectedRows: {","        value:      [],","        validator:  Y.Lang.isArray,","        getter:     '_getSelectedRows',","        setter:     '_setSelectedRows'","    },","","    /**","     * Attribute that holds the selected TD's associated with the selected \"cells\", or related to the","     *  selected \"rows\" if that is the `selectionMode`.","     *","     *  On input, an Array can be provided to pre-set as \"selected\" cells, defined as each element being","     *  in {record,column} format; where \"record\" is the record index (or clientId) and \"column\" is either","     *  the column index or the key/name for the column.","     *  (Please see method [_setSelectedCells](#method__setSelectedCells) for reference).","     *","     *          dt.set('selectedCells',[{record:0,column:'fname'}, {record:187,column:7} ]);","     *","     *  For reading the selected cells (via \"get\"), an array is returned with contains {Object} elements","     *  that describe the row / column combinations of each currently selected cell.","     *  (Please see method [_getSelectedCells](#method__getSelectedCells) for full information on the returned objects).","     *","     * @attribute selectedCells","     * @type {Array}","     * @default []","     */","    selectedCells: {","        value:      [],","        validator:  Y.Lang.isArray,","        setter:     '_setSelectedCells',","        getter:     '_getSelectedCells'","    },","","    /**","     * Flag to allow either single \"selections\" (false) or multiple selections (true).","     * For Macintosh OSX-type systems the modifier key \"Cmd\" is held for multiple selections,","     *  and for Windows or Linux type systems the modifier key is \"Ctrl\".","     * @attribute selectionMulti","     * @type {Boolean}","     * @default false","     */","    selectionMulti: {","        value:      false,","        setter:     '_setSelectionMulti',","        validator:  Y.Lang.isBoolean","    }","","};","","","Y.mix( DtSelection.prototype, {","","    /**","     * @property _selections","     * @type Array","     * @default null","     * @static","     * @protected","     */","    _selections: null,","","    /**","     * Holder for the classname for the \"highlight\" TR or TD","     * @property _classHighlight","     * @type String","     * @default null","     * @static","     * @protected","     */","    _classHighlight: null,","","    /**","     * Holder for the classname for the \"selected\" TR or TD","     * @property _classSelected","     * @type String","     * @default null","     * @static","     * @protected","     */","    _classSelected: null,","","    /**","     * Holder for the most recent \"click\" event modifier keys from last click,","     *  used for assessing \"multi\" selections.","     *","     * Contains properties;  altKey, ctrlKey, shiftKey, metaKey, button and which","     *","     * Filled initially by .initializer and on each Table \"click\".","     *","     * @property _clickModifiers","     * @type Object","     * @default null","     * @static","     * @protected","     */","    _clickModifiers: null,","","//------------------------------------------------------------------------------------------------------","//        L I F E C Y C L E    M E T H O D S","//------------------------------------------------------------------------------------------------------","","    /**","     * Initializes and sets initial bindings for the datatable-selection module","     * @method initializer","     * @protected","     */","    initializer: function(){","        this._bindSelector();","    },","","    /**","     * Destructor to clean up bindings.","     * @method destructor","     * @protected","     */","    destructor: function () {","        this._unbindSelector();","    },","","","","//------------------------------------------------------------------------------------------------------","//        P U B L I C     M E T H O D S","//------------------------------------------------------------------------------------------------------","","    /**","     * Method to enable the datatable-selection module","     * @method disableSelection","     * @public","     */","    enableSelection: function(){","        this.disableSelection();","        this._bindSelector();","    },","","    /**","     * Method to disable the datatable-selection module (cleans up listeners and user interface).","     * @method disableSelection","     * @public","     */","    disableSelection: function(){","        this.clearAll();","        this._unbindSelector();","    },","","    /**","     * Returns the Column object (from the original \"columns\") associated with the input TD Node.","     * @method getColumnByTd","     * @param {Node} cell Node of TD for which column object is desired","     * @return {Object} column The column object entry associated with the desired cell","     * @public","     */","    getColumnByTd:  function(cell){","        var colName = this.getColumnNameByTd(cell);","        return (colName) ? this.getColumn(colName) : null;","    },","","","    /**","     * Returns the column \"key\" or \"name\" string for the requested TD Node","     * @method getColumnNameByTd","     * @param {Node} cell Node of TD for which column name is desired","     * @return {String} colName Column name or key name","     * @public","     */","    getColumnNameByTd: function(cell){","        var classes = cell.get('className').split(\" \"),","            regCol  = new RegExp( this.getClassName('col') + '-(.*)');","","        var colName;","        Y.Array.some(classes,function(item){","            var colmatch =  item.match(regCol);","            if ( colmatch && Y.Lang.isArray(colmatch) && colmatch[1] ) {","                colName = colmatch[1];","                return true;","            }","        });","","        return colName || null;","    },","","    /**","     * Utility method that will return all selected TD Nodes for the current \"selected\" set.","     * If selections include a TR row, all child TD's from the row are included.","     *","     * @method getSelectedTds","     * @return {Array} tds Array of selected TD's as Nodes","     * @public","     */","    getSelectedTds: function(){","        var tds = [];","        Y.Array.each(this._selections,function(item){","            if ( item.get('tagName').toLowerCase() === 'td' )","                tds.push( item );","            else if ( item.get('tagName').toLowerCase() === 'tr' ) {","                var tdNodes = item.all(\"td\");","                if ( tdNodes )","                    tdNodes.each(function(item){ tds.push( item )});","            }","        });","        return tds;","    },","","    /**","     * Removes all \"selected\" classes from DataTable and resets internal selections counters and \"selected\" attribute.","     * @method clearSelections","     * @public","     */","    clearSelections: function(){","        this._selections = [];","        this.set('selected',null);","        this._clearAll(this._classSelected);","    },","","    /**","     * Removes all \"highlight\" classes from DataTable and resets `highlighted` attribute.","     * @method clearHighlighted","     * @public","     */","    clearHighlighted: function(){","        this.set('highlighted',null);","        this._clearAll(this._classHighlight);","    },","","    /**","     * Removes all highlighting and selections on the DataTable.","     * @method clearAll","     * @public","     */","    clearAll: function(){","        this.clearSelections();","        this.clearHighlighted();","    },","","//------------------------------------------------------------------------------------------------------","//        P R I V A T E    M E T H O D S","//------------------------------------------------------------------------------------------------------","","    /**","     * Cleans up listener event handlers and static properties.","     * @method _unbindSelector","     * @private","     */","    _unbindSelector: function(){","","        Y.Array.each( this._eventHandles.selector,function(item){","            item.detach();","        });","        this._eventHandles.selector = null;","","        if ( this._eventHandles.selectorSelect )","            this._eventHandles.selectorSelect.detach();","        this._eventHandles.selectorSelect = null;","","        this._clickModifiers = null;","","    },","","    /**","     * Sets listeners and initial class names required for this \"datatable-selector\" module","     *","     * Note:  Delegated \"click\" listeners are defined in _setSelectedMode and _setHightlightMode methods","     *","     * @method _bindSelector","     * @private","     */","    _bindSelector: function(){","        this._selections = [];","        this._eventHandles.selector = [];","","        this._eventHandles.selector.push( this.on('highlightedChange',this._highlightChange) );","        this._eventHandles.selector.push( this.on('selectedChange',this._selectedChange) );","","        // set CSS classes for highlighting and selected,","        //    currently as  \".yui3-datatable-sel-highlighted\" and \".yui3-datatable-sel-selected\"","        this._classHighlight = this.getClassName('sel','highlighted');","        this._classSelected  = this.getClassName('sel','selected');","","        //","        //  These listeners are here solely for \"sort\" actions, to allow preserving the \"selections\"","        //   pre-sort and re-applying them after the TBODY has been sorted and displayed","        //","        this._eventHandles.selector.push( this.data.before('*:reset', Y.bind('_beforeResetDataSelect', this) ) );","        this._eventHandles.selector.push( this.data.after('*:reset', Y.bind('_afterResetDataSelect', this) ) );","","        // track click modifier keys from last click, this is the tempalte","        this._clickModifiers = {","            ctrlKey:null, altKey:null, metaKey:null, shiftKey:null, which:null, button:null","        };","    },","","    /**","     * Method that updates the \"highlighted\" classes for the selection and unhighlights the prevVal","     * @method _highlightChange","     * @param o","     * @private","     */","    _highlightChange: function(o) {","        var tar = this._processNodeAction(o,'highlight',true);","    },","","    /**","     * Method that updates the \"selected\" classes for the selection and un-selects the prevVal.","     * This method works with multiple selections (via ATTR `selectionMulti` true) by pushing","     * the current selection to the this._selections property.","     *","     * @method _selectedChange","     * @param o","     * @private","     */","    _selectedChange: function(o){","        // Evaluate a flag to determine whether previous selections should be cleared or \"kept\"","        var keepPrev, keepRange;","        if ( Y.UA.os.search('macintosh') === 0 )","            keepPrev =  this.get('selectionMulti') === true && this._clickModifiers.metaKey === true;","         else","            keepPrev =  this.get('selectionMulti') === true && this._clickModifiers.ctrlKey === true;","","        keepRange = this.get('selectionMulti') === true && this._clickModifiers.shiftKey === true;","","        // clear any SHIFT selected text first ...","        this._clearDOMSelection();","","        // if not-multi mode and more than one selection, clear them first ...","        if ( !keepPrev && !keepRange && this._selections.length>1 ) this.clearSelections();","","        if ( keepRange ) {","","            this._processRange(o);","","        }  else {","","            // Process the action ... updating 'select' class","            var tar = this._processNodeAction(o,'select', !keepPrev );","","            if ( !keepPrev ) this._selections = [];","            this._selections.push(tar);","","        }","","        this.fire('selected',{","            ochange: o,","            record: this.getRecord(o.newVal)","        });","","    },","","    /**","     * Called when a \"range\" selection is detected (i.e. SHIFT key held during click) that selects","     * a range of TD's or TR's (depending on [selectionMode](#attr_selectionMode) setting.","     *","     * @method _processRange","     * @param {Node} o Last clicked TD of range selection","     * @private","     */","    _processRange: function(o) {","        var tarNew  = o.newVal,","            tarPrev = o.prevVal || null;","","        if ( tarNew && tarPrev ) {","            var newRec  = this.getRecord(tarNew),","                newRecI = this.data.indexOf(newRec),","                newCol  = this.getColumnNameByTd(tarNew),","                newColI = this.get('columns').indexOf( this.getColumn(newCol)),","                prevRec  = this.getRecord(tarPrev),","                prevRecI = this.data.indexOf(prevRec),","                prevCol  = this.getColumnNameByTd(tarPrev),","                prevColI = this.get('columns').indexOf( this.getColumn(prevCol));","","            // Calculate range offset ... delCol (horiz) and delRow (vertically)","            var delCol = newColI - prevColI,","                delRow = newRecI - prevRecI;","","            // if we have valid deltas, update the range cells.","            if ( delCol !== null && delRow !== null) {","","                if (Y.Lang.isArray(this._selections) ) {","                    this.clearSelections();","                }","","                // Select a range of CELLS (i.e. TD's) ...","                if ( this.get('selectionMode') === 'cell' ) {","                    var coldir = (delCol<0) ? -1 : 1,","                        rowdir = (delRow<0) ? -1 : 1,","                        cell = tarPrev;","","                    for(var j=0; j<=Math.abs(delRow); j++)","                        for(var i=0; i<=Math.abs(delCol); i++) {","                            cell = this.getCell(tarPrev,[rowdir*(j),coldir*(i)]);","                            if (cell) {","                                cell.addClass(this._classSelected);","                                this._selections.push(cell);","                            }","                        }","                // Select a range of ROWS (i.e. TR's)","                } else if ( this.get('selectionMode') === 'row' ) {","","                    var rowdir = (delRow<0) ? -1 : 1,","                        tr = this.getRow(prevRecI);","","                    for(var j=0; j<=Math.abs(delRow); j++) {","                        tr = this.getRow(prevRecI+rowdir*(j));","                        if (tr) {","                            tr.addClass(this._classSelected);","                            this._selections.push(tr);","                        }","                    }","","                }","","            }","","        }","","    },","","    /**","     * @event selected","     * @param {Object} obj Return object","     * @param {Object} obj.ochange Change event object passed from attribute 'selected'","     * @param {Object} obj.record DataTable record (Y.Model) instance for the selection","     */","","    /**","     * Returns the current settings of row selections, includes multiple selections.  If the","     * current `selectionMode` is \"cell\" mode, this function returns the unique \"records\" associated with","     * the selected cells.","     *","     * **Returned** `rows` {Array} of objects in format;","     * <ul>","     *   <li>`rows.tr` {Node} Node instance of the TR that was selected</li>","     *   <li>`rows.record` {Model} The Model associated with the data record for the selected TR</li>","     *   <li>`rows.recordIndex` {Integer} The record index of the selected TR within the current \"data\" set</li>","     * </ul>","","     * @method _getSelectedRows","     * @return {Array} rows Array of selected \"rows\" as objects in {tr,record,recordIndex} format","     * @private","     */","    _getSelectedRows: function(){","        var trs  = [],","            rows = [],","            tr, rec;","        Y.Array.each(this._selections,function(item){","            tr = ( item.get('tagName').toLowerCase() === 'tr' ) ? item : item.ancestor('tr');","            // if and only if, it's a TR and not in \"trs\" array ... then add it","            if ( tr.get('tagName').toLowerCase() === 'tr' && trs.indexOf(tr) === -1) {","                rec = this.data.getByClientId(tr.getData('yui3-record'));","                trs.push(tr);","                rows.push({","                    tr:     tr,   // this is an OLD, stale TR from pre-sort","                    record: rec,","                    recordIndex: this.data.indexOf(rec)","                });","            }","        },this);","        return rows;","    },","","","","    /**","     * Getter method that returns an Array of the selected cells in record/column coordinate format.","     * If rows or TR elements were selected, it adds all of the row's child TD's.","     *","     * **Returned** `cells` {Array} of objects in format;","     * <ul>","     *   <li>`cells.record` {Model} Record for this cell as a Y.Model</li>","     *   <li>`cells.recordIndex` {Integer} Record index for this cell in the current \"data\" set</li>","     *   <li>`cells.column` {Object} Column for this cell defined in original \"columns\" DataTable attribute</li>","     *   <li>`cells.columnName` {String} Column name or key associated with this cell</li>","     *   <li>`cells.columnIndex` {Integer} Column index of the column, within the \"columns\" data</li>","     * </ul>","     *","     * @method _getSelectedCells","     * @return {Array} cells The selected cells in {record,recordIndex,column,columnName,columnIndex} format","     * @private","     */","    _getSelectedCells: function(){","        var cells = [],","            cols  = this.get('columns'),","            col, tr, rec;","","        Y.Array.each(this._selections,function(item){","            if (!item) return;","            if ( item.get('tagName').toLowerCase() === 'td' ) {","                col = this.getColumnByTd(item);","                tr  = item.ancestor(\"tr\");","                rec = this.data.getByClientId(tr.getData('yui3-record'));","","                cells.push({","                    record:     rec,","                    recordIndex: this.data.indexOf(rec),","                    column:     col,","                    columnName: col.key || col.name,","                    columnIndex: cols.indexOf(col)","                });","            } else if ( item.get('tagName').toLowerCase() === 'tr' ) {","                tr = item;","                rec = this.data.getByClientId(tr.getData('yui3-record'));","                var tdNodes = tr.all(\"td\");","                if ( tdNodes ) {","                    tdNodes.each(function(td){","                        //cells.push( {record:this.getRecord(item), column:this.getColumnByTd(item) } )","                        col = this.getColumnByTd(td);","                        cells.push({","                            record:     rec,","                            recordIndex: this.data.indexOf(rec),","                            column:     col,","                            columnName: col.key || col.name,","                            columnIndex: cols.indexOf(col)","                        });","                    },this);","                }","            }","        },this);","        return cells;","    },","","    /**","     * Setter method for attribute `selectedCells` that takes an array of cells as input and sets them","     * as the current selected set with appropriate visual class.","     *","     * @method _setSelectedCells","     * @param {Array} val The desired cells to set as selected, in {record:,column:} format","     * @param {String|Number} val.record Record for this cell as either record index or record clientId","     * @param {String|Number} val.column Column for this cell as either the column index or \"key\" or \"name\"","     * @return {Array}","     * @private","     */","    _setSelectedCells: function(val){","        this._selections = [];","        if ( Y.Lang.isArray(val) && this.data.size() > val.length ) {","            Y.Array.each(val,function(item) {","                var row, col, td;","                if ( item.record ) row = this.getRow( item.record );","                if ( item.column ) col = this.getColumn(item.column);","","                if ( row && col ) {","                    var ckey = col.key || col.name;","                    if ( ckey ) {","                        td = row.one('.'+this.getClassName('col')+'-'+ckey);","                        this._selections.push(td);","                        td.addClass(this._classSelected);","                    }","                }","","            },this);","        }","        return val;","    },","","    /**","     * A setter method for attribute `selectedRows` that takes as input an array of desired DataTable","     * record indices to be \"selected\", clears existing selections and sets the \"selected\" records and","     * highlights the TR's","     *","     * @method _setSelectedRows","     * @param val {Array} recIndices Array of record indices desired to be set as selected.","     * @return {Array} records Array of DataTable records (Y.Model) for each selection chosen","     * @private","     */","    _setSelectedRows: function(val){","        this._selections = [];","        if ( Y.Lang.isArray(val) && this.data.size() > val.length ) {","            Y.Array.each(val,function(item){","                var tr = this.getRow(item);","                if ( tr ) {","                    this._selections.push( tr );","                    tr.addClass(this._classSelected);","                }","            },this);","        }","        return val;","    },","","    /**","     * Method is fired BEFORE a \"reset\" action takes place on the \"data\", usually related to a column sort.","     * This is used to preserve the pre-sorted data (temporarily in _selections) prior to sorting so that","     * we can reapply the \"selections\" after the sort is completed (see [_afterResetDataSelect](#method__afterResetDataSelect))","     *","     * @method _beforeResetDataSelect","     * @private","     */","    _beforeResetDataSelect: function() {","        if( !this._selections || this._selections.length === 0 ) return;","","        // Save a copy of the current pre-sort rows and/or cells ...","        var rows  = this.get('selectedRows'),   // array as {record,tr}","            cells = this.get('selectedCells'),  // array as {record,td,column,columnIndex,columnName}","            tr, td;","","        // Clear out the selections, reset selected and remove \"selected\" CSS on table","        this._selections = [];","        this.set('selected',null);","        this._clearAll(this._classSelected);","","        //","        //  Loop over all of the rows or cells (depending on mode),","        //    and push a temporary record to the _selections array,","        //    to be used in _afterResetDataSelect to reconstruct selections","        //","        if( this.get('selectionMode') === 'row' && rows && rows.length > 0 ) {","","            // Push the Model data only to the _selections array ...","            Y.Array.each(rows,function(r){","                if ( r && r.record )","                    this._selections.push( r.record );","            },this);","","        } else if ( this.get('selectionMode') === 'cell' && cells && cells.length > 0 ) {","","            // Push the Model data and column index only to the _selections array","            Y.Array.each(cells,function(r){","                if(r && r.record && r.columnIndex)","                    this._selections.push({record:r.record, colIndex:r.columnIndex});","            },this);","        }","","    },","","    /**","     * Method is fired AFTER a \"reset\" action takes place on the \"data\", usually related to a column sort.","     * This function reads the pre-sorted selections that were stored by  [_beforeResetDataSelect](#method__beforeResetDataSelect)","     * temporarily in this._selections.","     *","     * Depending upon the current \"selectionMode\", either post-sorted TBODY selections are re-applied, by determining either","     * the TR's (from the Model data) or the TD's (from the Model and Column Index data).","     *","     * @method _afterResetDataSelect","     * @private","     */","    _afterResetDataSelect: function() {","        if( !this._selections || this._selections.length === 0 ) return;","        var tr, td;","        var buffer = [];","","        Y.Array.each(this._selections,function(item){","            if( this.get('selectionMode') === 'row' && item ) {","                // the \"item\" is a Model pushed prior to the \"sort\" action ...","                tr = this.getRow(item);","                if( tr ){","                    buffer.push(tr);","                    tr.addClass(this._classSelected);","                }","            } else if (this.get('selectionMode') === 'cell' && item ) {","                // the item is an object as {record,colIndex} pushed prior to \"sort\" action ...","                tr = this.getRow(item.record),","                td = (tr) ? tr.all(\"td\").item(item.colIndex) : null;","                if(tr && td) {","                    buffer.push(td);","                    td.addClass(this._classSelected);","                }","            }","        },this);","","        // swap out the temporary buffer, for the current selections ...","        this._selections = buffer;","","    },","","    /**","     * Method used to derive from the clicked selection, either the TR or TD of the selection, and","     * returns the current `selectionMode` or `highlightMode` Node (based on the setting of prefix).","     *","     * This method adds the required class, and if erasePrev is true, removes the class from the prior setting.","     *","     * @method _processNodeAction","     * @param {Object} o Attribute change event object","     * @param {String} prefix","     * @param {Boolean} erasePrev","     * @return {Node} node Returned target Y.Node, either TR or TD based upon current `selectionMode` or `highlightMode`","     * @private","     */","    _processNodeAction: function(o, prefix, erasePrev ){","        var tar = o.newVal,","            tarNew, tarPrev, modeName, className;","","        if ( prefix === 'highlight') {","            modeName  = prefix + 'Mode';","            className = this._classHighlight;","        } else if ( prefix === 'select' ) {","            modeName  = 'selectionMode';","            className = this._classSelected;","        }","","        if ( this.get(modeName) == \"cell\" ) {","            tarNew  = tar || null;","            tarPrev = o.prevVal || null;","        } else if ( this.get(modeName) == \"row\" ) {","            if ( tar ) {","                tarNew = (tar.get('tagName').search(/td/i) === 0 ) ? tar.ancestor('tr') : ( tar.get('tagName').search(/tr/i) === 0 ) ? tar : null ;","            }","            tarPrev = o.prevVal;","            if (tarPrev)","                tarPrev = (tarPrev.get('tagName').search(/td/i) === 0 ) ? tarPrev.ancestor('tr') : ( tarPrev.get('tagName').search(/tr/i) === 0 ) ? tarPrev : null ;","        }","","        if ( tarPrev && erasePrev )  tarPrev.removeClass(className);","        if ( tarNew ) tarNew.addClass(className);","","        return tarNew;","    },","","","    /**","     * Method removes the specified `type` CSS class from all nodes within the TBODY data node.","     * @method _clearAll","     * @param {String} type Class name to remove from all nodes attached to TBODY DATA","     * @private","     */","    _clearAll: function(type){","        var nodes = this.get('boundingBox').one(\".\"+this.getClassName('data'));","        if ( nodes )","            nodes.all('.'+type).removeClass(type);","    },","","    /**","     * Setter for `highlightMode` attribute, removes prior event handle (if exists) and defines","     * a new delegated \"mouseover\" handler that updates the `highlighted` attribute.","     *","     * A change to this setting clears all prior highlighting.","     *","     * @method _setHighlightMode","     * @param val","     * @return {*}","     * @private","     */","    _setHighlightMode: function(val){","        if ( this._eventHandles.selectorHighlight ) this._eventHandles.selectorHighlight.detach();","        this._eventHandles.selectorHighlight = this.delegate(\"mouseover\",function(e){","                var tar = e.currentTarget;","                this.set('highlighted',tar);","            },\"tr td\",this);","","        this._clearAll(this._classHighlight);","        return val;","    },","","    /**","     * Setter for `selectionMode` attribute, removes prior event handle (if exists) and defines","     * a new delegated \"click\" handler that updates the `selected` attribute.","     *","     * A change to this setting clears all prior selections.","     *","     * @method _setSelectionMode","     * @param val","     * @return {*}","     * @private","     */","    _setSelectionMode: function(val){","        var oSelf = this;","        if ( this._eventHandles.selectorSelect ) this._eventHandles.selectorSelect.detach();","        this._eventHandles.selectorSelect = this.delegate(\"click\",function(e){","                var tar = e.currentTarget;","","                e.halt(true);","","                oSelf._clickModifiers = {","                    ctrlKey:  e.ctrlKey,","                    altKey:   e.altKey,","                    metaKey:  e.metaKey,","                    shiftKey: e.shiftKey,","                    which:    e.which,","                    button:   e.button","                };","","                oSelf.set('selected',tar);","","            },\"tr td\",oSelf);","        this._clearAll(this._classSelected);","        return val;","    },","","    /**","     * Helper method to clear DOM \"selected\" text or ranges","     * @method _clearDOMSelection","     * @private","     */","    _clearDOMSelection: function(){","        var sel = (Y.config.win.getSelection) ? Y.config.win.getSelection() : (Y.config.doc.selection) ? Y.config.doc.selection : null;","        if ( sel && sel.empty ) sel.empty();    // works on chrome","        if ( sel && sel.removeAllRanges ) sel.removeAllRanges();    // works on FireFox","    }","","});","","Y.DataTable.Selection = DtSelection;","Y.Base.mix(Y.DataTable, [Y.DataTable.Selection]);","","","}, 'gallery-2012.09.05-20-01' ,{skinnable:true, requires:['base-build','datatable-base','event']});"];
_yuitest_coverage["/build/gallery-datatable-selection/gallery-datatable-selection.js"].lines = {"1":0,"31":0,"33":0,"42":0,"53":0,"67":0,"68":0,"84":0,"85":0,"158":0,"215":0,"224":0,"239":0,"240":0,"249":0,"250":0,"261":0,"262":0,"274":0,"277":0,"278":0,"279":0,"280":0,"281":0,"282":0,"286":0,"298":0,"299":0,"300":0,"301":0,"302":0,"303":0,"304":0,"305":0,"308":0,"317":0,"318":0,"319":0,"328":0,"329":0,"338":0,"339":0,"353":0,"354":0,"356":0,"358":0,"359":0,"360":0,"362":0,"375":0,"376":0,"378":0,"379":0,"383":0,"384":0,"390":0,"391":0,"394":0,"406":0,"420":0,"421":0,"422":0,"424":0,"426":0,"429":0,"432":0,"434":0,"436":0,"441":0,"443":0,"444":0,"448":0,"464":0,"467":0,"468":0,"478":0,"482":0,"484":0,"485":0,"489":0,"490":0,"494":0,"495":0,"496":0,"497":0,"498":0,"499":0,"503":0,"505":0,"508":0,"509":0,"510":0,"511":0,"512":0,"548":0,"551":0,"552":0,"554":0,"555":0,"556":0,"557":0,"564":0,"587":0,"591":0,"592":0,"593":0,"594":0,"595":0,"596":0,"598":0,"605":0,"606":0,"607":0,"608":0,"609":0,"610":0,"612":0,"613":0,"624":0,"639":0,"640":0,"641":0,"642":0,"643":0,"644":0,"646":0,"647":0,"648":0,"649":0,"650":0,"651":0,"657":0,"671":0,"672":0,"673":0,"674":0,"675":0,"676":0,"677":0,"681":0,"693":0,"696":0,"701":0,"702":0,"703":0,"710":0,"713":0,"714":0,"715":0,"718":0,"721":0,"722":0,"723":0,"741":0,"742":0,"743":0,"745":0,"746":0,"748":0,"749":0,"750":0,"751":0,"753":0,"755":0,"757":0,"758":0,"759":0,"765":0,"783":0,"786":0,"787":0,"788":0,"789":0,"790":0,"791":0,"794":0,"795":0,"796":0,"797":0,"798":0,"799":0,"801":0,"802":0,"803":0,"806":0,"807":0,"809":0,"820":0,"821":0,"822":0,"837":0,"838":0,"839":0,"840":0,"843":0,"844":0,"859":0,"860":0,"861":0,"862":0,"864":0,"866":0,"875":0,"878":0,"879":0,"888":0,"889":0,"890":0,"895":0,"896":0};
_yuitest_coverage["/build/gallery-datatable-selection/gallery-datatable-selection.js"].functions = {"DtSelection:31":0,"validator:42":0,"validator:53":0,"validator:66":0,"validator:83":0,"initializer:214":0,"destructor:223":0,"enableSelection:238":0,"disableSelection:248":0,"getColumnByTd:260":0,"(anonymous 2):278":0,"getColumnNameByTd:273":0,"(anonymous 4):305":0,"(anonymous 3):299":0,"getSelectedTds:297":0,"clearSelections:316":0,"clearHighlighted:327":0,"clearAll:337":0,"(anonymous 5):353":0,"_unbindSelector:351":0,"_bindSelector:374":0,"_highlightChange:405":0,"_selectedChange:418":0,"_processRange:463":0,"(anonymous 6):551":0,"_getSelectedRows:547":0,"(anonymous 8):610":0,"(anonymous 7):591":0,"_getSelectedCells:586":0,"(anonymous 9):641":0,"_setSelectedCells:638":0,"(anonymous 10):673":0,"_setSelectedRows:670":0,"(anonymous 11):713":0,"(anonymous 12):721":0,"_beforeResetDataSelect:692":0,"(anonymous 13):745":0,"_afterResetDataSelect:740":0,"_processNodeAction:782":0,"_clearAll:819":0,"(anonymous 14):838":0,"_setHighlightMode:836":0,"(anonymous 15):861":0,"_setSelectionMode:858":0,"_clearDOMSelection:887":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-datatable-selection/gallery-datatable-selection.js"].coveredLines = 210;
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

 @module DataTable
 @submodule Selection
 @class Y.DataTable.Selection
 @extends Y.DataTable
 @author Todd Smith
 @version 1.0.0
 @since 3.6.0
 **/
_yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 31);
function DtSelection() {}

_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 33);
DtSelection.ATTRS = {
    /**
     * Node for the most recent "highlighted" item, either TD or TR
     * @attribute highlighted
     * @type {Node}
     * @default null
     */
    highlighted : {
        value:      null,
        validator:  function(v){ _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "validator", 42);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 42);
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
        validator:  function(v){ _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "validator", 53);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 53);
return (v instanceof Y.Node) || v === null; }
    },

    /**
     * Set the current mode for highlighting, either for a single TD (as "cell") or for a
     * full TR (as "row")
     * @attribute highlightMode
     * @type {String}
     * @default 'cell'
     */
    highlightMode:{
        value:      null,
        setter:     '_setHighlightMode',
        validator:  function(v){
            _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "validator", 66);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 67);
if (!Y.Lang.isString(v)) {return false;}
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 68);
return (v === null || v === 'cell' || v ==='row' ) ? true : false;
        }
    },

    /**
     * Set the current mode for indicating selections, either for a single TD (as "cell") or for a
     * full TR (as "row")
     *
     * @attribute highlightMode
     * @type {String}
     * @default 'cell'
     */
    selectionMode:{
        value:      null,
        setter:     '_setSelectionMode',
        validator:  function(v){
            _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "validator", 83);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 84);
if (!Y.Lang.isString(v)) {return false;}
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 85);
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


_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 158);
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
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "initializer", 214);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 215);
this._bindSelector();
    },

    /**
     * Destructor to clean up bindings.
     * @method destructor
     * @protected
     */
    destructor: function () {
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "destructor", 223);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 224);
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
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "enableSelection", 238);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 239);
this.disableSelection();
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 240);
this._bindSelector();
    },

    /**
     * Method to disable the datatable-selection module (cleans up listeners and user interface).
     * @method disableSelection
     * @public
     */
    disableSelection: function(){
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "disableSelection", 248);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 249);
this.clearAll();
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 250);
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
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "getColumnByTd", 260);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 261);
var colName = this.getColumnNameByTd(cell);
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 262);
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
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "getColumnNameByTd", 273);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 274);
var classes = cell.get('className').split(" "),
            regCol  = new RegExp( this.getClassName('col') + '-(.*)');

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 277);
var colName;
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 278);
Y.Array.some(classes,function(item){
            _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "(anonymous 2)", 278);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 279);
var colmatch =  item.match(regCol);
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 280);
if ( colmatch && Y.Lang.isArray(colmatch) && colmatch[1] ) {
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 281);
colName = colmatch[1];
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 282);
return true;
            }
        });

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 286);
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
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "getSelectedTds", 297);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 298);
var tds = [];
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 299);
Y.Array.each(this._selections,function(item){
            _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "(anonymous 3)", 299);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 300);
if ( item.get('tagName').toLowerCase() === 'td' )
                {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 301);
tds.push( item );}
            else {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 302);
if ( item.get('tagName').toLowerCase() === 'tr' ) {
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 303);
var tdNodes = item.all("td");
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 304);
if ( tdNodes )
                    {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 305);
tdNodes.each(function(item){ _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "(anonymous 4)", 305);
tds.push( item )});}
            }}
        });
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 308);
return tds;
    },

    /**
     * Removes all "selected" classes from DataTable and resets internal selections counters and "selected" attribute.
     * @method clearSelections
     * @public
     */
    clearSelections: function(){
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "clearSelections", 316);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 317);
this._selections = [];
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 318);
this.set('selected',null);
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 319);
this._clearAll(this._classSelected);
    },

    /**
     * Removes all "highlight" classes from DataTable and resets `highlighted` attribute.
     * @method clearHighlighted
     * @public
     */
    clearHighlighted: function(){
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "clearHighlighted", 327);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 328);
this.set('highlighted',null);
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 329);
this._clearAll(this._classHighlight);
    },

    /**
     * Removes all highlighting and selections on the DataTable.
     * @method clearAll
     * @public
     */
    clearAll: function(){
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "clearAll", 337);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 338);
this.clearSelections();
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 339);
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

        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_unbindSelector", 351);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 353);
Y.Array.each( this._eventHandles.selector,function(item){
            _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "(anonymous 5)", 353);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 354);
item.detach();
        });
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 356);
this._eventHandles.selector = null;

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 358);
if ( this._eventHandles.selectorSelect )
            {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 359);
this._eventHandles.selectorSelect.detach();}
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 360);
this._eventHandles.selectorSelect = null;

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 362);
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
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_bindSelector", 374);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 375);
this._selections = [];
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 376);
this._eventHandles.selector = [];

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 378);
this._eventHandles.selector.push( this.on('highlightedChange',this._highlightChange) );
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 379);
this._eventHandles.selector.push( this.on('selectedChange',this._selectedChange) );

        // set CSS classes for highlighting and selected,
        //    currently as  ".yui3-datatable-sel-highlighted" and ".yui3-datatable-sel-selected"
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 383);
this._classHighlight = this.getClassName('sel','highlighted');
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 384);
this._classSelected  = this.getClassName('sel','selected');

        //
        //  These listeners are here solely for "sort" actions, to allow preserving the "selections"
        //   pre-sort and re-applying them after the TBODY has been sorted and displayed
        //
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 390);
this._eventHandles.selector.push( this.data.before('*:reset', Y.bind('_beforeResetDataSelect', this) ) );
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 391);
this._eventHandles.selector.push( this.data.after('*:reset', Y.bind('_afterResetDataSelect', this) ) );

        // track click modifier keys from last click, this is the tempalte
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 394);
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
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_highlightChange", 405);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 406);
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
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_selectedChange", 418);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 420);
var keepPrev, keepRange;
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 421);
if ( Y.UA.os.search('macintosh') === 0 )
            {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 422);
keepPrev =  this.get('selectionMulti') === true && this._clickModifiers.metaKey === true;}
         else
            {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 424);
keepPrev =  this.get('selectionMulti') === true && this._clickModifiers.ctrlKey === true;}

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 426);
keepRange = this.get('selectionMulti') === true && this._clickModifiers.shiftKey === true;

        // clear any SHIFT selected text first ...
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 429);
this._clearDOMSelection();

        // if not-multi mode and more than one selection, clear them first ...
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 432);
if ( !keepPrev && !keepRange && this._selections.length>1 ) {this.clearSelections();}

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 434);
if ( keepRange ) {

            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 436);
this._processRange(o);

        }  else {

            // Process the action ... updating 'select' class
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 441);
var tar = this._processNodeAction(o,'select', !keepPrev );

            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 443);
if ( !keepPrev ) {this._selections = [];}
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 444);
this._selections.push(tar);

        }

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 448);
this.fire('selected',{
            ochange: o,
            record: this.getRecord(o.newVal)
        });

    },

    /**
     * Called when a "range" selection is detected (i.e. SHIFT key held during click) that selects
     * a range of TD's or TR's (depending on [selectionMode](#attr_selectionMode) setting.
     *
     * @method _processRange
     * @param {Node} o Last clicked TD of range selection
     * @private
     */
    _processRange: function(o) {
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_processRange", 463);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 464);
var tarNew  = o.newVal,
            tarPrev = o.prevVal || null;

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 467);
if ( tarNew && tarPrev ) {
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 468);
var newRec  = this.getRecord(tarNew),
                newRecI = this.data.indexOf(newRec),
                newCol  = this.getColumnNameByTd(tarNew),
                newColI = this.get('columns').indexOf( this.getColumn(newCol)),
                prevRec  = this.getRecord(tarPrev),
                prevRecI = this.data.indexOf(prevRec),
                prevCol  = this.getColumnNameByTd(tarPrev),
                prevColI = this.get('columns').indexOf( this.getColumn(prevCol));

            // Calculate range offset ... delCol (horiz) and delRow (vertically)
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 478);
var delCol = newColI - prevColI,
                delRow = newRecI - prevRecI;

            // if we have valid deltas, update the range cells.
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 482);
if ( delCol !== null && delRow !== null) {

                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 484);
if (Y.Lang.isArray(this._selections) ) {
                    _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 485);
this.clearSelections();
                }

                // Select a range of CELLS (i.e. TD's) ...
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 489);
if ( this.get('selectionMode') === 'cell' ) {
                    _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 490);
var coldir = (delCol<0) ? -1 : 1,
                        rowdir = (delRow<0) ? -1 : 1,
                        cell = tarPrev;

                    _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 494);
for(var j=0; j<=Math.abs(delRow); j++)
                        {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 495);
for(var i=0; i<=Math.abs(delCol); i++) {
                            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 496);
cell = this.getCell(tarPrev,[rowdir*(j),coldir*(i)]);
                            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 497);
if (cell) {
                                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 498);
cell.addClass(this._classSelected);
                                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 499);
this._selections.push(cell);
                            }
                        }}
                // Select a range of ROWS (i.e. TR's)
                } else {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 503);
if ( this.get('selectionMode') === 'row' ) {

                    _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 505);
var rowdir = (delRow<0) ? -1 : 1,
                        tr = this.getRow(prevRecI);

                    _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 508);
for(var j=0; j<=Math.abs(delRow); j++) {
                        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 509);
tr = this.getRow(prevRecI+rowdir*(j));
                        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 510);
if (tr) {
                            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 511);
tr.addClass(this._classSelected);
                            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 512);
this._selections.push(tr);
                        }
                    }

                }}

            }

        }

    },

    /**
     * @event selected
     * @param {Object} obj Return object
     * @param {Object} obj.ochange Change event object passed from attribute 'selected'
     * @param {Object} obj.record DataTable record (Y.Model) instance for the selection
     */

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
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_getSelectedRows", 547);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 548);
var trs  = [],
            rows = [],
            tr, rec;
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 551);
Y.Array.each(this._selections,function(item){
            _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "(anonymous 6)", 551);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 552);
tr = ( item.get('tagName').toLowerCase() === 'tr' ) ? item : item.ancestor('tr');
            // if and only if, it's a TR and not in "trs" array ... then add it
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 554);
if ( tr.get('tagName').toLowerCase() === 'tr' && trs.indexOf(tr) === -1) {
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 555);
rec = this.data.getByClientId(tr.getData('yui3-record'));
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 556);
trs.push(tr);
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 557);
rows.push({
                    tr:     tr,   // this is an OLD, stale TR from pre-sort
                    record: rec,
                    recordIndex: this.data.indexOf(rec)
                });
            }
        },this);
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 564);
return rows;
    },



    /**
     * Getter method that returns an Array of the selected cells in record/column coordinate format.
     * If rows or TR elements were selected, it adds all of the row's child TD's.
     *
     * **Returned** `cells` {Array} of objects in format;
     * <ul>
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
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_getSelectedCells", 586);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 587);
var cells = [],
            cols  = this.get('columns'),
            col, tr, rec;

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 591);
Y.Array.each(this._selections,function(item){
            _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "(anonymous 7)", 591);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 592);
if (!item) {return;}
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 593);
if ( item.get('tagName').toLowerCase() === 'td' ) {
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 594);
col = this.getColumnByTd(item);
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 595);
tr  = item.ancestor("tr");
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 596);
rec = this.data.getByClientId(tr.getData('yui3-record'));

                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 598);
cells.push({
                    record:     rec,
                    recordIndex: this.data.indexOf(rec),
                    column:     col,
                    columnName: col.key || col.name,
                    columnIndex: cols.indexOf(col)
                });
            } else {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 605);
if ( item.get('tagName').toLowerCase() === 'tr' ) {
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 606);
tr = item;
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 607);
rec = this.data.getByClientId(tr.getData('yui3-record'));
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 608);
var tdNodes = tr.all("td");
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 609);
if ( tdNodes ) {
                    _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 610);
tdNodes.each(function(td){
                        //cells.push( {record:this.getRecord(item), column:this.getColumnByTd(item) } )
                        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "(anonymous 8)", 610);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 612);
col = this.getColumnByTd(td);
                        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 613);
cells.push({
                            record:     rec,
                            recordIndex: this.data.indexOf(rec),
                            column:     col,
                            columnName: col.key || col.name,
                            columnIndex: cols.indexOf(col)
                        });
                    },this);
                }
            }}
        },this);
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 624);
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
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_setSelectedCells", 638);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 639);
this._selections = [];
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 640);
if ( Y.Lang.isArray(val) && this.data.size() > val.length ) {
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 641);
Y.Array.each(val,function(item) {
                _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "(anonymous 9)", 641);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 642);
var row, col, td;
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 643);
if ( item.record ) {row = this.getRow( item.record );}
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 644);
if ( item.column ) {col = this.getColumn(item.column);}

                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 646);
if ( row && col ) {
                    _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 647);
var ckey = col.key || col.name;
                    _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 648);
if ( ckey ) {
                        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 649);
td = row.one('.'+this.getClassName('col')+'-'+ckey);
                        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 650);
this._selections.push(td);
                        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 651);
td.addClass(this._classSelected);
                    }
                }

            },this);
        }
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 657);
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
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_setSelectedRows", 670);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 671);
this._selections = [];
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 672);
if ( Y.Lang.isArray(val) && this.data.size() > val.length ) {
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 673);
Y.Array.each(val,function(item){
                _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "(anonymous 10)", 673);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 674);
var tr = this.getRow(item);
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 675);
if ( tr ) {
                    _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 676);
this._selections.push( tr );
                    _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 677);
tr.addClass(this._classSelected);
                }
            },this);
        }
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 681);
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
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_beforeResetDataSelect", 692);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 693);
if( !this._selections || this._selections.length === 0 ) {return;}

        // Save a copy of the current pre-sort rows and/or cells ...
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 696);
var rows  = this.get('selectedRows'),   // array as {record,tr}
            cells = this.get('selectedCells'),  // array as {record,td,column,columnIndex,columnName}
            tr, td;

        // Clear out the selections, reset selected and remove "selected" CSS on table
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 701);
this._selections = [];
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 702);
this.set('selected',null);
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 703);
this._clearAll(this._classSelected);

        //
        //  Loop over all of the rows or cells (depending on mode),
        //    and push a temporary record to the _selections array,
        //    to be used in _afterResetDataSelect to reconstruct selections
        //
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 710);
if( this.get('selectionMode') === 'row' && rows && rows.length > 0 ) {

            // Push the Model data only to the _selections array ...
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 713);
Y.Array.each(rows,function(r){
                _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "(anonymous 11)", 713);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 714);
if ( r && r.record )
                    {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 715);
this._selections.push( r.record );}
            },this);

        } else {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 718);
if ( this.get('selectionMode') === 'cell' && cells && cells.length > 0 ) {

            // Push the Model data and column index only to the _selections array
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 721);
Y.Array.each(cells,function(r){
                _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "(anonymous 12)", 721);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 722);
if(r && r.record && r.columnIndex)
                    {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 723);
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
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_afterResetDataSelect", 740);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 741);
if( !this._selections || this._selections.length === 0 ) {return;}
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 742);
var tr, td;
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 743);
var buffer = [];

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 745);
Y.Array.each(this._selections,function(item){
            _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "(anonymous 13)", 745);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 746);
if( this.get('selectionMode') === 'row' && item ) {
                // the "item" is a Model pushed prior to the "sort" action ...
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 748);
tr = this.getRow(item);
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 749);
if( tr ){
                    _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 750);
buffer.push(tr);
                    _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 751);
tr.addClass(this._classSelected);
                }
            } else {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 753);
if (this.get('selectionMode') === 'cell' && item ) {
                // the item is an object as {record,colIndex} pushed prior to "sort" action ...
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 755);
tr = this.getRow(item.record),
                td = (tr) ? tr.all("td").item(item.colIndex) : null;
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 757);
if(tr && td) {
                    _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 758);
buffer.push(td);
                    _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 759);
td.addClass(this._classSelected);
                }
            }}
        },this);

        // swap out the temporary buffer, for the current selections ...
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 765);
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
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_processNodeAction", 782);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 783);
var tar = o.newVal,
            tarNew, tarPrev, modeName, className;

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 786);
if ( prefix === 'highlight') {
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 787);
modeName  = prefix + 'Mode';
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 788);
className = this._classHighlight;
        } else {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 789);
if ( prefix === 'select' ) {
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 790);
modeName  = 'selectionMode';
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 791);
className = this._classSelected;
        }}

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 794);
if ( this.get(modeName) == "cell" ) {
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 795);
tarNew  = tar || null;
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 796);
tarPrev = o.prevVal || null;
        } else {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 797);
if ( this.get(modeName) == "row" ) {
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 798);
if ( tar ) {
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 799);
tarNew = (tar.get('tagName').search(/td/i) === 0 ) ? tar.ancestor('tr') : ( tar.get('tagName').search(/tr/i) === 0 ) ? tar : null ;
            }
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 801);
tarPrev = o.prevVal;
            _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 802);
if (tarPrev)
                {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 803);
tarPrev = (tarPrev.get('tagName').search(/td/i) === 0 ) ? tarPrev.ancestor('tr') : ( tarPrev.get('tagName').search(/tr/i) === 0 ) ? tarPrev : null ;}
        }}

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 806);
if ( tarPrev && erasePrev )  {tarPrev.removeClass(className);}
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 807);
if ( tarNew ) {tarNew.addClass(className);}

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 809);
return tarNew;
    },


    /**
     * Method removes the specified `type` CSS class from all nodes within the TBODY data node.
     * @method _clearAll
     * @param {String} type Class name to remove from all nodes attached to TBODY DATA
     * @private
     */
    _clearAll: function(type){
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_clearAll", 819);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 820);
var nodes = this.get('boundingBox').one("."+this.getClassName('data'));
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 821);
if ( nodes )
            {_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 822);
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
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_setHighlightMode", 836);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 837);
if ( this._eventHandles.selectorHighlight ) {this._eventHandles.selectorHighlight.detach();}
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 838);
this._eventHandles.selectorHighlight = this.delegate("mouseover",function(e){
                _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "(anonymous 14)", 838);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 839);
var tar = e.currentTarget;
                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 840);
this.set('highlighted',tar);
            },"tr td",this);

        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 843);
this._clearAll(this._classHighlight);
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 844);
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
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_setSelectionMode", 858);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 859);
var oSelf = this;
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 860);
if ( this._eventHandles.selectorSelect ) {this._eventHandles.selectorSelect.detach();}
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 861);
this._eventHandles.selectorSelect = this.delegate("click",function(e){
                _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "(anonymous 15)", 861);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 862);
var tar = e.currentTarget;

                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 864);
e.halt(true);

                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 866);
oSelf._clickModifiers = {
                    ctrlKey:  e.ctrlKey,
                    altKey:   e.altKey,
                    metaKey:  e.metaKey,
                    shiftKey: e.shiftKey,
                    which:    e.which,
                    button:   e.button
                };

                _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 875);
oSelf.set('selected',tar);

            },"tr td",oSelf);
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 878);
this._clearAll(this._classSelected);
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 879);
return val;
    },

    /**
     * Helper method to clear DOM "selected" text or ranges
     * @method _clearDOMSelection
     * @private
     */
    _clearDOMSelection: function(){
        _yuitest_coverfunc("/build/gallery-datatable-selection/gallery-datatable-selection.js", "_clearDOMSelection", 887);
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 888);
var sel = (Y.config.win.getSelection) ? Y.config.win.getSelection() : (Y.config.doc.selection) ? Y.config.doc.selection : null;
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 889);
if ( sel && sel.empty ) {sel.empty();}    // works on chrome
        _yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 890);
if ( sel && sel.removeAllRanges ) {sel.removeAllRanges();}    // works on FireFox
    }

});

_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 895);
Y.DataTable.Selection = DtSelection;
_yuitest_coverline("/build/gallery-datatable-selection/gallery-datatable-selection.js", 896);
Y.Base.mix(Y.DataTable, [Y.DataTable.Selection]);


}, 'gallery-2012.09.05-20-01' ,{skinnable:true, requires:['base-build','datatable-base','event']});
