define(["i18n!shared.aligned_outcomes","jquery","jquery.ajaxJSON","jqueryui/dialog","jquery.instructure_misc_plugins","jquery.templateData","vendor/jquery.scrollTo"],function(a,b){b(document).ready(function(){var c=b("#aligned_outcomes .outcomes_url").attr("href"),d=function(c){b("#aligned_outcomes .outcomes .outcome:not(.blank)").remove();var d=parseFloat(b("#full_assignment_holder input[name='assignment[mastery_score]']").val()),e=parseFloat(b("#full_assignment_holder input[name='assignment[points_possible]']").val()),f=null;if(isFinite(d)||isFinite(e))f=d||e||0;for(var g in c){var h=c[g].content_tag,i=h.learning_outcome,j=b("#aligned_outcomes .outcomes .outcome.blank:first").clone(!0).removeClass("blank");i.mastery="",h.rubric_association_id?(j.addClass("rubric_alignment"),i.mastery=a.t("mastery_info_see_rubric","see the rubric for mastery details")):f&&(i.mastery=a.t("mastery_score_info","mastery with a score of %{score} or higher",{score:f})),j.fillTemplateData({data:i,hrefValues:["id"],htmlValues:["description"]}),b("#aligned_outcomes .outcomes").append(j.show())}b("#aligned_outcomes").showIf(c.length>0),b("#align_outcomes_dialog:visible").length>0&&b(".align_outcomes_link:first").click()};typeof c!="undefined"&&b.ajaxJSON(c,"GET",{},function(a){d(a)}),b(".align_outcomes_link").click(function(c){c.preventDefault(),b("#aligned_outcomes").show(),b("html,body").scrollTo(b("#aligned_outcomes"));var d=parseFloat(b("#full_assignment_holder input[name='assignment[mastery_score]']").val());d=d||"",b("#align_outcomes_dialog .outcome_checkbox").each(function(){b(this).attr("checked",!1).attr("disabled",!1)}),b("#align_outcomes_dialog .rubric_aligned").hide(),b("#aligned_outcomes .outcomes .outcome:not(.blank):not(.rubric_alignment)").each(function(){var a=b(this).getTemplateData({textValues:["id"]}).id;b("#align_outcome_for_"+a).attr("checked",!0)}),b("#aligned_outcomes .outcomes .outcome.rubric_alignment:not(.blank)").each(function(){var a=b(this).getTemplateData({textValues:["id"]}).id;b("#align_outcome_for_"+a).attr("checked",!0).attr("disabled",!0),b(this).parents(".outcome").find(".rubric_aligned").show()}),b("#align_outcomes_dialog .outcome_checkbox").each(function(){b(this).change()}),b("#aligned_outcomes_mastery_score").val(d),b("#align_outcomes_dialog").dialog("close").dialog({autoOpen:!1,title:a.t("buttons.align_outcomes","Align Outcomes"),width:500}).dialog("open")}),b("#align_outcomes_dialog .cancel_button").click(function(){b("#align_outcomes_dialog").dialog("close")}),b("#align_outcomes_dialog .outcome_checkbox").change(function(){b(this).parents(".outcome").toggleClass("selected_outcome",b(this).attr("checked"))}),b("#align_outcomes_dialog .save_button").click(function(){var c=[];b(".outcome_checkbox:checked").each(function(){c.push(b(this).val())}),c=c.join(",");var e=b("#aligned_outcomes .outcomes_url").attr("href"),f=parseFloat(b("#aligned_outcomes_mastery_score").val())||"",g=b(this);g.text(a.t("status.aligning_outcomes","Aligning Outcomes...")),b("#align_outcomes_dialog .button-container .button").attr("disabled",!0),b.ajaxJSON(e,"POST",{outcome_ids:c,mastery_score:f},function(c){b("#align_outcomes_dialog .button-container .button").attr("disabled",!1),g.text(a.t("buttons.align_outcomes","Align Outcomes")),b("#full_assignment_holder input[name='assignment[mastery_score]']").val(f),d(c),b("#align_outcomes_dialog").dialog("close")},function(){b("#align_outcomes_dialog .button-container .button").attr("disabled",!1),g.text(a.t("errors.align_outcomes_failed","Aligning Outcomes Failed, Please Try Again"))})})})})