(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['jquery', 'jquery.ui.menu.inputmenu', 'vendor/jquery.ui.popup-1.9', 'vendor/jquery.ui.button-1.9'], function($, _inputmenu, _popup, _button) {
    var KyleMenu;
    KyleMenu = (function() {

      KyleMenu.name = 'KyleMenu';

      function KyleMenu(trigger, options) {
        this.keepButtonActive = __bind(this.keepButtonActive, this);

        this.onClose = __bind(this.onClose, this);

        this.close = __bind(this.close, this);

        this.onOpen = __bind(this.onOpen, this);

        var popupInstance, self, _open,
          _this = this;
        this.$trigger = $(trigger).data('kyleMenu', this);
        this.opts = $.extend(true, {}, KyleMenu.defaults, options);
        if (!this.opts.noButton) {
          this.$trigger.button(this.opts.buttonOpts);
          this.$trigger.bind('mouseleave.button', this.keepButtonActive);
        }
        this.$menu = this.$trigger.next().menu(this.opts.menuOpts).popup(this.opts.popupOpts).addClass("ui-kyle-menu use-css-transitions-for-show-hide");
        if (this.opts.appendMenuTo) {
          popupInstance = this.$menu.data('popup');
          _open = popupInstance.open;
          self = this;
          popupInstance.open = function() {
            self.$menu.appendTo(self.opts.appendMenuTo);
            return _open.apply(this, arguments);
          };
          this.$placeholder = $('<span style="display:none;">').insertAfter(this.$menu);
          this.$menu.bind('click', function() {
            var _ref;
            return (_ref = _this.$placeholder).trigger.apply(_ref, arguments);
          });
        }
        this.$menu.bind({
          menuselect: this.close,
          popupopen: this.onOpen,
          popupclose: this.onClose
        });
      }

      KyleMenu.prototype.onOpen = function(event) {
        this.adjustCarat(event);
        return this.$menu.addClass('ui-state-open');
      };

      KyleMenu.prototype.open = function() {
        return this.$menu.popup('open');
      };

      KyleMenu.prototype.close = function() {
        return this.$menu.popup('close').removeClass("ui-state-open");
      };

      KyleMenu.prototype.onClose = function() {
        if (this.opts.appendMenuTo) {
          this.$menu.insertBefore(this.$placeholder);
        }
        this.$trigger.removeClass('ui-state-active');
        return this.$menu.removeClass("ui-state-open");
      };

      KyleMenu.prototype.keepButtonActive = function() {
        if (this.$menu.is('.ui-state-open')) {
          return this.$trigger.addClass('ui-state-active');
        }
      };

      KyleMenu.prototype.adjustCarat = function(event) {
        var actualOffset, caratOffset, differenceInOffset, triggerWidth, _ref;
        if ((_ref = this.$carat) != null) {
          _ref.remove();
        }
        this.$trigger.addClass('ui-state-active');
        triggerWidth = this.$trigger.outerWidth();
        differenceInOffset = this.$trigger.offset().left - this.$menu.offset().left;
        actualOffset = event.pageX - this.$trigger.offset().left;
        caratOffset = Math.min(Math.max(6, actualOffset), triggerWidth - 6) + differenceInOffset;
        this.$carat = $('<span class="ui-menu-carat"><span /></span>').css('left', caratOffset).prependTo(this.$menu);
        return this.$menu.css('-webkit-transform-origin-x', caratOffset + 'px');
      };

      KyleMenu.defaults = {
        popupOpts: {
          position: {
            my: 'center top',
            at: 'center bottom',
            offset: '0 10px',
            within: '#main',
            collision: 'fit'
          }
        },
        buttonOpts: {
          icons: {
            primary: "ui-icon-home",
            secondary: "ui-icon-droparrow"
          }
        }
      };

      return KyleMenu;

    })();
    $.fn.kyleMenu = function(options) {
      return this.each(function() {
        if (!$(this).data().kyleMenu) {
          return new KyleMenu(this, options);
        }
      });
    };
    $(document).delegate('.al-trigger', 'click', function(event) {
      var $trigger, defaults, opts;
      $trigger = $(this);
      defaults = {
        buttonOpts: {
          icons: {
            primary: null,
            secondary: null
          }
        }
      };
      if (!$trigger.data('kyleMenu')) {
        event.preventDefault();
        opts = $.extend(defaults, $trigger.data('kyleMenuOptions'));
        return new KyleMenu($trigger, opts).open();
      }
    });
    return KyleMenu;
  });

}).call(this);
