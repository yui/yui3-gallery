/**

A wrapper around common Dialog controls and how they interact with forms.
Supports inline template-style dialogs as well as remote dialogs from a remote
URI.

@module gallery-dynamic-dialog
**/

/**
A wrapper around common Dialog controls and how they interact with forms.
Supports inline template-style dialogs as well as remote dialogs from a remote
URI.

The idea is that you can install event delegates on a page, and open up
additional single panels in a dialog (loaded asynchronously) or just simply
show a dialog from a template on the page.

@example

  var dialogs = new Y.DynamicDialog();

  // These are the defaults. Any link with open-dialog as a class
  // will find a node from the href="#dialog-template-id" and open it.
  dialogs.setupDelegates({
     'a.open-dialog':   'openDialog',
     // This will fetch the href and display the results in the dialog.
     // Your backend will have to know how to send partial renders out.
     'a.remote-dialog': 'openRemoteDialog'
  });

  dialog.on('openDialog', function(e) {
    // Immediately close it! This is absurd!
    e.dialog.hide();
  });

@class DynamicDialog
**/
Y.log('Initializing DynamicDialog!');
Y.log(Y);
Y.log(Y.Base);

var DynamicDialog,

    Panel    = Y.Panel,

    Lang     = Y.Lang,
    sub      = Lang.sub,
    isValue  = Lang.isValue,
    isString = Lang.isString,
    Oeach    = Y.Object.each;

DynamicDialog = Y.Base.create('dynamicDialog', Y.Base, [], {
    BUTTONS: {
        OK:     'Ok',
        CANCEL: 'Cancel',
        SUBMIT: 'Submit'
    },

    container: Y.one(document.body),
    panels: {},

    DEFAULT_EVENTS: {
        'a.open-dialog':   'click',
        'a.remote-dialog': 'click'
    },

    initializer: function() {
        this.publish('submit', {
            defaultFn: this._defSubmitFn,
            preventable: true
        });
    },

    setupDelegates: function() {
        var container = this.container,
            events    = this.DEFAULT_EVENTS,
            triggerFn = Y.bind(this._triggerEventFn, this);

        Oeach( events,
            function(value, key) {
                Y.log('Delegate for ' + key + ' -> ' + value);
                container.delegate(value, triggerFn, key);
            }
        );
    },

    _triggerEventFn: function(e) {
        var target   = e.currentTarget,
            source   = target.get('tagName') === 'A' ?
                        target.get('href') : target.get('target'),
            attrs    = {},
            id       = source.substr( source.indexOf('#') ),
            template = Y.one(id),
            overlay  = this.panels[id],

            dom_attrs  = target.get('attributes'),
            data_attrs = [];
        
        dom_attrs.each( function(el) {
            var name = el.get('name');
            if ( name.match(/^data-/) ) {
                var value = target.getAttribute(name);
                // We have a value, so remove the data- prefix and stuff it
                // into the attrs objject.
                if ( value !== null ) {
                    attrs[ name.substr(5) ] = value;
                }
            }
        });

        /* If we have an overlay or a template, do stuff */
        if ( overlay || template ) {
            e.preventDefault();
            Y.log('Checking for overlay: ' + overlay);
            if ( !overlay ) {
                Y.log('Constructing overlay from ' + target + ' using template ' + template);
                overlay = this._setupDialog(target, template, attrs);
            }
            else if ( template ) {
                overlay.setStdModContent(
                    Y.WidgetStdMod.BODY,
                    sub( template.getContent(), attrs )
                );
            }
            Y.log('Got overlay: ' + overlay);
            overlay.show();
        }
    },

    _setupDialog: function(element, template, attrs) {
        var self    = this,
            title   = element.getAttribute('title') || template.getAttribute('title') || '',
            content = sub( template.getContent(), attrs ),
            modal   = element.getAttribute('data-modal') || template.getAttribute('data-modal') || this.get('modal'),
            panel   = null,
            buttons = this.BUTTONS,
            async   = template.getAttribute('data-async') === 'true',
            submitFn   = Y.bind( this._defSubmitButtonFn, this ),
            contentBox = null,
            form       = null;

        panel = new Panel({
            headerContent:  title,
            bodyContent:    content,
            modal:          modal,
            centered:       true
        });

        panel.render( this.container );
        // XX The classes are based on the listed classes, but we want to add
        // this in. Didn't see a way via the API in Widget.js.
        panel.get('boundingBox').addClass('yui3-dynamic-dialog');

        contentBox = panel.get('contentBox');
        form       = contentBox.one('form');

        /* If we have a form, setup form buttons */
        if ( form ) {
            panel.addButton({
                value: buttons.CANCEL,
                classNames: [ 'yui3-dynamic-dialog-cancel' ],
                action: function(e) { e.preventDefault(); this.hide(); },
                section: Y.WidgetStdMod.FOOTER
            });

            panel.addButton({
                value: buttons.SUBMIT,
                classNames: [ 'yui3-dynamic-dialog-submit' ],
                action: function(e) {
                    e.preventDefault();
                    e.dialog = this;
                    e.form   = form;
                    e.async  = async;

                    Y.log('dialog: ' + e.dialog);
                    Y.log('isAsync: ' + e.async);
                    submitFn(e);
                },
                section: Y.WidgetStdMod.FOOTER
            });
        }
        /* Otherwise, just a simple Hide button */
        else {
            panel.addButton({
                value: buttons.OK,
                classNames: [ 'yui3-dynamic-dialog-ok' ],
                action: function(e) { e.preventDefault(); this.hide(); },
                section: Y.WidgetStdMod.FOOTER
            });
        }

        /* How should we align? */

        this.panels[ '#' + template.get('id') ] = panel;

        return panel;
    },

    _defSubmitButtonFn: function(e) {
        this.fire('submit', { dialog: e.dialog, form: e.form, async: e.async || false });
    },

    _defSubmitFn: function(e) {
        var form   = e.form,
            dialog = e.dialog,
            async  = e.async,
            action = form.getAttribute('action'),
            cfg    = {};

        if ( !async ) {
            dialog.hide();
            Y.log('not what you wanted. try again.');
            //form.submit();
            return;
        }

        cfg.method  = form.get('action') || 'POST';
        cfg.form    = { id: form };
        cfg.context = this;
        cfg.on = {
            success: function() { Y.log('success'); },
            failure: function() { Y.log('failure'); }
        };

        Y.io( form.getAttribute('action'), cfg );
    }

}, {
    ATTRS: { 
       modal: { value: false } 
    }
});


Y.DynamicDialog = DynamicDialog;

