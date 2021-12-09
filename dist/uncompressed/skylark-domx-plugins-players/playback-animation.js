define([
  "skylark-langx",
  "skylark-domx-styler",
  "skylark-domx-noder",
  "skylark-domx-eventer",
  "skylark-domx-animates",
  "skylark-domx-query",
  "skylark-domx-plugins-base"
],function(langx,styler,noder, eventer,animates,$ , plugins) {

  'use strict'

  var PlaybackAnimation = plugins.Plugin.inherit({
    klassName : "PlaybackAnimation",

    pluginName : "domx.players.playback_animation",
   
    options : {
      classes : {
        play : "play",
        pause : "pause"
      },
      selectors : {
        playbackAnimation : null //'.playback-animation'

      }
    },


    _construct: function(elm, options) {
      //this.options = options
      plugins.Plugin.prototype._construct.call(this,elm,options);

      let $el = this.$(),
          selectors = this.options.selectors,
          $media = this._media = this.options.media;



      if (selectors.playbackAnimation) {
        this.$playbackAnimation = $el.find(selectors.playbackAnimation);
      } else {
        this.$playbackAnimation = $el;
      }


      this.listenTo($media,'click',this.animatePlayback);


    },

    // animatePlayback displays an animation when
    // the video is played or paused
    animatePlayback : function () {
    // updatePlayButton updates the playback icon and tooltip
    // depending on the playback state
      if (this._media.paused()) {
        this.$playbackAnimation.removeClass(this.options.classes.play).addClass(this.options.classes.pause);
      } else {
        this.$playbackAnimation.removeClass(this.options.classes.pause).addClass(this.options.classes.play);
      }

      this.$playbackAnimation.animate(
        [
          {
            opacity: 1,
            transform: 'scale(1)',
          },
          {
            opacity: 0,
            transform: 'scale(1.3)',
          },
        ],
        {
          duration: 500,
        }
      );
    }


  });

  plugins.register(PlaybackAnimation);

  return PlaybackAnimation;
});

