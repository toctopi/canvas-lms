define('jst/_turnitinScore', ["compiled/handlebars_helpers"], function (Handlebars) {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
  templates['_turnitinScore'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, stack2, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <img src=\"";
  stack1 = helpers.icon || depth0.icon;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "icon", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\"></img>\n  ";
  return buffer;}

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    ";
  stack1 = helpers.score || depth0.score;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "score", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\n  ";
  return buffer;}

  buffer += "<span class=\"turnitin_score_container_caret ";
  stack1 = helpers.state || depth0.state;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "state", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\"></span>\n<a class=\"turnitin_similarity_score ";
  stack1 = helpers.state || depth0.state;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "state", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\" href=\"";
  stack1 = helpers.reportUrl || depth0.reportUrl;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "reportUrl", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\" title=\"";
  stack1 = helpers.tooltip || depth0.tooltip;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "tooltip", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\" target=\"_blank\">\n  ";
  stack1 = helpers.icon || depth0.icon;
  stack2 = helpers['if'];
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.program(3, program3, data);
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</a>\n";
  return buffer;});
  
Handlebars.registerPartial('turnitinScore', templates['_turnitinScore']);

  return templates['_turnitinScore'];
});
