define(["INST","i18n!gradebook","jquery","compiled/userSettings","str/htmlEscape","rubric_assessment","jst/_turnitinInfo","jst/_turnitinScore","ajax_errors","jqueryui/draggable","jquery.ajaxJSON","jquery.doc_previews","jquery.instructure_date_and_time","jqueryui/dialog","jquery.instructure_misc_helpers","jquery.instructure_misc_plugins","jquery.keycodes","jquery.loadingImg","jquery.shake","jquery.templateData","media_comments","vendor/jquery.ba-hashchange","vendor/jquery.elastic","vendor/jquery.getScrollbarWidth","vendor/jquery.scrollTo","vendor/jquery.spin","vendor/scribd.view","vendor/spin","vendor/ui.selectmenu"],function(a,b,c,d,e,f,g,h){function i(){jsonData.studentsWithSubmissions=jsonData.context.students,c.each(jsonData.studentsWithSubmissions,function(a,b){this.section_ids=c.map(c.grep(jsonData.context.enrollments,function(a,c){return a.user_id===b.id}),function(a){return a.course_section_id}),this.submission=c.grep(jsonData.submissions,function(a,c){return a.user_id===b.id})[0],this.rubric_assessments=c.grep(visibleRubricAssessments,function(a,c){return a.user_id===b.id})}),bz=d.contextGet("grading_show_only_section");if(bz){var a=c.grep(jsonData.studentsWithSubmissions,function(a,b){return c.inArray(bz,a.section_ids)!=-1});a.length?jsonData.studentsWithSubmissions=a:(alert(b.t("alerts.no_students_in_section","Could not find any students in that section, falling back to showing all sections.")),d.contextRemove("grading_show_only_section"),window.location.reload())}var e=bB.shouldHideStudentNames();e?jsonData.studentsWithSubmissions.sort(function(a,b){return(a&&a.submission&&a.submission.id||Number.MAX_VALUE)-(b&&b.submission&&b.submission.id||Number.MAX_VALUE)}):d.get("eg_sort_by")=="submitted_at"?jsonData.studentsWithSubmissions.sort(function(a,b){return(a&&a.submission&&a.submission.submitted_at&&c.parseFromISO(a.submission.submitted_at).timestamp||Number.MAX_VALUE)-(b&&b.submission&&b.submission.submitted_at&&c.parseFromISO(b.submission.submitted_at).timestamp||Number.MAX_VALUE)}):d.get("eg_sort_by")=="submission_status"&&jsonData.studentsWithSubmissions.sort(function(a,b){var c={not_graded:1,resubmitted:2,not_submitted:3,graded:4},d=j(a.submission),e=j(b.submission);return c[d]-c[e]})}function j(a){return a&&a.workflow_state!="unsubmitted"&&(a.submitted_at||typeof a.grade!="undefined")?typeof a.grade=="undefined"||a.grade===null||a.workflow_state=="pending_review"?"not_graded":a.grade_matches_current_submission?"graded":"resubmitted":"not_submitted"}function k(a){var d=j(a.submission),e=d.replace("_"," ");return d==="resubmitted"&&(e=b.t("graded_then_resubmitted","graded, then resubmitted (%{when})",{when:c.parseFromISO(a.submission.submitted_at).datetime_formatted})),{raw:d,formatted:e}}function l(){var a;if(bB.shouldHideStudentNames()||window.anonymousAssignment)a=!0;c("#hide_student_names").attr("checked",a);var f=c.map(jsonData.studentsWithSubmissions,function(c,d){var f=e(c.name),g=k(c);return a&&(f=b.t("nth_student","Student %{n}",{n:d+1})),'<option value="'+c.id+'" class="'+g.raw+'">'+f+" ---- "+g.formatted+"</option>"}).join("");bt=c("<select id='students_selectmenu'>"+f+"</select>").appendTo("#combo_box_container").selectmenu({style:"dropdown",format:function(a){var b=a.split(" ---- ");return'<span class="ui-selectmenu-item-header">'+e(b[0])+'</span><span class="ui-selectmenu-item-footer">'+b[1]+"</span>"},icons:[{find:".graded"},{find:".not_graded"},{find:".not_submitted"},{find:".resubmitted"}]}).change(function(a){bC.handleStudentChanged()});if(jsonData.context.active_course_sections.length&&jsonData.context.active_course_sections.length>1){var g=bt.data("selectmenu").list,h=c("#section-menu");h.find("ul").append(c.map(jsonData.context.active_course_sections,function(a,b){return'<li><a class="section_'+a.id+'" data-section-id="'+a.id+'" href="#">'+a.name+"</a></li>"}).join("")),h.insertBefore(g).bind("mouseenter mouseleave",function(a){c(this).toggleClass("ui-selectmenu-item-selected ui-selectmenu-item-focus ui-state-hover",a.type=="mouseenter").find("ul").toggle(a.type=="mouseenter")}).find("ul").hide().menu().delegate("a","click mousedown",function(){d[c(this).data("section-id")=="all"?"contextRemove":"contextSet"]("grading_show_only_section",c(this).data("section-id")),window.location.reload()});if(bz){var i=c.map(jsonData.context.active_course_sections,function(a){if(a.id==bz)return a.name}).join(", ");c("#section_currently_showing").text(i),h.find("ul li a").removeClass("selected").filter("[data-section-id="+bz+"]").addClass("selected")}bt.selectmenu("option","open",function(){g.find("li:first").css("margin-top",g.find("li").height()+"px"),h.show().css({left:g.css("left"),top:g.css("top"),width:g.width()-(g.hasScrollbar()&&c.getScrollbarWidth()),"z-index":Number(g.css("z-index"))+1})}).selectmenu("option","close",function(){h.hide()})}}function m(){function a(){var a=document.createElement("input"),b=("onwebkitspeechchange"in a||"speech"in a)&&!navigator.appVersion.match(/Chrome\/10/);return b}c("#add_a_comment textarea").elastic({callback:bC.resizeFullHeight}),c(".media_comment_link").click(function(a){a.preventDefault(),c("#media_media_recording").show().find(".media_recording").mediaComment("create","any",function(a,b){c("#media_media_recording").data("comment_id",a).data("comment_type",b),bC.handleCommentFormSubmit()},function(){bC.revertFromFormSubmit()},!0),bC.resizeFullHeight()}),c("#media_recorder_container a").live("click",n),a()&&c(".speech_recognition_link").click(function(){return c('<input style="font-size: 30px;" speech x-webkit-speech />').dialog({title:b.t("titles.click_to_record","Click the mic to record your comments"),open:function(){c(this).width(100)}}).bind("webkitspeechchange",function(){K.val(c(this).val()),c(this).dialog("close").remove()}),!1}).closest("li").show()}function n(){c("#media_media_recording").hide().removeData("comment_id").removeData("comment_type"),bC.resizeFullHeight()}function o(a){return!a||a.assessor_id===ENV.RUBRIC_ASSESSMENT.assessor_id||ENV.RUBRIC_ASSESSMENT.assessment_type=="grading"&&a.assessment_type=="grading"?!0:!1}function p(){return c.grep(bC.currentStudent.rubric_assessments,function(a,b){return a.id==Y.val()})[0]}function q(){c("#rubric_summary_container .button-container").appendTo("#rubric_assessments_list_and_edit_button_holder").find(".edit").text(b.t("edit_view_rubric","View Rubric")),c(".toggle_full_rubric, .hide_rubric_link").click(function(a){a.preventDefault(),bC.toggleFullRubric()}),Y.change(function(){var a=p();f.populateRubricSummary(c("#rubric_summary_holder .rubric_summary"),a,o(a)),bC.resizeFullHeight()}),br.draggable({axis:"x",cursor:"crosshair",scroll:!1,containment:"#left_side",snap:"#full_width_container",appendTo:"#full_width_container",start:function(){br.draggable("option","minWidth",y.width())},helper:function(){return br.clone().addClass("clone")},drag:function(a,b){var c=b.offset,d=t.width();bq.width(d-c.left),br.css("left","0"),bC.resizeFullHeight()},stop:function(a,b){a.stopImmediatePropagation()}}),c(".save_rubric_button").click(function(){var a=c(this).parents("#rubric_holder").find(".rubric"),b=f.assessmentData(a),d=c(".update_rubric_assessment_url").attr("href"),e="POST";bC.toggleFullRubric(),c(".rubric_summary").loadingImage(),c.ajaxJSON(d,e,b,function(b){var d=!1;b&&b.rubric_association&&(f.updateRubricAssociation(a,b.rubric_association),delete b.rubric_association);for(var e in bC.currentStudent.rubric_assessments)if(b.id===bC.currentStudent.rubric_assessments[e].id){c.extend(!0,bC.currentStudent.rubric_assessments[e],b),d=!0;continue}d||bC.currentStudent.rubric_assessments.push(b),bC.setOrUpdateSubmission(b.artifact),c.each(b.related_group_submissions_and_assessments,function(a,d){var e=bC.setOrUpdateSubmission(b.artifact);e.rubric_assessments=c.map(d.rubric_assessments,function(a){return a.rubric_assessment})}),c(".rubric_summary").loadingImage("remove"),bC.showGrade(),bC.showDiscussion(),bC.showRubric(),bC.updateStatsInHeader()})})}function r(){t.keycodes({keyCodes:"j k p n c r g",ignore:"input, textarea, embed, object"},function(a){a.preventDefault(),a.stopPropagation(),a.keyString=="j"||a.keyString=="p"?bC.prev():a.keyString=="k"||a.keyString=="n"?bC.next():a.keyString=="f"||a.keyString=="c"?K.focus():a.keyString=="g"?ba.focus():a.keyString=="r"&&bC.toggleFullRubric()}),c(window).shake(c.proxy(bC.next,bC))}function s(){var b=t.height(),d,e,f=y.offset().top,g=Math.max(P,b)-f,h=[{element:bk,data:{newHeight:0}},{element:Z,data:{newHeight:0}},{element:E,data:{newHeight:0}}],i=c.grep(h,function(a,b){return a&&a.element.is(":visible")});bq.css({maxHeight:g-50,overflow:"auto"}),c.each(i,function(){this.data.autoHeight=this.element.height("auto").height(),this.element.height(0)});var j=g-D.height("auto").height()-I.outerHeight();C.height(g),d=e=j;var k=1,l;if(d>0)while(e>0){l=!0;var m=1e7,n=null;c.each(i,function(){this.data.newHeight<m&&this.data.newHeight<this.data.autoHeight&&(n=this,m=this.data.newHeight)}),n&&(n.data.newHeight=m+k,e-=k,l=!1);if(l)break}else{var o,p;while(e<0){l=!0,o=0,p=null,c.each(i,function(){this.data.newHeight>30>o&&this.data.newHeight>=this.data.autoHeight&&(p=this,o=this.data.newHeight)}),p&&(p.data.newHeight=o-k,e+=k,l=!1);if(l)break}}c.each(i,function(){this.element.height(this.data.newHeight)}),e>0&&E.height(b-Math.floor(E.offset().top)-I.outerHeight()),!a.browser.ff&&E.height()>100&&E.scrollTop(1e6)}window.jsonData={},c.ajaxJSON(window.location.pathname+".json"+window.location.search,"GET",{},function(a){jsonData=a,c(bC.jsonReady)});var t=c(window),u=c("body"),v=c("#full_width_container"),w=c("#left_side"),x=c("#resize_overlay"),y=c("#right_side"),z=c("#width_resizer"),A=c("#gradebook_header"),B=c("#assignment_url").attr("href"),C=c(".full_height"),D=c("#rightside_inner"),E=c("#comments"),F=c("#comment_blank").removeAttr("id").detach(),G=c("#comment_attachment_blank").removeAttr("id").detach(),H=c("#comment_media_blank").removeAttr("id").detach(),I=c("#add_a_comment"),J=I.find("button"),K=I.find("textarea"),L=c("#group_comment_wrapper"),M=c("#comment_attachment_input_blank").detach(),N=1,O=c("#add_attachment"),P=500,Q=c("#submissions_container"),R=c("#iframe_holder"),S=c("#avatar_image"),T=c("#x_of_x_students span"),U=c("#x_of_x_graded span:first"),V=c("#average_score"),W=c("#this_student_does_not_have_a_submission").hide(),X=c("#this_student_has_a_submission").hide(),Y=c("#rubric_assessments_select"),Z=c("#rubric_summary_container"),$=c("#rubric_holder"),_=c("#grade_container"),ba=_.find("input, select"),bb=_.find(".score"),bc=c("#average_score_wrapper"),bd=c("#submission_details"),be=c("#single_submission"),bf=c("#single_submission_submitted_at"),bg=c("#multiple_submissions"),bh=c("#submission_late_notice"),bi=c("#submission_not_newest_notice"),bj=c("#submission_files_container"),bk=c("#submission_files_list"),bl=c("#submission_file_hidden").removeAttr("id").detach(),bm=c("#submission_to_view"),bn=c("#assignment_submission_url"),bo=c("#assignment_submission_turnitin_report_url"),bp=c("#assignment_submission_resubmit_to_turnitin_url"),bq=c("#rubric_full"),br=c("#rubric_full_resizer_handle"),bs=c("#mute_link"),bt=null,bu=/^(image|html|code)$/,bv=null,bw=null,bx={},by={},bz,bA,bB;bB={getParam:function(a){var b=new RegExp(a+"/([^/]+)"),c=new RegExp(a+"=([^&]+)"),d;return d=window.location.pathname.match(b)||window.location.search.match(c),d?d[1]:!1},shouldHideStudentNames:function(){var a=d.get("eg_hide_student_names");return a===!0||a==="true"}},bA={elements:{mute:{icon:c("#mute_link .ui-icon"),label:c("#mute_link .label"),link:c("#mute_link"),modal:c("#mute_dialog")},nav:A.find(".prev, .next"),spinner:new Spinner({length:2,radius:3,trail:25,width:1}),settings:{form:c("#settings_form"),link:c("#settings_link")}},courseId:bB.getParam("courses"),assignmentId:bB.getParam("assignment_id"),init:function(){return this.muted=this.elements.mute.link.data("muted"),this.addEvents(),this.createModals(),this.addSpinner(),this},addEvents:function(){this.elements.nav.click(c.proxy(this.toAssignment,this)),this.elements.mute.link.click(c.proxy(this.onMuteClick,this)),this.elements.settings.form.submit(c.proxy(this.submitForm,this)),this.elements.settings.link.click(c.proxy(this.showSettingsModal,this))},addSpinner:function(){this.elements.mute.link.append(this.elements.spinner.el)},createModals:function(){var a=b.t("cancel_button","Cancel"),d=b.t("mute_assignment","Mute Assignment"),e={},e={};e[d]=c.proxy(function(){this.toggleMute(),this.elements.mute.modal.dialog("close")},this),e[a]=c.proxy(function(){this.elements.mute.modal.dialog("close")},this),this.elements.settings.form.dialog({autoOpen:!1,modal:!0,resizable:!1,width:400}),this.elements.settings.form.find(".submit_button").removeAttr("disabled"),this.elements.mute.modal.dialog({autoOpen:!1,buttons:e,modal:!0,resizable:!1,title:this.elements.mute.modal.data("title"),width:400})},toAssignment:function(a){a.preventDefault(),bC[a.target.getAttribute("class")]()},submitForm:function(a){return d.set("eg_sort_by",c("#eg_sort_by").val()),d.set("eg_hide_student_names",c("#hide_student_names").prop("checked")),c(a.target).find(".submit_button").attr("disabled",!0).text(b.t("buttons.saving_settings","Saving Settings...")),window.location.reload(),!1},showSettingsModal:function(a){this.elements.settings.form.dialog("close").dialog({modal:!0,resizeable:!1,width:400}).dialog("open")},onMuteClick:function(a){a.preventDefault(),this.muted?this.toggleMute():this.elements.mute.modal.dialog("open")},muteUrl:function(){return"/courses/"+this.courseId+"/assignments/"+this.assignmentId+"/mute"},spinMute:function(){this.elements.spinner.spin(),c(this.elements.spinner.el).css({left:9,top:6}).appendTo(this.elements.mute.link)},toggleMute:function(){this.muted=!this.muted;var a=this.muted?b.t("unmute_assignment","Unmute Assignment"):b.t("mute_assignment","Mute Assignment");action=this.muted?"mute":"unmute",actions={mute:function(){this.elements.mute.icon.css("visibility","hidden"),this.spinMute(),c.ajaxJSON(this.muteUrl(),"put",{status:!0},c.proxy(function(b){this.elements.spinner.stop(),this.elements.mute.label.html(a),this.elements.mute.icon.removeClass("ui-icon-volume-off").addClass("ui-icon-volume-on").css("visibility","visible")},this))},unmute:function(){this.elements.mute.icon.css("visibility","hidden"),this.spinMute(),c.ajaxJSON(this.muteUrl(),"put",{status:!1},c.proxy(function(b){this.elements.spinner.stop(),this.elements.mute.label.html(a),this.elements.mute.icon.removeClass("ui-icon-volume-on").addClass("ui-icon-volume-off").css("visibility","visible")},this))}},actions[action].apply(this)}},c.extend(a,{refreshGrades:function(){var a=unescape(bn.attr("href")).replace("{{submission_id}}",bC.currentStudent.submission.user_id)+".json";c.getJSON(a,function(a){bC.currentStudent.submission=a.submission,bC.showGrade()})},refreshQuizSubmissionSnapshot:function(b){by[b.user_id+"_"+b.version_number]=b,b.last_question_touched&&(a.lastQuestionTouched=b.last_question_touched)},clearQuizSubmissionSnapshot:function(a){by[a.user_id+"_"+a.version_number]=null},getQuizSubmissionSnapshot:function(a,b){return by[a+"_"+b]}}),window.onbeforeunload=function(){window.opener&&window.opener.updateGrades&&c.isFunction(window.opener.updateGrades)&&window.opener.updateGrades();var a=c.map(by,function(a){return a&&c.map(jsonData.context.students,function(b){return a==b&&b.name})[0]});hasPendingQuizSubmissions=function(){var b=!1;if(a.length)for(var c=0,d=a.length;c<d;c++)a[c]!==!1&&(b=!0);return b}();if(hasPendingQuizSubmissions)return b.t("confirms.unsaved_changes","The following students have unsaved changes to their quiz submissions: \n\n %{users}\nContinue anyway?",{users:a.join("\n ")})};var bC={options:{},publicVariable:[],scribdDoc:null,currentStudent:null,domReady:function(){function a(){v.addClass("full_width"),w.css("width",""),y.css("width","")}t.bind("resize orientationchange",bC.resizeFullHeight).resize(),c(document).mouseup(function(a){x.hide()}),x.click(function(a){c(this).hide()}),z.mousedown(function(a){x.show()}).draggable({axis:"x",cursor:"crosshair",scroll:!1,containment:"#full_width_container",snap:"#full_width_container",appendTo:"#full_width_container",helper:function(){return z.clone().addClass("clone")},snapTolerance:200,drag:function(b,d){var e=d.offset,f=t.width();w.width(e.left/f*100+"%"),y.width(100-e.left/f*100+"%"),z.css("left","0"),f-e.left<c(this).draggable("option","snapTolerance")?a():v.removeClass("full_width"),e.left<c(this).draggable("option","snapTolerance")&&(w.width("0%"),y.width("100%")),bC.resizeFullHeight()},stop:function(a,b){a.stopImmediatePropagation(),x.hide()}}).click(function(b){b.preventDefault(),v.hasClass("full_width")?v.removeClass("full_width"):(a(),c(this).addClass("highlight",100,function(){c(this).removeClass("highlight",4e3)}))}),ba.change(bC.handleGradeSubmit),bm.change(function(){typeof bC.currentStudent.submission=="undefined"&&(bC.currentStudent.submission={}),bC.currentStudent.submission.currentSelectedIndex=parseInt(c(this).val(),10),bC.handleSubmissionSelectionChange()}),q(),m(),bC.initComments(),bA.init(),r(),t.bind("hashchange",bC.handleFragmentChange),c("#eg_sort_by").val(d.get("eg_sort_by")),c("#submit_same_score").click(function(a){bC.handleGradeSubmit(),a.preventDefault()})},jsonReady:function(){i(),jsonData.studentsWithSubmissions.length?(c("#speed_grader_loading").hide(),c("#gradebook_header, #full_width_container").show(),l(),bC.handleFragmentChange()):(alert(b.t("alerts.no_active_students","Sorry, there are either no active students in the course or none are gradable by you.")),window.history.back())},skipRelativeToCurrentIndex:function(a){var b=(this.currentIndex()+a+jsonData.studentsWithSubmissions.length)%jsonData.studentsWithSubmissions.length;this.goToStudent(jsonData.studentsWithSubmissions[b].id)},next:function(){this.skipRelativeToCurrentIndex(1)},prev:function(){this.skipRelativeToCurrentIndex(-1)},resizeFullHeight:function(){bw&&clearTimeout(bw),bw=setTimeout(s,0)},toggleFullRubric:function(a){if(!jsonData.rubric_association)return!1;bq.filter(":visible").length||a==="close"?(c("#grading").height("auto").children().show(),bq.fadeOut(),this.resizeFullHeight()):(bq.fadeIn(),c("#grading").children().hide(),this.refreshFullRubric())},refreshFullRubric:function(){if(!jsonData.rubric_association)return;if(!bq.filter(":visible").length)return;f.populateRubric(bq.find(".rubric"),p()),c("#grading").height(bq.height()),this.resizeFullHeight()},handleFragmentChange:function(){var a;try{a=JSON.parse(decodeURIComponent(document.location.hash.substr(1)))}catch(b){}a||(a={});if(typeof a.student_id!="number"||!c.grep(jsonData.studentsWithSubmissions,function(b){return a.student_id==b.id}).length){a.student_id=jsonData.studentsWithSubmissions[0].id;for(var d=0,e=jsonData.studentsWithSubmissions.length;d<e;d++)if(typeof jsonData.studentsWithSubmissions[d].submission!="undefined"&&jsonData.studentsWithSubmissions[d].submission.workflow_state!=="graded"){a.student_id=jsonData.studentsWithSubmissions[d].id;break}}bC.goToStudent(a.student_id)},goToStudent:function(a){var b=c.grep(jsonData.studentsWithSubmissions,function(b){return b.id===a})[0];b&&(bt.selectmenu("value",b.id),(!this.currentStudent||this.currentStudent.id!=b.id)&&bt.change(),b.avatar_path&&($new_image=S.clone(),S.after($new_image.attr("src",b.avatar_path)).remove(),S=$new_image))},currentIndex:function(){return c.inArray(this.currentStudent,jsonData.studentsWithSubmissions)},handleStudentChanged:function(){var a=parseInt(bt.val(),10);this.currentStudent=c.grep(jsonData.studentsWithSubmissions,function(b){return b.id===a})[0],document.location.hash="#"+encodeURIComponent(JSON.stringify({student_id:this.currentStudent.id})),this.showGrade(),this.showDiscussion(),this.showRubric(),this.updateStatsInHeader(),this.showSubmissionDetails(),this.refreshFullRubric()},populateTurnitin:function(a,d,e,f,i,j){var k=null;if(e.status=="scored"||e.status==null&&e.similarity_score!=null)f.html(h({state:(e.state||"no")+"_score",reportUrl:c.replaceTags(bo.attr("href"),{user_id:a.user_id,asset_string:d}),tooltip:b.t("turnitin.tooltip.score","Turnitin Similarity Score - See detailed report"),score:e.similarity_score+"%"}));else if(e.status){var l=b.t("turnitin.tooltip.pending","Turnitin Similarity Score - Submission pending"),m=b.t("turnitin.tooltip.error","Turnitin Similarity Score - See submission error details");k=c(h({state:"submission_"+e.status,reportUrl:"#",tooltip:e.status=="error"?m:l,icon:"/images/turnitin_submission_"+e.status+".png"})),f.append(k),k.click(function(a){a.preventDefault(),i.find(".turnitin_"+d).slideToggle()});var n=b.t("turnitin.info_message","This file is still being processed by turnitin. Please check back later to see the score"),o=b.t("turnitin.error_message","There was an error submitting to turnitin. Please try resubmitting the file before contacting support"),p=c(g({assetString:d,message:e.status=="error"?e.public_error_message||o:n,showResubmit:e.status=="error"&&j}));i.append(p);if(e.status=="error"&&j){var q=c.replaceTags(bp.attr("href"),{user_id:a.user_id});p.find(".turnitin_resubmit_button").click(function(a){a.preventDefault(),c(this).attr("disabled",!0).text(b.t("turnitin.resubmitting","Resubmitting...")),c.ajaxJSON(q,"POST",{},function(){window.location.reload()})})}}},handleSubmissionSelectionChange:function(){try{var b=bm.filter(":visible").val(),d=Number(b)||this.currentStudent&&this.currentStudent.submission&&this.currentStudent.submission.currentSelectedIndex||0,e=this.currentStudent&&this.currentStudent.submission&&this.currentStudent.submission.submission_history&&this.currentStudent.submission.submission_history.length-1===d,f=this.currentStudent&&this.currentStudent.submission&&this.currentStudent.submission.submission_history&&this.currentStudent.submission.submission_history[d]&&this.currentStudent.submission.submission_history[d].submission||{},g=jsonData.due_at&&c.parseFromISO(jsonData.due_at),h=f.submitted_at&&c.parseFromISO(f.submitted_at),i=f.graded_at&&c.parseFromISO(f.graded_at),j=[],k=[];bf.html(h&&h.datetime_formatted);var l=_.find(".turnitin_score_container").empty(),m=_.find(".turnitin_info_container").empty(),n="submission_"+f.id,o=f.turnitin_data&&f.turnitin_data[n];o&&f.submission_type=="online_text_entry"&&bC.populateTurnitin(f,n,o,l,m,e),bk.empty(),m=c("#submission_files_container .turnitin_info_container").empty(),c.each(f.versioned_attachments||[],function(a,b){var d=b.attachment;d.scribd_doc&&d.scribd_doc.created&&j.push(d),bu.test(d.mime_class)&&k.push(d),$submission_file=bl.clone(!0).fillTemplateData({data:{submissionId:f.user_id,attachmentId:d.id,display_name:d.display_name},hrefValues:["submissionId","attachmentId"]}).appendTo(bk).find("a.display_name").addClass(d.mime_class).data("attachment",d).click(function(a){a.preventDefault(),bC.loadAttachmentInline(c(this).data("attachment"))}).end().find("a.submission-file-download").bind("dragstart",function(a){a.originalEvent.dataTransfer&&a.originalEvent.dataTransfer.setData("DownloadURL",d.content_type+":"+d.filename+":"+this.href)}).end().show(),l=$submission_file.find(".turnitin_score_container"),n="attachment_"+d.id,o=f.turnitin_data&&f.turnitin_data[n],o&&bC.populateTurnitin(f,n,o,l,m,e)}),bj.showIf(f.versioned_attachments&&f.versioned_attachments.length),this.loadAttachmentInline(j[0]||k[0]),bi.showIf(bm.filter(":visible").find(":selected").nextAll().length),this.resizeFullHeight(),bh.showIf(g&&h&&h.minute_timestamp>g.minute_timestamp)}catch(p){throw a.log_error({message:"SG_submissions_"+(p.message||p.description||""),line:p.lineNumber||""}),p}},refreshSubmissionsToView:function(){var a=jsonData.due_at&&c.parseFromISO(jsonData.due_at),d="";this.currentStudent.submission.submission_history.length>0&&(submissionToSelect=this.currentStudent.submission.submission_history[this.currentStudent.submission.submission_history.length-1].submission,c.each(this.currentStudent.submission.submission_history,function(e,f){f=f.submission;var g=f.submitted_at&&c.parseFromISO(f.submitted_at),h=a&&g&&g.timestamp>a.timestamp;d+="<option "+(h?"class='late'":"")+" value='"+e+"' "+(f==submissionToSelect?"selected='selected'":"")+">"+(g?g.datetime_formatted:b.t("no_submission_time","no submission time"))+(h?" "+b.t("loud_late","LATE"):"")+(f.grade&&f.grade_matches_current_submission?" ("+b.t("grade","grade: %{grade}",{grade:f.grade})+")":"")+"</option>"})),bm.html(d),this.currentStudent&&this.currentStudent.submission&&this.currentStudent.submission.submission_history&&this.currentStudent.submission.submission_history.length>1?(bg.show(),be.hide()):(bg.hide(),be.show())},showSubmissionDetails:function(){this.currentStudent.submission&&this.currentStudent.submission.submitted_at?(this.refreshSubmissionsToView(),bd.show()):bd.hide(),this.handleSubmissionSelectionChange()},updateStatsInHeader:function(){T.html(bC.currentIndex()+1);var a=c.grep(jsonData.studentsWithSubmissions,function(a){return a.submission&&a.submission.workflow_state==="graded"}),b=c.map(a,function(a){return a.submission.score});if(b.length){bc.show();function d(a){var b=0;for(var c=0,d=a.length;c<d;c++)b+=a[c];return b/a.length}function e(a,b){b=Math.abs(parseInt(b,10))||0;var c=Math.pow(10,b);return Math.round(a*c)/c}var f=jsonData.points_possible?[" / ",jsonData.points_possible," (",Math.round(100*(d(b)/jsonData.points_possible)),"%)"].join(""):"";V.html([e(d(b),2)+f].join(""))}else bc.hide();U.html(b.length)},loadAttachmentInline:function(a){Q.children().hide();if(!this.currentStudent.submission||!this.currentStudent.submission.submission_type||this.currentStudent.submission.workflow_state=="unsubmitted")W.show();else if(this.currentStudent.submission&&this.currentStudent.submission.submitted_at&&jsonData.context.quiz&&jsonData.context.quiz.anonymous_submissions)X.show();else{R.empty();var b=a&&a.scribd_doc&&a.scribd_doc.created&&a.workflow_state!="errored"&&a.scribd_doc.attributes.doc_id;if(a&&(b||c.isPreviewable(a.content_type,"google"))){var d={height:"100%",mimeType:a.content_type,attachment_id:a.id,submission_id:this.currentStudent.submission.id,ready:function(){bC.resizeFullHeight()}};b&&(d=c.extend(d,{scribd_doc_id:a.scribd_doc.attributes.doc_id,scribd_access_key:a.scribd_doc.attributes.access_key})),R.show().loadDocPreview(d)}else if(a&&bu.test(a.mime_class)){var e=unescape(bl.find(".display_name").attr("href")).replace("{{submissionId}}",this.currentStudent.submission.user_id).replace("{{attachmentId}}",a.id);R.html('<iframe src="'+e+'" frameborder="0" id="speedgrader_iframe"></iframe>').show()}else R.html('<iframe id="speedgrader_iframe" src="/courses/'+jsonData.context_id+"/assignments/"+this.currentStudent.submission.assignment_id+"/submissions/"+this.currentStudent.submission.user_id+"?preview=true"+(this.currentStudent.submission&&!isNaN(this.currentStudent.submission.currentSelectedIndex)&&this.currentStudent.submission.currentSelectedIndex!=null?"&version="+this.currentStudent.submission.currentSelectedIndex:"")+'" frameborder="0"></iframe>').show()}},showRubric:function(){if(jsonData.rubric_association){ENV.RUBRIC_ASSESSMENT.assessment_user_id=this.currentStudent.id;var a=c.grep(bC.currentStudent.rubric_assessments,function(a,b){return a.assessor_id===ENV.RUBRIC_ASSESSMENT.assessor_id}),d=c.grep(bC.currentStudent.rubric_assessments,function(a,b){return a.assessment_type=="grading"});Y.find("option").remove(),c.each(this.currentStudent.rubric_assessments,function(){Y.append('<option value="'+this.id+'">'+this.assessor_name+"</option>")}),(!a.length||ENV.RUBRIC_ASSESSMENT.assessment_type=="grading"&&!d.length)&&Y.append('<option value="new">'+b.t("new_assessment","[New Assessment]")+"</option>");var e=null;d.length&&(e=d[0].id),a.length&&(e=a[0].id),e&&Y.val(e),c("#rubric_assessments_list").showIf(Y.find("option").length>1),Y.change()}},showDiscussion:function(){E.html(""),this.currentStudent.submission&&this.currentStudent.submission.submission_comments&&c.each(this.currentStudent.submission.submission_comments,function(a,d){d.submission_comment&&(d=d.submission_comment),d.posted_at=c.parseFromISO(d.created_at).datetime_formatted;var f=F.clone(!0).fillTemplateData({data:d});f.find("span.comment").html(e(d.comment).replace(/\n/g,"<br />")),d.avatar_path&&f.find(".avatar").attr("src",d.avatar_path).show();var g=ENV.RUBRIC_ASSESSMENT.assessment_type==="grading"||ENV.RUBRIC_ASSESSMENT.assessor_id===d.author_id;f.find(".delete_comment_link").click(function(a){c(this).parents(".comment").confirmDelete({url:"/submission_comments/"+d.id,message:b.t("confirms.delete_comment","Are you sure you want to delete this comment?"),success:function(a){c(this).slideUp(function(){c(this).remove()})}})}).showIf(g),d.media_comment_type&&d.media_comment_id&&f.find(".play_comment_link").show(),c.each(d.cached_attachments||d.attachments,function(){var a=this.attachment||this;a.comment_id=d.id,a.submitter_id=bC.currentStudent.id,f.find(".comment_attachments").append(G.clone(!0).fillTemplateData({data:a,hrefValues:["comment_id","id","submitter_id"]}).show().find("a").addClass(a.mime_class))}),E.append(f.show()),E.find(".play_comment_link").mediaCommentThumbnail("normal")}),E.scrollTop(9999999)},revertFromFormSubmit:function(){bC.showDiscussion(),bC.resizeFullHeight(),K.val(""),setTimeout(function(){K.trigger("keyup")},0),I.find(":input").attr("disabled",!1),J.text(b.t("buttons.submit_comment","Submit Comment"))},handleCommentFormSubmit:function(){function a(a){c.each(a,function(){bC.setOrUpdateSubmission(this.submission)}),bC.revertFromFormSubmit()}if(!c.trim(K.val()).length&&!c("#media_media_recording").data("comment_id")&&!I.find("input[type='file']:visible").length)return!1;var d=B+"/submissions/"+bC.currentStudent.id,e="PUT",f={"submission[assignment_id]":jsonData.id,"submission[user_id]":bC.currentStudent.id,"submission[group_comment]":c("#submission_group_comment").attr("checked")?"1":"0","submission[comment]":K.val()};c("#media_media_recording").data("comment_id")&&c.extend(f,{"submission[media_comment_type]":c("#media_media_recording").data("comment_type"),"submission[media_comment_id]":c("#media_media_recording").data("comment_id")}),I.find("input[type='file']:visible").length?c.ajaxJSONFiles(d+".text",e,f,I.find("input[type='file']:visible"),a):c.ajaxJSON(d,e,f,a),c("#comment_attachments").empty(),I.find(":input").attr("disabled",!0),J.text(b.t("buttons.submitting","Submitting...")),n()},setOrUpdateSubmission:function(a){var b=c.grep(jsonData.studentsWithSubmissions,function(b){return b.id===a.user_id})[0];return b.submission=b.submission||{},typeof a.submission_history=="undefined"&&(a.submission_history=[{submission:c.extend(!0,{},a)}]),c.extend(!0,b.submission,a),b},handleGradeSubmit:function(){var a=c(".update_submission_grade_url").attr("href"),b=c(".update_submission_grade_url").attr("title"),d={"submission[assignment_id]":jsonData.id,"submission[user_id]":bC.currentStudent.id,"submission[grade]":ba.val()};c.ajaxJSON(a,b,d,function(a){c.each(a,function(){bC.setOrUpdateSubmission(this.submission)}),bC.refreshSubmissionsToView(),bm.change(),bC.showGrade()})},showGrade:function(){ba.val(typeof bC.currentStudent.submission!="undefined"&&bC.currentStudent.submission.grade!==null?bC.currentStudent.submission.grade:"").attr("disabled",typeof bC.currentStudent.submission!="undefined"&&bC.currentStudent.submission.submission_type==="online_quiz"),c("#submit_same_score").hide(),typeof bC.currentStudent.submission!="undefined"&&bC.currentStudent.submission.score!==null?(bb.text(bC.currentStudent.submission.score),bC.currentStudent.submission.grade_matches_current_submission||c("#submit_same_score").show()):bb.text(""),bC.updateStatsInHeader(),c.each(jsonData.studentsWithSubmissions,function(a,b){var d=bt.data("selectmenu").list.find("li:eq("+a+")"),e=k(this),f="not_graded not_submitted graded resubmitted";this==bC.currentStudent&&(d=d.add(bt.data("selectmenu").newelement)),d.removeClass(f).addClass(e.raw).find(".ui-selectmenu-item-footer").text(e.formatted),c.each(f.split(" "),function(){d.data("optionClasses",d.data("optionClasses").replace(this,""))})})},initComments:function(){J.click(function(a){a.preventDefault(),bC.handleCommentFormSubmit()}),O.click(function(a){a.preventDefault();var b=M.clone(!0);b.find("input").attr("name","attachments["+N+"][uploaded_data]"),N++,c("#comment_attachments").append(b.show()),bC.resizeFullHeight()}),M.find("a").click(function(a){a.preventDefault(),c(this).parents(".comment_attachment_input").remove(),bC.resizeFullHeight()}),y.delegate(".play_comment_link","click",function(){var a=c(this).parents(".comment").getTemplateData({textValues:["media_comment_id"]}).media_comment_id;return a&&c(this).parents(".comment").find(".media_comment_content").show().mediaComment("show",a,"audio"),!1})}};c(document).ready(function(){bC.domReady()})})