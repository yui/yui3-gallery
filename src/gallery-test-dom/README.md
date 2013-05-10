gallery-test-dom
========

Testing utilities for YUI Test to help with Functional Testing.

## Assertions

 - isHidden(node) - Asserts that a given node is not visible on the page
 - isNotHidden(node) - Asserts that a given node is not hidden on the page
 - isHeight(expectedHeight, node) - Asserts that a given node is an expected height
 - isWidth(expectedWidth, node) - Asserts that a given node is an expected width
 - isCentered(node) - Asserts that node is centered in the viewport
 - isFocused(node) - Asserts that a node is focused on the page (NOTE: this may incorrectly fail if window isn't focused during test execution)

## Issues

https://github.com/klamping/yui3-gallery-contributions/issues