define("translations/learning_outcome",["i18nObj","jquery"],function(a,b){b.extend(!0,a,{translations:{es:{learning_outcome:{align_item:"Asignar Elemento",align_to_outcome:"Asignar Elemento a este Resultado",loading_more_results:"Cargando más resultados",remove_outcome_alignment:"¿Seguro que quiere remover esta tarea?",this_outcome:"este Resultado"}}}})}),define("learning_outcome",["INST","i18n!learning_outcome","jquery","jquery.ajaxJSON","jquery.instructure_date_and_time","jqueryui/dialog","jquery.instructure_misc_helpers","jquery.instructure_misc_plugins","jquery.loadingImg","jquery.templateData","vendor/jquery.pageless","jqueryui/sortable"],function(a,b,c){c(document).ready(function(){c("#outcome_results").pageless({totalPages:parseInt(c("#outcome_results_total_pages").text(),10)||1,url:c(".outcome_results_url").attr("href"),loaderMsg:b.t("loading_more_results","Loading more results"),scrape:function(a){if(typeof a=="string")try{a=c.parseJSON(a)||[]}catch(b){a=[]}for(var d in a){var e=a[d].learning_outcome_result,f=c("#result_blank").clone(!0).attr("id","result_"+e.id);e.assessed_at_formatted=c.parseFromISO(e.assessed_at).datetime_formatted,f.toggleClass("mastery_result",!!e.mastery),f.fillTemplateData({data:e,except:["mastery"],hrefValues:["id","user_id"]}),c("#outcome_results_list").append(f),f.show()}return""}}),c(".delete_alignment_link").click(function(a){a.preventDefault(),c(this).parents(".alignment").confirmDelete({url:c(this).attr("href"),message:b.t("remove_outcome_alignment","Are you sure you want to remove this alignment?"),success:function(a){c(this).slideUp(function(){c(this).remove()})}})}),c("#alignments.orderable").sortable({axis:"y",handle:".move_alignment_link",update:function(a,b){var d=[];c("#alignments .alignment").each(function(){d.push(c(this).getTemplateData({textValues:["id"]}).id)});var e=c("#outcome_urls .reorder_alignments_url:last").attr("href");c.ajaxJSON(e,"POST",{order:d.join(",")},function(a){},function(){})}});var d=function(a){a.title=a["item[title]"]||a.title;var b=c("#alginment_"+a.id);b.length===0&&(b=c("#alignment_blank").clone(!0).removeAttr("id")),b.addClass(c.underscore(a.content_type));var d=c.titleize(a.content_type)||"Alignment";b.find(".type_icon").attr("alt",d).attr("title",d),b.attr("id","alignment_"+(a.id||"new"));var e=["user_id"];return a.id&&(e=["user_id","id"]),b.fillTemplateData({data:a,hrefValues:e}),c("#alignments").append(b.show()),b};c(".add_outcome_alignment_link").live("click",function(e){e.preventDefault();if(a&&a.selectContentDialog){var f={for_modules:!1};f.select_button_text=b.t("align_item","Align Item"),f.holder_name=b.t("this_outcome","this Outcome"),f.dialog_title=b.t("align_to_outcome","Align Item to this Outcome"),f.submit=function(a){var b=d(a),e=c("#outcome_urls .align_url").attr("href");a.asset_string=a["item[type]"]+"_"+a["item[id]"],b.loadingImage({image_size:"small"}),c.ajaxJSON(e,"POST",a,function(a){b.loadingImage("remove"),b.remove(),d(a.content_tag),c("#alignments.orderable").sortable("refresh")})},a.selectContentDialog(f)}}),c("#artifacts li").live("mouseover",function(){c(".hover_alignment,.hover_artifact").removeClass("hover_alignment").removeClass("hover_artifact"),c(this).addClass("hover_artifact")}),c("#alignments li").live("mouseover",function(){c(".hover_alignment,.hover_artifact").removeClass("hover_alignment").removeClass("hover_artifact"),c(this).addClass("hover_alignment")})})}),function(){require(["learning_outcome"])}.call(this),define("compiled/bundles/learning_outcome",function(){})