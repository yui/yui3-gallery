/**
 * Provides a method Y.toRelativeTime(Date, refDate) to translate a Date
 * instance to a string like "2 days ago".  If the second parameter is
 * provided, the time delta is in reference to this date.
 *
 * Also available is Y.toRelativeDuration(Date, refDate) which will
 * omit the "ago" or "from now" phrase from the returned string, and provide
 * just a duration in human-readable form.
 *
 * @module gallery-torelativetime
 *
 * @class YUI~toRelativeTime
 */

/**
 * @method toRelativeDuration
 * @param d {Date} the Date to translate.
 * @param from {Date} (optional) reference Date. Default is now.
 * @return {String} the duration between from and d, in human readable form
 */
function toRelativeDuration(d,from) {
    return toRelativeTime(d, from, true);
}

/**
 * @method toRelativeTime
 * @param d {Date} the Date to translate.
 * @param from {Date} (optional) reference Date. Default is now.
 * @param durationOnly {boolean} (optional) if true, omit "ago" or "from now" in the returned string.
 * @return {String} the delta between from and d, in human readable form
 */
function toRelativeTime(d,from,durationOnly) {
    d    = d || new Date();
    var useFromNow = (from == undefined);
    from = from || new Date();
    durationOnly = (!!durationOnly);

    var delta   = (from.getTime() - d.getTime()) / 1000,
        strings = toRelativeTime.strings,
        time    = "",
        rel, tmp, months, years;

    if (durationOnly) {
        rel = "";
    }
    else if (useFromNow) {
        rel = (delta < 0) ? strings.fromnow : strings.ago;
    } else {
        rel = (delta < 0) ? strings.ahead : strings.before;
    }

    if (delta < 0) {
        tmp = d;
        d   = from;
        from = tmp;
        delta *= -1;
    }

    time = delta < 5      ? strings.now     :
           delta < 60     ? strings.seconds :
           delta < 120    ? strings.minute  :
           delta < 3600   ? strings.minutes.replace(/X/, Math.floor(delta/60)) :
           delta < 7200   ? strings.hour    :
           delta < 86400  ? strings.hours.replace(/X/, Math.floor(delta/3600)) :
           delta < 172800 ? strings.day     : '';

    if (!time) {
        d.setHours(0,0,0);
        from.setHours(0,0,0);
        delta = Math.round((from.getTime() - d.getTime()) / 86400000);

        if (delta > 27) {
            years  = from.getFullYear() - d.getFullYear();
            months = from.getMonth() - d.getMonth();

            if (months < 0) {
                months += 12;
                years--;
            }

            if (months) {
                time = (months > 1) ?
                    strings.months.replace(/X/, months) :
                    strings.month;

            }

            if (years) {
                if (months) {
                    time = strings.and + time;
                }

                time = (years > 1 ?
                    strings.years.replace(/X/, years) :
                    strings.year) + time;
            }
        }

        if (!time) {
            if (d.getDay() === from.getDay()) {
                tmp = Math.round(delta / 7);

                time = (tmp > 1) ?
                    strings.weeks.replace(/X/, tmp) :
                    strings.week;
            } else {
                time = strings.days.replace(/X/, delta);
            }
        }
    }

    if (time !== strings.now) {
        time += rel;
    }
    return time;
}

/**
 * The strings to use for relative times.  Represent Numbers (minutes, hours,
 * days) as X (e.g. "about X hours ago"). Keys are now, seconds, minute,
 * minutes, hour, hours, day, and days.
 *
 * @property toRelativeTime.strings
 * @type {Object}
 */
toRelativeTime.strings = {
    now     : "right now",
    seconds : "less than a minute",
    minute  : "about a minute",
    minutes : "X minutes",
    hour    : "about an hour",
    hours   : "about X hours",
    day     : "1 day" ,
    days    : "X days",
    week    : "about a week",
    weeks   : "X weeks",
    month   : "about a month",
    months  : "X months",
    year    : "about a year",
    years   : "X years",
    ahead   : " ahead",
    before  : " before",
    ago     : " ago",
    fromnow : " from now",
    and     : " and "
};

Y.toRelativeTime = toRelativeTime;
Y.toRelativeDuration = toRelativeDuration;
