define([
  "skylark-langx",
  "skylark-domx-styler",
  "skylark-domx-noder",
  "skylark-domx-eventer",
  "skylark-domx-query",
  "skylark-domx-plugins-base"
],function(langx,styler,noder, eventer,$ , plugins) {

  'use strict'

  var TimeControl = plugins.Plugin.inherit({
    klassName : "TimeControl",

    pluginName : "domx.players.time_control",
   
    options : {
      selectors : {
        timeElapsed : '.time-elapsed',
        duration : '.duration'
      }
    },


    _construct: function(elm, options) {
      //this.options = options
      plugins.Plugin.prototype._construct.call(this,elm,options);

      let $el = this.$(),
          selectors = this.options.selectors,
          $media = this._media = this.options.media;


      this.$timeElapsed = $el.find(selectors.timeElapsed);
      this.$duration = $el.find(selectors.duration);

      // Add eventlisteners here
      this.listenTo($media,'timeupdate',this.updateTimeElapsed);
      this.listenTo($media,'loadedmetadata',this.updateDuration);

    },


    // formatTime takes a time length in seconds and returns the time in
    // minutes and seconds
    formatTime : function (timeInSeconds) {
      const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);

      return {
        minutes: result.substr(3, 2),
        seconds: result.substr(6, 2),
      };
    },

    // initializeVideo sets the video duration, and maximum value of the
    // progressBar
    updateDuration : function () {
      var media = this._media;
      const duration = Math.round(media.duration()),
           time = this.formatTime(duration);
      this.$duration.text(`${time.minutes}:${time.seconds}`);
      this.$duration.attr('datetime', `${time.minutes}m ${time.seconds}s`);
    },

    // updateTimeElapsed indicates how far through the video
    // the current playback is by updating the timeElapsed element
    updateTimeElapsed : function () {
      const time = this.formatTime(Math.round(this._media.currentTime()));
      this.$timeElapsed.text(`${time.minutes}:${time.seconds}`);
      this.$timeElapsed.attr('datetime', `${time.minutes}m ${time.seconds}s`);
    }
  });

  plugins.register(TimeControl);

  return TimeControl;
});

