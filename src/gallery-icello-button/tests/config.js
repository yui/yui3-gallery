YUI_config = {
    groups: {
        icello_button_tests: {
            filter: 'debug',
            combine: false,
            base: '../../../build/',
            modules: {
                'gallery-icello-button': {
                    skinnable: true,
                    requires: ['classnamemanager', 'node']
                }
            }
        }
    }
};