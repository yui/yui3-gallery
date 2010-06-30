YUI.add('gallery-simple-datatable', function(Y) {

  var SORT_ASC = 'asc',
      SORT_DESC = 'desc',
      SORT_DIRECTION = 'sortDirection';
      
      
  Y.SimpleDatatable = Y.Base.create('simple-datatable', Y.Widget, [],{
    
    CONTENT_TEMPLATE : '<table>',
    
    className : '',
    
    tHead : null,
    
    tBody : null,
    
    initializer : function(config) {
      this.className = this.getClassName();
    },

      
    renderUI : function() {
      this.tHead = Y.Node.create('<thead/>');
      this.tBody = Y.Node.create('<tbody/>');
      this.get('contentBox').append(this.tHead).append(this.tBody);
    },
    
    bindUI :  function() {
      var overClass = this.className + '-over';
      
      // update sort classes
      this.after('sortDirectionChange', this._updateSortClass);
      
      // update selected 
      this.after('selectedRowChange', this._updateSelectedRow);
      
      // sort on header click
      this.tHead.delegate('click', function(e){
        var className = this.className + '-' + this.get(SORT_DIRECTION);
        this.tHead.all('.' + className).removeClass(className);
        e.currentTarget.addClass(className);
        
        this.sortRowsByKey(e.currentTarget.getAttribute('sortKey'));
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
        this.set('selectedRow',e.currentTarget);
      },'tr',this);
    },
    
    syncUI : function() {
      Y.log('syncUI');
      var headers = this.get('headers'), 
          rows = this.get('rows');
          
      if(headers) {
        this.setHeaders(headers);
      }
      
      if(rows) {
        this.setRows(rows);
      }
    },
    
    setHeaders : function(obj){
      var row, cell, o, count = 0;
      row = Y.Node.create('<tr>');
      
      for(o in obj) {
        cell = Y.Node.create('<th>');
        cell.addClass(this.className + '-col-' + (count++));
        cell.addClass(this.className + '-col-' + o);
        cell.append('<div>' + obj[o] + '</div>');
        cell.setAttribute('sortKey',o);
        
        row.append(cell);
      }
        
      this.tHead.setContent('');
      this.tHead.setContent(row);
    },
    
    setRows : function(obj) {
      var o, rowCount = 0;
      this.tBody.setContent('');
      for(o in obj) {
        this.addRow(obj[o], rowCount++);
      }
    },
    
    addRow : function(obj, rowCount) {
      var headers = this.get('headers') || {}, 
      row, cell, o, cellCount = 0, yuiId = '__yui_id';
      row = Y.Node.create('<tr>');
      
      for(o in obj) {
        if(o.substring(0,2) === '__') {
          row.setAttribute(o.substring(2),obj[o]);
          continue;
        }
        if(!headers[o]) {
          continue;
        }
        
        cell = Y.Node.create('<td>');
        cell.addClass(this.className + '-col-' + cellCount++);
        cell.addClass(this.className + '-col-' + o);
        
        if(obj[o]) {
          cell.append('<div>' + obj[o] + '</div>');
        }else{
          cell.append('<div/>');
        }
        
        row.append(cell);
      }
      
      if(!obj[yuiId]) {
        obj[yuiId] = Y.Event.generateId(row);
      }
      row.set('id',obj[yuiId]);
      
      row.addClass(this.className + '-' + ( (rowCount % 2) ? 'even' : 'odd') );
      
      this.tBody.append(row);
    },
    
    toggleSort : function() {
      var oldDir = this.get(SORT_DIRECTION),
          newDir = oldDir === SORT_ASC ? SORT_DESC : SORT_ASC;
          
      this.set(SORT_DIRECTION, newDir );
    },
    
    sortRowsByKey : function(key) {
      var rows = this.get('rows'), direction;
      
      // either toggle the sort direction or set key
      if(key === this.get('sortKey')) {
        this.toggleSort();
      }else{
        this.set('sortKey', key);
        this.set(SORT_DIRECTION, SORT_ASC);
      }
      
      direction = this.get(SORT_DIRECTION);
      
      rows.sort(function(a,b){
        var a = a[key], b = b[key];
        
        if(Y.Lang.isString(a[key])) {
          a = a[key].toLowerCase();
          b = b[key].toLowerCase();
        }
        
        if(a == b) {
          return 0;
        }
        
        if(a > b) {
          return (direction === SORT_ASC) ? 1 : -1;
        }
        
        return (direction === SORT_DESC) ? 1 : -1;
        
      });
      
      this.setRows(rows);
      this.set('rows',rows);
      
      this.updateSelectedRow(this.get('selectedRow'));
    },
    
    updateSelectedRow : function(newRow, oldRow) {
      var selectedClass = this.className + '-selected';
      if(oldRow) {
        this.tBody.one('#' + oldRow.get('id')).removeClass(selectedClass);
      }
      if(newRow) {
        this.tBody.one('#' + newRow.get('id')).addClass(selectedClass);
      }
    },
    
    _updateSelectedRow : function(e) {
      if(e.newVal === e.prevVal) {
        return;
      }
      this.updateSelectedRow(e.newVal, e.prevVal);
    },
    
    _updateSortClass : function(e){
      var oldClass = this.className + '-' + e.prevVal,
          newClass = this.className + '-' + e.newVal;
      this.tHead.all('.' + oldClass).replaceClass(oldClass,newClass);
    }
    
  },{
    ATTRS : {
      headers : {},
      rows : {},
      selectedRow : {},
      sortKey : {},
      sortDirection : {
        value : SORT_ASC,
        setter : function (val) {
          val = val === SORT_DESC ? SORT_DESC : SORT_ASC;
          return val;
        }
      }
    }
  });


}, 'gallery-2010.06.30-19-54' ,{requires:['node','widget','event','event-mouseenter']});
