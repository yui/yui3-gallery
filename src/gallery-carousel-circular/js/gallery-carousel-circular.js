	var getClassName = Y.ClassNameManager.getClassName,
	    CHILDREN = 'children',
	    CIRCULAR_CAROUSEL = 'circular-carousel',
	    FIRST_CHILD = 'first-child',
	    LAST_CHILD = 'last-child',
	    _classNames = {
		circularCarousel: getClassName(CIRCULAR_CAROUSEL),
		circularCarouselItem : getClassName(CIRCULAR_CAROUSEL, 'item'),
		end: getClassName(CIRCULAR_CAROUSEL, 'end'),
		left: getClassName(CIRCULAR_CAROUSEL, 'left'),
		right: getClassName(CIRCULAR_CAROUSEL, 'right'),
		selectedCarouselItem: getClassName(CIRCULAR_CAROUSEL, 'selected'),
		start: getClassName(CIRCULAR_CAROUSEL, 'start')
	    };
	
	Y.CircularCarousel = Y.Base.create("circularcarousel", Y.Widget, [Y.WidgetParent], {
 
		initializer : function(){
		    this.list = this.get('srcNode');
		},

		_initScroll : function(){
		    var currentNode,list;

		    list = this.list;
		    this.currentNode = list.one('.' + _classNames.selectedCarouselItem);
		    this.firstNode = list.one('.' + _classNames.start);
		    this.lastNode = list.one('.' + _classNames.end);

		    currentNode = this.currentNode;
		    this.rightNode = currentNode.next();
		    this.leftNode = currentNode.previous();
		    if(!this.rightNode){
			this.rightNode = this.firstNode;
		    }

		    if(!this.leftNode){
			this.leftNode = this.lastNode;
		    }

		    this.rightNode.addClass(_classNames.right);
		    this.leftNode.addClass(_classNames.left);

		},

		renderUI: function () {
		    var srcNode = this.list;
                    srcNode.addClass( _classNames.circularCarousel);
                    srcNode.one(':'+ FIRST_CHILD).addClass(_classNames.start);
                    srcNode.one(':'+ FIRST_CHILD).addClass(_classNames.selectedCarouselItem);
                    srcNode.one(':'+ LAST_CHILD).addClass(_classNames.end);
                    srcNode.get(CHILDREN).addClass(_classNames.circularCarouselItem);

		    this._initScroll();
		},

		bindUI : function(){
		    Y.on('carousel:goPrev', this._goPrev, this);
		    Y.on('carousel:goNext', this._goNext, this);
		},
		
		syncUI : function(){

		},
		
		_goPrev: function(){
		    var leftNode = this.leftNode,
		    futureLeft = leftNode.previous();

		    this.currentNode.replaceClass(_classNames.selectedCarouselItem,_classNames.right);
		    this.rightNode.removeClass(_classNames.right);
		    this.rightNode = this.currentNode;
		    leftNode.replaceClass(_classNames.left, _classNames.selectedCarouselItem);
		    this.currentNode = leftNode;
		    if(!futureLeft){
			futureLeft = this.lastNode;
		    }

		    futureLeft.addClass(_classNames.left);
		    this.leftNode = futureLeft;
		},

		_goNext : function(){
		    var rightNode = this.rightNode,
		    futureRight = rightNode.next();

		    this.currentNode.replaceClass(_classNames.selectedCarouselItem,_classNames.left);
		    this.leftNode.removeClass(_classNames.left);
		    this.leftNode = this.currentNode;
		    rightNode.replaceClass(_classNames.right,_classNames.selectedCarouselItem);
		    this.currentNode = rightNode;
		    if(!futureRight){
			futureRight = this.firstNode;
		    }

		    futureRight.addClass(_classNames.right);
		    this.rightNode = futureRight;

		}
 
	    }, {
		NAME: "circularcarousel",
		ATTRS : {
		    label : {
			validator: Y.Lang.isString
		    },
		    tabIndex: {
			value: -1
		    }
		}
 
	    });

 
