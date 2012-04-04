var cal = null;
//{ lang: 'en' }
YUI({lang: 'es'}).use('gallery-icello-datechooser', function (Y) {
    Y.on('domready', function (e) {
        Y.log('', 'info', 'domready');

        cal = new Y.Icello.DateChooser({
            inputNode: '#txtDate'
        });

        cal.render();
    });
});
    