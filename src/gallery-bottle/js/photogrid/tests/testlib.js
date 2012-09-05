YUI.add('photogrid-testlib', function (Y) {
    Y.Bottle.init();

    Y.photogridTest = {
        Instance: Y.Widget.getByNode(Y.one('[data-role=photogrid]')),

        columnWidthIsDefault: function () {
            Y.Assert.areSame(200, this.Instance.get('columnWidth'));
        },

        gridTypeIsDefault: function () {
            Y.Assert.areSame('vertical', this.Instance.get('gridType'));
        }
    };
}, '0.0.1' ,{requires:['bottle-testlib']});
