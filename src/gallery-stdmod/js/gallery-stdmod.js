/**
* A version of Widget-StdMod that uses the ContentBox of the Widget as its Body section and adds
* the Header and Footer sections on each side of it instead of having the three of them under the contentBox.
* This turns quite handy when used along WidgetParent since the later assumes children will be added in the contentBox
* and thus conflicts with the StdMod sections. (this can also be solved using the property <a href="http://yuilibrary.com/yui/docs/api/classes/WidgetParent.html#property__childrenContainer">_childrenContainer</a>)<br/><br/>
* For further documentation see <a href="http://yuilibrary.com/yui/docs/api/classes/WidgetStdMod.html">WidgetStdMod</a>
*
* @module gallery-stdmod
* @class StdMod
* @constructor
* @extends WidgetStdMod
*/

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
			if (section === BODY) {
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
