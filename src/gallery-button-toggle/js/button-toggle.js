var YL = Y.Lang,
    DESELECTED_CALLBACK = 'deselectedCallback';

Y.ButtonToggle = Y.Base.create('button', Y.Button, [], {

    initializer : function(config) {
        this.after('selectedChange',this._afterSelectedChanged, this);
    },

    _defPressFn : function(e) {
        this.set('selected', (this.get('selected') === 0) ? 1 : 0);
    },

    _afterSelectedChanged : function(e) {
        if(e.newVal) {
          this._executeCallback();
        }else{
          this._executeDeselectCallback();
        }
    },

    _executeDeselectCallback : function(e) {
      Y.log('Y.ButtonToggle::_executeDeselectCallback');
      if(this.get(DESELECTED_CALLBACK)) {
        (this.get(DESELECTED_CALLBACK))();
      }
    }

}, {
    ATTRS : {
        deselectedCallback : {
            validator : YL.isFunction
        }
    }
});