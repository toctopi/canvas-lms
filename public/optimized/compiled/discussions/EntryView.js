(function(){var a=function(a,b){return function(){return a.apply(b,arguments)}},b={}.hasOwnProperty,c=function(a,c){function e(){this.constructor=a}for(var d in c)b.call(c,d)&&(a[d]=c[d]);return e.prototype=c.prototype,a.prototype=new e,a.__super__=c.prototype,a};define(["require","i18n!discussions.entry","Backbone","underscore","compiled/discussions/EntryCollection","jst/discussions/_entry_content","jst/discussions/_deleted_entry","jst/discussions/entry_with_replies","compiled/discussions/Reply","compiled/discussions/EntryEditor","compiled/discussions/MarkAsReadWatcher","str/htmlEscape","vendor/jquery.ba-tinypubsub","compiled/jquery.kylemenu","jst/_avatar","jst/discussions/_reply_form"],function(b,d,e,f,g,h,i,j,k,l,m,n,o,p){var q,r;return r=o.publish,q=function(b){function e(){return this.onReadState=a(this.onReadState,this),this.onCollapsedView=a(this.onCollapsedView,this),e.__super__.constructor.apply(this,arguments)}return c(e,b),e.name="EntryView",e.instances=[],e.prototype.tagName="li",e.prototype.className="entry",e.prototype.initialize=function(){var a,b=this;return e.__super__.initialize.apply(this,arguments),a=this.model.get("id"),e.instances[a]=this,this.model.bind("change:id",function(a,c){return b.$el.attr("data-id",c)}),this.model.bind("change:collapsedView",this.onCollapsedView),this.model.bind("change:read_state",this.onReadState),this.render(),this.model.bind("change:deleted",function(a,c){return b.$(".discussion_entry:first").toggleClass("deleted-discussion-entry",c)}),this.model.get("deleted")&&this.$(".discussion_entry:first").addClass("deleted-discussion-entry"),this.toggleCollapsedClass(),this.createReplies()},e.prototype.onCollapsedView=function(a,b){var c;this.toggleCollapsedClass();if(this.model.get("hideRepliesOnCollapse"))return c=this.$(".replies, .add-side-comment-wrap"),b?c.hide():c.show()},e.prototype.onReadState=function(a,b){return b==="unread"&&this.markAsReadWatcher==null&&(this.markAsReadWatcher=new m(this)),this.$("article:first").toggleClass("unread",b==="unread")},e.prototype.fetchFullEntry=function(){return this.model.set("message",d.t("loading","loading...")),this.model.fetch()},e.prototype.toggleCollapsedClass=function(){var a;return a=this.model.get("collapsedView"),this.$el.children(".discussion_entry").toggleClass("collapsed",!!a).toggleClass("expanded",!a)},e.prototype.render=function(){return this.$el.html(j(this.model.toJSON())),this.$el.attr("data-id",this.model.get("id")),this.$el.attr("id",this.model.cid),r("userContent/change"),e.__super__.render.apply(this,arguments)},e.prototype.openMenu=function(a,b){if(!this.menu)return this.createMenu(b)},e.prototype.createMenu=function(a){var b;return b={appendMenuTo:"body",buttonOpts:{icons:{primary:null,secondary:null}}},this.menu=new p(a,b),this.menu.open()},e.prototype.createReplies=function(){},e.prototype.remove=function(){var a;return this.model.set("collapsedView",!0),a=i(this.model.toJSON()),this.$(".entry_content:first").html(a),this.model.destroy()},e.prototype.edit=function(){return this.editor==null&&(this.editor=new l(this)),this.editor.edit()},e.prototype.toggleCollapsed=function(a,b){return this.model.set("collapsedView",!this.model.get("collapsedView"))},e.prototype.addReply=function(a,b){return this.reply==null&&(this.reply=new k(this)),this.model.set("notification",""),this.reply.edit()},e.prototype.addReplyAttachment=function(a,b){return this.reply.addAttachment(b)},e.prototype.removeReplyAttachment=function(a,b){return this.reply.removeAttachment(b)},e.prototype.goToReply=function(a,b){},e}(e.View),b(["compiled/discussions/EntryCollectionView"],function(a){return q.prototype.createReplies=function(){var b,c,d=this;return b=this.$el.find(".replies"),this.collection=new g,this.view=new a({$el:b,collection:this.collection}),c=this.model.get("replies"),f.each(c,function(a){return a.parent_cid=d.model.cid}),this.collection.reset(this.model.get("replies"))}}),q})}).call(this)