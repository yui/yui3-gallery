YUI.add('gallery-array-unnest', function(Y) {

(function (Y) {
    'use strict';
    
    var unnest = function (array, levels) {
        var empty = [];
        
        array = empty.concat.apply(empty, array);
        
        if (levels && levels - 1) {
            return unnest(array, levels - 1);
        }
        
        return array;
    };
    
    Y.Array.unnest = unnest;
}(Y));


}, 'gallery-2011.12.14-21-12' ,{requires:['yui'], skinnable:false});
