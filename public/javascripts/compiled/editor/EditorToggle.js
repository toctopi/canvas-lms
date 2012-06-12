(function() {

  define(['i18n!editor', 'jquery', 'tinymce.editor_box'], function(I18n, $) {
    var EditorToggle;
    return EditorToggle = (function() {

      EditorToggle.name = 'EditorToggle';

      EditorToggle.prototype.options = {
        doneText: I18n.t('done_as_in_finished', 'Done')
      };

      function EditorToggle(el, options) {
        this.el = el;
        this.options = $.extend({}, this.options, options);
        this.textArea = this.createTextArea();
        this.done = this.createDone();
        this.content = this.getContent();
        this.editing = false;
      }

      EditorToggle.prototype.toggle = function() {
        if (!this.editing) {
          return this.edit();
        } else {
          return this.display();
        }
      };

      EditorToggle.prototype.edit = function() {
        this.textArea.val(this.getContent());
        this.textArea.insertBefore(this.el);
        this.el.detach();
        this.done.insertAfter(this.textArea);
        this.textArea.editorBox();
        return this.editing = true;
      };

      EditorToggle.prototype.display = function() {
        this.content = this.textArea._justGetCode();
        this.textArea.val(this.content);
        this.el.html(this.content);
        this.el.insertBefore(this.textArea);
        this.textArea._removeEditor();
        this.textArea.detach();
        this.done.detach();
        this.textArea.attr('id', '');
        return this.editing = false;
      };

      EditorToggle.prototype.getContent = function() {
        return $.trim(this.el.html());
      };

      EditorToggle.prototype.createTextArea = function() {
        return $('<textarea/>').css('width', '100%').addClass('editor-toggle');
      };

      EditorToggle.prototype.createDone = function() {
        var _this = this;
        return $('<a/>').html(this.options.doneText).addClass('button edit-html-done edit_html_done').click(function() {
          return _this.display();
        });
      };

      return EditorToggle;

    })();
  });

}).call(this);
