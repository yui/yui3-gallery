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
_yuitest_coverage["/build/gallery-widget-modalshim/gallery-widget-modalshim.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-widget-modalshim/gallery-widget-modalshim.js",
    code: []
};
_yuitest_coverage["/build/gallery-widget-modalshim/gallery-widget-modalshim.js"].code=["YUI.add('gallery-widget-modalshim', function(Y) {","","/**"," * 修复 Y.WidgetModality IE6 的问题"," */","","function ModalShim(config) {","    Y.after(this._renderUIModalShim, this, '_renderUIModal');","    Y.after(this._syncUIModalShim, this, '_syncUIModal');","}","","ModalShim.NAME = 'modal-shim';","ModalShim.ATTRS = {","    modalShim: {","        value: UA.ie === 6,","        validator: L.isBoolean","    }","};","ModalShim.CLASS_NAME = Widget.getClassName('modal', 'shim');","ModalShim.TEMPLATE = '<iframe class=\"' + ModalShim.CLASS_NAME + '\" frameborder=\"0\" title=\"Widget Modal Shim\" src=\"javascript:false\" tabindex=\"-1\" role=\"presentation\"></iframe>';","","ModalShim.prototype = {","    _renderUIModalShim: function() {","        this._uiSetModalShim(this.get('modalShim'));","    },","    _syncUIModalShim: function() {","        this._uiSetModalShim(this.get('modalShim'));","    },","    _uiSetModalShim: function(enable) {","        if(enable) {","            this._renderModalShim();","            this._addModalShimResizeHandlers();","        } else {","            this._destroyModalShim();","        }","    },","    _renderModalShim: function() {","        var modalShimNode = this._modalShimNode,","            maskNode = this.get('maskNode');","        if( ! modalShimNode) {","            modalShimNode = this._modalShimNode = this._getModalShimTemplate();","            maskNode.prepend(modalShimNode);","            this.sizeModalShim();","        }","    },","    _addModalShimResizeHandlers: function() {","        this._modalShimHandles || (this._modalShimHandles = []);","        var handles = this._modalShimHandles,","            sizeModalShim = this.sizeModalShim;","        handles.push(this.after('visibleChange', sizeModalShim));","        handles.push(this.after('WidthChange', sizeModalShim));","        handles.push(this.after('HeightChange', sizeModalShim));","        handles.push(this.after('contentUpdate', sizeModalShim));","    },","    _detachModalShimHandlers: function() {","        var handlers = this._modalShimHandles, handle;","        if(handlers && handlers.length > 0) {","            while((handle = handlers.pop())) {","                handle.detach();","            }","        }","    },","    sizeModalShim: function() {","        var shim = this._modalShimNode,","        maskNode = this.get('maskNode');","        if(shim && this.get('visible')) {","            shim.setStyles({","                width: maskNode.get('offsetWidth') + 'px',","                height: maskNode.get('offsetHeight') + 'px'","            });","        }","    },","    _getModalShimTemplate: function() {","        return Node.create(ModalShim.TEMPLATE);","    },","    _destroyModalShim: function() {","        this._modalShimNode.remove(true);","        this._detachModalShimHandlers();","    }","};","","Y.WidgetModalShim = ModalShim;","","","","","}, 'gallery-2012.09.26-20-36' ,{requires:['widget', 'widget-modality'], skinnable:true});"];
_yuitest_coverage["/build/gallery-widget-modalshim/gallery-widget-modalshim.js"].lines = {"1":0,"7":0,"8":0,"9":0,"12":0,"13":0,"19":0,"20":0,"22":0,"24":0,"27":0,"30":0,"31":0,"32":0,"34":0,"38":0,"40":0,"41":0,"42":0,"43":0,"47":0,"48":0,"50":0,"51":0,"52":0,"53":0,"56":0,"57":0,"58":0,"59":0,"64":0,"66":0,"67":0,"74":0,"77":0,"78":0,"82":0};
_yuitest_coverage["/build/gallery-widget-modalshim/gallery-widget-modalshim.js"].functions = {"ModalShim:7":0,"_renderUIModalShim:23":0,"_syncUIModalShim:26":0,"_uiSetModalShim:29":0,"_renderModalShim:37":0,"_addModalShimResizeHandlers:46":0,"_detachModalShimHandlers:55":0,"sizeModalShim:63":0,"_getModalShimTemplate:73":0,"_destroyModalShim:76":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-widget-modalshim/gallery-widget-modalshim.js"].coveredLines = 37;
_yuitest_coverage["/build/gallery-widget-modalshim/gallery-widget-modalshim.js"].coveredFunctions = 11;
_yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 1);
YUI.add('gallery-widget-modalshim', function(Y) {

/**
 * 修复 Y.WidgetModality IE6 的问题
 */

_yuitest_coverfunc("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 7);
function ModalShim(config) {
    _yuitest_coverfunc("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", "ModalShim", 7);
_yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 8);
Y.after(this._renderUIModalShim, this, '_renderUIModal');
    _yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 9);
Y.after(this._syncUIModalShim, this, '_syncUIModal');
}

_yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 12);
ModalShim.NAME = 'modal-shim';
_yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 13);
ModalShim.ATTRS = {
    modalShim: {
        value: UA.ie === 6,
        validator: L.isBoolean
    }
};
_yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 19);
ModalShim.CLASS_NAME = Widget.getClassName('modal', 'shim');
_yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 20);
ModalShim.TEMPLATE = '<iframe class="' + ModalShim.CLASS_NAME + '" frameborder="0" title="Widget Modal Shim" src="javascript:false" tabindex="-1" role="presentation"></iframe>';

_yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 22);
ModalShim.prototype = {
    _renderUIModalShim: function() {
        _yuitest_coverfunc("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", "_renderUIModalShim", 23);
_yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 24);
this._uiSetModalShim(this.get('modalShim'));
    },
    _syncUIModalShim: function() {
        _yuitest_coverfunc("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", "_syncUIModalShim", 26);
_yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 27);
this._uiSetModalShim(this.get('modalShim'));
    },
    _uiSetModalShim: function(enable) {
        _yuitest_coverfunc("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", "_uiSetModalShim", 29);
_yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 30);
if(enable) {
            _yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 31);
this._renderModalShim();
            _yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 32);
this._addModalShimResizeHandlers();
        } else {
            _yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 34);
this._destroyModalShim();
        }
    },
    _renderModalShim: function() {
        _yuitest_coverfunc("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", "_renderModalShim", 37);
_yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 38);
var modalShimNode = this._modalShimNode,
            maskNode = this.get('maskNode');
        _yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 40);
if( ! modalShimNode) {
            _yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 41);
modalShimNode = this._modalShimNode = this._getModalShimTemplate();
            _yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 42);
maskNode.prepend(modalShimNode);
            _yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 43);
this.sizeModalShim();
        }
    },
    _addModalShimResizeHandlers: function() {
        _yuitest_coverfunc("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", "_addModalShimResizeHandlers", 46);
_yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 47);
this._modalShimHandles || (this._modalShimHandles = []);
        _yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 48);
var handles = this._modalShimHandles,
            sizeModalShim = this.sizeModalShim;
        _yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 50);
handles.push(this.after('visibleChange', sizeModalShim));
        _yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 51);
handles.push(this.after('WidthChange', sizeModalShim));
        _yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 52);
handles.push(this.after('HeightChange', sizeModalShim));
        _yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 53);
handles.push(this.after('contentUpdate', sizeModalShim));
    },
    _detachModalShimHandlers: function() {
        _yuitest_coverfunc("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", "_detachModalShimHandlers", 55);
_yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 56);
var handlers = this._modalShimHandles, handle;
        _yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 57);
if(handlers && handlers.length > 0) {
            _yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 58);
while((handle = handlers.pop())) {
                _yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 59);
handle.detach();
            }
        }
    },
    sizeModalShim: function() {
        _yuitest_coverfunc("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", "sizeModalShim", 63);
_yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 64);
var shim = this._modalShimNode,
        maskNode = this.get('maskNode');
        _yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 66);
if(shim && this.get('visible')) {
            _yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 67);
shim.setStyles({
                width: maskNode.get('offsetWidth') + 'px',
                height: maskNode.get('offsetHeight') + 'px'
            });
        }
    },
    _getModalShimTemplate: function() {
        _yuitest_coverfunc("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", "_getModalShimTemplate", 73);
_yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 74);
return Node.create(ModalShim.TEMPLATE);
    },
    _destroyModalShim: function() {
        _yuitest_coverfunc("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", "_destroyModalShim", 76);
_yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 77);
this._modalShimNode.remove(true);
        _yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 78);
this._detachModalShimHandlers();
    }
};

_yuitest_coverline("/build/gallery-widget-modalshim/gallery-widget-modalshim.js", 82);
Y.WidgetModalShim = ModalShim;




}, 'gallery-2012.09.26-20-36' ,{requires:['widget', 'widget-modality'], skinnable:true});
