SmugMug TreeView History
========================

## git

* `Y.TreeView` now mixes in `Y.Tree.Labelable`, which it should have been doing
  already. Oops.

## 2013-03-20

* Now using `Y.Tree` from YUI core, which means TreeView requires YUI 3.9.0+.

* TreeView templates can now be more easilly overridden by passing a
  `config.templates` object to the constructor. Read the source for spicy
  details.

## 2013-02-27

* Fixed: `clear()` didn't re-render the tree after clearing it.

## 2013-01-09

* TreeView now mixes in the new `Tree.Openable` extension.

* Fixed: Re-rendering a node with an undefined `canHaveChildren` property
  resulted in the "canHaveChildren" classname being applied when it shouldn't
  have been.

* Fixed: Parent node's DOM state wasn't updated correctly when a child was added
  or removed after the parent was rendered.

## 2012-12-26

* Initial gallery release.
