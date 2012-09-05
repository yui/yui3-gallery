YUI.add('slidetab-testlib', function (Y) {
    Y.Bottle.init();

    Y.slidetabTest = {
        Instance: Y.Widget.getByNode(Y.one('[data-role=slidetab]')),

        cfgScrollIsDefault: function () {
            Y.bottleTest.areSame({
                flick: {
                    minDistance: 10,
                    minVelocity: 0.3
                }
            }, this.Instance.get('cfgScroll'));
        }
    };
}, '0.0.1' ,{requires:['bottle-testlib']});
