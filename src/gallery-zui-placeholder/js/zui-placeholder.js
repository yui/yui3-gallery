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

    isInstalled = function (O) {
        if (O.getAttribute(txtPlaceHolderInstalled) === '1') {
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
    };

Y.namespace('zui').placeholder = {
    isNative: isNativeSupport,
    txtInstalled: txtPlaceHolderInstalled,
    clsBlur: clsPlaceHolderBlur,

    install: isNativeSupport ? fNull : function (R) {
        var nodes = (R && R.each) ? R : Y.all(R || 'input, textarea');

        cntInstall = 0;

        if (!nodes) {
            return [0, 0];
        }
        nodes.each(installPH);

        return [nodes.size(), cntInstall];
    },

    installDelegate: isNativeSupport ? fNull : function (P, R) {
        var parent = P ? Y.one(P) : Y.one('body');

        if (!parent) {
            return [0, 0];
        }

        if (isInstalled(parent)) {
            return [1, 0];
        }

        if (!parent.delegate) {
            return [-1, -1];
        }

        parent.delegate('focus', handleFocus, R);
        parent.delegate('blur', handleFocus, R);

        return [1, 1];
    }
};
