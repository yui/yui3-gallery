    var WordCountPlugin = function (config) {
        WordCountPlugin.superclass.constructor.apply(this, arguments);
    }

    WordCountPlugin.NAME = 'plugWordCount';
    WordCountPlugin.NS = 'wordcount';
    WordCountPlugin.ATTRS = {
        nodeCount: {
            writeOnce: true,
            setter: Y.one
        },
        txtMax: {
            value: 'overflow'
        },
        txtMin: {
            value: 'underflow'
        },
        lenMax: {
            value: 4000
        },
        lenMin: {
            value: 1
        },
        nodeFlag: {
            setter: Y.one
        },
        txtStatus: {
        }
    };

    Y.namespace('Plugin').WordCount = Y.extend(WordCountPlugin, Y.Plugin.Base, {
        initializer: function (config) {
            this.handleValueChange();
            this.afterHostEvent('valueChange', this.handleValueChange);
        },
        handleValueChange: function (E) {
            var len = this.get('host').get('value').length,
                min = this.get('lenMin'),
                rest = this.get('lenMax') - len,
                nodeCount = this.get('nodeCount');

            if (rest < 0) {
                this.set('txtStatus', 'underflow');
            } else {
                if (len < min) {
                    this.set('txtStatus', 'overflow');
                }
            }

            nodeCount.setContent(rest);
            nodeCount.toggleClass(this.get('txtMax'), rest < 0);
            nodeCount.toggleClass(this.get('txtMin'), len < min);
        }
    });

