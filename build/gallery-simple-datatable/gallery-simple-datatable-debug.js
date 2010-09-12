YUI.add('gallery-simple-datatable', function(Y) {

/**
 * Simple Datatable is a basic load and sort datatable
 *
 * @class SimpleDatatable
 * @extends Widget
 * @version 1.4.0
 */

var YL = Y.Lang;


Y.SimpleDatatable = Y.Base.create('sdt', Y.Widget, [],{
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
   * After lookup property to determine if headers have been set already
   * @since 1.3.0
   * @protpery
   * @public
   */
  headersSet : false,

  /**
   * After lookup property to determine if rows have been set already
   * @since 1.3.0
   * @protpery
   * @public
   */
  rowsSet : false,

  /**
   * Set up the sort and rowSelected events and the className
   * @since 1.0.0
   * @param config
   * @method initializer
   */
  initializer : function(config) {
    Y.log('initializer','info','simple-datatable');
    this.className = this.getClassName();
  },

  /**
   * Build the tHead and tBody and append them to the contenBox
   * @since 1.0.0
   * @method renderUI
   */
  renderUI : function() {
    Y.log('renderUI','info','simple-datatable');
    this.tHead = Y.Node.create('<thead></thead>');
    this.tBody = Y.Node.create('<tbody></tbody>');
    this.get('contentBox').append(this.tHead).append(this.tBody);
  },

  /**
   * Updates the headers and the rows
   * @since 1.0.0
   * @method syncUI
   */
  syncUI : function() {
    Y.log('syncUI','info','simple-datatable');
    this.setHeaders(this.get('headers'));
    this.setRows(this.get('rows'));
  },

  /**
   * Loops through the header object and builds cells
   * @since 1.3.0
   * @method setHeaders
   * @param headerObj
   * @return this
   * @chainable
   */
  setHeaders : function(headerObj){
    Y.log('setHeaders','info','simple-datatable');

    var row = Y.Node.create('<tr></tr>'),
        cell, o, p, count = 0,
        template = this.get('linerTemplate'),
        headerConfig = {
          linerClasses : this.className + '-liner',
          labelClasses : this.className + '-label',
          label : ''
        };

    if(!headerObj) {
      headerObj = {};
    }

    if(YL.isObject(headerObj)) {
      for(o in headerObj) {
        cell = Y.Node.create('<th></th>');
        cell.addClass(this.className + '-col-' + (count++));
        cell.addClass(this.className + '-col-' + o);

        if(YL.isString(headerObj[o])) {
          headerConfig.label = headerObj[o];
        }else if(headerObj[o].label){
          headerConfig.label = headerObj[o].label.toString();
        }else{
          headerConfig.label = o;
        }

        cell.append(Y.substitute(template, headerConfig));

        cell.setAttribute('key',o);
        if(YL.isObject(headerObj[o])) {
          for(p in headerObj[o]) {
            cell.setAttribute(p, headerObj[o][p]);
          }
        }
        row.append(cell);
      }
    }

    if(this.tHead.one('tr')) {
      this.tHead.one('tr').remove(true);
    }
    this.tHead.append(row);

    this.headersSet = true;

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
    Y.log('setRows','info','simple-datatable');
    var i,l, cb = this.get('contentBox'),
        frag = Y.Node.create('<tbody></tbody>');

    if(!arrayOfRows) {
      arrayOfRows = [];
    }

    for(i=0, l=arrayOfRows.length; i < l; i++) {
      frag.append( this._addRow(arrayOfRows[i], i) );
    }

    cb.one('tbody').replace(frag);

    this.tBody = frag;

    this.rowsSet = true;
    
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
    Y.log('clearHeaders','info','simple-datatable');
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
    Y.log('clearRows','info','simple-datatable');
    if(purge === true) {
      this.set('rows', []);
    }
    return this.setRows();
  },


  //  P RO T E C T E D  //

  /**
   * Creates a row from the provided data and adds it to the tBody
   *   Keys prefixed with __ (two underscores) are added as parameters
   *   to the &lt;tr&gt; instead of matching to a header column
   * @since 1.3.0
   * @protected
   * @method _addRow
   * @param rowData
   * @param rowCount
   * @return row to be added
   * @chainable
   */
  _addRow : function(rowData, rowCount) {
    Y.log('_addRow','info','simple-datatable');
    var headers = this.get('headers') || {}, count = 0,
        row, cell, key, cellCount = 0, yuiId = '__yui_id',
        template = this.get('linerTemplate'),
        cellConfig = {
          linerClasses : this.className + '-liner',
          labelClasses : this.className + '-label',
          label : ''
        },isObject = YL.isObject(rowData),
        isArray = YL.isArray(rowData);

    row = Y.Node.create('<tr>');

    if(isObject) {
      // add row attributes from custom keys
      for(key in rowData) {
        if(key.substring(0,2) === '__') {
          row.setAttribute(key.substring(2),rowData[key]);
        }
      }
      if(!rowData[yuiId]) {
        rowData[yuiId] = Y.Event.generateId(row);
      }
      row.set('id',rowData[yuiId]);
    }else{
      row.set('id', Y.Event.generateId(row));
    }

    // loop header keys to add cell data
    for(key in headers) {

      cell = Y.Node.create('<td>');
      cell.addClass(this.className + '-col-' + cellCount++);
      cell.addClass(this.className + '-col-' + key);

      if(isObject && rowData[key]) {
        cellConfig.label = rowData[key];
      }else if(isArray && rowData[count]) {
        cellConfig.label = rowData[count];
      }else{
        cellConfig.label = '&nbsp;';
      }

      cell.append(Y.substitute(template, cellConfig));
      row.append(cell);

      count++;
    }

    row.addClass(this.className + '-' + ( (rowCount % 2) ? 'even' : 'odd') );

    return row;
  }


},{
  ATTRS : {

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
     */
    linerTemplate : {
      value : '<div class="{linerClasses}"><div class="{labelClasses}">{label}</div></div>'
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
    }
  }
});


}, 'gallery-2010.09.08-19-45' ,{requires:['node','widget','widget-child','event','event-mouseenter','substitute']});
