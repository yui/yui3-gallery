var express     = require('express'),
    expyui      = require('express-yui'),
    Locator     = require('locator'),
    LocatorHbs  = require('locator-handlebars'),
    encoder     = require('yui-pathogen-encoder'),
    app         = express();

expyui.extend(app);

// enabling combo encoder for app
encoder.enable(app);

// custom view engine to rely on yui templates
app.set('view', app.yui.view());

// serving static yui modules
app.use(expyui.static());

// creating a page with YUI embeded
app.get('/', expyui.expose(), function (req, res) {
    res.render('demo');
});

app.yui.applyConfig({
    combine: true,

    groups: {
        'ape-af': {
            comboBase: 'http://l.yimg.com/zz/combo?',
            root: 'os/mit/td/ape-af-0.0.38/',
            combine: true
        }
    },

    modules: {
        'af-poll': {
            group: 'ape-af',
            requires: [
                'af-pageviz'
            ]
        },
        'af-dom': {
            group: 'ape-af',
            requires: [
                'node-base',
                'node-core'
            ]
        },
        'af-pageviz': {
            group: 'ape-af',
            requires: [
                'event-custom-base',
                'event-custom-complex'
            ]
        }
    },

    gallery: 'gallery-2013.08.07-20-34',

    customComboBase: 'http://admin1.staging.cx.gq1.yahoo.com/combo/cc/'
});

// locator initialiation
new Locator({
    buildDirectory: 'build'
})
    .plug(LocatorHbs.yui())
    .plug(app.yui.plugin({
        registerGroup: true,
        registerServerModules: true
    }))
    .parseBundle(__dirname, {}).then(function () {

        // listen for traffic after locator finishes the walking process
        app.listen(3000, function () {
            console.log("Server listening on port 3000");
        });

    }, function (err) {
        console.error(err);
        console.error(err.stack);
    });
