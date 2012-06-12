(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  define(['use!vendor/backbone', 'underscore'], function(Backbone, _) {
    Backbone.View = (function(_super) {

      __extends(View, _super);

      View.name = 'View';

      function View() {
        this.renderView = __bind(this.renderView, this);
        return View.__super__.constructor.apply(this, arguments);
      }

      View.prototype.views = false;

      View.prototype.render = function(opts) {
        if (opts == null) {
          opts = {};
        }
        if (this.options.views) {
          this.renderViews();
        }
        if (opts.noFilter !== true) {
          this.filter();
        }
        return this;
      };

      View.prototype.filter = function() {
        var _this = this;
        return this.$('[data-bind]').each(function() {
          return _this.createBinding.apply(_this, arguments);
        });
      };

      View.prototype.renderViews = function() {
        return _.each(this.options.views, this.renderView);
      };

      View.prototype.renderView = function(view, className) {
        var target;
        target = this.$('.' + className).first();
        view.$el = target;
        view.el = target[0];
        view.delegateEvents();
        return view.render();
      };

      View.prototype.createBinding = function(index, el) {
        var $el, attribute,
          _this = this;
        $el = $(el);
        attribute = $el.data('bind');
        return this.model.bind("change:" + attribute, function(model, value) {
          return $el.html(value);
        });
      };

      View.mixin = function() {
        var key, mixin, mixins, prop, _i, _len;
        mixins = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        for (_i = 0, _len = mixins.length; _i < _len; _i++) {
          mixin = mixins[_i];
          for (key in mixin) {
            prop = mixin[key];
            if (key === 'events') {
              _.extend(this.prototype[key], prop);
            } else {
              this.prototype[key] = prop;
            }
          }
        }
        return this;
      };

      return View;

    })(Backbone.View);
    return Backbone.View;
  });

}).call(this);
