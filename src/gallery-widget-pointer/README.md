gallery-widget-pointer
======================

The `gallery-widget-pointer` module is a YUI Gallery Module that adds a little arrow-like pointer to the widget's bounding box. To use it, you should pull it down and include it in a Y.Widget:


```javascript
YUI().use('overlay', 'gallery-widget-pointer', function (Y) {

    //Create your own overlay with some widget extensions including Y.WidgetPointer. You could do this with any widget.
    Y.MyCustomOverlay =Y.Base.create("customOverlay", Y.Widget, [Y.WidgetStdMod, Y.WidgetPosition, Y.WidgetStack, Y.WidgetPositionAlign, Y.WidgetPointer, Y.WidgetModality]); 

    var myOverlay = new Y.MyCustomOverlay({
        ...
        placement: "right"
    });
});
```

The `placement` attribute determines the direction of the pointer. The possible values are `"above"`, `"below"`, `"left"`, and `"right"`. The pointer faces in the **opposite direction** to the placement attribute. Essentially, you are asking to "place" the widget on the "right" of something, and therefore "point it to the left". 

Issues, feature requests and pull requests are most welcome!




