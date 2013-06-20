yui-gallery-template-factory
============================
This yui 3 module is an utility to avoid mix html templates in the javascript code, it retrieves the template from
a defined folder.

Uses cases
==========
Use the template factory is pretty easy as you can see in the following sample:

### Inclusion

First the yui module need to be included:
```
// Create a new YUI instance and populate it with the required modules.
YUI().use('gallery-template-factory', function (Y) {
    // TemplateFactory is available and ready for use. Add implementation
    // code here.
});
```

### Implementation

And then the object needs to be instantiated:
```
var templateRequestor = Y.TemplateFactory.getRequestor({path: 'templates/'});
var profileInfoTemplate = templateRequestor.getTemplate('profile-info');
```

The following snippet illustrates the code inside the template profile-info.html:
```
<div>
    <span>Name: {{name}}</span>
    <span>Position: {{position}}</span>
</div>
```

The described use case above is looking at templates folder to retrieve the specified template,
as you can see the parameter passed is the template's file name. The following file structure describes
briefly the files structure:
```
src
    sample.js
    templates
        profile-info.html
```
