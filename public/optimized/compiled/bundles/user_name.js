define("translations/user_name",["i18nObj","jquery"],function(a,b){b.extend(!0,a,{translations:{es:{user_name:{buttons:{update_user:"Actualizar Usuario"},confirms:{remove_profile_picture:"¿Seguro que quiere remover la fotografía del perfil del usuario?"},errors:{failed_to_remove_image:"No se pudo remover la imagen, intente de nuevo",failed_to_report_image:"No se pudo reportar la imagen, intente de nuevo",updating_user_details_failed:"No se pudo actualizar los detalles del usuario, intente de nuevo"},messages:{removing_image:"Remoción de imagen...",reporting_image:"Reportando imagen...",updating_user_details:"Actualizando Detalles del Usuario..."},notices:{image_reported:"Esta imagen ha sido reportada"}}}}})}),define("user_utils",["jquery"],function(a){return{nameParts:function(b,c){var d=/^(Sn?r\.?|Senior|Jn?r\.?|Junior|II|III|IV|V|VI|Esq\.?|Esquire)$/i,e,f,g,h,i,j;return!b||a.trim(b)===""?[null,null,null]:(j=a.map(b.split(","),function(b){return a.trim(b)}),e=j[0],f=j[1],g=j.slice(2).join(", "),g===""&&(g=null),g&&!d.test(g)&&(f=f+" "+g,g=null),typeof f=="string"?!g&&d.test(f)&&(g=f,f=e,e=null):(f=a.trim(b),e=null),h=f.split(/\s+/),h.length===1&&h[0]===""&&(h=[]),!g&&h.length>1&&d.test(h[h.length-1])&&(g=h.pop()),!e&&c&&!/^\s*$/.test(c)&&(i=c.split(/\s+/))&&h.length>=i.length&&h.slice(h.length-i.length).join(" ")===i.join(" ")&&(e=h.splice(h.length-i.length,i.length).join(" ")),!e&&h.length>1&&(e=h.pop()),[h.length===0?null:h.join(" "),e,g])},lastNameFirst:function(b){var c=a.trim([b[0],b[2]].join(" "));return a.trim(b[1]?b[1]+", "+c:c)},firstNameFirst:function(b){return a.trim(b.join(" ").replace(/\s+/," "))}}}),define("user_sortable_name",["jquery","user_utils"],function(a,b){a(function(){var c=a('input[name="user[short_name]"]'),d=c.parents("form").find('input[name="user[name]"]'),e=a('input[name="user[sortable_name]"]'),f=d.attr("value");d.keyup(function(){var g=d.attr("value"),h=e.attr("value"),i=b.nameParts(h);if(jQuery.trim(h)===""||b.firstNameFirst(i)===jQuery.trim(f)){var j=b.nameParts(g,i[1]);e.attr("value",b.lastNameFirst(j))}var k=c.attr("value");(jQuery.trim(k)===""||k===f)&&c.attr("value",g),f=a(this).attr("value")})})}),define("user_name",["i18n!user_name","jquery","jquery.ajaxJSON","jquery.instructure_forms","jqueryui/dialog","jquery.templateData"],function(a,b){b(document).ready(function(){b("#name_and_email").delegate(".edit_user_link","click",function(a){a.preventDefault(),b("#edit_student_dialog").dialog("close").dialog({autoOpen:!1,width:450}).dialog("open"),b("#edit_student_form :text:visible:first").focus().select()}),b("#edit_student_form").formSubmit({beforeSubmit:function(c){b(this).find("button").attr("disabled",!0).filter(".submit_button").text(a.t("messages.updating_user_details","Updating User Details..."))},success:function(c){b(this).find("button").attr("disabled",!1).filter(".submit_button").text(a.t("buttons.update_user","Update User")),b("#name_and_email .user_details").fillTemplateData({data:c}),b("#edit_student_dialog").dialog("close")},error:function(c){b(this).find("button").attr("disabled",!1).filter(".submit_button").text(a.t("errors.updating_user_details_failed","Updating user details failed, please try again"))}}),b("#edit_student_dialog .cancel_button").click(function(){b("#edit_student_dialog").dialog("close")}),b(".remove_avatar_picture_link").click(function(c){c.preventDefault();var d=b(this),e=confirm(a.t("confirms.remove_profile_picture","Are you sure you want to remove this user's profile picture?"));if(!e)return;d.text(a.t("messages.removing_image","Removing image...")),b.ajaxJSON(d.attr("href"),"PUT",{"avatar[state]":"none"},function(a){d.parents("tr").find(".avatar_image").remove(),d.remove()},function(b){d.text(a.t("errors.failed_to_remove_image","Failed to remove the image, please try again"))})}),b(".report_avatar_picture_link").click(function(c){c.preventDefault(),c.preventDefault();var d=b(this);d.text(a.t("messages.reporting_image","Reporting image...")),b.ajaxJSON(d.attr("href"),"POST",{},function(b){d.after(a.t("notices.image_reported","This image has been reported")),d.remove()},function(b){d.text(a.t("errors.failed_to_report_image","Failed to report the image, please try again"))})})})}),function(){require(["user_name","user_sortable_name"])}.call(this),define("compiled/bundles/user_name",function(){})