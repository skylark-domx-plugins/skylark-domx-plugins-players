/**
 * skylark-domx-plugins-players - A  ui library for rendering various media data specified by mime-type.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx","skylark-domx-styler","skylark-domx-noder","skylark-domx-eventer","skylark-domx-medias","skylark-domx-query","skylark-domx-plugins-base","./players","./controls-bar","./playback-animation"],function(t,o,i,s,a,e,n,l,r,u){"use strict";var d=n.Plugin.inherit({klassName:"AudioPlayer",pluginName:"domx.players.audio",options:{selectors:{audio:"audio",audioControls:".controls-bar",playbackAnimation:".playback-animation"}},_construct:function(t,o){n.Plugin.prototype._construct.call(this,t,o);let i=this.$(),s=this.options.selectors;this.$audio=this.elmx().find(s.audio),this.$audioControls=i.find(s.audioControls),this._controlsBar=r.instantiate(this.$audioControls[0],{media:this.$audio,container:this.elmx()}),this._playbackAnimation=u.instantiate(i.find(s.playbackAnimation)[0],{media:this.$audio}),this.listenTo(i,"mouseenter",this.showControls),this.listenTo(i,"mouseleave",this.hideControls),this.listenTo(e(document),"keyup",this.keyboardShortcuts),!!document.createElement("audio").canPlayType&&(this.$audio.controls(!1),this.$audioControls.show()),this.load()},source:function(t){this._media=t;let o=t.title||"",i=t.href,s=t.type,a=t.poster||"",e=t.altText||"",n=this.$(),l=this._audio,r=this._$play,u=this._$poster;n.prop("title",o),l.canPlayType&&i&&s&&l.canPlayType(s)&&(l.src=i),l.poster=a,u.prop({src:a,alt:e}),r.prop({download:o,href:i})},load:function(){this.$audio.load()},play:function(){this.$audio.play()},stop:function(){this.$audio.stop()},pause:function(){this.$audio.pause()},togglePlay:function(){this.$audio.paused()||this.$audio.ended()?this.$audio.play():this.$audio.pause()},hideControls:function(){this.$audio.paused()||this.$audioControls.hide()},showControls:function(){this.$audioControls.show()},keyboardShortcuts:function(t){const{key:o}=t;switch(o){case"k":this.togglePlay(),this._playbackAnimation.animatePlayback(),this.$audio.paused()?this.showControls():setTimeout(()=>{this.hideControls()},2e3);break;case"m":this._volumeControl.toggleMute();break;case"f":this._fullscreen.toggleFullScreen();break;case"p":this._pip.togglePip()}}});return n.register(d),l.AudioPlayer=d});
//# sourceMappingURL=sourcemaps/audio-player.js.map