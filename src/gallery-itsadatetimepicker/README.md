gallery-itsadatetimepicker
==========================


Class Y.ITSADateTimePicker.


Class that pickes dates and times using Promises. It can be used as a date-picker, time-picker or both.


There are several options that can make the Picker to be modal, align next to the button that launched it and passing an initial date-time value. The Class also can render 3 button-Nodes with calendar-icon, time-icon or both.

So, the Module has a class Y.ItsaDateTimePicker which generates only one Picker-instance, which is available right away, across multiple YUI-instances. Only one Picker-instance is created to save unnecessary rendering. The real rendering of the panel-, calendar- and dial-instances are also delayed for 1 second for performancereason. Should the Picker be needed before, then rendering will start when needed.

There are <u>3 Promises</u> that can be asked for:

* <b>Y.ItsaDateTimePicker.getDate</b>(initialDate, activationNode, config)
* <b>Y.ItsaDateTimePicker.getTime</b>(initialDate, activationNode, config)
* <b>Y.ItsaDateTimePicker.getDateTime</b>(initialDate, activationNode, config)

All Promises return a Date-object (if fulfilled). Which fields of the Date-object are filled depends of the called Promise:
* Y.ItsaDateTimePicker.getDate() --> dd-mm-yyyy 00:00:00,000
* Y.ItsaDateTimePicker.getTime() --> 01-01-1900 hh:mm:00,000
* Y.ItsaDateTimePicker.getDateTime() --> dd-mm-yyyy hh:mm:00,000

The promises can be called at any time and will pop-up the Picker. Which will return the Promise. Most likely, these promises are called when a user presses a button (more about that later). The Promises can receive 2 paramers which are optional:

* <b>initialDate</b>: <i>{Date}</i> date-object that holds the initial date-time for the Picker. If not set, then the current date-time is used.
* <b>config</b>: <i>{Object}</i> object to adjust the behaviour of the Picker.

The applied config is a mix of the Picker's attribute <i>'defaultConfig'</i>, combined with the 'config' of the promise-call. If you find yourself supplying the same config for all promise-calls over and over again, you better change the 'defaultConfig' with <b>Y.ItsaDateTimePicker.set('defaultConfig', {...});</b>. You only need to define the properties you want to be overruled: they get mixed with a baseConfig that holds the initial config-properties.

<b>Calling the Promise by buttons</b>
Most likely you will have a button-element on the page with a sort of calendar-icon. When pressed, you'll ask for one of the 3 Promises. This module has 3 methods that will create button-Nodes with nice css. Event better way is, to include the right html directly into the page.

<u>Methods to create button-Nodes</u>
There are 3 methods who create buttonNodes. Remember that you have to insert them into the DOM yourself.

* <b>Y.ItsaDateTimePicker.dateNode</b>()
* <b>Y.ItsaDateTimePicker.timeNode</b>()
* <b>Y.ItsaDateTimePicker.datetimeNode</b>()

However, the <u>prefered way is to insert the html of the buttonNodes yourself</u>. In that case, you need to use this html:
```
<button class="yui3-button itsa-button-datetime"><span class="itsa-datetimepicker-icondate"></span></button>
<button class="yui3-button itsa-button-datetime"><span class="itsa-datetimepicker-icontime"></span></button>
<button class="yui3-button itsa-button-datetime"><span class="itsa-datetimepicker-icondatetime"></span></button>
```

Be aware that the css for the nodemarkup needs to be loaded. Without any precautions, you will suffer changes in the markup, just the same as with any widget that needs to be rendered. To overcome this, it is suggested you add the class:
<b>'itsa-datetimepicker-loading'</b> to the body-element. The module has css that will hide elements with next class:
```css
.yui3-js-enabled .itsa-datetimepicker-loading .itsa-button-datetime {
    display: none;
}
```
Once the module is available, it will remove the class 'itsa-datetimepicker-loading' from the body-node (should it be applied).

<b>When you need to handle the 'onRejected-callback'</b>

When a date-time promise is requested, the user might click the close-button, by which the promise will be rejected. You can supress the close-button by setting <i>config.forceSelectdate=true</i>. In that case, the Picker comes without close-button and you don't need to handle the 'onRejected-callback' for the promise will never be rejected.

<b>Multiple instance of Y.ITSADateTimePicker</b>

When the module is loaded, already 1 instance of Y.ITSADateTimePicker is available for use: <i>Y.ItsaDateTimePicker</i>. When you need multiple Pickers at the same time, you can create more instances. <i>But you must take care to destroy them yourself as soon as the promise is resolved</i>.

```js
    var extraPicker = new Y.ITSADateTimePicker(); // create a second instance of Y.ITSADateTimePicker
    extraDate = extraPicker.getDate(iconDate);
    extraDate.then(
        function(newdate) {
            ...
            if (!extraPicker.get('destroyed')) {
                extraPicker.destroy();
            }
        }
        function(reason) {
            ...
            if (!extraPicker.get('destroyed')) {
                extraPicker.destroy();
            }
        }
    );

});
```
In this code, extraDate is a promise. extraDate.then() can be used multiple times, even if extraPicker is destroyed. See Example 5.

Examples
--------
[Online example](http://projects.itsasbreuk.nl/examples/itsadatetimepicker/index.html)

Documentation
--------------
[API Docs](http://projects.itsasbreuk.nl/apidocs/classes/ITSADateTimePicker.html)

Usage
-----

<b>Example 1: Getting a timevalue and process the promise in one statement:</b>
```js
YUI({gallery: 'gallery-2013.04.10-22-48'}).use('gallery-itsadatetimepicker', function(Y) {
    // Y.ItsaDateTimePicker is ready to be used...

    Y.ItsaDateTimePicker.getTime().then(
        function(newdate) {
            // newdate is a Date-object
            // newdate.getHours() and newdate.getMinutes() contain the responsevalue
            // the other fields are empty: 01-01-1900 hh:mm:00,000
            ...
        },
        function(reason) {
            // user closed the Picker without selecting the new time
            // 'reason' will contain: new Error('canceled');
            ...
        }
    );

});
```

<b>Example 2: Getting a datevalue and handle it later on:</b>
```js
YUI({gallery: 'gallery-2013.04.10-22-48'}).use('gallery-itsadatetimepicker', function(Y) {
    // Y.ItsaDateTimePicker is ready to be used...

    var datepromise = Y.ItsaDateTimePicker.getDate();
    // datepromise now will promise to hold a datevalue within the .then() method
    // which can be used later on. Y.ItsaDateTimePicker.getDate() will show the datepicker
    // in a non-blocking way.

    // You must use .then() to be sure the promise is fulfilled (or rejected) so you can process the value:
    datepromise.then(
        function(newdate) {
            // newdate is a Date-object
            // newdate.getFullYear(), newdate.getMonth() and newdate.getDate() contain the responsevalue
            // the other fields are empty: dd-mm-yyyy 00:00:00,000
            ...
        },
        function(reason) {
            // user closed the Picker without selecting the new time
            // 'reason' will contain: new Error('canceled');
            ...
        }
    );

    // any time later, you can ask for the returned date-value again.
    // this DOES NOT show the datepicker again --> the promise will be fulfilled only once
    datepromise.then(
        function(newdate) {
            // use the same selected 'newdate' again
            ...
        },
        function(reason) {
            // user closed the Picker without selecting the new time
            // 'reason' will contain: new Error('canceled');
            ...
        }
    );

});
```

<b>Example 3: Date-picker which will be aligned next to the button-node with a calendar-icon:</b>
```
<body class='yui3-skin-sam itsa-datetimepicker-loading'>
    <span id='datefield'></span>
    <button id='dateselector' class='yui3-button itsa-button-datetime'>
        <span class='itsa-datepicker-icondate'></span>
    </button>
    <span id='status'></span>
</body>
```

```js
YUI({gallery: 'gallery-2013.04.10-22-48'}).use('node', 'gallery-itsadatetimepicker', 'datatype-date-format', function(Y) {
    // Y.ItsaDateTimePicker is ready to be used...

    var date = new Date(2010, 05, 20);
    var datefield = Y.one('#datefield');
    var status = Y.one('#status');
    var btnDate = Y.one('#dateselector');

    datefield.setHTML(Y.Date.format(date, {format: '%d/%m/%Y'}));

    btnDate.on('click', function(e){
        status.setHTML('');
        // Y.ItsaDateTimePicker.getDate() returns an Y.Promise
        // first parameter holds the initial date.
        // in the second parameter, the node that causes the Picker to appear,
        // is used to align the Picker-panel against.
        Y.ItsaDateTimePicker.getDate(date, {alignToNode: e.currentTarget}).then(
            function(newdate) {
                date.setTime(newdate.getTime());
                datefield.setHTML(Y.Date.format(date, {format: '%d/%m/%Y'}));
                status.setHTML('new date is set');
            },
            function(reason) {
                status.setHTML('no date set: '+reason);
            }
        );
    });

});
```

<b>Example 4: Date- and time-picker which is modal, centered on the page and dragable:</b>
```
<body class='yui3-skin-sam itsa-datetimepicker-loading'>
    <span id='datefield'></span>
</body>
```

```js
YUI({gallery: 'gallery-2013.04.10-22-48'}).use('node', 'gallery-itsadatetimepicker', 'datatype-date-format', function(Y) {
    // Y.ItsaDateTimePicker is ready to be used...

    var picker = Y.ItsaDateTimePicker; // for shorter reference
    var date = new Date(2010, 05, 20);
    var datefield = Y.one('#datefield');

    // Redefine default config for the Picker --> this way it will be used with every new promisecalls:
    picker.set('defaultConfig', {
        dragable: true,
        titleDateTime: 'Select date and time and confirm with the select-button'
    });

    datefield.setHTML(Y.Date.format(date, {format: '%d/%m/%Y'}));

    // creating a nice 'datebutton' and append it to the html
    // this also could have been done with HTML-code (better)
    // Y.ItsaDateTimePicker.dateNode() returns an Y.Node
    var btnDateTime = picker.datetimeNode();
    Y.one('body').append(btnDateTime);

    btnDateTime.on('click', function(e){
        // Y.ItsaDateTimePicker.getDateTime() returns an Y.Promise
        // first parameter holds the initial date.
        picker.getDateTime(date, {modal: true, dragable: true}).then(
            function(newdate) {
                date.setTime(newdate.getTime());
                datefield.setHTML(Y.Date.format(date, {format: '%d/%m/%Y %l:%M %p'}));
            }
        );
    });

});
```

<b>Example 5: Using multilpe datetime-pickers at the same time:</b>
```
<body class='yui3-skin-sam itsa-datetimepicker-loading'>
    <span id='datefield1'></span>
    <div id='dateicon1' class='yui3-button itsa-button-datetime'>
        <span class='itsa-datepicker-icondate'></span>
    </div>
    <span id='datefield2'></span>
    <div id='dateicon2' class='yui3-button itsa-button-datetime'>
        <span class='itsa-datepicker-icondate'></span>
    </div>
</body>
```

```js
YUI({gallery: 'gallery-2013.04.10-22-48'}).use('node', 'gallery-itsadatetimepicker', 'datatype-date-format', function(Y) {
    // Y.ItsaDateTimePicker is ready to be used...

    var picker1 = Y.ItsaDateTimePicker; // for shorter reference --> default Picker which is always available
    var picker2 = new Y.ITSADateTimePicker(); // create a second instance of Y.ITSADateTimePicker
    var iconDate1 = Y.one('#dateicon1');
    var iconDate2 = Y.one('#dateicon2');
    var datefield1 = Y.one('#datefield1');
    var datefield2 = Y.one('#datefield2');

    // we display right away:
    picker1.getDate(iconDate1).then(
        function(newdate) {
            datefield1.setHTML(Y.Date.format(newdate, {format: '%d/%m/%Y %l:%M %p'}));
        }
    );

    secondDate = picker2.getDate(iconDate2);

    secondDate.then(
        function(newdate) {
            datefield2.setHTML(Y.Date.format(newdate, {format: '%d/%m/%Y %l:%M %p'}));
            // Do not forget to destroy picker2 to save memory!
            // Because it might already have been handled by another 'seconddate.then()'
            // you need to check its excistance first.
            // remember: secondDate will still remain and secondDate.then() can be called at any time!
            if (!picker2.get('destroyed')) {
                picker2.destroy();
            }
        }
    );

    // Even if picker2 might have been destroyed, secondDate,then() still can be called
    secondDate.then(
        function(newdate) {
            datefield2.setHTML(Y.Date.format(newdate, {format: '%d/%m/%Y %l:%M %p'}));
            // Do not forget to destroy picker2 to save memory!
            // Because it might already have been handled by another 'seconddate.then()'
            // you need to check its excistance first.
            // remember: secondDate will still remain and secondDate.then() can be called at any time!
            if (!picker2.get('destroyed')) {
                picker2.destroy();
            }
        }
    );

});
```

License
-------

Copyright (c) 2013 [Its Asbreuk](http://http://itsasbreuk.nl)

[YUI BSD License](http://developer.yahoo.com/yui/license.html)
