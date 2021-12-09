/**
 * skylark-domx-plugins-players - A  ui library for rendering various media data specified by mime-type.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx-ns");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-domx-plugins-players/players',[
    "skylark-domx-plugins-base/plugins"
], function(plugins) {
    'use strict';

	return plugins.players = {};
});

define('skylark-domx-plugins-toggles/Pip',[
  "skylark-langx",
  "skylark-domx-styler",
  "skylark-domx-noder",
  "skylark-domx-eventer",
  "skylark-domx-query",
  "skylark-domx-plugins-base",
  "./toggles"
],function(langx,styler,noder, eventer,$ , plugins,toggles) {

  'use strict'

  var Pip = plugins.Plugin.inherit({
    klassName : "Pip",

    pluginName : "domx.toggles.pip",
   
    options : {
      classes : {
        mini : "mini",
        unmini : "unmini"
      },
      selectors : {
        pipButton : null //'.pip-button'
      }
    },


    _construct: function(elm, options) {
      //this.options = options
      plugins.Plugin.prototype._construct.call(this,elm,options);

      let $el = this.$(),
          selectors = this.options.selectors,
          target = this.target = this.elmx(this.options.target);

      if (selectors.pipButton) {
        this.$pipButton = $el.find(selectors.pipButton);
      } else {
        this.$pipButton = $el;
      }


      this.listenTo(this.$pipButton,'click',this.togglePip);

      if (!('pictureInPictureEnabled' in document)) {
          this.$pipButton.hide();
      }

    },

    // togglePip toggles Picture-in-Picture mode on the video
    togglePip : function () {
      try {
        let targetEl = this.target.elm();
        if (targetEl !== noder.pictureInPicture()) {
          this.$pipButton.disabled(true);
          noder.pictureInPicture(targetEl)
        } else {
          noder.pictureInPicture(false)
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.$pipButton.disabled(false);
      }
    },

  });

  plugins.register(Pip);

  return toggles.Pip = Pip;
});


define('skylark-domx-plugins-players/play-control',[
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


define('skylark-domx-plugins-players/progress-control',[
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
define('skylark-domx-plugins-players/time-control',[
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


define('skylark-domx-plugins-players/volume-control',[
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


define('skylark-domx-plugins-players/controls-bar',[
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


define('skylark-domx-plugins-players/playback-animation',[
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


define('skylark-domx-plugins-players/video-player',[
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

  var VideoPlayer = plugins.Plugin.inherit({
    klassName : "VideoPlayer",

    pluginName : "domx.players.video",
   
    options : {
      selectors : {
        video : 'video',
        videoControls : '.video-controls',


        playbackAnimation : '.playback-animation',

      }
    },


    _construct: function(elm, options) {
      //this.options = options
      plugins.Plugin.prototype._construct.call(this,elm,options);

      let $el = this.$(),
          selectors = this.options.selectors;

      this.$video = this.elmx().find(selectors.video);

      this.$videoControls = $el.find(selectors.videoControls);

      //this._playButton = $el.find(selectors.playButton)[0];
      //this._playbackIcons = $el.find(selectors.playbackIcons);
      this._controlsBar = ControlsBar.instantiate(this.$videoControls[0],{
        media : this.$video,
        container : this.elmx()
      });



      
      //this._playbackAnimation = $el.find(selectors.playbackAnimation)[0];
      this._playbackAnimation = PlaybackAnimation.instantiate($el.find(selectors.playbackAnimation)[0],{
        media : this.$video        
      });
      


      // Add eventlisteners here
      this.listenTo($el,'mouseenter',this.showControls);
      this.listenTo($el,'mouseleave',this.hideControls);
      /*
      this.listenTo(this.$video,'mouseenter',this.showControls);
      this.listenTo(this.$video,'mouseleave',this.hideControls);
      this.listenTo(this.$videoControls,'mouseenter',this.showControls);
      this.listenTo(this.$videoControls,'mouseleave',this.hideControls);
      this.listenTo($(this._playButton),'click', this.togglePlay);
      this.listenTo($(this._video),'play',this.updatePlayButton);
      this.listenTo($(this._video),'pause',this.updatePlayButton);
      this.listenTo($(this._video),'loadedmetadata',this.initializeVideo);
      this.listenTo($(this._video),'timeupdate',this.updateTimeElapsed);
      this.listenTo($(this._video),'timeupdate',this.updateProgress);
      this.listenTo($(this._video),'volumechange',this.updateVolumeIcon);
      this.listenTo($(this._video),'click',this.togglePlay);
      this.listenTo($(this._video),'click',this.animatePlayback);
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
      
      const videoWorks = !!document.createElement('video').canPlayType;
      if (videoWorks) {
        this.$video.controls(false);
        this.$videoControls.show();
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
          video = this._video,
          $play = this._$play,
          $poster = this._$poster;

      $el.prop("title", title);
      
      if (video.canPlayType) {
        if (url && type && video.canPlayType(type)) {
          video.src = url
        }    
      }

      video.poster = posterUrl
      
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
      this.$video.load();
    },

    play : function() {
      this.$video.play();

    },

    stop : function() {
      this.$video.stop();
    },

    pause : function() {
      this.$video.pause();      
    },

    // togglePlay toggles the playback state of the video.
    // If the video playback is paused or ended, the video is played
    // otherwise, the video is paused
    togglePlay : function () {
      if (this.$video.paused() || this.$video.ended()) {
        this.$video.play();
      } else {
        this.$video.pause();
      }
    },


    // hideControls hides the video controls when not in use
    // if the video is paused, the controls must remain visible
    hideControls : function () {
      if (this.$video.paused()) {
        return;
      }

      this.$videoControls.hide();
    },

    // showControls displays the video controls
    showControls : function () {
      this.$videoControls.show();
    },

    // keyboardShortcuts executes the relevant functions for
    // each supported shortcut key
    keyboardShortcuts : function (event) {
      const { key } = event;
      switch (key) {
        case 'k':
          this.togglePlay();
          this._playbackAnimation.animatePlayback();
          if (this.$video.paused()) {
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

  plugins.register(VideoPlayer);

  return players.VideoPlayer = VideoPlayer;
});


define('skylark-domx-plugins-players/main',[
    "./players",
    "./video-player"
], function(players) {
    return players;
})
;
define('skylark-domx-plugins-players', ['skylark-domx-plugins-players/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-domx-plugins-players.js.map
