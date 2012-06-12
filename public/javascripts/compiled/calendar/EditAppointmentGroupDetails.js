(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['jquery', 'underscore', 'i18n!EditAppointmentGroupDetails', 'compiled/calendar/TimeBlockList', 'jst/calendar/editAppointmentGroup', 'jst/calendar/genericSelect', 'jst/calendar/sectionCheckboxes', 'compiled/calendar/ContextSelector', 'compiled/fn/preventDefault', 'jquery.ajaxJSON', 'jquery.disableWhileLoading', 'jquery.instructure_forms'], function($, _, I18n, TimeBlockList, editAppointmentGroupTemplate, genericSelectTemplate, sectionCheckboxesTemplate, ContextSelector, preventDefault) {
    var EditAppointmentGroupDetails;
    return EditAppointmentGroupDetails = (function() {

      EditAppointmentGroupDetails.name = 'EditAppointmentGroupDetails';

      function EditAppointmentGroupDetails(selector, apptGroup, contexts, closeCB) {
        var appt, c, maxAppointmentsPerStudent, maxPerStudentCheckbox, maxPerStudentInput, timeBlocks, _i, _len, _ref,
          _this = this;
        this.apptGroup = apptGroup;
        this.contexts = contexts;
        this.closeCB = closeCB;
        this.toggleContextsMenu = __bind(this.toggleContextsMenu, this);

        this.contextsChanged = __bind(this.contextsChanged, this);

        this.save = __bind(this.save, this);

        this.saveClick = __bind(this.saveClick, this);

        this.saveWithoutPublishingClick = __bind(this.saveWithoutPublishingClick, this);

        this.currentContextInfo = null;
        $(selector).html(editAppointmentGroupTemplate({
          title: this.apptGroup.title,
          contexts: this.contexts,
          appointment_group: this.apptGroup
        }));
        this.contextsHash = {};
        _ref = this.contexts;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          c = _ref[_i];
          this.contextsHash[c.asset_string] = c;
        }
        this.form = $(selector).find("form");
        this.contextSelector = new ContextSelector('.ag-menu-container', this.apptGroup, this.contexts, this.contextsChanged, this.toggleContextsMenu);
        if (this.apptGroup.id) {
          this.form.attr('action', this.apptGroup.url);
          this.form.find(".context_id").val(this.apptGroup.context_code).attr('disabled', true);
          this.form.find("select.context_id").change();
          this.disableGroups();
          if (this.apptGroup.participant_type === 'Group') {
            this.form.find(".group-signup-checkbox").prop('checked', true);
            this.form.find(".group_category").val(this.apptGroup.sub_context_codes[0]);
          } else {
            this.form.find(".group-signup-checkbox").prop('checked', false);
          }
        } else {
          this.form.attr('action', '/api/v1/appointment_groups');
        }
        this.form.find('.ag_contexts_selector').click(preventDefault(this.toggleContextsMenu));
        timeBlocks = (function() {
          var _j, _len1, _ref1, _results;
          _ref1 = this.apptGroup.appointmentEvents || [];
          _results = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            appt = _ref1[_j];
            _results.push([appt.start, appt.end, true]);
          }
          return _results;
        }).call(this);
        this.timeBlockList = new TimeBlockList(this.form.find(".time-block-list-body"), this.form.find(".splitter"), timeBlocks);
        this.form.find('[name="slot_duration"]').change(function(e) {
          if (_this.form.find('[name="autosplit_option"]').is(":checked")) {
            _this.timeBlockList.split(e.target.value);
            return _this.timeBlockList.render();
          }
        });
        this.form.find('[name="participant_visibility"]').prop('checked', this.apptGroup.participant_visibility === 'protected');
        this.form.find(".group-signup-checkbox").change(function(jsEvent) {
          var checked;
          checked = !!jsEvent.target.checked;
          _this.form.find('.per_appointment_groups_label').toggle(checked);
          _this.form.find('.per_appointment_users_label').toggle(!checked);
          return _this.form.find(".group-signup").toggle(checked);
        });
        this.form.find(".group-signup-checkbox").change();
        this.form.find('[name="per_slot_option"]').change(function(jsEvent) {
          var checkbox, input;
          checkbox = jsEvent.target;
          input = _this.form.find('[name="participants_per_appointment"]');
          if (checkbox.checked) {
            input.attr('disabled', false);
            if (input.val() === '') {
              return input.val('1');
            }
          } else {
            return input.attr('disabled', true);
          }
        });
        if (this.apptGroup.participants_per_appointment > 0) {
          this.form.find('[name="per_slot_option"]').prop('checked', true);
          this.form.find('[name="participants_per_appointment"]').val(this.apptGroup.participants_per_appointment);
        } else {
          this.form.find('[name="participants_per_appointment"]').attr('disabled', true);
        }
        maxPerStudentInput = this.form.find('[name="max_appointments_per_participant"]');
        maxAppointmentsPerStudent = this.apptGroup.max_appointments_per_participant || 1;
        maxPerStudentInput.val(maxAppointmentsPerStudent);
        maxPerStudentCheckbox = this.form.find('#max-per-student-option');
        maxPerStudentCheckbox.change(function() {
          return maxPerStudentInput.prop('disabled', !maxPerStudentCheckbox.prop('checked'));
        });
        if (maxAppointmentsPerStudent > 0) {
          maxPerStudentCheckbox.prop('checked', true);
        } else {
          maxPerStudentInput.attr('disabled', true);
        }
        if (this.apptGroup.workflow_state === 'active') {
          this.form.find("#appointment-blocks-active-button").attr('disabled', true).prop('checked', true);
        }
      }

      EditAppointmentGroupDetails.prototype.saveWithoutPublishingClick = function(jsEvent) {
        jsEvent.preventDefault();
        return this.save(false);
      };

      EditAppointmentGroupDetails.prototype.saveClick = function(jsEvent) {
        jsEvent.preventDefault();
        return this.save(true);
      };

      EditAppointmentGroupDetails.prototype.save = function(publish) {
        var contextCodes, create, data, deferred, method, onError, onSuccess, params, range, sections, _i, _len, _ref,
          _this = this;
        data = this.form.getFormData({
          object_name: 'appointment_group'
        });
        create = this.apptGroup.id === void 0;
        params = {
          'appointment_group[title]': data.title,
          'appointment_group[description]': data.description,
          'appointment_group[location_name]': data.location
        };
        if (data.max_appointments_per_participant_option) {
          if (data.max_appointments_per_participant < 1) {
            $('[name="max_appointments_per_participant"]').errorBox(I18n.t('bad_max_appts', 'You must allow at least one appointment per participant'));
            return false;
          } else {
            params['appointment_group[max_appointments_per_participant]'] = data.max_appointments_per_participant;
          }
        } else {
          params['appointment_group[max_appointments_per_participant]'] = "";
        }
        params['appointment_group[new_appointments]'] = [];
        if (!this.timeBlockList.validate()) {
          return false;
        }
        _ref = this.timeBlockList.blocks();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          range = _ref[_i];
          params['appointment_group[new_appointments]'].push([$.dateToISO8601UTC($.unfudgeDateForProfileTimezone(range[0])), $.dateToISO8601UTC($.unfudgeDateForProfileTimezone(range[1]))]);
        }
        if (data.per_slot_option === '1' && data.participants_per_appointment) {
          params['appointment_group[participants_per_appointment]'] = data.participants_per_appointment;
        }
        if (publish && this.apptGroup.workflow_state !== 'active') {
          params['appointment_group[publish]'] = '1';
        }
        params['appointment_group[participant_visibility]'] = data.participant_visibility === '1' ? 'protected' : 'private';
        delete data['context_codes[]'];
        delete data['sections[]'];
        contextCodes = this.contextSelector.selectedContexts();
        if (contextCodes.length === 0) {
          $('.ag_contexts_selector').errorBox(I18n.t('context_required', 'You need to select a calendar'));
          return;
        } else {
          params['appointment_group[context_codes]'] = contextCodes;
        }
        if (create) {
          if (data.use_group_signup === '1' && data.group_category_id) {
            params['appointment_group[sub_context_codes]'] = [data.group_category_id];
          } else {
            sections = this.contextSelector.selectedSections();
            if (sections) {
              params['appointment_group[sub_context_codes]'] = sections;
            }
          }
          params['appointment_group[min_appointments_per_participant]'] = 1;
        }
        onSuccess = function() {
          return _this.closeCB(true);
        };
        onError = function() {};
        method = this.apptGroup.id ? 'PUT' : 'POST';
        deferred = $.ajaxJSON(this.form.attr('action'), method, params, onSuccess, onError);
        return this.form.disableWhileLoading(deferred);
      };

      EditAppointmentGroupDetails.prototype.contextsChanged = function(contextCodes, sectionCodes) {
        var context, contextCode, section, sectionCode, text, _ref;
        if (sectionCodes.length === 0 && contextCodes.length === 0) {
          this.form.find('.ag_contexts_selector').text(I18n.t('select_calendars', 'Select Calendars'));
        } else {
          if (contextCodes.length > 0) {
            contextCode = contextCodes[0];
            text = this.contextsHash[contextCode].name;
            if (contextCodes.length > 1) {
              text += I18n.t('and_n_contexts', ' and %{n} others', {
                n: contextCodes.length - 1
              });
            }
            this.form.find('.ag_contexts_selector').text(text);
          }
          if (sectionCodes.length > 0) {
            sectionCode = sectionCodes[0];
            section = _.chain(this.contexts).pluck('course_sections').flatten().find(function(s) {
              return s.asset_string === sectionCode;
            }).value();
            text = section.name;
            if (sectionCodes.length > 1) {
              text += I18n.t('and_n_sectionCodes', ' and %{n} others', {
                n: sectionCodes.length - 1
              });
            }
            this.form.find('.ag_contexts_selector').text(text);
          }
        }
        context = this.contextsHash[contextCodes[0]];
        if (contextCodes.length === 1 && sectionCodes.length === 0 && ((_ref = context.group_categories) != null ? _ref.length : void 0) > 0) {
          this.enableGroups(context);
          if (this.apptGroup.sub_context_codes.length > 0) {
            return this.form.find('[name=group_category_id]').prop('disabled', true);
          }
        } else {
          return this.disableGroups();
        }
      };

      EditAppointmentGroupDetails.prototype.disableGroups = function() {
        this.form.find(".group-signup-checkbox").attr('disabled', true);
        return this.form.find("group-signup").hide();
      };

      EditAppointmentGroupDetails.prototype.enableGroups = function(contextInfo) {
        var groupsInfo;
        this.form.find(".group-signup-checkbox").attr('disabled', false);
        groupsInfo = {
          cssClass: 'group_category',
          name: 'group_category_id',
          collection: contextInfo.group_categories
        };
        this.form.find(".group_select").html(genericSelectTemplate(groupsInfo));
        return this.form.find("group-signup").show();
      };

      EditAppointmentGroupDetails.prototype.toggleContextsMenu = function(jsEvent) {
        return $('.ag_contexts_menu').toggleClass('hidden');
      };

      return EditAppointmentGroupDetails;

    })();
  });

}).call(this);
