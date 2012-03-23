(function (Y) {
    'use strict';
    
    var _Array = Y.Array,
        _Env = Y.Env,
        _Lang = Y.Lang,
        
        _attached = _Env._attached,
        _config = Y.config,
        _loader = _Env._loader,
        
        _each = Y.each,
        _isArray = _Lang.isArray,
        _isFunction = _Lang.isFunction,
        _use = Y.use;
    
    Y.lazyLoad = function () {
        var args = _Array(arguments),
            alreadyAttached = {},
            callbackFunction = args[args.length - 1],
            errors = [],
            loadErrorFn = _config.loadErrorFn,
            onFailure = _loader.onFailure,
            onTimeout = _loader.onTimeout;
 
        if (_isFunction(callbackFunction)) {
            args.pop();
        } else {
            callbackFunction = null;
        }
        
        if (_isArray(args[0])) {
            args = args[0];
        }
        
        if (!callbackFunction) {
            return _use.apply(Y, args);
        }
        
        _each(_attached, function (value, key) {
            if (value) {
                alreadyAttached[key] = value;
            }
        });
        
        delete _config.loadErrorFn;
        
        _loader.onFailure = function (error) {
            errors.push(error);
        };
        
        _loader.onTimeout = function (error) {
            errors.push(error);
        };
        
        args.push(function () {
            _config.loadErrorFn = loadErrorFn;
            _loader.onFailure = onFailure;
            _loader.onTimeout = onTimeout;
            
            var attached = {};
                                
            _each(_attached, function (value, key) {
                if (value && !alreadyAttached[key]) {
                    attached[key] = value;
                }
            });
            
            callbackFunction(errors.length ? errors : null, attached);
        });
        
        return _use.apply(Y, args);
    };
}(Y));