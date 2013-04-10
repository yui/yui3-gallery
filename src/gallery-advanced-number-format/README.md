gallery-advanced-number-format
========

Provide API to format numbers

##Description

This module adds number formatting. The locale-specific data is obtained from ICU.
The API can be used as below.

```javascript
YUI({ lang: 'en-IN' }).use("gallery-advanced-number-format", function(Y) {
    //Format number in specified style. Style can be CURRENCY_STYLE, ISO_CURRENCY_STYLE, NUMBER_STYLE, PERCENT_STYLE, PLURAL_CURRENCY_STYLE, SCIENTIFIC_STYLE
    console.log(Y.Number.format(1000000, { style: "CURRENCY_STYLE" }));  //Will output Rs 10,00,000.00. For lang en-US, it would have been $1,000,000.00
});

```
