YUI.add('gallery-simple-datatable', function(Y) {

  /**
   * Simple Datatable is a basic load and sort datatable
   * 
   * @class NodeIo
   * @extends Base
   * @version 1.2.0
   */
	
  var YL = Y.Lang,
      SORT_ASC = 'asc',
      SORT_DESC = 'desc',
      SORT_KEY = 'sortKey',
      SORT_DIRECTION = 'sortDirection',
      CONTENT_BOX = 'contentBox',
      SELECTED_ROW = 'selectedRow';
      
      
  Y.SimpleDatatable = Y.Base.create('simple-datatable', Y.Widget, [Y.WidgetChild],{
    
    //////  P U B L I C  //////
    /**
     * Override the default template with a table
     * @since 1.0.0
     */
    CONTENT_TEMPLATE : '<table>',
    
    /**
     * Classname of the widget. Used to prevent multiple look ups
     * @since 1.0.0
     */
    className : '',
    
    /**
     * Provides a reference to the table head
     * @since 1.0.0
     */
    tHead : null,
    
    /**
     * Provides a reference to the table body
     * @since 1.0.0
     */
    tBody : null,
    
    /**
     * Set up the sort and rowSelected events and the className
     * @since 1.0.0
     * @param config
     * @method initializer
     */
    initializer : function(config) {
      this.className = this.getClassName();
      this.publish('sort', {defaultFn: this._defSortFn});
      this.publish('rowSelected', {defaultFn: this._defSelectedFn});
    },

    /**
     * Build the tHead and tBody and append them to the contenBox
     * @since 1.0.0
     * @method renderUI
     */
    renderUI : function() {
      var cb = this.get(CONTENT_BOX),
          caption = this.get('caption');
      
      this.tHead = Y.Node.create('<thead></thead>');
      this.tBody = Y.Node.create('<tbody></tbody>');
      
      if(caption) {
        cb.append('<caption>' + caption + '</caption>');
      }
      
      cb.append(this.tHead).append(this.tBody);
    },
    
    /**
     * Wire up the events
     * @since 1.0.0
     * @method bindUI
     */
    bindUI :  function() {
      var overClass = this.className + '-over';
      
      this.after('sortKeyChange', this._afterSortKeyChange);
      this.on('sortDirectionChange', this._onSortDirectionChange);
      this.after('sortDirectionChange', this._afterSortDirectionChange);
      this.after('selectedRowChange', this._afterSelectedRowChange);
      this.after('captionChange', this._afterCaptionChange);
   
      // sort on header click
      this.tHead.delegate('click', function(e){
        this.fire('sort', {headerTarget: e.currentTarget});
      },'th',this);
     
      // allow for row highlight
      this.tBody.delegate('mouseenter', function(e){
        e.currentTarget.addClass(overClass);
      },'tr');
     
      this.tBody.delegate('mouseleave', function(e){
        e.currentTarget.removeClass(overClass);
      },'tr');
     
      // update selected row
      this.tBody.delegate('click', function(e){
        this.fire('rowSelected', {rowTarget: e.currentTarget});
      },'tr',this);
    },
     
    /**
     * Updates the headers and the rows
     * @since 1.0.0
     * @method syncUI
     */
    syncUI : function() {
      this.setHeaders(this.get('headers'));
      this.setRows(this.get('rows'));
    },
    
    /**
     * Loops through the header object and builds cells
     * @since 1.0.0
     * @method setHeaders
     * @param headerObj
     * @return this
     * @chainable
     */
    setHeaders : function(headerObj){
      
      var row = Y.Node.create('<tr></tr>'), 
          cell, o, count = 0;
      
      if(!headerObj) {
        headerObj = {}; 
      }
      
      if(YL.isObject(headerObj)) {
        for(o in headerObj) {
          cell = Y.Node.create('<th></th>');
          cell.addClass(this.className + '-col-' + (count++));
          cell.addClass(this.className + '-col-' + o);
          cell.append('<div>' + headerObj[o] + '<span class="yui3-icon"></span></div>');
          cell.setAttribute(SORT_KEY, o);
          row.append(cell);
        }
      }

      this.tHead.setContent('');
      this.tHead.setContent(row);
      
      return this;
    },
    
    /**
     * Loops through array and builds rows
     * @since 1.0.0
     * @see addRow
     * @method setRows
     * @param arrayOfRows
     * @return this
     * @chainable
     */
    setRows : function(arrayOfRows) {
      var i,l;
      this.tBody.setContent('');
      
      if(!arrayOfRows) {
        arrayOfRows = [];
      }

      for(i=0, l=arrayOfRows.length; i < l; i++) {
        this.addRow(arrayOfRows[i], i);
      }
      
      return this;
    },
    
    /**
     * Creates a row from the provided data and adds it to the tBody
     *   Keys prefixed with __ (two underscores) are added as parameters
     *   to the &lt;tr&gt; instead of matching to a header column
     * @since 1.0.0
     * @method addRow
     * @param rowData
     * @param rowCount
     * @return this
     * @chainable
     */
    addRow : function(rowData, rowCount) {
      var headers = this.get('headers') || {}, 
      row, cell, key, cellCount = 0, yuiId = '__yui_id';
      row = Y.Node.create('<tr>');
      
      for(key in rowData) {
        if(key.substring(0,2) === '__') {
          row.setAttribute(key.substring(2),rowData[key]);
          continue;
        }
        if(!headers[key]) {
          continue;
        }
        
        cell = Y.Node.create('<td>');
        cell.addClass(this.className + '-col-' + cellCount++);
        cell.addClass(this.className + '-col-' + key);
        
        if(rowData[key]) {
          cell.append('<div>' + rowData[key] + '</div>');
        }else{
          cell.append('<div>&nbsp;</div>');
        }
        
        row.append(cell);
      }
      
      if(!rowData[yuiId]) {
        rowData[yuiId] = Y.Event.generateId(row);
      }
      row.set('id',rowData[yuiId]);
      
      row.addClass(this.className + '-' + ( (rowCount % 2) ? 'even' : 'odd') );
      
      this.tBody.append(row);
      return this;
    },
    
    /**
     * Removes all header content
     * @since 1.2.0
     * @method clearHeaders
     * @param purge Removes all header data when set to true
     * @return this
     * @chainable
     */
    clearHeaders : function(purge) {
      if(purge === true) {
        this.set('headers', {});
      }
      return this.setHeaders();
    },
    
    /**
     * Removes all rows
     * @since 1.2.0
     * @method clearRows
     * @param purge removes all row data when set to true
     * @return this
     * @chainable
     */
    clearRows : function(purge) {
      if(purge === true) {
        this.set('rows', []);
      }
      return this.setRows();
    },
    
    /**
     * Alternates the sort direction keeping the column selected the same
     * @since 1.0.0
     * @see _toggleSort
     * @method toggleSort
     * @return this
     * @chainable
     */
    toggleSort : function() {
      this._toggleSort();
      return this;
    },
    
    /**
     * Updates the selected column to the one provided.
     * Sorting by new key will automatically adjust the direction to ASC
     * @since 1.1.0
     * @method sortBy
     * @param key
     * @return this
     * @chainable
     */
    sortBy : function(key) {
      this.set(SORT_KEY, key);
      return this;
    },
    
    /**
     * **DEPRICATED** Updates the selected column to the one provided.
     * @since 1.0.0
     * @depricated 1.1.0
     */
    sortRowsByKey : function(key) {
      return this.sortBy(key);
    },

    //////  P R O T E C T E D  //////
    /**
     * Default function when a column is selected to sort. If key is
     *   not a new key, simply calls _toggleSort
     * @since 1.1.0
     * @see _toggleSort
     * @protected
     * @method _defSortFn
     * @param e
     */
    _defSortFn : function(e){
      // check to see if we are reversing the current column, or sorting a new one
      var selectedKey = e.headerTarget.getAttribute(SORT_KEY);
      if(this.get(SORT_KEY) !== selectedKey) {
        this.set(SORT_KEY, selectedKey);
      }else{
        this._toggleSort();
      }
    },
    
    /**
     * Default function when a row is selected. When selected row is 
     *   clicked again, removes the row from being selected.
     * @since 1.2.0
     * @protected
     * @method _defSelectedFn
     * @param e
     */
    _defSelectedFn : function(e) {
      var selectedRow = this.get(SELECTED_ROW);
      
      if(selectedRow === e.rowTarget) {
        this.set(SELECTED_ROW, null);
      }else{
        this.set(SELECTED_ROW,e.rowTarget);
      }
    },
    
    /**
     * This method fires after the sort key is changed
     * Sets the new direction to asc
     * @since 1.1.0
     * @protected
     * @method _afterSortKeyChange
     * @param e
     */
    _afterSortKeyChange : function(e) {
      this.set(SORT_DIRECTION, SORT_ASC);
    },
    
    /**
     * Checks to see if the sort direction is changing to a new value,
     *   if it is not, defaults to firing the _updateTable() method
     * @since 1.1.0
     * @see _updateTable
     * @protected
     * @method _onSortDirectionChange
     * @param e
     */
    _onSortDirectionChange : function(e) {
      if(e.newVal === e.prevVal) {
        this._updateTable();
      }
    },
    
    /**
     * Updates the table after the sort direction has been changed.
     * @since 1.1.0
     * @see _updateTable
     * @protected
     * @method _afterSortDirectionChange
     * @param e
     */
    _afterSortDirectionChange : function(e) {
      this._updateTable();
    },
    
    /**
     * When a new row is selected, calls _updateSelectedRow
     * @since 1.1.0
     * @see _updateSelectedRow
     * @protected
     * @method _afterSelectedRowChange
     * @param e
     */
    _afterSelectedRowChange : function(e) {
      this._updateSelectedRow(e.newVal, e.prevVal);
    },
    
    
    /**
     * Sorts the rows on new direction and replaces the rows with the
     *   new content then reselects the previously selected row
     * @since 1.1.1
     * @see setRows
     * @see _keySort
     * @protected
     * @method _updateTable
     */
    _updateTable : function(){
      var rows = this.get('rows'),
          ascClass = this.get('ascClass'),
          descClass = this.get('descClass'),
          key = this.get(SORT_KEY),
          dir = this.get(SORT_DIRECTION);
      
      rows.sort(Y.bind(this._keySort, this, key, this.get(SORT_DIRECTION)));

      this.setRows(rows);
      this.set('rows',rows);
      
      // clear class names and set sorted column classname to direction class 
      this.tHead.all('.' + ascClass).removeClass(ascClass);
      this.tHead.all('.' + descClass).removeClass(descClass);
      this.tHead.all('.' + this.className + '-col-' + key).addClass(this.get(dir + 'Class'));
      
      this._updateSelectedRow(this.get(SELECTED_ROW));
    },
    
    /**
     * Custom array sort to sort object by key and direction
     * @since 1.1.1
     * @protected
     * @method keySort
     * @param key
     * @param method
     * @param a 
     * @param b
     * @return int -1,0,1
     */
    _keySort : function(key, dir, a,b) {
      a = a[key];
      b = b[key];
      
      if(Y.Lang.isString(a)) {
        a = a.toLowerCase();
        b = b.toLowerCase();
      }
      
      if(a == b) { return 0; }
      if(a >  b) { return (dir === SORT_DESC) ? -1 : 1; }
      return (dir === SORT_ASC) ? -1 : 1;
    },
    
    /**
     * Checks the current direction and set to the opposite
     * @since 1.1.0
     * @protected
     * @method _toggleSort
     */
    _toggleSort : function() {
      this.set(SORT_DIRECTION, (this.get(SORT_DIRECTION) === SORT_ASC) ? SORT_DESC : SORT_ASC );
    },
    
    /**
     * Removes the selected class from any currently selected rows and 
     *   adds the selected class to the new row
     * @since 1.1.0
     * @protected
     * @method _updateSelectedRow
     * @param newRow
     * @param oldRow
     */
    _updateSelectedRow : function(newRow, oldRow) {
      var selectedClass = this.className + '-selected';
      if(oldRow) {
        this.tBody.one('#' + oldRow.get('id')).removeClass(selectedClass);
      }
      if(newRow) {  
       this.tBody.one('#' + newRow.get('id')).addClass(selectedClass);
      }
    },
    
    /**
     * Updates the text of the caption after the value is changed
     * @since 1.2.0
     * @protected
     * @method _afterCaptionChange
     */    
    _afterCaptionChange : function(e) {
      var cap = this.get(CONTENT_BOX).one('caption');
      if(cap) {
        if(e.newVal) {
          cap.set('text', e.newVal);
        }else{
          cap.remove();
        }
      }else{
        if(e.newVal) {
          this.get(CONTENT_BOX).prepend('<caption>' + e.newVal + '</caption>');
        }
      }
    }
    
  },{
    ATTRS : {
	  /**
	   * Ability to customize the class used when sorted ASC
	   * @since 1.1.0
       * @attribute ascClass
       * @type string
	   */
      ascClass : {
        value : 'yui3-icon-control-s'
      },
      
	  /**
	   * When set, adds a caption to the table.
	   * @since 1.2.0
       * @attribute caption
       * @type string
	   */
      caption : {},
      
      /**
       * Ability to customize the class used when sorted DESC
       * @since 1.1.0
       * @attribute descClass
       * @type string
       */
      descClass : {
    	  value : 'yui3-icon-control-n'
      },
      
	  /**
	   * An associated array of key -&gt; value pairs where key is used 
	   *   to keep the column data organized and value is the &lt;th&gt;
	   *   innerHTML or display text.
	   * @since 1.0.0
       * @attribute headers
       * @type object
	   */
      headers : {
        value : {},
        validator : YL.isObject
      },
      
	  /**
	   * Array of associated arrays of key -&gt; value pairs, where 
	   *   key is used to match with the headers assoc array to ensure
	   *   column data is in the correct place and value is the 
	   *   innerHTML or display text.
	   * @since 1.0.0
       * @attribute rows
       * @type array
	   */
      rows : {
        value : [],
        validator : YL.isArray
      },
      
	  /**
	   * The &lt;tr&gt; that is currently selected
	   * @since 1.0.0
       * @attribute selectedRow
       * @type Y.Node
	   */
      selectedRow : {},
      
	  /**
	   * Key representing the current column sorted
	   * @since 1.0.0
       * @attribute sortKey
       * @type string
	   */
      sortKey : {
        validator : function(val) {
          return (this.get('headers')[val]) ? true : false;
        }
      },
      
	  /**
	   * String representing the direction the column selected is sorted
	   * @since 1.0.0
       * @attribute sortDirection
       * @type string
	   */
      sortDirection : {
        value : SORT_ASC,
        setter : function (val) {
          return val === SORT_DESC ? SORT_DESC : SORT_ASC;
        }
      }
    }
  });


}, 'gallery-2010.08.11-20-39' ,{requires:['node','widget','event','event-mouseenter']});
