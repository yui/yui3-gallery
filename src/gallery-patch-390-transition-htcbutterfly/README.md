Patch: 3.9.0 transitionend evanthandler fix for htc butterfly
=============================================================

Summary
-------

This help you to fix node.transition(cfg, callback) bug in htc Butterfly native browser.

Description
-----------

Check more details here: https://github.com/yui/yui3/issues/527

This patch can be used in yui 3.9.0

Code Sample
-----------

<script>
YUI({gallery: 'gallery-2013.xxxx'}).use('patch-390-transition-htcbutterfly', function (Y) {
    // now htc butterfly works
});
</script>
