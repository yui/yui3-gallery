YUI.add('gallery-button-group', function(Y) {

    var YL = Y.Lang;
    
    Y.ButtonGroup = Y.Base.create('button-group', Y.Widget, [Y.WidgetParent,Y.WidgetChild], {
        
        labelNode : null,
        
        initializer : function(config) {
            this.labelNode = Y.Node.create('<span class="' + this.getClassName('label') + '"/>');
        },
        
        renderUI : function() {
            this.get('boundingBox').prepend(this.labelNode);
        },
        
        syncUI : function() {
            this.labelNode.set('text',this.get('label'));
        }
        
        
    }, {
        ATTRS : {
            label : {
                validator : YL.isString,
                setter : function(val) {
                    this.labelNode.set('text', val);
                    return val;
                }
            },
            
            defaultChildType : {
                value : Y.Button
            },
            
            alwaysSelected : {
                value : false
            }
        }
    });


}, 'gallery-2010.06.30-19-54' ,{requires:['widget-parent','widget-child']});
