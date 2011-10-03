YUI.add('gallery-stdmod', function(Y) {

"use strict";
var BBX = 'boundingBox',
	CBX = 'contentBox',
	WStdMod = Y.WidgetStdMod,
	HEADER = WStdMod.HEADER,
	BODY = WStdMod.BODY,
	FOOTER = WStdMod.FOOTER,

	StdMod = function () {
		WStdMod.apply(this, arguments);
		this._stdModNode = this.get(BBX);
	};

	
StdMod.prototype = {
	_renderUIStdMod : function () {
		var cbx = this.get(CBX);
		
		cbx.addClass(WStdMod.SECTION_CLASS_NAMES[BODY]);
		this.bodyNode = cbx;
		WStdMod.prototype._renderUIStdMod.apply(this,arguments);
	},
	_renderStdMod : function(section) {

		var contentBox = this.get(CBX),
			sectionNode = this._findStdModSection(section);

		if (!sectionNode) {
			if (section === 'body') {
				sectionNode = contentBox;
			} else {
				sectionNode = this._getStdModTemplate(section);
			}
		}

		this._insertStdModSection(contentBox, section, sectionNode);

		return (this[section + 'Node'] = sectionNode);
	},
	_insertStdModSection : function(contentBox, section, sectionNode) {
 
		switch (section) {
			case FOOTER:
				contentBox.insert(sectionNode, 'after');
				break;
			case HEADER:
				contentBox.insert(sectionNode, 'before');
				break;
		}
	},
	_findStdModSection: function(section) {
		return this.get(BBX).one("> ." + WStdMod.SECTION_CLASS_NAMES[section]);
	}
};

Y.StdMod = Y.mix(StdMod, WStdMod, false, undefined, 2);



}, '@VERSION@' ,{requires:['widget-stdmod'], skinnable:false});
