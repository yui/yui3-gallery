
Y.namespace('Common');

function YRactive(options) {
    options.template = options.container.getHTML();
    options.container.empty();
    options.el = options.container.getDOMNode();
    
    YRactive.superclass.constructor.call(this, options);
}

Y.extend(YRactive, Ractive);

YRactive.prototype.constructor = Ractive;

Y.Common.Ractive = YRactive;