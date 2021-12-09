/**
 * skylark-domx-plugins-players - A  ui library for rendering various media data specified by mime-type.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx","skylark-domx-styler","skylark-domx-noder","skylark-domx-eventer","skylark-domx-query","skylark-domx-plugins-base","skylark-domx-plugins-ranges","./players"],function(s,e,t,r,o,i,a,l){"use strict";var n=a.Progress.inherit({klassName:"ProgressControl",pluginName:"domx.players.progress_control",options:{selectors:{progressBar:".progress-bar",seek:".seek",seekTooltip:".seek-tooltip"}},_construct:function(s,e){a.Progress.prototype._construct.call(this,s,e);this.$(),this.options.selectors;let t=this._media=this.options.media;this.listenTo(t,"timeupdate",this.updateProgress),this.listenTo(t,"loadedmetadata",this.updateDuration)},updateDuration:function(){var s=this._media;const e=Math.round(s.duration());this.$seek.attr("max",e),this.$progressBar.attr("max",e)},updateProgress:function(){var s=this._media,e=Math.floor(s.currentTime());this.$seek.val(e),this.$progressBar.val(e)},updateSeekTooltip:function(s){a.Progress.prototype.updateSeekTooltip.call(this,s);const e=this._media.pagePosition();this.$seekTooltip.css("left",`${s.pageX-e.left}px`)},skipAhead:function(s){a.Progress.prototype.skipAhead.call(this,s),this._media.currentTime(this.$seek.val())}});return i.register(n),l.ProgressControl=n});
//# sourceMappingURL=sourcemaps/progress-control.js.map
