YUI.add('module-tests', function(Y) {

    var numberFormatTests = new Y.Test.Case({
        name: "Number Format Tests",
                    
        setUp: function() {
            Y.Intl.add(
                "gallery-i18n-formats",
                "en-US",
                {
                    "USD_currencyISO" : "US Dollar",
                    "USD_currencyPlural" : "US dollars",
                    "USD_currencySingular" : "US dollar",
                    "USD_currencySymbol" : "$",
                    "currencyFormat" : "¤#,##0.00;(¤#,##0.00)",
                    "decimalFormat" : "#,##0.###",
                    "decimalSeparator" : ".",
                    "defaultCurrency" : "USD",
                    "exponentialSymbol" : "E",
                    "groupingSeparator" : ",",
                    "minusSign" : "-",
                    "numberZero" : "0",
                    "percentFormat" : "#,##0%",
                    "percentSign" : "%",
                    "scientificFormat" : "#E0",
                    "currencyPatternPlural" : "{0} {1}",
                    "currencyPatternSingular" : "{0} {1}"
                }
                );
        },
                    
        "Test Currency Style" : function() {
            var config = {
                style: "CURRENCY_STYLE"
            };           
            
            var value = 10000000;
            var result1 = Y.Number.format(value, config);
            var expect1 = "$10,000,000.00";
                        
            Y.Assert.areEqual(expect1, result1, "Unexpected result on format");
                        
            var result2 = Y.Number.parse(result1, config);
            Y.Assert.areEqual(value, result2, "Unexpected result on parse");
        },
                    
        "Test ISO Currency Style" : function() {
            var config = {
                style:  "ISO_CURRENCY_STYLE"
            };

            var value = 10000000;
            var result1 = Y.Number.format(value, config);
            var expect1 = "US Dollar10,000,000.00";
                        
            Y.Assert.areEqual(expect1, result1, "Unexpected result on format");
                        
            var result2 = Y.Number.parse(result1, config);
            Y.Assert.areEqual(value, result2, "Unexpected result on parse");
        },
                    
        "Test Number Style" : function() {
            var config = {
                style: "NUMBER_STYLE"
            };
                       
            var value = -10000000;
            var result1 = Y.Number.format(value, config);
            var expect1 = "-10,000,000";
                        
            Y.Assert.areEqual(expect1, result1, "Unexpected result on format");
                        
            var result2 = Y.Number.parse(result1, config);
            Y.Assert.areEqual(value, result2, "Unexpected result on parse");
        },
                    
        "Test Percent Style" : function() {
            var config = {
                style: "PERCENT_STYLE"
            };
            
            var value = 0.25;
            var result1 = Y.Number.format(value, config);
            var expect1 = "25%";
                        
            Y.Assert.areEqual(expect1, result1, "Unexpected result on format");
                        
            var result2 = Y.Number.parse(result1, config);
            Y.Assert.areEqual(value, result2, "Unexpected result on parse");
        },
                    
        "Test Plural Currency Style" : function() {
            var config = {
                style: "PLURAL_CURRENCY_STYLE"
            };
                       
            var value = 10000000;
            var result1 = Y.Number.format(value, config);
            var expect1 = "10,000,000 US dollars";
                        
            Y.Assert.areEqual(expect1, result1, "Unexpected result on format");
                        
            var result2 = Y.Number.parse(result1, config);
            Y.Assert.areEqual(value, result2, "Unexpected result on parse");
        },
                    
        "Test Scientific Style" : function() {
            var config = {
                style: "SCIENTIFIC_STYLE"
            };
                       
            var value = 10000000;
            var result1 = Y.Number.format(value, config);
            var expect1 = "1E7";
                        
            Y.Assert.areEqual(expect1, result1, "Unexpected result on format");
                        
            var result2 = Y.Number.parse(result1, config);
            Y.Assert.areEqual(value, result2, "Unexpected result on parse");
        }
    });

    var timeZoneTests = new Y.Test.Case({
    
        name : "TimeZone Tests",
        
        setUp : function () {
            this.tZone = new Y.Date.Timezone("Asia/Kolkata");
        },
        
        //---------------------------------------------------------------------
        // Test methods
        //---------------------------------------------------------------------
        
        "Test conversion between Incremental UTC, RFC3339 Format and SQL Format" : function () {
            var rfc3339 = "2012-5-29T15:23:00+5:30";
            var sql = "2012-05-29 15:23:00";
                        
            var uTime1 = this.tZone.convertToIncrementalUTC(rfc3339);    //Get UTC Seconds
            var uTime2 = this.tZone.convertToIncrementalUTC(sql);
                    
            var Assert = Y.Assert;
                        
            //Verify that both rfc3339 and sql represent the same date
            Assert.areEqual(uTime1, uTime2, "Both rfc3339 and sql here represent the same date, hence UTC time obtained should be equal.");
                        
            //Convert uTime back to rfc3339 and SQL Format and verify result.
            Assert.areEqual("2012-05-29T15:23:00+05:30", this.tZone.convertUTCToRFC3339Format(uTime1), "RFC3339 obtained is different");
            Assert.areEqual("2012-05-29 15:23:00", this.tZone.convertUTCToSQLFormat(uTime2), "SQL Date obtained is different");
        },        
        
        testGetCurrentTimeZoneIds : function () {
            var tzIdsFor330 = Y.Date.Timezone.getCurrentTimezoneIds(330*60);
            var tzIdsFor330Set = {};    //Convert array to set to check existence of each expected value
            for(var i=0; i<tzIdsFor330.length; i++) {
                tzIdsFor330Set[tzIdsFor330[i]] = true;
            }
                        
            var Assert = Y.Assert;
                        
            //Verify that all the expected time zones were returned
            Assert.isNotNull(tzIdsFor330Set["Asia/Kolkata"], "Asia/Kolkata not found");
            Assert.isNotNull(tzIdsFor330Set["Asia/Calcutta"], "Asia/Calcutta not found");
            Assert.isNotNull(tzIdsFor330Set["Asia/Colombo"], "Asia/Colombo not found");
                        
            //Verify that only the expected time zones were returned
            Assert.areEqual(3, tzIdsFor330.length, "More timezones than expected returned");
        },
        
        testGetRawOffset : function () {
            Y.Assert.areEqual(330, this.tZone.getRawOffset()/60, "Got wrong offset");
        },
                    
        testGetTimeZoneIdForOffset: function() {
            var tzIdFor330 = Y.Date.Timezone.getTimezoneIdForOffset(330*60);
            Y.assert(tzIdFor330 == "Asia/Kolkata" || tzIdFor330 == "Asia/Colombo", "Did not get expected time zone id for offset 330");
        },
                    
        "Test conversion between WallTime and UnixTime": function() {
            var now = new Date();
            var wallTime = this.tZone.getWallTimeFromUnixTime(now.getTime()/1000);
            var unixTime = Y.Date.Timezone.getUnixTimeFromWallTime(wallTime);
            var expectedUnixTime = ~~(now.getTime()/1000);
            Y.Assert.areEqual(expectedUnixTime, unixTime);
        },
                    
        testIsValidTimeZoneId: function() {
            var Assert = Y.Assert;
            Assert.isFalse(Y.Date.Timezone.isValidTimezoneId("abc"), "abc is not a valid timezone");
            Assert.isTrue(Y.Date.Timezone.isValidTimezoneId("Asia/Kolkata"), "Asia/Kolkata is a valid timezone");
            Assert.isTrue(Y.Date.Timezone.isValidTimezoneId("Asia/Calcutta"), "Asia/Calcutta is a valid timezone");
        },
                    
        testGetNormalizedTimezoneId: function() {
            var Assert = Y.Assert;
            Assert.areEqual("", Y.Date.Timezone.getNormalizedTimezoneId("abc"), "abc is not a valid timezone");
            Assert.areEqual("Asia/Kolkata", Y.Date.Timezone.getNormalizedTimezoneId("Asia/Kolkata"), "Asia/Kolkata is not a valid timezone");
            Assert.areEqual("Asia/Kolkata", Y.Date.Timezone.getNormalizedTimezoneId("Asia/Calcutta"), "Asia/Kolkata is the normalized form of Asia/Calcutta");
        },
                    
        testIsValidTimestamp: function() {
            var Assert = Y.Assert;
                        
            Assert.isTrue(Y.Date.Timezone.isValidTimestamp("2012-05-29T15:23:00+05:30", (5*60+30)*60), "2012-05-29T15:23:00+05:30 is a valid timeStamp");
            Assert.isTrue(Y.Date.Timezone.isValidTimestamp("2012-05-29 15:23:00", (5*60+30)*60), "2012-05-29 15:23:00 is a valid timeStamp");
                        
            Assert.isFalse(Y.Date.Timezone.isValidTimestamp("2012-05-29 15:23:00+05:30", (5*60+30)*60), "2012-05-29 15:23:00+05:30 is not a valid timeStamp");
            Assert.isFalse(Y.Date.Timezone.isValidTimestamp("2012-05-29T15:23:00", (5*60+30)*60), "2012-05-29T15:23:00 is not a valid timeStamp");
            Assert.isFalse(Y.Date.Timezone.isValidTimestamp("2012-05-29T15:23:00+05:30", (5*60)*60), "2012-05-29 15:23:00+05:30 is not a valid timeStamp");
        }
    
    });

    var absoluteDateFormat = new Y.Test.Case({
    
        name : "Absolute DateFormat Tests",
                    
        setUp: function() {

            Y.Intl.add(
                "gallery-i18n-formats",
                "en",
                {                    
                    "DateTimeTimezoneCombination" : "{1} {0} {2}",
                    "HM_short" : "h:mm a",
                    "WYMD_long" : "EEEE, MMMM d, y",
                    "monthJunLong" : "June",
                    "periodPm" : "PM",
                    "weekdayMonLong" : "Monday",
                    "Asia/Kolkata_Z_short" : "IST"
                }
                );
            
            Y.Intl.add(
                "gallery-i18n-formats",
                "th",
                {
                    "DateTimeTimezoneCombination" : "{1}, {0} {2}",
                    "HM_short" : "h:mm a",
                    "WYMD_long" : "EEEE\u0e17\u0e35\u0e48 d MMMM G y",
                    "monthJunLong" : "\u0E21\u0E34\u0E16\u0E38\u0E19\u0E32\u0E22\u0E19",
                    "periodAm" : "\u0E0A\u0E48\u0E27\u0E07\u0E27\u0E31\u0E19",
                    "periodPm" : "\u0E0A\u0E48\u0E27\u0E07\u0E27\u0E31\u0E19",
                    "weekdayMonLong" : "\u0E27\u0E31\u0E19\u0E08\u0E31\u0E19\u0E17\u0E23\u0E4C",
                    "Asia/Shanghai_Z_short" : "CST (CN)"
                }
                );
        },

        testAbsoluteDateFormat : function () {
            Y.Intl.setLang("gallery-i18n-formats", "en");
            Y.Intl.setLang("gallery-i18n-formats", "en");
                        
            var date = new Date(Date.UTC(2012, 5, 25, 10));
            var result = Y.Date.format(date, {
                timezone: "Asia/Kolkata",
                dateFormat: Y.Date.DATE_FORMATS.WYMD_LONG,
                timeFormat: Y.Date.TIME_FORMATS.HM_SHORT,
                timezoneFormat: Y.Date.TIMEZONE_FORMATS.Z_SHORT
            });
                        
            Y.Assert.areEqual("Monday, June 25, 2012 3:30 PM IST", result);
        },
                    
        testBuddhistCalendar: function () {
            //Thai calendar
            Y.Intl.setLang("gallery-i18n-formats", "th");    //Change language for this test only
            Y.Intl.setLang("gallery-i18n-formats", "th");
                        
            var date = new Date(Date.UTC(2012, 5, 25, 10));
            var result = Y.Date.format(date, {
                timezone: "Asia/Shanghai",
                dateFormat: Y.Date.DATE_FORMATS.WYMD_LONG,
                timeFormat: Y.Date.TIME_FORMATS.HM_SHORT,
                timezoneFormat: Y.Date.TIMEZONE_FORMATS.Z_SHORT
            });
                            
            Y.Assert.areEqual("\u0E27\u0E31\u0E19\u0E08\u0E31\u0E19\u0E17\u0E23\u0E4C\u0E17\u0E35\u0E48 25 \u0E21\u0E34\u0E16\u0E38\u0E19\u0E32\u0E22\u0E19 BE 2555, 6:00 \u0E0A\u0E48\u0E27\u0E07\u0E27\u0E31\u0E19 CST (CN)", result);
        }
    });
                
    var absoluteWithRelative = new Y.Test.Case( {
                    
        name: "Absoulte Date Format with Relative Dates",
        
        setUp : function () {
            Y.Intl.add(
                "gallery-i18n-formats",
                "en",
                {                    
                    "YMD_full" : "M/d/yy",
                    "today" : "Today",
                    "tomorrow" : "Tomorrow",
                    "yesterday" : "Yesterday",
                    "monthAprLong" : "April",
                    "monthAugLong" : "August",
                    "monthDecLong" : "December",
                    "monthFebLong" : "February",
                    "monthJanLong" : "January",
                    "monthJulLong" : "July",
                    "monthJunLong" : "June",
                    "monthMarLong" : "March",
                    "monthMayLong" : "May",
                    "monthNovLong" : "November",
                    "monthOctLong" : "October",
                    "monthSepLong" : "September",
                    "periodAm" : "AM",
                    "periodPm" : "PM",
                    "weekdayFriLong" : "Friday",
                    "weekdayMonLong" : "Monday",
                    "weekdaySatLong" : "Saturday",
                    "weekdaySunLong" : "Sunday",
                    "weekdayThuLong" : "Thursday",
                    "weekdayTueLong" : "Tuesday",
                    "weekdayWedLong" : "Wednesday"			
                }
                );
                    
            this.date = new Date();
        },
        
        //---------------------------------------------------------------------
        // Test methods
        //---------------------------------------------------------------------
                    
        testToday : function () {
            var result = Y.Date.format(this.date, {
                dateFormat:  Y.Date.DATE_FORMATS.YMD_FULL | Y.Date.DATE_FORMATS.RELATIVE_DATE
            });
            Y.Assert.areEqual("Today", result);
        },
        
        testYesterday : function () {
            var date = new Date(this.date.getTime() - 24*60*60*1000);
            var result = Y.Date.format(date, {
                dateFormat:  Y.Date.DATE_FORMATS.YMD_FULL | Y.Date.DATE_FORMATS.RELATIVE_DATE
            });
                        
            Y.Assert.areEqual("Yesterday", result);
        },
                    
        testTomorrow : function () {
            var date = new Date(this.date.getTime() + 24*60*60*1000);
            var result = Y.Date.format(date, {
                dateFormat:  Y.Date.DATE_FORMATS.YMD_FULL | Y.Date.DATE_FORMATS.RELATIVE_DATE
            });
                        
            Y.Assert.areEqual("Tomorrow", result);
        },
                    
        testDayAfterTomorrow: function() {
            var date = new Date(this.date.getTime() + 2*24*60*60*1000);
            var result = Y.Date.format(date, {
                dateFormat:  Y.Date.DATE_FORMATS.YMD_FULL | Y.Date.DATE_FORMATS.RELATIVE_DATE
            });
            var expected = Y.Date.format(date, {
                dateFormat:  Y.Date.DATE_FORMATS.YMD_FULL
            });
                        
            Y.Assert.areEqual(expected, result);
        }
    });
    
    var durationFormatTests = new Y.Test.Case( {
                    
        name: "Duration Format Tests",
                    
        setUp : function () {
            Y.Intl.add(
                "gallery-i18n-formats",
                "en-US",
                {
                    "HMS_long" : "{0} {1} {2}",
                    "HMS_short" : "{0}:{1}:{2}",
                    "hour" : "hour",
                    "hours" : "hours",
                    "minute" : "minute",
                    "minutes" : "minutes",
                    "second" : "second",
                    "seconds" : "seconds",
                    "decimalFormat" : "#,##0.###",
                    "decimalSeparator" : ".",
                    "defaultCurrency" : "USD",
                    "exponentialSymbol" : "E",
                    "groupingSeparator" : ",",
                    "minusSign" : "-",
                    "numberZero" : "0"
                }
                );
        },
        
        //---------------------------------------------------------------------
        // Test methods
        //---------------------------------------------------------------------
                    
        "Test for format(int timeValueInSeconds)" : function () {
            var Assert = Y.Assert;
                        
            //Test long format first
            var result = Y.Date.formatDuration(1, {
                style: "HMS_LONG"
            }), expect = "0 hours 0 minutes 1 second";
            Assert.areEqual(expect, result);
                    
            result = Y.Date.formatDuration(3601, {
                style: "HMS_LONG"
            }), expect = "1 hour 0 minutes 1 second";
            Assert.areEqual(expect, result);
                        
            //Test short format
            result = Y.Date.formatDuration(1, {
                style: "HMS_SHORT"
            }), expect = "0:00:01";
            Assert.areEqual(expect, result);
                        
            result = Y.Date.formatDuration(3601, {
                style: "HMS_SHORT"
            }), expect = "1:00:01";
            Assert.areEqual(expect, result);
        },
        
        "Test for format(string xmlDurationFormat)" : function () {
            var Assert = Y.Assert;
                        
            //Test long format first
            var result = Y.Date.formatDuration("PT1M2S", {
                style: "HMS_LONG"
            }), expect = "1 minute 2 seconds";
            Assert.areEqual(expect, result);
                    
            result = Y.Date.formatDuration("P12Y23M34DT11H22M33S", {
                style: "HMS_LONG"
            }), expect = "11 hours 22 minutes 33 seconds";
            Assert.areEqual(expect, result);
                        
            //Test short format
            result = Y.Date.formatDuration("PT1M2S", {
                style: "HMS_SHORT"
            }), expect = "0:01:02";
            Assert.areEqual(expect, result);
                        
            result = Y.Date.formatDuration("P12Y23M34DT11H22M33S", {
                style: "HMS_SHORT"
            }), expect = "11:22:33";
            Assert.areEqual(expect, result);
        },
                    
        "Test for format(hours, minutes, seconds)" : function () {
            var Assert = Y.Assert;
                        
            //Test long format first
            var result = Y.Date.formatDuration({
                seconds: 3
            }, {
                style: "HMS_LONG"
            }), expect = "3 seconds";
            Assert.areEqual(expect, result);
                    
            result = Y.Date.formatDuration({
                minutes: 41
            }, {
                style: "HMS_LONG"
            }), expect = "41 minutes";
            Assert.areEqual(expect, result);
                        
            //Test short format
            result = Y.Date.formatDuration({
                seconds: 3
            }, {
                style: "HMS_SHORT"
            }), expect = "0:00:03";
            Assert.areEqual(expect, result);
                        
            result = Y.Date.formatDuration({
                minutes: 41
            }, {
                style: "HMS_SHORT"
            }), expect = "0:41:00";
            Assert.areEqual(expect, result);
            
            result = Y.Date.formatDuration({
                hours: 1, 
                minutes: 41, 
                seconds: 3
            }, {
                style: "HMS_SHORT"
            }), expect = "1:41:03";
            Assert.areEqual(expect, result);
        }
    });

    var relativeTimeFormatTests = new Y.Test.Case( {
                    
        name: "Relative Time Format Tests",
                    
        setUp : function () {
            this.delta = 60 * 1000;
            this.timeValue = 1265078145;
            Y.Intl.add(
                "gallery-i18n-formats",
                "en-US",

                {
                    "RelativeTime/oneUnit" : "{0} ago",
                    "RelativeTime/twoUnits" : "{0} {1} ago",
                    "minute" : "minute",
                    "minute_abbr" : "min",
                    "minutes" : "minutes",
                    "minutes_abbr" : "mins",
                    "second" : "second",
                    "second_abbr" : "sec",
                    "seconds" : "seconds",
                    "seconds_abbr" : "secs"
                }
                );
            Y.Date.currentDate = new Date(this.timeValue);
        },
        
        //---------------------------------------------------------------------
        // Test methods
        //---------------------------------------------------------------------
                    
        "One or Two Units Long" : function () {
            var result = Y.Date.format(new Date(this.timeValue - this.delta), {
                relativeTimeFormat: "ONE_OR_TWO_UNITS_LONG"
            });

            Y.Assert.areEqual("1 minute 0 seconds ago", result);
        },
        
        "One or Two Units Abbreviated" : function () {
            var result = Y.Date.format(new Date(this.timeValue - this.delta), {
                relativeTimeFormat: "ONE_OR_TWO_UNITS_ABBREVIATED"
            });
                        
            Y.Assert.areEqual("1 min 0 secs ago", result);
        },
                    
        "One Unit Long" : function () {
            var result = Y.Date.format(new Date(this.timeValue - this.delta), {
                relativeTimeFormat: "ONE_UNIT_LONG"
            });
                        
            Y.Assert.areEqual("1 minute ago", result);
        },
                    
        "One Unit Abbreviated" : function () {
            var result = Y.Date.format(new Date(this.timeValue - this.delta), {
                relativeTimeFormat: "ONE_UNIT_ABBREVIATED"
            });
                        
            Y.Assert.areEqual("1 min ago", result);
        },
                    
        "Test result when timeValue is equal to relativeTo Time" : function () {
            var result = Y.Date.format(new Date(this.timeValue), {
                relativeTimeFormat: "ONE_UNIT_ABBREVIATED"
            });
                        
            Y.Assert.areEqual("0 secs ago", result);
        }
    });

    var listFormatTests = new Y.Test.Case({
        name: "List Format Tests",
        setUp: function() {
            Y.Intl.add(
                "gallery-i18n-formats",
                "en",
                {
                    listPatternTwo: "{0} and {1}",
                    listPatternEnd: "{0}, and {1}"
                }
                );
        },

        testListFormat: function() {
            var input = [];

            var result = Y.Intl.ListFormatter.format(input);
            Y.Assert.areEqual("", result);

            input.push("US");
            result = Y.Intl.ListFormatter.format(input);
            Y.Assert.areEqual("US", result);

            input.push("UK");
            result = Y.Intl.ListFormatter.format(input);
            Y.Assert.areEqual("US and UK", result);

            input.push("Canada");
            result = Y.Intl.ListFormatter.format(input);
            Y.Assert.areEqual("US, UK, and Canada", result);
        }
    });
    
    var messageFormatTests = new Y.Test.Case({
    
        name : "Message Format Tests",
            
        setUp: function() {

            Y.Intl.add(
                "gallery-i18n-formats",
                "ru",
                {
                    "pluralRule": "set11",
                    "decimalFormat" : "#,##0.###",
                    "decimalSeparator" : ".",
                    "groupingSeparator" : ",",
                    "numberZero" : "0"
                }
                );
            Y.Intl.add(
                "gallery-i18n-formats",
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
                    "periodPm" : "PM",
                    "Asia/Kolkata_Z_abbreviated" : "India Time",
                    "Asia/Kolkata_Z_short" : "IST",
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
                    "currencyPatternSingular" : "{0} {1}",
                    "listPatternTwo": "{0} and {1}",
                    "listPatternEnd": "{0}, and {1}",
                    "pluralRule": "set3"
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
            Y.Assert.areEqual("The time is 4:30 PM IST", result, "long DateFormat failed");

            result = Y.Intl.formatMessage("The time is {DATE, time, full}", values, config);
            Y.Assert.areEqual("The time is 4:30 PM India Time", result, "full DateFormat failed");
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
            Y.Intl.setLang("gallery-i18n-formats", "ru");
            
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
            Y.Intl.setLang("gallery-i18n-formats", "en");
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

    var dateFormatTestSuite = new Y.Test.Suite("DateFormat Tests");
    dateFormatTestSuite.add(absoluteDateFormat);
    dateFormatTestSuite.add(absoluteWithRelative);

    Y.Test.Runner.add(numberFormatTests);
    Y.Test.Runner.add(timeZoneTests);
    Y.Test.Runner.add(dateFormatTestSuite);
    Y.Test.Runner.add(listFormatTests);
    Y.Test.Runner.add(messageFormatTests);

},'', {
    requires: [ 'test', 'gallery-i18n-formats' ]
});
