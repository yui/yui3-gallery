/**
 * The Attribute module provides more methods for Attribute object
 * support for older browsers
 *
 * @module gallery-zui-attribute-core
 */

/**
 * A augmentable implementation for Attribute, providing extended
 * methods for Attribute management such as toggle() and set_again()   
 *
 * @class ZAttribute
*/ 
function ZAttribute() {}

ZAttribute.prototype = {
    /**
     * toggle the value of an attribute.
     *
     * @method toggle
     * @param {String} name The name of the attribute.
     * @chainable
     */ 
    toggle: function(name) {
        if (this.set && this.get) {
            this.set(name, this.get(name) ? false : true);
        }

        return this;
    },

    /**
     * set the value of an attribute to current value, to trigger setter function or valueChange event.
     *
     * @method set_again
     * @param {String} name The name of the attribute.
     * @chainable
     */ 
    set_again: function(name) {
        if (this.set && this.get) {
            this.set(name, this.get(name));
        }
        return this;
    },

    /**
     * set the value of an attribute, this wrapped function help to maintain a value change stack for revert().
     *
     * @method set
     * @param {String} name The name of the attribute.
     * @param {String} value The value of the attribute.
     * @chainable
     */
    set: function(name, value) {
        if (!this.revertStack) {
            this.revertStack = {};
        }
        if (!this.revertStack[name]) {
            this.revertStack[name] = [];
        }
        this.revertStack[name].push(value);
        return this._setAttr(name, value);
    },

    /**
     * revert the value of an attribute. If no older value, do nothing.
     *
     * @method revert
     * @param {String} name The name of the attribute.
     * @chainable
     */
    revert: function(name, value) {
        if (!this.revertStack[name] || (this.revertStack[name].length < 2)) {
            return this;
        }

        this.revertStack[name].pop();

        return this._setAttr(name, this.revertStack[name][this.revertStack[name].length - 1]);
    }
};

Y.namespace('zui').Attribute = ZAttribute;
