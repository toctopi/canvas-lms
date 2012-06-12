(function() {

  define(['use!vendor/backbone', 'underscore'], function(Backbone, _) {
    Backbone.syncWithoutMultipart = Backbone.sync;
    Backbone.syncWithMultipart = function(method, model, options) {
      var $form, $iframe, callback, el, httpMethod, iframeId, toForm, _ref;
      iframeId = 'file_upload_iframe_' + (new Date()).getTime();
      $iframe = $("<iframe id='" + iframeId + "' name='" + iframeId + "' ></iframe>").hide();
      httpMethod = {
        create: 'POST',
        update: 'PUT',
        "delete": 'DELETE',
        read: 'GET'
      }[method];
      toForm = function(object, nested) {
        var inputs;
        inputs = _.map(object, function(attr, key) {
          var $el, $orig;
          if (_.isElement(attr)) {
            $orig = $(attr);
            $orig.after($orig.clone(true));
            return attr;
          } else if (!_.isEmpty(attr) && (_.isArray(attr) || typeof attr === 'object')) {
            return toForm(attr, key);
          } else if (!("" + key).match(/^_/) && (attr != null) && typeof attr !== 'object' && typeof attr !== 'function') {
            $el = $("<input/>", {
              name: key,
              value: attr
            });
            return $el[0];
          }
        });
        return _.flatten(inputs);
      };
      $form = $("<form enctype='multipart/form-data' target='" + iframeId + "' action='" + ((_ref = options.url) != null ? _ref : model.url()) + "' method='POST'>\n  <input type='hidden' name='_method' value='" + httpMethod + "' />\n  <input type='hidden' name='authenticity_token' value='" + ENV.AUTHENTICITY_TOKEN + "' />\n</form>").hide();
      $form.prepend((function() {
        var _i, _len, _ref1, _results;
        _ref1 = toForm(model);
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          el = _ref1[_i];
          if (el) {
            _results.push(el);
          }
        }
        return _results;
      })());
      $(document.body).prepend($iframe, $form);
      callback = function() {
        var iframeBody, response, _ref1;
        iframeBody = ($iframe[0].contentDocument || $iframe[0].contentWindow.document).body;
        response = $.parseJSON($(iframeBody).text());
        response = (_ref1 = response.objects) != null ? _ref1 : response;
        if (iframeBody.className === "error") {
          if (typeof options.error === "function") {
            options.error(response);
          }
        } else {
          if (typeof options.success === "function") {
            options.success(response);
          }
        }
        $iframe.remove();
        return $form.remove();
      };
      $iframe[0].onreadystatechange = function() {
        if (this.readyState === 'complete') {
          return callback();
        }
      };
      $iframe[0].onload = callback;
      return $form[0].submit();
    };
    return Backbone.sync = function(method, model, options) {
      if (options != null ? options.multipart : void 0) {
        return Backbone.syncWithMultipart.apply(this, arguments);
      } else {
        return Backbone.syncWithoutMultipart.apply(this, arguments);
      }
    };
  });

}).call(this);
