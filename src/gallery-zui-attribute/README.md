ZUI attribute
===============

Summary
-------

ZUI attribute provides revert() , toggle() , set_again() methods for Attribute.

Description
-----------

This module provides 3 more methods for Attribute:

*   revert() : rollback attribute value to previous one

*   toggle() : set attribute value to opposite boolean

*   set_again() : set attribute value to current value, use this to trigger setter function or change event again.

Note
----

*   do not use toggle() on none boolean value. It works, but the result may changed in future version.

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

    // Now, set an attribute
    myInstance.set('testAttr', 3);

    // And you can revert the attribute
    myInstance.revert('testAttr');


    // Or, add ZUI attribute support to a class (before creating any instance) 
    Y.mix(myClass.prototype, Y.zui.Attribute.prototype);

    // Now, all myClass instances support revert(), toggle(), etc ...
    var testInstance = new myClass();
    testInstance.toggle('testAttr');

    // Add ZUI attribute support for all Attribute object
    Y.mix(Y.Attribute.prototype, Y.zui.Attribute.prototype, true);

    // Add ZUI attribute support for all Base object
    Y.mix(Y.Base.prototype, Y.zui.Attribute.prototype, true);
