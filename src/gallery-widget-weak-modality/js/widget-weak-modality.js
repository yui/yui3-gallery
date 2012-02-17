(function (Y) {
    'use strict';
    
    var _some = Y.Array.some,
        _widgetModality = Y.WidgetModality,
        _widgetModalityStack = _widgetModality.STACK;
    
    _widgetModality.ATTRS.weak = {
        value: false
    };
    
    Y.delegate('click', function () {
        _some(_widgetModalityStack, function (widget) {
            if (widget) {
                if (widget.get('weak')) {
                    widget.hide();
                }
                
                return true;
            }
            
            return false;
        });
    }, 'body', '.yui3-widget-mask');
}(Y));