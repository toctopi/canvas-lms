(function() {

  define(['jquery', 'compiled/fn/preventDefault', 'compiled/jquery/fixDialogButtons'], function($, preventDefault) {
    var toggleRegion, updateTextToState;
    updateTextToState = function(newStateOfRegion) {
      return function() {
        var $this, newHtml, oldStateKey, savedHtml;
        $this = $(this);
        if (!(newHtml = $this.data("htmlWhileTarget" + newStateOfRegion))) {
          return;
        }
        oldStateKey = "htmlWhileTarget" + (newStateOfRegion === 'Hidden' ? 'Shown' : 'Hidden');
        savedHtml = $this.data(oldStateKey);
        if (!savedHtml) {
          $this.data(oldStateKey, $this.html());
        }
        return $this.html(newHtml);
      };
    };
    toggleRegion = function($region, showRegion) {
      var $allElementsControllingRegion, dialogOpts;
      if (showRegion == null) {
        showRegion = $region.is(':ui-dialog:hidden') || ($region.attr('aria-expanded') !== 'true');
      }
      $allElementsControllingRegion = $(".element_toggler[aria-controls=" + ($region.attr('id')) + "]");
      $allElementsControllingRegion.filter(function() {
        return $(this).data('hideWhileTargetShown');
      }).toggle(!showRegion);
      $region.attr('aria-expanded', '' + showRegion).toggle(showRegion);
      if ($region.is(':ui-dialog') || (dialogOpts = $region.data('turnIntoDialog'))) {
        if (dialogOpts && showRegion) {
          dialogOpts = $.extend({
            autoOpen: false,
            close: function() {
              return toggleRegion($region, false);
            }
          }, dialogOpts);
          $region.dialog(dialogOpts).fixDialogButtons();
        }
        if (showRegion) {
          $region.dialog('open');
        } else if ($region.dialog('isOpen')) {
          $region.dialog('close');
        }
      }
      if (showRegion && $region.is(':focusable')) {
        $region.focus();
      }
      return $allElementsControllingRegion.each(updateTextToState(showRegion ? 'Shown' : 'Hidden'));
    };
    return $(document).delegate('.element_toggler[aria-controls]:not(.user_content *)', 'click', preventDefault(function() {
      var $region;
      $region = $("#" + ($(this).attr('aria-controls')));
      if ($region.length) {
        return toggleRegion($region);
      }
    }));
  });

}).call(this);
