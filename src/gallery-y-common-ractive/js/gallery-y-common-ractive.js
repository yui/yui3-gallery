

Y.namespace('Common');
 
function YRactive(options) {
    options.template = options.container.getHTML();
    options.container.empty();
    options.el = options.container.getDOMNode();
    
    var completeCb = options.complete;
    options.complete = function() {
        options.container.addClass('ractive-ready');
        (completeCb) ? completeCb() : null;
    }
    
    YRactive.superclass.constructor.call(this, options);
}

Y.extend(YRactive, Ractive);

YRactive.prototype.constructor = Ractive;

Y.Common.Ractive = YRactive;

Y.Common.RactiveDecorators = {};