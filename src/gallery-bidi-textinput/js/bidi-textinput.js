// Adds a plugin to text input fields to change their bidi direction
// automatically based on the value entered by the user in the field. So if
// the user starts typing in Arabic in a left-to-right text input box, the
// direction of the box will automatically switch to right-to-left, so the
// text could be displayed properly.

function BidiTextInputPlugin() {
    BidiTextInputPlugin.superclass.constructor.apply(this, arguments);
}

BidiTextInputPlugin.NS = "bidi";
BidiTextInputPlugin.NAME = "bidiTextInput";

Y.extend(BidiTextInputPlugin, Y.Plugin.Base, {
    initializer: function () {
        this.afterHostEvent("valueChange", function () {
            var host = this.get("host"),
                inputValue = host.get("value"),
                direction = Y.Intl.bidiDirection(inputValue);
            
            host.setDirection(direction);
        });
    }
});

Y.namespace('Plugin');
Y.Plugin.BidiTextInput = BidiTextInputPlugin;
