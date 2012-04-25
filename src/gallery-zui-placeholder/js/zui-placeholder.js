/**
 * The Placeholder module provides utilities to enable placeholder
 * support for older browsers
 *
 * @module gallery-zui-placeholder
 */ 
var isNativeSupport = ('placeholder' in document.createElement('input')),
    txtPlaceHolderInstalled = 'data-phok',
    clsPlaceHolderBlur = 'zui-phblur',
    cntInstall,
    fNull = function () {},

    handleFocus = function (E) {
        E.currentTarget.removeClass(clsPlaceHolderBlur);

        if (E.currentTarget.get('value') === E.currentTarget.getAttribute('placeholder')) {
            E.currentTarget.set('value', '');
        }
    },

    handleBlur = function (E) {
        var v = E.currentTarget.get('value'),
            p = E.currentTarget.getAttribute('placeholder');

        if (v === '') {
            E.currentTarget.set('value', p);
        }

        if (v === p || v === '') {
            E.currentTarget.addClass(clsPlaceHolderBlur);
        }
    },

    isInstalled = function (O, R) {
        if (O.getAttribute(txtPlaceHolderInstalled) === '1') {
            if (R) {
                O.setAttribute(txtPlaceHolderInstalled, '');
            }
            return true;
        }
        O.setAttribute(txtPlaceHolderInstalled, '1');
    },

    installPH = function (O) {
        // only install once
        if (isInstalled(O)) {
            return;
        }

        // if no placeholder, stop
        if (!O.getAttribute('placeholder')) {
            return;
        }

        // handle focus, blur
        O.on('focus', handleFocus);
        O.on('blur', handleBlur);

        // if is already focused, run handleFocus 1 time
        if (O.compareTo(document.activeElement)) {
            handleFocus({currentTarget: O});
        } else {
            handleBlur({currentTarget: O});
        }

        cntInstall += 1;
    },

    uninstallPH = function (O) {
        if (!isInstalled(O, 1)) {
            return;
        }

        // if no placeholder, stop
        if (!O.getAttribute('placeholder')) {
            return;
        }

        // remove focus, blur handler
        O.detach('focus', handleFocus);
        O.detach('blur', handleBlur);

        handleFocus({currentTarget: O});
        cntInstall += 1;
    };
/**
 * A static object to access zui placeholder properties and methods
 * @class Y.zui.placeholder
 */
Y.namespace('zui').placeholder = {
    /**
     * whether this browser supports placeholder natively
     * @property isNative
     * @static
     * @type bool
     */
    isNative: isNativeSupport,

    /**
     * A string used to set attribute to indicate this node installed placeholder or not
     * @property txtInstalled
     * @static
     * @final
     * @type string
     */
    txtInstalled: txtPlaceHolderInstalled,


    /**
     * A string used to set classname when this input should show placeholder
     * @property clsBlur
     * @static
     * @final
     * @type string
     */
    clsBlur: clsPlaceHolderBlur,

    /**
     * use this method to install placeholder on nodes
     * @method install
     * @param elements {NodeList || Node || HTMLElement || cssString} Optional. The elements to install placeholder support
     * @return {Array} An array contains [TotalElements, InstalledElements] when no native placeholder support. return undefined when the browser suppports placeholder natively.
     * @static
     */
    install: isNativeSupport ? fNull : function (R) {
        var nodes = (R && R.each) ? R : Y.all(R || 'input, textarea');

        cntInstall = 0;

        if (!nodes) {
            return [0, 0];
        }
        nodes.each(installPH);

        return [nodes.size(), cntInstall];
    },

    uninstall: isNativeSupport ? fNull : function (R) {
        var nodes = (R && R.each) ? R : Y.all(R || 'input, textarea');

        cntInstall = 0;
        if (!nodes) {
            return [0, 0];
        }
        nodes.each(uninstallPH);

        return [nodes.size(), cntInstall];
    },

    installDelegate: isNativeSupport ? fNull : function (P, R) {
        var parent = P ? Y.one(P) : Y.one('body');

        if (!parent) {
            return [0, 0];
        }

        if (!parent.delegate) {
            return [-1, -1];
        }

        if (isInstalled(parent)) {
            return [1, 0];
        }

        parent.delegate('focus', handleFocus, R);
        parent.delegate('blur', handleFocus, R);

        return [1, 1];
    }
};
