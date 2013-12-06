Y.WidgetPointer
===============

![example](http://f.cl.ly/items/0Y2u3F331G3t0N3R3K2B/Screen%20Shot%202013-03-27%20at%201.05.19%20AM.png)
![example2](http://f.cl.ly/items/250C0S3z0n3Y3Y2c1G41/Screen%20Shot%202013-03-27%20at%201.01.19%20AM.png)

The `gallery-widget-pointer` module is a YUI Gallery Module that adds a little arrow-like pointer to the widget's bounding box. To use it, you should pull it down and include it as a Y.Widget extension:


```javascript
YUI().use('panel', 'gallery-widget-pointer', function (Y) {

    //Create your own overlay with some widget extensions including Y.WidgetPointer. You could do this with any widget.
    Y.MyCustomPanel =Y.Base.create("customPanel", Y.Panel, [Y.WidgetPointer]); 

    var myPanel = new Y.MyCustomPanel({
        ...
        placement: "right"
    });
});
```

The `placement` attribute determines the direction of the pointer. The possible values are `"above"`, `"below"`, `"left"`, and `"right"`. The pointer faces in the **opposite direction** to the placement attribute. Essentially, you are asking to "place" the widget on the "right" of something, and therefore "point it to the left". 


Used by Tipsy and Popover
-------------------------
This extension is used by [Y.Tipsy](https://github.com/tilomitra/tipsy) and [Y.Popover](https://github.com/tilomitra/popover). Check those projects out. 


Contribute
----------
Issues, feature requests and pull requests are most welcome! 




