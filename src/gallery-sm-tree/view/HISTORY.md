SmugMug TreeView History
========================

## 2013-01-09

* TreeView now mixes in the new `Tree.Openable` extension.

* Fixed: Re-rendering a node with an undefined `canHaveChildren` property
  resulted in the "canHaveChildren" classname being applied when it shouldn't
  have been.

* Fixed: Parent node's DOM state wasn't updated correctly when a child was added
  or removed after the parent was rendered.

## 2012-12-26

* Initial gallery release.
