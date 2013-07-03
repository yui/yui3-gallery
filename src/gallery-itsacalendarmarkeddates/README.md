gallery-itsacalendarmarkeddates
===============================

Adds the feature to Calendar to mark Dates.
Is an extention to Y.Calendar, meaning that you can call these methods like myCalendar.getModelsInYear(2015);

<i>Even though the methods in this extention can be used right out of the box, it's recommended to use
<b>gallery-itsacalendarmodellist</b> which uses this extention under the hood. gallery-itsacalendarmodellist uses Y.Models to mark the dates.
<br />All Module-methods can be called without waiting for the Calendar to be rendered</i>

Examples
--------
[Online example](http://projects.itsasbreuk.nl/examples/itsacalendarmarkeddates/index.html)

Documentation
--------------

[API Docs](http://projects.itsasbreuk.nl/apidocs/classes/ITSACalendarMarkedDates.html)

Usage
-----

```js
YUI({gallery: 'gallery-2013.02.27-21-03'}).use('calendar', 'gallery-itsacalendarmarkeddates', function(Y) {
var myCalendar = new Y.Calendar({
    contentBox: "#mycalendar",
    height:'300px',
    width:'300px'
});

myCalendar.render();

var date1 = new Date(2013,01,02),
    date2 = new Date(2013,01,05),
    dateArray;
dateArray.push(date1);
dateArray.push(date2);

myCalendar.markDates(dateArray);

// now check if date2 is marked:
Y.log('Is date2 marked? '+myCalendar.dateIsMarked(date2));
});
```

<u><b>Custom styling:</b></u>

The way matched-Dates are styled can be altered by overruling these styles:
```js
.yui3-skin-sam .yui3-calendar-itsa-markeddates .yui3-itsa-markeddate {}
.yui3-skin-sam .yui3-calendar-itsa-markeddates .yui3-itsa-markeddate:hover {}
.yui3-skin-sam .yui3-calendar-itsa-markeddates .yui3-calendar-prevmonth-day.yui3-itsa-markeddate,
  .yui3-skin-sam .yui3-calendar-itsa-markeddates .yui3-calendar-nextmonth-day.yui3-itsa-markeddate,
  .yui3-skin-sam .yui3-calendar-itsa-markeddates .yui3-calendar-prevmonth-day.yui3-itsa-markeddate:hover,
  .yui3-skin-sam .yui3-calendar-itsa-markeddates .yui3-calendar-nextmonth-day.yui3-itsa-markeddate:hover {}
```

To make sure your new rule takes higher precedence, be sure you give it a finer declaration. For example no dots but red color:
```js
.yui3-skin-sam .yui3-calendar-itsa-markeddates .yui3-calendar-content .yui3-itsa-markeddate {
    background-image: none;
    color: #F00;
}
.yui3-skin-sam .yui3-calendar-itsa-markeddates .yui3-calendar-content .yui3-itsa-markeddate:hover {
    background-image: none;
    color: #F00;
}
.yui3-skin-sam .yui3-calendar-itsa-markeddates .yui3-calendar-content .yui3-calendar-prevmonth-day.yui3-itsa-markeddate,
  .yui3-skin-sam .yui3-calendar-itsa-markeddates .yui3-calendar-content .yui3-calendar-nextmonth-day.yui3-itsa-markeddate,
  .yui3-skin-sam .yui3-calendar-itsa-markeddates .yui3-calendar-content .yui3-calendar-prevmonth-day.yui3-itsa-markeddate:hover,
  .yui3-skin-sam .yui3-calendar-itsa-markeddates .yui3-calendar-content .yui3-calendar-nextmonth-day.yui3-itsa-markeddate:hover {
    background-image: none;
    color: #A00;
}
```

License
-------

Copyright (c) 2013 [Its Asbreuk](http://http://itsasbreuk.nl)

[YUI BSD License](http://developer.yahoo.com/yui/license.html)
