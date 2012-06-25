define('jst/calendar/contextSelector', ["compiled/handlebars_helpers","i18n!calendar.context_selector"], function (Handlebars) {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
  templates['calendar/contextSelector'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, stack2, stack3, stack4, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0;


  buffer += "<div class=\"ag_contexts_menu hidden\">\n  <ul class=\"ag-contexts\"></ul>\n  <button class=\"button small-button ag_contexts_done\">";
  stack1 = "Done";
  stack2 = "done";
  stack3 = {};
  stack4 = "calendar.contextSelector";
  stack3['scope'] = stack4;
  stack4 = helpers['t'] || depth0['t'];
  tmp1 = {};
  tmp1.hash = stack3;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, stack1, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "t", stack2, stack1, tmp1); }
  else { stack1 = stack4; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</button>\n</div>\n";
  return buffer;});
  
  return templates['calendar/contextSelector'];
});
