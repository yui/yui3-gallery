gallerycss-cssextras Change Log
===============================

View meta/gallerycss-cssextras.json to view the current version.

NEXT
----

* Made it available through Bower: `bower install pure-extras`
* (!) Rename all prefixes to use `pure-*` from `yui3-*`

0.2
---

Lots of changes in this revision as I make CSSExtras play nice with other CSS modules, especially CSSTypography. The changes have been grouped into different sections.

## Global

* Remove `code` and `pre` styles. Pull in gallerycss-csstypography if you need these.
* Remove text-shadows and drop-shadows across the board.
* Colors have been tweaked to work well with each other. For example, .yui3-badge-success uses the same color as .yui3-alert-success.

### Alerts
* Change `yui3-alert` styles. They adopt a flatter look now.
* Remove `white-space: no-wrap`.
* Add a default `yui3-alert`.
* Remove `yui3-alert-info` and replace with `yui3-alert-warning`.
* Add `yui3-alert-success`.

### Badges
* Badges have a flatter look too.
* `yui3-badge-important` renamed to `yui3-badge-error` for semantic consistency with other code.
* Color changed for `yui3-badge-info`.

###Thumbnails
* Layout has been changed under the hood. It is assumed that thumbnails will be used within a grid unit that specifies it's width.
* All thumbnail items should have a `.yui3-thumb` classname. The thumbnail image rules are specified off this class name. Thumbnails can optionally have `yui3-thumb-rounded`, `.yui3-thumb-eliptical`, `.yui3-thumb-bordered`. Check the [examples](http://tilomitra.github.io/cssextras) for more information.

###Buttons
* Add more button styles (yay!) (`.yui3-button-selected`, `.yui3-button-success`, `.yui3-button-secondary`, `.yui3-button-warning`, `.yui3-button-error`)


0.1
---

* Initial Release



