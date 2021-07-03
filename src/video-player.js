define([
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

