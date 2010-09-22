Raphael.fn.redtext = function() {
    var t = this.text.apply(this, arguments);
    t.attr('stroke', 'red');
    return t;
};