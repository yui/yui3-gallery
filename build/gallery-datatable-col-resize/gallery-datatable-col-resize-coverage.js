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
_yuitest_coverage["/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js",
    code: []
};
_yuitest_coverage["/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js"].code=["YUI.add('gallery-datatable-col-resize', function(Y) {","","    function DatatableColResizePlugin(config) {","        DatatableColResizePlugin.superclass.constructor.apply(this, arguments);","    }","","    // Define Static properties NAME (to identify the class) and NS (to identify the namespace)","    DatatableColResizePlugin.NAME = 'DatatableColResizePlugin';","    DatatableColResizePlugin.NS = 'ddr';","","    // Attribute definitions for the plugin","    DatatableColResizePlugin.ATTRS = {","    	gripClass:{value: 'grip'},","      ellipsis: {value: true}","","    };","","    // Extend Plugin.Base","    Y.extend(DatatableColResizePlugin, Y.Plugin.Base, {","","    _host : null,","","    initializer : function() {","      this._host = this.get('host');","      this._host.get('boundingBox').addClass(this._host.getClassName('resize'));","      if(this.get(\"ellipsis\")){","        this._host.get('boundingBox').addClass(this._host.getClassName('ellipsis'));","      }","      this.afterHostEvent('render', function(e){","      	var thead = this._host.get('boundingBox').one(\"thead\");","      	var cells = thead.all(\"th\");","      	this._afterHostSetHeaders(cells);","      }, this)","    },","","    /**","     * House keeping after a we are unplugged","     *","     */","    destructor : function() {","      this._host.get('boundingBox').removeClass(this._host.getClassName('resize'));","      this._host.get('boundingBox').removeClass(this._host.getClassName('ellipsis'));","      this._removeGrips();","    },","","","    //  P R O T E C T E D  //","","    /**","     *","     */","    _afterHostSetHeaders : function(headerCells) {","      this._removeGrips();","","      headerCells.each(function(cell){","        var grip = Y.Node.create('<span class=\"yui3-icon ' + this.get('gripClass') + '\"></span>');","","        grip.plug(Y.Plugin.Drag);","","        grip.dd.on('drag:drag', this._handleDrag, this);","","        grip.setData('target', cell);","","        grip.setStyle('opacity', (this.get('visible')) ? 1 : 0 );","","        cell.append(grip);","","      }, this);","    },","","    _handleDrag : function(e) {","      var handle = e.target.get('node'),","          target = handle.getData('target');","","      handle.setStyle('left', 'auto');","","      target.setStyle('width', e.target.actXY[0] + parseInt(target.getStyle('width'),10) - e.target.lastXY[0]);","","      // dont update the handle position","      e.preventDefault();","    },","","    _removeGrips : function() {","      this._host.get('boundingBox').all('.' + this.get('gripClass')).remove(true);","    }","","    });","","    Y.DatatableColResizePlugin = DatatableColResizePlugin;","","","}, 'gallery-2012.10.31-20-00' ,{requires:['plugin', 'datatable', 'node', 'dd-plugin'], skinnable:true});"];
_yuitest_coverage["/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js"].lines = {"1":0,"3":0,"4":0,"8":0,"9":0,"12":0,"19":0,"24":0,"25":0,"26":0,"27":0,"29":0,"30":0,"31":0,"32":0,"41":0,"42":0,"43":0,"53":0,"55":0,"56":0,"58":0,"60":0,"62":0,"64":0,"66":0,"72":0,"75":0,"77":0,"80":0,"84":0,"89":0};
_yuitest_coverage["/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js"].functions = {"DatatableColResizePlugin:3":0,"(anonymous 2):29":0,"initializer:23":0,"destructor:40":0,"(anonymous 3):55":0,"_afterHostSetHeaders:52":0,"_handleDrag:71":0,"_removeGrips:83":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js"].coveredLines = 32;
_yuitest_coverage["/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js"].coveredFunctions = 9;
_yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 1);
YUI.add('gallery-datatable-col-resize', function(Y) {

    _yuitest_coverfunc("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 3);
function DatatableColResizePlugin(config) {
        _yuitest_coverfunc("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", "DatatableColResizePlugin", 3);
_yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 4);
DatatableColResizePlugin.superclass.constructor.apply(this, arguments);
    }

    // Define Static properties NAME (to identify the class) and NS (to identify the namespace)
    _yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 8);
DatatableColResizePlugin.NAME = 'DatatableColResizePlugin';
    _yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 9);
DatatableColResizePlugin.NS = 'ddr';

    // Attribute definitions for the plugin
    _yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 12);
DatatableColResizePlugin.ATTRS = {
    	gripClass:{value: 'grip'},
      ellipsis: {value: true}

    };

    // Extend Plugin.Base
    _yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 19);
Y.extend(DatatableColResizePlugin, Y.Plugin.Base, {

    _host : null,

    initializer : function() {
      _yuitest_coverfunc("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", "initializer", 23);
_yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 24);
this._host = this.get('host');
      _yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 25);
this._host.get('boundingBox').addClass(this._host.getClassName('resize'));
      _yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 26);
if(this.get("ellipsis")){
        _yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 27);
this._host.get('boundingBox').addClass(this._host.getClassName('ellipsis'));
      }
      _yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 29);
this.afterHostEvent('render', function(e){
      	_yuitest_coverfunc("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", "(anonymous 2)", 29);
_yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 30);
var thead = this._host.get('boundingBox').one("thead");
      	_yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 31);
var cells = thead.all("th");
      	_yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 32);
this._afterHostSetHeaders(cells);
      }, this)
    },

    /**
     * House keeping after a we are unplugged
     *
     */
    destructor : function() {
      _yuitest_coverfunc("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", "destructor", 40);
_yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 41);
this._host.get('boundingBox').removeClass(this._host.getClassName('resize'));
      _yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 42);
this._host.get('boundingBox').removeClass(this._host.getClassName('ellipsis'));
      _yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 43);
this._removeGrips();
    },


    //  P R O T E C T E D  //

    /**
     *
     */
    _afterHostSetHeaders : function(headerCells) {
      _yuitest_coverfunc("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", "_afterHostSetHeaders", 52);
_yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 53);
this._removeGrips();

      _yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 55);
headerCells.each(function(cell){
        _yuitest_coverfunc("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", "(anonymous 3)", 55);
_yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 56);
var grip = Y.Node.create('<span class="yui3-icon ' + this.get('gripClass') + '"></span>');

        _yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 58);
grip.plug(Y.Plugin.Drag);

        _yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 60);
grip.dd.on('drag:drag', this._handleDrag, this);

        _yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 62);
grip.setData('target', cell);

        _yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 64);
grip.setStyle('opacity', (this.get('visible')) ? 1 : 0 );

        _yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 66);
cell.append(grip);

      }, this);
    },

    _handleDrag : function(e) {
      _yuitest_coverfunc("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", "_handleDrag", 71);
_yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 72);
var handle = e.target.get('node'),
          target = handle.getData('target');

      _yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 75);
handle.setStyle('left', 'auto');

      _yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 77);
target.setStyle('width', e.target.actXY[0] + parseInt(target.getStyle('width'),10) - e.target.lastXY[0]);

      // dont update the handle position
      _yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 80);
e.preventDefault();
    },

    _removeGrips : function() {
      _yuitest_coverfunc("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", "_removeGrips", 83);
_yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 84);
this._host.get('boundingBox').all('.' + this.get('gripClass')).remove(true);
    }

    });

    _yuitest_coverline("/build/gallery-datatable-col-resize/gallery-datatable-col-resize.js", 89);
Y.DatatableColResizePlugin = DatatableColResizePlugin;


}, 'gallery-2012.10.31-20-00' ,{requires:['plugin', 'datatable', 'node', 'dd-plugin'], skinnable:true});
