gallery-itsacalendarmodellist
=============================

Adds the feature to attach a ModelList to Calendar.
Is an extention to Y.Calendar, meaning that you can call these methods like this:
myCalendar.getModelsInYear(2015);

<i>Uses <b>gallery-itsacalendarmarkeddates</b> under the hood.</i>


Coupling a ModelList to Calendar-instance results in highlighted dates for each Model that has a 'Date-match'.
To determine a 'Date-match' the Model must have a field of a Date-type.
This can be defined with the <b>Calendar-attribute</b> <i>'modelConfig.date'</i>. When not defined, this Module will
automaticly search in the first Model-structure for an appropriate modelConfig.date.

The Calendar-attribute 'modelConfig' can be omitted. But when applied, it should be an object with
the next possible fields: <b>date</b>, <b>enddate</b>, <b>count</b>, <b>intervalMinutes</b>,
<b>intervalHours</b>, <b>intervalDays</b> and <b>intervalMonths</b>.

If you look it this way, the Models can have an event (=happening) with a Date where something occurs.
This event could also have an endDate, in case the event crosses multiple Dates. And events can be repeating (count times),
in case we need to define the repeat-Interval, either in Minutes, Hours, Days or Months. Thus, an arbitrary Model
could have the following structure:

```js
var someEvent = new Y.Model({
     name : 'Some conference',
     starts : new Date(2013, 01, 25),
     ends : new Date(2013, 01, 26),
     repeattimes : 10,
     monthStep : 12
});
```

Without specifying Calendar.modelConfig, this would lead to just marking 25 feb. 2013.
But when Calendar.modelConfig specifies which Model-attributes can be used to extract the appropriate values,
we can enhance the Model-behaviour in a way that startDate-endDate is marked and that the marking is repeated over 10 years.

So, we need to specify modelConfig like this:
```js
// define Calendar-attribute
myModelConfig = {
        date: 'starts',
        enddate: 'ends',
     // intervalMinutes: '',  <-- not needed in this example
     // intervalHours: '',  <-- not needed in this example
     // intervalDays: '',  <-- not needed in this example
        intervalMonths: 'monthStep',
        count: 'repeattimes'
};
```

The Calendar-instance will automaticly be updated when there are changes in the Models or ModelList. It also updates when the
modelList-attribute is changed (attaching another ModelList).

When a Date in the Calendar is clicked, Calendar fires a <b>modelSelectionChange</b>-event which holds an Array of unique bound Models
regarding to the selectedDates.

Examples
--------
[Online example](http://projects.itsasbreuk.nl/examples/itsacalendarmodellist/index.html)

Documentation
--------------

[API Docs](http://projects.itsasbreuk.nl/apidocs/classes/ITSACalendarModelList.html)

Usage
-----

<u><b>Usage 1:</b></u>
```js
YUI({gallery: 'gallery-2013.02.27-21-03'}).use('calendar', 'gallery-itsacalendarmodellist', function(Y) {
var myModelList = new Y.ModelList(),
    appointment1, appointment2;

    appointment1 = new Y.Model({
        name: 'Fishing',
        when: new Date(2013, 01, 03)
    });

    appointment2 = new Y.Model({
        name: 'Carwash',
        when: new Date(2013, 01, 12)
    });

    myModelList.add([appointment1, appointment2]);

    var myCalendar = new Y.Calendar({
         contentBox: '#mycalendar',
         height:'300px',
         width:'300px',
         modelList: myModelList
     });

     myCalendar.render();

     // now check if Calendar has a Model at 3-feb 2013 (no need to wait for Calendar to be rendered):
     Y.log('Is there an event at 3-feb 2013? '+myCalendar.dateHasModels(new Date(2013, 01, 03)));
});
```

 <u><b>Usage 2:</b></u>
```js
YUI({gallery: 'gallery-2013.02.27-21-03'}).use('calendar', 'gallery-itsacalendarmodellist', function(Y) {
var myModelList = new Y.ModelList(),
    appointment1, appointment2, myModelConfig;

    appointment1 = new Y.Model({
        name: 'Skiing',
        starting: new Date(2013, 01, 03),
        ending: new Date(2013, 01, 05)
    });

    appointment2 = new Y.Model({
        name: 'Swimming',
        starting: new Date(2013, 01, 12),
        numberOfTimes: 6,
        intervalInDays: 7
    });

    myModelConfig = {
        date: 'starting',
        enddate: 'ending',
        intervalDays: 'intervalInDays',
        count: 'numberOfTimes'
    };

    myModelList.add([appointment1, appointment2]);

    var myCalendar = new Y.Calendar({
         contentBox: '#mycalendar',
         height:'300px',
         width:'300px',
         modelList: myModelList,
         modelConfig: myModelConfig
     });

     myCalendar.render();
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
