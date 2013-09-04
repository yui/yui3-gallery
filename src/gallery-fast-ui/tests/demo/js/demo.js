YUI().use('node', 'button', 'gallery-fast-ui', function(Y){
    var placeHolder = Y.one('#placeHolder'),
        templateStr = "<div xmlns:Y='Y'><Y:Button ui-config='okButton' label='Ok Button'></Y:Button></div>",
        fastUi = new Y.FastUi(placeHolder, templateStr, null, {
            'okButton' : {
                disabled : true
            }
        });
});