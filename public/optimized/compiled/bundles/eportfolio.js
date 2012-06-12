define("translations/eportfolio",["i18nObj","jquery"],function(a,b){b.extend(!0,a,{translations:{es:{eportfolio:{buttons:{done_editing:"Completó la Edición",manage_sections:"Maneje la Secciones"},confirm_delete_message:"¿Está seguro de que quiere borrar este mensaje?",confirm_delete_page:"¿Borre esta página y todo su contenido?",confirm_delete_section:"¿Borre esta sección y todas sus páginas?",default_description:"Esta es mi envío de %{assignment} para %{course}.",eportfolio_settings:"Configuraciones del ePortafolio",errors:{compiling:"Hubo un error en la compilación de su eportafolio. Intente de nuevo en un momento.",missing_file:"Por favor seleccione un archivo",upload_failed:"La Carga Falló."},links:{manage_pages:"Haga click para editar, arrastre para reordenar"},titles:{add_submission:"Agregue la Página para el Enviado",download_eportfolio:"Descargar el ePortafolio",section_list:"Arrastre para arreglar, haga click para editar"}},eportfolios:{_page_section:{section_types:{attachment:"Carga de Imagen/Archivo",html:"Contenido HTML/Integrado",rich_text:"Contenido de Texto Enriquecido",submission:"Envío del Curso"}},show:{headers:{export_progress:"Recolectando recursos para su ePortafolio. Esto puede tomar un momento si tiene muchos archivos en su ePortafolio."}}}}}})}),define("eportfolio",["i18n!eportfolio","jquery","jquery.ajaxJSON","jquery.inst_tree","jquery.instructure_forms","jqueryui/dialog","jquery.instructure_misc_helpers","jquery.instructure_misc_plugins","jquery.loadingImg","jquery.templateData","compiled/tinymce","tinymce.editor_box","vendor/jquery.scrollTo","jqueryui/progressbar","jqueryui/sortable"],function(a,b){function c(){var a=b("#edit_page_form").getFormData({object_name:"eportfolio_entry",values:["eportfolio_entry[name]","eportfolio_entry[allow_comments]","eportfolio_entry[show_comments]"]}),c=0;return b("#edit_page_form .section").each(function(){var d=b(this).getTemplateData({textValues:["section_type"]}).section_type;if(d=="rich_text"||d=="html"||b(this).hasClass("read_only")){c++;var e="section_"+c;d=="rich_text"?(a[e+"[section_type]"]="rich_text",a[e+"[content]"]=b(this).find(".edit_section").editorBox("get_code")):d=="html"?(a[e+"[section_type]"]="html",a[e+"[content]"]=b(this).find(".edit_section").val()):d=="submission"?(a[e+"[section_type]"]="submission",a[e+"[submission_id]"]=b(this).getTemplateData({textValues:["submission_id"]}).submission_id):d=="attachment"&&(a[e+"[section_type]"]="attachment",a[e+"[attachment_id]"]=b(this).getTemplateData({textValues:["attachment_id"]}).attachment_id)}}),a.section_count=c,a}function d(a){var c=b("#"+a+"_name_holder"),d=b("#"+a+"_name"),e=d.val(),f=c.parents("li."+a);f.find(".name").text(e),f.parent("ul").length>0&&(c.hide().appendTo(b("body")),f.find("."+a+"_url").show()),f.attr("id")==a+"_new"&&f.remove()}function e(a,c){var d=a.data("event_pending");if(d||a.length===0)return;a.data("event_pending",!0);var e="PUT",f=a.find(".rename_"+c+"_url").attr("href");a.attr("id")==c+"_new"&&(e="POST",f=b(".add_"+c+"_url").attr("href"));var h=a.parents("ul").find("."+c+":not(.unsaved)"),i=a.find("#"+c+"_name").val();h.each(function(){this!=a[0]&&b(this).find(".name").text()==i&&(i="")});if(!i)return!1;var j="eportfolio_category";c=="page"&&(j="eportfolio_entry");var k={};return k[j+"[name]"]=i,c=="page"&&(k[j+"[eportfolio_category_id]"]=b("#eportfolio_category_id").text()),e=="POST"&&a.attr("id",c+"_saving"),a.addClass("event_pending"),b.ajaxJSON(f,e,k,function(d){a.removeClass("event_pending"),a.removeClass("unsaved");var f=d[j];e=="POST"?(a.remove(),b(document).triggerHandler(c+"_added",d)):b(document).triggerHandler(c+"_updated",d),a.fillTemplateData({data:f,id:c+"_"+f.id,hrefValues:["id","slug"]}),a.data("event_pending",!1),g(c)}),!0}function f(a,c){var d=a.find("."+c+"_url"),e=d.outerWidth()-30;c=="page"?e=145:e=145;var f=b("#"+c+"_name_holder"),g=b("#"+c+"_name");g.width(e),d.hide().before(f),g.val(b.trim(d.find(".name").text())),f.show(),g.focus().select()}function g(a){var c=b("#"+a+"_list ."+a+":not(.unsaved)").length;c>1?b("#"+a+"_list .remove_page_link").css("display",""):b("#"+a+"_list .remove_page_link").hide()}b(document).ready(function(){b(".portfolio_settings_link").click(function(c){c.preventDefault(),b("#edit_eportfolio_form").dialog("close").dialog({autoOpen:!1,width:"auto",title:a.t("eportfolio_settings","ePortfolio Settings")}).dialog("open")}),b("#edit_eportfolio_form .cancel_button").click(function(a){b("#edit_eportfolio_form").dialog("close")}),b("#edit_eportfolio_form").formSubmit({object_name:"eportfolio",beforeSubmit:function(a){b(this).loadingImage()},success:function(a){b(this).loadingImage("remove"),b(this).dialog("close")}}),b(".edit_content_link").click(function(a){a.preventDefault(),b(".edit_content_link_holder").hide(),b("#page_content").addClass("editing"),b("#edit_page_form").addClass("editing"),b("#page_sidebar").addClass("editing"),b("#edit_page_form .section").each(function(){var a=b(this),c=a.getTemplateData({textValues:["section_type"],htmlValues:["section_content"]});c.section_content=b.trim(c.section_content);var d=c.section_type,e="edit_"+d+"_content",f=b("#edit_content_templates ."+e).clone(!0);a.append(f.show()),e=="edit_html_content"?(f.find(".edit_section").attr("id","edit_"+a.attr("id")),f.find(".edit_section").val(c.section_content)):e=="edit_rich_text_content"&&(f.find(".edit_section").attr("id","edit_"+a.attr("id")),f.find(".edit_section").editorBox().editorBox("set_code",c.section_content))}),b("#edit_page_form :text:first").focus().select(),b("#page_comments_holder").hide(),b(document).triggerHandler("editing_page")}),b("#edit_page_form").find(".allow_comments").change(function(){b("#edit_page_form .show_comments_box").showIf(b(this).attr("checked"))}).change(),b("#edit_page_sidebar .submit_button").click(function(a){b("#edit_page_form").submit()}),b("#edit_page_form,#edit_page_sidebar").find(".preview_button").click(function(){b("#page_content .section.failed").remove(),b("#edit_page_form,#page_content,#page_sidebar").addClass("previewing"),b("#page_content .section").each(function(){var a=b(this).find(".section_content").clone().removeClass("section_content").addClass("preview_content").addClass("preview_section"),c=b(this).getTemplateData({textValues:["section_type"]}).section_type;c=="html"?(a.html(b(this).find(".edit_section").val()),b(this).find(".section_content").after(a)):c=="rich_text"&&(a.html(b(this).find(".edit_section").editorBox("get_code")),b(this).find(".section_content").after(a))})}).end().find(".keep_editing_button").click(function(){b("#edit_page_form,#page_content,#page_sidebar").removeClass("previewing"),b("#page_content .preview_section").remove()}).end().find(".cancel_button").click(function(){b("#edit_page_form,#page_content,#page_sidebar").removeClass("editing"),b("#page_content .section.unsaved").remove(),b(".edit_content_link_holder").show(),b("#edit_page_form .edit_section").each(function(){b(this).editorBox("destroy"),b(this).remove()}),b("#page_content .section .form_content").remove(),b("#page_comments_holder").show()}),b("#edit_page_form").formSubmit({processData:function(a){b("#page_content .section.unsaved").removeClass("unsaved"),b("#page_content .section.failed").remove(),b("#page_content .section").each(function(){var a=b(this).getTemplateData({textValues:["section_type"]}).section_type;if(a=="rich_text"||a=="html"){var c=b(this).find(".edit_section").val();a=="rich_text"&&(c=b(this).find(".edit_section").editorBox("get_code")),b(this).find(".section_content").html(c)}else b(this).hasClass("read_only")||b(this).remove()});var a=c();return a},beforeSubmit:function(a){b("#edit_page_form,#page_content,#page_sidebar").removeClass("editing").removeClass("previewing"),b("#page_content .section.unsaved").remove(),b("#edit_page_form .edit_section").each(function(){b(this).editorBox("destroy"),b(this).remove()}),b(this).loadingImage()},success:function(a){b(".edit_content_link_holder").show(),a.eportfolio_entry.allow_comments&&b("#page_comments_holder").slideDown("fast"),b(this).loadingImage("remove")}}),b("#edit_page_form .switch_views_link").click(function(a){a.preventDefault(),b("#edit_page_content").editorBox("toggle")}),b("#edit_page_sidebar .add_content_link").click(function(c){c.preventDefault(),b("#edit_page_form .keep_editing_button:first").click();var d=b("#page_section_blank").clone(!0).attr("id","page_section_"+sectionCountIdx);d.addClass("unsaved"),d.attr("id","page_section_"+sectionCountIdx++),b("#page_content").append(d);var e="rich_text",f=a.t("#eportfolios._page_section.section_types.rich_text","Rich Text Content");b(this).hasClass("add_html_link")?(e="html",f=a.t("#eportfolios._page_section.section_types.html","HTML/Embedded Content")):b(this).hasClass("add_submission_link")?(e="submission",f=a.t("#eportfolios._page_section.section_types.submission","Course Submission")):b(this).hasClass("add_file_link")&&(e="attachment",f=a.t("#eportfolios._page_section.section_types.attachment","Image/File Upload"));var g="edit_"+e+"_content";d.fillTemplateData({data:{section_type:e,section_type_name:f}});var h=b("#edit_content_templates ."+g).clone(!0);d.append(h.show()),g=="edit_html_content"?h.find(".edit_section").attr("id","edit_"+d.attr("id")):g=="edit_rich_text_content"&&(h.find(".edit_section").attr("id","edit_"+d.attr("id")),h.find(".edit_section").editorBox()),d.hide().slideDown("fast",function(){b("html,body").scrollTo(d),e=="rich_text"?h.find(".edit_section").editorBox("focus",!0):e=="html"&&h.find(".edit_section").focus().select()})}),b(".delete_page_section_link").click(function(a){a.preventDefault(),b(this).parents(".section").confirmDelete({success:function(){b(this).slideUp(function(){b(this).remove()})}})}),b("#page_content").sortable({handle:".move_link",helper:"clone",axis:"y",start:function(a,c){var d=b(c.item);d.getTemplateData({textValues:["section_type"]}).section_type=="rich_text"&&d.find("textarea").editorBox("destroy")},stop:function(a,c){var d=b(c.item);d.getTemplateData({textValues:["section_type"]}).section_type=="rich_text"&&d.find("textarea").editorBox()}}),b("#page_content").delegate(".cancel_content_button","click",function(a){a.preventDefault(),b(this).parents(".section").slideUp(function(){b(this).remove()})}).delegate(".select_submission_button","click",function(a){a.preventDefault();var c=b(this).parents(".section"),d=c.find(".submission_list li.active-leaf:first");if(d.length===0)return;var e=d.find(".submission_preview_url").attr("href"),f=d.attr("id").substring(11);c.fillTemplateData({data:{submission_id:f}}),c.find(".section_content").empty();var g=b("#edit_content_templates").find(".submission_preview").clone();g.attr("src",e),c.append(g),c.addClass("read_only")}).delegate(".upload_file_button","click",function(a){a.preventDefault(),a.stopPropagation();var c=b(this).parents(".section"),d=b("#edit_content_templates").find(".uploading_file").clone(),e=b(this).parents(".section").find(".file_upload");if(!e.val()&&c.find(".file_list .leaf.active").length===0)return;d.fillTemplateData({data:{file_name:e.val()}}),b(this).parents(".section").find(".section_content").empty().append(d.show());var f=b("#upload_file_form").clone(!0).attr("id","");b("body").append(f.hide()),f.data("section",c),f.find(".file_upload").remove().end().append(e).submit(),c.addClass("read_only")}),b("#upload_file_form").formSubmit({fileUpload:!0,object_name:"attachment",processData:function(c){if(!c.uploaded_data){var d=b(this).data("section"),e=d.find(".file_list .leaf.active");if(e.length>0){var c=e.getTemplateData({textValues:["id","name"]}),f=c.id,g=b("#file_uuid_"+f).text(),h=c.name;d.find(".attachment_id").text(f);var i=b(".eportfolio_download_url").attr("href");i=b.replaceTags(i,"uuid",g);if(e.hasClass("image")){var j=b("#eportfolio_view_image").clone(!0).removeAttr("id");j.find(".eportfolio_image").attr("src",i).attr("alt",h),j.find(".eportfolio_download").attr("href",i),d.find(".section_content").empty().append(j)}else{var k=b("#eportfolio_download_file").clone(!0).removeAttr("id");k.fillTemplateData({data:{filename:c.name}}),k.find(".eportfolio_download").attr("href",i),d.find(".section_content").empty().append(k)}b(this).remove()}else b(this).errorBox(a.t("errors.missing_file","Please select a file"));return!1}},success:function(a){var c=b(this).data("section"),d=a.attachment;c.find(".attachment_id").text(d.id);var e=b(".eportfolio_download_url").attr("href");e=b.replaceTags(e,"uuid",d.uuid);if(d.content_type.indexOf("image")!=-1){var f=b("#eportfolio_view_image").clone(!0).removeAttr("id");f.find(".eportfolio_image").attr("src",e).attr("alt",d.display_name),f.find(".eportfolio_download").attr("href",e),c.find(".section_content").empty().append(f)}else{var g=b("#eportfolio_download_file").clone(!0).removeAttr("id");g.fillTemplateData({data:{filename:d.display_name}}),g.find(".eportfolio_download").attr("href",e),c.find(".section_content").empty().append(g)}b(this).remove()},error:function(c){var d=b(this).data("section");d.find(".uploading_file").html(a.t("errors.upload_failed","Upload Failed.")),d.addClass("failed"),d.formErrors(c.errors||c)}}),b("#recent_submissions .submission").click(function(c){if(b(c.target).closest("a").length===0){c.preventDefault(),c.stopPropagation(),b(this).removeClass("active-leaf"),b("#category_select").triggerHandler("change");var d=b(this).getTemplateData({textValues:["submission_id"]}).submission_id;b("#add_submission_form .submission_id").val(d);var e=b(this).find(".assignment_title").text(),f=b(this).find(".context_name").text();b("#add_submission_form .submission_description").val(a.t("default_description","This is my %{assignment} submission for %{course}.",{assignment:e,course:f})),b("#add_submission_form").dialog("close").dialog({autoOpen:!1,title:a.t("titles.add_submission","Add Page for Submission"),width:400,open:function(){b(this).find(":text:visible:first").val(e).focus().select(),b(document).triggerHandler("submission_dialog_opened")}}).dialog("open")}}),b("#add_submission_form .cancel_button").click(function(){b("#add_submission_form").dialog("close")}),b("#add_submission_form").formSubmit({processData:function(a){var c=b(this).find(".add_eportfolio_entry_url").attr("href");b(this).attr("action",c)},beforeSubmit:function(a){b(this).loadingImage()},success:function(a){b(this).loadingImage("remove"),b(this).dialog("close");var c=a.eportfolio_entry;try{var d=c.content[1].submission_id;b("#submission_"+d+",#recent_submission_"+d).addClass("already_used")}catch(e){}var f=b(this).find(".eportfolio_named_entry_url").attr("href");f=b.replaceTags(f,"category_slug",c.category_slug),f=b.replaceTags(f,"slug",c.slug),location.href=f,b(document).triggerHandler("page_added",a)}}),b("#category_select").change(function(a){var c=b(this).val();if(c=="new")return;b("#page_select_list .page_select:not(#page_select_blank)").remove(),b("#structure_category_"+c).find(".entry_list li.entry").each(function(){var a=b("#page_select_blank").clone(!0).removeAttr("id");a.text(b(this).getTemplateData({textValues:["name"]}).name),b("#page_select_list").append(a.show())})}).triggerHandler("change"),b.scrollSidebar(),b(".delete_comment_link").click(function(c){c.preventDefault(),b(this).parents(".comment").confirmDelete({url:b(this).attr("href"),message:a.t("confirm_delete_message","Are you sure you want to delete this message?"),success:function(a){b(this).slideUp(function(){b(this).remove()})}})}),b(".delete_eportfolio_link").click(function(a){a.preventDefault(),b("#delete_eportfolio_form").toggle(function(){b("html,body").scrollTo(b("#delete_eportfolio_form"))})}),b(document).blur(function(){})}),b(document).ready(function(){b(".submission_list").instTree({multi:!1,dragdrop:!1}),b(".file_list > ul").instTree({autoclose:!1,multi:!1,dragdrop:!1,overrideEvents:!0,onClick:function(a,c){b(this).parents(".file_list").find("li.active").removeClass("active"),b(this).addClass("active");if(b(this).hasClass("file"))var d=b(this).getTemplateData({textValues:["id"]}).id}})}),b(document).ready(function(){g("page"),b(document).bind("page_deleted",function(a,c){if(!c)return;var d=c.eportfolio_entry;b("#page_"+d.id).remove(),b("#structure_entry_"+d.id).remove(),g("page")}),b(document).bind("page_added page_updated",function(a,c){var d=c.eportfolio_entry,e=b("#page_"+d.id);e.length===0&&(e=b("#page_blank").clone(!0).removeAttr("id"),b("#page_list").append(e.show())),e.removeClass("unsaved"),e.fillTemplateData({data:d,id:"page_"+d.id,hrefValues:["id","slug"]});var f=b("#structure_entry_"+d.id);f.length===0&&(f=b("#structure_entry_blank").clone(!0).removeAttr("id"),b("#structure_category_"+d.eportfolio_category_id+" .entry_list").append(f)),f.fillTemplateData({id:"structure_entry_"+d.id,data:d}),g("page")}),b(".manage_pages_link,#section_pages .done_editing_button").click(function(c){c.preventDefault(),b("#page_list").hasClass("editing")?(b("#page_list").removeClass("editing"),b("#page_list .page").attr("title",""),b("#page_list").sortable("destroy"),b("#section_pages").removeClass("editing")):(b("#page_list").addClass("editing"),b("#page_list .page").attr("title",a.t("links.manage_pages","Click to edit, drag to reorder")),b("#page_list").sortable({axis:"y",helper:"clone",stop:function(a,b){b.item.addClass("just_dropped")},update:function(a,c){var d=b("#page_list").sortable("toArray"),e=[];for(var f in d){var g=d[f];g=parseInt(g.substring(5)),isNaN(g)||e.push(g)}var h=e.join(","),i={order:h};b("#page_list").loadingImage({image_size:"small"}),b.ajaxJSON(b(".reorder_pages_url").attr("href"),"POST",i,function(a){b("#page_list").loadingImage("remove")})}}),b("#section_pages").addClass("editing"))}),b("#page_list").delegate(".edit_page_link","click",function(a){b(this).parents("li").hasClass("unsaved")&&a.preventDefault();if(b(this).parents("#page_list").hasClass("editing")){a.preventDefault();var c=b(this).parents("li");if(c.hasClass("just_dropped")){c.removeClass("just_dropped");return}f(c,"page")}}),b(".add_page_link").click(function(a){a.preventDefault();var c=b("#page_blank").clone(!0).attr("id","page_new");b("#page_list").append(c.show()),f(c,"page")}),b(".remove_page_link").click(function(c){c.preventDefault(),d("page"),b(this).parents("li").confirmDelete({message:a.t("confirm_delete_page","Delete this page and all its content?"),url:b(this).parents("li").find(".rename_page_url").attr("href"),success:function(a){b(this).fadeOut(function(){b(this).remove(),b(document).triggerHandler("page_deleted",a),g("page")})}})}),b("#page_name").keydown(function(a){if(a.keyCode==27)d("page");else if(a.keyCode==13){b(this).parents("li").find(".name").text(b(this).val());var c=e(b(this).parents("li"),"page");c&&d("page")}}).blur(function(a){var c=!0,f=b(this).parents("li.page");c=e(f,"page"),c&&d("page")})}),b(document).ready(function(){g("section"),b(document).bind("section_deleted",function(a,c){var d=c.eportfolio_category;b("#section_"+d.id).remove(),b("#structure_category_"+d.id).remove(),g("section")}),b(document).bind("section_added section_updated",function(a,c){var d=c.eportfolio_category,e=b("#section_"+d.id);e.length===0&&(e=b("#section_blank").clone(!0).removeAttr("id"),b("#section_list").append(e.show())),e.removeClass("unsaved"),e.fillTemplateData({data:d,id:"section_"+d.id,hrefValues:["id","slug"]});var f=b("#structure_category_"+d.id);f.length===0&&(f=b("#structure_category_blank").clone(!0).removeAttr("id"),b("#eportfolio_structure").append(f)),f.fillTemplateData({id:"structure_category_"+d.id,data:d});var h=b("#category_select_"+d.id);h.length===0&&(h=b("#category_select_blank").clone(!0).removeAttr("id"),b("#category_select").append(h.show())),h.attr("id","category_select_"+d.id).val(d.id).text(d.name),g("section")}),b(".manage_sections_link,#section_list_manage .done_editing_button").click(function(c){c.preventDefault();if(b("#section_list").hasClass("editing")){b("#section_list").sortable("destroy"),b("#section_list_manage").removeClass("editing"),b("#section_list").removeClass("editing").sortable("disable");var d=a.t("buttons.manage_sections","Manage Sections");b(".arrange_sections_link").text(d).val(d),b(".add_section").hide(),b("#section_list > li").attr("title","")}else{b("#section_list_manage").addClass("editing"),b("#section_list").sortable({axis:"y",helper:"clone",stop:function(a,b){b.item.addClass("just_dropped")},update:function(a,c){var d=b("#section_list").sortable("toArray"),e=[];for(var f in d){var g=d[f];g=parseInt(g.substring(8)),isNaN(g)||e.push(g)}var h=e.join(","),i={order:h};b("#section_list").loadingImage({image_size:"small"}),b.ajaxJSON(b(".reorder_sections_url").attr("href"),"POST",i,function(a){b("#section_list").loadingImage("remove")})}}),b("#section_list").addClass("editing").sortable("enable");var e=a.t("buttons.done_editing","Done Editing");b(".arrange_sections_link").text(e).val(e),b(".add_section").show(),b("#section_list > li").attr("title",a.t("titles.section_list","Drag to Arrange, Click to Edit"))}}),b(".add_section_link").click(function(a){a.preventDefault();var c=b("#section_blank").clone(!0).attr("id","section_new");b("#section_list").append(c.show()),f(c,"section")}),b(".remove_section_link").click(function(c){c.preventDefault(),d("section"),b(this).parents("li").confirmDelete({message:a.t("confirm_delete_section","Delete this section and all its pages?"),url:b(this).parents("li").find(".rename_section_url").attr("href"),success:function(a){b(this).fadeOut(function(){b(this).remove(),b(document).triggerHandler("section_deleted",a),g("section")})}})}),b("#section_list").delegate(".edit_section_link","click",function(a){b(this).parents("li").hasClass("unsaved")&&a.preventDefault();if(b(this).parents("#section_list").hasClass("editing")){a.preventDefault();var c=b(this).parents("li");if(c.hasClass("just_dropped")){c.removeClass("just_dropped");return}f(c,"section")}}),b("#section_name").keydown(function(a){if(a.keyCode==27)d("section");else if(a.keyCode==13){b(this).parents("li").find(".name").text(b(this).val());var c=e(b(this).parents("li"),"section");c&&d("section")}}).blur(function(a){var c=!0,f=b(this).parents("li.section");c=e(f,"section"),c&&d("section")}),b(".download_eportfolio_link").click(function(c){b(this).slideUp(),c.preventDefault(),b("#export_progress").progressbar().progressbar("option","value",0);var d=b("#downloading_eportfolio_message");d.slideDown(),d.find(".message").text(a.t("#eportfolios.show.headers.export_progress","Collecting ePortfolio resources. this may take a while if you have a lot of files in your ePortfolio."));var e=b(this).attr("href"),f=0,g=function(c){req_url=e,c&&(req_url=e+"?compile=1"),b.ajaxJSON(req_url,"GET",{},function(a){if(a.attachment&&a.attachment.file_state&&a.attachment.file_state=="available"){b("#export_progress").progressbar("option","value",100),location.href=e+".zip";return}if(a.attachment&&a.attachment.file_state){var c=parseInt(a.attachment.file_state,10);b("#export_progress").progressbar("option","value",Math.max(Math.min(b("#export_progress").progressbar("option","value")+.1,90),c))}else b("#export_progress").progressbar("option","value",Math.min(b("#export_progress").progressbar("option","value")+.1,90));setTimeout(g,2e3)},function(b){f++,f>5?d.find(".message").text(a.t("errors.compiling","There was an error compiling your eportfolio.  Please try again in a little while.")):setTimeout(g,5e3)})};g(!0)}),b(".download_eportfolio_link").click(function(c){b("#downloading_eportfolio_dialog").dialog("close").dialog({autoOpen:!1,title:a.t("titles.download_eportfolio","Download ePortfolio")}).dialog("open")})})}),function(){require(["eportfolio"])}.call(this),define("compiled/bundles/eportfolio",function(){})