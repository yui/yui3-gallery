/**
 * BaseAxis is the base class for observable baseAxis classes.
 */



/**
 * Creates the BaseAxis instance and contains initialization data
 *
 * @param {Object} config (optional) Configuration parameters for the Chart.
 * @class SWFWidget
 * @constructor
 */
function BaseAxis (config)
{
    this._createId();
    BaseAxis.superclass.constructor.apply(this, arguments);
}

BaseAxis.NAME = "baseAxis";

/**
 * Attribute config
 * @private
 */
BaseAxis.ATTRS = {
	/**
	 * Hash of array identifed by a string value.
	 */
	keys: {
        getter: function ()
		{
            if(!this._keys)
            {
                this._keys = {};
            }
			return this._keys;
		},
        
        setter: function(val)
        {
            var i, l;
            if(Y.Lang.isArray(val))
            {
                l = val.length;
                for(i = 0; i < l; ++i)
                {
                    this.addKey(val[i]);
                }
                return;
            }
            for(i in val)
            {
                if(val.hasOwnProperty(i))
                {
                    this.addKey(val[i]);
                }
            }
        }
	},

	/**
	 * @private 
	 * Storage for rounding unit
	 */
	roundingUnit:{
        getter: function ()
		{
			return this._roundingUnit;
		},
		setter: function (val)
		{
			this._roundingUnit = val;
			if(this._roundMinAndMax) 
			{
				this._updateMinAndMax();
			}
		}
 	},

	/**
	 * Indicates whether or not to round values when calculating
	 * <code>maximum</code> and <code>minimum</code>.
	 */
	roundMinAndMax:{
		getter: function ()
		{
			return this._roundMinAndMax;
		},
		setter: function (val)
		{
			if(this._roundMinAndMax == val) 
			{
				return val;
			}
			this._roundMinAndMax = val;
            this._updateMinAndMax();
		}
  	},

	/**
	 * Returns the type of axis data
	 * <ul>
	 * 	<li><code>time</code></li>
	 * 	<li><code>numeric</code></li>
	 * 	<li><code>category</code></li>
	 * </ul>
	 */
	dataType:
	{
		getter: function ()
		{
			return this._dataType;
		}
	},

	/**
	 * Instance of <code>ChartDataProvider</code> that the class uses
	 * to build its own data.
	 */
	dataProvider:{
        getter: function ()
		{
			return this._dataProvider;
		},
		setter: function (value)
		{
			if(value.hasOwnProperty("data") && Y.Lang.isArray(value.data))
            {
                value = Y.merge(value);
                value = value.data;
            }
            this._dataProvider = {data:value.concat()};
			this._dataClone = this._dataProvider.data.concat();
           
            var keyCollection = this.get("keyCollection"),
                keys = this.get("keys"),
                i,
                l;
            if(keys)
            {
                for(i in keys)
                {
                    if(keys.hasOwnProperty(i))
                    {
                        delete keys[i];
                    }
                }
            }
            if(keyCollection && keyCollection.length)
            {
                i = 0;
                l = keyCollection.length;
                for(; i < l; ++i)
                {
                    this.addKey(keyCollection[i]);
                }
            }
            if(this._dataReady)
            {
                this.fire("dataUpdate");
            }
		}
	},

	/**
	 * The maximum value contained in the <code>data</code> array. Used for
	 * <code>maximum</code> when <code>autoMax</code> is true.
	 */
	dataMaximum: {
		getter: function ()
		{
            if(!this._dataMaximum)
            {
                this._updateMinAndMax();
            }
			return this._dataMaximum;
		}
	},

	/**
	 * The maximum value that will appear on an axis.
	 */
	maximum: {
		getter: function ()
		{
			if(this.get("autoMax") || !this._setMaximum) 
			{
				return this.get("dataMaximum");
			}
			return this._setMaximum;
		},
		setter: function (value)
		{
			this._setMaximum = value;
		}
	},

	/**
	 * The minimum value contained in the <code>data</code> array. Used for
	 * <code>minimum</code> when <code>autoMin</code> is true.
	 */
	dataMinimum: {
		getter: function ()
		{
            if(isNaN(this._dataMinimum))
            {
                this._updateMinAndMax();
            }
			return this._dataMinimum;
		}
	},

	/**
	 * The minimum value that will appear on an axis.
	 */
	minimum: {
		getter: function ()
		{
			if(this.get("autoMin") || !this._setMinimum) 
			{
				return this.get("dataMinimum");
			}
            return this._setMinimum;
		},
        setter: function(val)
        {
            this._setMinimum = val;
            return val;
        }
	},

	/**
	 * Determines whether the maximum is calculated or explicitly 
	 * set by the user.
	 */
	autoMax: {
	    value: true
    },

	/**
	 * Determines whether the minimum is calculated or explicitly
	 * set by the user.
	 */
	autoMin: {
	    value: true
    },

	/**
	 * Array of axis data
	 */
	data: {
		getter: function ()
		{
			if(!this._data || this._updateTotalDataFlag)
            {
                this._updateTotalData();
            }
            return this._data;
		}
	},

    keyCollection: {
        getter: function()
        {
            var keys = this.get("keys"),
                i, 
                col = [];
            for(i in keys)
            {
                if(keys.hasOwnProperty(i))
                {
                    col.push(i);
                }
            }
            return col;
        },
        readOnly: true
    },

    labelFunction: {
        value: function(val, format)
        {
            return val;
        }
    }
};

Y.extend(BaseAxis, Y.Base,
{
	/**
	 * Constant used to generate unique id.
	 */
	GUID: "yuibaseaxis",
	
    /**
	 * Creates unique id for class instance.
	 *
	 * @private
	 */
	_createId: function()
	{
		this._id = Y.guid(this.GUID);
	},
	/**
	 * @private
	 * Storaga for roundingUnit
	 */
	_roundingUnit: NaN,
	/**
	 * @private 
	 * Storage for round min and max
	 */
	_roundMinAndMax: true,
	/**
	 * @private 
	 * Storage for dataType
	 */
	_dataType: null,
	/**
	 * @private
	 * Storage for dataProvider
	 */
	_dataProvider: null,
	/**
	 * @private 
	 * Instance copy of the ChartDataProvider's data array.
	 */
	_dataClone: null,
	/**
	 * @private
	 * Storage for maximum when autoMax is false.
	 */
	_setMaximum: null,
	/**
	 * @private
	 * Storage for dataMaximum
	 * is true.
	 */
	_dataMaximum: null,
	
    /**
	 * @private
	 * Storage for minimum when autoMin is false.
	 */
	_setMinimum: null,
	/**
	 * @private
	 * Storage for dataMinimum. 
	 */
	_dataMinimum: null,
	/**
	 * @private
	 * Storage for data
	 */
	_data: null,
	/**
	 * @private
	 * Storage for keys
	 */
	_keys: null,

    _updateTotalDataFlag: true,

	/**
	 * @private
	 * Indicates that the axis has a data source and at least one
	 * key.
	 */
	_dataReady: false,
	/**
	 * Adds an array to the key hash.
	 *
	 * @param value Indicates what key to use in retrieving
	 * the array.
	 */
	addKey: function (value)
	{
		if(this.get("keys").hasOwnProperty(value)) 
		{
			return;
		}
		this._dataClone = this.get("dataProvider").data.concat();
		var keys = this.get("keys"),
			eventKeys = {},
			event = {axis:this};
		this._setDataByKey(value);
		eventKeys[value] = keys[value].concat();
        this._updateMinAndMax();
		event.keysAdded = eventKeys;
		if(!this._dataReady)
		{
			this._dataReady = true;
			this.publish("dataReady", {fireOnce:true});
			this.fire("dataReady", event);
		}
		else
		{
			this.fire("dataUpdate", event);
		}
	},

	/**
	 * @private 
	 *
	 * Creates an array of data based on a key value.
	 */
	_setDataByKey: function(key)
	{
		var i,
			obj, 
			arr = [], 
			dv = this._dataClone.concat(), 
			len = dv.length;
		for(i = 0; i < len; ++i)
		{
			obj = dv[i];
			arr[i] = obj[key];
		}
		this.get("keys")[key] = arr;
	    this._updateTotalDataFlag = true;
    },

    /**
     * @private
     */
    _updateTotalData: function()
    {
		var keys = this.get("keys"),
            i;
        this._data = [];
        for(i in keys)
        {
            if(keys.hasOwnProperty(i))
            {
                this._data = this._data.concat(keys[i]);
            }
        }
        this._updateTotalDataFlag = false;
    },

	/**
	 * Removes an array from the key hash.
	 * 
	 * @param value Indicates what key to use in removing from 
	 * the hash.
	 * @return Boolean
	 */
	removeKey: function(value)
	{
		if(!this.get("keys").hasOwnProperty(value)) 
		{
			return;
		}
		var key,
			oldKey,
			newKeys = {},
			newData = [],
			removedKeys = {},
			keys = this.get("keys"),
			event = {};
        removedKeys[value] = keys[value].concat();
        for(key in keys)
        {
            if(keys.hasOwnProperty(key))
            {
                if(key == value) 
                {
                    continue;
                }
                oldKey = keys[key];
                newData = newData.concat(oldKey);
                newKeys[key] = oldKey;
            }
        }
        keys = newKeys;
        this._updateTotalDataFlag = true;
        this._updateMinAndMax();
        event.keysRemoved = removedKeys;
        this.fire("dataUpdate", event);
	},

	/**
	 * Returns a numeric value based of a key value and an index.
	 */
	getKeyValueAt: function(key, index)
	{
		var value = NaN,
			keys = this.get("keys");
		if(keys[key] && keys[key][index]) 
		{
			value = keys[key][index];
		}
		return value;
	},

	/**
	 * Returns an array of values based on an identifier key.
	 */
	getDataByKey: function (value)
	{
		var keys = this.get("keys");
		if(keys[value])
		{
			return keys[value];
		}
		return null;
	},


	/**
	 * @private 
	 * Updates the <code>dataMaximum</code> and <code>dataMinimum</code> values.
	 */
	_updateMinAndMax: function ()
	{
		var data = this.get("data"),
			max = 0,
			min = 0,
			len,
			num,
			i;
		if(data && data.length && data.length > 0)
		{
			len = data.length;
			max = min = data[0];
			if(len > 1)
			{
				for(i = 1; i < len; i++)
				{	
					num = data[i];
					if(isNaN(num))
					{
						continue;
					}
					max = Math.max(num, max);
					min = Math.min(num, min);
				}
			}
		}
		this._dataMaximum = max;
		this._dataMinimum = min;
	},

    getTotalMajorUnits: function(majorUnit, len)
    {
        var units;
        if(majorUnit.determinant === "count") 
        {
            units = majorUnit.count;
        }
        else if(majorUnit.determinant === "distance") 
        {
            units = (len/majorUnit.distance) + 1;
        }
        return units; 
    },

    getMajorUnitDistance: function(len, uiLen, majorUnit)
    {
        var dist;
        if(majorUnit.determinant === "count")
        {
            dist = uiLen/(len - 1);
        }
        else if(majorUnit.determinant === "distance")
        {
            dist = majorUnit.distance;
        }
        return dist;
    },

    getEdgeOffset: function(ct, l)
    {
        return 0;
    },

    getLabelByIndex: function(i, l)
    {
        var min = this.get("minimum"),
            max = this.get("maximum"),
            increm = (max - min)/(l-1),
            label;
            l -= 1;
            label = min + (i * increm);
        return label;
    }
});
Y.BaseAxis = BaseAxis;

