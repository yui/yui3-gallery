/**
 * Timezone performs operations on a given timezone string represented in Olson tz database
 * This module uses parts of zimbra AjxTimezone to handle time-zones
 * @module datatype-date-timezone
 * @requires datatype-date-format
 */

/**
 * Class to handle timezones
 * @class __zTimezone
 * @namespace Date
 * @private
 * @constructor
 */
Y.Date.__zTimezone = function() {
    this.localeData = Y.Intl.get(MODULE_NAME);
};

AjxTimezone = Y.Date.__zTimezone;

Y.mix(AjxTimezone, {
    /**
     * Get DST trasition date
     * @method getTransition
     * @static
     * @param onset {Object} DST transition information
     * @param year {Number} Year in which transition date is calculated
     * @return {Array} Transition as [year, month, day]
     */
    getTransition: function(onset, year) {
        var trans = [ year || new Date().getFullYear(), onset.mon, 1 ], date, wkday, adjust, last, count;
        if (onset.mday) {
            trans[2] = onset.mday;
        }
        else if (onset.wkday) {
            date = new Date(year, onset.mon - 1, 1, onset.hour, onset.min, onset.sec);

            // last wkday of month
            if (onset.week === -1) {
                // NOTE: This creates a date of the *last* day of specified month by
                //       setting the month to *next* month and setting day of month
                //       to zero (i.e. the day *before* the first day).
                last = new Date(new Date(date.getTime()).setMonth(onset.mon, 0));
                count = last.getDate();
                wkday = last.getDay() + 1;
                adjust = wkday >= onset.wkday ? wkday - onset.wkday : 7 - onset.wkday - wkday;
                trans[2] = count - adjust;
            }

            // Nth wkday of month
            else {
                wkday = date.getDay() + 1;
                adjust = onset.wkday === wkday ? 1 :0;
                trans[2] = onset.wkday + 7 * (onset.week - adjust) - wkday + 1;
            }
        }
        return trans;
    },

    /**
     * Add dst transition rules with dst information
     * @method addRule
     * @static
     * @param rule {Object} Object containing timezone information
     */
    addRule: function(rule) {
        var tzId = rule.tzId, array;

        AjxTimezone._SHORT_NAMES[tzId] = AjxTimezone._generateShortName(rule.standard.offset);
        AjxTimezone._CLIENT2RULE[tzId] = rule;

        array = rule.daylight ? AjxTimezone.DAYLIGHT_RULES : AjxTimezone.STANDARD_RULES;
        array.push(rule);
    },

    /**
     * Get dst transition rule
     * @method getRule
     * @static
     * @param tzId {Object} Timezone Id
     * @param tz {Object} Rule object to match against
     * @return {Object} The rule
     */
    getRule: function(tzId, tz) {
        var rule = AjxTimezone._CLIENT2RULE[tzId],
            names = [ "standard", "daylight" ],
            rules, i, j, found, name, onset, breakOuter, p;
        if (!rule && tz) {
            rules = tz.daylight ? AjxTimezone.DAYLIGHT_RULES : AjxTimezone.STANDARD_RULES;
            for (i = 0; i < rules.length; i++) {
                rule = rules[i];

                found = true;
                for (j = 0; j < names.length; j++) {
                    name = names[j];
                    onset = rule[name];
                    if (!onset) { continue; }
			
                    breakOuter = false;

                    for (p in tz[name]) {
                        if (tz[name][p] !== onset[p]) {
                            found = false;
                            breakOuter = true;
                            break;
                        }
                    }

                    if(breakOuter){
                        break;
                    }
                }
                if (found) {
                    return rule;
                }
            }
            return null;
        }

        return rule;
    },

    /**
     * Get offset in minutes from GMT
     * @method getOffset
     * @static
     * @param tzId {String} Timezone ID
     * @param date {Date} Date on which the offset is to be found (offset may differ by date due to DST)
     * @return {Number} Offset in minutes from GMT
     */
    getOffset: function(tzId, date) {
        var rule = AjxTimezone.getRule(tzId), year, standard, stdTrans, dstTrans, month, stdMonth, dstMonth, isDST;
        if (rule && rule.daylight) {
            year = date.getFullYear();

            standard = rule.standard, daylight  = rule.daylight;
            stdTrans = AjxTimezone.getTransition(standard, year);
            dstTrans = AjxTimezone.getTransition(daylight, year);

            month    = date.getMonth()+1, day = date.getDate();
            stdMonth = stdTrans[1], stdDay = stdTrans[2];
            dstMonth = dstTrans[1], dstDay = dstTrans[2];

            // northern hemisphere
            isDST = false;
            if (dstMonth < stdMonth) {
                isDST = month > dstMonth && month < stdMonth;
                isDST = isDST || (month === dstMonth && day >= dstDay);
                isDST = isDST || (month === stdMonth && day <  stdDay);
            }

            // sorthern hemisphere
            else {
                isDST = month < dstMonth || month > stdMonth;
                isDST = isDST || (month === dstMonth && day <  dstDay);
                isDST = isDST || (month === stdMonth && day >= stdDay);
            }

            return isDST ? daylight.offset : standard.offset;
        }
        return rule ? rule.standard.offset : -(new Date().getTimezoneOffset());
    },

    /**
     * Compare rules to sort by offset
     * @method _BY_OFFSET
     * @static
     * @private
     * @param arule {Object} Rule to compare
     * @param brule {Object} Rule to compare
     * @return {Number} Difference in offsets between the rules.
               If offsets are equal, returns 1 if timezone id of arule comes first alphabetically, -1 otherwise
     */
    _BY_OFFSET: function(arule, brule) {
        // sort by offset and then by name
        var delta = arule.standard.offset - brule.standard.offset,
            aname = arule.tzId,
            bname = brule.tzId;
        if (delta === 0) {
            if (aname < bname) { delta = -1; }
            else if (aname > bname) { delta = 1; }
        }
        return delta;
    },

    _SHORT_NAMES: {},
    _CLIENT2RULE: {},
    /**
     * The data is specified using the server identifiers for historical
     * reasons. Perhaps in the future we'll use the client (i.e. Java)
     * identifiers on the server as well.
     */
    STANDARD_RULES: [],
    DAYLIGHT_RULES: [],

    /**
     * Generate short name for a timezone like +0530 for IST
     * @method _generateShortName
     * @static
     * @private
     * @param offset {Number} Offset in minutes from GMT
     * @param [period=false] {Boolean} If true, a dot is inserted between hours and minutes
     * @return {String} Short name for timezone
     */
    _generateShortName: function(offset, period) {
        if (offset === 0) { return ""; }
        var sign = offset < 0 ? "-" : "+",
            stdOffset = Math.abs(offset),
            hours = Math.floor(stdOffset / 60),
            minutes = stdOffset % 60;

        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return [sign,hours,period?".":"",minutes].join("");
    },

    /**
     * Initialized timezone rules. Only for internal use.
     * @method _initTimezoneRules
     * @static
     * @private
     */
    _initTimezoneRules: function() {
        var rule, i, j, array;

        for (i = 0; i < TimezoneData.TIMEZONE_RULES.length; i++) {
            rule = TimezoneData.TIMEZONE_RULES[i];
            array = rule.daylight ? AjxTimezone.DAYLIGHT_RULES : AjxTimezone.STANDARD_RULES;
            array.push(rule);
        }

        TimezoneData.TIMEZONE_RULES.sort(AjxTimezone._BY_OFFSET);
        for (j = 0; j < TimezoneData.TIMEZONE_RULES.length; j++) {
            rule = TimezoneData.TIMEZONE_RULES[j];
            AjxTimezone.addRule(rule);
        }
    },

    /**
     * Get timezone ids matching raw offset
     * @method getCurrentTimezoneIds
     * @static
     * @param rawOffset {Number} Offset in seconds from GMT
     * @return {Array} timezone ids having the specified offset
     */
    getCurrentTimezoneIds: function(rawOffset) {
        rawOffset = rawOffset/60;	//Need offset in minutes

        var result = [],
            today = new Date(),
            tzId, link;

        for(tzId in AjxTimezone._CLIENT2RULE) {
            if(rawOffset === 0 || AjxTimezone.getOffset(tzId, today) === rawOffset) {
                result.push(tzId);
            }
        }

        for(link in TimezoneLinks) {
            if(Y.Array.indexOf(result,TimezoneLinks[link]) !== -1) {
                result.push(link);
            }
        }
        return result;
    },

    /**
     * Get the first timezone matching rawOffset
     * @method getTimezoneIdForOffset
     * @static
     * @param rawOffset {Number} offset in seconds from GMT
     * @return {String} tzId of timezone that matches the offset. Returns empty string if no matches found
     */
    getTimezoneIdForOffset: function(rawOffset) {
        rawOffset = rawOffset/60;	//Need offset in minutes

        var etcGMTId = "Etc/GMT",
            today = new Date(),
            tzId;
        
        if(rawOffset % 60 === 0) {
            if(rawOffset !== 0) {
                etcGMTId += (rawOffset > 0? "-": "+") + rawOffset/60;
            }

            if(AjxTimezone._CLIENT2RULE[etcGMTId] !== undefined) {
                return etcGMTId;
            }
        }
	
        for(tzId in AjxTimezone._CLIENT2RULE) {
            if(AjxTimezone.getOffset(tzId, today) === rawOffset) {
                return tzId;
            }
        }

        return "";
    },

    /**
     * Check whether DST is active at specified date
     * @method isDST
     * @static
     * @param tzId {String} Timezone ID
     * @param date {Date}
     * @return {Number} 1 if DST is active, 0 if not, and -1 if specified timezone does not observe DST
     */
    isDST: function(tzId, date) {
        var rule = AjxTimezone.getRule(tzId),
            year,
            standard, daylight,
            stdTrans, dstTrans,
            month, day,
            stdMonth, stdDay,
            dstMonth, dstDay,
            isDSTActive;
            
        if (rule && rule.daylight) {
            year = date.getFullYear();

            standard = rule.standard, daylight  = rule.daylight;
            stdTrans = AjxTimezone.getTransition(standard, year);
            dstTrans = AjxTimezone.getTransition(daylight, year);

            month    = date.getMonth()+1, day = date.getDate();
            stdMonth = stdTrans[1], stdDay = stdTrans[2];
            dstMonth = dstTrans[1], dstDay = dstTrans[2];

            // northern hemisphere
            isDSTActive = false;
            if (dstMonth < stdMonth) {
                isDSTActive = month > dstMonth && month < stdMonth;
                isDSTActive = isDSTActive || (month === dstMonth && day >= dstDay);
                isDSTActive = isDSTActive || (month === stdMonth && day <  stdDay);
            }

            // sorthern hemisphere
            else {
                isDSTActive = month < dstMonth || month > stdMonth;
                isDSTActive = isDSTActive || (month === dstMonth && day <  dstDay);
                isDSTActive = isDSTActive || (month === stdMonth && day >= stdDay);
            }

            return isDSTActive? 1:0;
        }
        return -1;
    },

    /**
     * Check whether tzId is a valid timezone
     * @method isValidTimezoneId
     * @static
     * @param tzId {String} Timezone ID
     * @return {Boolean} true if tzId is valid, false otherwise
     */
    isValidTimezoneId: function(tzId) {
        return (AjxTimezone._CLIENT2RULE[tzId] !== undefined || TimezoneLinks[tzId] !== undefined);
    }
});

Y.mix(AjxTimezone.prototype, {

    /**
     * Get short name of timezone
     * @method getShortName
     * @param tzId {String} Timezone ID
     * @return {String}
     */
    getShortName: function(tzId) {
        var shortName = this.localeData[tzId + "_Z_short"] || ["GMT",AjxTimezone._SHORT_NAMES[tzId]].join("");
        return shortName;
    },

    /**
     * Get medium length name of timezone
     * @method getMediumName
     * @param tzId {String} Timezone ID
     * @return {String}
     */
    getMediumName: function(tzId) {
        var mediumName = this.localeData[tzId + "_Z_abbreviated"] || ['(',this.getShortName(tzId),') ',tzId].join("");
        return mediumName;
    },

    /**
     * Get long name of timezone
     * @method getLongName
     * @param tzId {String} Timezone Id
     * @return {String}
     */
    getLongName: AjxTimezone.prototype.getMediumName
});

AjxTimezone._initTimezoneRules();

/**
 * Timezone performs operations on a given timezone string represented in Olson tz database
 * @class Timezone
 * @constructor
 * @param {String} tzId TimeZone ID as in Olson tz database
 */
Y.Date.Timezone = function(tzId) {
    var normalizedId = Timezone.getNormalizedTimezoneId(tzId);
    if(normalizedId === "") {
	Y.error("Could not find timezone: " + tzId);
    }
    this.tzId = normalizedId;

    this._ajxTimeZoneInstance = new AjxTimezone();
};

Y.namespace("Date");
Timezone = Y.Date.Timezone;

Y.mix(Timezone, {
    /**
     * Get Day of Year(0-365) for the date passed
     * @method _getDOY
     * @private
     * @static
     * @param {Date} date
     * @return {Number} Day of Year
     */
    _getDOY: function (date) {
        var oneJan = new Date(date.getFullYear(),0,1);
        return Math.ceil((date - oneJan) / 86400000);
    },

    /**
     * Get integer part of floating point argument
     * @method _floatToInt
     * @static
     * @private
     * @param floatNum {Number} A real number
     * @return {Number} Integer part of floatNum
     */
    _floatToInt: function (floatNum) {
        return (floatNum < 0) ? Math.ceil(floatNum) : Math.floor(floatNum);
    },

    /**
     * Returns list of timezone Id's that have the same rawOffSet as passed in
     * @method getCurrentTimezoneIds
     * @static
     * @param {Number} rawOffset Raw offset (in seconds) from GMT.
     * @return {Array} array of timezone Id's that match rawOffset passed in to the API.
     */
    getCurrentTimezoneIds: function(rawOffset) {
        return AjxTimezone.getCurrentTimezoneIds(rawOffset);
    },

    /**
     * Given a raw offset in seconds, get the tz database ID that reflects the given raw offset, or empty string if there is no such ID.
     * Where available, the function will return an ID starting with "Etc/GMT".
     * For offsets where no such ID exists but that are used by actual time zones, the ID of one of those time zones is returned.
     * Note that the offset shown in an "Etc/GMT" ID is opposite to the value of rawOffset
     * @method getTimezoneIdForOffset
     * @static
     * @param {Number} rawOffset Offset from GMT in seconds
     * @return {String} timezone id
     */
    getTimezoneIdForOffset: function(rawOffset) {
        return AjxTimezone.getTimezoneIdForOffset(rawOffset);
    },

    /**
     * Given a wall time reference, convert it to UNIX time - seconds since Epoch
     * @method getUnixTimeFromWallTime
     * @static
     * @param {Object} walltime Walltime that needs conversion. Missing properties will be treat as 0.
     * @return {Number} UNIX time - time in seconds since Epoch
     */
    getUnixTimeFromWallTime: function(walltime) {
        /*
         * Initialize any missing properties.
         */
        if(!Y.Lang.isValue( walltime.year )) {
            walltime.year = new Date().getFullYear();	//Default to current year
        }
        if(!Y.Lang.isValue( walltime.mon )) {
            walltime.mon = 0;				//Default to January
        }
        if(!Y.Lang.isValue( walltime.mday )) {
            walltime.mday = 1;				//Default to first of month
        }
        if(!Y.Lang.isValue( walltime.hour )) {			//Default to 12 midnight
            walltime.hour = 0;
        }
        if(!Y.Lang.isValue( walltime.min )) {
            walltime.min = 0;
        }
        if(!Y.Lang.isValue( walltime.sec )) {
            walltime.sec = 0;
        }
        if(!Y.Lang.isValue( walltime.gmtoff )) {			//Default to UTC
            walltime.gmtoff = 0;
        }

        var utcTime = Date.UTC(walltime.year, walltime.mon, walltime.mday, walltime.hour, walltime.min, walltime.sec);
        utcTime -= walltime.gmtoff*1000;

        return Timezone._floatToInt(utcTime/1000);	//Unix time: count from midnight Jan 1 1970 UTC
    },

    /**
     * Checks if the timestamp passed in is a valid timestamp for this timezone and offset.
     * @method isValidTimestamp
     * @static
     * @param {String} timeStamp Time value in UTC RFC3339 format - yyyy-mm-ddThh:mm:ssZ or yyyy-mm-ddThh:mm:ss+/-HH:MM
     * @param {Number} rawOffset An offset from UTC in seconds.
     * @return {Boolean} true if valid timestamp, false otherwise
     */
    isValidTimestamp: function(timeStamp, rawOffset) {
        var regex = /^(\d\d\d\d)\-([0-1][0-9])\-([0-3][0-9])([T ])([0-2][0-9]):([0-6][0-9]):([0-6][0-9])(Z|[+\-][0-1][0-9]:[0-3][0-9])?$/,
            matches = (new RegExp(regex)).exec(timeStamp),
            year, month, day, hours, minutes, seconds, tZone,
            m31, maxDays,
            dateTimeSeparator, offset;

        //No match
        if(matches === null) {
            return false;
        }

        year = parseInt(matches[1], 10),
        month = parseInt(matches[2], 10),
        day = parseInt(matches[3], 10),
        dateTimeSeparator = matches[4],
        hours = parseInt(matches[5], 10),
        minutes = parseInt(matches[6], 10),
        seconds = parseInt(matches[7], 10),
        tZone = matches[8];
        //Month should be in 1-12
        if(month < 1 || month > 12) {
            return false;
        }

        //Months with 31 days
        m31 = [1,3,5,7,8,10,12];
        maxDays = 30;
        if(Y.Array.indexOf(m31,month) !== -1) {
            maxDays = 31;
        } else if(month === 2) {
            if(year % 400 === 0) {
                maxDays = 29;
            } else if(year % 100 === 0) {
                maxDays = 28;
            } else if(year % 4 === 0) {
                maxDays = 29;
            } else {
                maxDays = 28;
            }
        }

        //Day should be valid day for month
        if(day < 1 || day > maxDays) {
            return false;
        }

        //Hours should be in 0-23
        if(hours < 0 || hours > 23) {
            return false;
        }

        //Minutes and Seconds should in 0-59
        if(minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
            return false;
        }

        //Now verify timezone
        if(dateTimeSeparator === " " && tZone === undefined) {
            //SQL Format
            return true;
        } else if(dateTimeSeparator === "T" && tZone !== undefined) {
            //RFC3339 Format
            offset = 0;
            if(tZone !== "Z") {
                //Not UTC TimeZone
                offset = parseInt(tZone.substr(1,3), 10)*60 + parseInt(tZone.substr(4), 10);
                offset = offset*60;	//To seconds

                offset = offset * (tZone.charAt(0) === "+" ? 1 : -1);
            }
            //Check offset in timeStamp with passed rawOffset
            if(offset === rawOffset) {
                return true;
            }
        }

        //If reached here, wrong format
        return false;
    },

    /**
     * Checks if tzId passed in is a valid Timezone id in tz database.
     * @method isValidTimezoneId
     * @static
     * @param {String} tzId timezoneId to be checked for validity
     * @return {Boolean} true if tzId is a valid timezone id in tz database.
               tzId could be a "zone" id or a "link" id to be a valid tz Id. False otherwise
     */
    isValidTimezoneId: function(tzId) {
        return AjxTimezone.isValidTimezoneId(tzId);
    },

    /**
     * Returns the normalized version of the time zone ID, or empty string if tzId is not a valid time zone ID.
     * If tzId is a link Id, the standard name will be returned.
     * @method getNormalizedTimezoneId
     * @static
     * @param {String} tzId The timezone ID whose normalized form is requested.
     * @return {String} The normalized version of the timezone Id, or empty string if tzId is not a valid time zone Id.
     */
    getNormalizedTimezoneId: function(tzId) {
        if(!Timezone.isValidTimezoneId(tzId)) {
            return "";
        }
        var normalizedId,
            next = tzId;

        do {
            normalizedId = next;
            next = TimezoneLinks[normalizedId];
        } while( next !== undefined );

        return normalizedId;
    }
});

Y.mix(Timezone.prototype, {
    /**
     * Parse RFC3339 date format and return the Date
     * Format: yyyy-mm-ddThh:mm:ssZ
     * @method _parseRFC3339
     * @private
     * @param {String} dString The date string to be parsed
     * @return {Date} The date represented by dString
     */
    _parseRFC3339: function(dString){
        var regexp = /(\d+)(\-)?(\d+)(\-)?(\d+)(T)?(\d+)(:)?(\d+)(:)?(\d+)(\.\d+)?(Z|([+\-])(\d+)(:)?(\d+))/,
            result = new Date(),
            d = dString.match(regexp),
            offset = 0;

        result.setUTCDate(1);
        result.setUTCFullYear(parseInt(d[1],10));
        result.setUTCMonth(parseInt(d[3],10) - 1);
        result.setUTCDate(parseInt(d[5],10));
        result.setUTCHours(parseInt(d[7],10));
        result.setUTCMinutes(parseInt(d[9],10));
        result.setUTCSeconds(parseInt(d[11],10));
        if (d[12]) {
            result.setUTCMilliseconds(parseFloat(d[12]) * 1000);
        } else {
            result.setUTCMilliseconds(0);
        }
        if (d[13] !== 'Z') {
            offset = (d[15] * 60) + parseInt(d[17],10);
            offset *= ((d[14] === '-') ? -1 : 1);
            result.setTime(result.getTime() - offset * 60 * 1000);
        }
        return result;
    },

    /**
     * Parse SQL date format and return the Date
     * Format: yyyy-mm-dd hh:mm:ss
     * @method _parseSQLFormat
     * @private
     * @param {String} dString The date string to be parsed
     * @return {Date} The date represented by dString
     */
    _parseSQLFormat: function(dString) {
        var dateTime = dString.split(" "),
            date = dateTime[0].split("-"),
            time = dateTime[1].split(":"),
            offset = AjxTimezone.getOffset(this.tzId, new Date(date[0], date[1] - 1, date[2]));
            
        return new Date(Date.UTC(date[0], date[1] - 1, date[2], time[0], time[1], time[2]) - offset*60*1000);
    },

    /**
     * Return a short name for the timezone
     * @method getShortName
     * @return {String} Short name
     */
    getShortName: function() {
        return this._ajxTimeZoneInstance.getShortName(this.tzId);
    },

    /**
     * Return a medium length name for the timezone
     * @method getMediumName
     * @return {String} Medium length name
     */
    getMediumName: function() {
        return this._ajxTimeZoneInstance.getMediumName(this.tzId);
    },

    /**
     * Return a long name for the timezone
     * @method getLongName
     * @return {String} Long name
     */
    getLongName: function() {
        return this._ajxTimeZoneInstance.getLongName(this.tzId);
    },

    /**
     * Given a timevalue representation in RFC 3339 or SQL format, convert to UNIX time - seconds since Epoch ie., since 1970-01-01T00:00:00Z
     * @method convertToIncrementalUTC
     * @param {String} timeValue TimeValue representation in RFC 3339 or SQL format.
     * @return {Number} UNIX time - time in seconds since Epoch
     */
    convertToIncrementalUTC: function(timeValue) {
        if(Y.Array.indexOf(timeValue,"T") !== -1) {
            //RFC3339
            return this._parseRFC3339(timeValue).getTime() / 1000;
        } else {
            //SQL
            return this._parseSQLFormat(timeValue).getTime() / 1000;
        }
    },

    /**
     * Given UNIX time - seconds since Epoch ie., 1970-01-01T00:00:00Z, convert the timevalue to RFC3339 format - "yyyy-mm-ddThh:mm:ssZ"
     * @method convertUTCToRFC3339Format
     * @param {Number} timeValue time value in seconds since Epoch.
     * @return {String} RFC3339 format timevalue - "yyyy-mm-ddThh:mm:ssZ"
     */
    convertUTCToRFC3339Format: function(timeValue) {
        var uTime = new Date(timeValue * 1000),
            offset = AjxTimezone.getOffset(this.tzId, uTime),
            offsetString = "Z",
            rfc3339, offsetSign;

        if(offset !== 0) {
            offsetSign = (offset > 0 ? "+": "-");
            offsetString = offsetSign + Y.Number._zeroPad(Math.abs(Timezone._floatToInt(offset/60)), 2) + ":" + Y.Number._zeroPad(offset % 60, 2);
        }

        uTime.setTime(timeValue*1000 + offset*60*1000);

        rfc3339 = Y.Number._zeroPad(uTime.getUTCFullYear(), 4) + "-"
                      + Y.Number._zeroPad((uTime.getUTCMonth() + 1), 2) + "-" + Y.Number._zeroPad(uTime.getUTCDate(), 2)
                      + "T" + Y.Number._zeroPad(uTime.getUTCHours(), 2) + ":" + Y.Number._zeroPad(uTime.getUTCMinutes(), 2)
                      + ":" + Y.Number._zeroPad(uTime.getUTCSeconds(), 2) + offsetString;

        return rfc3339;
    },

    /**
     * Given UNIX Time - seconds since Epoch ie., 1970-01-01T00:00:00Z, convert the timevalue to SQL Format - "yyyy-mm-dd hh:mm:ss"
     * @method convertUTCToSQLFormat
     * @param {Number} timeValue time value in seconds since Epoch.
     * @return {String} SQL Format timevalue - "yyyy-mm-dd hh:mm:ss"
     */
    convertUTCToSQLFormat: function(timeValue) {
        var uTime = new Date(timeValue * 1000),
            offset = AjxTimezone.getOffset(this.tzId, uTime),
            sqlDate;
            
        uTime.setTime(timeValue*1000 + offset*60*1000);

        sqlDate = Y.Number._zeroPad(uTime.getUTCFullYear(), 4) + "-" + Y.Number._zeroPad((uTime.getUTCMonth() + 1), 2)
                      + "-" + Y.Number._zeroPad(uTime.getUTCDate(), 2) + " " + Y.Number._zeroPad(uTime.getUTCHours(), 2)
                      + ":" + Y.Number._zeroPad(uTime.getUTCMinutes(), 2) + ":" + Y.Number._zeroPad(uTime.getUTCSeconds(), 2);

        return sqlDate;
    },

    /**
     * Gets the offset of this timezone in seconds from UTC
     * @method getRawOffset
     * @return {Number} offset of this timezone in seconds from UTC
     */
    getRawOffset: function() {
        return AjxTimezone.getOffset(this.tzId, new Date()) * 60;
    },

    /**
     * Given a unix time, convert it to wall time for this timezone.
     * @method getWallTimeFromUnixTime
     * @param {Number} timeValue value in seconds from Epoch.
     * @return {Object} an object with the properties: sec, min, hour, mday, mon, year, wday, yday, isdst, gmtoff, zone.
           All of these are integers except for zone, which is a string. isdst is 1 if DST is active, and 0 if DST is inactive.
     */
    getWallTimeFromUnixTime: function(timeValue) {
        var offset = AjxTimezone.getOffset(this.tzId, new Date(timeValue*1000)) * 60,
            localTimeValue = timeValue + offset,
            date = new Date(localTimeValue*1000),
            walltime = {
                sec: date.getUTCSeconds(),
                min: date.getUTCMinutes(),
                hour: date.getUTCHours(),
                mday: date.getUTCDate(),
                mon: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                wday: date.getUTCDay(),
                yday: Timezone._getDOY(date),
                isdst: AjxTimezone.isDST(this.tzId, new Date(timeValue)),
                gmtoff: offset,
                zone: this.tzId
            };

        return walltime;
    }
});
