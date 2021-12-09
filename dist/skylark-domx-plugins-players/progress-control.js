/**
 * skylark-domx-plugins-players - A  ui library for rendering various media data specified by mime-type.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx","skylark-domx-styler","skylark-domx-noder","skylark-domx-eventer","skylark-domx-query","skylark-domx-plugins-base","./players"],function(t,e,s,i,o,r,a){"use strict";var n=r.Plugin.inherit({klassName:"ProgressControl",pluginName:"domx.players.progress_control",options:{selectors:{progressBar:".progress-bar",seek:".seek",seekTooltip:".seek-tooltip"}},_construct:function(t,e){r.Plugin.prototype._construct.call(this,t,e);let s=this.$(),i=this.options.selectors,o=this._media=this.options.media;this.$progressBar=s.find(i.progressBar),this.$seek=s.find(i.seek),this.$seekTooltip=s.find(i.seekTooltip),this.listenTo(o,"timeupdate",this.updateProgress),this.listenTo(this.$seek,"mousemove",this.updateSeekTooltip),this.listenTo(this.$seek,"input",this.skipAhead),this.listenTo(o,"loadedmetadata",this.updateDuration)},formatTime:function(t){const e=new Date(1e3*t).toISOString().substr(11,8);return{minutes:e.substr(3,2),seconds:e.substr(6,2)}},updateDuration:function(){var t=this._media;const e=Math.round(t.duration());this.$seek.attr("max",e),this.$progressBar.attr("max",e)},updateProgress:function(){var t=this._media,e=Math.floor(t.currentTime());this.$seek.val(e),this.$progressBar.val(e)},updateSeekTooltip:function(t){const e=Math.round(t.offsetX/t.target.clientWidth*parseInt(t.target.getAttribute("max"),10));this.$seek.attr("seek",e);const s=this.formatTime(e);this.$seekTooltip.text(`${s.minutes}:${s.seconds}`);const i=this._media.pagePosition();this.$seekTooltip.css("left",`${t.pageX-i.left}px`)},skipAhead:function(t){const e=t.target.dataset.seek?t.target.dataset.seek:t.target.value;this._media.currentTime(e),this.$progressBar.val(e),this.$seek.val(e)}});return r.register(n),a.ProgressControl=n});
//# sourceMappingURL=sourcemaps/progress-control.js.map