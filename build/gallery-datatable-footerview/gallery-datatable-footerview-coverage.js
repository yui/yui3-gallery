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
_yuitest_coverage["/build/gallery-datatable-footerview/gallery-datatable-footerview.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-datatable-footerview/gallery-datatable-footerview.js",
    code: []
};
_yuitest_coverage["/build/gallery-datatable-footerview/gallery-datatable-footerview.js"].code=["YUI.add('gallery-datatable-footerview', function(Y) {",""," /**","  FooterView is a YUI View class extension that provides a simple, one row summary row","  to a Datatable. This view provides","  for a summary row appended to the bottom of the DataTable TBODY, typically consisting","  of **one** TH element (with a colspan) and several TD elements for each desired column","  where a \"calculated field\" is desired.","","  View configuration provides for calculated fields based upon the all of the available","  dataset fields within the DataTable's \"ModelList\".","","  The view works with either non-scrolling or scrolling DataTables, and allows for either a","  \"fixed\" view, wherein the footer remains fixed at the bottom of the DataTable contentBox","  while the table is scrolled.","","  #### Calculated Fields","","  The current implementation supports the following calculated fields, where they are","  identified by their placeholder tag for replacement via Y.sub (case insensitive);","","  * `{sum}` Calculate the arithmetic sum of the specified column in dataset","  * `{min}` Calculate the minimum value of the specified column in dataset","  * `{max}` Calculate the maximum value of the specified column in dataset","  * `{avg}` Calculate the arithmetic average of the of the specified column (synonyms `{mean}`, `{average}`)","","  Also, non-looping calcs are;","","  *  `{row_count}` Returns the number of rows in the dataset","  *  `{col_count}` Returns the number of columns in the dataset (no visibility check)","  *  `{date}` Returns the current date","  *  `{time}` Returns the current time","","  #### Configuration","","  YUI 3.6.0 DataTable supports attributes including `footerView` and `footerConfig`.","","  This FooterView recognizes the following attributes, which must be configured via the","  DataTable {configs} (see usage example below);","","  * [`fixed`](#attr_fixed) : Flag indicating if footer should be fixed or floating","  * [`heading`](#attr_heading) : Object, defining the single TH as;","     * [`colspan`](#attr_heading.colspan) : Number of columns to merge from left for the TH","     * [`content`](#attr_heading.content) : A string indicating the content of the TH for the footer","     * [`className`](#attr_heading.className) : Additional classname for TH","  * [`columns`](#attr_columns) : Array of objects, one per desired TD column in footer as;","     * [`key`](#attr_columns.key) : `key` name from the DataTable columns","     * [`content`](#attr_columns.content) : String indicating the contents of this TD","     * [`className`](#attr_columns.className) : Additional classname for TD","     * [`formatter`](#attr_columns.formatter) : Formatter to apply to this column result","  * [`dateFormat`](#attr_dateFormat) : Format string to use for any {date} fields","  * [`timeFormat`](#attr_timeFormat) : Format string to use for any {time} fields","","  Additionally the user can provide a valid function as a column `content` to calculate a","  custom entry for a column (see [`columns.content`](#attr_columns.content))","","  #### Usage","","      var dtable = new Y.DataTable({","          columns:    ['EmpId','FirstName','LastName','NumClients','SalesTTM'],","          data:       AccountMgr.Sales,","          scrollable: 'y',","          height:     '250px',","          width:      '400px',","","          footerView:   Y.FooterView,","          footerConfig: {","              fixed:   true,","              heading: {","                  colspan:	3,","                  content:	\"Sales Totals for {row_count} Account Mgrs : &nbsp;\",","                  className:	\"align-right\"","              },","              columns: [","                  { key:'NumClients', content:\"{Avg} avg\", className:\"clientAvg\" },","                  { key:'SalesTTM',   content:\"{sum}\", className:\"salesTotal\", formatter:fmtCurrency }","              ]","          }","      });","","      dtable.render('#salesDT');","","","  @module FooterView","  @class Y.FooterView","  @extends Y.View","  @author Todd Smith","  @version 1.1.0","  @since 3.6.0","  **/"," Y.FooterView = Y.Base.create( 'tableFooter', Y.View, [], {","","      /**","       Defines the default TD HTML template for a calculated field within the footer","       @property TMPL_td","       @type String","       @default '<td class=\"yui3-datatable-even {tdClass}\">{content}</td>'","       @static","       @since 3.6.0","       @protected","       **/","      TMPL_td: '<td class=\"yui3-datatable-even {tdClass}\">{content}</td>',","","      /**","       Defines the default TH HTML template for the header content within the footer","       @property TMPL_th","       @type String","       @default '<th colspan=\"{colspan}\" class=\"{thClass}\">{content}</th>'","       @static","       @since 3.6.0","       @protected","       **/","      TMPL_th: '<th colspan=\"{colspan}\" class=\"{thClass}\">{content}</th>',","","      /**","       Defines the default TR HTML template for the footer","       @property TMPL_tr","       @type String","       @default '<tr>{th_content}{td_content}</tr>'","       @static","       @since 3.6.0","       @protected","       **/","      TMPL_tr:    '<tr>{th_content}{td_content}</tr>',","","      /**","       Defines the default TFOOT HTML template for the footer","       @property TMPL_tfoot","       @type String","       @default '<tfoot class=\"{footClass}\"><tr>{th_content}{td_content}</tr></tfoot>'","       @static","       @since 3.6.0","       @protected","       **/","      TMPL_tfoot: '<tfoot class=\"{footClass}\"><tr>{th_content}{td_content}</tr></tfoot>',","","","      /**","       Defines the default TABLE HTML template for the \"fixed\" footer type ... i.e. with scrolling","       @property TMPL_table_fixed","       @type String","       @default '<table cellspacing=\"0\" aria-hidden=\"true\" class=\"{className}\"></table>'","       @static","       @since 3.6.0","       @protected","       **/","      TMPL_table_fixed: '<table cellspacing=\"0\" aria-hidden=\"true\" class=\"{className}\"></table>',","","","      dateFormat:  '%D',","      timeFormat:  '%T',","","      // replacer function","      fnReplace  : Y.Lang.sub,","","      /**","       Storage array of objects, each object represents a rendered \"cell or column\" within the","       footer view.  The first element is typically a TH element (with a colspan), and the","       remaining elements are the TD's for each requested footer field.","","       Created and populated by the render() method","","       @property node_cols","       @type Array of Object hashes","       @default null","       @static","       @since 3.6.0","       @protected","       **/","      node_cols : null,   // array of col_key map (e.g. '_head', null, 'f_name' )","","      /**","       Placeholder for subscriber event handles, used to destroy cleanly","       @property _subscr","       @type {EventHandles} Array of eventhandles","       @default null","       @static","       @since 3.6.0","       @private","       **/","      _subscr : null,","","      /**","       DataTable instance that utilizes this footerview, derived from initializer \"config.host\"","       Used to reference changes to DT modellist, and to retrieve the underlying \"data\"","","       @property _dt","       @type Y.DataTable","       @default null","       @static","       @since 3.6.0","       @private","       **/","      _dt: null,","","      /**","       * Called when view is initialized.  Stores reference to calling DataTable and","       *  creates listeners to link building or refreshing the footer back to the","       *  parent DataTable.","       *","       * @method initializer","       * @param {Object} config","       * @protected","       */","      initializer: function(config) {","          config || (config={});","","          // Set a reference to the calling DataTable","          this._dt = ( config.source ) ? config.source :  config.host;    // reference to DT instance","","          // Setup listeners ...","          this._subscr = [];","","          //  ... For scrollable with fixed footer, we have to build a new TABLE and append outside of scrolling ...","          if ( config.footerConfig && config.footerConfig.fixed && this._dt.get('scrollable') ) {","              this._subscr.push( Y.Do.after( this._buildFixedFooter, this._dt, '_syncScrollUI', this._dt) );","          }","","          // Listen for changes on the DataTable \"data\" ...","          this._subscr.push( this._dt.data.after(['*:change','*:add','*:create', '*:remove', '*:reset'], Y.bind('refreshFooter', this) ) );","","      },","","      /**","       * Default destructor method, cleans up the listeners that were created and","       *  removes and/or empties the created DOM elements for the footerView.","       *","       * @method destructor","       * @protected","       */","      destructor: function () {","          Y.Array.each(this._subscr,function(item){","              item.detach();","          });","          this._dt._tfootNode.empty();","          if ( this._dt._yScrollFooter ) this._dt._yScrollFooter.empty();","      },","","","      /**","       * Calls the helper function to construct and render the initial footer","       * @method render","       * @chainable","       */","      render: function() {","          this.renderFooter();","          return this;","      },","","// --------------------------------------------------------------------------------","//               Public Methods","// --------------------------------------------------------------------------------","","      /**","       * Creates the DOM elements and attaches them to the footerView container.","       *  Reads the configuration parameters (i.e. from DataTable's config as \"footerConfig\")","       *  and structures a single TR element, with a leading TH in first column, and the","       *  requested TD elements following.","       *","       * @method renderFooter","       * @public","       * @chainable","       */","      renderFooter: function(){","          var foot_cont = this.get('container'),      // reference to the TFOOT, created by DataTable","              table_obj = this._dt,                   // reference to the parent DataTable instance","              columns   = table_obj.get('columns'),   // reference to the ModelList / or DataTable.data","              rs_data   = table_obj.get(\"data\"),      // reference to the ModelList / or DataTable.data","              foot_cfg  = table_obj.get('footerConfig'),    // placeholder for the 'footer' config","              foot_cols = foot_cfg.columns,           // placeholder for the 'footer'.config.columns entry","              tfoot_th  = '',                         // the string for the TH node","              tfoot_td  = '',                         // the string for the TD node","              cspan     = 1;                          // colSpan entry for TH, default to 1","","          this.node_cols = [];","","          //","          //  Initialize date and time formats","          //","          this.dateFormat = ( foot_cfg && foot_cfg.dateFormat ) ? foot_cfg.dateFormat","              : ( table_obj.get('dateFormat') ) ? table_obj.get('dateFormat')","              : this.dateFormat;","","          this.timeFormat = ( foot_cfg && foot_cfg.timeFormat ) ? foot_cfg.timeFormat","              : ( table_obj.get('timeFormat') ) ? table_obj.get('timeFormat')","              : this.timeFormat;","","          // define a default replacer object ...","          var replacer_obj = {","              ROW_COUNT : rs_data.size(),","              COL_COUNT : columns.length,","              DATE:       Y.DataType.Date.format( new Date(), { format: this.dateFormat }),","              TIME:       Y.DataType.Date.format( new Date(), { format: this.timeFormat })","          };","          // duplicate above, for lowercase","          Y.Object.each(replacer_obj,function(val,key,obj){","              obj[ key.toLowerCase() ] = val;","          });","          //","          //  Process the TH part","          //","          if ( foot_cfg.heading ) {","              cspan = foot_cfg.heading.colspan || cspan;","              tfoot_th = this.fnReplace( this.TMPL_th, {","                  colspan: cspan,","                  thClass: ' ' + (foot_cfg.heading.className || ''),","                  content: this.fnReplace( foot_cfg.heading.content, replacer_obj )","              });","","              var th_item = {","                  index:		0,","                  key:		0,","                  td:			null,","                  th:         foot_cfg.heading,","                  className:	foot_cfg.className || '',","                  formatter:	'',","                  content:    null","              };","","              // save this for later ... used by refreshFooter","              this.node_cols.push(th_item);","          }","","          //","          //  Make an array for the remainder TD's in the Footer","          //","          var num_tds = columns.length - cspan;","          var td_html = [];	// an array of objects to hold footer TD (non-TH!) data","","          for(var i=cspan; i<columns.length; i++) {","              var titem = columns[i];","              td_html.push({","                  index:		i,","                  key:		titem.key,","                  td:			null,","                  th:         null,","                  className:	titem.className || '',","                  formatter:	titem.formatter || '',","                  content:    null  //titem.content || null","              });","          }","","          //","          //  Augment the Footer TD's, by inserting computed values from 'footer' config","          //","          //   Note: Users may enter footer 'columns' in non-ascending order, thus","          //         necessitating the search for column key ...","          //","          Y.Array.each( foot_cols, function(fitem){","              var imatch = -1;","              Y.Array.some( td_html, function(item,index) {","                  if ( item.key === fitem.key ) {","                      imatch = index;","                      return true;	// true ends the loop ... so this is 'find a first'","                  }","              });","","              if ( imatch !== -1) {","                  // go ahead and calculate the value for this cell, while we are building it ...","                  td_html[imatch].td = this.formatFootCell( td_html[imatch], fitem );","","                  td_html[imatch].content = fitem.content || null;","                  td_html[imatch].foot_cfg = fitem;","              }","","          }, this);","","          //","          //  and Build out the TD string ... looping over the non-TH columns","          //","          Y.Array.each( td_html, function(item){","              item.td = item.td || '';	// if nothing defined, fill with ''","              item.content = item.content || null;","","              tfoot_td += this.fnReplace( this.TMPL_td, {","                  tdClass: item.className || '',","                  content: item.td","              });","","              this.node_cols.push( item );","          }, this);","","          //","          //  Now construct the TR and the outer TFOOT and add it","          //","          var trClass = this._dt.getClassName('footer');","          tr_tmpl = this.TMPL_tfoot;","","          var tr = this.fnReplace( tr_tmpl, {","              footClass:  trClass,","              th_content: tfoot_th,","              td_content: tfoot_td","          });","","          var foot_tr = foot_cont.append( Y.Node.create(tr) );","","          return this;","","      },","","","      /**","       * Calculates a DataSet summary item defined in 'calc' for the given colKey, by","       *   looping through the current \"data\" (i.e. Recordset).","       *","       *   Currently, the 'calc' is set to lowercase ...","       *","       * Example calc settings are as follows (for given 'colKey');","       *","       * {sum}		Calculate the arithmetic sum of dataset","       * {min}		Calculate the minimum value within the dataset","       * {max}		Calculate the maximum value within the dataset","       * {avg}		Calculate the arithmetic average of the datset","       *                (synonyms are {mean}, {average})","       *","       * Also, non-dataset iterating calcs are;","       *  {row_count}	 Returns the number of rows in the dataset","       *  {col_count}  Returns the number of columns in the dataset (no visibility check)","       *  {date}		 Returns the current date (via dateFormat setting)","       *  {time}		 Returns the current time (via timeFormat setting)","       *","       * If 'calc' argument is a function(), then call it (in the \"this\" context of this","       *  FooterView) with one argument, the DataTable.data property.","       *","       *  // TODO:  Consider one call to this (with mult keys) for one loop thru only ...","       *","       * // not a really possible use case, but ...","       *   ? whatif user tries to enter calc='this is a {sum} and {min} value' ??","       *","       * @method calcDatasetValue","       * @param {String} colKey  The column key name to be calculated","       * @param {String} calc    A recognizable calc setting from above","       * @return {Number} the return value","       * @public","       */","      calcDatasetValue: function(colKey, calc) {","","          var rs_data = this._dt.get(\"data\"),    // this is a modelList currently","              rcalc   = 0,","              rmin    = Number.POSITIVE_INFINITY,","              rmax    = Number.POSITIVE_INFINITY;","","          if ( Y.Lang.isString(calc) ) {","              var lcalc = calc.toLowerCase(),","                  avg   = lcalc.search(/{average}|{avg}|{mean}/i);  // a flag for knowing if averaging is to be done","","              //","              //  initial case, if non-summary item, just return it!","              //   Note: these probably shouldn't be used in a TD column,","              //        but sometimes people may do this ...","              //","              if ( lcalc.search(/{row_count}/) !== -1 ) 	return rs_data.size();","              if ( lcalc.search(/{col_count}/) !== -1  ) 	return this._dt.get(\"columns\").length;","              if ( lcalc.search(/{date}/) !== -1  )		return Y.DataType.Date.format( new Date(), { format: this.dateFormat });","              if ( lcalc.search(/{time}/) !== -1  )		return Y.DataType.Date.format( new Date(), { format: this.timeFormat });","","              //","              //  If a min or max, set initial value to first","              //","              if ( lcalc.search(/{min}|{max}/) !== -1 )","                  rcalc = parseFloat(rs_data.item(0).get(colKey) );","","              //","              //  March thru the dataset, operating on the 'calc' item","              //","              rs_data.each( function(item) {","","                  var rflt = parseFloat( item.get(colKey) );","","                  if ( lcalc.search(/{sum}/) !== -1 || avg !==-1 )","                      rcalc += rflt;","","                  else if ( lcalc.search(/{min}/) !== -1 )","                      rcalc = Math.min( rcalc, rflt );","","                  else if ( lcalc.search(/{max}/) !== -1 )","                      rcalc = Math.max( rcalc, rflt );","","                  else","                      rcalc = calc;","              });","","              //","              //  Post-process the data (mostly for averages) prior to returning","              //","              if ( avg !== -1 )","                  rcalc = ( !rs_data.isEmpty() ) ? ( parseFloat(rcalc)/parseFloat(rs_data.size()) ) : 0;","","              return parseFloat(rcalc);   // processed later in formatFootCell to proper output format","","          }","","          if ( Y.Lang.isNumber(calc) )","              return calc;","","          if ( Y.Lang.isFunction(calc) ) {","              var rtn = calc.call(this,rs_data);","              return rtn;","          }","      },","","","      /**","       * Calculates a DataSet summary item defined in 'calc' for the given colKey, by","       *","       * @method formatFootCell","       * @param {String} col  The column key name to be calculated","       * @param {String} foot_col    A recognizable calc setting from above","       * @return {Float} the return value","       * @public","       */","      formatFootCell: function( col, foot_col ) {","","          if ( !foot_col.content ) return '';","","          var rval = this.calcDatasetValue( foot_col.key, foot_col.content );	// get the calculated item ...","","          //","          // See if a custom formatter is defined ...","          //   first check the footer.column for a formatter,","          //   then use the column.formatter,","          //   or none","          // TODO: allow standard named formatters and/or function names {String}","          //","          var fmtr = ( foot_col.formatter && Y.Lang.isFunction(foot_col.formatter) ) ? foot_col.formatter :","              ( col.formatter && Y.Lang.isFunction(col.formatter) ) ? col.formatter : null;","","          rval = ( fmtr ) ? fmtr.call( this, {value:rval, column:col} ) : rval;","","          if ( Y.Lang.isFunction(foot_col.content) ) {","              return rval;","          } else {","              var ctag = foot_col.content.match(/{.*}/)[0] || null,","                  srtn = foot_col.content;","              if ( ctag && Y.Lang.isString(ctag) )","                  srtn = srtn.replace(ctag,rval);","               return srtn;","             // return this.fnReplace( foot_col.content, repl_obj);","          }","      },","","      /**","       * Refreshes the summary items in the footer view and populates the footer","       *  elements based on the current \"data\" contents.","       *","       * @method refreshFooter","       * @return this","       * @chainable","       * @public","       */","      refreshFooter: function(){","          var table_obj = this._dt,","              foot_cont = table_obj._tfootNode, // this.get('container').one('tfoot'),","              td_nodes  = foot_cont.all('th,td');","","          //","          // Loop through each footer \"cell\" (i.e. either a TH or TD) and","          Y.Array.each( this.node_cols, function(fitem,findex) {","              var td_html;","              if ( fitem.th ) {","                  var replacer_obj = {","                      ROW_COUNT : table_obj.data.size(),","                      COL_COUNT : table_obj.get('columns').length,","                      DATE:       Y.DataType.Date.format( new Date(), { format: this.get(\"dateFormat\") }),","                      TIME:       Y.DataType.Date.format( new Date(), { format: this.get(\"timeFormat\") })","                  };","","                  Y.Object.each(replacer_obj,function(val,key,obj){","                      obj[ key.toLowerCase() ] = val;","                  });","","                  td_html = this.fnReplace( fitem.th.content, replacer_obj );","              }","","              if ( !fitem.th && fitem.content ) {","                  td_html = this.formatFootCell( fitem, fitem.foot_cfg);","              }","","              if ( td_html ) td_nodes.item(findex).setHTML(td_html);","","          }, this);","","          return this;","","      },","","      /**","       * For scrollable tables only, adjusts the sizes of the TFOOT cells to match the widths","       * of the THEAD cells.","       *","       * @method resizeFooter","       * @return this","       * @public","       * @chainable","       **/","      resizeFooter : function() {","          var table_obj = this._dt,","              thead = table_obj.get('contentBox').one('.'+table_obj.getClassName('scroll','columns')),","              tfootNode = this._dt._tfootNode,","              tfoot_nodes = tfootNode.all('th,td');","","          if( table_obj._yScroll ) {","","              function _getNumericStyle(node,style){","                  var style  = node.getComputedStyle(style),","                      nstyle = (style) ? +(style.replace(/px/,'')) : 0;","                  return nstyle;","              }","","              var thead_ths = thead.all('th');","","              Y.Array.each( this.node_cols, function(col,i) {","                  var col_width = 0.,","                      thead_th;","                  if ( col.th ) {","                      for(var j=0; j<col.th.colspan; j++) {","                          thead_th = thead_ths.item(col.index+j);","                          col_width += _getNumericStyle(thead_th,'width');","                      }","                      col_width += col.th.colspan-1;  // subtract the 1px border between columns spanned","                  } else {","                      thead_th  = thead_ths.item(col.index);","                      col_width = _getNumericStyle(thead_th,'width')-20;  // 20 is the padding","                  }","                  tfoot_nodes.item(i).setStyle('width',col_width+'px');","              });","          }","","          return this;","      },","","","// --------------------------------------------------------------------------------","//               Protected Methods","// --------------------------------------------------------------------------------","","      /**","       * Method that builds a separate TABLE / TFOOT container outside of the Y-scrolling","       *  container and places the view \"container\" within this.","       *","       * This is specifically required for a \"fixed\" footer ... i.e. with a scrolling DataTable,","       * where the footer is expected to remain stationary as the records are scrolled through.","       *","       *  NOTE: A bug exists where the viewFooter container (TFOOT) is improperly placed within","       *        the y-scroller container (http://yuilibrary.com/projects/yui3/ticket/2531723)","       *        This function is a workaround for that.","       * @method _buildFixedFooter","       * @private","       */","      _buildFixedFooter : function() {","          var fixedFooter   = this._yScrollFooter,    // Node for footer containing TABLE element","              tfoot         = this._tfootNode,","              yScrollHeader = this._yScrollHeader,    // header TABLE","              yScroller     = this._yScrollContainer; // Node for the DIV containing header TABLE, data TABLE and footer TABLE","","          if (!fixedFooter) {","              var tmpl = '<table cellspacing=\"0\" aria-hidden=\"true\" class=\"{className}\"></table>';","","              //","              // Create a new TABLE, to hold the TFOOT as a fixed element \"outside\" of yScroller","              //","              fixedFooter =  Y.Node.create(","                  Y.Lang.sub(this._Y_SCROLL_FOOTER_TEMPLATE || this.foot.TMPL_table_fixed  || tmpl, {","                      className: this.getClassName('footer')","                      //    className: this.getClassName('scroll','footer')","                  }));","              this._yScrollFooter = fixedFooter;","","              yScroller.append(fixedFooter);","","              //","              //  Move the already created TFOOT from the old incorrect location","              //   to within the new TABLE in \"fixedFooter\" location","              //","              var tfootNode = this.get('contentBox').one('table > tfoot');","              this._tfootNode = tfootNode;","              if ( tfootNode ) {","                  this._yScrollFooter.append( tfootNode );","                  this.foot.resizeFooter();","              }","          }","","      }","","  });","","","}, 'gallery-2012.08.15-20-00' ,{requires:['base-build','datatable-base','view'], skinnable:true});"];
_yuitest_coverage["/build/gallery-datatable-footerview/gallery-datatable-footerview.js"].lines = {"1":0,"91":0,"206":0,"209":0,"212":0,"215":0,"216":0,"220":0,"232":0,"233":0,"235":0,"236":0,"246":0,"247":0,"265":0,"275":0,"280":0,"284":0,"289":0,"296":0,"297":0,"302":0,"303":0,"304":0,"310":0,"321":0,"327":0,"328":0,"330":0,"331":0,"332":0,"349":0,"350":0,"351":0,"352":0,"353":0,"354":0,"358":0,"360":0,"362":0,"363":0,"371":0,"372":0,"373":0,"375":0,"380":0,"386":0,"387":0,"389":0,"395":0,"397":0,"438":0,"443":0,"444":0,"452":0,"453":0,"454":0,"455":0,"460":0,"461":0,"466":0,"468":0,"470":0,"471":0,"473":0,"474":0,"476":0,"477":0,"480":0,"486":0,"487":0,"489":0,"493":0,"494":0,"496":0,"497":0,"498":0,"514":0,"516":0,"525":0,"528":0,"530":0,"531":0,"533":0,"535":0,"536":0,"537":0,"552":0,"558":0,"559":0,"560":0,"561":0,"568":0,"569":0,"572":0,"575":0,"576":0,"579":0,"583":0,"597":0,"602":0,"604":0,"605":0,"607":0,"610":0,"612":0,"613":0,"615":0,"616":0,"617":0,"618":0,"620":0,"622":0,"623":0,"625":0,"629":0,"651":0,"656":0,"657":0,"662":0,"667":0,"669":0,"675":0,"676":0,"677":0,"678":0,"679":0};
_yuitest_coverage["/build/gallery-datatable-footerview/gallery-datatable-footerview.js"].functions = {"initializer:205":0,"(anonymous 2):232":0,"destructor:231":0,"render:245":0,"(anonymous 3):296":0,"(anonymous 5):351":0,"(anonymous 4):349":0,"(anonymous 6):371":0,"renderFooter:264":0,"(anonymous 7):466":0,"calcDatasetValue:436":0,"formatFootCell:512":0,"(anonymous 9):568":0,"(anonymous 8):558":0,"refreshFooter:551":0,"_getNumericStyle:604":0,"(anonymous 10):612":0,"resizeFooter:596":0,"_buildFixedFooter:650":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-datatable-footerview/gallery-datatable-footerview.js"].coveredLines = 127;
_yuitest_coverage["/build/gallery-datatable-footerview/gallery-datatable-footerview.js"].coveredFunctions = 20;
_yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 1);
YUI.add('gallery-datatable-footerview', function(Y) {

 /**
  FooterView is a YUI View class extension that provides a simple, one row summary row
  to a Datatable. This view provides
  for a summary row appended to the bottom of the DataTable TBODY, typically consisting
  of **one** TH element (with a colspan) and several TD elements for each desired column
  where a "calculated field" is desired.

  View configuration provides for calculated fields based upon the all of the available
  dataset fields within the DataTable's "ModelList".

  The view works with either non-scrolling or scrolling DataTables, and allows for either a
  "fixed" view, wherein the footer remains fixed at the bottom of the DataTable contentBox
  while the table is scrolled.

  #### Calculated Fields

  The current implementation supports the following calculated fields, where they are
  identified by their placeholder tag for replacement via Y.sub (case insensitive);

  * `{sum}` Calculate the arithmetic sum of the specified column in dataset
  * `{min}` Calculate the minimum value of the specified column in dataset
  * `{max}` Calculate the maximum value of the specified column in dataset
  * `{avg}` Calculate the arithmetic average of the of the specified column (synonyms `{mean}`, `{average}`)

  Also, non-looping calcs are;

  *  `{row_count}` Returns the number of rows in the dataset
  *  `{col_count}` Returns the number of columns in the dataset (no visibility check)
  *  `{date}` Returns the current date
  *  `{time}` Returns the current time

  #### Configuration

  YUI 3.6.0 DataTable supports attributes including `footerView` and `footerConfig`.

  This FooterView recognizes the following attributes, which must be configured via the
  DataTable {configs} (see usage example below);

  * [`fixed`](#attr_fixed) : Flag indicating if footer should be fixed or floating
  * [`heading`](#attr_heading) : Object, defining the single TH as;
     * [`colspan`](#attr_heading.colspan) : Number of columns to merge from left for the TH
     * [`content`](#attr_heading.content) : A string indicating the content of the TH for the footer
     * [`className`](#attr_heading.className) : Additional classname for TH
  * [`columns`](#attr_columns) : Array of objects, one per desired TD column in footer as;
     * [`key`](#attr_columns.key) : `key` name from the DataTable columns
     * [`content`](#attr_columns.content) : String indicating the contents of this TD
     * [`className`](#attr_columns.className) : Additional classname for TD
     * [`formatter`](#attr_columns.formatter) : Formatter to apply to this column result
  * [`dateFormat`](#attr_dateFormat) : Format string to use for any {date} fields
  * [`timeFormat`](#attr_timeFormat) : Format string to use for any {time} fields

  Additionally the user can provide a valid function as a column `content` to calculate a
  custom entry for a column (see [`columns.content`](#attr_columns.content))

  #### Usage

      var dtable = new Y.DataTable({
          columns:    ['EmpId','FirstName','LastName','NumClients','SalesTTM'],
          data:       AccountMgr.Sales,
          scrollable: 'y',
          height:     '250px',
          width:      '400px',

          footerView:   Y.FooterView,
          footerConfig: {
              fixed:   true,
              heading: {
                  colspan:	3,
                  content:	"Sales Totals for {row_count} Account Mgrs : &nbsp;",
                  className:	"align-right"
              },
              columns: [
                  { key:'NumClients', content:"{Avg} avg", className:"clientAvg" },
                  { key:'SalesTTM',   content:"{sum}", className:"salesTotal", formatter:fmtCurrency }
              ]
          }
      });

      dtable.render('#salesDT');


  @module FooterView
  @class Y.FooterView
  @extends Y.View
  @author Todd Smith
  @version 1.1.0
  @since 3.6.0
  **/
 _yuitest_coverfunc("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 91);
Y.FooterView = Y.Base.create( 'tableFooter', Y.View, [], {

      /**
       Defines the default TD HTML template for a calculated field within the footer
       @property TMPL_td
       @type String
       @default '<td class="yui3-datatable-even {tdClass}">{content}</td>'
       @static
       @since 3.6.0
       @protected
       **/
      TMPL_td: '<td class="yui3-datatable-even {tdClass}">{content}</td>',

      /**
       Defines the default TH HTML template for the header content within the footer
       @property TMPL_th
       @type String
       @default '<th colspan="{colspan}" class="{thClass}">{content}</th>'
       @static
       @since 3.6.0
       @protected
       **/
      TMPL_th: '<th colspan="{colspan}" class="{thClass}">{content}</th>',

      /**
       Defines the default TR HTML template for the footer
       @property TMPL_tr
       @type String
       @default '<tr>{th_content}{td_content}</tr>'
       @static
       @since 3.6.0
       @protected
       **/
      TMPL_tr:    '<tr>{th_content}{td_content}</tr>',

      /**
       Defines the default TFOOT HTML template for the footer
       @property TMPL_tfoot
       @type String
       @default '<tfoot class="{footClass}"><tr>{th_content}{td_content}</tr></tfoot>'
       @static
       @since 3.6.0
       @protected
       **/
      TMPL_tfoot: '<tfoot class="{footClass}"><tr>{th_content}{td_content}</tr></tfoot>',


      /**
       Defines the default TABLE HTML template for the "fixed" footer type ... i.e. with scrolling
       @property TMPL_table_fixed
       @type String
       @default '<table cellspacing="0" aria-hidden="true" class="{className}"></table>'
       @static
       @since 3.6.0
       @protected
       **/
      TMPL_table_fixed: '<table cellspacing="0" aria-hidden="true" class="{className}"></table>',


      dateFormat:  '%D',
      timeFormat:  '%T',

      // replacer function
      fnReplace  : Y.Lang.sub,

      /**
       Storage array of objects, each object represents a rendered "cell or column" within the
       footer view.  The first element is typically a TH element (with a colspan), and the
       remaining elements are the TD's for each requested footer field.

       Created and populated by the render() method

       @property node_cols
       @type Array of Object hashes
       @default null
       @static
       @since 3.6.0
       @protected
       **/
      node_cols : null,   // array of col_key map (e.g. '_head', null, 'f_name' )

      /**
       Placeholder for subscriber event handles, used to destroy cleanly
       @property _subscr
       @type {EventHandles} Array of eventhandles
       @default null
       @static
       @since 3.6.0
       @private
       **/
      _subscr : null,

      /**
       DataTable instance that utilizes this footerview, derived from initializer "config.host"
       Used to reference changes to DT modellist, and to retrieve the underlying "data"

       @property _dt
       @type Y.DataTable
       @default null
       @static
       @since 3.6.0
       @private
       **/
      _dt: null,

      /**
       * Called when view is initialized.  Stores reference to calling DataTable and
       *  creates listeners to link building or refreshing the footer back to the
       *  parent DataTable.
       *
       * @method initializer
       * @param {Object} config
       * @protected
       */
      initializer: function(config) {
          _yuitest_coverfunc("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", "initializer", 205);
_yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 206);
config || (config={});

          // Set a reference to the calling DataTable
          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 209);
this._dt = ( config.source ) ? config.source :  config.host;    // reference to DT instance

          // Setup listeners ...
          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 212);
this._subscr = [];

          //  ... For scrollable with fixed footer, we have to build a new TABLE and append outside of scrolling ...
          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 215);
if ( config.footerConfig && config.footerConfig.fixed && this._dt.get('scrollable') ) {
              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 216);
this._subscr.push( Y.Do.after( this._buildFixedFooter, this._dt, '_syncScrollUI', this._dt) );
          }

          // Listen for changes on the DataTable "data" ...
          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 220);
this._subscr.push( this._dt.data.after(['*:change','*:add','*:create', '*:remove', '*:reset'], Y.bind('refreshFooter', this) ) );

      },

      /**
       * Default destructor method, cleans up the listeners that were created and
       *  removes and/or empties the created DOM elements for the footerView.
       *
       * @method destructor
       * @protected
       */
      destructor: function () {
          _yuitest_coverfunc("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", "destructor", 231);
_yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 232);
Y.Array.each(this._subscr,function(item){
              _yuitest_coverfunc("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", "(anonymous 2)", 232);
_yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 233);
item.detach();
          });
          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 235);
this._dt._tfootNode.empty();
          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 236);
if ( this._dt._yScrollFooter ) {this._dt._yScrollFooter.empty();}
      },


      /**
       * Calls the helper function to construct and render the initial footer
       * @method render
       * @chainable
       */
      render: function() {
          _yuitest_coverfunc("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", "render", 245);
_yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 246);
this.renderFooter();
          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 247);
return this;
      },

// --------------------------------------------------------------------------------
//               Public Methods
// --------------------------------------------------------------------------------

      /**
       * Creates the DOM elements and attaches them to the footerView container.
       *  Reads the configuration parameters (i.e. from DataTable's config as "footerConfig")
       *  and structures a single TR element, with a leading TH in first column, and the
       *  requested TD elements following.
       *
       * @method renderFooter
       * @public
       * @chainable
       */
      renderFooter: function(){
          _yuitest_coverfunc("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", "renderFooter", 264);
_yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 265);
var foot_cont = this.get('container'),      // reference to the TFOOT, created by DataTable
              table_obj = this._dt,                   // reference to the parent DataTable instance
              columns   = table_obj.get('columns'),   // reference to the ModelList / or DataTable.data
              rs_data   = table_obj.get("data"),      // reference to the ModelList / or DataTable.data
              foot_cfg  = table_obj.get('footerConfig'),    // placeholder for the 'footer' config
              foot_cols = foot_cfg.columns,           // placeholder for the 'footer'.config.columns entry
              tfoot_th  = '',                         // the string for the TH node
              tfoot_td  = '',                         // the string for the TD node
              cspan     = 1;                          // colSpan entry for TH, default to 1

          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 275);
this.node_cols = [];

          //
          //  Initialize date and time formats
          //
          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 280);
this.dateFormat = ( foot_cfg && foot_cfg.dateFormat ) ? foot_cfg.dateFormat
              : ( table_obj.get('dateFormat') ) ? table_obj.get('dateFormat')
              : this.dateFormat;

          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 284);
this.timeFormat = ( foot_cfg && foot_cfg.timeFormat ) ? foot_cfg.timeFormat
              : ( table_obj.get('timeFormat') ) ? table_obj.get('timeFormat')
              : this.timeFormat;

          // define a default replacer object ...
          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 289);
var replacer_obj = {
              ROW_COUNT : rs_data.size(),
              COL_COUNT : columns.length,
              DATE:       Y.DataType.Date.format( new Date(), { format: this.dateFormat }),
              TIME:       Y.DataType.Date.format( new Date(), { format: this.timeFormat })
          };
          // duplicate above, for lowercase
          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 296);
Y.Object.each(replacer_obj,function(val,key,obj){
              _yuitest_coverfunc("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", "(anonymous 3)", 296);
_yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 297);
obj[ key.toLowerCase() ] = val;
          });
          //
          //  Process the TH part
          //
          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 302);
if ( foot_cfg.heading ) {
              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 303);
cspan = foot_cfg.heading.colspan || cspan;
              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 304);
tfoot_th = this.fnReplace( this.TMPL_th, {
                  colspan: cspan,
                  thClass: ' ' + (foot_cfg.heading.className || ''),
                  content: this.fnReplace( foot_cfg.heading.content, replacer_obj )
              });

              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 310);
var th_item = {
                  index:		0,
                  key:		0,
                  td:			null,
                  th:         foot_cfg.heading,
                  className:	foot_cfg.className || '',
                  formatter:	'',
                  content:    null
              };

              // save this for later ... used by refreshFooter
              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 321);
this.node_cols.push(th_item);
          }

          //
          //  Make an array for the remainder TD's in the Footer
          //
          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 327);
var num_tds = columns.length - cspan;
          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 328);
var td_html = [];	// an array of objects to hold footer TD (non-TH!) data

          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 330);
for(var i=cspan; i<columns.length; i++) {
              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 331);
var titem = columns[i];
              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 332);
td_html.push({
                  index:		i,
                  key:		titem.key,
                  td:			null,
                  th:         null,
                  className:	titem.className || '',
                  formatter:	titem.formatter || '',
                  content:    null  //titem.content || null
              });
          }

          //
          //  Augment the Footer TD's, by inserting computed values from 'footer' config
          //
          //   Note: Users may enter footer 'columns' in non-ascending order, thus
          //         necessitating the search for column key ...
          //
          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 349);
Y.Array.each( foot_cols, function(fitem){
              _yuitest_coverfunc("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", "(anonymous 4)", 349);
_yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 350);
var imatch = -1;
              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 351);
Y.Array.some( td_html, function(item,index) {
                  _yuitest_coverfunc("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", "(anonymous 5)", 351);
_yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 352);
if ( item.key === fitem.key ) {
                      _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 353);
imatch = index;
                      _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 354);
return true;	// true ends the loop ... so this is 'find a first'
                  }
              });

              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 358);
if ( imatch !== -1) {
                  // go ahead and calculate the value for this cell, while we are building it ...
                  _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 360);
td_html[imatch].td = this.formatFootCell( td_html[imatch], fitem );

                  _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 362);
td_html[imatch].content = fitem.content || null;
                  _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 363);
td_html[imatch].foot_cfg = fitem;
              }

          }, this);

          //
          //  and Build out the TD string ... looping over the non-TH columns
          //
          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 371);
Y.Array.each( td_html, function(item){
              _yuitest_coverfunc("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", "(anonymous 6)", 371);
_yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 372);
item.td = item.td || '';	// if nothing defined, fill with ''
              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 373);
item.content = item.content || null;

              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 375);
tfoot_td += this.fnReplace( this.TMPL_td, {
                  tdClass: item.className || '',
                  content: item.td
              });

              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 380);
this.node_cols.push( item );
          }, this);

          //
          //  Now construct the TR and the outer TFOOT and add it
          //
          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 386);
var trClass = this._dt.getClassName('footer');
          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 387);
tr_tmpl = this.TMPL_tfoot;

          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 389);
var tr = this.fnReplace( tr_tmpl, {
              footClass:  trClass,
              th_content: tfoot_th,
              td_content: tfoot_td
          });

          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 395);
var foot_tr = foot_cont.append( Y.Node.create(tr) );

          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 397);
return this;

      },


      /**
       * Calculates a DataSet summary item defined in 'calc' for the given colKey, by
       *   looping through the current "data" (i.e. Recordset).
       *
       *   Currently, the 'calc' is set to lowercase ...
       *
       * Example calc settings are as follows (for given 'colKey');
       *
       * {sum}		Calculate the arithmetic sum of dataset
       * {min}		Calculate the minimum value within the dataset
       * {max}		Calculate the maximum value within the dataset
       * {avg}		Calculate the arithmetic average of the datset
       *                (synonyms are {mean}, {average})
       *
       * Also, non-dataset iterating calcs are;
       *  {row_count}	 Returns the number of rows in the dataset
       *  {col_count}  Returns the number of columns in the dataset (no visibility check)
       *  {date}		 Returns the current date (via dateFormat setting)
       *  {time}		 Returns the current time (via timeFormat setting)
       *
       * If 'calc' argument is a function(), then call it (in the "this" context of this
       *  FooterView) with one argument, the DataTable.data property.
       *
       *  // TODO:  Consider one call to this (with mult keys) for one loop thru only ...
       *
       * // not a really possible use case, but ...
       *   ? whatif user tries to enter calc='this is a {sum} and {min} value' ??
       *
       * @method calcDatasetValue
       * @param {String} colKey  The column key name to be calculated
       * @param {String} calc    A recognizable calc setting from above
       * @return {Number} the return value
       * @public
       */
      calcDatasetValue: function(colKey, calc) {

          _yuitest_coverfunc("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", "calcDatasetValue", 436);
_yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 438);
var rs_data = this._dt.get("data"),    // this is a modelList currently
              rcalc   = 0,
              rmin    = Number.POSITIVE_INFINITY,
              rmax    = Number.POSITIVE_INFINITY;

          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 443);
if ( Y.Lang.isString(calc) ) {
              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 444);
var lcalc = calc.toLowerCase(),
                  avg   = lcalc.search(/{average}|{avg}|{mean}/i);  // a flag for knowing if averaging is to be done

              //
              //  initial case, if non-summary item, just return it!
              //   Note: these probably shouldn't be used in a TD column,
              //        but sometimes people may do this ...
              //
              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 452);
if ( lcalc.search(/{row_count}/) !== -1 ) 	{return rs_data.size();}
              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 453);
if ( lcalc.search(/{col_count}/) !== -1  ) 	{return this._dt.get("columns").length;}
              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 454);
if ( lcalc.search(/{date}/) !== -1  )		{return Y.DataType.Date.format( new Date(), { format: this.dateFormat });}
              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 455);
if ( lcalc.search(/{time}/) !== -1  )		{return Y.DataType.Date.format( new Date(), { format: this.timeFormat });}

              //
              //  If a min or max, set initial value to first
              //
              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 460);
if ( lcalc.search(/{min}|{max}/) !== -1 )
                  {_yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 461);
rcalc = parseFloat(rs_data.item(0).get(colKey) );}

              //
              //  March thru the dataset, operating on the 'calc' item
              //
              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 466);
rs_data.each( function(item) {

                  _yuitest_coverfunc("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", "(anonymous 7)", 466);
_yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 468);
var rflt = parseFloat( item.get(colKey) );

                  _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 470);
if ( lcalc.search(/{sum}/) !== -1 || avg !==-1 )
                      {_yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 471);
rcalc += rflt;}

                  else {_yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 473);
if ( lcalc.search(/{min}/) !== -1 )
                      {_yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 474);
rcalc = Math.min( rcalc, rflt );}

                  else {_yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 476);
if ( lcalc.search(/{max}/) !== -1 )
                      {_yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 477);
rcalc = Math.max( rcalc, rflt );}

                  else
                      {_yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 480);
rcalc = calc;}}}
              });

              //
              //  Post-process the data (mostly for averages) prior to returning
              //
              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 486);
if ( avg !== -1 )
                  {_yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 487);
rcalc = ( !rs_data.isEmpty() ) ? ( parseFloat(rcalc)/parseFloat(rs_data.size()) ) : 0;}

              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 489);
return parseFloat(rcalc);   // processed later in formatFootCell to proper output format

          }

          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 493);
if ( Y.Lang.isNumber(calc) )
              {_yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 494);
return calc;}

          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 496);
if ( Y.Lang.isFunction(calc) ) {
              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 497);
var rtn = calc.call(this,rs_data);
              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 498);
return rtn;
          }
      },


      /**
       * Calculates a DataSet summary item defined in 'calc' for the given colKey, by
       *
       * @method formatFootCell
       * @param {String} col  The column key name to be calculated
       * @param {String} foot_col    A recognizable calc setting from above
       * @return {Float} the return value
       * @public
       */
      formatFootCell: function( col, foot_col ) {

          _yuitest_coverfunc("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", "formatFootCell", 512);
_yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 514);
if ( !foot_col.content ) {return '';}

          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 516);
var rval = this.calcDatasetValue( foot_col.key, foot_col.content );	// get the calculated item ...

          //
          // See if a custom formatter is defined ...
          //   first check the footer.column for a formatter,
          //   then use the column.formatter,
          //   or none
          // TODO: allow standard named formatters and/or function names {String}
          //
          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 525);
var fmtr = ( foot_col.formatter && Y.Lang.isFunction(foot_col.formatter) ) ? foot_col.formatter :
              ( col.formatter && Y.Lang.isFunction(col.formatter) ) ? col.formatter : null;

          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 528);
rval = ( fmtr ) ? fmtr.call( this, {value:rval, column:col} ) : rval;

          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 530);
if ( Y.Lang.isFunction(foot_col.content) ) {
              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 531);
return rval;
          } else {
              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 533);
var ctag = foot_col.content.match(/{.*}/)[0] || null,
                  srtn = foot_col.content;
              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 535);
if ( ctag && Y.Lang.isString(ctag) )
                  {_yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 536);
srtn = srtn.replace(ctag,rval);}
               _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 537);
return srtn;
             // return this.fnReplace( foot_col.content, repl_obj);
          }
      },

      /**
       * Refreshes the summary items in the footer view and populates the footer
       *  elements based on the current "data" contents.
       *
       * @method refreshFooter
       * @return this
       * @chainable
       * @public
       */
      refreshFooter: function(){
          _yuitest_coverfunc("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", "refreshFooter", 551);
_yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 552);
var table_obj = this._dt,
              foot_cont = table_obj._tfootNode, // this.get('container').one('tfoot'),
              td_nodes  = foot_cont.all('th,td');

          //
          // Loop through each footer "cell" (i.e. either a TH or TD) and
          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 558);
Y.Array.each( this.node_cols, function(fitem,findex) {
              _yuitest_coverfunc("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", "(anonymous 8)", 558);
_yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 559);
var td_html;
              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 560);
if ( fitem.th ) {
                  _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 561);
var replacer_obj = {
                      ROW_COUNT : table_obj.data.size(),
                      COL_COUNT : table_obj.get('columns').length,
                      DATE:       Y.DataType.Date.format( new Date(), { format: this.get("dateFormat") }),
                      TIME:       Y.DataType.Date.format( new Date(), { format: this.get("timeFormat") })
                  };

                  _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 568);
Y.Object.each(replacer_obj,function(val,key,obj){
                      _yuitest_coverfunc("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", "(anonymous 9)", 568);
_yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 569);
obj[ key.toLowerCase() ] = val;
                  });

                  _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 572);
td_html = this.fnReplace( fitem.th.content, replacer_obj );
              }

              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 575);
if ( !fitem.th && fitem.content ) {
                  _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 576);
td_html = this.formatFootCell( fitem, fitem.foot_cfg);
              }

              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 579);
if ( td_html ) {td_nodes.item(findex).setHTML(td_html);}

          }, this);

          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 583);
return this;

      },

      /**
       * For scrollable tables only, adjusts the sizes of the TFOOT cells to match the widths
       * of the THEAD cells.
       *
       * @method resizeFooter
       * @return this
       * @public
       * @chainable
       **/
      resizeFooter : function() {
          _yuitest_coverfunc("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", "resizeFooter", 596);
_yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 597);
var table_obj = this._dt,
              thead = table_obj.get('contentBox').one('.'+table_obj.getClassName('scroll','columns')),
              tfootNode = this._dt._tfootNode,
              tfoot_nodes = tfootNode.all('th,td');

          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 602);
if( table_obj._yScroll ) {

              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 604);
function _getNumericStyle(node,style){
                  _yuitest_coverfunc("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", "_getNumericStyle", 604);
_yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 605);
var style  = node.getComputedStyle(style),
                      nstyle = (style) ? +(style.replace(/px/,'')) : 0;
                  _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 607);
return nstyle;
              }

              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 610);
var thead_ths = thead.all('th');

              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 612);
Y.Array.each( this.node_cols, function(col,i) {
                  _yuitest_coverfunc("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", "(anonymous 10)", 612);
_yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 613);
var col_width = 0.,
                      thead_th;
                  _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 615);
if ( col.th ) {
                      _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 616);
for(var j=0; j<col.th.colspan; j++) {
                          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 617);
thead_th = thead_ths.item(col.index+j);
                          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 618);
col_width += _getNumericStyle(thead_th,'width');
                      }
                      _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 620);
col_width += col.th.colspan-1;  // subtract the 1px border between columns spanned
                  } else {
                      _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 622);
thead_th  = thead_ths.item(col.index);
                      _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 623);
col_width = _getNumericStyle(thead_th,'width')-20;  // 20 is the padding
                  }
                  _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 625);
tfoot_nodes.item(i).setStyle('width',col_width+'px');
              });
          }

          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 629);
return this;
      },


// --------------------------------------------------------------------------------
//               Protected Methods
// --------------------------------------------------------------------------------

      /**
       * Method that builds a separate TABLE / TFOOT container outside of the Y-scrolling
       *  container and places the view "container" within this.
       *
       * This is specifically required for a "fixed" footer ... i.e. with a scrolling DataTable,
       * where the footer is expected to remain stationary as the records are scrolled through.
       *
       *  NOTE: A bug exists where the viewFooter container (TFOOT) is improperly placed within
       *        the y-scroller container (http://yuilibrary.com/projects/yui3/ticket/2531723)
       *        This function is a workaround for that.
       * @method _buildFixedFooter
       * @private
       */
      _buildFixedFooter : function() {
          _yuitest_coverfunc("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", "_buildFixedFooter", 650);
_yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 651);
var fixedFooter   = this._yScrollFooter,    // Node for footer containing TABLE element
              tfoot         = this._tfootNode,
              yScrollHeader = this._yScrollHeader,    // header TABLE
              yScroller     = this._yScrollContainer; // Node for the DIV containing header TABLE, data TABLE and footer TABLE

          _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 656);
if (!fixedFooter) {
              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 657);
var tmpl = '<table cellspacing="0" aria-hidden="true" class="{className}"></table>';

              //
              // Create a new TABLE, to hold the TFOOT as a fixed element "outside" of yScroller
              //
              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 662);
fixedFooter =  Y.Node.create(
                  Y.Lang.sub(this._Y_SCROLL_FOOTER_TEMPLATE || this.foot.TMPL_table_fixed  || tmpl, {
                      className: this.getClassName('footer')
                      //    className: this.getClassName('scroll','footer')
                  }));
              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 667);
this._yScrollFooter = fixedFooter;

              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 669);
yScroller.append(fixedFooter);

              //
              //  Move the already created TFOOT from the old incorrect location
              //   to within the new TABLE in "fixedFooter" location
              //
              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 675);
var tfootNode = this.get('contentBox').one('table > tfoot');
              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 676);
this._tfootNode = tfootNode;
              _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 677);
if ( tfootNode ) {
                  _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 678);
this._yScrollFooter.append( tfootNode );
                  _yuitest_coverline("/build/gallery-datatable-footerview/gallery-datatable-footerview.js", 679);
this.foot.resizeFooter();
              }
          }

      }

  });


}, 'gallery-2012.08.15-20-00' ,{requires:['base-build','datatable-base','view'], skinnable:true});
