YUI.add('gallery-button-plugin', function(Y) {

/**
	Node plugin to handle toggle buttons and groups of mutually exclusive toggle buttons.
	Searches a given container for buttons marked with the `yui3-button-toggle` className
	and turns them into toggle buttons and also any HTML element with the `yui3-button-group-exclusive`
	className and makes the toggle buttons within it mutually exclussive.
	Adds the `selected` attribute, for toggle buttons it tells whether the button is in the pressed state,
	for groups of toggles points to the button currently presssed.
	Relies on the cssbutton module for styling.
	@module gallery-button-plugin
	@class ButtonPlugin
	@static
*/
	
var btn = function() {},

    C_BUTTON = 'yui3-button',
    C_TOGGLE = C_BUTTON + '-toggle',
    C_SELECTED = C_BUTTON + '-selected',
    C_EXCLUSIVE = C_BUTTON + '-group-exclusive',
    SELECTED = 'selected',
    CLICK = 'click',
    TOGGLE_BUTTON_SELECTOR = 'button.' + C_TOGGLE,
    SELECTED_BUTTON_SELECTOR = 'button.' + C_SELECTED,
    ARIA_PRESSED = 'aria-pressed',
    BUTTON_TOGGLE = 1,
    GROUP_TOGGLE = 2;

/**
	Getter for the augmented `selected` Node attribute
	@method _selectedGetter
	@return Boolean for toggle buttons, Node reference for groups.   
	        State of the toggle button or Node of toggle button selected within group.
	@static
	@private
*/
btn._selectedGetter = function () {
    switch (this._toggleType) {
        case BUTTON_TOGGLE:
            return this._toggleSelected;
        case GROUP_TOGGLE:
            return this._selectedToggle;
        default:
            return Y.Node.DEFAULT_GETTER.call(this, SELECTED);
    }
};

/**
	Setter for the augmented `selected` Node attribute
	@method _selectedSetter
	@param value {Boolean|Node|String}  For toggle buttons: pressed state,
	       for groups of toggles, reference or css-selector of pressed button 
	@static
	@private
*/
btn._selectedSetter = function(value) {
    var target = null;
    switch (this._toggleType) {
        case BUTTON_TOGGLE:
            this[value?'addClass':'removeClass'](C_SELECTED);
            this[value?'setAttribute':'removeAttribute'](ARIA_PRESSED, true);
            this._toggleSelected = !!value;
            break;
        case GROUP_TOGGLE:
            if (value) {
                target = Y.one(value);
                target.set(SELECTED, true);
                this._selectedToggle = (target.get(SELECTED)?target:null);
            } else {
                this._selectedToggle = null;
            }                        
            this.all(TOGGLE_BUTTON_SELECTOR).each(function (node) {
                if (node !== target) {
                    node.set(SELECTED, false);
                }
            });    
            break;
        default:
            Y.Node.DEFAULT_SETTER.call(this,SELECTED, value);
            break;
    }
    return value;
};

/**
	Plugs into a toggle button
	@method _addToggleButton
	@param node {Node} Reference to the Node to be plugged into
	@private
	@static
*/
btn._addToggleButton = function (node) {
    node._toggleType = BUTTON_TOGGLE;
    node.set(SELECTED, node.hasClass(C_SELECTED));
    node.on(CLICK, function () {
        this.set(SELECTED, !this.get(SELECTED));
    });

};
/**
	Plugs into a container of mutually exclusive toggle buttons
	@method _addButtonGroup
	@param node {Node} Reference to the container of the buttons
	@private
	@static
*/
btn._addButtonGroup = function (node) {
    node._toggleType = GROUP_TOGGLE;
    node.set(SELECTED, Y.one(SELECTED_BUTTON_SELECTOR));
    node.delegate(CLICK, function(ev) {
        var target = ev.target;
        ev.container.set(SELECTED, target.get(SELECTED)?target:null);
    },TOGGLE_BUTTON_SELECTOR);
};
/**
	Searches within the given container or the body of the document for
	buttons marked with the className `yui3-button-toggle`
	and elements with the className `yui3-button-group-exclusive` and
	plugs them with this module
	@method addToggles
	@param [container] {Node|string} Node instance or css selector of the element
		containing the buttons or button groups to be plugged into. 
		Assumes the document body if missing.
	@static
*/
	
btn.addToggles = function (container) {
    container = Y.one(container || 'body');
    container.all(TOGGLE_BUTTON_SELECTOR).each(btn._addToggleButton);
    container.all('.' + C_EXCLUSIVE).each(btn._addButtonGroup);
};


/**
	Augmented `selected` attribute. 
	For toggle buttons indicates whether the button is pressed.
	For groups of toggle buttons sets/return the reference to the button pressed
	@attribute selected
	@value Boolean for toggle buttons, Node reference or CSS selector for button groups
*/ 
Y.Node.ATTRS[SELECTED] = {
    getter: btn._selectedGetter,
    setter: btn._selectedSetter
};

/**
 	Signals if it is a toggle button or a group of toggle buttons.
 	1 for toggle buttons, 2 for groups of toggle buttons
 	@property _toggleType
 	@for Node
 	@type integer
 	@private
 */
 /**
 	Holds a reference to the only pressed toggle button within a group
 	@property _selectedToggle
 	@for Node
 	@type Y.Node
 	@private
 */
 

Y.ButtonPlugin = btn;                



}, 'gallery-2012.03.28-20-16' ,{requires:['node', 'cssbutton'], skinnable:false});
