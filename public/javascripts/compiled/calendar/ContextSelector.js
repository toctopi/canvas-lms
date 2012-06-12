(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['jquery', 'underscore', 'jst/calendar/contextSelector', 'jst/calendar/contextSelectorItem', 'compiled/fn/preventDefault'], function($, _, contextSelectorTemplate, contextSelectorItemTemplate, preventDefault) {
    var ContextSelector, ContextSelectorItem;
    ContextSelectorItem = (function() {

      ContextSelectorItem.name = 'ContextSelectorItem';

      function ContextSelectorItem(context) {
        this.context = context;
        this.sectionChange = __bind(this.sectionChange, this);

        this.setState = __bind(this.setState, this);

        this.change = __bind(this.change, this);

        this.toggleSections = __bind(this.toggleSections, this);

        this.state = 'off';
        this.locked = false;
      }

      ContextSelectorItem.prototype.render = function($list) {
        this.$listItem = $(contextSelectorItemTemplate(this.context));
        this.$listItem.appendTo($list);
        this.$sectionsList = this.$listItem.find('.ag_sections');
        this.$listItem.find('.ag_sections_toggle').click(preventDefault(this.toggleSections));
        this.$contentCheckbox = this.$listItem.find('[name="context_codes[]"]');
        this.$contentCheckbox.change(preventDefault(this.change));
        this.$sectionCheckboxes = this.$listItem.find('[name="sections[]"]');
        return this.$sectionCheckboxes.change(this.sectionChange);
      };

      ContextSelectorItem.prototype.toggleSections = function(jsEvent) {
        $(jsEvent.target).toggleClass('ag-sections-expanded');
        return this.$sectionsList.toggleClass('hidden');
      };

      ContextSelectorItem.prototype.change = function() {
        var newState;
        newState = (function() {
          switch (this.state) {
            case 'off':
              return 'on';
            case 'on':
              return 'off';
            case 'partial':
              return 'on';
          }
        }).call(this);
        return this.setState(newState);
      };

      ContextSelectorItem.prototype.setState = function(state) {
        var checked;
        if (this.locked) {
          return;
        }
        this.state = state;
        switch (this.state) {
          case 'on':
          case 'off':
            checked = this.state === 'on';
            this.$contentCheckbox.prop('checked', checked);
            this.$contentCheckbox.prop('indeterminate', false);
            this.$sectionCheckboxes.prop('checked', checked);
            break;
          case 'partial':
            this.$contentCheckbox.prop('checked', true);
            this.$contentCheckbox.prop('indeterminate', true);
        }
        return $.publish('/contextSelector/changed');
      };

      ContextSelectorItem.prototype.sectionChange = function() {
        switch (this.$sectionCheckboxes.filter(':checked').length) {
          case 0:
            return this.setState('off');
          case this.$sectionCheckboxes.length:
            return this.setState('on');
          default:
            return this.setState('partial');
        }
      };

      ContextSelectorItem.prototype.disable = function() {
        this.$contentCheckbox.prop('disabled', true);
        return this.disableSections();
      };

      ContextSelectorItem.prototype.disableSections = function() {
        return this.$sectionCheckboxes.prop('disabled', true);
      };

      ContextSelectorItem.prototype.lock = function() {
        this.locked = true;
        this.disable();
        return this.disableSections();
      };

      ContextSelectorItem.prototype.isChecked = function() {
        return this.state !== 'off';
      };

      ContextSelectorItem.prototype.sections = function() {
        var checked;
        checked = this.$sectionCheckboxes.filter(':checked');
        if (checked.length === this.$sectionCheckboxes.length) {
          return [];
        } else {
          return _.map(checked, function(cb) {
            return cb.value;
          });
        }
      };

      return ContextSelectorItem;

    })();
    return ContextSelector = (function() {

      ContextSelector.name = 'ContextSelector';

      function ContextSelector(selector, apptGroup, contexts, contextsChangedCB, closeCB) {
        var $contextsList, c, context, contextCode, contextsBySubContext, item, section, subContextCode, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3, _ref4, _ref5,
          _this = this;
        this.apptGroup = apptGroup;
        this.contexts = contexts;
        this.$menu = $(selector).html(contextSelectorTemplate());
        $contextsList = this.$menu.find('.ag-contexts');
        $.subscribe('/contextSelector/changed', function() {
          return contextsChangedCB(_this.selectedContexts(), _this.selectedSections());
        });
        this.contextSelectorItems = {};
        _ref = this.contexts;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          c = _ref[_i];
          item = new ContextSelectorItem(c);
          item.render($contextsList);
          this.contextSelectorItems[item.context.asset_string] = item;
        }
        _ref1 = this.apptGroup.context_codes;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          contextCode = _ref1[_j];
          if (!this.contextSelectorItems[contextCode]) {
            continue;
          }
          this.contextSelectorItems[contextCode].setState('on');
          this.contextSelectorItems[contextCode].lock();
        }
        if (this.apptGroup.sub_context_codes.length > 0) {
          if (this.apptGroup.sub_context_codes[0].match(/^group_category_/)) {
            _ref2 = this.contextSelectorItems;
            for (c in _ref2) {
              item = _ref2[c];
              item.lock();
            }
          } else {
            contextsBySubContext = {};
            _ref3 = this.contexts;
            for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
              c = _ref3[_k];
              _ref4 = c.course_sections;
              for (_l = 0, _len3 = _ref4.length; _l < _len3; _l++) {
                section = _ref4[_l];
                contextsBySubContext[section.asset_string] = c.asset_string;
              }
            }
            _ref5 = this.apptGroup.sub_context_codes;
            for (_m = 0, _len4 = _ref5.length; _m < _len4; _m++) {
              subContextCode = _ref5[_m];
              $("[value='" + subContextCode + "']").prop('checked', true);
              context = contextsBySubContext[subContextCode];
              item = this.contextSelectorItems[context];
              item.sectionChange();
              item.lock();
            }
          }
        }
        $('.ag_contexts_done').click(preventDefault(closeCB));
        contextsChangedCB(this.selectedContexts(), this.selectedSections());
      }

      ContextSelector.prototype.selectedContexts = function() {
        var contexts;
        contexts = _.chain(this.contextSelectorItems).values().filter(function(c) {
          return c.state !== 'off';
        }).map(function(c) {
          return c.context.asset_string;
        }).value();
        return contexts;
      };

      ContextSelector.prototype.selectedSections = function() {
        var sections;
        sections = _.chain(this.contextSelectorItems).values().map(function(c) {
          return c.sections();
        }).reject(function(ss) {
          return ss.length === 0;
        }).flatten().value();
        return sections;
      };

      return ContextSelector;

    })();
  });

}).call(this);
