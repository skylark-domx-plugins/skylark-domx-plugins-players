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

  var VolumeControl = plugins.Plugin.inherit({
    klassName : "VolumeControl",

    pluginName : "domx.players.volume_control",
   
    options : {
      selectors : {
        volumeButton : '.volume-button',
        volumeIcons : '.volume-button use',
        volumeMute : 'use[href="#volume-mute"]',
        volumeLow : 'use[href="#volume-low"]',
        volumeHigh : 'use[href="#volume-high"]',
        volume : '.volume'
      }
    },


    _construct: function(elm, options) {
      //this.options = options
      plugins.Plugin.prototype._construct.call(this,elm,options);

      this._media = this.options.media;

      let $el = this.$(),
          selectors = this.options.selectors,
          $media = this._media = this.options.media;

      this.$volumeButton = $el.find(selectors.volumeButton);
      this.$volumeIcons = $el.find(selectors.volumeIcons);
      this.$volumeMute = $el.find(selectors.volumeMute);
      this.$volumeLow = $el.find(selectors.volumeLow);
      this.$volumeHigh = $el.find(selectors.volumeHigh);
      this.$volume = $el.find(selectors.volume);

      // Add eventlisteners here
      this.listenTo($media,'volumechange',this.updateVolumeIcon);
      this.listenTo(this.$volume,'input',this.updateVolume);
      this.listenTo(this.$volumeButton,'click',this.toggleMute);

      this.updateVolumeIcon();
    },


    // updateVolume updates the video's volume
    // and disables the muted state if active
    updateVolume : function () {
      if (this._media.muted()) {
        this._media.muted(false);
      }

      this._media.volume(this.$volume.val());
    },

    // updateVolumeIcon updates the volume icon so that it correctly reflects
    // the volume of the video
    updateVolumeIcon : function () {
      this.$volumeIcons.forEach((icon) => {
        $(icon).hide();
      });

      this.$volumeButton.data('title', 'Mute (m)');

      if (this._media.muted() || this._media.volume() === 0) {
        this.$volumeMute.show();
        this.$volumeButton.data('title', 'Unmute (m)');
      } else if (this._media.volume() > 0 && this._media.volume() <= 0.5) {
        this.$volumeLow.show();
      } else {
        this.$volumeHigh.show();
      }
    },

    // toggleMute mutes or unmutes the video when executed
    // When the video is unmuted, the volume is returned to the value
    // it was set to before the video was muted
    toggleMute : function () {
      this._media.muted(!this._media.muted());

      if (this._media.muted()) {
        this.$volume.data('volume', this.$volume.val());
        this.$volume.val(0);
      } else {
        this.$volume.val(this.$volume.data("volume"));
      }
    }
  });

  plugins.register(VolumeControl);

  return players.VolumeControl = VolumeControl;
});

