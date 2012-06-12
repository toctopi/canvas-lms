(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(['i18n!conversations.conversations_list', 'compiled/widget/ScrollableList', 'compiled/conversations/Conversation', 'jst/conversations/conversationItem', 'jquery.instructure_date_and_time'], function(I18n, ScrollableList, Conversation, conversationItemTemplate) {
    return (function(_super) {

      __extends(_Class, _super);

      function _Class(pane, $scroller) {
        var _this = this;
        this.pane = pane;
        this.conversationItem = __bind(this.conversationItem, this);

        this.clicked = __bind(this.clicked, this);

        this.loaded = __bind(this.loaded, this);

        this.app = this.pane.app;
        this.$empty = this.pane.$pane.find('#no_messages');
        _Class.__super__.constructor.call(this, $scroller, {
          model: Conversation,
          itemTemplate: this.conversationItem,
          elementHeight: 76,
          itemIdsKey: 'conversation_ids',
          itemsKey: 'conversations',
          sortKey: 'last_message_at',
          sortDir: 'desc',
          baseUrl: '/conversations?include_all_conversation_ids=1',
          noAutoLoad: true
        });
        this.$list.delegate('.action_mark_as_read, .action_mark_as_unread, .action_unstar, .action_star', 'click', function(e) {
          _this.pane.action($(e.currentTarget), {
            method: 'PUT'
          });
          return false;
        });
        this.$list.delegate('.actions a', 'blur', function(e) {
          return $(window).one('keyup', function(e) {
            if (e.shiftKey) {
              return _this.app.closeMenus();
            }
          });
        });
        this.$list.delegate('.actions a', 'click', function(e) {
          _this.pane.openConversationMenu($(e.currentTarget));
          return false;
        }).focus(function(e) {
          return _this.pane.openConversationMenu($(e.currentTarget));
        });
      }

      _Class.prototype.baseData = function() {
        return {
          scope: this.scope,
          filter: this.filters
        };
      };

      _Class.prototype.load = function(params, cb) {
        var _ref,
          _this = this;
        this.scope = params.scope;
        this.filters = (_ref = params.filter) != null ? _ref : [];
        return _Class.__super__.load.call(this, {
          sortKey: "" + (this.lastMessageKey()) + "_at",
          params: this.baseData(),
          loadId: params.id,
          cb: function() {
            _this.emptyCheck();
            return typeof cb === "function" ? cb() : void 0;
          }
        });
      };

      _Class.prototype.loaded = function(id, item, $node) {
        if (id && !(item != null)) {
          return this.app.updateHashData({
            id: null
          });
        } else {
          return this.activate(item, $node);
        }
      };

      _Class.prototype.added = function(conversation, $node) {
        return this.$empty.hide();
      };

      _Class.prototype.updated = function(conversation, $node) {
        var _ref;
        this.emptyCheck();
        if (this.isActive(conversation) && ((_ref = conversation.messages) != null ? _ref[0] : void 0)) {
          return this.app.addMessages(conversation.messages, 'prepend', 'slide');
        }
      };

      _Class.prototype.removed = function(data, $node) {
        this.emptyCheck();
        if (this.isActive(data.id)) {
          return this.activate(null);
        }
      };

      _Class.prototype.clicked = function(e) {
        return this.select($(e.currentTarget).data('id'));
      };

      _Class.prototype.lastMessageKey = function() {
        if (this.scope === 'sent') {
          return 'last_authored_message';
        } else {
          return 'last_message';
        }
      };

      _Class.prototype.emptyCheck = function() {
        var filterNames, i, map, text;
        map = this.app.filterNameMap;
        text = (function() {
          switch (this.scope) {
            case 'unread':
              return I18n.t('no_unread_messages', 'You have no unread messages');
            case 'starred':
              return I18n.t('no_starred_messages', 'You have no starred messages');
            case 'sent':
              return I18n.t('no_sent_messages', 'You have no sent messages');
            case 'archived':
              return I18n.t('no_archived_messages', 'You have no archived messages');
            default:
              return I18n.t('no_messages', 'You have no messages');
          }
        }).call(this);
        filterNames = (function() {
          var _i, _len, _ref, _results;
          _ref = this.filters;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            i = _ref[_i];
            if (map[i]) {
              _results.push(map[i]);
            }
          }
          return _results;
        }).call(this);
        if (filterNames.length) {
          text += " (" + (filterNames.join(', ')) + ")";
        }
        this.$empty.text(text);
        return this.$empty.showIf(!this.$items().length);
      };

      _Class.prototype.select = function(id, activate) {
        if (activate == null) {
          activate = true;
        }
        this.ensureSelected(id, activate);
        if (activate) {
          return this.app.updateHashData({
            id: id
          });
        }
      };

      _Class.prototype.isActive = function(id) {
        return this.active && this.active.id === id;
      };

      _Class.prototype.deactivate = function() {
        var _ref;
        if (!(this.active && this.item(this.active.id))) {
          return;
        }
        if ((_ref = this.$item(this.active.id)) != null) {
          _ref.removeClass('selected');
        }
        if (this.scope === 'unread') {
          this.removeItem(this.active);
        }
        return delete this.active;
      };

      _Class.prototype.ensureSelected = function(id, activate) {
        if (activate == null) {
          activate = true;
        }
        if (activate) {
          this.selected = [];
          this.$items().removeClass('selected');
          if (!this.isActive(id)) {
            this.deactivate();
          }
        } else {
          if (this.selected == null) {
            this.selected = [];
          }
        }
        if (id != null) {
          this.$item(id).addClass('selected');
          return this.selected.push(id);
        }
      };

      _Class.prototype.activate = function(conversation, $node) {
        var _this = this;
        if (conversation && this.isActive(conversation != null ? conversation.id : void 0)) {
          this.app.deselectMessages();
          return;
        }
        this.ensureSelected(conversation != null ? conversation.id : void 0);
        this.active = conversation;
        return this.app.loadConversation(this.active, $node, function() {
          if ($node != null ? $node.hasClass('unread') : void 0) {
            return $node.removeClass('read unread archived').addClass('read');
          }
        });
      };

      _Class.prototype.conversationItem = function(item) {
        var classes, data, property, user, _i, _len, _ref;
        data = $.extend({}, item.toJSON());
        if (data.participants) {
          _ref = data.participants;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            user = _ref[_i];
            if (!this.app.userCache[user.id]) {
              this.app.userCache[user.id] = user;
            }
          }
        }
        if (data.audience) {
          data.audienceHtml = this.app.htmlAudience(data, {
            highlightFilters: true
          });
          if (this.isActive(data.id)) {
            this.app.resetMessageForm(false);
          }
        }
        data.lastMessage = data[this.lastMessageKey()];
        data.lastMessageAt = $.friendlyDatetime($.parseFromISO(data[this.lastMessageKey() + "_at"]).datetime);
        data.hideCount = data.message_count === 1;
        classes = (function() {
          var _j, _len1, _ref1, _results;
          _ref1 = data.properties;
          _results = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            property = _ref1[_j];
            _results.push(property);
          }
          return _results;
        })();
        classes.push(data.workflow_state);
        if (data['private']) {
          classes.push('private');
        }
        if (data.starred) {
          classes.push('starred');
        }
        if (!data.subscribed) {
          classes.push('unsubscribed');
        }
        if ($.inArray(data.id, this.selected) >= 0) {
          classes.push('selected');
        }
        data.classes = classes.join(' ');
        return conversationItemTemplate(data);
      };

      return _Class;

    })(ScrollableList);
  });

}).call(this);
