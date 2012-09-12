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
_yuitest_coverage["/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js",
    code: []
};
_yuitest_coverage["/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js"].code=["YUI.add('gallery-datatable-checkbox-select', function(Y) {","","/**","A DataTable class extension that adds capability to provide a \"checkbox\" (INPUT[type=checkbox]) selection","capability via a new column, which includes \"select all\" checkbox in the TH.  The class uses only a few","defined attributes to add the capability.","","This extension works with sorted data and with paginated DataTable (via Y.DataTable.Paginator), by retaining","a set of \"primary keys\" for the selected records.","","Users define the \"primary keys\" by either setting a property flag of \"primaryKey:true\" in the DataTable","column configuration OR by setting the [primaryKeys](#attr_primaryKeys) attribute.","","To enable the \"checkbox\" selection, set the attribute [checkboxSelectMode](#attr_checkboxSelectMode) to true,","which will add a new column as the first column and sets listeners for checkbox selections.","","To retrieve the \"checkbox\" selected records, the attribute [checkboxSelected](#attr_checkboxSelected) can be","queried to return an array of objects of selected records (See method [_getCheckboxSelected](#method__getCheckboxSelected))","for details.","","####Usage","		var dtable = new Y.DataTable({","		    columns: 	['port','pname', 'ptitle'],","		    data: 		ports,","		    scrollable: 'y',","		    height: 	'250px',","		","		// define two primary keys and enable checkbox selection mode ...","		    primaryKeys:		[ 'port', 'pname' ],","		    checkboxSelectMode:	true","		","		}).render(\"#dtable\");","		"," @module DataTable"," @submodule Selection	"," @class Y.DataTable.CheckboxSelect"," @extends Y.DataTable"," @author Todd Smith"," @version 1.0.0"," @since 3.6.0"," **/","DtCheckboxSelect = function(){};","","Y.mix( DtCheckboxSelect.prototype, {","","    /**","     * Holder for the EventHandle for the \"select all\" INPUT[checkbox] click handler in the TH","     * (set via delegate in _bindCheckboxSelect)","     * @property _subscrChkAll","     * @type Array","     * @default null","     * @private","     */","    _subscrChkAll: null,","","","    /**","     * Holder for the EventHandle for the individual INPUT[checkbox]'s click handler within each TR","     * (set via delegate in _bindCheckboxSelect)","     * @property _subscrChk","     * @type Array","     * @default null","     * @private","     */","    _subscrChk: null,","","","    /**","     * Placeholder for the \"checkbox\" currently selected records, stored in 'primary key value' format.","     * @property _chkRecords","     * @type Array","     * @default []","     * @private","     */","    _chkRecords: [],","","","    /**","     * HTML template for creation of the TH column of the \"checkbox\" select column.","     * @property tmplTH","     * @type String","     * @default '<input type=\"checkbox\" class=\"{className}\" title=\"{columnTitleTH}\"/>'","     * @public","     */","    tmplTH:     '<input type=\"checkbox\" class=\"{className}\" title=\"{columnTitleTH}\"/>',","","","    /**","     * Key name of the \"checkbox\" select column that is added to DataTable's column configurations","     * @property colSelect","     * @type String","     * @default 'chkSelect'","     * @public","     */","    colSelect:  'chkSelect',","","//====================   LIFECYCLE METHODS   ============================","","    /**","     * Initializer, doesn't really do anything at this point ...","     * @method initializer","     * @return {*}","     * @protected","     */","    initializer: function(){","","        // Currently, this doesn't do much ... see _bindCheckboxSelect","","//        if(this.get('checkboxSelect'))","//        this._subscr.push( this.on('sort',this._afterSortEventChk) );","        return this;","    },","","    /**","     * Unbinds the checkbox listeners and detaches any others created","     * @method destructor","     * @protected","     */","    destructor:function(){","        this._unbindCheckboxSelect();","        this._chkRecords = null;","    },","","","//====================   PUBLIC METHODS   ============================","","    /**","     Method that selects all \"checkboxes\" to checked, adds all records to the selected records and","     checks the \"Select All\" checkbox.","     @method checkboxSelectAll","     @public","     **/","    checkboxSelectAll: function(){","","        // Reset and push all pk vals as selected","        this._chkRecords = [];","        this.data.each(function(r){","            var pks = this._getPKValues(r);","            if(pks) this._chkRecords.push(pks);","        },this);","","        // Update all of the the INPUTs","        this._uiCheckboxSetEach(true);","","        // Set the \"select all\" checkbox to checked ...","        this._uiAllChecksSet(true);","","        this.fire('checkboxSetAll');","    },","","    /**","     * Fires after the \"select all\" checkbox is clicked and all records are selected","     * @event checkboxSetAll","     */","","    /**","     Method that resets all \"checkboxes\" to unchecked, zeros the selected records and","     unchecks the \"Select All\" checkbox.","     @method checkboxClearAll","     @public","     **/","    checkboxClearAll: function() {","        this._chkRecords = [];","","        // turn off all individual checkboxes ...","        this._uiCheckboxSetEach(false);","","        // Set the \"select all\" checkbox to unchecked ...","        this._uiAllChecksSet(false);","","        this.fire('checkboxClearAll');","    },","","    /**","     * Fires after the \"select all\" checkbox is clicked and all records are cleared","     * @event checkboxclearAll","     */","","//====================   PRIVATE METHODS   ============================","","	/**","	 Method that sets \"click\" events (via DataTable .delegate) on the INPUT[checkbox]'s for each ","	 row TR and for the \"select all\" checkbox.","	 @method _bindCheckboxSelect","	 @private","	 **/","    _bindCheckboxSelect: function(){","        this._subscrChk = this.delegate(\"click\",this._onCheckboxSelect,\"tr .\"+this.getClassName(\"checkbox\",\"select\"),this);","        this._subscrChkAll = this.delegate(\"click\",this._onCheckboxSelectAll,\".\"+this.getClassName(\"checkbox\",\"select\",\"all\"),this);","    },","","	/**","	 Method to detach all of the listeners created by this class","	 @method _unbindCheckboxSelect","	 @private","	 **/","    _unbindCheckboxSelect: function(){","        if(this._subscrChk) this._subscrChk.detach();","        this._subscrChk = null;","        if(this._subscrChkAll) this._subscrChkAll.detach();","        this._subscrChkAll = null;","    },","","	/**","	 Enables this class, by clearing the selected records, creating the UI elements and adding checkbox listeners.","	 @method _enableCheckboxSelect","	 @private","	 **/","    _enableCheckboxSelect: function(){","        this._chkRecords = [];","        this._uiAddCheckboxTH();","        this._bindCheckboxSelect();","    },","","	/**","	 Disables this class, by clearing all selectors and remove the UI element and detaching listeners","	 @method _enableCheckboxSelect","	 @private","	 **/","    _disableCheckboxSelect: function(){","        this.checkboxClearAll();","        this._uiRemoveCheckboxTH();","        this._unbindCheckboxSelect();","    },","","	/**","	 Setter method for attribute (checkboxSelectMode)[#attr_checkboxSelectMode] that toggles this extension on/off","	 @method _setCheckboxSelectMode","	 @private","	 **/","    _setCheckboxSelectMode: function(val){","        if(val) {","            this._enableCheckboxSelect();","        } else {","            this._disableCheckboxSelect();","        }","    },","","","    /**","     Getter method for [checkboxSelected](#attr_checkboxSelected) attribute, that returns the currently \"checkbox\" selected","     rows, returned as an array of {Object}s containing members {tr,record,pkvalues}.","	 <br/><br/><b>Returns:</b> {Array} of {Objects} selected for each row as;","	 <ul>","	 <li>`selected.tr` : TR Node for the checkbox selected row</li>","	 <li>`selected.record` : Model instance for the selected data record</li>","	 <li>`selected.pkvalues` Primary key value settings for the selected record (single value or {Object} if more than one primary key is set)</li>","	 </ul>","	 ","     @method _getCheckboxSelected","     @return See above","     @private","     **/","    _getCheckboxSelected: function(){","        var recs = [];","        Y.Array.each( this._chkRecords, function(pk){","            var rec = this._getRecordforPKvalue(pk);","            recs.push({","                tr:     this.getRow(rec),","                record: rec,","                pkvalues: pk","            });","        },this);","","        return recs;","    },","","    /**","     Setter method for [checkboxSelected](#attr_checkboxSelected) attribute, currently only supports on input an","     Array of record indices that should be initially \"checkbox\" selected.","","     TODO:  Need to add initial selections as \"primary key\" values","","     @method _setCheckboxSelected","     @param {Array} rows Array of row indices to initially set as \"checked\"","     @return {*}","     @private","     **/","    _setCheckboxSelected: function(rows){","        if(!Y.Lang.isArray(rows)) return false;","","        this.checkboxClearAll();","","        var recs = [], tr, rec, pkv, inp;","","        Y.Array.each( rows, function(ri) {","","            rec = this.data.item(ri);","            pkv = this._getPKValues(rec);","            tr  = this.getRow(rec);","","            if(rec && pkv) {","                this._chkRecords.push( pkv );","                inp = tr.one('.'+this.getClassName(\"checkbox\",\"select\"));","                if (inp) inp.set('checked',true);","            }","        },this);","","        return rows;","    },","","    /**","     Method that returns a boolean flag indicating whether the entered record represents","     a record that is currently selected (i.e. in this._chkRecords).","","     This is principally used by the formatter function for the checkbox column.","","     @method _getCheckboxSelectedFlag","     @param rec","     @return {Boolean} selected Either \"true\" or \"false\" depending on whether the entered row is currently \"checked\"","     @private","     **/","    _getCheckboxSelectedFlag: function(rec) {","        var pks = this._getPKValues(rec),","            rtn = false;","","        if(Y.Lang.isObject(pks) )","            rtn = this._indexOfObjMatch(this._chkRecords,pks);","        else","            rtn = Y.Array.indexOf(this._chkRecords,pks);","","        return (rtn !== -1) ? true : false;","    },","","","    /**","     Click handler for the added in the checkbox select INPUT[checkbox]","     @method _onCheckboxSelect","     @param {EventTarget} e","     @private","     **/","    _onCheckboxSelect: function(e){","        var chkTar = e.target,                  // the INPUT[checkbox] that triggered this","            tr     = chkTar.ancestor('tr'),     // the clicked TR","            rec    = this.getRecord(tr),        // the Model corresponding to the clicked TR","            pkv    = this._getPKValues(rec);    // primary key value object, either an individual value or an object value","","        // If this change makes it \"checked\", then add the \"pkv\" to the _chkRecords array","        if(e.target.get('checked')) {","            this._chkRecords.push(pkv);","        } else {","        // The user \"un-checked\" this record, remove it from _chkRecords ...","","            // The wonky but works amazingly well method to remove one element!","            var vals = [];","            Y.Array.each(this._chkRecords,function(s){","                if( s !== pkv ) vals.push(s);","            });","            this._chkRecords = vals;","        }","    },","","    /**","     Click handler for the TH \"check ALL\" INPUT[checkbox]","     @method _onCheckboxSelectAll","     @param {EventTarget} e","     @private","     **/","    _onCheckboxSelectAll: function(e){","        var chkTar = e.target,","            tr     = chkTar.ancestor('tr'),","            rec    = this.getRecord(tr);","","        if(e.target.get('checked'))","            this.checkboxSelectAll();","        else","            this.checkboxClearAll();","    },","","    /**","     Adds a new Column with the TH element","     @method _uiAddCheckboxTH","     @private","     **/","    _uiAddCheckboxTH: function(){","","        // Define a new \"select\" column ....","        var colSel = {","            key:        this.colSelect,","","            allowHTML:  true,","            label:      Y.Lang.sub( this.tmplTH,{","                className:      this.getClassName(\"checkbox\",\"select\",\"all\"),","                columnTitleTH:  \"Select ALL records\"","            }),","","            formatter:  function(o) {","                var chkd = ( this._getCheckboxSelectedFlag(o.record) ) ? \"checked\" : \"\";","                o.value = '<input type=\"checkbox\" class=\"' + this.getClassName(\"checkbox\",\"select\") + '\" ' + chkd + '/>';","                o.className += ' center';","             }","        };","","        // Retrieve the columns, and add the new column at the first index location ...","        var cols = this.get('columns');","","        // only add this column if it is nonexistent in the column already ...","        if(!this.getColumn(this.colSelect) ) {","            this.addColumn(colSel,0);","            this.syncUI();","        }","","    },","","    /**","     Removes the \"checkbox\" select column from the DataTable columns attribute","     @method _uiRemoveCheckboxTH","     @private","     **/","    _uiRemoveCheckboxTH: function(){","        this.removeColumn(this.colSelect);","        this.syncUI();","    },","","    /**","     Method that updates the UI on each record's INPUT[checkbox] and sets them to the entered setting (true,false).","     @method _uiCheckboxSetEach","     @param {Boolean} bool Flag indicating whether checks should be set or not","     @private","     **/","    _uiCheckboxSetEach: function(bool){","        var inps = this.get('srcNode').all(\".\"+this.getClassName(\"data\") + \" .\"+this.getClassName(\"checkbox\",\"select\"));","        inps.each(function(n){","            n.set('checked',bool);","        });","","    },","","    /**","     Method that updates the UI on the \"select all\" INPUT[checkbox] and sets it to the entered setting (true,false).","     @method _uiCheckboxSetEach","     @param {Boolean} bool Flag indicating whether the check should be set or not","     @private","     **/","    _uiAllChecksSet: function(bool){","        var sa = this.get('srcNode').one(\".\"+this.getClassName(\"checkbox\",\"select\",\"all\"));","        if (sa) sa.set('checked',bool);","    },","","","//------------   Primary Key functions  --------------","","    /**","     Default value method for the (primaryKeys)[#attr_primaryKeys] attribute.  This method will search","     the defined DataTable \"columns\" attribute array and loop over each column, if a column has a","     property \"primaryKey\" that column will be added as a primary key.","     @example","            var cols = [ {key:'cust_id', label:'Cust ID', primaryKey:true},","                    {key:'ord_date', label:'Order Date'},","                    {key:'ord_id', label:'Order ID', primaryKey:true}","                    ....","                ];","            // will result in ATTR \"primaryKeys\" as [ 'cust_id', 'ord_id' ]","","     @method _valPrimaryKeys","     @return {Array}","     @private","     **/","    _valPrimaryKeys: function(){","        var cols = this.get('columns'),","            pks = [];","","        Y.Array.each(cols,function(c){","            if( c && c.primaryKey && c.primaryKey === true) {","                var ckey = c.key || c.name || null;","                if(ckey) {","                    pks.push(ckey);","                }","            }","        });","        return pks;","    },","","    /**","     Setter method for the the (primaryKeys)[#attr_primaryKeys] attribute, where the input values can be","     either (a) a single {String} column key name or (b) an {Array} of column key names in {String} format.","","     NOTE: If this attribute is set, it will over-ride any \"primaryKey\" entries from the \"columns\".","","     @method _setPrimaryKeys","     @param {String|Array} pkn Column key (or column name) entries, either a single {String} name or an array of {Strings}","     @return {*}","     @private","     **/","    _setPrimaryKeys: function(pkn){","","        if (Y.Lang.isArray(pkn))","            pks = pkn;","        else if (Y.Lang.isString(pkn))","            pks = [ pkn ];","","        return pks;","    },","","","    /**","     Returns the corresponding record (Model) for the entered primary key setting (pkv),","     where pkv can be either a single value or an object (for multiple primary keys).","","     @method _getRecordforPKvalue","     @param {Number|String|Date|Object} pkv Primary key setting to search ModelList for","     @return {Model} record Returns the record (Model) that corresponds to the key setting in pkv","     @private","     **/","    _getRecordforPKvalue: function(pkv){","        var pkeys = this.get('primaryKeys');","        var recs = this.data.filter(function(r){","            if(Y.Lang.isObject(pkv)) {","                var flag = true;","                Y.Object.each(pkv,function(v,k){","                    if(r.get(k)!== v) flag = false;","                });","                if(flag)","                    return true;","            } else {","                if(r.get(pkeys[0]) === pkv )","                    return true;","            }","        });","        return (recs && recs.length===1)  ? recs[0] : recs;","    },","","    /**","     Method that returns the primary key values for the provided record \"rec\", either as an","     individual value (for a single primary key) or as an {Object} in key:value pairs where the","     key is the primary key name and the value is the value from this record.","","     @example","            // For a record with rec = {cust_id:157, cust_name:'foo', odate:'9/12/2009', ord_no:987}","            this._getPKValues(rec);  // for one primary key \"cust_id\"  RETURNS 157","            this._getPKValues(rec);  // for primary keys \"cust_id\", \"ord_no\"  RETURNS {cust_id:157,ord_no:987}","","     @method _getPKValues","     @param {Model} rec The record Model that the primary key values are requested for","     @return {Mixed|Object} pkv Returns the primary key values as a single value or an object key:value hash","     @private","     **/","    _getPKValues: function(rec){","        var pkeys = this.get('primaryKeys');","        if(!pkeys || !Y.Lang.isArray(pkeys) || !rec) return false;","","        var rtn;","        if( pkeys.length === 1)","            rtn = rec.get(pkeys[0]);","        else {","            rtn = {};","            Y.Array.each(pkeys,function(pk){","                if( pk ) rtn[pk] = rec.get(pk);","            });","        }","        return rtn;","    },","","","    /**","     Function that searches an Array of Objects, looking for a matching partial object as defined by key_vals {Object},","     and returning the index of the first match.","     @method _indexOfObjMatch","     @param arr","     @param key_vals","     @return {Integer} imatch Returned index number of first match, or -1 if none found","     @private","     **/","    _indexOfObjMatch: function(arr,key_vals) {","        if(!Y.Lang.isObject(key_vals) || !Y.Lang.isArray(arr) ) return -1;","        var imatch = -1;","        Y.Array.some(arr,function(item,index){","            var bool = true;","            Y.Object.each(key_vals,function(v,k){","                if(item[k] !== v) bool = false;","            });","            if (bool) {","                imatch = index;","                return true;","            }","        });","","        return imatch;","    }","","});","","DtCheckboxSelect.ATTRS = {","","    /**","     Attribute that is used to trigger \"checkbox\" selection mode, and inserting of a checkbox select","     column to the current DataTable.","","     @attribute checkboxSelectMode","     @type {Boolean}","     @default false","     **/","    checkboxSelectMode: {","        value:      false,","        validator:  Y.Lang.isBoolean,","        setter:     '_setCheckboxSelectMode'","    },","","","    /**","     Attribute that is used to retrieve the \"checkbox\" selected records from the DataTable at any time. ","     ","     Also can be used to set initially \"checked\" records by entering an {Array} of record indices. (See method [_setCheckboxSelected](#method__setCheckboxSelected)).","","     ","     When a `get('checkboxSelected')` is requested, an {Array} of {Objects} containing members as ","     {tr,record,pkvalues} is returned for each checked row. (See method [_getCheckboxSelected](#method__getCheckboxSelected)).","","     @attribute checkboxSelected","     @type {Array}","     @default []","     **/","    checkboxSelected: {","        value:      [],","        validator:  Y.Lang.isArray,","        setter:     '_setCheckboxSelected',","        getter:     '_getCheckboxSelected'","    },","","    /**","     Attribute to set the \"primary keys\" for the DataTable that uniquely define the record (Model) attributes ","     to use to search for specific records.  ","     ","     Primary keys can be defined either with this attribute `primaryKeys` OR by placing an extra object property","     in the DataTable column configuration as \"primaryKey:true\".","     ","     This attribute is more useful in use cases where the primary key is not displayed in a column.","     ","     @example","	 // sets a single primary key to data field with key:'emp_id'","	 myDT.set('primaryKeys','emp_id');       		","		","	 // sets dual primary keys to two data fields with key:'inventory_id' and key:'lot_id'","	 myDT.set('primaryKeys',['inventory_id','lot_id']);  ","	 // OR","	 var myDT = new Y.DataTable({","	 	columns: [ ","	 		{key:'inventory_id', label:'Inventory Code', primaryKey:true},","	 		{key:'item_code', label:'Sales Item'},","	 		{key:'lot_id', label:'Lot Code', primaryKey:true},","	 		...","	 });","     		","     @attribute primaryKeys","     @type {String|Array}","     @default See above","     **/","    primaryKeys: {","        valueFn:    '_valPrimaryKeys',","        setter:     '_setPrimaryKeys'","    }","","};","","Y.DataTable.CheckboxSelect = DtCheckboxSelect;","Y.Base.mix(Y.DataTable, [Y.DataTable.CheckboxSelect]);","","","}, 'gallery-2012.09.12-20-02' ,{requires:['datatable-base','datatable-mutable','event-custom'], skinnable:false});"];
_yuitest_coverage["/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js"].lines = {"1":0,"42":0,"44":0,"111":0,"120":0,"121":0,"136":0,"137":0,"138":0,"139":0,"143":0,"146":0,"148":0,"163":0,"166":0,"169":0,"171":0,"188":0,"189":0,"198":0,"199":0,"200":0,"201":0,"210":0,"211":0,"212":0,"221":0,"222":0,"223":0,"232":0,"233":0,"235":0,"255":0,"256":0,"257":0,"258":0,"265":0,"280":0,"282":0,"284":0,"286":0,"288":0,"289":0,"290":0,"292":0,"293":0,"294":0,"295":0,"299":0,"314":0,"317":0,"318":0,"320":0,"322":0,"333":0,"339":0,"340":0,"345":0,"346":0,"347":0,"349":0,"360":0,"364":0,"365":0,"367":0,"378":0,"388":0,"389":0,"390":0,"395":0,"398":0,"399":0,"400":0,"411":0,"412":0,"422":0,"423":0,"424":0,"436":0,"437":0,"460":0,"463":0,"464":0,"465":0,"466":0,"467":0,"471":0,"487":0,"488":0,"489":0,"490":0,"492":0,"506":0,"507":0,"508":0,"509":0,"510":0,"511":0,"513":0,"514":0,"516":0,"517":0,"520":0,"539":0,"540":0,"542":0,"543":0,"544":0,"546":0,"547":0,"548":0,"551":0,"565":0,"566":0,"567":0,"568":0,"569":0,"570":0,"572":0,"573":0,"574":0,"578":0,"583":0,"655":0,"656":0};
_yuitest_coverage["/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js"].functions = {"initializer:105":0,"destructor:119":0,"(anonymous 2):137":0,"checkboxSelectAll:133":0,"checkboxClearAll:162":0,"_bindCheckboxSelect:187":0,"_unbindCheckboxSelect:197":0,"_enableCheckboxSelect:209":0,"_disableCheckboxSelect:220":0,"_setCheckboxSelectMode:231":0,"(anonymous 3):256":0,"_getCheckboxSelected:254":0,"(anonymous 4):286":0,"_setCheckboxSelected:279":0,"_getCheckboxSelectedFlag:313":0,"(anonymous 5):346":0,"_onCheckboxSelect:332":0,"_onCheckboxSelectAll:359":0,"formatter:387":0,"_uiAddCheckboxTH:375":0,"_uiRemoveCheckboxTH:410":0,"(anonymous 6):423":0,"_uiCheckboxSetEach:421":0,"_uiAllChecksSet:435":0,"(anonymous 7):463":0,"_valPrimaryKeys:459":0,"_setPrimaryKeys:485":0,"(anonymous 9):510":0,"(anonymous 8):507":0,"_getRecordforPKvalue:505":0,"(anonymous 10):547":0,"_getPKValues:538":0,"(anonymous 12):569":0,"(anonymous 11):567":0,"_indexOfObjMatch:564":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js"].coveredLines = 125;
_yuitest_coverage["/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js"].coveredFunctions = 36;
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 1);
YUI.add('gallery-datatable-checkbox-select', function(Y) {

/**
A DataTable class extension that adds capability to provide a "checkbox" (INPUT[type=checkbox]) selection
capability via a new column, which includes "select all" checkbox in the TH.  The class uses only a few
defined attributes to add the capability.

This extension works with sorted data and with paginated DataTable (via Y.DataTable.Paginator), by retaining
a set of "primary keys" for the selected records.

Users define the "primary keys" by either setting a property flag of "primaryKey:true" in the DataTable
column configuration OR by setting the [primaryKeys](#attr_primaryKeys) attribute.

To enable the "checkbox" selection, set the attribute [checkboxSelectMode](#attr_checkboxSelectMode) to true,
which will add a new column as the first column and sets listeners for checkbox selections.

To retrieve the "checkbox" selected records, the attribute [checkboxSelected](#attr_checkboxSelected) can be
queried to return an array of objects of selected records (See method [_getCheckboxSelected](#method__getCheckboxSelected))
for details.

####Usage
		var dtable = new Y.DataTable({
		    columns: 	['port','pname', 'ptitle'],
		    data: 		ports,
		    scrollable: 'y',
		    height: 	'250px',
		
		// define two primary keys and enable checkbox selection mode ...
		    primaryKeys:		[ 'port', 'pname' ],
		    checkboxSelectMode:	true
		
		}).render("#dtable");
		
 @module DataTable
 @submodule Selection	
 @class Y.DataTable.CheckboxSelect
 @extends Y.DataTable
 @author Todd Smith
 @version 1.0.0
 @since 3.6.0
 **/
_yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 42);
DtCheckboxSelect = function(){};

_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 44);
Y.mix( DtCheckboxSelect.prototype, {

    /**
     * Holder for the EventHandle for the "select all" INPUT[checkbox] click handler in the TH
     * (set via delegate in _bindCheckboxSelect)
     * @property _subscrChkAll
     * @type Array
     * @default null
     * @private
     */
    _subscrChkAll: null,


    /**
     * Holder for the EventHandle for the individual INPUT[checkbox]'s click handler within each TR
     * (set via delegate in _bindCheckboxSelect)
     * @property _subscrChk
     * @type Array
     * @default null
     * @private
     */
    _subscrChk: null,


    /**
     * Placeholder for the "checkbox" currently selected records, stored in 'primary key value' format.
     * @property _chkRecords
     * @type Array
     * @default []
     * @private
     */
    _chkRecords: [],


    /**
     * HTML template for creation of the TH column of the "checkbox" select column.
     * @property tmplTH
     * @type String
     * @default '<input type="checkbox" class="{className}" title="{columnTitleTH}"/>'
     * @public
     */
    tmplTH:     '<input type="checkbox" class="{className}" title="{columnTitleTH}"/>',


    /**
     * Key name of the "checkbox" select column that is added to DataTable's column configurations
     * @property colSelect
     * @type String
     * @default 'chkSelect'
     * @public
     */
    colSelect:  'chkSelect',

//====================   LIFECYCLE METHODS   ============================

    /**
     * Initializer, doesn't really do anything at this point ...
     * @method initializer
     * @return {*}
     * @protected
     */
    initializer: function(){

        // Currently, this doesn't do much ... see _bindCheckboxSelect

//        if(this.get('checkboxSelect'))
//        this._subscr.push( this.on('sort',this._afterSortEventChk) );
        _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "initializer", 105);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 111);
return this;
    },

    /**
     * Unbinds the checkbox listeners and detaches any others created
     * @method destructor
     * @protected
     */
    destructor:function(){
        _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "destructor", 119);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 120);
this._unbindCheckboxSelect();
        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 121);
this._chkRecords = null;
    },


//====================   PUBLIC METHODS   ============================

    /**
     Method that selects all "checkboxes" to checked, adds all records to the selected records and
     checks the "Select All" checkbox.
     @method checkboxSelectAll
     @public
     **/
    checkboxSelectAll: function(){

        // Reset and push all pk vals as selected
        _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "checkboxSelectAll", 133);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 136);
this._chkRecords = [];
        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 137);
this.data.each(function(r){
            _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "(anonymous 2)", 137);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 138);
var pks = this._getPKValues(r);
            _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 139);
if(pks) {this._chkRecords.push(pks);}
        },this);

        // Update all of the the INPUTs
        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 143);
this._uiCheckboxSetEach(true);

        // Set the "select all" checkbox to checked ...
        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 146);
this._uiAllChecksSet(true);

        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 148);
this.fire('checkboxSetAll');
    },

    /**
     * Fires after the "select all" checkbox is clicked and all records are selected
     * @event checkboxSetAll
     */

    /**
     Method that resets all "checkboxes" to unchecked, zeros the selected records and
     unchecks the "Select All" checkbox.
     @method checkboxClearAll
     @public
     **/
    checkboxClearAll: function() {
        _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "checkboxClearAll", 162);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 163);
this._chkRecords = [];

        // turn off all individual checkboxes ...
        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 166);
this._uiCheckboxSetEach(false);

        // Set the "select all" checkbox to unchecked ...
        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 169);
this._uiAllChecksSet(false);

        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 171);
this.fire('checkboxClearAll');
    },

    /**
     * Fires after the "select all" checkbox is clicked and all records are cleared
     * @event checkboxclearAll
     */

//====================   PRIVATE METHODS   ============================

	/**
	 Method that sets "click" events (via DataTable .delegate) on the INPUT[checkbox]'s for each 
	 row TR and for the "select all" checkbox.
	 @method _bindCheckboxSelect
	 @private
	 **/
    _bindCheckboxSelect: function(){
        _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "_bindCheckboxSelect", 187);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 188);
this._subscrChk = this.delegate("click",this._onCheckboxSelect,"tr ."+this.getClassName("checkbox","select"),this);
        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 189);
this._subscrChkAll = this.delegate("click",this._onCheckboxSelectAll,"."+this.getClassName("checkbox","select","all"),this);
    },

	/**
	 Method to detach all of the listeners created by this class
	 @method _unbindCheckboxSelect
	 @private
	 **/
    _unbindCheckboxSelect: function(){
        _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "_unbindCheckboxSelect", 197);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 198);
if(this._subscrChk) {this._subscrChk.detach();}
        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 199);
this._subscrChk = null;
        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 200);
if(this._subscrChkAll) {this._subscrChkAll.detach();}
        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 201);
this._subscrChkAll = null;
    },

	/**
	 Enables this class, by clearing the selected records, creating the UI elements and adding checkbox listeners.
	 @method _enableCheckboxSelect
	 @private
	 **/
    _enableCheckboxSelect: function(){
        _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "_enableCheckboxSelect", 209);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 210);
this._chkRecords = [];
        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 211);
this._uiAddCheckboxTH();
        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 212);
this._bindCheckboxSelect();
    },

	/**
	 Disables this class, by clearing all selectors and remove the UI element and detaching listeners
	 @method _enableCheckboxSelect
	 @private
	 **/
    _disableCheckboxSelect: function(){
        _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "_disableCheckboxSelect", 220);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 221);
this.checkboxClearAll();
        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 222);
this._uiRemoveCheckboxTH();
        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 223);
this._unbindCheckboxSelect();
    },

	/**
	 Setter method for attribute (checkboxSelectMode)[#attr_checkboxSelectMode] that toggles this extension on/off
	 @method _setCheckboxSelectMode
	 @private
	 **/
    _setCheckboxSelectMode: function(val){
        _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "_setCheckboxSelectMode", 231);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 232);
if(val) {
            _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 233);
this._enableCheckboxSelect();
        } else {
            _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 235);
this._disableCheckboxSelect();
        }
    },


    /**
     Getter method for [checkboxSelected](#attr_checkboxSelected) attribute, that returns the currently "checkbox" selected
     rows, returned as an array of {Object}s containing members {tr,record,pkvalues}.
	 <br/><br/><b>Returns:</b> {Array} of {Objects} selected for each row as;
	 <ul>
	 <li>`selected.tr` : TR Node for the checkbox selected row</li>
	 <li>`selected.record` : Model instance for the selected data record</li>
	 <li>`selected.pkvalues` Primary key value settings for the selected record (single value or {Object} if more than one primary key is set)</li>
	 </ul>
	 
     @method _getCheckboxSelected
     @return See above
     @private
     **/
    _getCheckboxSelected: function(){
        _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "_getCheckboxSelected", 254);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 255);
var recs = [];
        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 256);
Y.Array.each( this._chkRecords, function(pk){
            _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "(anonymous 3)", 256);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 257);
var rec = this._getRecordforPKvalue(pk);
            _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 258);
recs.push({
                tr:     this.getRow(rec),
                record: rec,
                pkvalues: pk
            });
        },this);

        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 265);
return recs;
    },

    /**
     Setter method for [checkboxSelected](#attr_checkboxSelected) attribute, currently only supports on input an
     Array of record indices that should be initially "checkbox" selected.

     TODO:  Need to add initial selections as "primary key" values

     @method _setCheckboxSelected
     @param {Array} rows Array of row indices to initially set as "checked"
     @return {*}
     @private
     **/
    _setCheckboxSelected: function(rows){
        _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "_setCheckboxSelected", 279);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 280);
if(!Y.Lang.isArray(rows)) {return false;}

        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 282);
this.checkboxClearAll();

        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 284);
var recs = [], tr, rec, pkv, inp;

        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 286);
Y.Array.each( rows, function(ri) {

            _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "(anonymous 4)", 286);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 288);
rec = this.data.item(ri);
            _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 289);
pkv = this._getPKValues(rec);
            _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 290);
tr  = this.getRow(rec);

            _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 292);
if(rec && pkv) {
                _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 293);
this._chkRecords.push( pkv );
                _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 294);
inp = tr.one('.'+this.getClassName("checkbox","select"));
                _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 295);
if (inp) {inp.set('checked',true);}
            }
        },this);

        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 299);
return rows;
    },

    /**
     Method that returns a boolean flag indicating whether the entered record represents
     a record that is currently selected (i.e. in this._chkRecords).

     This is principally used by the formatter function for the checkbox column.

     @method _getCheckboxSelectedFlag
     @param rec
     @return {Boolean} selected Either "true" or "false" depending on whether the entered row is currently "checked"
     @private
     **/
    _getCheckboxSelectedFlag: function(rec) {
        _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "_getCheckboxSelectedFlag", 313);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 314);
var pks = this._getPKValues(rec),
            rtn = false;

        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 317);
if(Y.Lang.isObject(pks) )
            {_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 318);
rtn = this._indexOfObjMatch(this._chkRecords,pks);}
        else
            {_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 320);
rtn = Y.Array.indexOf(this._chkRecords,pks);}

        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 322);
return (rtn !== -1) ? true : false;
    },


    /**
     Click handler for the added in the checkbox select INPUT[checkbox]
     @method _onCheckboxSelect
     @param {EventTarget} e
     @private
     **/
    _onCheckboxSelect: function(e){
        _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "_onCheckboxSelect", 332);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 333);
var chkTar = e.target,                  // the INPUT[checkbox] that triggered this
            tr     = chkTar.ancestor('tr'),     // the clicked TR
            rec    = this.getRecord(tr),        // the Model corresponding to the clicked TR
            pkv    = this._getPKValues(rec);    // primary key value object, either an individual value or an object value

        // If this change makes it "checked", then add the "pkv" to the _chkRecords array
        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 339);
if(e.target.get('checked')) {
            _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 340);
this._chkRecords.push(pkv);
        } else {
        // The user "un-checked" this record, remove it from _chkRecords ...

            // The wonky but works amazingly well method to remove one element!
            _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 345);
var vals = [];
            _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 346);
Y.Array.each(this._chkRecords,function(s){
                _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "(anonymous 5)", 346);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 347);
if( s !== pkv ) {vals.push(s);}
            });
            _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 349);
this._chkRecords = vals;
        }
    },

    /**
     Click handler for the TH "check ALL" INPUT[checkbox]
     @method _onCheckboxSelectAll
     @param {EventTarget} e
     @private
     **/
    _onCheckboxSelectAll: function(e){
        _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "_onCheckboxSelectAll", 359);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 360);
var chkTar = e.target,
            tr     = chkTar.ancestor('tr'),
            rec    = this.getRecord(tr);

        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 364);
if(e.target.get('checked'))
            {_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 365);
this.checkboxSelectAll();}
        else
            {_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 367);
this.checkboxClearAll();}
    },

    /**
     Adds a new Column with the TH element
     @method _uiAddCheckboxTH
     @private
     **/
    _uiAddCheckboxTH: function(){

        // Define a new "select" column ....
        _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "_uiAddCheckboxTH", 375);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 378);
var colSel = {
            key:        this.colSelect,

            allowHTML:  true,
            label:      Y.Lang.sub( this.tmplTH,{
                className:      this.getClassName("checkbox","select","all"),
                columnTitleTH:  "Select ALL records"
            }),

            formatter:  function(o) {
                _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "formatter", 387);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 388);
var chkd = ( this._getCheckboxSelectedFlag(o.record) ) ? "checked" : "";
                _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 389);
o.value = '<input type="checkbox" class="' + this.getClassName("checkbox","select") + '" ' + chkd + '/>';
                _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 390);
o.className += ' center';
             }
        };

        // Retrieve the columns, and add the new column at the first index location ...
        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 395);
var cols = this.get('columns');

        // only add this column if it is nonexistent in the column already ...
        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 398);
if(!this.getColumn(this.colSelect) ) {
            _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 399);
this.addColumn(colSel,0);
            _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 400);
this.syncUI();
        }

    },

    /**
     Removes the "checkbox" select column from the DataTable columns attribute
     @method _uiRemoveCheckboxTH
     @private
     **/
    _uiRemoveCheckboxTH: function(){
        _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "_uiRemoveCheckboxTH", 410);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 411);
this.removeColumn(this.colSelect);
        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 412);
this.syncUI();
    },

    /**
     Method that updates the UI on each record's INPUT[checkbox] and sets them to the entered setting (true,false).
     @method _uiCheckboxSetEach
     @param {Boolean} bool Flag indicating whether checks should be set or not
     @private
     **/
    _uiCheckboxSetEach: function(bool){
        _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "_uiCheckboxSetEach", 421);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 422);
var inps = this.get('srcNode').all("."+this.getClassName("data") + " ."+this.getClassName("checkbox","select"));
        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 423);
inps.each(function(n){
            _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "(anonymous 6)", 423);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 424);
n.set('checked',bool);
        });

    },

    /**
     Method that updates the UI on the "select all" INPUT[checkbox] and sets it to the entered setting (true,false).
     @method _uiCheckboxSetEach
     @param {Boolean} bool Flag indicating whether the check should be set or not
     @private
     **/
    _uiAllChecksSet: function(bool){
        _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "_uiAllChecksSet", 435);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 436);
var sa = this.get('srcNode').one("."+this.getClassName("checkbox","select","all"));
        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 437);
if (sa) {sa.set('checked',bool);}
    },


//------------   Primary Key functions  --------------

    /**
     Default value method for the (primaryKeys)[#attr_primaryKeys] attribute.  This method will search
     the defined DataTable "columns" attribute array and loop over each column, if a column has a
     property "primaryKey" that column will be added as a primary key.
     @example
            var cols = [ {key:'cust_id', label:'Cust ID', primaryKey:true},
                    {key:'ord_date', label:'Order Date'},
                    {key:'ord_id', label:'Order ID', primaryKey:true}
                    ....
                ];
            // will result in ATTR "primaryKeys" as [ 'cust_id', 'ord_id' ]

     @method _valPrimaryKeys
     @return {Array}
     @private
     **/
    _valPrimaryKeys: function(){
        _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "_valPrimaryKeys", 459);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 460);
var cols = this.get('columns'),
            pks = [];

        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 463);
Y.Array.each(cols,function(c){
            _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "(anonymous 7)", 463);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 464);
if( c && c.primaryKey && c.primaryKey === true) {
                _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 465);
var ckey = c.key || c.name || null;
                _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 466);
if(ckey) {
                    _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 467);
pks.push(ckey);
                }
            }
        });
        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 471);
return pks;
    },

    /**
     Setter method for the the (primaryKeys)[#attr_primaryKeys] attribute, where the input values can be
     either (a) a single {String} column key name or (b) an {Array} of column key names in {String} format.

     NOTE: If this attribute is set, it will over-ride any "primaryKey" entries from the "columns".

     @method _setPrimaryKeys
     @param {String|Array} pkn Column key (or column name) entries, either a single {String} name or an array of {Strings}
     @return {*}
     @private
     **/
    _setPrimaryKeys: function(pkn){

        _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "_setPrimaryKeys", 485);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 487);
if (Y.Lang.isArray(pkn))
            {_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 488);
pks = pkn;}
        else {_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 489);
if (Y.Lang.isString(pkn))
            {_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 490);
pks = [ pkn ];}}

        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 492);
return pks;
    },


    /**
     Returns the corresponding record (Model) for the entered primary key setting (pkv),
     where pkv can be either a single value or an object (for multiple primary keys).

     @method _getRecordforPKvalue
     @param {Number|String|Date|Object} pkv Primary key setting to search ModelList for
     @return {Model} record Returns the record (Model) that corresponds to the key setting in pkv
     @private
     **/
    _getRecordforPKvalue: function(pkv){
        _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "_getRecordforPKvalue", 505);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 506);
var pkeys = this.get('primaryKeys');
        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 507);
var recs = this.data.filter(function(r){
            _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "(anonymous 8)", 507);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 508);
if(Y.Lang.isObject(pkv)) {
                _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 509);
var flag = true;
                _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 510);
Y.Object.each(pkv,function(v,k){
                    _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "(anonymous 9)", 510);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 511);
if(r.get(k)!== v) {flag = false;}
                });
                _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 513);
if(flag)
                    {_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 514);
return true;}
            } else {
                _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 516);
if(r.get(pkeys[0]) === pkv )
                    {_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 517);
return true;}
            }
        });
        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 520);
return (recs && recs.length===1)  ? recs[0] : recs;
    },

    /**
     Method that returns the primary key values for the provided record "rec", either as an
     individual value (for a single primary key) or as an {Object} in key:value pairs where the
     key is the primary key name and the value is the value from this record.

     @example
            // For a record with rec = {cust_id:157, cust_name:'foo', odate:'9/12/2009', ord_no:987}
            this._getPKValues(rec);  // for one primary key "cust_id"  RETURNS 157
            this._getPKValues(rec);  // for primary keys "cust_id", "ord_no"  RETURNS {cust_id:157,ord_no:987}

     @method _getPKValues
     @param {Model} rec The record Model that the primary key values are requested for
     @return {Mixed|Object} pkv Returns the primary key values as a single value or an object key:value hash
     @private
     **/
    _getPKValues: function(rec){
        _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "_getPKValues", 538);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 539);
var pkeys = this.get('primaryKeys');
        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 540);
if(!pkeys || !Y.Lang.isArray(pkeys) || !rec) {return false;}

        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 542);
var rtn;
        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 543);
if( pkeys.length === 1)
            {_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 544);
rtn = rec.get(pkeys[0]);}
        else {
            _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 546);
rtn = {};
            _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 547);
Y.Array.each(pkeys,function(pk){
                _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "(anonymous 10)", 547);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 548);
if( pk ) {rtn[pk] = rec.get(pk);}
            });
        }
        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 551);
return rtn;
    },


    /**
     Function that searches an Array of Objects, looking for a matching partial object as defined by key_vals {Object},
     and returning the index of the first match.
     @method _indexOfObjMatch
     @param arr
     @param key_vals
     @return {Integer} imatch Returned index number of first match, or -1 if none found
     @private
     **/
    _indexOfObjMatch: function(arr,key_vals) {
        _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "_indexOfObjMatch", 564);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 565);
if(!Y.Lang.isObject(key_vals) || !Y.Lang.isArray(arr) ) {return -1;}
        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 566);
var imatch = -1;
        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 567);
Y.Array.some(arr,function(item,index){
            _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "(anonymous 11)", 567);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 568);
var bool = true;
            _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 569);
Y.Object.each(key_vals,function(v,k){
                _yuitest_coverfunc("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", "(anonymous 12)", 569);
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 570);
if(item[k] !== v) {bool = false;}
            });
            _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 572);
if (bool) {
                _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 573);
imatch = index;
                _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 574);
return true;
            }
        });

        _yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 578);
return imatch;
    }

});

_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 583);
DtCheckboxSelect.ATTRS = {

    /**
     Attribute that is used to trigger "checkbox" selection mode, and inserting of a checkbox select
     column to the current DataTable.

     @attribute checkboxSelectMode
     @type {Boolean}
     @default false
     **/
    checkboxSelectMode: {
        value:      false,
        validator:  Y.Lang.isBoolean,
        setter:     '_setCheckboxSelectMode'
    },


    /**
     Attribute that is used to retrieve the "checkbox" selected records from the DataTable at any time. 
     
     Also can be used to set initially "checked" records by entering an {Array} of record indices. (See method [_setCheckboxSelected](#method__setCheckboxSelected)).

     
     When a `get('checkboxSelected')` is requested, an {Array} of {Objects} containing members as 
     {tr,record,pkvalues} is returned for each checked row. (See method [_getCheckboxSelected](#method__getCheckboxSelected)).

     @attribute checkboxSelected
     @type {Array}
     @default []
     **/
    checkboxSelected: {
        value:      [],
        validator:  Y.Lang.isArray,
        setter:     '_setCheckboxSelected',
        getter:     '_getCheckboxSelected'
    },

    /**
     Attribute to set the "primary keys" for the DataTable that uniquely define the record (Model) attributes 
     to use to search for specific records.  
     
     Primary keys can be defined either with this attribute `primaryKeys` OR by placing an extra object property
     in the DataTable column configuration as "primaryKey:true".
     
     This attribute is more useful in use cases where the primary key is not displayed in a column.
     
     @example
	 // sets a single primary key to data field with key:'emp_id'
	 myDT.set('primaryKeys','emp_id');       		
		
	 // sets dual primary keys to two data fields with key:'inventory_id' and key:'lot_id'
	 myDT.set('primaryKeys',['inventory_id','lot_id']);  
	 // OR
	 var myDT = new Y.DataTable({
	 	columns: [ 
	 		{key:'inventory_id', label:'Inventory Code', primaryKey:true},
	 		{key:'item_code', label:'Sales Item'},
	 		{key:'lot_id', label:'Lot Code', primaryKey:true},
	 		...
	 });
     		
     @attribute primaryKeys
     @type {String|Array}
     @default See above
     **/
    primaryKeys: {
        valueFn:    '_valPrimaryKeys',
        setter:     '_setPrimaryKeys'
    }

};

_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 655);
Y.DataTable.CheckboxSelect = DtCheckboxSelect;
_yuitest_coverline("/build/gallery-datatable-checkbox-select/gallery-datatable-checkbox-select.js", 656);
Y.Base.mix(Y.DataTable, [Y.DataTable.CheckboxSelect]);


}, 'gallery-2012.09.12-20-02' ,{requires:['datatable-base','datatable-mutable','event-custom'], skinnable:false});
