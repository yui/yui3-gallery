YUI().use('node', 'datatype', 'gallery-icello-date', function (Y) {
    Y.on('domready', function (e) {
         var IDate = Y.Icello.Date,
             YDate = Y.DataType.Date;
        
         var equalDays = function (date1, date2, contextMsg) {
             var areDaysEqual = IDate.areDaysEqual(date1, date2);
             var date1Str = YDate.format(date1, { format: '%D' });
             var date2Str = YDate.format(date2, { format: '%D' });
             ok(areDaysEqual, "date1: " + date1Str + "; date2: " + date2Str + "; context: " + contextMsg);
         };
        
         var notEqualDays = function (date1, date2, contextMsg) {
             var areDaysEqual = IDate.areDaysEqual(date1, date2);
             var date1Str = YDate.format(date1, { format: '%D' });
             var date2Str = YDate.format(date2, { format: '%D' });
             ok(!areDaysEqual, "date1: " + date1Str + "; date2: " + date2Str + "; context: " + contextMsg);
         };
        
         module('addMonths tests');
         test('calling addMonths(d, 1) from Jan 1, 2011 should return Feb 1, 2011', 1, function () {
             var d1 = new Date(2011, 0, 1);
             var d2 = IDate.addMonths(d1, 1);
             equalDays(d2, new Date(2011, 1, 1), 'after adding 1 month to Jan 1, 2011, it should be Feb 1, 2011');
         });
         test('calling addMonths(d, 1) from Jan 31, 2011 should return Feb 28, 2011', 1, function () {
             var d1 = new Date(2011, 0, 31);
             var d2 = IDate.addMonths(d1, 1);
             equalDays(d2, new Date(2011, 1, 28), 'after adding 1 month to Jan 31, 2011, it should be Feb 28, 2011');
         });
        
         module('areDaysEqual tests');
         test('2 dates on same day but different times should be equal', 1, function () {
             var today = new Date();
             var todayDifferentTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
             equalDays(today, todayDifferentTime, "'today' and 'todayDifferentTime'");
         });
         test('2 dates on different days should not be equal', 1, function () {
             var today = new Date(2011, 8, 25);
             var tomorrow = new Date(2011, 8, 26);
             notEqualDays(today, tomorrow, "'today' and 'tomorrow'");
         });
        
         module('formatShortDate tests');
         test('Date 02/05/2011 should return string "2/5/2011"', 1, function () {
             var d = new Date('02/05/2011');
        
             equal(IDate.formatShortDate(d), '2/5/2011');
         });
         test('Date 11/15/2011 should return string "11/15/2011"', 1, function () {
             var d = new Date('11/15/2011');
        
             equal(IDate.formatShortDate(d), '11/15/2011');
         });

        
    });
});