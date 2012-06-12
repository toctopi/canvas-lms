(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['i18n!conversations', 'underscore', 'str/htmlEscape', 'compiled/conversations/introSlideshow', 'compiled/conversations/ConversationsPane', 'compiled/conversations/audienceList', 'compiled/conversations/contextList', 'compiled/widget/TokenInput', 'compiled/str/TextHelper', 'jquery.ajaxJSON', 'jquery.instructure_date_and_time', 'jquery.instructure_forms', 'jqueryui/dialog', 'jquery.instructure_misc_helpers', 'jquery.disableWhileLoading', 'jquery.rails_flash_notifications', 'media_comments', 'vendor/jquery.ba-hashchange', 'vendor/jquery.elastic', 'jqueryui/position'], function(I18n, _, h, introSlideshow, ConversationsPane, audienceList, contextList, TokenInput, TextHelper) {
    return (function() {

      function _Class(options) {
        this.options = options;
        this.initializeMenus = __bind(this.initializeMenus, this);

        this.render = __bind(this.render, this);

        this.currentUser = this.options.USER;
        this.contexts = this.options.CONTEXTS;
        this.userCache = {};
        this.userCache[this.currentUser.id] = this.currentUser;
        $(this.render);
      }

      _Class.prototype.render = function() {
        this.$inbox = $('#inbox');
        this.minHeight = parseInt(this.$inbox.css('min-height').replace('px', ''));
        this.$conversations = $('#conversations');
        this.$messages = $('#messages');
        this.$messageList = this.$messages.find('ul.messages');
        this.initializeHelp();
        this.initializeForms();
        this.initializeMenus();
        this.initializeMessageActions();
        this.initializeConversationActions();
        this.initializeTemplates();
        this.initializeTokenInputs();
        this.initializeConversationsPane();
        this.initializeAutoResize();
        this.initializeHashChange();
        if (this.options.SHOW_INTRO) {
          return introSlideshow();
        }
      };

      _Class.prototype.showMessageForm = function() {
        var conversation, newMessage, _ref, _ref1;
        conversation = this.conversations.active();
        newMessage = !(conversation != null);
        this.$form.find('#recipient_info').showIf(newMessage);
        this.$form.find('#group_conversation_info').hide();
        $('#action_compose_message').toggleClass('active', newMessage);
        if (newMessage) {
          this.$form.addClass('new');
          this.$form.find('#action_add_recipients').hide();
          this.$form.attr({
            action: '/conversations?' + $.param((_ref = (_ref1 = this.conversations) != null ? _ref1.baseData() : void 0) != null ? _ref : {})
          });
        } else {
          this.$form.removeClass('new');
          this.$form.find('#action_add_recipients').showIf(!conversation.get('private'));
          this.$form.attr({
            action: conversation.url('add_message')
          });
        }
        this.resetMessageForm();
        this.$form.find('#user_note_info').hide().find('input').attr('checked', false);
        return this.$form.show().find(':input:visible:first').focus();
      };

      _Class.prototype.resetMessageForm = function(resetFields) {
        var c;
        if (resetFields == null) {
          resetFields = true;
        }
        this.$form.find('.audience').html((c = this.conversations.active()) ? this.htmlAudience(c.attributes, {
          linkToContexts: true,
          highlightFilters: true
        }) : h(I18n.t('headings.new_message', 'New Message')));
        if (resetFields) {
          this.$form.find('input[name!=authenticity_token], textarea').not(":checkbox").val('').change();
          this.$form.find(".attachment:visible").remove();
          this.$form.find(".media_comment").hide();
          this.$form.find("#action_media_comment").show();
        }
        return this.resize();
      };

      _Class.prototype.filters = function() {
        var _ref;
        return (_ref = this.conversations.baseData().filter) != null ? _ref : [];
      };

      _Class.prototype.htmlAudience = function(conversation, options) {
        var audience, filters, id, ret;
        if (options == null) {
          options = {};
        }
        filters = options.filters = options.highlightFilters ? this.filters() : [];
        audience = (function() {
          var _i, _len, _ref, _results;
          _ref = conversation.audience;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            id = _ref[_i];
            _results.push({
              id: id,
              name: this.userCache[id].name,
              activeFilter: _.include(filters, "user_" + id)
            });
          }
          return _results;
        }).call(this);
        ret = audienceList(audience, options);
        if (audience.length) {
          ret += " <em>" + this.htmlContextList(conversation.audience_contexts, options) + "</em>";
        }
        return ret;
      };

      _Class.prototype.htmlContextList = function(contexts, options) {
        var context, course, filters, group, id, roles, _ref;
        if (options == null) {
          options = {};
        }
        filters = (_ref = options.filters) != null ? _ref : [];
        contexts = ((function() {
          var _ref1, _results;
          _ref1 = contexts.courses;
          _results = [];
          for (id in _ref1) {
            roles = _ref1[id];
            if (course = this.contexts.courses[id]) {
              _results.push(course);
            }
          }
          return _results;
        }).call(this)).concat((function() {
          var _ref1, _results;
          _ref1 = contexts.groups;
          _results = [];
          for (id in _ref1) {
            roles = _ref1[id];
            if (group = this.contexts.groups[id]) {
              _results.push(group);
            }
          }
          return _results;
        }).call(this));
        contexts = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = contexts.length; _i < _len; _i++) {
            context = contexts[_i];
            context = _.clone(context);
            context.activeFilter = _.include(filters, "" + context.type + "_" + context.id);
            _results.push(context);
          }
          return _results;
        })();
        return contextList(contexts, options);
      };

      _Class.prototype.htmlNameForUser = function(user, contexts) {
        var _ref, _ref1;
        if (contexts == null) {
          contexts = {
            courses: user.common_courses,
            groups: user.common_groups
          };
        }
        return h(user.name) + (((_ref = contexts.courses) != null ? _ref.length : void 0) || ((_ref1 = contexts.groups) != null ? _ref1.length : void 0) ? " <em>" + this.htmlContextList(contexts) + "</em>" : '');
      };

      _Class.prototype.canAddNotesFor = function(user) {
        var id, roles, _ref, _ref1;
        if (!this.options.NOTES_ENABLED) {
          return false;
        }
        if (user.can_add_notes) {
          return true;
        }
        _ref = user.common_courses;
        for (id in _ref) {
          roles = _ref[id];
          if (__indexOf.call(roles, 'StudentEnrollment') >= 0 && (this.options.CAN_ADD_NOTES_FOR_ACCOUNT || ((_ref1 = this.contexts.courses[id]) != null ? _ref1.can_add_notes : void 0))) {
            return true;
          }
        }
        return false;
      };

      _Class.prototype.loadConversation = function(conversation, $node, cb) {
        var params, url,
          _this = this;
        this.toggleMessageActions(false);
        this.$messageList.removeClass('private').hide().html('');
        if (typeof $conversation !== "undefined" && $conversation !== null ? $conversation.hasClass('private') : void 0) {
          this.$messageList.addClass('private');
        }
        this.showMessageForm();
        params = this.currentHashData();
        if (params.message) {
          this.$form.find('#body').val(params.message);
        }
        if (conversation == null) {
          if (params.user_id) {
            $('#from_conversation_id').val(params.from_conversation_id);
            $('#recipients').data('token_input').selector.addByUserId(params.user_id, params.from_conversation_id);
          }
          return cb();
        }
        url = conversation.url();
        return this.$messageList.show().disableWhileLoading($.ajaxJSON(url, 'GET', {}, function(data) {
          var message, user, _i, _j, _len, _len1, _ref, _ref1, _ref2;
          _this.conversations.updateItems([data]);
          if (!_this.conversations.isActive(data.id)) {
            return;
          }
          _ref = data.participants;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            user = _ref[_i];
            if (!(!((_ref1 = _this.userCache[user.id]) != null ? _ref1.avatar_url : void 0))) {
              continue;
            }
            _this.userCache[user.id] = user;
            user.htmlName = _this.htmlNameForUser(user);
          }
          if (data['private'] && (user = ((function() {
            var _j, _len1, _ref2, _results;
            _ref2 = data.participants;
            _results = [];
            for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
              user = _ref2[_j];
              if (user.id !== this.currentUser.id) {
                _results.push(user);
              }
            }
            return _results;
          }).call(_this))[0] && _this.canAddNotesFor(user))) {
            _this.$form.find('#user_note_info').show();
          }
          _this.resize();
          _this.$messages.show();
          _ref2 = data.messages;
          for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            message = _ref2[_j];
            _this.$messageList.append(_this.buildMessage(message));
          }
          _this.$messageList.show();
          return cb();
        }));
      };

      _Class.prototype.deselectMessages = function() {
        return this.$messageList.find('li.selected').removeClass('selected');
      };

      _Class.prototype.addMessage = function(message) {
        this.toggleMessageActions(false);
        return this.buildMessage(message).prependTo(this.$messageList).slideDown('fast');
      };

      _Class.prototype.buildMessage = function(data) {
        var $attachmentBlank, $mediaObjectBlank, $message, $pmAction, $ul, attachment, avatar, pmUrl, submessage, user, userName, _base, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3, _ref4,
          _this = this;
        if (data.submission) {
          return this.buildSubmission(data);
        }
        $message = $("#message_blank").clone(true).attr('id', 'message_' + data.id);
        $message.data('id', data.id);
        $message.addClass(data.generated ? 'generated' : data.author_id === this.currentUser.id ? 'self' : 'other');
        $message.addClass('forwardable');
        user = this.userCache[data.author_id];
        if (avatar = user != null ? user.avatar_url : void 0) {
          $message.prepend($('<img />').attr('src', avatar).addClass('avatar'));
        }
        if (user) {
          if (user.htmlName == null) {
            user.htmlName = this.htmlNameForUser(user);
          }
        }
        userName = (_ref = user != null ? user.name : void 0) != null ? _ref : I18n.t('unknown_user', 'Unknown user');
        $message.find('.audience').html((user != null ? user.htmlName : void 0) || h(userName));
        $message.find('span.date').text($.parseFromISO(data.created_at).datetime_formatted);
        $message.find('p').html(TextHelper.formatMessage(data.body));
        $message.find("a.show_quoted_text_link").click(function(e) {
          var $target, $text;
          $target = $(e.currentTarget);
          $text = $target.parents(".quoted_text_holder").children(".quoted_text");
          if ($text.length) {
            event.stopPropagation();
            event.preventDefault();
            $text.show();
            return $target.hide();
          }
        });
        $pmAction = $message.find('a.send_private_message');
        pmUrl = $.replaceTags($pmAction.attr('href'), {
          user_id: data.author_id,
          user_name: encodeURIComponent(userName),
          from_conversation_id: typeof (_base = this.conversations).active === "function" ? _base.active().id : void 0
        });
        $pmAction.attr('href', pmUrl).click(function(e) {
          return e.stopPropagation();
        });
        if ((_ref1 = data.forwarded_messages) != null ? _ref1.length : void 0) {
          $ul = $('<ul class="messages"></ul>');
          _ref2 = data.forwarded_messages;
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            submessage = _ref2[_i];
            $ul.append(this.buildMessage(submessage));
          }
          $message.append($ul);
        }
        $ul = $message.find('ul.message_attachments').detach();
        $mediaObjectBlank = $ul.find('.media_object_blank').detach();
        $attachmentBlank = $ul.find('.attachment_blank').detach();
        if ((data.media_comment != null) || ((_ref3 = data.attachments) != null ? _ref3.length : void 0)) {
          $message.append($ul);
          if (data.media_comment != null) {
            $ul.append(this.buildMediaObject($mediaObjectBlank, data.media_comment));
          }
          if (data.attachments != null) {
            _ref4 = data.attachments;
            for (_j = 0, _len1 = _ref4.length; _j < _len1; _j++) {
              attachment = _ref4[_j];
              $ul.append(this.buildAttachment($attachmentBlank, attachment));
            }
          }
        }
        return $message;
      };

      _Class.prototype.buildMediaObject = function(blank, data) {
        var $mediaObject;
        $mediaObject = blank.clone(true).attr('id', 'media_comment_' + data.media_id);
        $mediaObject.find('span.title').html(h(data.display_name));
        $mediaObject.find('span.media_comment_id').html(h(data.media_id));
        $mediaObject.find('.instructure_inline_media_comment').data('media_comment_type', data.media_type);
        return $mediaObject;
      };

      _Class.prototype.buildAttachment = function(blank, data) {
        var $attachment, $link,
          _this = this;
        $attachment = blank.clone(true).attr('id', 'attachment_' + data.id);
        $attachment.data('id', data.id);
        $attachment.find('span.title').html(h(data.display_name));
        $link = $attachment.find('a');
        $link.attr('href', data.url);
        $link.click(function(e) {
          return e.stopPropagation();
        });
        return $attachment;
      };

      _Class.prototype.buildSubmission = function(data) {
        var $comment, $commentBlank, $header, $inlineMore, $moreLink, $submission, $ul, comment, href, idx, index, initiallyShown, score, user, userName, _i, _ref, _ref1, _ref2,
          _this = this;
        $submission = $("#submission_blank").clone(true).attr('id', data.id);
        $submission.data('id', data.id);
        data = data.submission;
        $ul = $submission.find('ul');
        $header = $ul.find('li.header');
        href = $.replaceTags($header.find('a').attr('href'), {
          course_id: data.assignment.course_id,
          assignment_id: data.assignment_id,
          id: data.user_id
        });
        $header.find('a').attr('href', href);
        user = this.userCache[data.user_id];
        if (user) {
          if (user.htmlName == null) {
            user.htmlName = this.htmlNameForUser(user);
          }
        }
        userName = (_ref = user != null ? user.name : void 0) != null ? _ref : I18n.t('unknown_user', 'Unknown user');
        $header.find('.title').html(h(data.assignment.name));
        $header.find('span.date').text(data.submitted_at ? $.parseFromISO(data.submitted_at).datetime_formatted : I18n.t('not_applicable', 'N/A'));
        $header.find('.audience').html((user != null ? user.htmlName : void 0) || h(userName));
        if (data.score && data.assignment.points_possible) {
          score = "" + data.score + " / " + data.assignment.points_possible;
        } else {
          score = (_ref1 = data.score) != null ? _ref1 : I18n.t('not_scored', 'no score');
        }
        $header.find('.score').html(score);
        $commentBlank = $ul.find('.comment').detach();
        index = 0;
        initiallyShown = 4;
        for (idx = _i = _ref2 = data.submission_comments.length - 1; _i >= 0; idx = _i += -1) {
          comment = data.submission_comments[idx];
          if (index >= 10) {
            break;
          }
          index++;
          $comment = this.buildSubmissionComment($commentBlank, comment);
          if (index > initiallyShown) {
            $comment.hide();
          }
          $ul.append($comment);
        }
        $moreLink = $ul.find('.more').detach();
        if (index > initiallyShown) {
          $inlineMore = $moreLink.clone(true);
          $inlineMore.find('.hidden').text(index - initiallyShown);
          $inlineMore.attr('title', h(I18n.t('titles.expand_inline', "Show more comments")));
          $inlineMore.click(function(e) {
            var $target;
            $target = $(e.currentTarget);
            $submission = $target.closest('.submission');
            $submission.find('.more:hidden').show();
            $target.hide();
            $submission.find('.comment:hidden').slideDown('fast');
            _this.resize();
            return false;
          });
          $ul.append($inlineMore);
        }
        if (data.submission_comments.length > index) {
          $moreLink.find('a').attr('href', href).attr('target', '_blank');
          $moreLink.find('.hidden').text(data.submission_comments.length - index);
          $moreLink.attr('title', h(I18n.t('titles.view_submission', "Open submission in new window.")));
          if (data.submission_comments.length > initiallyShown) {
            $moreLink.hide();
          }
          $ul.append($moreLink);
        }
        return $submission;
      };

      _Class.prototype.buildSubmissionComment = function(blank, data) {
        var $comment, avatar, user, userName, _ref;
        $comment = blank.clone(true);
        user = this.userCache[data.author_id];
        if (avatar = user != null ? user.avatar_url : void 0) {
          $comment.prepend($('<img />').attr('src', avatar).addClass('avatar'));
        }
        if (user) {
          if (user.htmlName == null) {
            user.htmlName = this.htmlNameForUser(user);
          }
        }
        userName = (_ref = user != null ? user.name : void 0) != null ? _ref : I18n.t('unknown_user', 'Unknown user');
        $comment.find('.audience').html((user != null ? user.htmlName : void 0) || h(userName));
        $comment.find('span.date').text($.parseFromISO(data.created_at).datetime_formatted);
        $comment.find('p').html(h(data.comment).replace(/\n/g, '<br />'));
        return $comment;
      };

      _Class.prototype.closeMenus = function() {
        $('#actions .menus > li, #conversation_actions, #conversations .actions').removeClass('selected');
        return $('#conversations li.menu_active').removeClass('menu_active');
      };

      _Class.prototype.openMenu = function($menu) {
        var $div, offset;
        this.closeMenus();
        if (!$menu.hasClass('disabled')) {
          $div = $menu.parent('li, span').addClass('selected').find('div');
          offset = -($div.parent().position().left + $div.parent().outerWidth() / 2) + 6;
          if (offset < -($div.outerWidth() / 2)) {
            offset = -($div.outerWidth() / 2);
          }
          return $div.css('margin-left', offset + 'px');
        }
      };

      _Class.prototype.resize = function(delay) {
        var _this = this;
        if (delay == null) {
          delay = 0;
        }
        if (this.resizeCb) {
          clearTimeout(this.resizeCb);
        }
        return this.resizeCb = setTimeout(function() {
          var availableHeight;
          delete _this.resizeCb;
          availableHeight = $(window).height() - $('#header').outerHeight(true) - ($('#wrapper-container').outerHeight(true) - $('#wrapper-container').height()) - ($('#main').outerHeight(true) - $('#main').height()) - $('#breadcrumbs').outerHeight(true) - $('#footer').outerHeight(true);
          if (availableHeight < _this.minHeight) {
            availableHeight = _this.minHeight;
          }
          $(document.body).toggleClass('too_small', availableHeight <= _this.minHeight);
          _this.$inbox.height(availableHeight);
          _this.$messageList.height(availableHeight - _this.$form.outerHeight(true));
          return _this.conversations.resize(availableHeight);
        }, delay);
      };

      _Class.prototype.toggleMessageActions = function(state) {
        if (state != null) {
          this.$messageList.find('> li').removeClass('selected');
          this.$messageList.find('> li :checkbox').attr('checked', false);
        } else {
          state = !!this.$messageList.find('li.selected').length;
        }
        $('#action_forward').parent().showIf(state && this.$messageList.find('li.selected.forwardable').length);
        if (state) {
          $("#message_actions").slideDown(100);
        } else {
          $("#message_actions").slideUp(100);
        }
        return this.$form[state ? 'addClass' : 'removeClass']('disabled');
      };

      _Class.prototype.updateHashData = function(changes) {
        var data, hash;
        data = $.extend(this.currentHashData(), changes);
        hash = $.encodeToHex(JSON.stringify(data));
        if (hash !== location.hash.substring(1)) {
          location.hash = hash;
          return $(document).triggerHandler('document_fragment_change', hash);
        }
      };

      _Class.prototype.initializeHelp = function() {
        var _this = this;
        return $('#help_crumb').click(function(e) {
          e.preventDefault();
          return introSlideshow();
        });
      };

      _Class.prototype.initializeForms = function() {
        var _this = this;
        $('#create_message_form, #forward_message_form').find('textarea').elastic().keypress(function(e) {
          if (e.which === 13 && e.shiftKey) {
            e.preventDefault();
            $(e.target).closest('form').submit();
            return false;
          }
        });
        this.$form = $('#create_message_form');
        this.$addForm = $('#add_recipients_form');
        this.$forwardForm = $('#forward_message_form');
        this.$form.submit(function(e) {
          var valid;
          valid = !!(_this.$form.find('#body').val() && (_this.$form.find('#recipient_info').filter(':visible').length === 0 || _this.$form.find('.token_input li').length > 0));
          if (!valid) {
            e.stopImmediatePropagation();
          }
          return valid;
        });
        this.$form.formSubmit({
          fileUpload: function() {
            return _this.$form.find(".file_input:visible").length > 0;
          },
          preparedFileUpload: true,
          context_code: "user_" + $("#identity .user_id").text(),
          folder_id: this.options.FOLDER_ID,
          intent: 'message',
          formDataTarget: 'url',
          handle_files: function(attachments, data) {
            var a;
            data.attachment_ids = (function() {
              var _i, _len, _results;
              _results = [];
              for (_i = 0, _len = attachments.length; _i < _len; _i++) {
                a = attachments[_i];
                _results.push(a.attachment.id);
              }
              return _results;
            })();
            return data;
          },
          disableWhileLoading: true,
          success: function(data) {
            var conversation;
            if (data.length == null) {
              data = [data];
            }
            _this.conversations.updateItems(data);
            if (data.length === 1) {
              conversation = data[0];
              if (_this.conversations.isActive(conversation.id)) {
                _this.buildMessage(conversation.messages[0]).prependTo(_this.$messageList).slideDown('fast');
              }
              if (conversation.visible) {
                _this.updateHashData({
                  id: conversation.id
                });
              }
              $.flashMessage(I18n.t('message_sent', 'Message Sent'));
            } else {
              $.flashMessage(I18n.t('messages_sent', 'Messages Sent'));
            }
            return _this.resetMessageForm();
          },
          error: function(data) {
            var error, errorText;
            if (typeof data.isRejected === "function" ? data.isRejected() : void 0) {
              return;
            }
            error = data[0];
            if ((error != null ? error.attribute : void 0) === 'body') {
              _this.$form.find('#body').errorBox(I18n.t('message_blank_error', 'No message was specified'));
            } else {
              errorText = ((error != null ? error.attribute : void 0) === 'recipients' ? error.message === 'blank' ? I18n.t('recipient_blank_error', 'No recipients were specified') : I18n.t('recipient_error', 'The course or group you have selected has no valid recipients') : I18n.t('unspecified_error', 'An unexpected error occurred, please try again'));
              _this.$form.find('.token_input').errorBox(errorText);
            }
            return $('.error_box').filter(':visible').css('z-index', 10);
          }
        });
        this.$form.click(function() {
          return _this.toggleMessageActions(false);
        });
        this.$addForm.submit(function(e) {
          var valid;
          valid = !!(_this.$addForm.find('.token_input li').length);
          if (!valid) {
            e.stopImmediatePropagation();
          }
          return valid;
        });
        this.$addForm.formSubmit({
          disableWhileLoading: true,
          success: function(data) {
            _this.buildMessage(data.messages[0]).prependTo(_this.$messageList).slideDown('fast');
            _this.conversations.updateItems([data]);
            _this.resetMessageForm();
            return _this.$addForm.dialog('close');
          },
          error: function(data) {
            return _this.$addForm.dialog('close');
          }
        });
        this.$forwardForm.submit(function(e) {
          var valid;
          valid = !!(_this.$forwardForm.find('#forward_body').val() && _this.$forwardForm.find('.token_input li').length);
          if (!valid) {
            e.stopImmediatePropagation();
          }
          return valid;
        });
        this.$forwardForm.formSubmit({
          disableWhileLoading: true,
          success: function(data) {
            var conversation;
            conversation = data[0];
            _this.conversations.updateItems([conversation]);
            _this.updateHashData({
              id: conversation.id
            });
            _this.resetMessageForm();
            return _this.$forwardForm.dialog('close');
          },
          error: function(data) {
            return _this.$forwardForm.dialog('close');
          }
        });
        return this.$messageList.click(function(e) {
          var $message;
          if ($(e.target).closest('a.instructure_inline_media_comment').length) {

          } else {
            $message = $(e.target).closest('#messages > ul > li');
            if (!$message.hasClass('generated')) {
              $message.toggleClass('selected');
              $message.find('> :checkbox').attr('checked', $message.hasClass('selected'));
            }
            return _this.toggleMessageActions();
          }
        });
      };

      _Class.prototype.initializeMenus = function() {
        var _this = this;
        $('.menus > li > a').click(function(e) {
          e.preventDefault(e);
          return _this.openMenu($(e.currentTarget));
        }).focus(function(e) {
          return _this.openMenu($(e.currentTarget));
        });
        $(document).bind('mousedown', function(e) {
          if (!$(e.target).closest("span.others").find('> span').length) {
            $('span.others > span').hide();
          }
          if (!$(e.target).closest(".menus > li, #conversation_actions, #conversations .actions").length) {
            return _this.closeMenus();
          }
        });
        this.$menuViews = $('#menu_views');
        this.$menuViewsList = this.$menuViews.parent();
        this.$menuViewsList.find('li a').click(function(e) {
          var scope;
          _this.closeMenus();
          if (scope = $(e.target).closest('li').data('scope')) {
            e.preventDefault();
            return _this.updateHashData({
              scope: scope
            });
          }
        });
        return $('#conversations ul, #create_message_form').delegate('.audience', 'click', function(e) {
          var $others;
          if (($others = $(e.target).closest('span.others').find('> span')).length) {
            if (!$(e.target).closest('span.others > span').length) {
              $('span.others > span').not($others).hide();
              $others.toggle();
              $others.css('left', $others.parent().position().left);
              $others.css('top', $others.parent().height() + $others.parent().position().top);
            }
            return false;
          }
        });
      };

      _Class.prototype.setScope = function(scope) {
        var $item, $items;
        $items = this.$menuViewsList.find('li');
        $items.removeClass('checked');
        $item = $items.filter("[data-scope=" + scope + "]");
        if (!$item.length) {
          $item = $items.filter("[data-scope=inbox]");
        }
        $item.addClass('checked');
        return this.$menuViews.text($item.text());
      };

      _Class.prototype.initializeMessageActions = function() {
        var _this = this;
        $('#message_actions').find('a').click(function(e) {
          return e.preventDefault();
        });
        $('#cancel_bulk_message_action').click(function() {
          return _this.toggleMessageActions(false);
        });
        $('#action_delete').click(function(e) {
          var $selectedMessages, active, message;
          active = _this.conversations.active();
          if (active == null) {
            return;
          }
          $selectedMessages = _this.$messageList.find('.selected');
          message = $selectedMessages.length > 1 ? I18n.t('confirm.delete_messages', "Are you sure you want to delete your copy of these messages? This action cannot be undone.") : I18n.t('confirm.delete_message', "Are you sure you want to delete your copy of this message? This action cannot be undone.");
          if (confirm(message)) {
            $selectedMessages.fadeOut('fast');
            return _this.conversations.action($(e.currentTarget), {
              conversationId: active.id,
              data: {
                remove: (function() {
                  var _i, _len, _results;
                  _results = [];
                  for (_i = 0, _len = $selectedMessages.length; _i < _len; _i++) {
                    message = $selectedMessages[_i];
                    _results.push($(message).data('id'));
                  }
                  return _results;
                })()
              },
              success: function() {
                return _this.toggleMessageActions(false);
              },
              error: function() {
                return $selectedMessages.show();
              }
            });
          }
        });
        return $('#action_forward').click(function(e) {
          var $preview;
          if (_this.conversations.active() == null) {
            return;
          }
          _this.$forwardForm.find("input[name!=authenticity_token], textarea").val('').change();
          $preview = _this.$forwardForm.find('ul.messages').first();
          $preview.html('');
          $preview.html(_this.$messageList.find('> li.selected.forwardable').clone(true).removeAttr('id').removeClass('self'));
          $preview.find('> li').removeClass('selected odd').find('> :checkbox').attr('checked', true).attr('name', 'forwarded_message_ids[]').val(function() {
            return $(this).closest('li').data('id');
          });
          $preview.find('> li').last().addClass('last');
          return _this.$forwardForm.css('max-height', ($(window).height() - 300) + 'px').dialog('close').dialog({
            position: 'center',
            height: 'auto',
            width: 510,
            title: I18n.t('title.forward_messages', 'Forward Messages'),
            buttons: [
              {
                text: I18n.t('buttons.send_message', 'Send'),
                click: function() {
                  return $(this).submit();
                }
              }, {
                text: I18n.t('#buttons.cancel', 'Cancel'),
                click: function() {
                  return $(this).dialog('close');
                }
              }
            ],
            open: function() {
              return _this.$forwardForm.attr({
                action: '/conversations?' + $.param(_this.conversations.baseData())
              });
            },
            close: function() {
              return $('#forward_recipients').data('token_input').$input.blur();
            }
          });
        });
      };

      _Class.prototype.initializeConversationActions = function() {
        var _this = this;
        $('#action_compose_message').click(function(e) {
          e.preventDefault();
          return _this.updateHashData({
            id: null
          });
        });
        return $('#action_add_recipients').click(function(e) {
          e.preventDefault();
          if (_this.conversations.active() == null) {
            return;
          }
          return _this.$addForm.attr('action', _this.conversations.actionUrlFor($(e.currentTarget))).dialog('close').dialog({
            width: 420,
            title: I18n.t('title.add_recipients', 'Add Recipients'),
            buttons: [
              {
                text: I18n.t('buttons.add_people', 'Add People'),
                click: function() {
                  return _this.$addForm.submit();
                }
              }, {
                text: I18n.t('#buttons.cancel', 'Cancel'),
                click: function() {
                  return _this.$addForm.dialog('close');
                }
              }
            ],
            open: function() {
              var tokenInput;
              tokenInput = $('#add_recipients').data('token_input');
              tokenInput.baseExclude = _this.conversations.active().get('audience');
              return _this.$addForm.find("input[name!=authenticity_token]").val('').change();
            },
            close: function() {
              return $('#add_recipients').data('token_input').$input.blur();
            }
          });
        });
      };

      _Class.prototype.initializeTemplates = function() {
        var nextAttachmentIndex,
          _this = this;
        nextAttachmentIndex = 0;
        $('#action_add_attachment').click(function(e) {
          var $attachment;
          e.preventDefault();
          $attachment = $("#attachment_blank").clone(true);
          $attachment.attr('id', null);
          $attachment.find("input[type='file']").attr('name', 'attachments[' + (nextAttachmentIndex++) + ']');
          $('#attachment_list').append($attachment);
          $attachment.slideDown("fast", function() {
            return _this.resize();
          });
          return false;
        });
        $("#attachment_blank a.remove_link").click(function(e) {
          var $attachment;
          e.preventDefault();
          $attachment = $(e.currentTarget).closest(".attachment");
          $attachment.slideUp("fast", function() {
            _this.resize();
            return $attachment.remove();
          });
          return false;
        });
        $('#action_media_comment').click(function(e) {
          e.preventDefault();
          return $("#create_message_form .media_comment").mediaComment('create', 'any', function(id, type) {
            $("#media_comment_id").val(id);
            $("#media_comment_type").val(type);
            $("#create_message_form .media_comment").show();
            return $("#action_media_comment").hide();
          });
        });
        return $('#create_message_form .media_comment a.remove_link').click(function(e) {
          e.preventDefault();
          $("#media_comment_id").val('');
          $("#media_comment_type").val('');
          $("#create_message_form .media_comment").hide();
          return $("#action_media_comment").show();
        });
      };

      _Class.prototype.buildContextInfo = function(data) {
        var contextInfo, match, termInfo;
        match = data.id.match(/^(course|section)_(\d+)$/);
        if (match) {
          termInfo = this.contexts["" + match[1] + "s"][match[2]];
        }
        contextInfo = data.context_name || '';
        contextInfo = contextInfo.length < 40 ? contextInfo : contextInfo.substr(0, 40) + '...';
        if (termInfo != null ? termInfo.term : void 0) {
          contextInfo = contextInfo ? "" + contextInfo + " - " + termInfo.term : termInfo.term;
        }
        if (contextInfo) {
          return $('<span />', {
            "class": 'context_info'
          }).text("(" + contextInfo + ")");
        } else {
          return '';
        }
      };

      _Class.prototype.initializeTokenInputs = function() {
        var buildPopulator, everyoneText, filterInput, noResultsText, placeholderText, selectAllText, tokenInput,
          _this = this;
        buildPopulator = function(pOptions) {
          if (pOptions == null) {
            pOptions = {};
          }
          return function(selector, $node, data, options) {
            var $b, $contextInfo, $img, $name, $span, text;
            if (options == null) {
              options = {};
            }
            data.id = "" + data.id;
            if (data.avatar_url) {
              $img = $('<img class="avatar" />');
              $img.attr('src', data.avatar_url);
              $node.append($img);
            }
            $b = $('<b />');
            $b.text(data.name);
            $name = $('<span />', {
              "class": 'name'
            });
            if (!options.parent) {
              $contextInfo = _this.buildContextInfo(data);
            }
            $name.append($b, $contextInfo);
            $span = $('<span />', {
              "class": 'details'
            });
            if (data.common_courses != null) {
              $span.html(_this.htmlContextList({
                courses: data.common_courses,
                groups: data.common_groups
              }, {
                hardCutoff: 2
              }));
            } else if (data.type && (data.user_count != null)) {
              $span.text(I18n.t('people_count', 'person', {
                count: data.user_count
              }));
            } else if (data.item_count != null) {
              if (data.id.match(/_groups$/)) {
                $span.text(I18n.t('groups_count', 'group', {
                  count: data.item_count
                }));
              } else if (data.id.match(/_sections$/)) {
                $span.text(I18n.t('sections_count', 'section', {
                  count: data.item_count
                }));
              }
            } else if (data.subText) {
              $span.text(data.subText);
            }
            $node.append($name, $span);
            $node.attr('title', data.name);
            text = data.name;
            if (options.parent) {
              if (data.selectAll && data.noExpand) {
                text = options.parent.data('text');
              } else if (data.id.match(/_\d+_/)) {
                text = I18n.beforeLabel(options.parent.data('text')) + " " + text;
              }
            }
            $node.data('text', text);
            $node.data('id', data.type === 'context' || !pOptions.prefixUserIds ? data.id : "user_" + data.id);
            data.rootId = options.ancestors[0];
            $node.data('user_data', data);
            $node.addClass(data.type ? data.type : 'user');
            if (options.level > 0 && selector.options.showToggles) {
              $node.prepend('<a class="toggle"><i></i></a>');
              if (!data.item_count) {
                $node.addClass('toggleable');
              }
            }
            if (data.type === 'context' && !data.noExpand) {
              $node.prepend('<a class="expand"><i></i></a>');
              return $node.addClass('expandable');
            }
          };
        };
        placeholderText = I18n.t('recipient_field_placeholder', "Enter a name, course, or group");
        noResultsText = I18n.t('no_results', 'No results found');
        everyoneText = I18n.t('enrollments_everyone', "Everyone");
        selectAllText = I18n.t('select_all', "Select All");
        $('.recipients').tokenInput({
          placeholder: placeholderText,
          added: function(data, $token, newToken) {
            var $details, currentData, _ref;
            data.id = "" + data.id;
            if (newToken && data.rootId) {
              $token.append("<input type='hidden' name='tags[]' value='" + data.rootId + "'>");
            }
            if (newToken && data.type) {
              $token.addClass(data.type);
              if (data.user_count != null) {
                $token.addClass('details');
                $details = $('<span />');
                $details.text(I18n.t('people_count', 'person', {
                  count: data.user_count
                }));
                $token.append($details);
              }
            }
            if (!data.id.match(/^(course|group)_/)) {
              data = $.extend({}, data);
              delete data.avatar_url;
              currentData = (_ref = _this.userCache[data.id]) != null ? _ref : {};
              return _this.userCache[data.id] = $.extend(currentData, data);
            }
          },
          selector: {
            messages: {
              noResults: noResultsText
            },
            populator: buildPopulator(),
            limiter: function(options) {
              if (options.level > 0) {
                return -1;
              } else {
                return 5;
              }
            },
            showToggles: true,
            preparer: function(postData, data, parent) {
              var context;
              context = postData.context;
              if (!postData.search && context && data.length > 1) {
                if (context.match(/^(course|section)_\d+$/)) {
                  return data.unshift({
                    id: "" + context + "_all",
                    name: everyoneText,
                    user_count: parent.data('user_data').user_count,
                    type: 'context',
                    avatar_url: parent.data('user_data').avatar_url,
                    selectAll: true
                  });
                } else if (context.match(/^((course|section)_\d+_.*|group_\d+)$/) && !context.match(/^course_\d+_(groups|sections)$/)) {
                  return data.unshift({
                    id: context,
                    name: selectAllText,
                    user_count: parent.data('user_data').user_count,
                    type: 'context',
                    avatar_url: parent.data('user_data').avatar_url,
                    selectAll: true,
                    noExpand: true
                  });
                }
              }
            },
            baseData: {
              synthetic_contexts: 1
            },
            browser: {
              data: {
                per_page: -1,
                type: 'context'
              }
            }
          }
        });
        tokenInput = $('#recipients').data('token_input');
        tokenInput.$fakeInput.css('width', '100%');
        tokenInput.change = function(tokens) {
          var user, _ref;
          if (tokens.length > 1 || ((_ref = tokens[0]) != null ? _ref.match(/^(course|group)_/) : void 0)) {
            if (!_this.$form.find('#group_conversation_info').is(':visible')) {
              _this.$form.find('#group_conversation').attr('checked', false);
            }
            _this.$form.find('#group_conversation_info').show();
            _this.$form.find('#user_note_info').hide();
          } else {
            _this.$form.find('#group_conversation').attr('checked', false);
            _this.$form.find('#group_conversation_info').hide();
            _this.$form.find('#user_note_info').showIf((user = _this.userCache[tokens[0]]) && _this.canAddNotesFor(user));
          }
          return _this.resize();
        };
        this.filterNameMap = {};
        $('#context_tags').tokenInput({
          placeholder: placeholderText,
          added: function(data, $token, newToken) {
            return $token.prevAll().remove();
          },
          tokenWrapBuffer: 80,
          selector: {
            messages: {
              noResults: noResultsText
            },
            populator: buildPopulator({
              prefixUserIds: true
            }),
            limiter: function(options) {
              return 5;
            },
            preparer: function(postData, data, parent) {
              var context, filterText;
              context = postData.context;
              if (!postData.search && context && data.length > 0 && context.match(/^(course|group)_\d+$/)) {
                if (data.length > 1 && context.match(/^course_/)) {
                  data.unshift({
                    id: "" + context + "_all",
                    name: everyoneText,
                    user_count: parent.data('user_data').user_count,
                    type: 'context',
                    avatar_url: parent.data('user_data').avatar_url
                  });
                }
                filterText = context.match(/^course/) ? I18n.t('filter_by_course', 'Fiter by this course') : I18n.t('filter_by_group', 'Fiter by this group');
                return data.unshift({
                  id: context,
                  name: parent.data('text'),
                  type: 'context',
                  avatar_url: parent.data('user_data').avatar_url,
                  subText: filterText,
                  noExpand: true
                });
              }
            },
            baseData: {
              synthetic_contexts: 1,
              types: ['course', 'user', 'group'],
              include_inactive: true
            },
            browser: {
              data: {
                per_page: -1,
                types: ['context']
              }
            }
          }
        });
        filterInput = $('#context_tags').data('token_input');
        return filterInput.change = function(tokenValues) {
          var filters, pair;
          filters = (function() {
            var _i, _len, _ref, _results;
            _ref = filterInput.tokenPairs();
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              pair = _ref[_i];
              this.filterNameMap[pair[0]] = pair[1];
              _results.push(pair[0]);
            }
            return _results;
          }).call(_this);
          return _this.updateHashData({
            filter: filters
          });
        };
      };

      _Class.prototype.initializeConversationsPane = function() {
        return this.conversations = new ConversationsPane(this, this.$conversations);
      };

      _Class.prototype.initializeAutoResize = function() {
        var _this = this;
        $(window).resize(function() {
          return _this.resize(50);
        });
        return this.resize();
      };

      _Class.prototype.currentHashData = function() {
        var data;
        try {
          data = $.parseJSON($.decodeFromHex(location.hash.substring(1))) || {};
        } catch (e) {
          data = {};
        }
        return data;
      };

      _Class.prototype.initializeHashChange = function() {
        var _this = this;
        return $(window).bind('hashchange', function() {
          var data, hash, id;
          hash = location.hash;
          data = _this.currentHashData();
          if (data.filter) {
            data.filter = (function() {
              var _i, _len, _ref, _results;
              _ref = data.filter;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                id = _ref[_i];
                if (this.filterNameMap[id]) {
                  _results.push(id);
                }
              }
              return _results;
            }).call(_this);
            if (!data.filter.length) {
              return _this.updateHashData({
                filter: null
              });
            }
          }
          _this.setScope(data.scope);
          return _this.conversations.updateView(data);
        }).triggerHandler('hashchange');
      };

      return _Class;

    })();
  });

}).call(this);
