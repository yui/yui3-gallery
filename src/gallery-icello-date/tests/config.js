YUI_config = {
    groups: {
        icello_date_tests: {
            filter: 'debug',
            combine: false,
            base: '../../../build/',
            modules: {
                'gallery-icello-date': {
                    requires: ['datatype-date-math']
                }
            }
        }
    }
};