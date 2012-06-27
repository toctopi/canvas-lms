define("translations/conferences",["i18nObj","jquery"],function(a,b){b.extend(!0,a,{translations:{es:{conferences:{confirm:{close:"¿Seguro que quiere finalizar esta conferencia? No podrá volver a abrirla.","delete":"¿Seguro que quiere borrar esta conferencia?",quit:"Parece que ya está editando otra conferencia. ¿Desea continuar? Cualquier cambio no guardado se perderá."},index:{buttons:{create:"Crear una Conferencia",update:"Actualizar la Conferencia"},edit_conference_heading:"Editar los Detalles de la Conferencia",new_conference_heading:"Iniciar una Conferencia Nueva"},loading_urls_message:"Cargando, por favor espere...",multiple_urls_message:"Hay múltiples páginas %{type} disponibles para esta conferencia. Seleccione uno:",no_urls_error:"Perdon, parece que no hay páginas %{type} para esta conferencia todavía."}}}})}),define("conferences",["INST","i18n!conferences","jquery","jquery.ajaxJSON","jquery.instructure_forms","jqueryui/dialog","jquery.instructure_misc_helpers","jquery.instructure_misc_plugins","jquery.keycodes","jquery.loadingImg","jquery.rails_flash_notifications","jquery.templateData"],function(a,b,c){c(document).ready(function(){c("#add_conference_form .cancel_button").click(function(){c("#add_conference_form").prev(".conference").length>0?c("#add_conference_form").hide():c("#add_conference_form").slideUp(),c("#add_conference_form").prev(".conference").show()}),c("#add_conference_form :text").keycodes("esc",function(){c("#add_conference_form").find(".cancel_button").click()}),c("#add_conference_form").formSubmit({object_name:"web_conference",beforeSubmit:function(a){var b=c(this).prev(".conference");return b.length==0?(b=c("#conference_blank").clone(!0).attr("id",""),c("#conferences").prepend(b.show())):b.show(),c("#add_conference_form").hide(),b.loadingImage(),a.duration||(a.long_running="1"),b.fillTemplateData({data:a}),b.find(".join_conference_link").hide(),b},success:function(a,b){c("#no_conferences_message").slideUp(),b.loadingImage("remove"),b.fillTemplateData({data:a.web_conference,hrefValues:["id"]}),a.web_conference&&a.web_conference.permissions&&(b.find(".edit_conference_link").showIf(a.web_conference.permissions.update),b.find(".delete_conference_link").showIf(a.web_conference.permissions["delete"]),(a.web_conference.permissions.initiate||a.web_conference.permissions.join)&&b.find(".join_conference_link").show())},error:function(a,b){b.loadingImage("remove"),b.remove(),c(this).show()}}),c("#add_conference_form select").change(function(b){var d=a.webConferenceUserSettingTemplates[c(this).val()],e="";c.each(d,function(a,b){e+=b.html+"<br>"}),c("#web_conference_user_settings").html(e)}),c(".edit_conference_link, .add_conference_link").click(function(d){d.preventDefault();var e=c("#add_conference_form");if(e.is(":visible"))if(confirm(b.t("confirm.quit","It looks like you are already editing another conference. Do you wish to continue? Any unsaved changes will be lost.")))e.prev(".conference").show();else return;var f=c(this).hasClass("edit_conference_link"),g=c(this).parents(".conference");f||(g=c("#conference_blank"));var h=g.getTemplateData({textValues:["title","duration","description","user_ids","conference_type","long_running","has_advanced_settings","id"].concat(a.webConferenceUserSettings)});if(f){e.find("span.title").text(b.t("index.edit_conference_heading","Edit Conference Details")),e.find("button[type=submit]").text(b.t("index.buttons.update","Update Conference")),e.attr("method","PUT").attr("action",c(this).attr("href")),e.find("select").attr("disabled",!0);var i=e.find(".advanced_settings").showIf(parseInt(h.has_advanced_settings));i.attr("href",c.replaceTags(i.data("base-href"),{id:h.id})),g.after(e),e.find("#members_list").show().find(":checkbox").attr("checked",!1).end().end().find(".all_users_checkbox").attr("checked",!1);var j=(h.user_ids||"").split(",");for(var k in j){var l=j[k];e.find("#members_list .member.user_"+l).find(":checkbox").attr("checked",!0)}h.conference_type&&(e.find("select").val(h.conference_type).change(),delete h.conference_type)}else delete h.conference_type,e.find("span.title").text(b.t("index.new_conference_heading","Start a New Conference")),e.find("button[type=submit]").text(b.t("index.buttons.create","Create Conference")),e.attr("method","POST").attr("action",c(".add_conference_url").attr("href")),e.find("select").attr("disabled",!1),e.find(".advanced_settings").hide(),e.find(".all_users_checkbox").attr("checked",!0).end().find("#members_list").hide().find(":checkbox").attr("checked",!1),c("#conferences").before(e);e.fillFormData(h,{object_name:"web_conference"}),e.find("#web_conference_long_running").change(function(){c(this).attr("checked")?e.find("#web_conference_duration").attr("disabled",!0).val(""):e.find("#web_conference_duration").attr("disabled",!1).val(a.webConferenceDefaultDuration)}).change(),g.hide(),f?(e.show(),e.find(":input:visible:first").focus().select()):e.slideDown(function(){c(this).find(":input:visible:first").focus().select()})}),c(".delete_conference_link").click(function(a){a.preventDefault(),c(this).parents(".conference").confirmDelete({url:c(this).attr("href"),message:b.t("confirm.delete","Are you sure you want to delete this conference?"),success:function(){c("#conferences .conference:visible").length<=1&&c("#no_conferences_message").slideDown(),c(this).slideUp(function(){c(this).remove()})}})}),c(".all_users_checkbox").change(function(){c(this).attr("checked")?c("#members_list").slideUp():c("#members_list").slideDown()}).change(),c(document).fragmentChange(function(a,b){(match=b.match(/^#conference_\d+$/))&&c(match[0]).find(".edit_conference_link").click()}),c(".close_conference_link").click(function(){var a=c(this).parents(".conference");event.preventDefault(),confirm(b.t("confirm.close","Are you sure you want to end this conference? You will not be able to reopen it"))&&(a.loadingImage(),a.find(".close_conference_link, .join_conference_link, .edit_conference_link").hide(),c.ajaxJSON(c(this).attr("href"),"POST",{},function(b){c("#no_conferences_message").slideUp(),a.loadingImage("remove")}))}),c(".external_url").click(function(a){a.preventDefault();var d=b.t("loading_urls_message","Loading, please wait..."),e=c(this),f=e.text();if(f==d)return;e.text(d),c.ajaxJSON(e.attr("href"),"GET",{},function(a){e.text(f);if(a.length==0)c.flashError(b.t("no_urls_error","Sorry, it looks like there aren't any %{type} pages for this conference yet.",{type:e.attr("name")}));else if(a.length>1){$box=c(document.createElement("DIV")),$box.append(c("<p />").text(b.t("multiple_urls_message","There are multiple %{type} pages available for this conference. Please select one:",{type:e.attr("name")})));for(var d=0;d<a.length;d++)$a=c("<a />",{href:a[d].url||e.attr("href")+"&url_id="+a[d].id,target:"_blank"}),$a.text(a[d].name),$box.append($a).append("<br>");$box.dialog("close").dialog({autoOpen:!1,width:425,minWidth:425,minHeight:215,resizable:!0,height:"auto",title:e.text()}).dialog("open")}else window.open(a[0].url)})})})}),function(){require(["conferences"])}.call(this),define("compiled/bundles/conferences",function(){})