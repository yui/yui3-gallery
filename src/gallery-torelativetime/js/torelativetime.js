/**
 * Provides a method Y.toRelativeTime(Date, refDate) to translate a Date
 * instance to a string like "2 days ago".  If the second parameter is
 * provided, the time delta is in reference to this date.
 *
 * @module gallery-torelativetime
 * @method toRelativeTime
 * @param d {Date} the Date to translate.
 * @param from {Date} (optional) reference Date. Default is now.
 */
function toRelativeTime(d,from) {
    d = d || new Date();
    from = from || new Date();

    var delta = (from.getTime() - d.getTime()) / 1000;

    return delta < 5      ? toRelativeTime.strings.now :
           delta < 60     ? toRelativeTime.strings.seconds :
           delta < 120    ? toRelativeTime.strings.minute :
           delta < 3600   ? toRelativeTime.strings.minutes.
                                replace(/X/, Math.floor(delta/60)) :
           delta < 7200   ? toRelativeTime.strings.hour :
           delta < 86400  ? toRelativeTime.strings.hours.
                                replace(/X/, Math.floor(delta/3600)) :
           delta < 172800 ? toRelativeTime.strings.day :

           toRelativeTime.strings.days.
                                replace(/X/, Math.floor(delta/86400));
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
    seconds : "less than a minute ago",
    minute  : "about a minute ago",
    minutes : "X minutes ago",
    hour    : "about an hour ago",
    hours   : "about X hours ago",
    day     : "1 day ago" ,
    days    : "X days ago"
};

Y.toRelativeTime = toRelativeTime;
