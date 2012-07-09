YUI.add('gallery-model-list-union', function(Y) {

/**
 * Creates a model list that is the union of two or more other model lists.
 * @module gallery-model-list-union
 */
(function (Y) {
    'use strict';

    var _Array = Y.Array,
        _ModelList = Y.ModelList,

        _invoke = _Array.invoke,
        _isString = Y.Lang.isString,
        _unnest = _Array.unnest;

    /**
     * Creates a model list that is the union of two or more other model lists.
     * The new model list stays up to date as the source lists change.
     * @method union
     * @for ModelList
     * @param {Function|Object|String} modelListType Optional.  The first
     * argument determines the type of model list that is created; it may be a
     * constructor function or a string namespace to a constructor function
     * stored on Y. If the first argument is an instance of ModelList, its
     * constructor is used.
     * @param {Object} modelLists 1-n ModelList objects to union.
     * @return {Object}
     * @static
     */
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


}, 'gallery-2012.06.20-20-07' ,{requires:['gallery-array-unnest', 'model-list'], skinnable:false});
