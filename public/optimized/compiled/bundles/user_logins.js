define("translations/user_logins",["i18nObj","jquery"],function(a,b){b.extend(!0,a,{translations:{es:{user_logins:{buttons:{add_login:"Agregar el Inicio de la Sesión",save:"Guardar",update_login:"Actualizar el Inicio de la Sesión"},confirms:{delete_login:'¿Seguro que quiere borrar el inicio de la sesión, "%{login}"?'},errors:{passwords_do_not_match:"las contraseñas no coinciden",save_failed:"No se pudo Guardar"},messages:{saving:"Guardando..."},notices:{cant_delete_last_login:"No puede borrar el último inicio de sesión para un usuario"},titles:{add_login:"Agregar Inicio de Sesión",update_login:"Actualizar el inicio de la sesión"}}}}})}),define("user_logins",["i18n!user_logins","jquery","jquery.instructure_forms","jqueryui/dialog","jquery.instructure_misc_plugins","jquery.templateData"],function(a,b){b(document).ready(function(){var c=b("#edit_pseudonym_form"),d=b("#passwordable_account_ids").text().split(",");c.formSubmit({processData:function(c){if(!b(this).hasClass("passwordable")||!c["pseudonym[password]"]&&!c["pseudonym[password_confirmation]"])delete c["pseudonym[password]"],delete c["pseudonym[password_confirmation]"];if((c["pseudonym[password]"]||c["pseudonym[password_confirmation]"])&&c["pseudonym[password]"]!=c["pseudonym[password_confirmation]"])return b(this).formErrors({"pseudonym[password]":a.t("errors.passwords_do_not_match","passwords do not match")}),!1},beforeSubmit:function(c){b(this).find("button").attr("disabled",!0).filter(".submit_button").text(a.t("messages.saving","Saving..."));var d=b(this).find(".account_id select")[0],e=d&&d.selectedIndex;b(this).data("account_name",null),b(this).data("account_name",d&&d.options[e]&&d.options[e].innerHTML)},success:function(c){b(this).find("button").attr("disabled",!1).filter(".submit_button").text(a.t("buttons.save","Save")),b(this).dialog("close");if(b(this).data("unique_id_text"))var d=b(this).data("unique_id_text").parents(".login");else{var d=b("#login_information .login.blank").clone(!0);b("#login_information .add_holder").before(d),d.removeClass("blank"),d.show(),c.account_name=b(this).data("account_name")}d.fillTemplateData({data:c,hrefValues:["id","account_id"]}),d.find(".links").addClass("passwordable"),b("#login_information .login .delete_pseudonym_link").show(),b.flashMessage(a.t("save_succeeded","Save successful"))},error:function(c){b(this).find("button").attr("disabled",!1).filter(".submit_button").text(a.t("errors.save_failed","Save Failed"))}}),b("#edit_pseudonym_form .cancel_button").click(function(){c.dialog("close")}),b("#login_information").delegate(".login_details_link","click",function(a){a.preventDefault(),b(this).parents("tr").find(".login_details").show(),b(this).hide()}).delegate(".edit_pseudonym_link","click",function(c){c.preventDefault();var d=b("#edit_pseudonym_form"),e=d.find(".sis_user_id");e.hide(),d.attr("action",b(this).attr("rel")).attr("method","PUT");var f=b(this).parents(".login").getTemplateData({textValues:["unique_id","sis_user_id","can_edit_sis_user_id"]});f.password="",f.password_confirmation="",d.fillFormData(f,{object_name:"pseudonym"}),f.can_edit_sis_user_id=="true"&&e.show();var g=b(this).parents(".links").hasClass("passwordable");d.toggleClass("passwordable",g),d.find("tr.password").showIf(g),d.find(".account_id").hide(),d.dialog("close").dialog({autoOpen:!1,width:"auto",close:function(){d.data("unique_id_text")&&d.data("unique_id_text").parents(".login").hasClass("blank")&&d.data("unique_id_text").parents(".login").remove()}}).dialog("open"),d.dialog("option","title",a.t("titles.update_login","Update Login")).find(".submit_button").text(a.t("buttons.update_login","Update Login"));var h=b(this).parents(".login").find(".unique_id");d.data("unique_id_text",h),d.find(":input:visible:first").focus().select()}).delegate(".delete_pseudonym_link","click",function(c){c.preventDefault();if(b("#login_information .login:visible").length<2){alert(a.t("notices.cant_delete_last_login","You can't delete the last login for a user"));return}var d=b(this).parents(".login").find(".unique_id").text();b(this).parents(".login").confirmDelete({message:a.t("confirms.delete_login",'Are you sure you want to delete the login, "%{login}"?',{login:d}),url:b(this).attr("rel"),success:function(){b(this).fadeOut(),b("#login_information .login:visible").length<2&&b("#login_information .login .delete_pseudonym_link").hide()}})}).delegate(".add_pseudonym_link","click",function(d){d.preventDefault(),b("#login_information .login.blank .edit_pseudonym_link").click(),c.attr("action",b(this).attr("rel")).attr("method","POST"),c.fillFormData({"pseudonym[unique_id]":""}),c.dialog("option","title",a.t("titles.add_login","Add Login")).find(".submit_button").text(a.t("buttons.add_login","Add Login")),c.addClass("passwordable"),c.find("tr.password").show(),c.find(".account_id").show(),c.find(".account_id_select").change(),c.data("unique_id_text",null)})})}),function(){require(["user_logins"])}.call(this),define("compiled/bundles/user_logins",function(){})