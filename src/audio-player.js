define([
  "skylark-langx",
  "skylark-domx-styler",
  "skylark-domx-noder",
  "skylark-domx-eventer",
  "skylark-domx-medias",
  "skylark-domx-query",
  "skylark-domx-plugins-base",
  "./players",
  "./controls-bar",
  "./playback-animation",
],function(langx,styler,noder, eventer,medias,$ , plugins,players,ControlsBar,PlaybackAnimation) {

  'use strict'

  var AudioPlayer = plugins.Plugin.inherit({
    klassName : "AudioPlayer",

    pluginName : "domx.players.audio",
   
    options : {
      selectors : {
        audio : 'audio',
        audioControls : '.controls-bar',


        playbackAnimation : '.playback-animation',

      }
    },


    _construct: function(elm, options) {
      //this.options = options
      plugins.Plugin.prototype._construct.call(this,elm,options);

      let $el = this.$(),
          selectors = this.options.selectors;

      this.$audio = this.elmx().find(selectors.audio);

      this.$audioControls = $el.find(selectors.audioControls);

      //this._playButton = $el.find(selectors.playButton)[0];
      //this._playbackIcons = $el.find(selectors.playbackIcons);
      this._controlsBar = ControlsBar.instantiate(this.$audioControls[0],{
        media : this.$audio,
        container : this.elmx()
      });



      
      //this._playbackAnimation = $el.find(selectors.playbackAnimation)[0];
      this._playbackAnimation = PlaybackAnimation.instantiate($el.find(selectors.playbackAnimation)[0],{
        media : this.$audio        
      });
      


      // Add eventlisteners here
      this.listenTo($el,'mouseenter',this.showControls);
      this.listenTo($el,'mouseleave',this.hideControls);
      /*
      this.listenTo(this.$audio,'mouseenter',this.showControls);
      this.listenTo(this.$audio,'mouseleave',this.hideControls);
      this.listenTo(this.$audioControls,'mouseenter',this.showControls);
      this.listenTo(this.$audioControls,'mouseleave',this.hideControls);
      this.listenTo($(this._playButton),'click', this.togglePlay);
      this.listenTo($(this._audio),'play',this.updatePlayButton);
      this.listenTo($(this._audio),'pause',this.updatePlayButton);
      this.listenTo($(this._audio),'loadedmetadata',this.initializeAudio);
      this.listenTo($(this._audio),'timeupdate',this.updateTimeElapsed);
      this.listenTo($(this._audio),'timeupdate',this.updateProgress);
      this.listenTo($(this._audio),'volumechange',this.updateVolumeIcon);
      this.listenTo($(this._audio),'click',this.togglePlay);
      this.listenTo($(this._audio),'click',this.animatePlayback);
      this.listenTo($(this._seek),'mousemove',this.updateSeekTooltip);
      this.listenTo($(this._seek),'input',this.skipAhead);
      this.listenTo($(this._volume),'input',this.updateVolume);
      this.listenTo($(this._volumeButton),'click',this.toggleMute);
      this.listenTo($(this._fullscreenButton),'click',this.toggleFullScreen);
      this.listenTo($el,'fullscreenchange,webkitfullscreenchange',this.updateFullscreenButton);
      this.listenTo($(this._pipButton),'click',this.togglePip);

      if (!('pictureInPictureEnabled' in document)) {
          this._pipButton.classList.add('hidden');
      }
      */
      this.listenTo($(document),'keyup',this.keyboardShortcuts);
      
      const audioWorks = !!document.createElement('audio').canPlayType;
      if (audioWorks) {
        this.$audio.controls(false);
        this.$audioControls.show();
      }

      this.load();
    },

    source : function(media) {
      this._media = media;
      let title = media.title || "",
          url = media.href,
          type = media.type,
          posterUrl = media.poster || "",
          altText = media.altText || "";

      let $el = this.$(),
          audio = this._audio,
          $play = this._$play,
          $poster = this._$poster;

      $el.prop("title", title);
      
      if (audio.canPlayType) {
        if (url && type && audio.canPlayType(type)) {
          audio.src = url
        }    
      }

      audio.poster = posterUrl
      
      $poster.prop({
        "src" : posterUrl,
        "alt" : altText
      });

      $play.prop({
        'download' :  title,
        "href" : url
      });
    
    },

    load : function() {
      this.$audio.load();
    },

    play : function() {
      this.$audio.play();

    },

    stop : function() {
      this.$audio.stop();
    },

    pause : function() {
      this.$audio.pause();      
    },

    // togglePlay toggles the playback state of the audio.
    // If the audio playback is paused or ended, the audio is played
    // otherwise, the audio is paused
    togglePlay : function () {
      if (this.$audio.paused() || this.$audio.ended()) {
        this.$audio.play();
      } else {
        this.$audio.pause();
      }
    },


    // hideControls hides the audio controls when not in use
    // if the audio is paused, the controls must remain visible
    hideControls : function () {
      if (this.$audio.paused()) {
        return;
      }

      this.$audioControls.hide();
    },

    // showControls displays the audio controls
    showControls : function () {
      this.$audioControls.show();
    },

    // keyboardShortcuts executes the relevant functions for
    // each supported shortcut key
    keyboardShortcuts : function (event) {
      const { key } = event;
      switch (key) {
        case 'k':
          this.togglePlay();
          this._playbackAnimation.animatePlayback();
          if (this.$audio.paused()) {
            this.showControls();
          } else {
            setTimeout(() => {
              this.hideControls();
            }, 2000);
          }
          break;
        case 'm':
          this._volumeControl.toggleMute();
          break;
        case 'f':
          this._fullscreen.toggleFullScreen();
          break;
        case 'p':
          this._pip.togglePip();
          break;
      }
    }    


  });

  plugins.register(AudioPlayer);

  return players.AudioPlayer = AudioPlayer;
});

