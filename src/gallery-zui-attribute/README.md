ZUI attribute
===============

Summary
-------

ZUI attribute provides revert() , toggle() , set_again(), sync(), unsync() methods for Attribute.

Description
-----------

This module provides 5 more methods for Attribute:

*   revert() : rollback attribute value to previous one

*   toggle() : set attribute value to opposite boolean

*   set_again() : set attribute value to current value, use this to trigger setter function or change event again.

*   sync() : sync an attribute from other Object when the attribute value of other object changed, everytime.

*   unsync() : remove the sync binding.

Note
----

*   do not use toggle() on none boolean value. It works, but the result may changed in future version.

*   Now revert() is disabled by default for performance. You can set _doRevert property to true to enable revert() for all properties, or set _revertList as {propertyName: true, ...} hash for specified properties.

*   YUI Base object mixed Attribute when Y.use('base') , if you try to Y.mix(Y.AttributeCore.prototype, Y.zui.Attribute.prototype, true) , it seens not work. 2 ways to resolve this:

    1 Y.mix(Y.Base.prototype, Y.zui.Attribute.prototype, true);

    2 Y.mix(Y.AttributeCore.prototype, Y.zui.Attribute.prototype, true); then Y.use('base', ...);

*   Same with previous, you may need to Y.mix() Widget or all other Base child classes.

*   You may use Y.mix(ClassA, ClassB, true, null, 1) to mix on prototype, check document: http://yuilibrary.com/yui/docs/api/classes/YUI.html#method_mix . I like to use .protype directly, it makes code more readable.

Known Issue
-----------

*   set() will be tracked after Y.zui.Attribute mix into your class, then revert() use tracked value information to work. So, revert() can not get older values before Y.zui.Attribute mixed.

Code Sample
-----------

    // Add ZUI attribute support to one instance
    Y.mix(myInstance, Y.zui.Attribute.prototype);

    // enable revert() on 'testAttr2'
    myInstance._revertList = {testAttr2: true};

    // Or, enable revert() on all attributes
    myInstance._doRevert = true;

    // Now, set an attribute
    myInstance.set('testAttr', 3);

    // And you can revert the attribute
    myInstance.revert('testAttr');

    // Sync an attribute from another object
    // Everytime objterObject.get('testAttr') changed, set() the value to myInstance
    myInstance.sync('testAttr', otherObject);

    // Sync an attribute from another object, specify a different attribute name
    // Everytime objterObject.get('Attr2') changed, set() the value to myInstance
    myInstance.sync('testAttr', otherObject, 'Attr2');

    // Stop to monitering the attribute change
    myInstance.unsync('testAttr', otherObject);


    // Or, add ZUI attribute support to a class (before creating any instance) 
    Y.mix(myClass.prototype, Y.zui.Attribute.prototype);

    // Now, all myClass instances support revert(), toggle(), etc ...
    var testInstance = new myClass();
    testInstance.toggle('testAttr');

    // Add ZUI attribute support for all Attribute object
    Y.mix(Y.Attribute.prototype, Y.zui.Attribute.prototype, true);

    // Add ZUI attribute support for all Base object
    Y.mix(Y.Base.prototype, Y.zui.Attribute.prototype, true);
