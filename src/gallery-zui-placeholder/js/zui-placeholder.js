var isNativeSupport = ('placeholder' in document.createElement('input')),
    txtPlaceHolderInstalled = 'phok',
    txtPlaceHolderFocusStyle = 'phfocus',
    fNull = function () {},

    handleFocus = function (E) {
        E.currentTarget.removeClass(txtPlaceHolderFocusStyle);

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
            E.currentTarget.addClass(txtPlaceHolderFocusStyle);
        }
    },

    installPH = function (O) {
        // only install once
        if (O.getAttribute(txtPlaceHolderInstalled) === 1) {
            return;
        }
        O.setAttribute(txtPlaceHolderInstalled, 1);

        // if no placeholder, stop
        if (! O.getAttribute('placeholder')) {
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
    };

Y.namespace('zui').placeholder = {
    install: isNativeSupport ? fNull : function (R) {
        var nodes = R.each ? R : Y.all(R);
        if (!nodes) {
            return;
        }
        nodes.each(installPH);
    }
};
