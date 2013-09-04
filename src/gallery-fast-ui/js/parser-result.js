/**
 * A parser result is the result after an XML parsing with more work in
 * store to be done by the FastUiBuilder.
 *
 *
 * It contains a list with the variables that are needed to be filled in, all the widgets that are still to be
 * created, and the htmlContent with the widget references removed, and replaced by either &lt;span&gt;s (default),
 * or elements with the type of whatever was specified in the ui:srcNode attribute.
 *
 * @constructor
 * @param {Object} variables A map from the variable name to the DOM element ID from the htmlContent where the
 *                  widget will be created, or the DOM node itself that will be returned, if it's not a custom
 *                  widget.
 * @param {Array} widgetDefinitions An array of WidgetConfig with all the widgets that need to be created,
 * @param {String} htmlContent An initial HTML content that will be created. Widgets will have their definitions
 *                  replaced by a &lt;span/&gt; (or elements specified by ui:srcNode), and the rendering will be done
 *                  using that element.
 */
function ParserResult(variables, widgetDefinitions, htmlContent) {
    /**
     * @public
     * Variables detected.
     */
    this.variables = variables;

    /**
     * @public
     * Widgets detected.
     */
    this.widgetDefinitions = widgetDefinitions;

    /**
     * @public
     * The HTML code resulted.
     */
    this.htmlContent = htmlContent;
}
