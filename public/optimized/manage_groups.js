define(["i18n!groups","jquery","underscore","jqueryui/draggable","jquery.ajaxJSON","jquery.instructure_forms","jqueryui/dialog","jquery.instructure_misc_helpers","jquery.instructure_misc_plugins","jquery.loadingImg","jquery.rails_flash_notifications","jquery.templateData","vendor/jquery.scrollTo","jqueryui/droppable","jqueryui/tabs"],function(a,b,c){window.contextGroups={autoLoadGroupThreshold:15,paginationSize:15,populateUserElement:function(a,b){b.sections&&(b.section_id=c(b.sections).pluck("section_id").join(","),b.section_code=c(b.sections).pluck("section_code").join(", ")),a.removeClass("user_template"),a.addClass("user_id_"+b.user_id),a.fillTemplateData({data:b})},loadMembersForGroup:function(a){var c=b("#manage_group_urls .list_users_url").attr("href"),d=a.getTemplateData({textValues:["group_id"]}).group_id;c=b.replaceTags(c,"id",d),a.find(".load_members_link").hide(),a.find(".loading_members").show(),b.ajaxJSON(c,"GET",null,function(c){a.find(".student").remove();var d=b(".user_template");for(var e=0;e<c.length;e++){var f=d.clone();contextGroups.populateUserElement(f,c[e]),contextGroups.insertIntoGroup(f,a),a.find(".user_count_hidden").text("0"),b(window).triggerHandler("resize"),contextGroups.updateCategoryCounts(a.parents(".group_category"))}a.find(".loading_members").hide()})},loadUnassignedMembersPage:function(c,d){if(d<0&&c.data("page_loaded"))return;d=Math.abs(d),d==0&&(d=c.data("page_loaded")||1);var e=c.find(".student_list .student").length,f=parseInt(c.find(".user_count_hidden").text()),g=e+f;g>0&&(d=Math.min(d,Math.floor((g-1)/contextGroups.paginationSize)+1));var h=c.closest(".group_category").data("category_id"),i=b("#manage_group_urls .list_unassigned_users_url").attr("href");i+="?category_id="+h+"&page="+d,c.find(".load_members_link").hide(),c.find(".loading_members").show(),b.ajaxJSON(i,"GET",null,function(e){c.data("page_loaded",d),c.find(".user_count").text(a.t("category.student","student",{count:e.total_entries})),c.find(".user_count_hidden").text(e.total_entries-e.users.length),c.find(".group_user_count").show(),c.find(".student").remove();var f=b(".user_template"),g=e.users;for(var h=0;h<g.length;h++){var i=f.clone();contextGroups.populateUserElement(i,g[h]),contextGroups.insertIntoGroup(i,c)}c.find(".loading_members").html(e.pagination_html),c.find(".unassigned_members_pagination a").click(function(a){a.preventDefault();var c=/page=(\d+)/;match=c.exec(b(this).attr("href"));if(match.length>=1){var d=match[1];contextGroups.loadUnassignedMembersPage(b(this).closest(".group_blank").first(),d)}}),b(window).triggerHandler("resize")})},moveToGroup:function(c,d){if(c.parents(".group")[0]==d[0])return;var e=d.getTemplateData({textValues:["group_id"]}).group_id,f=c.getTemplateData({textValues:["user_id"]}).user_id,g=c.parents(".group"),h=b("#manage_group_urls .add_user_url").attr("href");method="POST";if(!e||e.length==0)h=b("#manage_group_urls .remove_user_url").attr("href"),method="DELETE",e=g.getTemplateData({textValues:["group_id"]}).group_id;h=b.replaceTags(h,"id",e);var i={user_id:f};c.remove();var j=c;contextGroups.insertIntoGroup(c,d),$category=d.parents(".group_category");if($category.hasClass("student_organized")&&!d.hasClass("group_blank")){var k=c.clone();j=j.add(k),contextGroups.insertIntoGroup(k,g)}c=j,c.addClass("event_pending"),contextGroups.updateCategoryCounts(d.parents(".group_category")),b.ajaxJSON(h,method,i,function(a){var e=d.parents(".group_category").data("category_id");b(".student.user_"+f).each(function(){var c=b(this).find(".category_"+e+"_group_id");if(!c||c.length==0)c=b(document.createElement("span")),c.addClass("category_"+e+"_group_id"),b(this).find(".data").append(c);c.text(a.group_membership.group_id||"")}),c.removeClass("event_pending"),contextGroups.updateCategoryCounts(d.parents(".group_category"));var h=b(g);h=h.add(d),contextGroups.updateCategoryHeterogeneity(d.parents(".group_category"),h);var i=d.parents(".group_category").find(".group_blank"),j=i.find(".student_list .student").length,k=parseInt(i.find(".user_count_hidden").text());j<=5&&k>0&&contextGroups.loadUnassignedMembersPage(i,0)},function(d){c.remove(),c=c.first(),contextGroups.insertIntoGroup(c,g),c.removeClass("event_pending"),contextGroups.updateCategoryCounts($category);var e;d.errors&&d.errors.user_id?e=d.errors.user_id[0].message:e=a.t("errors.unknown","An unexpected error occurred."),b.flashError(e)})},insertIntoGroup:function(a,c){var d=null,e=a.getTemplateData({textValues:["name","user_id"]}),f=e.name;if(c.find(".student_list .user_id_"+e.user_id).length>0)return;c.find(".student.user_"+e.user_id).remove(),c.find(".student_list .student").each(function(){var a=b(this).getTemplateData({textValues:["name"]}).name;if(a>f)return d=b(this),!1}),d?d.before(a):c.find(".student_list").append(a),a.draggable({helper:function(){var a=b(this).clone().css("cursor","pointer");return a.addClass("dragging"),a.width(b(this).width()),b(this).parents(".group_category").append(a),a}})},updateCategoryCounts:function(c){c.find(".group").each(function(){var c=b(this).find(".student_list .student").length+parseInt(b(this).find(".user_count_hidden").text());b(this).find(".user_count").text(a.t("category.student","student",{count:c}))});var d=c.find(".group:not(.group_blank)").length;c.find(".group_count").text(a.t("group","Group",{count:d})),c.find(".group").each(function(){b(this).find(".expand_collapse_links").showIf(b(this).find(".student_list li").length>0)})},updateCategoryHeterogeneity:function(a,c){var d=!1;c.each(function(){var a={};$section_ids=b(this).find(".student_list .student .section_id");if(!b(this).hasClass("group_blank")&&$section_ids.length>0&&$section_ids.text()){$section_ids.each(function(){var c=b(this).text().split(",");for(var d=0;d<c.length;d++)a[c[d]]||(a[c[d]]=0),a[c[d]]+=1});var c=!0;for(var e in a)a[e]===$section_ids.length&&(c=!1);d=d||c}}),a.find(".heterogenous").text(d?"true":"false")},populateCategory:function(a){var c=b(a);c.find(".group").each(function(){var a=parseInt(b(this).find(".user_count_hidden").text());a<contextGroups.autoLoadGroupThreshold&&a>0&&contextGroups.loadMembersForGroup(b(this))}),c.length&&contextGroups.loadUnassignedMembersPage(c.find(".group_blank"),-1)},updateCategory:function(a,c){a.find(".category_name").text(c.name),b(a.data("tab_link")).text(c.name),b("#sidebar_category_"+c.id+" .category").text(c.name),a.find(".self_signup").text(c.self_signup||""),a.find(".self_signup_text").showIf(c.self_signup),a.find(".restricted_self_signup_text").showIf(c.self_signup==="restricted"),a.find(".assign_students_link").showIf(c.self_signup!=="restricted")},addGroupToSidebar:function(a){if(b("#sidebar_group_"+a.id).length>0)return;var c=b("#sidebar_category_"+a.group_category_id);c.length==0&&(c=b("#sidebar_category_blank").clone(!0),c.find("ul").empty(),c.fillTemplateData({data:a,id:"sidebar_category_"+a.group_category_id}),b(".sidebar_category:last").after(c.show()));var d=b("#sidebar_group_blank").clone(!0);d.fillTemplateData({data:a,hrefValues:["id"],id:"sidebar_group_"+a.id}),c.find("ul").append(d.show()),b("#category_header").show()},droppable_options:{accept:".student",hoverClass:"hover",tolerance:"pointer",drop:function(a,c){b(".group_category > .student").remove(),contextGroups.moveToGroup(b(c.draggable),b(this))}}},b(document).ready(function(){b("li.student").live("mousedown",function(a){return a.preventDefault(),!1}),b("#group_tabs").tabs(),b("#group_tabs").bind("tabsselect",function(a,b){contextGroups.populateCategory(b.panel)}),b(".group").filter(function(){return b(this).parents("#category_template").length==0}).droppable(contextGroups.droppable_options),b(".add_group_link").click(function(c){c.preventDefault();var d=b(this).parents(".group_category"),e=b("#category_template").find(".group_blank").clone(!0);e.removeAttr("id"),e.find(".student_list").empty(),e.removeClass("group_blank"),e.find(".load-more").hide(),e.find(".name").text(a.t("group_name","Group Name")),d.find(".clearer").before(e.show()),e.find(".edit_group_link").click()}),b("#edit_group_form").formSubmit({object_name:"group",processData:function(a){return a["group[group_category_id]"]=b(this).parents(".group_category").data("category_id"),a},beforeSubmit:function(a){var c=b(this).parents(".group");return b(this).remove(),c.removeClass("editing"),c.loadingImage(),c.fillTemplateData({data:a,avoid:".student_list"}),c},success:function(a,b){var c=a.group||a.course_assigned_group;b.loadingImage("remove"),b.droppable(contextGroups.droppable_options),b.find(".name.blank_name").hide().end().find(".group_name").show(),b.find(".group_user_count").show(),c.group_id=c.id,b.fillTemplateData({id:"group_"+c.id,data:c,avoid:".student_list",hrefValues:["id"]}),contextGroups.addGroupToSidebar(c),contextGroups.updateCategoryCounts(b.parents(".group_category"))}}),b(".edit_group_link").click(function(a){a.preventDefault();var c=b(this).parents(".group"),d=c.getTemplateData({textValues:["name","max_membership"]}),e=b("#edit_group_form").clone(!0);e.fillFormData(d,{object_name:"group"}),c.addClass("editing"),c.prepend(e.show()),e.find(":input:visible:first").focus().select(),c.attr("id")?e.attr("method","PUT").attr("action",c.find(".edit_group_link").attr("href")):e.attr("method","POST").attr("action",b("#manage_group_urls .add_group_url").attr("href")),c.length>0&&c.parents(".group_category").scrollTo(c)}),b("#edit_group_form .cancel_button").click(function(){var a=b(this).parents(".group");b(this).parents(".group").removeClass("editing"),b(this).parents("form").remove(),a.attr("id")||a.remove()}),b("#edit_category_form").formSubmit({object_name:"category",property_validations:{name:function(c,d){var e=b(this).parents(".group_category"),f=e.find(".category_name:first").text();if(f.toLowerCase()==c.toLowerCase())return;var g=!1;b("#category_list .category").each(function(){if(b(this).text().toLowerCase()==c.toLowerCase())return g=!0,!1});if(g)return a.t("errors.category_in_use",'"%{category_name}" is already in use',{category_name:c})}},beforeSubmit:function(c){var d=b(this).parents(".group_category"),e=b("#group_tabs").tabs("option","selected"),f=b(b("#category_list .category")[e]).find("a");return d.data("tab_link",f),b(this).find("button").attr("disabled",!0),b(this).find(".submit_button").text(a.t("status.updating","Updating...")),b(this).loadingImage(),d},success:function(a,c){contextGroups.updateCategory(c,a.group_category),b(this).loadingImage("remove"),b(this).remove(),c.removeClass("editing")},error:function(c){b(this).loadingImage("remove"),b(this).find("button").attr("disabled",!1),b(this).find(".submit_button").text(a.t("errors.update_failed","Update Failed, Try Again")),b(this).formErrors(c)}}),b(".edit_category_link").click(function(a){a.preventDefault();var c=b(this).parents(".group_category"),d=b("#edit_category_form").clone(!0),e=c.getTemplateData({textValues:["category_name","self_signup","heterogenous"]}),f={name:e.category_name,enable_self_signup:e.self_signup!==null&&e.self_signup!=="",restrict_self_signup:e.self_signup=="restricted"};d.fillFormData(f,{object_name:"category"}),d.find("#category_restrict_self_signup").prop("disabled",!f.enable_self_signup||e.heterogenous=="true"),c.addClass("editing"),c.prepend(d.show()),d.find(":input:visible:first").focus().select(),d.attr("method","PUT").attr("action",c.find(".edit_category_link").attr("href")),c.scrollTo(d.find(":input:visible:first"))}),b("#edit_category_form .cancel_button").click(function(){var a=b(this).parents(".group_category");a.removeClass("editing"),b(this).parents("form").remove()}),b(".delete_category_link").click(function(c){c.preventDefault();var d=b("#group_tabs").tabs("option","selected");d==-1&&(d=b("#category_list li").index(b("#category_list li.ui-tabs-selected")));var e=b(this).parents(".group_category"),f=b.replaceTags(b(this).attr("href"),"category_id",e.data("category_id"));e.confirmDelete({url:f,message:a.t("confirm.remove_category","Are you sure you want to remove this set of groups?"),success:function(){categories_remaining=b("#category_list li").length,b("#group_tabs").tabs("remove",d),b("#group_tabs").showIf(categories_remaining>0);var a=b(this).data("category_id");categories_remaining>0&&(d>categories_remaining&&(d=categories_remaining),b("#group_tabs").tabs("select",d)),b("#sidebar_category_"+a).slideUp(function(){b(this).remove()}),b("#no_groups_message").showIf(categories_remaining==0)}})}),b(".add_category_link").click(function(a){a.preventDefault(),addGroupCategory(function(a){b("#group_tabs").show(),b("#no_groups_message").hide();var c=b("#category_template").clone(!0).removeAttr("id"),d=b("#category_template").find(".group_blank");c.find(".group").droppable(contextGroups.droppable_options);var e=a[0].group_category,f=a[1];for(var g in f){var h=f[g].group||f[g].course_assigned_group;h.group_id=h.id,$group=d.clone(!0).removeClass("group_blank"),$group.attr("id","group_"+h.id),(!h.users||h.users.length==0)&&$group.find(".load-more").hide(),$group.droppable(contextGroups.droppable_options),h.user_count=h.users.length,h.user_count_hidden=h.users.length,$group.fillTemplateData({id:"group_"+h.id,data:h,avoid:".student_list",hrefValues:["id"]}),c.find(".clearer").before($group),contextGroups.addGroupToSidebar(h);if(h.users)for(var i in h.users){var j=h.users[i].user,k=b(document.createElement("span")).addClass("category_"+e.id+"_group_id");k.text(h.id),b(".student.user_"+j.id).find(".data").append(k)}$group.find(".name.blank_name").hide().end().find(".group_name").show(),$group.find(".group_user_count").show()}c.fillTemplateData({data:{category_id:e.id,category_name:e.name,self_signup:e.self_signup},hrefValues:["category_id"]}),c.attr("id","category_"+e.id),c.data("category_id",e.id),c.find(".self_signup_text").showIf(e.self_signup),c.find(".restricted_self_signup_text").showIf(e.self_signup=="restricted"),c.find(".assign_students_link").showIf(e.self_signup!=="restricted");var l=b("#group_tabs").tabs("length");b("li.category").last().hasClass("student_organized")&&(l-=1),b("#group_tabs").append(c),b("#group_tabs").tabs("add","#category_"+e.id,e.name,l),b("#group_tabs").tabs("select",l),contextGroups.populateCategory(c),contextGroups.updateCategoryCounts(c),b(window).triggerHandler("resize")})}),b("#add_category_form").formSubmit({property_validations:{"category[name]":function(c,d){var e=!1;b("#category_list .category").each(function(){if(b(this).text().toLowerCase()==c.toLowerCase())return e=!0,!1});if(e)return a.t("errors.category_in_use",'"%{category_name}" is already in use',{category_name:c})}},beforeSubmit:function(c){b(this).loadingImage(),b(this).data("category_name",c["category[name]"]),b(this).find("button").attr("disabled",!0),b(this).find(".submit_button").text(a.t("status.creating_groups","Creating Category..."))},success:function(c){b(this).loadingImage("remove");var d=b(this).data("callbacks")||[];for(var e in d){var f=d[e];f&&b.isFunction(f)&&f.call(this,c)}b(this).data("callbacks",[]),b(this).find("button").attr("disabled",!1),b(this).find(".submit_button").text(a.t("button.create_category","Create Category")),b(this).dialog("close")},error:function(c){b(this).loadingImage("remove"),b(this).find("button").attr("disabled",!1),b(this).find(".submit_button").text(a.t("errors.creating_category_failed","Category Creation Failed, Try Again")),b(this).formErrors(c)}}),b("#add_category_form .cancel_button").click(function(){b("#add_category_form").dialog("close")}),b("#add_category_form #category_enable_self_signup").change(function(){var a=b(this).prop("checked");b("#add_category_form #category_restrict_self_signup").prop("disabled",!a),b("#add_category_form #group_structure_standard_subcontainer").showIf(!a),b("#add_category_form #group_structure_self_signup_subcontainer").showIf(a),a||b("#add_category_form #category_restrict_self_signup").prop("checked",!1)}),b("#edit_category_form #category_enable_self_signup").change(function(){var a=b(this).prop("checked"),c=b(this).parents(".group_category").find(".heterogenous").text()=="true",d=!a||c;b("#edit_category_form #category_restrict_self_signup").prop("disabled",d),d&&b("#edit_category_form #category_restrict_self_signup").prop("checked",!1)}),b(".load_members_link").click(function(a){a.preventDefault(),contextGroups.loadMembersForGroup(b(this).parents(".group"))}),b(".delete_group_link").click(function(c){c.preventDefault(),b(this).parents(".group").confirmDelete({message:a.t("confirm.delete_group","Are you sure you want to delete this group?"),url:b(this).attr("href"),success:function(){var a=b(this).parents(".group_category").find(".group_blank"),c=b(this).getTemplateData({textValues:["group_id"]}).group_id;b("#sidebar_group_"+c).slideUp(function(){b(this).remove()}),b(this).slideUp(function(){var c=b(this).parents(".group_category");c.hasClass("student_organized")||b(this).find(".student").each(function(){contextGroups.insertIntoGroup(b(this),a)}),b(this).remove(),contextGroups.updateCategoryCounts(c)})}})}),b(".assign_students_link").click(function(c){c.preventDefault();var d=confirm(a.t("confirm.assign_students","This will randomly assign all unassigned students as evenly as possible among the existing student groups"));if(!d)return;var e=b(this).parents(".group_category"),f=e.find(".group_blank");f.find(".assign_students_link").hide(),f.find(".loading_members").text(a.t("status.assigning_students","Assigning Students...")),f.find(".loading_members").show();var g=b("#manage_group_urls .assign_unassigned_users_url").attr("href");g=b.replaceTags(g,"category_id",e.data("category_id")),b.ajaxJSON(g,"POST",null,function(c){if(!c.length){f.find(".assign_students_link").show(),f.find(".loading_members").hide(),b(window).triggerHandler("resize"),b.flashError(a.t("notices.no_students_assigned","Nothing to do."));return}var d=b(".user_template");for(var g=0;g<c.length;g++){var h=c[g],i=e.find("#group_"+h.id);for(var j=0;j<h.new_members.length;j++){var k=h.new_members[j];e.find(".user_id_"+k.user_id).remove();var l=d.clone();contextGroups.populateUserElement(l,k),contextGroups.insertIntoGroup(l,i)}}contextGroups.updateCategoryCounts(e),f.find(".assign_students_link").show(),f.find(".loading_members").hide(),b(window).triggerHandler("resize"),b.flashMessage(a.t("notices.students_assigned","Students assigned to groups."))},function(a){f.find(".assign_students_link").show(),f.find(".loading_members").hide(),b(window).triggerHandler("resize")})}),b(".self_signup_help_link").click(function(c){c.preventDefault(),b("#self_signup_help_dialog").dialog("close").dialog({autoOpen:!1,title:a.t("titles.self_signup_help","Self Sign-Up Groups"),width:400}).dialog("open")}),contextGroups.populateCategory(b("#group_tabs .group_category:first")),b(window).resize(function(){if(b(".group_category:visible:first").length==0)return;var a=b(".group_category:visible:first").offset().top,c=b(window).height();b(".group_category").height(c-a-40);var d=b(".group_category:visible:first"),e=d.offset().top,f=d.find(".left_side").offset().top;b(".group_category").find(".right_side,.left_side").height(c-a-40-(f-e)+10)}).triggerHandler("resize"),b(".group_category .group").find(".expand_group_link").click(function(a){a.preventDefault(),b(this).hide().parents(".group").find(".student_list").slideDown().end().find(".load-more").slideDown().end().find(".collapse_group_link").show()}).end().find(".collapse_group_link").click(function(a){a.preventDefault(),b(this).hide().parents(".group").find(".student_list").slideUp().end().find(".load-more").slideUp().end().find(".expand_group_link").show()}),b(".group_category").find(".expand_groups_link").click(function(a){a.preventDefault(),b(this).parents(".group_category").find(".expand_group_link").click()}),b(".group_category").find(".collapse_groups_link").click(function(a){a.preventDefault(),b(this).parents(".group_category").find(".collapse_group_link").click()}),b(".group").hover(function(){b(this).addClass("group-hover")},function(){b(this).removeClass("group-hover")}),b(".group_category").each(function(){contextGroups.updateCategoryCounts(b(this))}),b("#tabs_loading_wrapper").show()})})