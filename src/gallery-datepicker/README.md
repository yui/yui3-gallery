gallery-datepicker
==================

YUI3 Date Picker - A calendar popup for date input form elements

SYNOPSIS
========

    <script src="http://yui.yahooapis.com/3.8.1/build/yui/yui-min.js"></script>
    <script>
    YUI({gallery: "gallery-2013.03.06-21-07"}).use("datepicker", function (Y) {
        new Y.DatePicker({input: "#date"});
    });
    </script>

ARGUMENTS
=========

- input (String|Node): The date input field to transform. Required.

- btnContent (String): HTML to place inside the generated calendar launcher button.

- date (Date): The default selected date. If not provided, the calendar uses
whatever is initially in the input's value.

- minimumDate (Date): limit all dates to be greater than or equal to this date.

- maximumDate (Date): limit all dates to be less than or equal to this date.

- showTime (Boolean): Shows the time portion of the date. in the input
field. The date can be picked in the calendar popup, and the time can
be edited in the input box.

METHODS
=======

- getDate(): Returns the parsed Date objected represented by whatever
is in the input box. Returns null if it doesn't parse.

- setMinimumDate(date): Sets the minimum selectable date.

- setMaximumDate(date): Sets the maximum selectable date.

DESCRIPTION
===========

This class extends YUI3 with a date picker widget, that is able to
take an existing form input field and generate a button next to it that
launches a calendar popup to select a date. The format of the date is
YYYY-MM-DD[ HH:MM::SS]. It is intended to be easy to drop in on a form
element without too much extra work.

