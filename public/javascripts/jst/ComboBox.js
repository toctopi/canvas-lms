define('jst/ComboBox', ["compiled/handlebars_helpers"], function (Handlebars) {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
  templates['ComboBox'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var self=this;


  return "<div class='ui-combobox'>\n  <a href=\"#\" class=\"ui-combobox-prev\">Previous</a>\n  <div class=\"ui-combobox-container\">\n    <select />\n  </div>\n  <a href=\"#\" class=\"ui-combobox-next\">Next</a>\n</div>\n";});
  
  return templates['ComboBox'];
});
