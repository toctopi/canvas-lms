(function() {

  define(['i18n!conversations.conversations_pane', 'compiled/conversations/ConversationsList', 'str/htmlEscape', 'compiled/util/shortcut'], function(I18n, ConversationsList, h, shortcut) {
    return (function() {

      shortcut(_Class, 'list', 'baseData', 'updateItems', 'isActive');

      function _Class(app, $pane) {
        this.app = app;
        this.$pane = $pane;
        this.list = new ConversationsList(this, this.$pane.find('> div.conversations'));
        this.selected = [];
        this.initializeActions();
      }

      _Class.prototype.initializeActions = function() {
        var $contextMenuActions,
          _this = this;
        $contextMenuActions = $('#conversation_actions').find('li a');
        $contextMenuActions.click(function(e) {
          e.preventDefault();
          return _this.app.closeMenus();
        });
        $contextMenuActions.filter('.standard_action').click(function(e) {
          return _this.action($(e.currentTarget), {
            method: 'PUT'
          });
        });
        return $('#action_delete_all').click(function(e) {
          if (confirm(I18n.t('confirm.delete_conversation', "Are you sure you want to delete your copy of this conversation? This action cannot be undone."))) {
            return _this.action($(e.currentTarget), {
              method: 'DELETE'
            });
          }
        });
      };

      _Class.prototype.updateView = function(params) {
        return this.list.load(params);
      };

      _Class.prototype.action = function($actionNode, options) {
        var conversation, conversationId, origCb, _ref,
          _this = this;
        conversationId = (_ref = options.conversationId) != null ? _ref : $actionNode.closest('div.conversations li').data('id');
        if (conversationId == null) {
          conversationId = $('#conversation_actions').data('activeConversationId');
        }
        conversation = this.list.item(conversationId);
        options = $.extend(true, {}, {
          url: this.actionUrlFor($actionNode, conversationId)
        }, options);
        origCb = options.success;
        options.success = function(data) {
          var _ref1;
          if ((_ref1 = data.messages) != null ? _ref1.length : void 0) {
            _this.app.addMessage(data.messages[0]);
          }
          return typeof origCb === "function" ? origCb(data) : void 0;
        };
        return conversation.inboxAction(options);
      };

      _Class.prototype.actionUrlFor = function($actionNode, conversationId) {
        var url;
        url = $.replaceTags($actionNode.attr('href'), 'id', conversationId);
        return url + (url.match(/\?/) ? '&' : '?') + $.param(this.baseData());
      };

      _Class.prototype.active = function() {
        return this.list.active;
      };

      _Class.prototype.openConversationMenu = function($node) {
        var $container, $conversation, elements, offset,
          _this = this;
        this.app.closeMenus();
        elements = {
          node: $node,
          container: $('#conversation_actions'),
          conversation: $node.closest('li'),
          parent: $node.parent(),
          lists: $('#conversation_actions ul'),
          listElements: $('#conversation_actions li'),
          focusable: $('a, input, select, textarea'),
          actions: {
            markAsRead: $('#action_mark_as_read').parent(),
            markAsUnread: $('#action_mark_as_unread').parent(),
            unstar: $('#action_unstar').parent(),
            star: $('#action_star').parent(),
            unsubscribe: $('#action_unsubscribe').parent(),
            subscribe: $('#action_subscribe').parent(),
            forward: $('#action_forward').parent(),
            archive: $('#action_archive').parent(),
            unarchive: $('#action_unarchive').parent(),
            "delete": $('#action_delete').parent(),
            deleteAll: $('#action_delete_all').parent()
          }
        };
        this.activeActionMenu = elements.node;
        elements.parent.addClass('selected');
        elements.container.addClass('selected');
        elements.conversation.addClass('menu_active');
        $container = elements.container;
        $conversation = elements.conversation;
        elements.container.data('activeConversationId', elements.conversation.data('id'));
        elements.lists.removeClass('first last').hide();
        elements.listElements.hide();
        if (elements.conversation.hasClass('unread')) {
          elements.actions.markAsRead.show();
        }
        if (elements.conversation.hasClass('read')) {
          elements.actions.markAsUnread.show();
        }
        if (elements.conversation.hasClass('starred')) {
          elements.actions.unstar.show();
        } else {
          elements.actions.star.show();
        }
        if (elements.conversation.hasClass('private')) {
          elements.actions.subscribe.hide();
          elements.actions.unsubscribe.hide();
        } else {
          if (!elements.conversation.hasClass('unsubscribed')) {
            elements.actions.unsubscribe.show();
          }
          if (elements.conversation.hasClass('unsubscribed')) {
            elements.actions.subscribe.show();
          }
        }
        elements.actions.forward.show();
        elements.actions["delete"].show();
        elements.actions.deleteAll.show();
        if (elements.conversation.hasClass('archived')) {
          elements.actions.unarchive.show();
        } else {
          elements.actions.archive.show();
        }
        $(window).one('keydown', function(e) {
          if (e.keyCode !== 9 || e.shiftKey) {
            return;
          }
          return elements.focusable.one('focus.actions_menu', function(e) {
            _this.nextElement = $(e.target);
            elements.focusable.unbind('.actions_menu');
            elements.container.find('a:visible:first').focus();
            elements.container.find('a:visible:first').bind('blur.actions_menu', e, function() {
              return $(window).one('keyup', function(e) {
                var actionMenuActive;
                actionMenuActive = elements.container.find('a:focus').length;
                if (!actionMenuActive) {
                  elements.container.find('a.visible').unbind('.actions_menu');
                  return _this.activeActionMenu.focus();
                }
              });
            });
            return elements.container.find('a:visible:last').bind('blur.actions_menu', e, function() {
              return $(window).one('keyup', function(e) {
                var actionMenuActive;
                actionMenuActive = elements.container.find('a:focus').length;
                if (!actionMenuActive) {
                  elements.container.find('a.visible').unbind('.actions_menu');
                  _this.nextElement.focus();
                  return _this.closeMenus();
                }
              });
            });
          });
        });
        elements.container.find('li[style*="list-item"]').parent().show();
        elements.groups = elements.container.find('ul[style*="block"]');
        if (elements.groups.length) {
          elements.groups.first().addClass('first');
          elements.groups.last().addClass('last');
        }
        offset = elements.node.offset();
        return elements.container.css({
          left: offset.left + (elements.node.width() / 2) - elements.container.offsetParent().offset().left - (elements.container.width() / 2),
          top: offset.top + (elements.node.height() * 0.9) - elements.container.offsetParent().offset().top
        });
      };

      _Class.prototype.resize = function(newHeight) {
        this.list.$scroller.height(newHeight - $('#actions').outerHeight(true));
        return this.list.fetchVisible();
      };

      return _Class;

    })();
  });

}).call(this);
