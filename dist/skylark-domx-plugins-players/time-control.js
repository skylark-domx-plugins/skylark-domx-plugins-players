/**
 * skylark-domx-plugins-players - A  ui library for rendering various media data specified by mime-type.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx","skylark-domx-styler","skylark-domx-noder","skylark-domx-eventer","skylark-domx-query","skylark-domx-plugins-base"],function(t,e,s,i,n,a){"use strict";var o=a.Plugin.inherit({klassName:"TimeControl",pluginName:"domx.players.time_control",options:{selectors:{timeElapsed:".time-elapsed",duration:".duration"}},_construct:function(t,e){a.Plugin.prototype._construct.call(this,t,e);let s=this.$(),i=this.options.selectors,n=this._media=this.options.media;this.$timeElapsed=s.find(i.timeElapsed),this.$duration=s.find(i.duration),this.listenTo(n,"timeupdate",this.updateTimeElapsed),this.listenTo(n,"loadedmetadata",this.updateDuration)},formatTime:function(t){const e=new Date(1e3*t).toISOString().substr(11,8);return{minutes:e.substr(3,2),seconds:e.substr(6,2)}},updateDuration:function(){var t=this._media;const e=Math.round(t.duration()),s=this.formatTime(e);this.$duration.text(`${s.minutes}:${s.seconds}`),this.$duration.attr("datetime",`${s.minutes}m ${s.seconds}s`)},updateTimeElapsed:function(){const t=this.formatTime(Math.round(this._media.currentTime()));this.$timeElapsed.text(`${t.minutes}:${t.seconds}`),this.$timeElapsed.attr("datetime",`${t.minutes}m ${t.seconds}s`)}});return a.register(o),o});
//# sourceMappingURL=sourcemaps/time-control.js.map
