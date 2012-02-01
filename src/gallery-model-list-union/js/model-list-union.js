(function (Y) {
    'use strict';

    var _Array = Y.Array,
        _ModelList = Y.ModelList,

        _invoke = _Array.invoke,
        _isString = Y.Lang.isString,
        _unnest = _Array.unnest;

    Y.ModelList.union = function () {
        var modelList,
            modelLists = _unnest(arguments),
            modelListType = modelLists.shift(),

            updateModelList = function () {
                return modelList.reset(_unnest(_invoke(modelLists, 'toArray')));
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
}(Y));