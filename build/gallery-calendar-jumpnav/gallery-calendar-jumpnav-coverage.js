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
_yuitest_coverage["/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js",
    code: []
};
_yuitest_coverage["/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js"].code=["YUI.add('gallery-calendar-jumpnav', function(Y) {","","/**"," A Plugin for Y.Calendar that sets up Calendar to work with Y.Calendar.JumpNavView, which"," is a View class extension to setup a \"click\" listener on Calendar's \"Month Year\" header label"," that opens a popup Panel to provide a quick method to jump to a month / year.",""," Please see the Calendar.JumpNavView documentation for full details.",""," @example"," 	var myCal = new Y.Calendar({","		contentBox: \"#mycal\",","		width: '200px',","		showPrevMonth: true,","		showNextMonth: true","	});","","	// Plugin the View to this Calendar ... available years are 1988 to 2021","	cal.plug( Y.Plugin.Calendar.JumpNav, {","		yearStart: 1988,","		yearEnd:   2021","	});","","	cal.render();",""," @class Y.Plugin.Calendar.JumpNav"," @param config"," @constructor"," **/","function CalJumpNav(config) {","   CalJumpNav.superclass.constructor.apply(this, arguments);","}","","/**"," * The namespace property of this plugin that this can be accessed from via a Calendar instance."," * @property NS"," * @description This plugin can be accessed from a Calendar instance as \"Calendar.jumpnav\""," * @type {String}"," */","CalJumpNav.NS = \"jumpnav\";","","/**"," * The name property of this plugin"," * @property NAME"," * @description name for this plugin"," * @type {String}"," */","CalJumpNav.NAME = \"calendarJumpnavPlugin\";","","CalJumpNav.ATTRS = {","","    /**","     * @attribute yearStart","     * @type Number","     * @default 1985","     */","    yearStart:{","        value:      1985,","        validator:  Y.Lang.isNumber","    },","","    /**","     * @attribute yearEnd","     * @type Number","     * @default Current year","     */","    yearEnd:{","        value:      new Date().getFullYear(),","        validator:  Y.Lang.isNumber","    },","","    /**","     * The x,y offset (horiz, vert) that should be used to offset the popup Panel from the original Calendar \"header label\"","     *  that was clicked.","     * @attribute offsetXY","     * @type Array","     * @default [ 30, 10 ]","     */","    offsetXY:{","        value:      [ 30, 10 ],","        validator:  Y.Lang.isArray","    },","","    /**","     Sets the Event \"type\" that is used in the Calendar \"header label\" listener to open the popup Panel.","     Sensible values are \"click\" or \"dblclick\".","     @attribute openEventType","     @type String","     @default 'click'","     **/","    openEventType:{","        value:      'click',","        validator:  Y.Lang.isString","    },","","","	/**","	 This flag sets whether the Panel instance should be hidden after the \"Go\" button is pressed","	 @attribute closeAfterGo","	 @type Boolean","	 @default true","	 **/","    closeAfterGo:{","        value:      true,","        validator:  Y.Lang.isBoolean","    }","","}","","","Y.extend(CalJumpNav, Y.Plugin.Base, {","","    _view:  null,","","    /**","     *","     * @method initializer","     * @param config","     */","    initializer: function(config) {","        this.afterHostEvent(\"render\", this._afterHostRenderEvent);","        return this;","    },","","    /**","     * Destroys the View that was created and detaches its event listeners","     * @method destructor","     * @protected","     */","    destructor : function() {","        if(this._view) {","            this._view.destroy();","        }","        this._view = null;","    },","","    /**","     * Connector method that initializes the View and connects it to the Calendar instance","     * @method _afterHostRenderEvent","     * @private","     */","    _afterHostRenderEvent : function() {","        if(!this._view) {","            var viewCfgs = this.getAttrs(['yearStart','yearEnd','template','offsetXY','closeAfterGo','openEventType']);","            viewCfgs.calendar = this.get('host');","            this._view = new Y.Calendar.JumpNavView(viewCfgs);","        }","     }","","});","","/**"," This class defines a View class extension for Calendar that configures to load on a \"click\" on the Calendar's \"Month Year\""," header label to display a popup panel that allows for selecting the month / year without requiring to page thru by month."," The view creates a Panel instance from a standard template (see the property [template](#property_template) for the default)"," and handles populating the SELECT dropdown controls for \"month\" and \"year\".",""," Attributes are provided that include [yearStart](#attr_yearStart) and [yearEnd](#attr_yearEnd) for defining the range to"," be used for the \"year\" dropdown elements, for example.",""," #####Usage"," The simplest application includes creating a Calendar instance and then creating the View and attaching the calendar to"," the view with the [calendar](#attr_calendar) attribute.","","	var cal = new Y.Calendar({","		contentBox: \"#mycal\",","		width:'240px',","		showPrevMonth: true,","		showNextMonth: true","	}).render();","","	// This creates a View instance and connects it to the \"cal\" Calendar instance.","	var calJNav = new Y.Calendar.JumpNavView({","		calendar:  cal,","		yearStart: 1988,","		yearEnd:   2021","	});",""," An additional module is provided, the Y.Plugin.Calendar.JumpNav plugin that attaches the Calendar to the view via a plugin method.",""," @class Y.Calendar.JumpNavView"," @extends Y.View"," @version 3.5.0"," **/","Y.Calendar.JumpNavView = Y.Base.create('caljumpnav', Y.View,[],{","","    /**","     * Defines event objects as part of View's event handling, specifically defines actions to","     * be taken on \"change\" events of the month and year SELECT controls.","     * @property events","     * @type Object","     * @static","     */","    events: {","        'select.yui3-calendar-navpanel-month' : { change : '_selectMonth' },","        'select.yui3-calendar-navpanel-year' :  { change: '_selectYear' }","    },","","    /**","     Default setting for the `template` attribute that defines the Panel HTML contents, including","     the SELECT options for month and year.","","     @example","	// Where classPanel is replaced by 'yui3-calendar-jumpnav-panel',","	// and classMonth by 'yui3-calendar-jumpnav-month'","	// and classYear by 'yui3-calendar-jumpnav-year'","	<div class=\"{classPanel}\">","		<div class=\"yui3-widget-bd\">","		<table>","			<tr><td align=\"right\">Jump to Month:</td><td><select class=\"{classMonth}\"></select></td></tr>","			<tr><td align=\"right\">and Year:</td><td><select class=\"{classYear}\"></select></td></tr>","		</table>","		</div>","	</div>","","","     @property template","     @type String HTML Setting for Panel's contents","     @default See example below","     @static","     **/","    template:   '<div class=\"{classPanel}\"><div class=\"yui3-widget-bd\">'+","                '<table><tr><td align=\"right\">Jump to Month:</td>' +","                '<td><select class=\"{classMonth}\"></select></td></tr>' +","                '<tr><td align=\"right\">and Year:</td>' +","                '<td><select class=\"{classYear}\"></select></td></tr>'+","                '</table></div></div>',","","    /**","     * Placeholder for the Y.Panel instance used in this view","     * @property _panel","     * @type Y.Panel","     * @default null","     * @private","     */","    _panel:     null,","","    /**","     * Holder for an array of the Listeners created by this view so we can detach them when finished","     * @property _subscr","     * @type Array","     * @default []","     * @private","     */","    _subscr:    [],","","    /**","     * Stores the classname to search the Calendar instance for to hook onto the \"header-label\" element","     * @property _classCalHead","     * @type String","     * @default 'yui3-calendar-header-label'","     * @private","     */","    _classCalHead:  'yui3-calendar-header-label',","","    /**","     * Stores the classname used internally for the Panel srcNode used in this view","     * @property _classPanel","     * @type String","     * @default 'yui3-calendar-jumpnav-panel'","     * @private","     */","    _classPanel:    'yui3-calendar-jumpnav-panel',","","","    /**","     * Placeholder for the Node instance for this view, set to Panel contentBox","     * @property _viewNode","     * @type Node","     * @default null","     * @private","     */","    _viewNode:      null,","","    /**","     * Stores the classname used internally for the Panel's \"month\" SELECT control","     * @property _classMonth","     * @type String","     * @default 'yui3-calendar-jumpnav-month'","     * @private","     */","    _classMonth:    'yui3-calendar-jumpnav-month',","","    /**","     * Stores the classname used internally for the Panel's \"month\" SELECT control","     * @property _classYear","     * @type String","     * @default 'yui3-calendar-jumpnav-year'","     * @private","     */","    _classYear:     'yui3-calendar-jumpnav-year',","","","//===========================    LIFECYCLE METHODS   ====================================","","    /**","     * Initializer that creates the `container`, the Panel instance and listeners for this view","     * @method initializer","     * @return this","     * @chainable","     * @protected","     */","    initializer: function(){","","        //","        //  Read the template and create the container","        //","        var tmpl = this.get('template') || this.template;","","        tmpl = Y.Lang.sub(tmpl,{","            classPanel: this._classPanel,","            classMonth: this._classMonth,","            classYear:  this._classYear","        });","","        //","        //","        //","        var viewnode = Y.Node.create(tmpl);","        this.set('container',viewnode);","        this._createPanelView(viewnode);","","        // Generate the SELECT OPTIONS for the months control ...","        this._regenMonths(new Date());","","        //","        //  Define listeners on the Calendar \"header label\" and \"dateChange\" events to update the UI","        //","        if(this.get('calendar')) {","            var cal     = this.get('calendar'),","                calHead = cal.get('contentBox').one('.'+this._classCalHead);","","            this._subscr.push( calHead.on( this.get('openEventType'),this.render,this) );","            this._subscr.push( cal.on('dateChange',this._onCalendarDateChange,this)  );","        }","","        return this;","    },","","    /**","     * Renders the Panel and resets the SELECT controls \"selected\" default to the current Calendar data setting","     * @method render","     * @chainable","     * @return this","     * @protected","     */","    render: function(){","        var pcont   = this._panel,","            cal     = this.get('calendar'),","            cdate   = cal.get('date'),","            pmonth  = this._viewNode.one('.'+this._classMonth).get('selectedIndex') || null,","            pyear   = this._viewNode.one('.'+this._classYear).get('selectedIndex') || null;","        //","        // Check if the months and years \"SELECT\" controls need regenerating ...","        //","        if( pmonth !== cdate.getMonth() ) {","            this._setSelectedMonth(cdate);","        }","","        if(!this._yearInSelect(cdate.getFullYear()))","            this._regenYears(cdate);","        this._setSelectedYear(cdate);","","        // show the panel","        pcont.show();","","    //","    //  Re-position the container","    //","        var calcbox = cal.get('contentBox'),","            xy      = calcbox.getXY();","","        xy[0] += +(+calcbox.getComputedStyle('width').replace(/px/,'')) + this.get('offsetXY')[0];","        xy[1] += this.get('offsetXY')[1];","        pcont.set('xy',xy);","","        return this;","","    },","","    /**","     * Clears up the created listeners and destroys the Panel","     * @method destructor","     * @protected","     */","    destructor: function(){","		Y.Array.each( this._subscr, function(item){","            item.detach();","        });","        this._subscr = null;","","        if(this._panel) {","   			this._panel.destroy();","   			this._panel = null;","   		}","","   		this._viewNode = null;","   	},","","","//===========================   PRIVATE  METHODS   ====================================","","	/**","	 * @method _createPanelView","	 * @param {Node} vnode The Node that was created from `template` that will be used as the container for the Y.Panel creation.","	 * @private","	 */","    _createPanelView: function(vnode){","        var oSelf = this;","","        //","        //  Create the Panel for the CalNavigator, initially hidden","        //","        var npanel = new Y.Panel({","            srcNode : vnode,","            model:    false,","            render  : true,","            visible:  false,","            plugins:  [Y.Plugin.Drag],","            buttons: [","                {","                    value  : 'Go',","                    section: Y.WidgetStdMod.FOOTER,","                    action : function (e) {","                        e.preventDefault();","                        oSelf._onGoButton();","                        this.hide();","                    }","                },","                {","                    value  : 'Cancel',","                    section: Y.WidgetStdMod.FOOTER,","                    action : function (e) {","                        e.preventDefault();","                        this.hide();","                    }","                }","            ]","        });","","        this._panel = npanel;","        this.set('container',npanel);","","        this._viewNode = npanel.get('contentBox');","","    },","","    /**","     * Sets the currently \"selected\" OPTION for the month control to the current month","     * @method _setSelectedMonth","     * @param {Date} curDate","     * @private","     */","    _setSelectedMonth: function(curDate){","        var monthNode = this._viewNode.one('.'+this._classMonth);","        monthNode.set('selectedIndex', curDate.getMonth() );","    },","","    /**","     * Sets the currently \"selected\" OPTION for the year control to the current year.","     * <br/>This method searches the OPTION nodes for \"value\" set to the year, to get around","     * CSS selector issues in some browers.","     * @method _setSelectedYear","     * @param {Date} curDate","     * @private","     */","    _setSelectedYear: function(curDate){","        var yearNodes = this._viewNode.one('.'+this._classYear).all('option');","        yearNodes.some(function(yn){","            if(yn.get('value') == curDate.getFullYear() ) {","                yn.set('selected',true);","                return true;","            }","        });","    },","","    /**","     * Method that regenerates the \"month\" SELECT control, adding the months and defining the \"selected\" as the curDate parameter","     * @method _regenMonths","     * @param {Date} curDate Current date to set as \"selected\"","     * @private","     */","    _regenMonths: function(curDate){","        curDate = curDate || this.get('calendar').get('date');","        var monthNode = this._viewNode.one('.'+this._classMonth),","            msel      = monthNode.getDOMNode(),","            curMonth  = (curDate && curDate.getMonth) ? curDate.getMonth() : null,","            months    = ['January','February','March','April','May','June','July','August','September','October','November','December'];","","        if(!msel) return;","","        //","        //  Update the SELECT, OPTIONS ... easier and better cross-browser to do via DOMNodes","        //","        msel.options.length = 0;","        Y.Array.each(months,function(m,mindx){","            msel.options[msel.options.length] = new Option(m,mindx);","            // set \"selected\" for default","            if(curMonth === mindx) msel.options[msel.options.length-1].selected = true;","        });","","    },","","    /**","     * Method that regenerates the \"year\" SELECT control, adding the months defined by attributes `yearStart` to `yearEnd`","     * and defining the \"selected\" as the curDate parameter","     * @method _regenYears","     * @param {Date} curDate Current date to set as \"selected\"","     * @private","     */","    _regenYears: function(curDate){","        curDate = curDate || this.get('calendar').get('date');","        var yearNode = this._viewNode.one('.'+this._classYear),","            ysel     = yearNode.getDOMNode(),","            curYear  = ( curDate && curDate.getFullYear ) ? curDate.getFullYear() : null,","            yearStart= this.get('yearStart'),","            yearEnd  = this.get('yearEnd');","","        if(!ysel) return;","","        //","        //  Update the SELECT, OPTIONS ... easier and better cross-browser to do via DOMNodes","        //","        ysel.options.length = 0;","        for(var y=yearStart; y<= yearEnd; y++) {","            ysel.options[ysel.options.length] = new Option(y,y);","            // set \"selected\" for default","            if(curYear && curYear === y ) ysel.options[ysel.options.length-1].selected = true;","        }","    },","","    /**","     * Helper method to check if the specified year is an option in the current SELECT control OPTIONS.","     * @method _yearInSelect","     * @param {Number} year Year to be checked if it is in the current SELECT control","     * @return {Boolean} true if year is in SELECt, false if not","     * @private","     */","    _yearInSelect: function(year){","        var yearNode = this._viewNode.one('.'+this._classYear),","            yindex   = null;","","        yearNode.get('options').some(function(yo,yindx){","            if( +(yo.get('value')) === year) {","                yindex = yindx;","                return true;","            }","        });","        return (yindex!==null) ? true : false;","    },","","","//===========================  PRIVATE METHODS : Listeners  =============================","","    /**","     * Listener on the Calendar's \"dateChange\" event to update the JumpNavigator if it's visible","     * @method _onCalendarDateChange","     * @param {EventTarget} e","     * @private","     */","    _onCalendarDateChange: function(e) {","        var newDate = e.newVal;","        if(this._panel && this._panel.get('visible')){","            this._setSelectedMonth(newDate);","            if(!this._yearInSelect(newDate.getFullYear()))","                this._regenYears(newDate);","            this._setSelectedYear(newDate);","        }","    },","","    /**","     * Listener on the Panel's \"Go\" button, resets the Calendar to the Month/Year and first day,","     * and optionally closes the Panel if `closeAfterGo` is true.","     * @method _onGoButton","     * @private","     */","    _onGoButton: function(){","        var monthIndex = this.get('container').one('.'+this._classMonth).get('value'),","            yearValue  = this.get('container').one('.'+this._classYear).get('value');","        this.get('calendar').set('date', new Date(yearValue,monthIndex,1) );","","        if(this.get('closeAfterGo'))","            if(this._panel)","                this._panel.hide();","            else","                this._viewNode.hide();","    },","","    /**","     * \"change\" Listener on the SELECT control for the JumpNavigator's month control","     * @method _selectMonth","     * @param e","     * @private","     */","    _selectMonth: function(e){","        var tar   = e.target,    // SELECT node","            opts  = tar.get('options'),","            sndx  = +tar.get('selectedIndex'),","            sopt  = opts.item(sndx),","            month = +sopt.get('value');","","        this.set('month', month);","        this.fire('monthSelected',{evt:e, value:sopt.get('value'), text:sopt.get('text')});","","    },","    /**","     * @event monthSelected","     * @param {Object} return","     * @param {EventTarget} return.evt Eventtarget for the SELECT \"change\" event","     * @param {Number} return.value Value part of the selected OPTION, which is the selected month","     * @param {String} return.text Text from selected OPTION, which is the month name","     */","","    /**","     * \"change\" Listener on the SELECT control for the JumpNavigator's year control","     * @method _selectYear","     * @param e","     * @private","     */","    _selectYear:  function(e){","        var tar   = e.target,    // SELECT node","            opts  = tar.get('options'),","            sndx  = +tar.get('selectedIndex'),","            sopt  = opts.item(sndx),","            year  = +sopt.get('value');","","        this.set('year', year);","        this.fire('yearSelected',{evt:e, value:year, text:sopt.get('text')});","    }","","    /**","     * @event yearSelected","     * @param {Object} return","     * @param {EventTarget} return.evt Eventtarget for the SELECT \"change\" event","     * @param {Number} return.value Value part of the selected OPTION, which is the Selected year","     * @param {String} return.text Text from selected OPTION, which is the selected year","     */","","},{","    ATTRS:{","","        /**","         * Specifies the Calendar instance that this view will be attached to for header label clicks and","         * for updates to the `date` attribute.","","         * @attribute calendar","         * @type Y.Calendar","         * @default null","         */","        calendar:{","            value:      null,","            validator:  function(v) { return v instanceof Y.Calendar; }","        },","","        /**","         Defines the HTML content that is used to setup the Y.Panel instance that is created by this View.","         See the property [template](#property_template) for the default setting.","","         @attribute template","         @type String","         @default this.template","         **/","        template:{","            valueFn:    function(){ return this.template; },","            validator:  Y.Lang.isString","        },","","        /**","         Sets the beginning year that will be used to setup the \"year\" SELECT dropdown control, defaults to","         a favorite year of the author's.","         @attribute yearStart","         @type Number","         @default 1985","         **/","        yearStart:{","            value:      1992,","            validator:  Y.Lang.isNumber","        },","","        /**","         Sets the last year that should be setup within the \"year\" SELECT dropdown control, defaults the","         the current year.","         @attribute yearEnd","         @type Number","         @default Current year","         **/","        yearEnd:{","            value:      new Date().getFullYear(),","            validator:  Y.Lang.isNumber","        },","","	    /**","	     The x,y offset (horiz, vert) that should be used to offset the popup Panel from the original Calendar \"header label\"","	      that was clicked.","	     @attribute offsetXY","	     @type Array","	     @default [ 30, 10 ]","	     **/","        offsetXY:{","            value:      [ 30, 10 ],","            validator:  Y.Lang.isArray","        },","","","	    /**","	     Sets the Event \"type\" that is used in the Calendar \"header label\" listener to open the popup Panel.","         Sensible values are \"click\" or \"dblclick\".","	     @attribute openEventType","	     @type String","	     @default 'click'","	     **/","        openEventType:{","            value:      'click',","            validator:  Y.Lang.isString","        },","","		/**","		 This flag sets whether the Panel instance should be hidden after the \"Go\" button is pressed","		 @attribute closeAfterGo","		 @type Boolean","		 @default true","		 **/","        closeAfterGo:{","            value:      true,","            validator:  Y.Lang.isBoolean","        }","","    }","});","","Y.namespace(\"Plugin.Calendar\").JumpNav = CalJumpNav;","","","}, 'gallery-2012.09.26-20-36' ,{requires:['plugin', 'base-build', 'view', 'panel', 'calendar'], skinnable:false});"];
_yuitest_coverage["/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js"].lines = {"1":0,"30":0,"31":0,"40":0,"48":0,"50":0,"111":0,"121":0,"122":0,"131":0,"132":0,"134":0,"143":0,"144":0,"145":0,"146":0,"185":0,"308":0,"310":0,"319":0,"320":0,"321":0,"324":0,"329":0,"330":0,"333":0,"334":0,"337":0,"348":0,"356":0,"357":0,"360":0,"361":0,"362":0,"365":0,"370":0,"373":0,"374":0,"375":0,"377":0,"387":0,"388":0,"390":0,"392":0,"393":0,"394":0,"397":0,"409":0,"414":0,"425":0,"426":0,"427":0,"434":0,"435":0,"441":0,"442":0,"444":0,"455":0,"456":0,"468":0,"469":0,"470":0,"471":0,"472":0,"484":0,"485":0,"490":0,"495":0,"496":0,"497":0,"499":0,"512":0,"513":0,"519":0,"524":0,"525":0,"526":0,"528":0,"540":0,"543":0,"544":0,"545":0,"546":0,"549":0,"562":0,"563":0,"564":0,"565":0,"566":0,"567":0,"578":0,"580":0,"582":0,"583":0,"584":0,"586":0,"596":0,"602":0,"603":0,"621":0,"627":0,"628":0,"652":0,"664":0,"731":0};
_yuitest_coverage["/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js"].functions = {"CalJumpNav:30":0,"initializer:120":0,"destructor:130":0,"_afterHostRenderEvent:142":0,"initializer:303":0,"render:347":0,"(anonymous 2):387":0,"destructor:386":0,"action:424":0,"action:433":0,"_createPanelView:408":0,"_setSelectedMonth:454":0,"(anonymous 3):469":0,"_setSelectedYear:467":0,"(anonymous 4):496":0,"_regenMonths:483":0,"_regenYears:511":0,"(anonymous 5):543":0,"_yearInSelect:539":0,"_onCalendarDateChange:561":0,"_onGoButton:577":0,"_selectMonth:595":0,"_selectYear:620":0,"validator:652":0,"valueFn:664":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js"].coveredLines = 105;
_yuitest_coverage["/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js"].coveredFunctions = 26;
_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 1);
YUI.add('gallery-calendar-jumpnav', function(Y) {

/**
 A Plugin for Y.Calendar that sets up Calendar to work with Y.Calendar.JumpNavView, which
 is a View class extension to setup a "click" listener on Calendar's "Month Year" header label
 that opens a popup Panel to provide a quick method to jump to a month / year.

 Please see the Calendar.JumpNavView documentation for full details.

 @example
 	var myCal = new Y.Calendar({
		contentBox: "#mycal",
		width: '200px',
		showPrevMonth: true,
		showNextMonth: true
	});

	// Plugin the View to this Calendar ... available years are 1988 to 2021
	cal.plug( Y.Plugin.Calendar.JumpNav, {
		yearStart: 1988,
		yearEnd:   2021
	});

	cal.render();

 @class Y.Plugin.Calendar.JumpNav
 @param config
 @constructor
 **/
_yuitest_coverfunc("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 30);
function CalJumpNav(config) {
   _yuitest_coverfunc("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", "CalJumpNav", 30);
_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 31);
CalJumpNav.superclass.constructor.apply(this, arguments);
}

/**
 * The namespace property of this plugin that this can be accessed from via a Calendar instance.
 * @property NS
 * @description This plugin can be accessed from a Calendar instance as "Calendar.jumpnav"
 * @type {String}
 */
_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 40);
CalJumpNav.NS = "jumpnav";

/**
 * The name property of this plugin
 * @property NAME
 * @description name for this plugin
 * @type {String}
 */
_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 48);
CalJumpNav.NAME = "calendarJumpnavPlugin";

_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 50);
CalJumpNav.ATTRS = {

    /**
     * @attribute yearStart
     * @type Number
     * @default 1985
     */
    yearStart:{
        value:      1985,
        validator:  Y.Lang.isNumber
    },

    /**
     * @attribute yearEnd
     * @type Number
     * @default Current year
     */
    yearEnd:{
        value:      new Date().getFullYear(),
        validator:  Y.Lang.isNumber
    },

    /**
     * The x,y offset (horiz, vert) that should be used to offset the popup Panel from the original Calendar "header label"
     *  that was clicked.
     * @attribute offsetXY
     * @type Array
     * @default [ 30, 10 ]
     */
    offsetXY:{
        value:      [ 30, 10 ],
        validator:  Y.Lang.isArray
    },

    /**
     Sets the Event "type" that is used in the Calendar "header label" listener to open the popup Panel.
     Sensible values are "click" or "dblclick".
     @attribute openEventType
     @type String
     @default 'click'
     **/
    openEventType:{
        value:      'click',
        validator:  Y.Lang.isString
    },


	/**
	 This flag sets whether the Panel instance should be hidden after the "Go" button is pressed
	 @attribute closeAfterGo
	 @type Boolean
	 @default true
	 **/
    closeAfterGo:{
        value:      true,
        validator:  Y.Lang.isBoolean
    }

}


_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 111);
Y.extend(CalJumpNav, Y.Plugin.Base, {

    _view:  null,

    /**
     *
     * @method initializer
     * @param config
     */
    initializer: function(config) {
        _yuitest_coverfunc("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", "initializer", 120);
_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 121);
this.afterHostEvent("render", this._afterHostRenderEvent);
        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 122);
return this;
    },

    /**
     * Destroys the View that was created and detaches its event listeners
     * @method destructor
     * @protected
     */
    destructor : function() {
        _yuitest_coverfunc("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", "destructor", 130);
_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 131);
if(this._view) {
            _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 132);
this._view.destroy();
        }
        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 134);
this._view = null;
    },

    /**
     * Connector method that initializes the View and connects it to the Calendar instance
     * @method _afterHostRenderEvent
     * @private
     */
    _afterHostRenderEvent : function() {
        _yuitest_coverfunc("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", "_afterHostRenderEvent", 142);
_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 143);
if(!this._view) {
            _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 144);
var viewCfgs = this.getAttrs(['yearStart','yearEnd','template','offsetXY','closeAfterGo','openEventType']);
            _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 145);
viewCfgs.calendar = this.get('host');
            _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 146);
this._view = new Y.Calendar.JumpNavView(viewCfgs);
        }
     }

});

/**
 This class defines a View class extension for Calendar that configures to load on a "click" on the Calendar's "Month Year"
 header label to display a popup panel that allows for selecting the month / year without requiring to page thru by month.
 The view creates a Panel instance from a standard template (see the property [template](#property_template) for the default)
 and handles populating the SELECT dropdown controls for "month" and "year".

 Attributes are provided that include [yearStart](#attr_yearStart) and [yearEnd](#attr_yearEnd) for defining the range to
 be used for the "year" dropdown elements, for example.

 #####Usage
 The simplest application includes creating a Calendar instance and then creating the View and attaching the calendar to
 the view with the [calendar](#attr_calendar) attribute.

	var cal = new Y.Calendar({
		contentBox: "#mycal",
		width:'240px',
		showPrevMonth: true,
		showNextMonth: true
	}).render();

	// This creates a View instance and connects it to the "cal" Calendar instance.
	var calJNav = new Y.Calendar.JumpNavView({
		calendar:  cal,
		yearStart: 1988,
		yearEnd:   2021
	});

 An additional module is provided, the Y.Plugin.Calendar.JumpNav plugin that attaches the Calendar to the view via a plugin method.

 @class Y.Calendar.JumpNavView
 @extends Y.View
 @version 3.5.0
 **/
_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 185);
Y.Calendar.JumpNavView = Y.Base.create('caljumpnav', Y.View,[],{

    /**
     * Defines event objects as part of View's event handling, specifically defines actions to
     * be taken on "change" events of the month and year SELECT controls.
     * @property events
     * @type Object
     * @static
     */
    events: {
        'select.yui3-calendar-navpanel-month' : { change : '_selectMonth' },
        'select.yui3-calendar-navpanel-year' :  { change: '_selectYear' }
    },

    /**
     Default setting for the `template` attribute that defines the Panel HTML contents, including
     the SELECT options for month and year.

     @example
	// Where classPanel is replaced by 'yui3-calendar-jumpnav-panel',
	// and classMonth by 'yui3-calendar-jumpnav-month'
	// and classYear by 'yui3-calendar-jumpnav-year'
	<div class="{classPanel}">
		<div class="yui3-widget-bd">
		<table>
			<tr><td align="right">Jump to Month:</td><td><select class="{classMonth}"></select></td></tr>
			<tr><td align="right">and Year:</td><td><select class="{classYear}"></select></td></tr>
		</table>
		</div>
	</div>


     @property template
     @type String HTML Setting for Panel's contents
     @default See example below
     @static
     **/
    template:   '<div class="{classPanel}"><div class="yui3-widget-bd">'+
                '<table><tr><td align="right">Jump to Month:</td>' +
                '<td><select class="{classMonth}"></select></td></tr>' +
                '<tr><td align="right">and Year:</td>' +
                '<td><select class="{classYear}"></select></td></tr>'+
                '</table></div></div>',

    /**
     * Placeholder for the Y.Panel instance used in this view
     * @property _panel
     * @type Y.Panel
     * @default null
     * @private
     */
    _panel:     null,

    /**
     * Holder for an array of the Listeners created by this view so we can detach them when finished
     * @property _subscr
     * @type Array
     * @default []
     * @private
     */
    _subscr:    [],

    /**
     * Stores the classname to search the Calendar instance for to hook onto the "header-label" element
     * @property _classCalHead
     * @type String
     * @default 'yui3-calendar-header-label'
     * @private
     */
    _classCalHead:  'yui3-calendar-header-label',

    /**
     * Stores the classname used internally for the Panel srcNode used in this view
     * @property _classPanel
     * @type String
     * @default 'yui3-calendar-jumpnav-panel'
     * @private
     */
    _classPanel:    'yui3-calendar-jumpnav-panel',


    /**
     * Placeholder for the Node instance for this view, set to Panel contentBox
     * @property _viewNode
     * @type Node
     * @default null
     * @private
     */
    _viewNode:      null,

    /**
     * Stores the classname used internally for the Panel's "month" SELECT control
     * @property _classMonth
     * @type String
     * @default 'yui3-calendar-jumpnav-month'
     * @private
     */
    _classMonth:    'yui3-calendar-jumpnav-month',

    /**
     * Stores the classname used internally for the Panel's "month" SELECT control
     * @property _classYear
     * @type String
     * @default 'yui3-calendar-jumpnav-year'
     * @private
     */
    _classYear:     'yui3-calendar-jumpnav-year',


//===========================    LIFECYCLE METHODS   ====================================

    /**
     * Initializer that creates the `container`, the Panel instance and listeners for this view
     * @method initializer
     * @return this
     * @chainable
     * @protected
     */
    initializer: function(){

        //
        //  Read the template and create the container
        //
        _yuitest_coverfunc("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", "initializer", 303);
_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 308);
var tmpl = this.get('template') || this.template;

        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 310);
tmpl = Y.Lang.sub(tmpl,{
            classPanel: this._classPanel,
            classMonth: this._classMonth,
            classYear:  this._classYear
        });

        //
        //
        //
        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 319);
var viewnode = Y.Node.create(tmpl);
        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 320);
this.set('container',viewnode);
        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 321);
this._createPanelView(viewnode);

        // Generate the SELECT OPTIONS for the months control ...
        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 324);
this._regenMonths(new Date());

        //
        //  Define listeners on the Calendar "header label" and "dateChange" events to update the UI
        //
        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 329);
if(this.get('calendar')) {
            _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 330);
var cal     = this.get('calendar'),
                calHead = cal.get('contentBox').one('.'+this._classCalHead);

            _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 333);
this._subscr.push( calHead.on( this.get('openEventType'),this.render,this) );
            _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 334);
this._subscr.push( cal.on('dateChange',this._onCalendarDateChange,this)  );
        }

        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 337);
return this;
    },

    /**
     * Renders the Panel and resets the SELECT controls "selected" default to the current Calendar data setting
     * @method render
     * @chainable
     * @return this
     * @protected
     */
    render: function(){
        _yuitest_coverfunc("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", "render", 347);
_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 348);
var pcont   = this._panel,
            cal     = this.get('calendar'),
            cdate   = cal.get('date'),
            pmonth  = this._viewNode.one('.'+this._classMonth).get('selectedIndex') || null,
            pyear   = this._viewNode.one('.'+this._classYear).get('selectedIndex') || null;
        //
        // Check if the months and years "SELECT" controls need regenerating ...
        //
        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 356);
if( pmonth !== cdate.getMonth() ) {
            _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 357);
this._setSelectedMonth(cdate);
        }

        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 360);
if(!this._yearInSelect(cdate.getFullYear()))
            {_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 361);
this._regenYears(cdate);}
        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 362);
this._setSelectedYear(cdate);

        // show the panel
        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 365);
pcont.show();

    //
    //  Re-position the container
    //
        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 370);
var calcbox = cal.get('contentBox'),
            xy      = calcbox.getXY();

        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 373);
xy[0] += +(+calcbox.getComputedStyle('width').replace(/px/,'')) + this.get('offsetXY')[0];
        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 374);
xy[1] += this.get('offsetXY')[1];
        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 375);
pcont.set('xy',xy);

        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 377);
return this;

    },

    /**
     * Clears up the created listeners and destroys the Panel
     * @method destructor
     * @protected
     */
    destructor: function(){
		_yuitest_coverfunc("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", "destructor", 386);
_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 387);
Y.Array.each( this._subscr, function(item){
            _yuitest_coverfunc("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", "(anonymous 2)", 387);
_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 388);
item.detach();
        });
        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 390);
this._subscr = null;

        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 392);
if(this._panel) {
   			_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 393);
this._panel.destroy();
   			_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 394);
this._panel = null;
   		}

   		_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 397);
this._viewNode = null;
   	},


//===========================   PRIVATE  METHODS   ====================================

	/**
	 * @method _createPanelView
	 * @param {Node} vnode The Node that was created from `template` that will be used as the container for the Y.Panel creation.
	 * @private
	 */
    _createPanelView: function(vnode){
        _yuitest_coverfunc("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", "_createPanelView", 408);
_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 409);
var oSelf = this;

        //
        //  Create the Panel for the CalNavigator, initially hidden
        //
        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 414);
var npanel = new Y.Panel({
            srcNode : vnode,
            model:    false,
            render  : true,
            visible:  false,
            plugins:  [Y.Plugin.Drag],
            buttons: [
                {
                    value  : 'Go',
                    section: Y.WidgetStdMod.FOOTER,
                    action : function (e) {
                        _yuitest_coverfunc("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", "action", 424);
_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 425);
e.preventDefault();
                        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 426);
oSelf._onGoButton();
                        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 427);
this.hide();
                    }
                },
                {
                    value  : 'Cancel',
                    section: Y.WidgetStdMod.FOOTER,
                    action : function (e) {
                        _yuitest_coverfunc("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", "action", 433);
_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 434);
e.preventDefault();
                        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 435);
this.hide();
                    }
                }
            ]
        });

        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 441);
this._panel = npanel;
        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 442);
this.set('container',npanel);

        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 444);
this._viewNode = npanel.get('contentBox');

    },

    /**
     * Sets the currently "selected" OPTION for the month control to the current month
     * @method _setSelectedMonth
     * @param {Date} curDate
     * @private
     */
    _setSelectedMonth: function(curDate){
        _yuitest_coverfunc("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", "_setSelectedMonth", 454);
_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 455);
var monthNode = this._viewNode.one('.'+this._classMonth);
        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 456);
monthNode.set('selectedIndex', curDate.getMonth() );
    },

    /**
     * Sets the currently "selected" OPTION for the year control to the current year.
     * <br/>This method searches the OPTION nodes for "value" set to the year, to get around
     * CSS selector issues in some browers.
     * @method _setSelectedYear
     * @param {Date} curDate
     * @private
     */
    _setSelectedYear: function(curDate){
        _yuitest_coverfunc("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", "_setSelectedYear", 467);
_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 468);
var yearNodes = this._viewNode.one('.'+this._classYear).all('option');
        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 469);
yearNodes.some(function(yn){
            _yuitest_coverfunc("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", "(anonymous 3)", 469);
_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 470);
if(yn.get('value') == curDate.getFullYear() ) {
                _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 471);
yn.set('selected',true);
                _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 472);
return true;
            }
        });
    },

    /**
     * Method that regenerates the "month" SELECT control, adding the months and defining the "selected" as the curDate parameter
     * @method _regenMonths
     * @param {Date} curDate Current date to set as "selected"
     * @private
     */
    _regenMonths: function(curDate){
        _yuitest_coverfunc("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", "_regenMonths", 483);
_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 484);
curDate = curDate || this.get('calendar').get('date');
        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 485);
var monthNode = this._viewNode.one('.'+this._classMonth),
            msel      = monthNode.getDOMNode(),
            curMonth  = (curDate && curDate.getMonth) ? curDate.getMonth() : null,
            months    = ['January','February','March','April','May','June','July','August','September','October','November','December'];

        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 490);
if(!msel) {return;}

        //
        //  Update the SELECT, OPTIONS ... easier and better cross-browser to do via DOMNodes
        //
        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 495);
msel.options.length = 0;
        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 496);
Y.Array.each(months,function(m,mindx){
            _yuitest_coverfunc("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", "(anonymous 4)", 496);
_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 497);
msel.options[msel.options.length] = new Option(m,mindx);
            // set "selected" for default
            _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 499);
if(curMonth === mindx) {msel.options[msel.options.length-1].selected = true;}
        });

    },

    /**
     * Method that regenerates the "year" SELECT control, adding the months defined by attributes `yearStart` to `yearEnd`
     * and defining the "selected" as the curDate parameter
     * @method _regenYears
     * @param {Date} curDate Current date to set as "selected"
     * @private
     */
    _regenYears: function(curDate){
        _yuitest_coverfunc("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", "_regenYears", 511);
_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 512);
curDate = curDate || this.get('calendar').get('date');
        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 513);
var yearNode = this._viewNode.one('.'+this._classYear),
            ysel     = yearNode.getDOMNode(),
            curYear  = ( curDate && curDate.getFullYear ) ? curDate.getFullYear() : null,
            yearStart= this.get('yearStart'),
            yearEnd  = this.get('yearEnd');

        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 519);
if(!ysel) {return;}

        //
        //  Update the SELECT, OPTIONS ... easier and better cross-browser to do via DOMNodes
        //
        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 524);
ysel.options.length = 0;
        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 525);
for(var y=yearStart; y<= yearEnd; y++) {
            _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 526);
ysel.options[ysel.options.length] = new Option(y,y);
            // set "selected" for default
            _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 528);
if(curYear && curYear === y ) {ysel.options[ysel.options.length-1].selected = true;}
        }
    },

    /**
     * Helper method to check if the specified year is an option in the current SELECT control OPTIONS.
     * @method _yearInSelect
     * @param {Number} year Year to be checked if it is in the current SELECT control
     * @return {Boolean} true if year is in SELECt, false if not
     * @private
     */
    _yearInSelect: function(year){
        _yuitest_coverfunc("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", "_yearInSelect", 539);
_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 540);
var yearNode = this._viewNode.one('.'+this._classYear),
            yindex   = null;

        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 543);
yearNode.get('options').some(function(yo,yindx){
            _yuitest_coverfunc("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", "(anonymous 5)", 543);
_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 544);
if( +(yo.get('value')) === year) {
                _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 545);
yindex = yindx;
                _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 546);
return true;
            }
        });
        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 549);
return (yindex!==null) ? true : false;
    },


//===========================  PRIVATE METHODS : Listeners  =============================

    /**
     * Listener on the Calendar's "dateChange" event to update the JumpNavigator if it's visible
     * @method _onCalendarDateChange
     * @param {EventTarget} e
     * @private
     */
    _onCalendarDateChange: function(e) {
        _yuitest_coverfunc("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", "_onCalendarDateChange", 561);
_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 562);
var newDate = e.newVal;
        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 563);
if(this._panel && this._panel.get('visible')){
            _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 564);
this._setSelectedMonth(newDate);
            _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 565);
if(!this._yearInSelect(newDate.getFullYear()))
                {_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 566);
this._regenYears(newDate);}
            _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 567);
this._setSelectedYear(newDate);
        }
    },

    /**
     * Listener on the Panel's "Go" button, resets the Calendar to the Month/Year and first day,
     * and optionally closes the Panel if `closeAfterGo` is true.
     * @method _onGoButton
     * @private
     */
    _onGoButton: function(){
        _yuitest_coverfunc("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", "_onGoButton", 577);
_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 578);
var monthIndex = this.get('container').one('.'+this._classMonth).get('value'),
            yearValue  = this.get('container').one('.'+this._classYear).get('value');
        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 580);
this.get('calendar').set('date', new Date(yearValue,monthIndex,1) );

        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 582);
if(this.get('closeAfterGo'))
            {_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 583);
if(this._panel)
                {_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 584);
this._panel.hide();}
            else
                {_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 586);
this._viewNode.hide();}}
    },

    /**
     * "change" Listener on the SELECT control for the JumpNavigator's month control
     * @method _selectMonth
     * @param e
     * @private
     */
    _selectMonth: function(e){
        _yuitest_coverfunc("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", "_selectMonth", 595);
_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 596);
var tar   = e.target,    // SELECT node
            opts  = tar.get('options'),
            sndx  = +tar.get('selectedIndex'),
            sopt  = opts.item(sndx),
            month = +sopt.get('value');

        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 602);
this.set('month', month);
        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 603);
this.fire('monthSelected',{evt:e, value:sopt.get('value'), text:sopt.get('text')});

    },
    /**
     * @event monthSelected
     * @param {Object} return
     * @param {EventTarget} return.evt Eventtarget for the SELECT "change" event
     * @param {Number} return.value Value part of the selected OPTION, which is the selected month
     * @param {String} return.text Text from selected OPTION, which is the month name
     */

    /**
     * "change" Listener on the SELECT control for the JumpNavigator's year control
     * @method _selectYear
     * @param e
     * @private
     */
    _selectYear:  function(e){
        _yuitest_coverfunc("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", "_selectYear", 620);
_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 621);
var tar   = e.target,    // SELECT node
            opts  = tar.get('options'),
            sndx  = +tar.get('selectedIndex'),
            sopt  = opts.item(sndx),
            year  = +sopt.get('value');

        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 627);
this.set('year', year);
        _yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 628);
this.fire('yearSelected',{evt:e, value:year, text:sopt.get('text')});
    }

    /**
     * @event yearSelected
     * @param {Object} return
     * @param {EventTarget} return.evt Eventtarget for the SELECT "change" event
     * @param {Number} return.value Value part of the selected OPTION, which is the Selected year
     * @param {String} return.text Text from selected OPTION, which is the selected year
     */

},{
    ATTRS:{

        /**
         * Specifies the Calendar instance that this view will be attached to for header label clicks and
         * for updates to the `date` attribute.

         * @attribute calendar
         * @type Y.Calendar
         * @default null
         */
        calendar:{
            value:      null,
            validator:  function(v) { _yuitest_coverfunc("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", "validator", 652);
_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 652);
return v instanceof Y.Calendar; }
        },

        /**
         Defines the HTML content that is used to setup the Y.Panel instance that is created by this View.
         See the property [template](#property_template) for the default setting.

         @attribute template
         @type String
         @default this.template
         **/
        template:{
            valueFn:    function(){ _yuitest_coverfunc("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", "valueFn", 664);
_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 664);
return this.template; },
            validator:  Y.Lang.isString
        },

        /**
         Sets the beginning year that will be used to setup the "year" SELECT dropdown control, defaults to
         a favorite year of the author's.
         @attribute yearStart
         @type Number
         @default 1985
         **/
        yearStart:{
            value:      1992,
            validator:  Y.Lang.isNumber
        },

        /**
         Sets the last year that should be setup within the "year" SELECT dropdown control, defaults the
         the current year.
         @attribute yearEnd
         @type Number
         @default Current year
         **/
        yearEnd:{
            value:      new Date().getFullYear(),
            validator:  Y.Lang.isNumber
        },

	    /**
	     The x,y offset (horiz, vert) that should be used to offset the popup Panel from the original Calendar "header label"
	      that was clicked.
	     @attribute offsetXY
	     @type Array
	     @default [ 30, 10 ]
	     **/
        offsetXY:{
            value:      [ 30, 10 ],
            validator:  Y.Lang.isArray
        },


	    /**
	     Sets the Event "type" that is used in the Calendar "header label" listener to open the popup Panel.
         Sensible values are "click" or "dblclick".
	     @attribute openEventType
	     @type String
	     @default 'click'
	     **/
        openEventType:{
            value:      'click',
            validator:  Y.Lang.isString
        },

		/**
		 This flag sets whether the Panel instance should be hidden after the "Go" button is pressed
		 @attribute closeAfterGo
		 @type Boolean
		 @default true
		 **/
        closeAfterGo:{
            value:      true,
            validator:  Y.Lang.isBoolean
        }

    }
});

_yuitest_coverline("/build/gallery-calendar-jumpnav/gallery-calendar-jumpnav.js", 731);
Y.namespace("Plugin.Calendar").JumpNav = CalJumpNav;


}, 'gallery-2012.09.26-20-36' ,{requires:['plugin', 'base-build', 'view', 'panel', 'calendar'], skinnable:false});
