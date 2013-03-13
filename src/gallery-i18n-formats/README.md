gallery-i18n-formats
========

Provide API to format data, using ICU data. Adds date, number and message formatting. Message format supports date, time, number, stirng, select, choice and plural types.

##Description

This module adds date, number and message formatting. Message format supports date, time, number, stirng, select, choice and plural types. The locale-specific data is obtained from ICU.
The API can be used as below.

```javascript
YUI({ lang: 'en-IN' }).use("gallery-i18n-formats", function(Y) {
    //Format number in specified style. Style can be CURRENCY_STYLE, ISO_CURRENCY_STYLE, NUMBER_STYLE, PERCENT_STYLE, PLURAL_CURRENCY_STYLE, SCIENTIFIC_STYLE
    console.log(Y.Number.format(1000000, { style: "CURRENCY_STYLE" }));  //Will output Rs 10,00,000.00. For lang en-US, it would have been $1,000,000.00

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


    //Message format with date, time and number
    console.log(
           Y.Intl.formatMessage(
                 "At {1,time} on {1,date}, there was {2} on planet{0,number,integer}.",
                 [7, new Date(), "a disturbance in the force"]
           )
    );

    //Select formatter
    console.log(
           Y.Intl.formatMessage(
                 "{NAME} est {GENDER, select, female {allée} other {allé}} à {CITY}.",
                 {
                    "NAME": "Henri", 
                    "GENDER": "male", 
                    "CITY": "Paris"
                 }
           )
    );

    //Plural formatter
    console.log(
           Y.Intl.formatMessage(
                 "{COMPANY_COUNT, plural, one {One company} other {# companies}} published new books.",
                 {
                    "COMPANY_COUNT": 1
                 }
           )
    );

    //Choice formatter
    console.log(
           Y.Intl.formatMessage(
                 "There {FILE_COUNT, choice, 0#are no files|1#is one file|1<are {FILE_COUNT, number, integer} files} on disk.",
                 {
                    "FILE_COUNT": 0
                 }
           )
    );

    //List formatter
    console.log(
           Y.Intl.formatMessage(
                 "{COUNTRIES, list}",
                 {
                    "COUNTRIES": ["US", "UK", "Canada"]
                 }
           )
    );
});

```
