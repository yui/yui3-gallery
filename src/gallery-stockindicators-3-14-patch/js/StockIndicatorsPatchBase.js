var ISARRAY = Y.Lang.isArray,
    DOCUMENT = Y.config.doc,
    _getClassName = Y.ClassNameManager.getClassName,
    SERIES_MARKER = _getClassName("seriesmarker"),
    COPYOBJECT = function(obj) {
        var newObj = {},
            key,
            val;
        for(key in obj)
        {
            if(obj.hasOwnProperty(key))
            {
                val = obj[key];
                if(typeof val === "object" && !ISARRAY(val))
                {
                    newObj[key] = this._copyObject(val);
                }
                else
                {
                    newObj[key] = val;
                }
            }
        }
        return newObj;
    },
    CREATEMARKER = function(styles)
    {
        var graphic = this.get("graphic"),
            marker,
            cfg = this._copyObject(styles);
        cfg.type = cfg.shape;
        marker = graphic.addShape(cfg);
        marker.addClass(SERIES_MARKER);
        return marker;
    },
    DRAWAXIS,
    GETDEFAULTAXISSTYLES,
    GETAXISLABEL,
    GETNUMERICCOORDFROMVALUE,
    GETCATEGORYCOORDFROMVALUE;
