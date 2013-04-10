gallery-i18n-formats
========

Provide API to format data, using ICU data. Adds date, number and message formatting. Message format supports date, time, number, string, select, choice and plural types.

##Description

This module adds date, number and message formatting. Message format supports date, time, number, stirng, select, choice and plural types. The locale-specific data is obtained from ICU.
If date, number or list formatting is required, be sure to "use" (YUI.use) the corresponding modules gallery-advanced-date-format, gallery-advanced-number-format, and gallery-list-format. If any of these modules are not available, messageformat will not handle the respective types. They are not automatically imported so that users can work with just the features they need and can ignore the rest. 

The API can be used as below.

```javascript
YUI({ lang: 'en-IN' }).use("gallery-message-format", "gallery-advanced-date-format", "gallery-advanced-number-format", "gallery-list-format", function(Y) {

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
