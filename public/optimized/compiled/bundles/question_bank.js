define("translations/question_bank",["i18nObj","jquery"],function(a,b){b.extend(!0,a,{translations:{es:{question_bank:{align_outcomes:"Asignar Resultados",remove_outcome_from_bank:"¿Seguro que quiere remover este resultado del grupo?",update_outcomes_fail:"Actualización de los Resultados Falló",updating_outcomes:"Actualizando Resultados..."}}}})}),define("translations/find_outcome",["i18nObj","jquery"],function(a,b){b.extend(!0,a,{translations:{es:{find_outcome:{errors:{outcome_retrieval_failed:"La Recuperación de Resultados falló. Intente de nuevo."},messages:{loading_outcomes:"Cargando Resultados...",no_outcomes_found:"No se encontraron Resultados",no_rubric_outcomes_found:"No se encontraron Resultados Configurados para Rúbricas"},titles:{find_outcome:"Encontrar Resultado",find_outcome_criterion:"Encontrar los Criterios de Resultados"}}}}})}),define("jst/quiz/move_question",["compiled/handlebars_helpers"],function(a){var b=a.template,c=a.templates=a.templates||{};return c["quiz/move_question"]=b(function(a,b,c,d,e){function o(a,b){var d="",e;d+='\n<li class="list_question">\n  <input type="checkbox" id="list_question_',e=c.assessment_question||a.assessment_question,e=e===null||e===undefined||e===!1?e:e.id,typeof e===k?e=e.call(a,{hash:{}}):e===m&&(e=l.call(a,"assessment_question.id",{hash:{}})),d+=n(e)+'" class="list_question_checkbox" name="questions[',e=c.assessment_question||a.assessment_question,e=e===null||e===undefined||e===!1?e:e.id,typeof e===k?e=e.call(a,{hash:{}}):e===m&&(e=l.call(a,"assessment_question.id",{hash:{}})),d+=n(e)+'" value="',e=c.assessment_question||a.assessment_question,e=e===null||e===undefined||e===!1?e:e.id,typeof e===k?e=e.call(a,{hash:{}}):e===m&&(e=l.call(a,"assessment_question.id",{hash:{}})),d+=n(e)+'" />\n  <label for="list_question_',e=c.assessment_question||a.assessment_question,e=e===null||e===undefined||e===!1?e:e.id,typeof e===k?e=e.call(a,{hash:{}}):e===m&&(e=l.call(a,"assessment_question.id",{hash:{}})),d+=n(e)+'" class="list_question_name">',e=c.assessment_question||a.assessment_question,e=e===null||e===undefined||e===!1?e:e.question_data,e=e===null||e===undefined||e===!1?e:e.question_name,typeof e===k?e=e.call(a,{hash:{}}):e===m&&(e=l.call(a,"assessment_question.question_data.question_name",{hash:{}})),d+=n(e)+'</label>\n  <div class="list_question_text">',e=c.assessment_question||a.assessment_question,e=e===null||e===undefined||e===!1?e:e.question_data,e=e===null||e===undefined||e===!1?e:e.question_text,typeof e===k?e=e.call(a,{hash:{}}):e===m&&(e=l.call(a,"assessment_question.question_data.question_text",{hash:{}}));if(e||e===0)d+=e;return d+="</div>\n</li>\n",d}c=c||a.helpers;var f="",g,h,i,j=this,k="function",l=c.helperMissing,m=void 0,n=this.escapeExpression;g=c.questions||b.questions,h=c.each,i=j.program(1,o,e),i.hash={},i.fn=i,i.inverse=j.noop,g=h.call(b,g,i);if(g||g===0)f+=g;return f+="\n",f}),c["quiz/move_question"]}),define("find_outcome",["i18n!find_outcome","jquery","jquery.ajaxJSON","jqueryui/dialog","jquery.instructure_misc_helpers","jquery.templateData"],function(a,b){var c=function(){return{find:function(d,e){e=e||{},c.callback=d;var f=b("#find_outcome_criterion_dialog");f.hasClass("loaded")||(f.find(".loading_message").text(a.t("messages.loading_outcomes","Loading Outcomes...")),b.ajaxJSON(f.find(".outcomes_list_url").attr("href"),"GET",{},function(c){valids=[];for(var d in c){var g=c[d].learning_outcome;(!e.for_rubric||g.data&&g.data.rubric_criterion)&&valids.push(g)}if(valids.length===0){var h;e.for_rubric?h=a.t("messages.no_rubric_outcomes_found","No Rubric-Configured Outcomes found"):h=a.t("messages.no_outcomes_found","No Outcomes found"),f.find(".loading_message").text(h)}else{f.find(".loading_message").hide(),f.addClass("loaded");for(var d in valids){var g=valids[d];g.name=g.short_description,g.mastery_points=g.data.rubric_criterion.mastery_points||g.data.rubric_criterion.points_possible;var i=f.find(".outcomes_select.blank:first").clone(!0).removeClass("blank");g.title=g.short_description;var j=b("<div/>");j.text(g.short_description),g.title=b.truncateText(b.trim(j.text()),35),g.display_name=g.cached_context_short_name||"",i.fillTemplateData({data:g}),f.find(".outcomes_selects").append(i.show());var k=f.find(".outcome.blank:first").clone(!0).removeClass("blank");k.find(".mastery_level").attr("id","outcome_question_bank_mastery_"+g.id).end().find(".mastery_level_text").attr("for","outcome_question_bank_mastery_"+g.id),g.learning_outcome_id=g.id;var l=g.data&&g.data.rubric_criterion,m=l.points_possible&&l.mastery_points!=null&&l.mastery_points/l.points_possible||0;m=Math.round(m*1e4)/100||"",k.find(".mastery_level").val(m),k.fillTemplateData({data:g,htmlValues:["description"]}),k.addClass("outcome_"+g.id);if(g.data&&g.data.rubric_criterion)for(var n in g.data.rubric_criterion.ratings){var o=g.data.rubric_criterion.ratings[n],p=k.find(".rating.blank").clone(!0).removeClass("blank");p.fillTemplateData({data:o}),k.find("tr").append(p.show())}f.find(".outcomes_list").append(k)}f.find(".outcomes_select:not(.blank):first").click()}},function(b){f.find(".loading_message").text(a.t("errors.outcome_retrieval_failed","Outcomes Retrieval failed unexpected.  Please try again."))}));var g;e.for_rubric?g=a.t("titles.find_outcome_criterion","Find Outcome Criterion"):g=a.t("titles.find_outcome","Find Outcome"),f.dialog("close").dialog({autoOpen:!1,modal:!0,title:g,width:700,height:400}).dialog("open")}}}();return window.find_outcome=c,b(document).ready(function(){b("#find_outcome_criterion_dialog .outcomes_select").click(function(a){a.preventDefault(),b("#find_outcome_criterion_dialog .outcomes_select.selected_side_tab").removeClass("selected_side_tab"),b(this).addClass("selected_side_tab");var c=b(this).getTemplateData({textValues:["id"]}).id;b("#find_outcome_criterion_dialog .outcomes_list .outcome").hide(),b("#find_outcome_criterion_dialog .outcomes_list .outcome_"+c).show()}),b("#find_outcome_criterion_dialog .select_outcome_link").click(function(a){a.preventDefault();var d=b(this).parents(".outcome");b("#find_outcome_criterion_dialog").dialog("close"),b.isFunction(c.callback)&&c.callback(d)})}),c}),define("question_bank",["i18n!question_bank","jquery","find_outcome","jquery.ajaxJSON","jquery.instructure_misc_plugins","jquery.templateData"],function(a,b,c){b(document).ready(function(){function d(c){b(".add_outcome_text").text(a.t("updating_outcomes","Updating Outcomes...")).attr("disabled",!0);var d={};for(var e in c){var f=c[e];d["assessment_question_bank[outcomes]["+f[0]+"]"]=f[1]}c.length==0&&(d["assessment_question_bank[outcomes]"]="");var g=b(".edit_bank_link").attr("href");b.ajaxJSON(g,"PUT",d,function(c){var d=c.assessment_question_bank.learning_outcome_tags.sort(function(a,b){var c=(a.content_tag&&a.content_tag.learning_outcome&&a.content_tag.learning_outcome.short_description||"none").toLowerCase(),d=(b.content_tag&&b.content_tag.learning_outcome&&b.content_tag.learning_outcome.short_description||"none").toLowerCase();return c<d?-1:c>d?1:0});b(".add_outcome_text").text(a.t("align_outcomes","Align Outcomes")).attr("disabled",!1);var e=b("#aligned_outcomes_list");e.find(".outcome:not(.blank)").remove();var f=e.find(".blank:first").clone(!0).removeClass("blank");for(var g in d){var h=d[g].content_tag,i={short_description:h.learning_outcome.short_description,mastery_threshold:Math.round(h.mastery_score*1e4)/100},j=f.clone(!0);j.attr("data-id",h.learning_outcome_id),j.fillTemplateData({data:i}),e.append(j.show())}},function(c){b(".add_outcome_text").text(a.t("update_outcomes_fail","Updating Outcomes Failed")).attr("disabled",!1)})}b("#aligned_outcomes_list").delegate(".delete_outcome_link","click",function(c){c.preventDefault();var e=confirm(a.t("remove_outcome_from_bank","Are you sure you want to remove this outcome from the bank?")),f=b(this).parents(".outcome"),g=[],h=f.attr("data-id");e&&(b(this).parents(".outcome").dim(),b("#aligned_outcomes_list .outcome:not(.blank)").each(function(){var a=b(this).attr("data-id"),c=b(this).getTemplateData({textValues:["mastery_threshold"]}).mastery_threshold/100;a!=h&&g.push([a,c])}),d(g))}),b(".add_outcome_link").click(function(a){a.preventDefault(),c.find(function(a){var c=a.find(".learning_outcome_id").text(),e=parseFloat(a.find(".mastery_level").val())/100||1,f=[];b("#aligned_outcomes_list .outcome:not(.blank)").each(function(){var a=b(this).attr("data-id"),c=b(this).getTemplateData({textValues:["mastery_threshold"]}).mastery_threshold/100;f.push([a,c])}),f.push([c,e]),d(f)})})})}),function(){require(["jst/quiz/move_question","question_bank","find_outcome"])}.call(this),define("compiled/bundles/question_bank",function(){})