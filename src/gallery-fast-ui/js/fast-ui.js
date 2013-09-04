/**
 * Renders the xmlContent into the parent, using the msg for translation, and globalConfig for other widget configurations.
 * @param parent
 * @param xmlContent
 * @param [msg]
 * @param [globalConfig]
 * @returns {object} A map of DOM elements or Widgets that had the with ui:field attribute set.
 */
Y.fastUi = function(parent, xmlContent, msg, globalConfig) {
    return new FastUiBuilder(parent, xmlContent, msg, globalConfig).parse();
};

/**
 * @param {String | Element | Y.Node} parent
 * @param {String} xmlContent
 * @param {Object} [msg]
 * @param {Function} [callback] The callback that will be called when the ui is the first time created.
 * @param {Object} [globalConfig]
 * @returns {Function}
 */
Y.lazyUi = function(parent, xmlContent, msg, callback, globalConfig) {
    var ui,
        result;

    result = function () {
        if (!!ui) {
            return ui;
        }

        ui = Y.fastUi(parent, xmlContent, msg, globalConfig);

        if (!!callback) {
            callback(ui);
        }

        return ui;
    };

    return result;
};
