(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(['Backbone', 'jquery.ajaxJSON', 'jquery.disableWhileLoading'], function(Backbone) {
    var Conversation;
    return Conversation = (function(_super) {

      __extends(Conversation, _super);

      Conversation.name = 'Conversation';

      function Conversation() {
        return Conversation.__super__.constructor.apply(this, arguments);
      }

      Conversation.prototype.defaults = {
        audience: []
      };

      Conversation.prototype.inboxAction = function(options) {
        var ajaxRequest, defaults, _ref,
          _this = this;
        defaults = {
          method: 'POST',
          success: function(data) {
            return _this.list.updateItem(data);
          }
        };
        options = $.extend(true, {}, defaults, options);
        options.data = $.extend(this.list.baseData(), (_ref = options.data) != null ? _ref : {});
        ajaxRequest = $.ajaxJSON(options.url, options.method, options.data, function(data) {
          if (typeof options.success === "function") {
            options.success(data);
          }
          return _this.list.updateItem(data);
        });
        return this.list.$item(this.id).disableWhileLoading(ajaxRequest);
      };

      Conversation.prototype.url = function(action) {
        if (action == null) {
          action = '';
        }
        return "/conversations/" + this.id + "/" + action + "?" + ($.param(this.list.baseData()));
      };

      return Conversation;

    })(Backbone.Model);
  });

}).call(this);
