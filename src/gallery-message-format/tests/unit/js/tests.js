YUI.add('module-tests', function(Y) {

    var messageFormatTests = new Y.Test.Case({
    
        name : "Message Format Tests",
            
        setUp: function() {

            Y.Intl.add(
                "gallery-message-format",
                "ru",
            {
                "pluralRule": "set11"
            });
            Y.Intl.add(
                "gallery-advanced-number-format",
                "ru",
                {
                    "decimalFormat" : "#,##0.###",
                    "decimalSeparator" : ".",
                    "groupingSeparator" : ",",
                    "numberZero" : "0"
                }
                );


            Y.Intl.add(
                "gallery-advanced-number-format",
                "en",
                {
                    "decimalFormat" : "#,##0.###",
                    "decimalSeparator" : ".",
                    "groupingSeparator" : ",",
                    "numberZero" : "0",
                    "percentFormat" : "#,##0%",
                    "percentSign" : "%",
                    "USD_currencyISO" : "US Dollar",
                    "USD_currencyPlural" : "US dollars",
                    "USD_currencySingular" : "US dollar",
                    "USD_currencySymbol" : "$",
                    "currencyFormat" : "¤#,##0.00;(¤#,##0.00)",
                    "defaultCurrency" : "USD",
                    "exponentialSymbol" : "E",
                    "minusSign" : "-",
                    "scientificFormat" : "#E0",
                    "currencyPatternPlural" : "{0} {1}",
                    "currencyPatternSingular" : "{0} {1}"
                }
            );

            Y.Intl.add(
                "gallery-list-format",
                "en",
                {
                    "listPatternTwo": "{0} and {1}",
                    "listPatternEnd": "{0}, and {1}"
                }
            );
            Y.Intl.add(
                "gallery-message-format",
                "en",
                {
                    "pluralRule": "set3"
                }
            );

            Y.Intl.add(
                "gallery-advanced-date-format",
                "en",
                {
                    "YMD_short" : "M/d/yy",
                    "YMD_abbreviated" : "MMM d, y",
                    "YMD_long" : "MMMM d, y",
                    "WYMD_long" : "EEEE, MMMM d, y",
                    "monthSepMedium" : "Sep",
                    "monthSepLong" : "September",
                    "weekdayTueLong" : "Tuesday",
                    "HM_abbreviated" : "h:mm a",
                    "HM_short" : "h:mm a",
                    "H_abbreviated" : "h a",
                    "DateTimeCombination" : "{1} {0}",
                    "DateTimeTimezoneCombination" : "{1} {0} {2}",
                    "DateTimezoneCombination" : "{1} {2}",
                    "TimeTimezoneCombination" : "{0} {2}",
                    "periodAm" : "AM",
                    "periodPm" : "PM"
                }
                );
        },

        testStringFormat: function () {
            var result = Y.Intl.formatMessage("{EMPLOYEE} reports to {MANAGER}", {
                "EMPLOYEE": "Ashik", 
                "MANAGER": "Dharmesh"
            });
            Y.Assert.areEqual("Ashik reports to Dharmesh", result);
        },

        testDateFormat: function() {
            var values = {
                "DATE": new Date(2012, 8, 25, 16, 30)
            };

            var result = Y.Intl.formatMessage("Today is {DATE, date, short}", values);
            Y.Assert.areEqual("Today is 9/25/12", result, "short DateFormat failed");

            result = Y.Intl.formatMessage("Today is {DATE, date, medium}", values);
            Y.Assert.areEqual("Today is Sep 25, 2012", result, "medium DateFormat failed");

            result = Y.Intl.formatMessage("Today is {DATE, date, long}", values);
            Y.Assert.areEqual("Today is September 25, 2012", result, "long DateFormat failed");

            result = Y.Intl.formatMessage("Today is {DATE, date, full}", values);
            Y.Assert.areEqual("Today is Tuesday, September 25, 2012", result, "full DateFormat failed");
        },

        testTimeFormat: function() {
            var values = {
                "DATE": Date.UTC(2012, 8, 25, 11)
            };
            var config = {
                timezone: "Asia/Kolkata"
            }
            
            var result = Y.Intl.formatMessage("The time is {DATE, time, short}", values, config);
            Y.Assert.areEqual("The time is 4:30 PM", result, "short DateFormat failed");

            result = Y.Intl.formatMessage("The time is {DATE, time, medium}", values, config);
            Y.Assert.areEqual("The time is 4:30 PM", result, "medium DateFormat failed");

            result = Y.Intl.formatMessage("The time is {DATE, time, long}", values, config);
            Y.Assert.areEqual("The time is 4:30 PM GMT+0530", result, "long DateFormat failed");

            result = Y.Intl.formatMessage("The time is {DATE, time, full}", values, config);
            Y.Assert.areEqual("The time is 4:30 PM (GMT+0530) Asia/Kolkata", result, "full DateFormat failed");
        },

        testNumberFormat: function() {
            var values = {
                "PRICE": 5000000,
                "POPULATION": 8244910,
                "POPULATION_INDIA": 1241.492,
                "CITY": "New York",
                "SF_PERCENT": 0.15
            };

            var result = Y.Intl.formatMessage("There are {POPULATION_INDIA, number} million people in India.", values);
            Y.Assert.areEqual("There are 1,241.492 million people in India.", result, "MessageFormat: {KEY, number} failed");

            result = Y.Intl.formatMessage("There are {POPULATION, number, integer} people in {CITY}.", values);
            Y.Assert.areEqual("There are 8,244,910 people in New York.", result, "MessageFormat: {KEY, number, integer} failed");

            result = Y.Intl.formatMessage("Current estimates of global smartphone penetration is around {SF_PERCENT, number, percent}.", values);
            Y.Assert.areEqual("Current estimates of global smartphone penetration is around 15%.", result, "MessageFormat: {KEY, number, percent} failed");

            result = Y.Intl.formatMessage("The land was sold for {PRICE, number, currency}.", values);
            Y.Assert.areEqual("The land was sold for $5,000,000.00.", result, "MessageFormat: {KEY, number, currency} failed");
        },

        testSelectFormat: function() {
            var pattern = "{NAME} est {GENDER, select, female {allée} other {allé}} à {CITY}.";
            var values = {
                "NAME": "Henri", 
                "GENDER": "male", 
                "CITY": "Paris"
            };
	
            var result = Y.Intl.formatMessage(pattern, values);
            Y.Assert.areEqual("Henri est allé à Paris.", result);

            values.NAME = "Anne";
            values.GENDER = "female";
            result = Y.Intl.formatMessage(pattern, values);
            Y.Assert.areEqual("Anne est allée à Paris.", result);
        },

        testPluralFormat: function() {
            var pattern = "{COMPANY_COUNT, plural, one {One company} other {# companies}} published new books.";
	
            var result = Y.Intl.formatMessage(pattern, {
                "COMPANY_COUNT": 1
            });
            Y.Assert.areEqual("One company published new books.", result);

            result = Y.Intl.formatMessage(pattern, {
                "COMPANY_COUNT": 2
            });
            Y.Assert.areEqual("2 companies published new books.", result);
            
            //Change language to russian
            Y.Intl.setLang("gallery-advanced-number-format", "ru");
            Y.Intl.setLang("gallery-message-format", "ru");

            
            pattern = "{COMPANY_COUNT, plural, one {\u041E\u0434\u043D\u0430 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u044F \u043E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043B\u0430} few {# \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438 \u043E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043B\u0438} many {# \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0439 \u043E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043B\u0438} other {# \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0439 \u043E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043B\u0438}} \u043D\u043E\u0432\u044B\u0435 \u043A\u043D\u0438\u0433\u0438.";
            result = Y.Intl.formatMessage(pattern, {
                "COMPANY_COUNT": 23   //Should match few
            });
            Y.Assert.areEqual("23 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438 \u043E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043B\u0438 \u043D\u043E\u0432\u044B\u0435 \u043A\u043D\u0438\u0433\u0438.", result);
            
            result = Y.Intl.formatMessage(pattern, {
                "COMPANY_COUNT": 36   //Should match many
            });
            Y.Assert.areEqual("36 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0439 \u043E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043B\u0438 \u043D\u043E\u0432\u044B\u0435 \u043A\u043D\u0438\u0433\u0438.", result);
            
            //Change language back to english for remaining tests
            Y.Intl.setLang("gallery-advanced-number-format", "en");
            Y.Intl.setLang("gallery-message-format", "en");
        },

        testChoiceFormat: function() {
            var pattern = "There {FILE_COUNT, choice, 0#are no files|1#is one file|1<are {FILE_COUNT, number, integer} files} on disk.";

            var result = Y.Intl.formatMessage(pattern, {
                "FILE_COUNT": 0
            });
            Y.Assert.areEqual("There are no files on disk.", result);

            result = Y.Intl.formatMessage(pattern, {
                "FILE_COUNT": 1
            });
            Y.Assert.areEqual("There is one file on disk.", result);

            result = Y.Intl.formatMessage(pattern, {
                "FILE_COUNT": 2
            });
            Y.Assert.areEqual("There are 2 files on disk.", result);
        },

        testListFormat: function() {
            var input = {
                COUNTRIES: []
            };

            var result = Y.Intl.formatMessage("{COUNTRIES, list}", input);
            Y.Assert.areEqual("", result);

            input.COUNTRIES.push("US");
            result = Y.Intl.formatMessage("{COUNTRIES, list}", input);
            Y.Assert.areEqual("US", result);

            input.COUNTRIES.push("UK");
            result = Y.Intl.formatMessage("{COUNTRIES, list}", input);
            Y.Assert.areEqual("US and UK", result);

            input.COUNTRIES.push("Canada");
            result = Y.Intl.formatMessage("{COUNTRIES, list}", input);
            Y.Assert.areEqual("US, UK, and Canada", result);
        },

        testNoMatch: function() {
            var pattern = "Test string. {blah}. blah should not match any type.";
            var result = Y.Intl.formatMessage(pattern, {});
            Y.Assert.areEqual(pattern, result);
        }
    });

    Y.Test.Runner.add(messageFormatTests);

},'', { requires: [ 'test', 'gallery-message-format', 'gallery-list-format', 'gallery-advanced-date-format', 'gallery-advanced-number-format' ] });
