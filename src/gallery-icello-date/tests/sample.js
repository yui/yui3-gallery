YUI().use('gallery-icello-date', function (Y) {
    var d1 = new Date(2011, 0, 31),
        d2 = Y.Icello.Date.addMonths(d1, 1);
    //after adding 1 month to Jan 31, 2011, d2 is Feb 28, 2011 not Mar 3, 2011
    Y.log('d1: ' + d1);
    Y.log('d2: ' + d2);
});