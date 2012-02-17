var YL = Y.Lang,
    DESELECTED_CALLBACK = 'deselectedCallback';

Y.ButtonToggle = Y.Base.create('button', Y.Button, [], {

    _defPressFn : function(e) {
      var newSelected = (this.get('selected') === 0) ? 1 : 0;
        this.set('selected', newSelected);

        if(newSelected) {
          this._executeCallback(e);
        }else{
          this._executeDeselectCallback(e);
        }
    },

    _executeDeselectCallback : function(e) {
      Y.log('Y.ButtonToggle::_executeDeselectCallback');
      if(this.get(DESELECTED_CALLBACK)) {
        (this.get(DESELECTED_CALLBACK))(e);
      }
    }

}, {
    ATTRS : {
        deselectedCallback : {
            validator : YL.isFunction
        }
    }
});