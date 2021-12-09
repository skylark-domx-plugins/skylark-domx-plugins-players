define([
  "skylark-langx",
  "skylark-domx-styler",
  "skylark-domx-noder",
  "skylark-domx-eventer",
  "skylark-domx-query",
  "skylark-domx-plugins-base",
  "./players"
],function(langx,styler,noder, eventer,$ , plugins,players) {
  'use strict'

  var ProgressControl = plugins.Plugin.inherit({
    klassName : "ProgressControl",

    pluginName : "domx.players.progress_control",
   
    options : {
      selectors : {
        progressBar : '.progress-bar',
        seek : '.seek',
        seekTooltip : '.seek-tooltip'
      }
    },


    _construct: function(elm, options) {
      plugins.Plugin.prototype._construct.call(this,elm,options);

      let $el = this.$(),
          selectors = this.options.selectors,
          $media = this._media = this.options.media;


      this.$progressBar = $el.find(selectors.progressBar);
      this.$seek = $el.find(selectors.seek);
      this.$seekTooltip = $el.find(selectors.seekTooltip);

      // Add eventlisteners here
      this.listenTo($media,'timeupdate',this.updateProgress);
      this.listenTo(this.$seek,'mousemove',this.updateSeekTooltip);
      this.listenTo(this.$seek,'input',this.skipAhead);

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
     	const duration = Math.round(media.duration());    		
     	this.$seek.attr('max', duration);
     	this.$progressBar.attr('max', duration);
    },


    // updateProgress indicates how far through the video
    // the current playback is by updating the progress bar
    updateProgress : function () {
		  var media = this._media,
			currentTime = Math.floor(media.currentTime());
      	this.$seek.val(currentTime);
      	this.$progressBar.val(currentTime);
    },

    // updateSeekTooltip uses the position of the mouse on the progress bar to
    // roughly work out what point in the video the user will skip to if
    // the progress bar is clicked at that point
    updateSeekTooltip : function (event) {
      const skipTo = Math.round(
        (event.offsetX / event.target.clientWidth) *
          parseInt(event.target.getAttribute('max'), 10)
      );
      this.$seek.attr('seek', skipTo);
      const t = this.formatTime(skipTo);
      this.$seekTooltip.text(`${t.minutes}:${t.seconds}`);
      //const rect = this._media.getBoundingClientRect();
      const pos = this._media.pagePosition();
      this.$seekTooltip.css("left", `${event.pageX - pos.left}px`);
    },

    // skipAhead jumps to a different point in the video when the progress bar
    // is clicked
    skipAhead : function (event) {
      const skipTo = event.target.dataset.seek
        ? event.target.dataset.seek
        : event.target.value;

      let media = this._media;
      media.currentTime(skipTo);
      this.$progressBar.val(skipTo);
      this.$seek.val(skipTo);
    },


  });

  plugins.register(ProgressControl);

  return players.ProgressControl = ProgressControl;
});