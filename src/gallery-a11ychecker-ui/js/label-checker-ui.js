(function () {

var ns = Y.namespace("a11ychecker");

ns.showLabelErrors = function () {

    ns.checkLabels();
    ns.showErrors({ tooltip: true });

};

}());