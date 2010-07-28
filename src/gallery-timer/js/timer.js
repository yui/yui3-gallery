    /**
     * Local constants
     */
    var Timer,
        NAME = 'timer',
        NS = 'timer',
        STATUS = {
            RUNNING : 'running',
            PAUSED  : 'paused',
            STOPPED : 'stopped'
        },
        EVENTS = {
            START  : 'start',
            STOP   : 'stop',
            PAUSE  : 'pause',
            RESUME : 'resume',
            TIMER  : 'timer'
        };

    /**
     * Y.Timer : Losely modeled after AS3's Timer class. Provides a 
     *           simple interface start, pause, resume, and stop a
     *           defined timer set with a custom callback method.
     *
     * @author Anthony Pipkin
     * @version 1.1.0
     */
    Y.Timer = Y.Base.create('timer', Y.Base, [] , {

        //////   P U B L I C   //////
        
        /**
         * Initializer lifecycle implementation for the Timer class.
         * Publishes events and subscribes 
         * to update after the status is changed.
         *
         * @method initializer
         * @protected
         * @param confit {Object} Configuration object literal for
         *     the Timer
         * @since 1.0.0
         */
        initializer : function(config){
            this.after('statusChange',this._afterStatusChange,this);
            this.publish(EVENTS.START ,  { defaultFn : this._startEvent });
            this.publish(EVENTS.STOP ,   { defaultFn : this._stopEvent });
            this.publish(EVENTS.PAUSE ,  { defaultFn : this._pauseEvent });
            this.publish(EVENTS.RESUME , { defaultFn : this._resumeEvent });
        },
        
        /**
         * Interface method to start the Timer. Fires timer:start
         * 
         * @method start
         * @public
         * @since 1.0.0
         */
        start : function() {
            Y.log('Timer::start','info');
            if(this.get('status') !== STATUS.RUNNING) {
                this.fire(EVENTS.START);
            }
            return this;
        },
        
        /**
         * Interface method to stop the Timer. Fires timer:stop
         * 
         * @method stop
         * @public
         * @since 1.0.0
         */
        stop : function() {
            Y.log('Timer::stop','info');
            if(this.get('status') === STATUS.RUNNING) {
                this.fire(EVENTS.STOP);
            }
            return this;
        },
        
        /**
         * Interface method to pause the Timer. Fires timer:pause
         * 
         * @method pause
         * @public
         * @since 1.0.0
         */
        pause : function() {
            Y.log('Timer::pause','info');
            if(this.get('status') === STATUS.RUNNING) {
                this.fire(EVENTS.PAUSE);
            }
            return this;
        },
        
        /**
         * Interface method to resume the Timer. Fires timer:resume
         * 
         * @method resume
         * @public
         * @since 1.0.0
         */
        resume : function() {
            Y.log('Timer::resume','info');
            if(this.get('status') === STATUS.PAUSED) {
                this.fire(EVENTS.RESUME);
            }
            return this;
        },
        

        //////   P R O T E C T E D   ////// 

        /**
         * Local Date object for internal time measurement
         * 
         * @property
         * @protected
         * @since 1.0.0
         */
        _date : new Date(),

        /**
         * Checks to see if a new Timer is to be created. If so, calls
         * _timer() after a the schedule number of milliseconds. Sets 
         * Timer pointer to the new Timer id. Sets start to the current 
         * timestamp.
         * 
         * @method _makeTimer
         * @protected
         * @since 1.0.0
         */
        _makeTimer : function() {
        	Y.log('Timer::_makeTimer','info');
            var id = null,
                repeat = this.get('repeatCount');
            if(repeat === 0 || repeat > this.get('step')) {
                id = Y.later(this.get('length'), this, this._timer);
            }

            this.set('timer', id);
            this.set('start', this._date.getTime());
        },
        
        /**
         * Resets the Timer.
         * 
         * @method _destroyTimer
         * @protected
         * @since 1.0.0
         */
        _destroyTimer : function() {
        	Y.log('Timer::_destroyTimer','info');
            this.get('timer').cancel();
            this.set('stop', this._date.getTime());
            this.set('step', 0);
        },
        
        /**
         * Increments the step and either stops or starts a new Timer 
         * interval. Fires the timer callback method.
         * 
         * @method _timer
         * @protected
         * @since 1.0.0
         */
        _timer : function() {
            Y.log('Timer::_timer','info');
            this.fire(EVENTS.TIMER);

            var step = this.get('step'),
                repeat = this.get('repeatCount');

            this.set('step', ++step);

            if(repeat > 0 && repeat <= step) {
                this.stop();
            }else{
                this._makeTimer();
            }
            
            this._executeCallback();

        },
        
        /**
         * Internal status change event callback. Allows status changes
         * to fire start(), pause(), resume(), and stop() automatically.
         * 
         * @method _statusChanged
         * @protcted
         * @since 1.0.0
         */
        _afterStatusChange : function(e){
        	Y.log('Timer::_afterStatusChange','info');
            switch (this.get('status')) {
                case STATUS.RUNNING:
                    this._makeTimer();
                    break;
                case STATUS.STOPPED: // overflow intentional
                case STATUS.PAUSED:
                    this._destroyTimer();
                    break;
            }
        },
        
        /**
         * Default function for start event.
         * 
         * @method _startEvent
         * @protected
         * @since 1.0.0
         */
        _startEvent : function(e) {
        	Y.log('Timer::_startEvent','info');
            var delay = this.get('startDelay');

            if(delay > 0) {
                Y.later(delay, this, function(){
                    this.set('status', STATUS.RUNNING);
                });
            }else{
                this.set('status', STATUS.RUNNING);
            }
        },
        
        /**
         * Default function for stop event.
         * 
         * @method _stopEvent
         * @protected
         * @since 1.0.0
         */
        _stopEvent : function(e) {
        	Y.log('Timer::_stopEvent','info');
            this.set('status', STATUS.STOPPED);
        },
        
        /**
         * Default function for pause event.
         * 
         * @method _pauseEvent
         * @protected
         * @since 1.0.0
         */
        _pauseEvent : function(e) {
        	Y.log('Timer::_pauseEvent','info');
            this.set('status', STATUS.PAUSED);
        },
        
        /**
         * Default function for resume event. Starts timer with 
         * remaining time left after Timer was paused.
         * 
         * @method _resumeEvent
         * @protected
         * @since 1.0.0
         */
        _resumeEvent : function(e) {
        	Y.log('Timer::_resumeEvent','info');
            var remaining = this.get('length') - (this.get('stop') - this.get('start'));
            Y.later(remaining, this, function(){
            	this._executeCallback();
            	this.set('status',STATUS.RUNNING);
            });
        },
        
        /**
         * Abstracted the repeatCount validator into the prototype to
         * encourage class extension.
         * 
         * @method _repeatCountValidator
         * @protected
         * @since 1.1.0
         */
         _repeatCountValidator : function(val) {
        	Y.log('Timer::_repeatCountValidator','info');
      	     return (this.get('status') === STATUS.STOPPED);
    	 },
    	 
    	 /**
    	  * Used to fire the internal callback 
    	  * 
    	  * @method _fireCallback
    	  * @protected
    	  * @since 1.1.0
    	  */
    	 _executeCallback : function() {
         	Y.log('Timer::_executeCallback','info');
             (this.get('callback'))();
    	 }
        
    },{
        /**
         * Static property provides a string to identify the class.
         * 
         * @property Timer.NAME
         * @type String
         * @static
         */
        NAME : NAME,

        /**
         * Static property provides a string to identify the class namespace.
         * 
         * @property Timer.NS
         * @type String
         * @static
         */
        NS : NS,

        /**
         * Static property used to define the default attribute
         * configuration for the Timer.
         * 
         * @property ATTRS
         * @type Object
         * @static
         */
        ATTRS : {
        
            /**
             * @description The callback method that fires when the 
             * timer interval is reached.
             * 
             * @attribute callback
             * @type function
             * @since 1.0.0
             */
            callback : {
                value : null,
                validator : Y.Lang.isFunction
            },
            
            /**
             * Time in milliseconds between intervals
             * 
             * @attribute length
             * @type Number
             * @since 1.0.0
             */
            length : {
                value : 3000,
                setter : function(val) {
                    return parseInt(val,10);
                }
            },
            
            /**
             * Number of times the Timer should fire before it stops
             *  - 1.1.0 - added lazyAdd false to prevent starting from
             *            overriding the validator
             * @attribute repeatCount
             * @type Number
             * @since 1.1.0
             */
            repeatCount : {
            	validator : 'repeatCountValidator',
                setter : function(val) {
                    return parseInt(val,10);
                },
                value : 0,
                lazyAdd : false
            },
            
            /**
             * Timestamp Timer was started
             * 
             * @attribute start
             * @type Boolean
             * @since 1.0.0
             */
            start : {
                readonly : true
            },

            /**
             * Timer status
             *  - 1.1.0 - Changed from state to status. state was left 
             *            from legacy code
             * @attribute status
             * @default STATUS.STOPPED
             * @type String
             * @since 1.1.0
             */
            status : {
                value : STATUS.STOPPED,
                readonly : true
            },
            
            /**
             * Number of times the Timer has looped
             * 
             * @attribute step
             * @type Boolean
             * @since 1.0.0
             */
            step : { // number of intervals passed
                value : 0,
                readonly : true
            },

            /** 
             * Time in ms to wait until starting after start() has been called
             * @attribute startDelay
             * @type Number
             * @since 1.1.0
             */
            startDelay : {
                value : 0
            },
            
            /**
             * Timestamp Timer was stoped or paused
             * 
             * @attribute stop
             * @type Boolean
             * @since 1.0.0
             */
            stop : {
                readonly : true
            },
            
            /**
             * Timer id to used during stop()
             * 
             * @attribute timer
             * @type Number
             * @since 1.0.0
             */
            timer : {
                readonly : true
            }
        },
        
        /**
         * Static property provides public access to registered timer
         * status strings
         * 
         * @property Timer.STATUS
         * @type Object
         * @static
         */
        STATUS : STATUS,
        
        /**
         * Static property provides public access to registered timer
         * event strings
         * 
         * @property Timer.EVENTS
         * @type Object
         * @static
         */
        EVENTS : EVENTS
    });
