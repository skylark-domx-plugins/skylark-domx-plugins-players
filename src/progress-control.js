define([
  "skylark-langx",
  "skylark-domx-styler",
  "skylark-domx-noder",
  "skylark-domx-eventer",
  "skylark-domx-query",
  "skylark-domx-plugins-base",
  "skylark-domx-plugins-ranges",
  "./players"
],function(langx,styler,noder, eventer,$ , plugins,ranges,players) {
  'use strict'

  var ProgressControl = ranges.Progress.inherit({
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
      ranges.Progress.prototype._construct.call(this,elm,options);

      let $el = this.$(),
          selectors = this.options.selectors,
          $media = this._media = this.options.media;

      // Add eventlisteners here
      this.listenTo($media,'timeupdate',this.updateProgress);

      this.listenTo($media,'loadedmetadata',this.updateDuration);

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
      ranges.Progress.prototype.updateSeekTooltip.call(this,event);

      //const rect = this._media.getBoundingClientRect();
      const pos = this._media.pagePosition();
      this.$seekTooltip.css("left", `${event.pageX - pos.left}px`);
    },

    // skipAhead jumps to a different point in the video when the progress bar
    // is clicked
    skipAhead : function (event) {
      ranges.Progress.prototype.skipAhead.call(this,event);

      let media = this._media;
      media.currentTime(this.$seek.val());
    },


  });

  plugins.register(ProgressControl);

  return players.ProgressControl = ProgressControl;
});