//{ lang: 'en' }{lang: 'es'}
YUI().use('gallery-icello-datechooser', function (Y) {
    Y.on('domready', function (e) {
        Y.log('', 'info', 'domready');

        var cal = new Y.Icello.DateChooser({
            inputNode: '#txtDate'  //format is '1/1/2012'
        });

        cal.render();
        
        //to get date at any time
        cal.get('date');
    });
});