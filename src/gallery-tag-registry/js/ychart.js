Y.Tag.register('ychart', {
    created: function(config) {
        this.get('host').setHTML('<div></div>');
        this._widget = new Y.Chart({
            dataProvider: Y.config.win[config.dataprovider],
            render: this.get('host').one('div')
        });
    }
});