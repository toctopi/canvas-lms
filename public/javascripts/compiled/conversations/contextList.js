(function() {

  define(['underscore', 'str/htmlEscape', 'compiled/conversations/listWithOthers', 'jquery.instructure_misc_helpers'], function(_, h, listWithOthers) {
    var format;
    format = function(context) {
      var str;
      str = h(context.name);
      if (context.activeFilter) {
        str = "<span class='active-filter'>" + str + "</span>";
      }
      if (this.options.linkToContexts && context.type === "course") {
        str = "<a href='" + (h(context.url)) + "'>" + str + "</a>";
      }
      return $.raw(str);
    };
    return function(contexts, options) {
      var context;
      this.options = options;
      contexts = _.sortBy(contexts, function(context) {
        return "" + (context.activeFilter ? 0 : 1) + "_" + (context.name.toLowerCase());
      });
      if (this.options.hardCutoff) {
        contexts = contexts.slice(0, this.options.hardCutoff);
      }
      contexts = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = contexts.length; _i < _len; _i++) {
          context = contexts[_i];
          _results.push(format(context));
        }
        return _results;
      })();
      return listWithOthers(contexts);
    };
  });

}).call(this);
