YUI_config = {
    groups: {
        icello_button_tests: {
            filter: 'debug',
            combine: false,
            base: '../../../build/',
            modules: {
                'gallery-icello-datechooser': {
                    skinnable: true,
                    requires: ['widget', 'widget-position', 'widget-stack', 'widget-position-align', 'widget-position-constrain', 'widget-autohide', 'datatype-date', 'datatype-date-math', 'substitute', 'datatype-date-format', 'gallery-icello-date']
                },
                'gallery-icello-date': {
                    requires: ['datatype-date-math']
                }
            }
        }
    }
};