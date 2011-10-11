(function () {

var ns = Y.namespace("a11ychecker"),
    testName = "link-button-test",
    re = /(^#$)|(^javascript:)/i;

function findLinkButtons() {

    Y.all("a").each(function (link) {

        var href = link.get('href');

        if ((!href || (href && href.search(re) === 0)) && (!link.get('role'))) {
            ns.logError(testName, link, "Link used to create a button. Consider adding ARIA role of \"button\" or switch to button element.", "warn");
        }
    
    });

}

findLinkButtons.testName = testName;

ns.findLinkButtons = findLinkButtons;

}());

