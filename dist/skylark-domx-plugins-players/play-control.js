/**
 * skylark-domx-plugins-players - A  ui library for rendering various media data specified by mime-type.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx","skylark-domx-styler","skylark-domx-noder","skylark-domx-eventer","skylark-domx-query","skylark-domx-plugins-base","./players"],function(t,s,a,i,l,e,o){"use strict";var n=e.Plugin.inherit({klassName:"PlayControl",pluginName:"domx.players.play_control",options:{titles:{play:"Play (k)",pause:"Pause (k)"},classes:{play:"play",pause:"pause"},selectors:{playButton:null}},_construct:function(t,s){e.Plugin.prototype._construct.call(this,t,s);let a=this.$(),i=this.options.selectors,l=this._media=this.options.media;i.playButton?this.$playButton=a.find(i.playButton):this.$playButton=a,this.listenTo(l,"click",this.togglePlay),this.listenTo(l,"play,pause",this.updatePlayButton),this.listenTo(this.$playButton,"click",this.togglePlay),this.updatePlayButton()},play:function(){this._media.play()},stop:function(){this._media.stop()},pause:function(){this._media.pause()},togglePlay:function(){this._media.paused()||this._media.ended()?this._media.play():this._media.pause()},updatePlayButton:function(){this._media.paused()?(this.$playButton.attr("data-title",this.options.titles.play),this.$playButton.removeClass(this.options.classes.pause).addClass(this.options.classes.play)):(this.$playButton.attr("data-title",this.options.titles.pause),this.$playButton.removeClass(this.options.classes.play).addClass(this.options.classes.pause))}});return e.register(n),o.PlayControl=n});
//# sourceMappingURL=sourcemaps/play-control.js.map
