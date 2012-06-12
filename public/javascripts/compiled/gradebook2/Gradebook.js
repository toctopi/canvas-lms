(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['i18n!gradebook2', 'compiled/gradebook2/GRADEBOOK_TRANSLATIONS', 'jquery', 'underscore', 'compiled/grade_calculator', 'compiled/userSettings', 'vendor/spin', 'compiled/multi_grid', 'compiled/SubmissionDetailsDialog', 'compiled/gradebook2/AssignmentGroupWeightsDialog', 'compiled/gradebook2/SubmissionCell', 'compiled/gradebook2/GradebookHeaderMenu', 'str/htmlEscape', 'jst/gradebook_uploads_form', 'jst/gradebook2/section_to_show_menu', 'jst/gradebook2/column_header', 'jst/gradebook2/group_total_cell', 'jst/gradebook2/row_student_name', 'jst/_avatar', 'jquery.ajaxJSON', 'jquery.instructure_date_and_time', 'jqueryui/dialog', 'jquery.instructure_misc_helpers', 'jquery.instructure_misc_plugins', 'vendor/jquery.ba-tinypubsub', 'jqueryui/mouse', 'jqueryui/position', 'jqueryui/sortable', 'compiled/jquery.kylemenu', 'compiled/jquery/fixDialogButtons'], function(I18n, GRADEBOOK_TRANSLATIONS, $, _, GradeCalculator, userSettings, Spinner, MultiGrid, SubmissionDetailsDialog, AssignmentGroupWeightsDialog, SubmissionCell, GradebookHeaderMenu, htmlEscape, gradebook_uploads_form, sectionToShowMenuTemplate, columnHeaderTemplate, groupTotalCellTemplate, rowStudentNameTemplate) {
    var Gradebook;
    return Gradebook = (function() {
      var columnWidths;

      Gradebook.name = 'Gradebook';

      columnWidths = {
        assignment: {
          min: 10,
          max: 200
        },
        assignmentGroup: {
          min: 35,
          max: 200
        },
        total: {
          min: 85,
          max: 100
        }
      };

      function Gradebook(options) {
        var promise,
          _this = this;
        this.options = options;
        this.initGrid = __bind(this.initGrid, this);

        this.initHeader = __bind(this.initHeader, this);

        this.hoverMinimizedCell = __bind(this.hoverMinimizedCell, this);

        this.unminimizeColumn = __bind(this.unminimizeColumn, this);

        this.minimizeColumn = __bind(this.minimizeColumn, this);

        this.fixColumnReordering = __bind(this.fixColumnReordering, this);

        this.unhighlightColumns = __bind(this.unhighlightColumns, this);

        this.highlightColumn = __bind(this.highlightColumn, this);

        this.calculateStudentGrade = __bind(this.calculateStudentGrade, this);

        this.groupTotalFormatter = __bind(this.groupTotalFormatter, this);

        this.staticCellFormatter = __bind(this.staticCellFormatter, this);

        this.cellFormatter = __bind(this.cellFormatter, this);

        this.updateSubmissionsFromExternal = __bind(this.updateSubmissionsFromExternal, this);

        this.updateSubmission = __bind(this.updateSubmission, this);

        this.gotSubmissionsChunk = __bind(this.gotSubmissionsChunk, this);

        this.getSubmissionsChunks = __bind(this.getSubmissionsChunks, this);

        this.buildRows = __bind(this.buildRows, this);

        this.handleAssignmentMutingChange = __bind(this.handleAssignmentMutingChange, this);

        this.rowFilter = __bind(this.rowFilter, this);

        this.columnSortFn = __bind(this.columnSortFn, this);

        this.arrangeColumnsBy = __bind(this.arrangeColumnsBy, this);

        this.gotChunkOfStudents = __bind(this.gotChunkOfStudents, this);

        this.gotSections = __bind(this.gotSections, this);

        this.gotAssignmentGroups = __bind(this.gotAssignmentGroups, this);

        this.chunk_start = 0;
        this.students = {};
        this.rows = [];
        this.studentsPage = 1;
        this.sortFn = function(student) {
          return student.sortable_name;
        };
        this.assignmentsToHide = userSettings.contextGet('hidden_columns') || [];
        this.sectionToShow = userSettings.contextGet('grading_show_only_section');
        this.show_attendance = userSettings.contextGet('show_attendance');
        this.include_ungraded_assignments = userSettings.contextGet('include_ungraded_assignments');
        $.subscribe('assignment_group_weights_changed', this.buildRows);
        $.subscribe('assignment_muting_toggled', this.handleAssignmentMutingChange);
        $.subscribe('submissions_updated', this.updateSubmissionsFromExternal);
        promise = $.when($.ajaxJSON(this.options.students_url, "GET"), $.ajaxJSON(this.options.assignment_groups_url, "GET", {}, this.gotAssignmentGroups), $.ajaxJSON(this.options.sections_url, "GET", {}, this.gotSections)).then(function(_arg) {
          var status, students, xhr;
          students = _arg[0], status = _arg[1], xhr = _arg[2];
          return _this.gotChunkOfStudents(students, xhr);
        });
        this.spinner = new Spinner();
        $(this.spinner.spin().el).css({
          opacity: 0.5,
          top: '50%',
          left: '50%'
        }).addClass('use-css-transitions-for-show-hide').appendTo('#main');
      }

      Gradebook.prototype.gotAssignmentGroups = function(assignmentGroups) {
        var assignment, group, _i, _len, _results;
        this.assignmentGroups = {};
        this.assignments = {};
        new AssignmentGroupWeightsDialog({
          context: this.options,
          assignmentGroups: assignmentGroups
        });
        _results = [];
        for (_i = 0, _len = assignmentGroups.length; _i < _len; _i++) {
          group = assignmentGroups[_i];
          htmlEscape(group);
          this.assignmentGroups[group.id] = group;
          _results.push((function() {
            var _j, _len1, _ref, _results1;
            _ref = group.assignments;
            _results1 = [];
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              assignment = _ref[_j];
              htmlEscape(assignment);
              assignment.assignment_group = group;
              if (assignment.due_at) {
                assignment.due_at = $.parseFromISO(assignment.due_at);
              }
              _results1.push(this.assignments[assignment.id] = assignment);
            }
            return _results1;
          }).call(this));
        }
        return _results;
      };

      Gradebook.prototype.gotSections = function(sections) {
        var section, _i, _len;
        this.sections = {};
        for (_i = 0, _len = sections.length; _i < _len; _i++) {
          section = sections[_i];
          htmlEscape(section);
          this.sections[section.id] = section;
        }
        return this.sections_enabled = sections.length > 1;
      };

      Gradebook.prototype.gotChunkOfStudents = function(studentEnrollments, xhr) {
        var link, student, studentEnrollment, _base, _base1, _i, _len, _name;
        for (_i = 0, _len = studentEnrollments.length; _i < _len; _i++) {
          studentEnrollment = studentEnrollments[_i];
          student = studentEnrollment.user;
          student.enrollment = studentEnrollment;
          (_base = this.students)[_name = student.id] || (_base[_name] = htmlEscape(student));
          (_base1 = this.students[student.id]).sections || (_base1.sections = []);
          this.students[student.id].sections.push(studentEnrollment.course_section_id);
        }
        link = xhr.getResponseHeader('Link');
        if (link && link.match(/rel="next"/)) {
          this.studentsPage += 1;
          return $.ajaxJSON(this.options.students_url, "GET", {
            "page": this.studentsPage
          }, this.gotChunkOfStudents);
        } else {
          return this.gotAllStudents();
        }
      };

      Gradebook.prototype.gotAllStudents = function() {
        var assignment, id, sectionId, sectionNames, student, _name, _ref, _ref1;
        _ref = this.students;
        for (id in _ref) {
          student = _ref[id];
          student.computed_current_score || (student.computed_current_score = 0);
          student.computed_final_score || (student.computed_final_score = 0);
          student.secondary_identifier = student.sis_login_id || student.login_id;
          if (this.sections_enabled) {
            sectionNames = $.toSentence(((function() {
              var _i, _len, _ref1, _results;
              _ref1 = student.sections;
              _results = [];
              for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                sectionId = _ref1[_i];
                _results.push(this.sections[sectionId].name);
              }
              return _results;
            }).call(this)).sort());
          }
          student.display_name = rowStudentNameTemplate({
            avatar_image_url: student.avatar_url,
            display_name: student.name,
            url: student.enrollment.grades.html_url,
            sectionNames: sectionNames
          });
          _ref1 = this.assignments;
          for (id in _ref1) {
            assignment = _ref1[id];
            student[_name = "assignment_" + id] || (student[_name] = {
              assignment_id: id,
              user_id: student.id
            });
          }
          this.rows.push(student);
        }
        this.initGrid();
        this.buildRows();
        this.getSubmissionsChunks();
        return this.initHeader();
      };

      Gradebook.prototype.arrangeColumnsBy = function(newThingToArrangeBy) {
        var columns;
        if (newThingToArrangeBy && newThingToArrangeBy !== this._sortColumnsBy) {
          this.$columnArrangementTogglers.each(function() {
            return $(this).closest('li').showIf($(this).data('arrangeColumnsBy') !== newThingToArrangeBy);
          });
          this._sortColumnsBy = newThingToArrangeBy;
          userSettings[newThingToArrangeBy === 'due_date' ? 'contextSet' : 'contextRemove']('sort_grade_colums_by', newThingToArrangeBy);
          columns = this.gradeGrid.getColumns();
          columns.sort(this.columnSortFn);
          this.gradeGrid.setColumns(columns);
          this.fixColumnReordering();
          this.buildRows();
        }
        return this._sortColumnsBy || (this._sortColumnsBy = userSettings.contextGet('sort_grade_colums_by') || 'assignment_group');
      };

      Gradebook.prototype.columnSortFn = function(a, b) {
        var aDate, bDate, diffOfAssignmentGroupPosition, diffOfAssignmentPosition, _ref, _ref1;
        if (b.type === 'total_grade') {
          return -1;
        }
        if (a.type === 'total_grade') {
          return 1;
        }
        if (b.type === 'assignment_group' && a.type !== 'assignment_group') {
          return -1;
        }
        if (a.type === 'assignment_group' && b.type !== 'assignment_group') {
          return 1;
        }
        if (a.type === 'assignment_group' && b.type === 'assignment_group') {
          return a.object.position - b.object.position;
        } else if (a.type === 'assignment' && b.type === 'assignment') {
          if (this.arrangeColumnsBy() === 'assignment_group') {
            diffOfAssignmentGroupPosition = a.object.assignment_group.position - b.object.assignment_group.position;
            diffOfAssignmentPosition = a.object.position - b.object.position;
            return (diffOfAssignmentGroupPosition * 1000000) + diffOfAssignmentPosition;
          } else {
            aDate = ((_ref = a.object.due_at) != null ? _ref.timestamp : void 0) || Number.MAX_VALUE;
            bDate = ((_ref1 = b.object.due_at) != null ? _ref1.timestamp : void 0) || Number.MAX_VALUE;
            if (aDate === bDate) {
              if (a.object.name === b.object.name) {
                return 0;
              }
              return (a.object.name > b.object.name ? 1 : -1);
            }
            return aDate - bDate;
          }
        }
        throw "unhandled column sort condition";
      };

      Gradebook.prototype.rowFilter = function(student) {
        var _ref;
        return !this.sectionToShow || (_ref = this.sectionToShow, __indexOf.call(student.sections, _ref) >= 0);
      };

      Gradebook.prototype.handleAssignmentMutingChange = function(assignment) {
        var colDef, idx;
        idx = this.gradeGrid.getColumnIndex("assignment_" + assignment.id);
        colDef = this.gradeGrid.getColumns()[idx];
        colDef.name = this.assignmentHeaderHtml(assignment);
        this.gradeGrid.setColumns(this.gradeGrid.getColumns());
        this.fixColumnReordering();
        return this.buildRows();
      };

      Gradebook.prototype.buildRows = function() {
        var column, i, id, sortables, student, _i, _len, _ref, _ref1, _ref2, _ref3;
        this.rows.length = 0;
        sortables = {};
        _ref = this.gradeGrid.getColumns();
        for (id in _ref) {
          column = _ref[id];
          if (!('' + ((_ref1 = column.object) != null ? _ref1.submission_types : void 0) === "attendance")) {
            continue;
          }
          column.unselectable = !this.show_attendance;
          column.cssClass = this.show_attendance ? '' : 'completely-hidden';
          this.$grid.find("[id*='" + column.id + "']").showIf(this.show_attendance);
        }
        _ref2 = this.students;
        for (id in _ref2) {
          student = _ref2[id];
          student.row = -1;
          if (this.rowFilter(student)) {
            this.rows.push(student);
            this.calculateStudentGrade(student);
            sortables[student.id] = this.sortFn(student);
          }
        }
        this.rows.sort(function(a, b) {
          if (sortables[a.id] < sortables[b.id]) {
            return -1;
          } else if (sortables[a.id] > sortables[b.id]) {
            return 1;
          } else {
            return 0;
          }
        });
        _ref3 = this.rows;
        for (i = _i = 0, _len = _ref3.length; _i < _len; i = ++_i) {
          student = _ref3[i];
          student.row = i;
        }
        return this.multiGrid.invalidate();
      };

      Gradebook.prototype.getSubmissionsChunks = function() {
        var params, student, students, _results;
        _results = [];
        while (true) {
          students = this.rows.slice(this.chunk_start, this.chunk_start + this.options.chunk_size);
          if (!students.length) {
            this.allSubmissionsLoaded = true;
            break;
          }
          params = {
            student_ids: (function() {
              var _i, _len, _results1;
              _results1 = [];
              for (_i = 0, _len = students.length; _i < _len; _i++) {
                student = students[_i];
                _results1.push(student.id);
              }
              return _results1;
            })(),
            response_fields: ['user_id', 'url', 'score', 'grade', 'submission_type', 'submitted_at', 'assignment_id', 'grade_matches_current_submission']
          };
          $.ajaxJSON(this.options.submissions_url, "GET", params, this.gotSubmissionsChunk);
          _results.push(this.chunk_start += this.options.chunk_size);
        }
        return _results;
      };

      Gradebook.prototype.gotSubmissionsChunk = function(student_submissions) {
        var data, student, submission, _i, _j, _len, _len1, _ref;
        for (_i = 0, _len = student_submissions.length; _i < _len; _i++) {
          data = student_submissions[_i];
          student = this.students[data.user_id];
          _ref = data.submissions;
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            submission = _ref[_j];
            this.updateSubmission(submission);
          }
          student.loaded = true;
          this.multiGrid.invalidateRow(student.row);
          this.calculateStudentGrade(student);
        }
        return this.multiGrid.render();
      };

      Gradebook.prototype.updateSubmission = function(submission) {
        var student;
        student = this.students[submission.user_id];
        if (submission.submitted_at) {
          submission.submitted_at = $.parseFromISO(submission.submitted_at);
        }
        return student["assignment_" + submission.assignment_id] = submission;
      };

      Gradebook.prototype.updateSubmissionsFromExternal = function(submissions) {
        var student, submission, _i, _len;
        for (_i = 0, _len = submissions.length; _i < _len; _i++) {
          submission = submissions[_i];
          student = this.students[submission.user_id];
          this.updateSubmission(submission);
          this.multiGrid.invalidateRow(student.row);
          this.calculateStudentGrade(student);
        }
        return this.multiGrid.render();
      };

      Gradebook.prototype.cellFormatter = function(row, col, submission) {
        var assignment;
        if (!this.rows[row].loaded) {
          return this.staticCellFormatter(row, col, '');
        } else if (!(submission != null)) {
          return this.staticCellFormatter(row, col, '-');
        } else {
          assignment = this.assignments[submission.assignment_id];
          if (!(assignment != null)) {
            return this.staticCellFormatter(row, col, '');
          } else {
            if (assignment.grading_type === 'points' && assignment.points_possible) {
              return SubmissionCell.out_of.formatter(row, col, submission, assignment);
            } else {
              return (SubmissionCell[assignment.grading_type] || SubmissionCell).formatter(row, col, submission, assignment);
            }
          }
        }
      };

      Gradebook.prototype.staticCellFormatter = function(row, col, val) {
        return "<div class='cell-content gradebook-cell'>" + val + "</div>";
      };

      Gradebook.prototype.groupTotalFormatter = function(row, col, val, columnDef, student) {
        var letterGrade, percentage;
        if (val == null) {
          return '';
        }
        percentage = Math.round((val.score / val.possible) * 1000) / 10;
        if (isNaN(percentage)) {
          percentage = 0;
        }
        if (val.possible && this.options.grading_standard && columnDef.type === 'total_grade') {
          letterGrade = GradeCalculator.letter_grade(this.options.grading_standard, percentage);
        }
        return groupTotalCellTemplate({
          score: val.score,
          possible: val.possible,
          letterGrade: letterGrade,
          percentage: percentage
        });
      };

      Gradebook.prototype.calculateStudentGrade = function(student) {
        var finalOrCurrent, group, key, result, submissionsAsArray, value, _i, _len, _ref;
        if (student.loaded) {
          finalOrCurrent = this.include_ungraded_assignments ? 'final' : 'current';
          submissionsAsArray = (function() {
            var _results;
            _results = [];
            for (key in student) {
              value = student[key];
              if (key.match(/^assignment_(?!group)/)) {
                _results.push(value);
              }
            }
            return _results;
          })();
          result = INST.GradeCalculator.calculate(submissionsAsArray, this.assignmentGroups, this.options.group_weighting_scheme);
          _ref = result.group_sums;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            group = _ref[_i];
            student["assignment_group_" + group.group.id] = group[finalOrCurrent];
          }
          return student["total_grade"] = result[finalOrCurrent];
        }
      };

      Gradebook.prototype.highlightColumn = function(columnIndexOrEvent) {
        var match;
        if (isNaN(columnIndexOrEvent)) {
          match = columnIndexOrEvent.currentTarget.className.match(/c\d+/);
          if (match) {
            columnIndexOrEvent = match.toString().replace('c', '');
          }
        }
        return this.$grid.find('.slick-header-column:eq(' + columnIndexOrEvent + ')').addClass('hovered-column');
      };

      Gradebook.prototype.unhighlightColumns = function() {
        return this.$grid.find('.hovered-column').removeClass('hovered-column');
      };

      Gradebook.prototype.fixColumnReordering = function() {
        var $headers, fixupStopCallback, initHeaderDropMenus, makeOnlyAssignmentsSortable, onlyAssignmentColsSelector, originalItemsSelector, originalStopFn,
          _this = this;
        $headers = $('#gradebook_grid').find('.slick-header-columns');
        originalItemsSelector = $headers.sortable('option', 'items');
        onlyAssignmentColsSelector = '> *:not([id*="assignment_group"]):not([id*="total_grade"])';
        (makeOnlyAssignmentsSortable = function() {
          var $notAssignments;
          $headers.sortable('option', 'items', onlyAssignmentColsSelector);
          $notAssignments = $(originalItemsSelector, $headers).not($(onlyAssignmentColsSelector, $headers));
          return $notAssignments.data('sortable-item', null);
        })();
        (initHeaderDropMenus = function() {
          return $headers.find('.gradebook-header-drop').click(function(event) {
            var $link;
            $link = $(event.target);
            if (!$link.data('gradebookHeaderMenu')) {
              $link.data('gradebookHeaderMenu', new GradebookHeaderMenu(_this.assignments[$link.data('assignmentId')], $link, _this));
            }
            return false;
          });
        })();
        originalStopFn = $headers.sortable('option', 'stop');
        return (fixupStopCallback = function() {
          return $headers.sortable('option', 'stop', function(event, ui) {
            var returnVal;
            $headers.sortable('option', 'items', originalItemsSelector);
            returnVal = originalStopFn.apply(this, arguments);
            makeOnlyAssignmentsSortable();
            initHeaderDropMenus();
            fixupStopCallback();
            return returnVal;
          });
        })();
      };

      Gradebook.prototype.minimizeColumn = function($columnHeader) {
        var colIndex, columnDef;
        colIndex = $columnHeader.index();
        columnDef = this.gradeGrid.getColumns()[colIndex];
        columnDef.cssClass = (columnDef.cssClass || '').replace(' minimized', '') + ' minimized';
        columnDef.unselectable = true;
        columnDef.unminimizedName = columnDef.name;
        columnDef.name = '';
        columnDef.minimized = true;
        this.$grid.find(".l" + colIndex).add($columnHeader).addClass('minimized');
        this.assignmentsToHide.push(columnDef.id);
        return userSettings.contextSet('hidden_columns', _.uniq(this.assignmentsToHide));
      };

      Gradebook.prototype.unminimizeColumn = function($columnHeader) {
        var colIndex, columnDef;
        colIndex = $columnHeader.index();
        columnDef = this.gradeGrid.getColumns()[colIndex];
        columnDef.cssClass = (columnDef.cssClass || '').replace(' minimized', '');
        columnDef.unselectable = false;
        columnDef.name = columnDef.unminimizedName;
        columnDef.minimized = false;
        this.$grid.find(".l" + colIndex).add($columnHeader).removeClass('minimized');
        $columnHeader.find('.slick-column-name').html(columnDef.name);
        this.assignmentsToHide = $.grep(this.assignmentsToHide, function(el) {
          return el !== columnDef.id;
        });
        return userSettings.contextSet('hidden_columns', _.uniq(this.assignmentsToHide));
      };

      Gradebook.prototype.hoverMinimizedCell = function(event) {
        var $hoveredCell, assignment, columnDef, htmlLines, offset, submission, _ref,
          _this = this;
        $hoveredCell = $(event.currentTarget).removeClass('hover');
        columnDef = this.gradeGrid.getColumns()[$hoveredCell.index()];
        assignment = columnDef.object;
        offset = $hoveredCell.offset();
        htmlLines = [assignment.name];
        if ($hoveredCell.hasClass('slick-cell')) {
          submission = this.rows[this.gradeGrid.getCellFromEvent(event).row][columnDef.id];
          if (assignment.points_possible != null) {
            htmlLines.push("" + ((_ref = submission.score) != null ? _ref : '--') + " / " + assignment.points_possible);
          } else if (submission.score != null) {
            htmlLines.push(submission.score);
          }
          Array.prototype.push.apply(htmlLines, $.map(SubmissionCell.classesBasedOnSubmission(submission, assignment), function(c) {
            return GRADEBOOK_TRANSLATIONS["#submission_tooltip_" + c];
          }));
        } else if (assignment.points_possible != null) {
          htmlLines.push(I18n.t('points_out_of', "out of %{points_possible}", {
            points_possible: assignment.points_possible
          }));
        }
        return $hoveredCell.data('tooltip', $("<span />", {
          "class": 'gradebook-tooltip',
          css: {
            left: offset.left - 15,
            top: offset.top,
            zIndex: 10000,
            display: 'block'
          },
          html: htmlLines.join('<br />')
        }).appendTo('body').css('top', function(i, top) {
          return parseInt(top) - $(this).outerHeight();
        }));
      };

      Gradebook.prototype.unhoverMinimizedCell = function(event) {
        var $tooltip;
        if ($tooltip = $(this).data('tooltip')) {
          if (event.toElement === $tooltip[0]) {
            return $tooltip.mouseleave(function() {
              return $tooltip.remove();
            });
          } else {
            return $tooltip.remove();
          }
        }
      };

      Gradebook.prototype.fixMaxHeaderWidth = function() {
        return this.$grid.find('.slick-header-columns').width(1000000);
      };

      Gradebook.prototype.onGridInit = function() {
        var grid, tooltipTexts,
          _this = this;
        this.fixColumnReordering();
        tooltipTexts = {};
        $(this.spinner.el).remove();
        $('#gradebook_wrapper').show();
        this.$grid = grid = $('#gradebook_grid').fillWindowWithMe({
          alsoResize: '#gradebook_students_grid',
          onResize: function() {
            return _this.multiGrid.resizeCanvas();
          }
        }).delegate('.slick-cell', {
          'mouseenter.gradebook focusin.gradebook': this.highlightColumn,
          'mouseleave.gradebook focusout.gradebook': this.unhighlightColumns,
          'mouseenter focusin': function(event) {
            grid.find('.hover, .focus').removeClass('hover focus');
            return $(this).addClass((event.type === 'mouseenter' ? 'hover' : 'focus'));
          },
          'mouseleave focusout': function() {
            return $(this).removeClass('hover focus');
          }
        }).delegate('.gradebook-cell-comment', 'click.gradebook', function(event) {
          var data;
          event.preventDefault();
          data = $(event.currentTarget).data();
          return SubmissionDetailsDialog.open(_this.assignments[data.assignmentId], _this.students[data.userId], _this.options);
        }).delegate('.minimized', {
          'mouseenter': this.hoverMinimizedCell,
          'mouseleave': this.unhoverMinimizedCell
        });
        this.fixMaxHeaderWidth();
        $('#gradebook_grid .slick-resizable-handle').live('drag', function(e, dd) {
          return _this.$grid.find('.slick-header-column').each(function(colIndex, elem) {
            var $columnHeader, columnDef;
            $columnHeader = $(elem);
            columnDef = _this.gradeGrid.getColumns()[colIndex];
            if ($columnHeader.outerWidth() <= minimumAssignmentColumWidth) {
              if (!columnDef.minimized) {
                return _this.minimizeColumn($columnHeader);
              }
            } else if (columnDef.minimized) {
              return _this.unminimizeColumn($columnHeader);
            }
          });
        });
        return $(document).trigger('gridready');
      };

      Gradebook.prototype.initHeader = function() {
        var $sectionToShowMenu, $settingsMenu, $upload_modal, allSectionsText, id, s, sections, updateSectionBeingShownText, _ref,
          _this = this;
        if (this.sections_enabled) {
          allSectionsText = I18n.t('all_sections', 'All Sections');
          sections = [
            {
              name: allSectionsText,
              checked: !this.sectionToShow
            }
          ];
          _ref = this.sections;
          for (id in _ref) {
            s = _ref[id];
            sections.push({
              name: s.name,
              id: id,
              checked: this.sectionToShow === id
            });
          }
          $sectionToShowMenu = $(sectionToShowMenuTemplate({
            sections: sections,
            scrolling: sections.length > 15
          }));
          (updateSectionBeingShownText = function() {
            return $('#section_being_shown').html(_this.sectionToShow ? _this.sections[_this.sectionToShow].name : allSectionsText);
          })();
          $('#section_to_show').after($sectionToShowMenu).show().kyleMenu({
            buttonOpts: {
              icons: {
                primary: "ui-icon-sections",
                secondary: "ui-icon-droparrow"
              }
            }
          });
          $sectionToShowMenu.bind('menuselect', function(event, ui) {
            _this.sectionToShow = Number($sectionToShowMenu.find('[aria-checked="true"] input[name="section_to_show_radio"]').val()) || void 0;
            userSettings[_this.sectionToShow ? 'contextSet' : 'contextRemove']('grading_show_only_section', _this.sectionToShow);
            updateSectionBeingShownText();
            return _this.buildRows();
          });
        }
        $settingsMenu = $('#gradebook_settings').next();
        $.each(['show_attendance', 'include_ungraded_assignments'], function(i, setting) {
          return $settingsMenu.find("#" + setting).prop('checked', _this[setting]).change(function(event) {
            _this[setting] = $(event.target).is(':checked');
            userSettings.contextSet(setting, _this[setting]);
            if (setting === 'show_attendance') {
              _this.gradeGrid.setColumns(_this.getVisibleGradeGridColumns());
            }
            return _this.buildRows();
          });
        });
        if (!(_.detect(this.gradeGrid.getColumns(), function(col) {
          var _ref1;
          return ((_ref1 = col.object) != null ? _ref1.submission_types : void 0) === "attendance";
        }))) {
          $settingsMenu.find('#show_attendance').hide();
        }
        this.$columnArrangementTogglers = $('#gradebook-toolbar [data-arrange-columns-by]').bind('click', function(event) {
          var thingToArrangeBy;
          event.preventDefault();
          thingToArrangeBy = $(event.currentTarget).data('arrangeColumnsBy');
          return _this.arrangeColumnsBy(thingToArrangeBy);
        });
        this.arrangeColumnsBy('assignment_group');
        $('#gradebook_settings').show().kyleMenu({
          buttonOpts: {
            icons: {
              primary: "ui-icon-cog",
              secondary: "ui-icon-droparrow"
            }
          }
        });
        $upload_modal = null;
        return $settingsMenu.find('.gradebook_upload_link').click(function(event) {
          var locals;
          event.preventDefault();
          if (!$upload_modal) {
            locals = {
              download_gradebook_csv_url: "" + _this.options.context_url + "/gradebook.csv",
              action: "" + _this.options.context_url + "/gradebook_uploads",
              authenticityToken: $("#ajax_authenticity_token").text()
            };
            $upload_modal = $(gradebook_uploads_form(locals)).dialog({
              bgiframe: true,
              autoOpen: false,
              modal: true,
              width: 720,
              resizable: false
            }).fixDialogButtons().delegate('#gradebook-upload-help-trigger', 'click', function() {
              $(this).hide();
              return $('#gradebook-upload-help').show();
            });
          }
          return $upload_modal.dialog('open');
        });
      };

      Gradebook.prototype.getVisibleGradeGridColumns = function() {
        var column, res, submissionType, _i, _len, _ref;
        res = [];
        _ref = this.allAssignmentColumns;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          column = _ref[_i];
          submissionType = '' + column.object.submission_types;
          if (!(submissionType === "not_graded" || submissionType === "attendance" && !this.show_attendance)) {
            res.push(column);
          }
        }
        return res.concat(this.aggregateColumns);
      };

      Gradebook.prototype.assignmentHeaderHtml = function(assignment) {
        return columnHeaderTemplate({
          assignment: assignment,
          href: assignment.html_url,
          showPointsPossible: assignment.points_possible != null
        });
      };

      Gradebook.prototype.initGrid = function() {
        var $widthTester, assignment, columnDef, fieldName, grids, group, html, id, minWidth, options, outOfFormatter, percentage, sortRowsBy, testWidth,
          _this = this;
        $widthTester = $('<span style="padding:10px" />').appendTo('#content');
        testWidth = function(text, minWidth, maxWidth) {
          var width;
          width = Math.max($widthTester.text(text).outerWidth(), minWidth);
          return Math.min(width, maxWidth);
        };
        this.parentColumns = [
          {
            id: 'student',
            name: I18n.t('student_name', 'Student Name'),
            field: 'display_name',
            width: 150,
            cssClass: "meta-cell",
            resizable: false,
            sortable: true
          }, {
            id: 'secondary_identifier',
            name: I18n.t('secondary_id', 'Secondary ID'),
            field: 'secondary_identifier',
            width: 100,
            cssClass: "meta-cell secondary_identifier_cell",
            resizable: false,
            sortable: true
          }
        ];
        this.allAssignmentColumns = (function() {
          var _ref, _results,
            _this = this;
          _ref = this.assignments;
          _results = [];
          for (id in _ref) {
            assignment = _ref[id];
            outOfFormatter = assignment && assignment.grading_type === 'points' && (assignment.points_possible != null) && SubmissionCell.out_of;
            minWidth = outOfFormatter ? 70 : 90;
            fieldName = "assignment_" + id;
            columnDef = {
              id: fieldName,
              field: fieldName,
              name: this.assignmentHeaderHtml(assignment),
              object: assignment,
              formatter: this.cellFormatter,
              editor: outOfFormatter || SubmissionCell[assignment.grading_type] || SubmissionCell,
              minWidth: columnWidths.assignment.min,
              maxWidth: columnWidths.assignment.max,
              width: testWidth(assignment.name, minWidth, columnWidths.assignment.max),
              sortable: true,
              toolTip: assignment.name,
              type: 'assignment'
            };
            if (__indexOf.call(this.assignmentsToHide, fieldName) >= 0) {
              columnDef.width = 10;
              (function(fieldName) {
                return $(document).bind('gridready', function() {
                  return _this.minimizeColumn(_this.$grid.find("[id*='" + fieldName + "']"));
                }).unbind('gridready.render').bind('gridready.render', function() {
                  return _this.gradeGrid.invalidate();
                });
              })(fieldName);
            }
            _results.push(columnDef);
          }
          return _results;
        }).call(this);
        this.aggregateColumns = (function() {
          var _ref, _results;
          _ref = this.assignmentGroups;
          _results = [];
          for (id in _ref) {
            group = _ref[id];
            html = "" + group.name;
            if (group.group_weight != null) {
              percentage = I18n.toPercentage(group.group_weight, {
                precision: 0
              });
              html += "<div class='assignment-points-possible'>\n  " + (I18n.t('percent_of_grade', "%{percentage} of grade", {
                percentage: percentage
              })) + "\n</div>";
            }
            _results.push({
              id: "assignment_group_" + id,
              field: "assignment_group_" + id,
              formatter: this.groupTotalFormatter,
              name: html,
              toolTip: group.name,
              object: group,
              minWidth: columnWidths.assignmentGroup.min,
              maxWidth: columnWidths.assignmentGroup.max,
              width: testWidth(group.name, columnWidths.assignmentGroup.min, columnWidths.assignmentGroup.max),
              cssClass: "meta-cell assignment-group-cell",
              sortable: true,
              type: 'assignment_group'
            });
          }
          return _results;
        }).call(this);
        this.aggregateColumns.push({
          id: "total_grade",
          field: "total_grade",
          formatter: this.groupTotalFormatter,
          name: "Total",
          minWidth: columnWidths.total.min,
          maxWidth: columnWidths.total.max,
          width: testWidth("Total", columnWidths.total.min, columnWidths.total.max),
          cssClass: "total-cell",
          sortable: true,
          type: 'total_grade'
        });
        $widthTester.remove();
        options = $.extend({
          enableCellNavigation: false,
          enableColumnReorder: false,
          enableAsyncPostRender: true,
          asyncPostRenderDelay: 1,
          autoEdit: true,
          rowHeight: 35,
          headerHeight: 38
        }, this.options);
        grids = [
          {
            selector: '#gradebook_students_grid',
            columns: this.parentColumns
          }, {
            selector: '#gradebook_grid',
            columns: this.getVisibleGradeGridColumns(),
            options: {
              enableCellNavigation: true,
              editable: true,
              syncColumnCellResize: true,
              enableColumnReorder: true
            }
          }
        ];
        this.multiGrid = new MultiGrid(this.rows, options, grids, 1);
        this.gradeGrid = this.multiGrid.grids[1];
        this.gradeGrid.onCellChange.subscribe(function(event, data) {
          _this.calculateStudentGrade(data.item);
          return _this.gradeGrid.invalidate();
        });
        sortRowsBy = function(sortFn) {
          var i, student, _i, _len, _ref;
          _this.rows.sort(sortFn);
          _ref = _this.rows;
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            student = _ref[i];
            student.row = i;
          }
          return _this.multiGrid.invalidate();
        };
        this.gradeGrid.onSort.subscribe(function(event, data) {
          return sortRowsBy(function(a, b) {
            var aScore, bScore, _ref, _ref1;
            aScore = (_ref = a[data.sortCol.field]) != null ? _ref.score : void 0;
            bScore = (_ref1 = b[data.sortCol.field]) != null ? _ref1.score : void 0;
            if (!aScore && aScore !== 0) {
              aScore = -99999999999;
            }
            if (!bScore && bScore !== 0) {
              bScore = -99999999999;
            }
            if (data.sortAsc) {
              return bScore - aScore;
            } else {
              return aScore - bScore;
            }
          });
        });
        this.multiGrid.grids[0].onSort.subscribe(function(event, data) {
          var propertyToSortBy;
          propertyToSortBy = {
            display_name: 'sortable_name',
            secondary_identifier: 'secondary_identifier'
          }[data.sortCol.field];
          return sortRowsBy(function(a, b) {
            var res;
            res = a[propertyToSortBy] < b[propertyToSortBy] ? -1 : a[propertyToSortBy] > b[propertyToSortBy] ? 1 : 0;
            if (data.sortAsc) {
              return res;
            } else {
              return 0 - res;
            }
          });
        });
        this.multiGrid.parent_grid.onKeyDown.subscribe(function() {
          return false;
        });
        return this.onGridInit();
      };

      return Gradebook;

    })();
  });

}).call(this);
