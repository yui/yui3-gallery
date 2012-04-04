QUnit.extend(QUnit, {
    step: function (expected, message) {
        if (this.config.current.step === undefined) {
            this.config.current.step = 0;
        }
        this.config.current.step++;
        if (typeof message == "undefined") {
            message = "step " + expected;
        }
        var actual = this.config.current.step;
        QUnit.push(QUnit.equiv(actual, expected), actual, expected, message);
    }
});

if(window) {
    window.step = function(expected, message) {
        QUnit.step(expected, message);
    };
}
