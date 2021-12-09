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

  'use strict'

  var PlayControl = plugins.Plugin.inherit({
    klassName : "PlayControl",

    pluginName : "domx.players.play_control",
   
    options : {
      titles : {
        play  : "Play (k)",
        pause : "Pause (k)"
      },
      classes : {
        play : "play",
        pause : "pause"
      },
      selectors : {
        playButton : null
      }
    },


    _construct: function(elm, options) {
      //this.options = options
      plugins.Plugin.prototype._construct.call(this,elm,options);


      let $el = this.$(),
          selectors = this.options.selectors,
          $media = this._media = this.options.media;

      if (selectors.playButton) {
        this.$playButton = $el.find(selectors.playButton);   
      } else {
        this.$playButton = $el;
      }

      this.listenTo($media,'click',this.togglePlay);
      this.listenTo($media,'play,pause',this.updatePlayButton);
      this.listenTo(this.$playButton,'click', this.togglePlay);
      this.updatePlayButton();
    },


    play : function() {
      this._media.play();

    },

    stop : function() {
      this._media.stop();      
    },

    pause : function() {
      this._media.pause();      
    },

    // togglePlay toggles the playback state of the video.
    // If the video playback is paused or ended, the video is played
    // otherwise, the video is paused
    togglePlay : function () {
      if (this._media.paused() || this._media.ended()) {
        this._media.play();
      } else {
        this._media.pause();
      }
    },

    // updatePlayButton updates the playback icon and tooltip
    // depending on the playback state
    updatePlayButton : function () {

      if (this._media.paused()) {
        this.$playButton.attr('data-title', this.options.titles.play);
        this.$playButton.removeClass(this.options.classes.pause).addClass(this.options.classes.play);
      } else {
        this.$playButton.attr('data-title', this.options.titles.pause);
        this.$playButton.removeClass(this.options.classes.play).addClass(this.options.classes.pause);
      }
    }

  });

  plugins.register(PlayControl);

  return players.PlayControl = PlayControl;
});

