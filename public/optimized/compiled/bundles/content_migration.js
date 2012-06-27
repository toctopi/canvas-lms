define("translations/content_imports",["i18nObj","jquery"],function(a,b){b.extend(!0,a,{translations:{es:{content_imports:{buttons:{"import":"Importar el Curso"},errors:{failed:"La importación del curso falló  con los siguientes errores:",upload_failed:"La carga falló , intente de nuevo"},messages:{copying:"Copiando esto tomará unos cuantos minutos",uploading:"Cargando la Exportación del Curso..."}}}}})}),define("content_migration",["i18n!content_imports","jquery","jquery.instructure_forms","jquery.instructure_misc_plugins"],function(a,b){b(function(){function c(a){a=typeof a!="undefined"?a:".zip",k.text(a),g.val("1"),j.show()}function d(){p.show()}function e(){f.find("#migration_config > div").hide(),g.val("0"),j.hide(),l.val(""),i.attr("disabled",!0),p.hide(),q.removeAttr("checked"),m.find(".migration_config").ifExists(function(){$plugin_mother=n.find(b(this).data("mother_id")),$plugin_mother.append(b(this)),$plugin_mother.triggerHandler("pluginHidden",[h,o]),$alt_config=o.find(".migration_alt_config"),$alt_config&&$plugin_mother.append($alt_config)})}var f=b("#config_options"),g=b("#export_file_enabled"),h=b("#migration_form"),i=h.find(".submit_button"),j=h.find("#file_upload"),k=h.find("#upload_extension"),l=h.find("#export_file_input"),m=h.find("#migration_config"),n=b("#migration_configs"),o=b("#migration_alt_div"),p=b("#overwrite_questions_config"),q=b("#overwrite_questions");b("#choose_migration_system").change(function(){e(),b(this).val()=="none"?f.hide():(plugin_config_id="#plugin_"+b(this).val(),$plugin_mother_div=n.find(plugin_config_id),$plugin_config=$plugin_mother_div.find(".migration_config"),$plugin_config.data("mother_id",plugin_config_id),m.append($plugin_config),$plugin_alt_config=$plugin_mother_div.find(".migration_alt_config"),$plugin_alt_config&&($plugin_alt_config.data("mother_id",plugin_config_id),o.append($plugin_alt_config)),f.show(),$plugin_mother_div.triggerHandler("pluginShown",[c,h,d]))}).change(),b("#import_subset").change(function(){b("#import_subset_options").showIf(b(this).attr("checked"))}).change(),b("#export_file_input").change(function(){b(this).val().match(/\.zip$|\.imscc$/i)?(i.attr("disabled",!1),b(".zip_error").hide()):(i.attr("disabled",!0),b(".zip_error").show())}),b("#migration_form").formSubmit({fileUpload:function(){return g.val()=="1"},fileUploadOptions:{preparedFileUpload:!0,singleFile:!0,object_name:"migration_settings",context_code:b("#current_context_code").text(),upload_only:!0,uploadDataUrl:h.attr("action"),formDataTarget:"uploadDataUrl"},processData:function(a){return g.val()!="1"&&(a.export_file=null),a},beforeSubmit:function(c){g.val()=="1"&&b(this).find(".submit_button").attr("disabled",!0).text(a.t("messages.uploading","Uploading Course Export..."))},success:function(c){b(this).find(".submit_button").attr("disabled",!1).text(a.t("buttons.import","Import Course")),b(this).slideUp(),b("#file_uploaded").slideDown()},error:function(c){g.val()=="1"&&b(this).find(".submit_button").attr("disabled",!1).text(a.t("errors.upload_failed","Upload Failed, please try again")),b(this).formErrors(c)}})})}),function(){require(["content_migration"])}.call(this),define("compiled/bundles/content_migration",function(){})