/**
 * skylark-domx-plugins-players - A  ui library for rendering various media data specified by mime-type.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx","skylark-domx-styler","skylark-domx-noder","skylark-domx-eventer","skylark-domx-animates","skylark-domx-query","skylark-domx-plugins-base"],function(a,s,i,t,n,l,o){"use strict";var e=o.Plugin.inherit({klassName:"PlaybackAnimation",pluginName:"domx.players.playback_animation",options:{classes:{play:"play",pause:"pause"},selectors:{playbackAnimation:null}},_construct:function(a,s){o.Plugin.prototype._construct.call(this,a,s);let i=this.$(),t=this.options.selectors,n=this._media=this.options.media;t.playbackAnimation?this.$playbackAnimation=i.find(t.playbackAnimation):this.$playbackAnimation=i,this.listenTo(n,"click",this.animatePlayback)},animatePlayback:function(){this._media.paused()?this.$playbackAnimation.removeClass(this.options.classes.play).addClass(this.options.classes.pause):this.$playbackAnimation.removeClass(this.options.classes.pause).addClass(this.options.classes.play),this.$playbackAnimation.animate([{opacity:1,transform:"scale(1)"},{opacity:0,transform:"scale(1.3)"}],{duration:500})}});return o.register(e),e});
//# sourceMappingURL=sourcemaps/playback-animation.js.map
