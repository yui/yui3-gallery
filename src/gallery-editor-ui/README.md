gallery-editor-ui
========
YUI3 Gallery module which adds a user interface and advanced functions for [Rich Text Editor](http://yuilibrary.com/yui/docs/editor/) base.

For a list of all functions and the documentation: 

### live example ###

[EditorUI](http://contentlab.com/editor-yui.html)

### example ###

```html
<form method="get" id="postForm">
  <textarea name="content" id="editContent" class="Ak">
    &lt;p&gt;Hello &lt;strong&gt;World&lt;/strong&gt;&lt;/p&gt;
  </textarea>
</form>
```

```js
var editor = new Y.EditorUI({textareaEl: '#editContent', formEl:'#postForm'});
```