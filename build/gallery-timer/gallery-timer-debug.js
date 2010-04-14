YUI.add('gallery-timer', function(Y) {

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
        }
        ;
    /**
     * Constructor
     */
    Timer = function(config) {
        Timer.superclass.constructor.apply(this,arguments);
    };
    
    /**
     * Timer extends Base
     */
    Y.extend(Timer, Y.Base,{
        /**
         * Local Date object for internal time measurement
         * 
         * @property
         * @protected
         */
        _date : new Date(),
        
        /**
         * Initializer lifecycle implementation for the Timer class.
         * Publishes events and subscribes 
         * to update after the status is changed.
         *
         * @method initializer
         * @protected
         * @param confit {Object} Configuration object literal for
         *     the Timer
         */
        initializer : function(config){
            this.after('statusChange',this._statusChanged,this);
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
         */
        resume : function() {
            Y.log('Timer::resume','info');
            if(this.get('status') === STATUS.PAUSED) {
                this.fire(EVENTS.RESUME);
            }
            return this;
        },
        
        /**
         * Checks to see if a new Timer is to be created. If so, calls
         * _timer() after a the schedule number of milliseconds. Sets 
         * Timer pointer to the new Timer id. Sets start to the current 
         * timestamp.
         * 
         * @method _makeTimer
         * @protected
         */
        _makeTimer : function() {
            var id = null,
                repeat = this.get('repeatCount');
            if(repeat === 0 || repeat > this.get('step')) {
                id = Y.later(this.get('length'), this, this._timer);
            }
            this.set('timer',id);
            this.set('start', this._date.getTime());
        },
        
        /**
         * Resets the Timer.
         * 
         * @method _destroyTimer
         * @protected
         */
        _destroyTimer : function() {
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
            (this.get('callback'))();
        },
        
        /**
         * Internal status change event callback. Allows status changes
         * to fire start(), pause(), resume(), and stop() automatically.
         * 
         * @method _statusChanged
         * @protcted
         */
        _statusChanged : function(e){
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
         */
        _startEvent : function(e) {
            this.set('status',STATUS.RUNNING);
        },
        
        /**
         * Default function for stop event.
         * 
         * @method _stopEvent
         * @protected
         */
        _stopEvent : function(e) {
            this.set('status',STATUS.STOPPED);
        },
        
        /**
         * Default function for pause event.
         * 
         * @method _pauseEvent
         * @protected
         */
        _pauseEvent : function(e) {
            this.set('status',STATUS.PAUSED);
        },
        
        /**
         * Default function for resume event. Starts timer with 
         * remaining time left after Timer was paused.
         * 
         * @method _resumeEvent
         * @protected
         */
        _resumeEvent : function(e) {
            var remaining = this.get('length') - (this.get('stop') - this.get('start'));
            Y.later(remaining,this,function(){this.set('status',STATUS.RUNNING);});
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
             */
            length : {
                value : 3000,
                setter : function(val) {
                    return parseInt(val,10);
                }
            },
            
            /**
             * Number of times the Timer should fire before it stops
             * 
             * @attribute repeatCount
             * @type Number
             */
            repeatCount : {
            	validator : function(val) {
            	    return (this.get('state') === STATUS.STOPPED);
            	},
                setter : function(val) {
                    return parseInt(val,10);
                },
                value : 0
            },
            
            /**
             * Timestamp Timer was started
             * 
             * @attribute start
             * @type Boolean
             */
            start : {
                readonly : true
            },

            /**
             * Timer status
             * 
             * @attribute stop
             * @default STATUS.STOPPED
             * @type String
             */
            state : {
                value : STATUS.STOPPED,
                readonly : true
            },
            
            /**
             * Number of times the Timer has looped
             * 
             * @attribute step
             * @type Boolean
             */
            step : { // number of intervals passed
                value : 0,
                readonly : true
            },
            
            /**
             * Timestamp Timer was stoped or paused
             * 
             * @attribute stop
             * @type Boolean
             */
            stop : {
                readonly : true
            },
            
            /**
             * Timer id to used during stop()
             * 
             * @attribute timer
             * @type Number
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
    
    Y.Timer = Timer;



}, 'gallery-2010.04.14-19-47' ,{requires:['base','event-custom']});
