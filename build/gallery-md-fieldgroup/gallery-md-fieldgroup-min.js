YUI.add("gallery-md-fieldgroup",function(f){var c=f.Lang,g="boundingBox",b="contentBox",e="ui",a="label",d=function(h){return c.isString(h)||c.isNull(h);};f.FieldGroup=f.Base.create("field-group",f.Widget,[f.MakeNode,f.WidgetParent],{CONTENT_TEMPLATE:"<fieldset></fieldset>",renderUI:function(){this.get(b).append(this._makeNode());this._locateNodes();},_uiSetLabel:function(h){this._labelNode.setContent(h||"");}},{_TEMPLATE:'<legend class="{c label}"></legend>',_CLASS_NAMES:[a],_ATTRS_2_UI:{SYNC:[a],BIND:[a]},ATTRS:{label:{value:null,validator:d},defaultChildType:{value:f.InputField}}});},"@VERSION@",{skinnable:true,requires:["base-build","widget","widget-parent","widget-child","gallery-makenode"]});