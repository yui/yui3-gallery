YUI.add('gallery-datepicker', function (Y, NAME) {

YUI.add("gallery-datepicker", function (Y) {

Y.DatePicker = function (args) {
    this.args = args;
    this.format = "%Y-%m-%d";
    if (this.args.showTime) {
        this.format += " %H:%M:%S";
    }
    this.createFormElements();
    this.createPopup();
};

Y.DatePicker.prototype.createPopup = function () {
    var zIndex = 10055, body = Y.one("body");
    this.container = Y.Node.create("<div/>");
    this.container.setStyle("display", "none");
    this.container.setStyle("position", "absolute");
    this.container.setStyle("zIndex", zIndex + 1);
    this.container.setStyles({
        display: "none", position: "absolute", zIndex: zIndex + 1,
        left: "0px", top: "0px"});
    this.calendar = new Y.Calendar({
        render: this.container,
        visible: true
    });
    this.calendar.on("selectionChange", function (e) {
        this.setDate(e.newSelection[0]);
        this.hideContainer();
    }, this);
    if (this.args.minimumDate) {
        this.setMinimumDate(this.args.minimumDate);
    }
    if (this.args.maximumDate) {
        this.setMaximumDate(this.args.maximumDate);
    }
    this.overlay = Y.Node.create("<div/>");
    this.overlay.setStyles({
        top: "0px", left: "0px",
        width: "100%", height: "100%", display: "none",
        position: "fixed", zIndex: zIndex
    });
    body.addClass("yui3-skin-sam");
    body.append(this.overlay);
    body.append(this.container);
    this.overlay.on("click", this.hideContainer, this);
    this.container.on("click", function (e) {e.stopPropagation();});
};

Y.DatePicker.prototype.createFormElements = function () {
    this.input = Y.one(this.args.input);
    this.calendarLauncher = Y.Node.create('<input type="button"/>');
    if (this.args.btnClass) {
        this.calendarLauncher.addClass(this.args.btnClass);
    }
    if (this.args.btnContent) {
        this.calendarLauncher.setHTML(this.args.btnContent);
    }
    this.input.insert(this.calendarLauncher, "after");
    this.calendarLauncher.on("click", this.showContainer, this);
    if (this.args.date) {
        this.setDate(this.args.date, true);
    }
};

Y.DatePicker.prototype.getDate = function () {
    return this.parseDate(this.input.get("value"));
};

Y.DatePicker.prototype.setDate = function (newDate, discardOldTime) {
    var oldDate, str;
    if (!discardOldTime) {
        oldDate = this.parseDate(this.input.get("value"));
        if (oldDate) {
            newDate.setHours(oldDate.getHours());
            newDate.setMinutes(oldDate.getMinutes());
            newDate.setSeconds(oldDate.getSeconds());
            newDate.setMilliseconds(oldDate.getMilliseconds());
        }
    }
    str = Y.DataType.Date.format(newDate, {format: this.format});
    this.input.set("value", str);
};

Y.DatePicker.prototype.setMinimumDate = function (minimumDate) {
    this.minimumDate = minimumDate;
    this.setCustomRenderer();
};

Y.DatePicker.prototype.setMaximumDate = function (maximumDate) {
    this.maximumDate = maximumDate;
    this.setCustomRenderer();
};

Y.DatePicker.prototype.setCustomRenderer = function () {
    if (this.customRenderer) {
        return;
    }
    var self, canBeSelected, filterFunction, f;
    self = this;
    canBeSelected = function (date) {
        if (self.maximumDate && date > self.maximumDate) {
            return false;
        }
        if (self.minimumDate && date < self.minimumDate) {
            return false;
        }
        return true;
    };
    filterFunction = function (date, node) {
        if (canBeSelected(date)) {
            node.removeClass("yui3-calendar-selection-disabled");
        }
        else {
            node.addClass("yui3-calendar-selection-disabled");
        }
    };
    this.calendar.set("customRenderer",
        {filterFunction: filterFunction, rules: {all: "all"}});
    f = this.calendar._canBeSelected;
    this.calendar._canBeSelected = function (date) {
        if (!canBeSelected(date)) {
            return false;
        }
        return f.call(self.calendar, date);
    };
    this.customRenderer = true;
};

Y.DatePicker.prototype.parseDate = function (str) {
    if (!str) {
        return null;
    }
    var m = str.match(/^(\d{4})(?:-(\d{1,2})(?:-(\d{1,2})(?:[ T](\d{1,2})(?::(\d{1,2})(?::(\d{1,2}))?)?)?)?)?$/);
    if (!m) {
        return null;
    }
    return new Date(m[1], m[2] - 1 || 0, m[3] || 1, m[4] || 0, m[5] || 0, m[6] || 0);
};

Y.DatePicker.prototype.showContainer = function (e) {
    if (e) {
        e.preventDefault();
    }
    if (this.onshow) {
        this.onshow();
    }
    var x, y, date;
    x = this.calendarLauncher.getX();
    y = this.calendarLauncher.getY() +
            parseInt(this.calendarLauncher.getComputedStyle("height"), 10);
    this.container.setStyles({left: x, top: y});
    date = this.parseDate(this.input.get("value"));
    if (date) {
        this.calendar._addDateToSelection(date, true);
        this.calendar.set("date", date);
    }
    else {
        this.calendar.set("date", new Date());
    }
    this.overlay.setStyle("display", "block");
    this.container.setStyle("display", "block");
};

Y.DatePicker.prototype.hideContainer = function () {
    this.overlay.setStyle("display", "none");
    this.container.setStyle("display", "none");
};

}, "1.0", {requires: ["calendar", "node", "datatype-date"]});



}, 'gallery-2013.03.06-21-07', {"requires": ["yui-base", "calendar", "node", "datatype-date"]});
