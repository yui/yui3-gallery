/*
 * The Popup Calendar extends the YUI Calendar component 
 * to add popup functionality to input forms. 
 *
 * @module popup-calendar
 * @class PopupCalendar
 * @extends Calendar
 */

var INPUT = 'input',
	TABINDEX = "tabindex";

Y.PopupCalendar = Y.Base.create('popup-calendar', Y.Calendar, [Y.WidgetPosition, Y.WidgetPositionAlign, Y.WidgetAutohide], {

	/*
	 * Adds tabindex to input elements if flag is set
	 *
	 * @method initializer
	 * @private
	 */
	initializer: function() {
		Y.log('initializer', 'info', this.name);

		this._bindEvents();

		if(this.get('autoTabIndexFormElements')) {
			this.get(INPUT).ancestor('form').all(INPUT).setAttribute(TABINDEX, '1');
		}			
	},

	/*
	 * Detaches all events added to the input node
	 *
	 * @method destructor
	 * @private
	 */
	destructor: function() {
		Y.log('destructor', 'info', this.name);

		this.get(INPUT).detachAll();
	},		

	/*
	 * Binds events used by the module 
	 *
	 * @method _bindEvents
	 * @private
	 */
	_bindEvents: function() {
		Y.log('_bindEvents', 'info', this.name);

		var input = this.get(INPUT);

		input.on('focus', this.showCalendar, this);
		input.on('keydown', this.testKey, this);
		this.on('selectionChange', this._emitDate, this);
	},

	/*
	 * Sets correct tabindex on popup calendar
	 *
	 * @method _setPopupTabindex
	 * @private
	 */
	_setPopupTabindex: function() {
		Y.log('_setPopupTabindex', 'info', this.name);

		var input = this.get(INPUT),
			inputTabIndex = input.getAttribute(TABINDEX);

		this.get(INPUT).insert(this.get('boundingBox'), 'after');

		if (inputTabIndex === "") { inputTabIndex = "0"; }
		this.get('contentBox').setAttribute(TABINDEX, inputTabIndex);
	},

	/*
	 * Emits the selected date event
	 *
	 * @method _emitDate
	 * @param e {object} selectionChange event object from Calendar
	 * @private
	 */
	_emitDate: function(e) {
		Y.log('emitDate', 'info', this.name);

		this.fire('dateSelected', e);
		this.hideCalendar();
	},

	/*
	 * Tests the keycode on keydown to determine when to hide the calendar
	 *
	 * @method _testKey
	 * @param e {object} keydown event from the input
	 * @private
	 */
	_testKey: function(e) {
		if (e.keyCode === 9) { this.hideCalendar(); }
	},		

	/*
	 * Shows or renders the calendar
	 *
	 * @method showCalendar
	 * @public
	 */
	showCalendar: function() {
		Y.log('showCalendar', 'info', this.name);

		if (this.get('rendered')) {
			this.show() 
		} else {
			this.render();
			this._setPopupTabindex();
		}

		if (this.get('autoFocusOnFieldFocus')) { this.focus(); }
	},

	/*
	 * Hides the calendar - does not remove from dom.
	 *
	 * @method hideCalendar
	 * @public
	 */
	hideCalendar: function() {
		Y.log('hideCalendar', 'info', this.name);

		this.hide();
	}

} , {
	ATTRS: {

		/*
		 * Y.Node object of the input node
		 *
		 * @attribute input
		 * @type Y.Node
		 * @default null
		 * @public
		 */
		input: {
			value: null
		},

		/*
		 * If the user is to autofocus on the calendar
		 * when they enter the input box
		 *
		 * @attribute autoFocusOnFieldFocus
		 * @type bool
		 * @default true
		 * @public
		 */
		autoFocusOnFieldFocus: {
			value: true
		},

		/*
		 * Automatically sets all of the input fields in 
		 * the form to 1 for keyboard navigation cross browser
		 * when the developer forgets to do it manually
		 *
		 * @attribute autoTabIndexFormElements
		 * @type bool
		 * @default true
		 * @public
		 */
		autoTabIndexFormElements: {
			value: true
		}
	}
});