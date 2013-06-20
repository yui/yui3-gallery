YUI().use('node', 'gallery-template-factory', function (Y) {
    Y.on('domready', function () {
        var templateRequestor = Y.TemplateFactory.getRequestor({path: 'templates/'});
        var profileInfoTemplate = templateRequestor.getTemplate('profile-info');
        var profileInfoTemplateSecondCall = templateRequestor.getTemplate('profile-info');
    });
});