YUI.add('container-testlib', function (Y) {
    Y.Bottle.init();

    Y.containerTest = {
        Instance: Y.Widget.getByNode(Y.one('#container')),

        headerCommon: function (header) {
            Y.Assert.isObject(header, 'Can not find header');
            Y.Assert.isObject(header.get('parentNode'), 'Can not find header parent node');
        },

        footerCommon: function (footer) {
            Y.Assert.isObject(footer, 'Can not find footer');
            Y.Assert.isObject(footer.get('parentNode'), 'Can not find footer parent node');
        },

        headerShouldBeNotFixed: function () {
            var header = Y.one('.btHeader');

            Y.containerTest.headerCommon(header);
            Y.Assert.isObject(header.get('parentNode').get('className').match(/bt-container-scroll/), 'Can not find bt-container-scroll class on header parent');
        },

        footerShouldBeNotFixed: function () {
            var footer = Y.one('.btFooter');

            Y.containerTest.footerCommon(footer);
            Y.Assert.isObject(footer.get('parentNode').get('className').match(/bt-container-scroll/), 'Can not find bt-container-scroll class on footer parent');
        },

        headerShouldBeFixed: function () {
            var header = Y.one('.btHeader');

            Y.containerTest.headerCommon(header);
            Y.Assert.isObject(header.get('parentNode').get('className').match(/yui3-btcontainer-content/), 'Can not find yui3-btcontainer-content class on header parent');
            Y.Assert.isObject(header.next().get('className').match(/yui3-scrollview/), 'Can not find yui3-scrollview on next node of header');
        },

        footerShouldBeFixed: function () {
            var footer = Y.one('.btFooter');

            Y.containerTest.footerCommon(footer);
            Y.Assert.isObject(footer.get('parentNode').get('className').match(/yui3-btcontainer-content/), 'Can not find yui3-btcontainer-content class on footer parent');
            Y.Assert.isObject(footer.previous().get('className').match(/yui3-scrollview/), 'Can not find yui3-scrollview on previous node of footer');
        },

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
