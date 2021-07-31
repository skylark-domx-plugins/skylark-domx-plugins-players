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

define('skylark-domx-plugins-players/video-player',[
  "skylark-langx/langx",
  "skylark-domx-noder",
  "skylark-domx-eventer",
  "skylark-domx-query",
  "skylark-domx-plugins-base",
  './players',
],function(langx,noder, eventer,$ , plugins, players) {

  'use strict'

  var VideoPlayer = plugins.Plugin.inherit({
    klassName : "VideoPlayer",

    pluginName : "lark.players.video",
   
    options : {
      classes : {
        // The class for video content elements:
        videoContent: 'video-content',
        // The class for video when it is loading:
        videoLoading: 'video-loading',
        // The class for video when it is playing:
        videoPlaying: 'video-playing'

      },
      // The list object property (or data attribute) for the video poster URL:
      videoPosterProperty: 'poster',
      // The list object property (or data attribute) for the video sources array:
      videoSourcesProperty: 'sources',

      ///media  : {
      ///  title : null,
      ///  url : null,
      ///  type : null,
      ///  posterUrl : null        
      ///}

    },


    _construct: function(elm, options) {
      //this.options = options
      plugins.Plugin.prototype._construct.call(this,elm,options);

      let $el = this.$(),
          $video = $('<video/>'),
          video = this._video = $video[0],
          isLoading,
          hasControls;

      $el.addClass(this.options.classes.videoContent);

      var $poster = this._$poster = $('<img/>');
      ///$poster.addClass(options.toggleClass)
      $poster.prop("draggable",false);

      $el.append($poster)

      $poster.css({
          "maxWidth" : "100%",
          "maxHeight" : "100%"
      });
            

      var $play = this._$play = $('<a/>');

      $play.prop('target','_blank');
      
      video.controls = true;
     
      this.listenTo($video,'error', function () {
            ///callback(errorArgs[0]);
      });

      this.listenTo($video,'pause', function () {
        if (video.seeking) return
        isLoading = false;
        this.$().removeClass(this.options.classes.videoLoading)
                .removeClass(this.options.classes.videoPlaying);
        this.trigger("pause");
      });


      this.listenTo($video,'playing', () => {
        isLoading = false
        this.$().removeClass(this.options.classes.videoLoading)
                .addClass(this.options.classes.videoPlaying);
        this.trigger("playing");
      });

      this.listenTo($video,'play',  () => {
        //window.clearTimeout(that.timeout)
        isLoading = true
        this.$().addClass(this.options.classes.videoLoading)
        this.trigger("play");
      });


      this.listenTo($play,'click', (e) =>{
        eventer.stop(e)
        if (isLoading) {
          this.pause()
        } else {
          this.play()
        }
      })

      $el.append($video);

      $video.css({
          "maxWidth" : "100%",
          "maxHeight" : "100%"
      });

      $el.append($play);

      if (this.options.media) {
        this.source(this.options.media);
      }
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
      this._video.load();
    },

    play : function() {
      this._video.play();

    },

    stop : function() {

    },

    pause : function() {
      this._video.pause();      
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
