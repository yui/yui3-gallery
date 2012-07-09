YUI.add('gallery-timer', function(Y) {

/**
 * Local constants
 */
var STATUS_RUNNING = 'running',
    STATUS_PAUSED  = 'paused',
    STATUS_STOPPED = 'stopped',

    EVENT_START  = 'start',
    EVENT_STOP   = 'stop',
    EVENT_PAUSE  = 'pause',
    EVENT_RESUME = 'resume',
    EVENT_TIMER  = 'timer';
    

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
	  //this.publish(EVENT_TIMER);
      this.publish(EVENT_START ,  { defaultFn : this._defStartFn });
      this.publish(EVENT_STOP ,   { defaultFn : this._defStopFn });
      this.publish(EVENT_PAUSE ,  { defaultFn : this._defPauseFn });
      this.publish(EVENT_RESUME , { defaultFn : this._defResumeFn });
    },

    /**
     * Interface method to start the Timer. Fires timer:start
     *
     * @method start
     * @public
     * @since 1.0.0
     */
    start : function() {
      if(this.get('status') !== STATUS_RUNNING) {
        this.fire(EVENT_START);
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
      if(this.get('status') === STATUS_RUNNING) {
        this.fire(EVENT_STOP);
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
      if(this.get('status') === STATUS_RUNNING) {
        this.fire(EVENT_PAUSE);
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
      if(this.get('status') === STATUS_PAUSED) {
        this.fire(EVENT_RESUME);
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
      this.fire(EVENT_TIMER);

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
      switch (this.get('status')) {
        case STATUS_RUNNING:
          this._makeTimer();
          break;
        case STATUS_STOPPED: // overflow intentional
        case STATUS_PAUSED:
          this._destroyTimer();
          break;
      }
    },

    /**
     * Default function for start event.
     *
     * @method _defStartFn
     * @protected
     * @since 1.0.0
     */
    _defStartFn : function(e) {
      var delay = this.get('startDelay');

      if(delay > 0) {
        Y.later(delay, this, function(){
          this.set('status', STATUS_RUNNING);
        });
      }else{
        this.set('status', STATUS_RUNNING);
      }
    },

    /**
     * Default function for stop event.
     *
     * @method _defStopFn
     * @protected
     * @since 1.0.0
     */
    _defStopFn : function(e) {
      this.set('status', STATUS_STOPPED);
    },

    /**
     * Default function for pause event.
     *
     * @method _defPauseFn
     * @protected
     * @since 1.0.0
     */
    _defPauseFn : function(e) {
      this.set('status', STATUS_PAUSED);
    },

    /**
     * Default function for resume event. Starts timer with
     * remaining time left after Timer was paused.
     *
     * @method _defResumeFn
     * @protected
     * @since 1.0.0
     */
    _defResumeFn : function(e) {
      var remaining = this.get('length') - (this.get('stop') - this.get('start'));
      Y.later(remaining, this, function(){
        this._executeCallback();
        this.set('status',STATUS_RUNNING);
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
     return (this.get('status') === STATUS_STOPPED);
   },

   /**
    * Used to fire the internal callback
    *
    * @method _executeCallback
    * @protected
    * @since 1.1.0
    */
   _executeCallback : function() {
	  var callback = this.get('callback');
	  if (Y.Lang.isFunction(callback)) {
        (this.get('callback'))();
	  }
   }

},{
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
         *  - 1.1.0 - Changed from state to STATUS_ state was left
         *            from legacy code
         * @attribute status
         * @default STATUS_STOPPED
         * @type String
         * @since 1.1.0
         */
        status : {
            value : STATUS_STOPPED,
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
    STATUS : {
        RUNNING : STATUS_RUNNING,
        PAUSED  : STATUS_PAUSED,
        STOPPED : STATUS_STOPPED
    },

    /**
     * Static property provides public access to registered timer
     * event strings
     *
     * @property Timer.EVENTS
     * @type Object
     * @static
     */
    EVENTS : {
        START  : EVENT_START,
        STOP   : EVENT_STOP,
        PAUSE  : EVENT_PAUSE,
        RESUME : EVENT_RESUME,
        TIMER  : EVENT_TIMER
    }
});


}, 'gallery-2011.03.11-23-49' ,{requires:['base-build','event-custom']});
