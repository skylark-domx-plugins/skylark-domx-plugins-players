define([
  "skylark-langx",
  "skylark-domx-styler",
  "skylark-domx-noder",
  "skylark-domx-eventer",
  "skylark-domx-medias",
  "skylark-domx-query",
  "skylark-domx-plugins-base",
  "skylark-domx-plugins-toggles/fullscreen",
  "skylark-domx-plugins-toggles/Pip",
  "./players",
  "./play-control",
  "./progress-control",
  "./time-control",
  "./volume-control"
],function(langx,styler,noder, eventer,medias,$ , plugins,Fullscreen,Pip,players,PlayControl,ProgressControl,TimeControl,VolumeControl) {

  'use strict'

  var ControlsBar = plugins.Plugin.inherit({
    klassName : "ControlsBar",

    pluginName : "domx.players.controls_bar",
   
    options : {
      selectors : {

        playButton : '.play-button',
        playbackIcons : '.playback-icons use',

        timeControl : ".time",
        timeElapsed : '.time-elapsed',
        duration : '.duration',

        progressControl : ".video-progress",
        progressBar : '.progress-bar',
        seek : '.seek',
        seekTooltip : '.seek-tooltip',

        volumeControl : ".volume-control",
        volumeButton : '.volume-button',
        volumeIcons : '.volume-button use',
        volumeMute : 'use[href="#volume-mute"]',
        volumeLow : 'use[href="#volume-low"]',
        volumeHigh : 'use[href="#volume-high"]',
        volume : '.volume',

        fullscreenButton : '.fullscreen-button',
        fullscreenIcons : '.fullscreen-button use',

        pipButton : '.pip-button'

      }
    },


    _construct: function(elm, options) {
      //this.options = options
      plugins.Plugin.prototype._construct.call(this,elm,options);

      let $el = this.$(),
          selectors = this.options.selectors,
          media = this.options.media,
          container = this.options.container;


      //this._playButton = $el.find(selectors.playButton)[0];
      //this._playbackIcons = $el.find(selectors.playbackIcons);
      this._playControl = PlayControl.instantiate($el.find(selectors.playButton)[0],{
        media
      });


      //this._timeElapsed = $el.find(selectors.timeElapsed)[0];
      //this._duration = $el.find(selectors.duration)[0];
      this._timeControl = TimeControl.instantiate($el.find(selectors.timeControl)[0],{
        media        
      });
      
      //this._progressBar = $el.find(selectors.progressBar)[0];
      //this._seek = $el.find(selectors.seek)[0];
      //this._seekTooltip = $el.find(selectors.seekTooltip)[0];
      this._progressControl = ProgressControl.instantiate($el.find(selectors.progressControl)[0],{
        media      
      });

      //this._volumeButton = $el.find(selectors.volumeButton)[0];
      //this._volumeIcons = $el.find(selectors.volumeIcons);
      //this._volumeMute = $el.find(selectors.volumeMute)[0];
      //this._volumeLow = $el.find(selectors.volumeLow)[0];
      //this._volumeHigh = $el.find(selectors.volumeHigh)[0];
      //this._volume = $el.find(selectors.volume)[0];
      this._volumeControl = VolumeControl.instantiate($el.find(selectors.volumeControl)[0],{
        media    
      });
      

      //this._fullscreenButton = $el.find(selectors.fullscreenButton)[0];
      //this._fullscreenIcons = $el.find(selectors.fullscreenIcons);
      this._fullscreen = Fullscreen.instantiate($el.find(selectors.fullscreenButton)[0],{
        target : container
      });
      
      //this._pipButton = $el.find(selectors.pipButton)[0];
      this._pip = Pip.instantiate($el.find(selectors.pipButton)[0],{
        target : media       
      });

      // Add eventlisteners here
      /*
      this.listenTo($(this._playButton),'click', this.togglePlay);
      this.listenTo($(this._video),'play',this.updatePlayButton);
      this.listenTo($(this._video),'pause',this.updatePlayButton);
      this.listenTo($(this._video),'loadedmetadata',this.initializeVideo);
      this.listenTo($(this._video),'timeupdate',this.updateTimeElapsed);
      this.listenTo($(this._video),'timeupdate',this.updateProgress);
      this.listenTo($(this._video),'volumechange',this.updateVolumeIcon);
      this.listenTo($(this._video),'click',this.togglePlay);
      this.listenTo($(this._video),'click',this.animatePlayback);
      this.listenTo($(this._video),'mouseenter',this.showControls);
      this.listenTo($(this._video),'mouseleave',this.hideControls);
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
    }
  });

  plugins.register(ControlsBar);

  return players.ControlsBar = ControlsBar;
});

