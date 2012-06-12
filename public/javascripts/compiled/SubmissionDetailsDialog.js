(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['i18n!submission_details_dialog', 'jquery', 'jst/SubmissionDetailsDialog', 'jst/_submission_detail', 'jst/_turnitinScore', 'jquery.ajaxJSON', 'jquery.disableWhileLoading', 'jquery.instructure_forms', 'jqueryui/dialog', 'jquery.instructure_misc_plugins', 'vendor/jquery.scrollTo'], function(I18n, $, submissionDetailsDialog) {
    var SubmissionDetailsDialog;
    return SubmissionDetailsDialog = (function() {

      SubmissionDetailsDialog.name = 'SubmissionDetailsDialog';

      function SubmissionDetailsDialog(assignment, student, options) {
        var deferred,
          _this = this;
        this.assignment = assignment;
        this.student = student;
        this.options = options;
        this.update = __bind(this.update, this);

        this.scrollCommentsToBottom = __bind(this.scrollCommentsToBottom, this);

        this.open = __bind(this.open, this);

        this.url = this.options.change_grade_url.replace(":assignment", this.assignment.id).replace(":submission", this.student.id);
        this.submission = $.extend({}, this.student["assignment_" + this.assignment.id], {
          assignment: this.assignment,
          speedGraderUrl: "" + this.options.context_url + "/gradebook/speed_grader?assignment_id=" + this.assignment.id + "#%7B%22student_id%22%3A" + this.student.id + "%7D",
          loading: true
        });
        this.dialog = $('<div class="use-css-transitions-for-show-hide" style="padding:0;"/>');
        this.dialog.html(submissionDetailsDialog(this.submission)).dialog({
          title: this.student.name,
          width: 600,
          resizable: false,
          open: this.scrollCommentsToBottom
        }).delegate('select', 'change', function(event) {
          return _this.dialog.find('.submission_detail').each(function(index) {
            return $(this).showIf(index === event.currentTarget.selectedIndex);
          });
        }).delegate('.submission_details_add_comment_form', 'submit', function(event) {
          event.preventDefault();
          return $(event.currentTarget).disableWhileLoading($.ajaxJSON(_this.url, 'PUT', $(event.currentTarget).getFormData(), function(data) {
            _this.update(data);
            return setTimeout(function() {
              return _this.dialog.dialog('close');
            }, 500);
          }));
        });
        deferred = $.ajaxJSON(this.url + '?include[]=submission_history&include[]=submission_comments&include[]=rubric_assessment', 'GET', {}, this.update);
        this.dialog.find('.submission_details_comments').disableWhileLoading(deferred);
      }

      SubmissionDetailsDialog.prototype.open = function() {
        return this.dialog.dialog('open');
      };

      SubmissionDetailsDialog.prototype.scrollCommentsToBottom = function() {
        return this.dialog.find('.submission_details_comments').scrollTop(999999);
      };

      SubmissionDetailsDialog.prototype.update = function(newData) {
        var attachment, comment, submission, turnitinDataForThisAttachment, urlPrefix, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3;
        $.extend(this.submission, newData);
        this.submission.submission_history[0] = this.submission;
        this.submission.moreThanOneSubmission = this.submission.submission_history.length > 1;
        this.submission.loading = false;
        _ref = this.submission.submission_history;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          submission = _ref[_i];
          submission["submission_type_is" + submission.submission_type] = true;
          submission.submissionWasLate = this.assignment.due_at && new Date(this.assignment.due_at) > new Date(submission.submitted_at);
          _ref1 = submission.submission_comments || [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            comment = _ref1[_j];
            comment.url = "" + this.options.context_url + "/users/" + comment.author_id;
            urlPrefix = "" + location.protocol + "//" + location.host;
            comment.image_url = "" + urlPrefix + "/images/users/" + comment.author_id + "?fallback=" + (encodeURIComponent(urlPrefix + '/images/messages/avatar-50.png'));
          }
          _ref2 = submission.attachments || [];
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            attachment = _ref2[_k];
            if (turnitinDataForThisAttachment = (_ref3 = submission.turnitin_data) != null ? _ref3["attachment_" + attachment.id] : void 0) {
              if (turnitinDataForThisAttachment["similarity_score"]) {
                attachment.turnitin_data = turnitinDataForThisAttachment;
                attachment.turnitin_data.state = "" + (turnitinDataForThisAttachment.state || 'no') + "_score";
                attachment.turnitin_data.score = "" + turnitinDataForThisAttachment.similarity_score + "%";
                attachment.turnitin_data.reportUrl = "" + this.options.context_url + "/assignments/" + this.assignment.id + "/submissions/" + this.student.id + "/turnitin/attachment_" + attachment.id;
                attachment.turnitin_data.tooltip = I18n.t('turnitin.tooltip.score', 'Turnitin Similarity Score - See detailed report');
              }
            }
          }
        }
        this.dialog.html(submissionDetailsDialog(this.submission));
        this.dialog.find('select').trigger('change');
        return this.scrollCommentsToBottom();
      };

      SubmissionDetailsDialog.cachedDialogs = {};

      SubmissionDetailsDialog.open = function(assignment, student, options) {
        var _base, _name;
        return ((_base = SubmissionDetailsDialog.cachedDialogs)[_name = "" + assignment.id + "-" + student.id] || (_base[_name] = new SubmissionDetailsDialog(assignment, student, options))).open();
      };

      return SubmissionDetailsDialog;

    })();
  });

}).call(this);
