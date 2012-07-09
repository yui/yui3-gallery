/**
 * Creates a model list that is the difference of two or more other model lists.
 * @module gallery-model-list-difference
 */
(function (Y) {
    'use strict';

    var _Array = Y.Array,
        _ModelList = Y.ModelList,

        _filter = _Array.filter,
        _indexOf = _Array.indexOf,
        _invoke = _Array.invoke,
        _isString = Y.Lang.isString,
        _reduce = _Array.reduce,
        _reduceFn,
        _unnest = _Array.unnest;

    /**
     * Creates a model list that is the difference of two or more other model
     * lists.  The new model list stays up to date as the source lists change.
     * @method difference
     * @for ModelList
     * @param {Function|Object|String} modelListType Optional.  The first
     * argument determines the type of model list that is created; it may be a
     * constructor function or a string namespace to a constructor function
     * stored on Y. If the first argument is an instance of ModelList, its
     * constructor is used.
     * @param {Object} modelLists 1-n ModelList objects to difference.  Order is
     * important.
     * @return {Object}
     * @static
     */
    Y.ModelList.difference = function () {
        var modelList,
            modelLists = _unnest(arguments),
            modelListType = modelLists.shift(),

            updateModelList = function () {
                return modelList.reset(_reduce(_invoke(modelLists, 'toArray'), 0, _reduceFn));
            };

        if (_isString(modelListType)) {
            modelListType = Y.namespace(modelListType);
        } else if (modelListType instanceof _ModelList) {
            modelLists.unshift(modelListType);
            modelListType = modelListType.constructor;
        }

        modelList = new modelListType();

        _invoke(modelLists, 'after', [
            'add',
            'remove',
            'reset'
        ], updateModelList);

        return updateModelList();
    };
    
    _reduceFn = function (previousArray, currentArray) {
        if (!previousArray) {
            return currentArray;
        }
        
        return _filter(previousArray, function (value) {
            return _indexOf(currentArray, value) === -1;
        });
    };
}(Y));