gallery-advanced-date-format
========

Provide API to format dates.

##Description

This module adds date formatting. The locale-specific data is obtained from ICU.
The API can be used as below.

```javascript
YUI({ lang: 'en-IN' }).use("gallery-advanced-date-format", function(Y) {

    //All paramters in config are optional. Default values shown next to params
    console.log( Y.Date.format(new Date(), {
                timezone: "Asia/Kolkata", //Defaults to Etc/GMT
                dateFormat: "WYMD_LONG",  //Defaults to NONE. Can be set to NONE, WYMD_LONG, WYMD_ABBREVIATED, WYMD_SHORT, WMD_LONG,
                                          //WMD_ABBREVIATED, WMD_SHORT, YMD_LONG, YMD_ABBREVIATED, YMD_SHORT, YM_LONG, MD_LONG,
                                          //MD_ABBREVIATED, MD_SHORT, W_LONG, W_ABBREVIATED, M_LONG, M_ABBREVIATED, YMD_FULL.
                                          //Can be set as a string, or as value from Y.Date.DATE_FORMATS
                                          //Any value can be used with RELATIVE_DATE as in Y.Date.DATE_FORMATS.YMD_FULL | Y.Date.DATE_FORMATS.RELATIVE_DATE

                timeFormat: "HM_SHORT",   //Defaults to NONE. Can be set to NONE, HM_ABBREVIATED, HM_SHORT, H_ABBREVIATED
                                          //Can be set as a string, or as value from Y.Date.TIME_FORMATS

                timezoneFormat: "Z_SHORT" //Defaults to NONE. Can be set to NONE, Z_ABBREVIATED, Z_SHORT
                                          //Can be set as a string, or as value from Y.Date.TIMEZONE_FORMATS
            }) );

    //Duration format with time in seconds
    console.log( Y.Date.formatDuration(3601, {
                style: "HMS_LONG"         //Can be set to HMS_LONG or HMS_SHORT. Can be set as string or as value from Y.Date.DURATION_FORMATS
            }) ); //1 hour 0 minutes 1 second

    //Duration format with xml duration format
    console.log( Y.Date.formatDuration("PT1M2S", {
                style: "HMS_LONG"
            }) ); //1 minute 2 seconds

    //Duration format with explicitly defined hours, minutes or seconds
    console.log( Y.Date.formatDuration({
                    hours: 1, 
                    minutes: 41, 
                    seconds: 3
                }, {
                    style: "HMS_SHORT"
               }) ); //1:41:03

    //Relative time format. eg. 1 minute 5 seconds ago
    console.log( Y.Date.format(date, {     //date is a Date object
                relativeTimeFormat: "ONE_OR_TWO_UNITS_LONG" //format can be ONE_OR_TWO_UNITS_ABBREVIATED, ONE_OR_TWO_UNITS_LONG,
                                                            //ONE_UNIT_ABBREVIATED, ONE_UNIT_LONG.
                                                            //Can be set as string, or as value from Y.Date.RELATIVE_TIME_FORMATS
            }) );

});

```
