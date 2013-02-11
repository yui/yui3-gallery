gallery-editor-ui
========
YUI3 Gallery module which adds a user interface and advanced functions for [Rich Text Editor](http://yuilibrary.com/yui/docs/editor/) base.

Besides basic formatting support (text style, outlining, lists) it has an easy to use image upload manager and link manager. 

For a list of all functions and the documentation see below: 

### Live example ###

An example of the [Editor](http://www.directlyrics.com/code/gallery-editor-ui/editor-yui.html).

### Example ###

```html
<form method="get" id="postForm">
  <textarea id="editContent">
    &lt;p&gt;Hello &lt;strong&gt;World&lt;/strong&gt;&lt;/p&gt;
  </textarea>
</form>
```

```js
var editor = new Y.EditorUI({textareaEl: '#editContent', formEl:'#postForm'});
```


### Hosted Docs ###

Check out the complete [documentation](http://www.directlyrics.com/code/gallery-editor-ui/).