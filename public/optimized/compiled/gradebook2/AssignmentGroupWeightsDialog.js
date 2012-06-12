(function(){var a=function(a,b){return function(){return a.apply(b,arguments)}};define(["jquery","jst/AssignmentGroupWeightsDialog","jquery.ajaxJSON","jquery.disableWhileLoading","jqueryui/dialog","jquery.instructure_misc_helpers","vendor/jquery.ba-tinypubsub"],function(b,c){var d;return d=function(){function d(d){this.afterSave=a(this.afterSave,this),this.save=a(this.save,this),this.calcTotal=a(this.calcTotal,this),this.update=a(this.update,this),this.render=a(this.render,this);var e=this;this.$dialog=b(c()),this.$dialog.dialog({autoOpen:!1,resizable:!1,width:350,buttons:[{text:this.$dialog.find("button[type=submit]").hide().text(),click:this.save}]}),this.$dialog.delegate("input","change keyup keydown input",this.calcTotal),this.$dialog.find("#group_weighting_scheme").change(function(a){var b;return b=!a.currentTarget.checked,e.$dialog.find("table").css("opacity",b?.5:1),e.$dialog.find(".assignment_group_row input").attr("disabled",b)}),this.$group_template=this.$dialog.find(".assignment_group_row.blank").removeClass("blank").detach().show(),this.$groups_holder=this.$dialog.find(".groups_holder"),this.update(d)}return d.name="AssignmentGroupWeightsDialog",d.prototype.render=function(){var a,b,c,d,e;this.$groups_holder.empty(),e=this.options.assignmentGroups;for(c=0,d=e.length;c<d;c++)a=e[c],b="assignment_group_"+a.id+"_weight",this.$group_template.clone().data("assignment_group",a).find("label").attr("for",b).text(a.name).end().find("input").attr("id",b).val(a.group_weight).end().appendTo(this.$groups_holder);return this.$dialog.find("#group_weighting_scheme").prop("checked",this.options.context.group_weighting_scheme==="percent").change(),this.calcTotal()},d.prototype.update=function(a){return this.options=a,this.render()},d.prototype.calcTotal=function(){var a;return a=0,this.$dialog.find(".assignment_group_row input").each(function(){return a+=Number(b(this).val())}),this.$dialog.find(".total_weight").text(a)},d.prototype.save=function(){var a,c,d,e,f=this;return a="/courses/"+this.options.context.context_id,e=[],c=this.$dialog.find("#group_weighting_scheme").is(":checked")?"percent":"equal",c!==this.options.context.group_weighting_scheme&&e.push(b.ajaxJSON(a,"PUT",{"course[group_weighting_scheme]":c},function(a){return f.options.context.group_weighting_scheme=a.course.group_weighting_scheme})),this.$dialog.find(".assignment_group_row").each(function(c,d){var f,g;f=b(d).data("assignment_group"),g=Number(b(d).find("input").val());if(g!==f.group_weight)return e.push(b.ajaxJSON(""+a+"/assignment_groups/"+f.id,"PUT",{"assignment_group[group_weight]":g},function(a){return b.extend(f,a.assignment_group)}))}),d=b.when.apply(b,e).done(this.afterSave),this.$dialog.disableWhileLoading(d,{buttons:[".ui-button-text"]})},d.prototype.afterSave=function(){return this.$dialog.dialog("close"),this.render(),b.publish("assignment_group_weights_changed",this.options)},d}()})}).call(this)