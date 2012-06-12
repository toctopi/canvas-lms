(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(['require', 'i18n!discussions.entry', 'Backbone', 'underscore', 'compiled/discussions/EntryCollection', 'jst/discussions/_entry_content', 'jst/discussions/_deleted_entry', 'jst/discussions/entry_with_replies', 'compiled/discussions/Reply', 'compiled/discussions/EntryEditor', 'compiled/discussions/MarkAsReadWatcher', 'str/htmlEscape', 'vendor/jquery.ba-tinypubsub', 'compiled/jquery.kylemenu', 'jst/_avatar', 'jst/discussions/_reply_form'], function(require, I18n, Backbone, _, EntryCollection, entryContentPartial, deletedEntriesTemplate, entryWithRepliesTemplate, Reply, EntryEditor, MarkAsReadWatcher, htmlEscape, _arg, KyleMenu) {
    var EntryView, publish;
    publish = _arg.publish;
    EntryView = (function(_super) {

      __extends(EntryView, _super);

      EntryView.name = 'EntryView';

      function EntryView() {
        this.onReadState = __bind(this.onReadState, this);

        this.onCollapsedView = __bind(this.onCollapsedView, this);
        return EntryView.__super__.constructor.apply(this, arguments);
      }

      EntryView.instances = [];

      EntryView.prototype.tagName = 'li';

      EntryView.prototype.className = 'entry';

      EntryView.prototype.initialize = function() {
        var id,
          _this = this;
        EntryView.__super__.initialize.apply(this, arguments);
        id = this.model.get('id');
        EntryView.instances[id] = this;
        this.model.bind('change:id', function(model, id) {
          return _this.$el.attr('data-id', id);
        });
        this.model.bind('change:collapsedView', this.onCollapsedView);
        this.model.bind('change:read_state', this.onReadState);
        this.render();
        this.model.bind('change:deleted', function(model, deleted) {
          return _this.$('.discussion_entry:first').toggleClass('deleted-discussion-entry', deleted);
        });
        if (this.model.get('deleted')) {
          this.$('.discussion_entry:first').addClass('deleted-discussion-entry');
        }
        this.toggleCollapsedClass();
        return this.createReplies();
      };

      EntryView.prototype.onCollapsedView = function(model, collapsedView) {
        var els;
        this.toggleCollapsedClass();
        if (this.model.get('hideRepliesOnCollapse')) {
          els = this.$('.replies, .add-side-comment-wrap');
          if (collapsedView) {
            return els.hide();
          } else {
            return els.show();
          }
        }
      };

      EntryView.prototype.onReadState = function(model, read_state) {
        if (read_state === 'unread') {
          if (this.markAsReadWatcher == null) {
            this.markAsReadWatcher = new MarkAsReadWatcher(this);
          }
        }
        return this.$('article:first').toggleClass('unread', read_state === 'unread');
      };

      EntryView.prototype.fetchFullEntry = function() {
        this.model.set('message', I18n.t('loading', 'loading...'));
        return this.model.fetch();
      };

      EntryView.prototype.toggleCollapsedClass = function() {
        var collapsedView;
        collapsedView = this.model.get('collapsedView');
        return this.$el.children('.discussion_entry').toggleClass('collapsed', !!collapsedView).toggleClass('expanded', !collapsedView);
      };

      EntryView.prototype.render = function() {
        this.$el.html(entryWithRepliesTemplate(this.model.toJSON()));
        this.$el.attr('data-id', this.model.get('id'));
        this.$el.attr('id', this.model.cid);
        publish('userContent/change');
        return EntryView.__super__.render.apply(this, arguments);
      };

      EntryView.prototype.openMenu = function(event, $el) {
        if (!this.menu) {
          return this.createMenu($el);
        }
      };

      EntryView.prototype.createMenu = function($el) {
        var options;
        options = {
          appendMenuTo: "body",
          buttonOpts: {
            icons: {
              primary: null,
              secondary: null
            }
          }
        };
        this.menu = new KyleMenu($el, options);
        return this.menu.open();
      };

      EntryView.prototype.createReplies = function() {};

      EntryView.prototype.remove = function() {
        var html;
        this.model.set('collapsedView', true);
        html = deletedEntriesTemplate(this.model.toJSON());
        this.$('.entry_content:first').html(html);
        return this.model.destroy();
      };

      EntryView.prototype.edit = function() {
        if (this.editor == null) {
          this.editor = new EntryEditor(this);
        }
        return this.editor.edit();
      };

      EntryView.prototype.toggleCollapsed = function(event, $el) {
        return this.model.set('collapsedView', !this.model.get('collapsedView'));
      };

      EntryView.prototype.addReply = function(event, $el) {
        if (this.reply == null) {
          this.reply = new Reply(this);
        }
        this.model.set('notification', '');
        return this.reply.edit();
      };

      EntryView.prototype.addReplyAttachment = function(event, $el) {
        return this.reply.addAttachment($el);
      };

      EntryView.prototype.removeReplyAttachment = function(event, $el) {
        return this.reply.removeAttachment($el);
      };

      EntryView.prototype.goToReply = function(event, $el) {};

      return EntryView;

    })(Backbone.View);
    require(['compiled/discussions/EntryCollectionView'], function(EntryCollectionView) {
      return EntryView.prototype.createReplies = function() {
        var el, replies,
          _this = this;
        el = this.$el.find('.replies');
        this.collection = new EntryCollection;
        this.view = new EntryCollectionView({
          $el: el,
          collection: this.collection
        });
        replies = this.model.get('replies');
        _.each(replies, function(reply) {
          return reply.parent_cid = _this.model.cid;
        });
        return this.collection.reset(this.model.get('replies'));
      };
    });
    return EntryView;
  });

}).call(this);
