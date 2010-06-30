YUI.add('gallery-plugin-node-io', function(Y) {

  var NodeIo;
  
  NodeIo = function(config) {
    NodeIo.superclass.constructor.apply(this,arguments);
  }
  
  Y.extend(NodeIo, Y.Plugin.Base, {
    _io : null,
    
    load : function(uri) {
      this.set('uri',uri);
      this.refresh();
    },
    
    refresh : function() {
      var ioConfig = this.get('ioConfig');
      ioConfig.context = this;
      this._io = Y.io(this.get('uri'), ioConfig);
    },
    
	abort : function() {
		return this._stopIO();
	},
	
    _stopIO : function() {
      try {
        this._io.abort();
      }catch(e){
        // no io to stop
      }
      return this;
    },
    
    _placeContent : function(content) {
      var host = this.get('host');
      switch(this.get('placement')) {
        case 'replace' :
          host.setContent(content);
          break;
        case 'prepend' :
          host.prepend(content);
          break;
        case 'append' : 
          host.append(content);
          break;
      }
    }
    
  },{
    NAME : 'node-io',
    NS : 'io',
    ATTRS : {
      uri : {
        setter : function(val) {
          this._stopIO();
          return val;
        }
      },
      placement : {
        value : 'replace',
        validator : function(val){
          switch(val) {
            case 'replace': // overflow intentional
            case 'prepend':
            case 'append':
              return true;
            default:
              return false;
          }
        }
      },
      ioConfig : {
        value : {
          on : {
            success : function(id, o, args) {
              this._placeContent(o.responseText);
            }
          }
        }
      }
    }
  });
  
  Y.namespace('Plugin').NodeIo = NodeIo;


}, 'gallery-2010.06.30-19-54' ,{requires:['plugin','node','io']});
