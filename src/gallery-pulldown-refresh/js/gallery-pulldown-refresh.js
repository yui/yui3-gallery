//YUI.add('gallery-pulldown-refresh', function(Y){
var INNERHTML = 'innerHTML',
	    LIMIT = 70,
	    RELEASE_TEXT = 'Release to update',
	    PULLDOWN_TEXT = 'Pull down to refresh',
	    UPDATING_TEXT = 'Updating...',
	    LAST_UPDATED = 'Last updated:',
	    LOADING = '.yui3-pulldown-refresh-loading',
	    TEXT_PADDING_TOP = 'padding-top',
	    getClassName = Y.ClassNameManager.getClassName,
	    PULLDOWN_REFRESH = 'pulldown-refresh',
            _classNames = {
	    pulldownRefresh: getClassName(PULLDOWN_REFRESH),
	    animated: getClassName(PULLDOWN_REFRESH, 'animated'),
	    refreshIconPulldown : getClassName(PULLDOWN_REFRESH, 'icon-pulldown'),
	    refreshIconRelease : getClassName(PULLDOWN_REFRESH, 'icon-release'),
	    refreshIconLoading : getClassName(PULLDOWN_REFRESH, 'icon-loading'),
	    hidden : getClassName(PULLDOWN_REFRESH, 'hidden')
	};


	Y.PulldownRefresh = Y.Base.create('gallery-pulldown-refresh', Y.Widget, [Y.WidgetParent], {
		initializer : function(){
		    this.reloadHeader = this.get('contentBox');
		},

		_initPullDown : function(){
		    this.body = Y.one('body');
		    var optoutSelector,
		    reloadHeader;

		    this.gestureMove = false;            
		    reloadHeader = this.reloadHeader;
                    this.refreshIcon = reloadHeader.one('#yui3-pulldown-refresh-icon');
                    this.loadingStat = reloadHeader.one('.yui3-pulldown-refresh-loading-stat');
                    this.lastUpdate = reloadHeader.one('.yui3-pulldown-refresh-last-update');

                    optoutSelector =  this.get('optoutSelector');  
                    optoutSelector.on('mousedown', Y.bind(this._onTouchStart,this));
                    optoutSelector.on('mousedown', function(e){                                                                             
			    if(!this.gestureMove){                                                                                           
				optoutSelector.on("gesturemove",Y.bind(this._onGestureMove,this), {standAlone:true});                       
			    }                                                                                                                
                    },this);                                                                                                             
  
                    optoutSelector.on("mouseup", Y.bind(this._onTouchEnd,this));  
		    this.optoutSelector = optoutSelector;
                    this._setUpdatedTime();
		},
		_destroy : function () {
		    Y.detach(this.optoutSelector);
		    this.start = null;
		    this.shouldRefresh = null;
		},
		_onTouchStart: function(e) {
		    this.reloadHeader.removeClass(_classNames.animated);
		    this.ignore = true;
		    if(this._shouldMove(e)){
			this.ignore = false;
			this.start = e.pageY;
			Y.fire('pulldown-refresh:start');
		    }else {
			this.ignore = true;
		    }
		    
		},
		_setUpdatedTime: function(e) {
		    var now = new Date(),
                    text = LAST_UPDATED +' ' + (1+now.getMonth())+'/'+now.getDate()+'/'+now.getFullYear(),
                    min = now.getMinutes(),
                    hours = now.getHours();

		    if(min < 10){
			min = '0' + min;
		    }

		    if(hours === 12){
			text += ' @ '+ hours + ':' +min+' pm';
		    }else if(hours>12) {
			text += ' @ '+(hours-12) + ':'+min +' pm';
		    }else {
			text += ' @ '+ hours + ':' +min+' am';
		    }

		    this.lastUpdate.set(INNERHTML, text);
		},
		_onGestureMove : function(e){
		    var start = this.start,
		    pageY = e.pageY,
		    shouldRefresh = this.shouldRefresh,
		    diff;
		    
		    if(!this.ignore && window.pageYOffset === 0 && this._shouldMove(e)){
			this.gestureMove = true;
			if(!this.body.hasClass('transition')){
			    if(!start){
				e.preventDefault();
				this.start = pageY;
				Y.fire('pulldown-refresh:start');
			    }else if(start<pageY){
				diff = pageY-start;
				e.preventDefault();
				this.reloadHeader.setStyle(TEXT_PADDING_TOP,diff +'px');
			        if(!shouldRefresh && diff > LIMIT){
				    this.loadingStat.set(INNERHTML,RELEASE_TEXT);
				    this.refreshIcon.replaceClass(_classNames.refreshIconPulldown,_classNames.refreshIconRelease);
				    this.shouldRefresh = true;
				}else if(shouldRefresh && diff <= LIMIT) {
				    this.loadingStat.set(INNERHTML,PULLDOWN_TEXT);
				    this.refreshIcon.replaceClass(_classNames.refreshIconRelease,_classNames.refreshIconPulldown);
				    this.shouldRefresh = false;
				}
			    }
			}
		    }
		},
		_shouldMove : function(e){
		    var target = e.target,
		    id;

		    id = this.optoutSelector.get('id');
		    if(!this.optoutSelector){
			return true;
		    }
		    if(!target.ancestor('#'+ id)){
			return false;
		    }
		    return true;
		},
		_onTouchEnd : function(e){
		    var reloadheader = this.reloadHeader,
                    refreshIcon = this.refreshIcon,
                    loadingStat = this.loadingStat;

		    reloadheader.addClass(_classNames.animated);
		    if(this.gestureMove){
			if(this.shouldRefresh){
			    this.shouldRefresh = false;
			    this.body.addClass('transition');
			    loadingStat.set(INNERHTML,UPDATING_TEXT);
			    refreshIcon.replaceClass(_classNames.refreshIconRelease,_classNames.refreshIconLoading);
			    refreshIcon.one(LOADING).removeClass(_classNames.hidden);
			    reloadheader.setStyle(TEXT_PADDING_TOP,'70px');
			    Y.fire('pulldown-refresh:refreshFeed');
			}
		    }
		    this.start = 0;
		},

		_resetPulldown: function(){
		    var refreshIcon = this.refreshIcon;
		    this.loadingStat.set(INNERHTML, PULLDOWN_TEXT);
		    refreshIcon.replaceClass(_classNames.refreshIconLoading,_classNames.refreshIconPulldown);
		    refreshIcon.one(LOADING).addClass(_classNames.hidden);
		    this.reloadHeader.setStyle(TEXT_PADDING_TOP,'0');
		    this.gestureMove = false;
		    this.body.removeClass('transition');
		    this._setUpdatedTime();
		    this._destroy();
		    this._initPullDown();
		},

		renderUI : function(){
		    var reloadHeader = this.reloadHeader,
		    loadingCon = Y.Node.create("<div class='yui3-pulldown-refresh-loading-con'></div>"),
		    refreshIcon = Y.Node.create("<span id='yui3-pulldown-refresh-icon' class='yui3-pulldown-refresh-icon-pulldown'><span class='yui3-pulldown-refresh-loading yui3-pulldown-refresh-hidden'></span></span>"),
		    loadingStat = Y.Node.create("<span class='yui3-pulldown-refresh-loading-stat'>Pull down to update...</span>"),
		    lastUpdate = Y.Node.create("<span class='yui3-pulldown-refresh-last-update'></span>");
		    
		    refreshIcon.append(loadingStat);
		    refreshIcon.append(lastUpdate);
		    loadingCon.append(refreshIcon);
		    reloadHeader.append(loadingCon);
		    this._initPullDown();
		},
		bindUI : function(){
		    Y.on('pulldown-refresh:resetPulldown', this._resetPulldown, this);
		}
	    }, {
                NAME: "pulldownrefresh",
                ATTRS : {
		    optoutSelector : {
			value : null,
                        setter : function(val){
                            return Y.one(val);
			}
                    },
                    tabIndex: {
                        value: -1
                    }
                }
	    });


//});