 Y.Plugin.ListExpander = Y.Base.create('list-expander', Y.Plugin.Base, [], {
    
    /**
     * Attaches a click event to the &lt;LI&gt;s in the list
     * @since 1.0.0
     * @public
     * @method initializer
     * @param config
     */
    initializer : function(config){
      
      Y.delegate('click', function(e){
        var ul = e.currentTarget.ancestor('ul');
        
        if(this.get('closeSiblings')) {
          ul.all('li.open').removeClass('open');
        }
        
        e.currentTarget.addClass('open');
        
      }, this.get('host'), 'li', this);


    }
    
  }, {
    
    NS : 'expand',
    
    ATTRS : {
      /**
       * Specifies that the siblings, and sibling children should 
       *   "close" when opening another &lt;LI&gt;
       * @since 1.0.0
       * @property closeSiblings
       * @default true
       */
      closeSiblings : {
        value : true
      }
    }
    
  });
  