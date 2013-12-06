YUI.add('module-tests', function(Y) {

    var suite = new Y.Test.Suite('gallery-itsaviewmodel');

/*

todo:

test1: is a form generated when editable elements, but no formtag in the template nor in the container

test2: is a form NOT generated when editable elements and a formtag in the template available but not in the container

test3: is a form NOT generated when editable elements and the container is a formtag

*/
    suite.add(new Y.Test.Case({
        name: 'Memory Tests',
        setUp : function () {
            this.viewmodel = new Y.ITSAViewModel();
            this.viewmodel2 = new Y.ITSAViewModel();
            this.viewmodel3 = new Y.ITSAViewModel();
        },
        tearDown : function () {
            this.viewmodel.destroy();
            this.viewmodel2.destroy();
            this.viewmodel3.destroy();
        },
        'test GC': function() {
            this.viewmodel.render();
            this.viewmodel2.render();
            // no rendering viewmodel3, because that leads to different destruction
            Y.Assert.pass();
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Memory Tests with model',
        setUp : function () {
            Y.ArtistModel = Y.Base.create('formmodel', Y.ITSAFormModel, [], {
                sync: function (action, options, callback) {
                    switch (action) {
                      case 'submit':
                        Y.later(1500, null, function() {
                            callback();
                        });
                        return;
                      default:
                        callback('Invalid action');
                    }
                }
            }, {
                ATTRS: {
                    name: {
                        formtype: 'text',
                        formconfig: {
                            label: 'Artist',
                            placeholder: 'artist',
                            required: true
                        }
                    },
                    country: {
                        formtype: 'text',
                        formconfig: {
                            label: 'Country',
                            placeholder: 'country',
                            required: true,
                            initialfocus: true
                        }
                    },
                    firstalbum: {
                        formtype: 'text',
                        formconfig: {
                            label: 'First album',
                            placeholder: 'first album',
                            required: true
                        }
                    },
                    release: {
                        formtype: Y.Slider,
                        formconfig: {
                            label: 'Releaseyear',
                            widgetconfig: {
                                min: 1950,
                                max: 2010
                            }
                        }
                    }
                }
            });

            this.artist = new Y.ArtistModel({
                name: 'U2',
                country: 'Ireland',
                firstalbum: 'Boy',
                release: 1980
            });
            this.artist.setLifeUpdate(true);

            var template = '<fieldset>'+
                            '<legend>Editable template</legend>'+
                            '<div class="pure-control-group">{name}</div>'+
                            '<div class="pure-control-group">{country}</div>'+
                            '<div class="pure-control-group">{firstalbum}</div>'+
                            '<div class="pure-control-group">{release}</div>'+
                            '<div class="pure-controls">{btn_reset} {spinbtn_submit}</div>'+
                        '</fieldset>';

            this.viewmodel = new Y.ITSAViewModel({
                model: this.artist,
                template: template,
                editable: true
            });
            this.viewmodel2 = new Y.ITSAViewModel({
                model: this.artist,
                template: template,
                editable: true
            });
            this.viewmodel3 = new Y.ITSAViewModel({
                model: this.artist,
                template: template,
                editable: true
            });
        },
        tearDown : function () {
            this.viewmodel.destroy();
            this.viewmodel2.destroy();
            this.viewmodel3.destroy();
            this.artist.destroy();
        },
        'test GC2': function() {
            this.viewmodel.render();
            this.viewmodel2.render();
           // this.viewmodel3.render();
            Y.Assert.pass();
        }
    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'test', 'gallery-itsaviewmodel', 'gallery-itsaformmodel' , 'base-build'] });
