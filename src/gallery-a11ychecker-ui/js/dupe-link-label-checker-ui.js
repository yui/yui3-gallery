(function () {

var ns = Y.namespace("a11ychecker");

ns.showDupeLinkLabels = function () {

    ns.findDupeLinkLabels();
    ns.showErrors({ tooltip: true });

};

}());