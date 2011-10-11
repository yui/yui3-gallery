// START WRAPPER: The YUI.add wrapper is added by the build system, when you use YUI Builder to build your component from the raw source in this file
//YUI.add("ratings", function (Y) {

    /* Any frequently used shortcuts, strings and constants */
    var Lang = Y.Lang;

    /* Ratings class constructor */
    function Ratings(config) {
        Ratings.superclass.constructor.apply(this, arguments);
    }

    /* 
     * Required NAME static field, to identify the Widget class and 
     * used as an event prefix, to generate class names etc. (set to the 
     * class name in camel case). 
     */
    Ratings.NAME = "ratings";
  
    /*
     * The attribute configuration for the widget. This defines the core user facing state of the widget
     */
    Ratings.ATTRS = {

        rating : {
            value: 0,
            validator: "_validateRating",
            broadcast: 1
        },
        min: {
            value: 0,
            readOnly: true
        },
        max: {
            value: 5,
            readOnly: true
        },
        inline: {
            value: false
        },
        skin: {
            value: "default",
            validator: "_validateSkin"
        }
    };

    /* 
     * The HTML_PARSER static constant is used if the Widget supports progressive enhancement, and is
     * used to populate the configuration for the Ratings instance from markup already on the page.
     */
    Ratings.HTML_PARSER = {

        rating: function (srcNode) {
            // If progressive enhancement is to be supported, return the value of "rating" based on the contents of the srcNode
            var val = parseFloat(srcNode.get('innerHTML'), 10);
            return Lang.isNumber(val) ? val : 0;
        }
  
    };

    /* Templates for any markup the widget uses. Usually includes {} tokens, which are replaced through Y.substitute */
    Ratings.LIST_TEMPLATE = '<div class="{ratings_id}{ratings_inline}">' +
        '<a href="#" title="0 stars out of 5" class="yui3-zero-stars{ratings_small}">0<\/a>' +
        '<ul class="yui3-star-rating{ratings_small}">' +
        '<li class="yui3-current-rating" style="width:{ratings_width};">{ratings_string}<\/li>' +
        '<li><a href="#" title="1 star out of 5" class="yui3-one-star">1<\/a><\/li>' +
        '<li><a href="#" title="2 stars out of 5" class="yui3-two-stars">2<\/a><\/li>' +
        '<li><a href="#" title="3 stars out of 5" class="yui3-three-stars">3<\/a><\/li>' +
        '<li><a href="#" title="4 stars out of 5" class="yui3-four-stars">4<\/a><\/li>' +
        '<li><a href="#" title="5 stars out of 5" class="yui3-five-stars">5<\/a><\/li>' +
        '<\/ul><\/div>';
  

    /* Ratings extends the base Widget class */
    Y.extend(Ratings, Y.Widget, {

        initializer: function () { },
  
        destructor : function () { },
  
        renderUI : function () {
            this._renderList();
        },

        bindUI : function () {
            this.after("ratingChange", this._afterRatingChange);
            Y.on("click", Y.bind(this._onClick, this), this.get("boundingBox"));
        },

        syncUI : function () {
            this._uiSetRating(this.get("rating"));
        },

        // Beyond this point is the Ratings specific application and rendering logic
        _getWidth : function () {
            return Math.floor(this.get("rating") / this.get("max") * 100) + "%";
        },
        _getRatingsString : function () {
            return "Currently " + this.get("rating") + "/" + this.get("max") + " Stars.";
        },

        _validateRating : function (attrVal) {
            if (!Lang.isNumber(attrVal)) {
                attrVal = parseFloat(attrVal);
            }
            return Lang.isNumber(attrVal) && attrVal >= this.get('min') && attrVal <= this.get('max');
        },
        _validateSkin : function (attrVal) {
            return Lang.isString(attrVal) && (attrVal === "default" ||  attrVal === "small");
        },

        /* Listeners, UI update methods */
        _renderList : function () {
            var contentBox = this.get("contentBox");
            contentBox.set("innerHTML", "").appendChild(contentBox.create(Y.substitute(Ratings.LIST_TEMPLATE, {
                ratings_id: "yui3-" + this.get("id") + "_ratings",
                ratings_inline: this.get("inline") ? " yui3-inline-rating" : "",
                ratings_small: this.get("skin") === "small" ? " yui3-small-star" : "",
                ratings_width: this._getWidth(),
                ratings_string: this._getRatingsString()
            })));
          
        },
      
        _onClick : function (e) {
            var node = e.target;
            if (node.get("tagName") === "A") {
                e.halt();
                this.set("rating", parseFloat(node.get("innerHTML")));
            }
        },

        _afterRatingChange : function (e) {
            /* Listens for changes in state, and asks for a UI update (controller). */
            this._uiSetRating(e.newVal);
        },

        _uiSetRating : function (val) {
            /* Update the state of rating in the UI (view) */
            var node = this.get("contentBox").one(".yui3-current-rating");
            if (node) {
                node.setStyle("width", this._getWidth());
                node.set("innerHTML", this._getRatingsString());
            }
        }
  
    });

    Y.Ratings = Ratings;

//}, "3.1.0", {requires: ["widget", "substitute"]});
// END WRAPPER

