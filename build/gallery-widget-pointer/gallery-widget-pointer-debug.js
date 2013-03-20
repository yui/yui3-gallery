YUI.add('gallery-widget-pointer', function (Y, NAME) {

/**
 * Extension enabling a Widget to have a pointer along a given edge.
 *
 * @module widget-pointer
 */
    var getCN = Y.ClassNameManager.getClassName,
        UPARROW = "pointer-up",
        DOWNARROW = "pointer-down",
        LEFTARROW = "pointer-left",
        RIGHTARROW = "pointer-right",
        POINTER = 'pointer',
        WIDGET = 'widget',

        CLASSES = {
            pointer: getCN(WIDGET, POINTER),
            above: getCN(WIDGET, UPARROW),
            below: getCN(WIDGET, DOWNARROW),
            left: getCN(WIDGET, LEFTARROW),
            right: getCN(WIDGET, RIGHTARROW)
        },

        POINTER_TEMPLATE = '<div class="' + CLASSES.pointer + '"></div>',

        //HTML5 Data Attributes
        DATA_PLACEMENT = 'data-placement';

    function Pointer() {

        //  Widget method overlap
        Y.after(this._renderUIPointer, this, "renderUI");
        Y.after(this._bindUIPointer, this, "bindUI");
    }

    Pointer.ATTRS = {
        placement : {
            value: 'above'
        }
    };

    Pointer.prototype = {

        destructor: function () {
            this._pointer.unplug(Y.Plugin.Align);
        },

        _renderUIPointer: function () {
            var box = this.get('boundingBox');
            this._pointer = Y.Node.create(POINTER_TEMPLATE);
            box.prepend(this._pointer);
            this._pointer.plug(Y.Plugin.Align);
            this.alignPointer(box);
        },

        _bindUIPointer: function () {
            this.after('placementChange', this._afterPlacementChange);
        },


        _getArrowType : function (placement) {
            var arrowClass = '';

            switch (placement) {
                case "below":
                    arrowClass = CLASSES.above;
                    break;
                case "right":
                    arrowClass = CLASSES.left;
                    break;
                case "above":
                    arrowClass = CLASSES.below;
                    break;
                case "left":
                    arrowClass = CLASSES.right;
                    break;
                default:
                    Y.log("A correct placement parameter was not specified. Accepted placements are 'above', 'below', 'left' and 'right'.");
                    break;
            }
            
            return arrowClass;
        },

        alignPointer : function (node) {
            
            var placement = node.getAttribute(DATA_PLACEMENT) || this.get('placement'),
                box = this.get('boundingBox'),
                arrowClass = this._getArrowType(placement);

            this._pointer.set('className', '').addClass(CLASSES.pointer + " " + arrowClass);

            switch (placement) {
                case "below":
                    this._pointer.align.to(box, "tc", "bc", true);
                    break;
                case "right":
                    this._pointer.align.to(box, "lc", "rc", true);
                    break;
                case "above":
                    this._pointer.align.to(box, "bc", "tc", true);
                    break;
                case "left":
                    this._pointer.align.to(box, "rc", "lc", true);
                    break;
                default:
                    Y.log("A correct alignment was not specified. Accepted alignments are 'above', 'below', 'left' and 'right'.");
                    break;
            }            
        },

        _afterPlacementChange: function (e) {
            var arrowClass = this._getArrowType(e.newVal);
            this._pointer.set('className', '').addClass(CLASSES.pointer + " " + arrowClass);

            if (e.currentTarget instanceof Y.Widget) {
                this.alignPointer(e.currentTarget.get('boundingBox'));
            }
        }
        
    };

    Y.WidgetPointer = Pointer;



}, 'gallery-2013.03.20-19-59', {
    "requires": [
        "widget",
        "base-build",
        "align-plugin",
        "classnamemanager"
    ],
    "skinnable": true,
    "version": 0.1
});
