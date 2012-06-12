define("translations/gradebook",["i18nObj","jquery"],function(a,b){b.extend(!0,a,{translations:{es:{gradebook:{alerts:{no_active_students:"Perdón, no hay estudiantes activos en este curso o no pueden ser calificados por usted.",no_students_in_section:"No se pudieron encontrar estudiantes en esa sección, regresando para mostrar todas las secciones.",none_to_update:"Nada que Actualizar",scores_updated:{one:"1 calificación de estudiante actualizada",other:"%{count} calificaciones de estudiantes actualizados"},students_updated:{one:"1 Estudiante Actualizado",other:"%{count} estudiantes actualizados"}},assignment_details:"Detalles de la Tarea",buttons:{change_section:"Cambiar Sección",saving_settings:"Guardar Configuraciones...",submit_comment:"Enviar Comentario",submitting:"Enviando...",upload_data:"Cargar Información"},cancel_button:"Cancelar",click_to_change:"Haga click para probar una calificación diferente",click_to_expand:"Haga click para expandir",computing_grades:"Computando Calificaciones...",confirms:{delete_comment:"¿Seguro que quiere borrar este comentario?",unsaved_changes:"Los siguientes estudiantes tienen cambios no guardados en los envíos de sus evaluaciones: \n%{users}\n¿Continuar?"},curve_grade_for_course:"Aplicar Curva a %{assignment}",curve_grades:"Aplicar Curva a los Grados",default_grade_for_course:"Calificación Predeterminada para %{assignment}",download_scores:"Descargar Calificaciones (%{format})",download_submissions:"Descargar los Envíos",edit_view_rubric:"Ver Rúbrica",errors:{failed_to_load:"El libro de calificaciones no se pudo cargar, intente recargar la página",none_to_update:"Nada que Actualizar",select_an_option:"Por favor seleccione una opción",upload_as_zip:"Por favor cargue los archivos como un .zip"},grade:"grado: %{grade}",graded_by_me:"%{graded_time} por mí",graded_then_resubmitted:"calificado, luego reenviado (%{when})",hide_all_things:"Esconder %{things}",hide_column:"Esconder Columna",hide_student_name:"Esconder los Nombres de los Estudiantes",ignore_ungraded:"Ignorar Tareas No Calificadas",include_ungraded:"Incluír Tareas Actualizadas",labels:{details:"Detalles"},links:{download_attachment:"Descargando %{attachment}",finish_scoring:"Terminar la Calificación de esta Evaluación",go_to_submission:"Ir al URL de Envío",submission_details:"Detalles de Envío",view_quiz:"Ver esta Evaluación",view_submission:"Ver Envío"},loud_late:"TARDE",message_students_who:"Enviar Mensaje a Estudiante Que...",mute_assignment:"Obviar Tarea",new_assessment:"[Tarea Nueva]",no_submission_time:"ningun tiempo de envío",nth_student:"Estudiante %{n}",percent:"Porcentaje",publish_to_sis:"Publicar calificaciones a SIS",reupload_submission_files:"Recargar los Archivos de Envío",reupload_submissions:"Recargar los Envíos",set_default_grade:"Establecer Calificación Predeterminada",set_group_weights:"Establecer Peso por Grupo",show_student_name:"Mostrar los Nombres de Estudiantes",showing_all_sections:"Mostrando Todas las Secciones",showing_section:"Mostrando la Sección: %{section}",sort_columns_by:"Ordenar Columnas Por...",sort_rows_by:"Ordenar Filas Por...",speed_grader:"Calificador Rápido",student:"Estudiante",student_mute_notification:"El instructor está trabajando en las calificaciones",student_name:"Nombre del Estudiante",students_who:{havent_submitted_yet:"Aún no ha enviado",scored_less_than:"Obtuvo menos de",scored_more_than:"Obtuvo más de"},submission_information:"Información del Envío",teacher_muted_title:"Tarea ha sido obviada",titles:{assignment_groups:"Grupos de Trabajo",click_to_record:"Haga click en el micrófono para grabar sus comentarios",dropped_assignment_no_total:"Esta tarea no será considerada en el cálculo total",hypothetical_score:'Esta es una calificación "que pasa si"',loading:"Cargando...",turnitin_score:"Calificación de Similaridad de Turnitin -- más información"},tooltips:{submission_dropped:"Este envío se eliminó para la calificación",submitted_late:"Este envío se envió tarde"},unmute_assignment:"Activar Tarea",unmute_button:"Activar la Tarea",upload_scores:"Cargar Calificaciones (desde %{format})",view_grading_history:"Ver el Historial de Calificación"},not_applicable:"N/A"}}})}),function(){define("compiled/grade_calculator",["INST","jquery"],function(a,b){var c;return c=function(){function a(){}return a.name="GradeCalculator",a.calculate=function(a,c,d){var e,f=this;return e={},e.group_sums=b.map(c,function(b){return{group:b,current:f.create_group_sum(b,a,!0),"final":f.create_group_sum(b,a,!1)}}),e.current=this.calculate_total(e.group_sums,!0,d),e["final"]=this.calculate_total(e.group_sums,!1,d),e},a.create_group_sum=function(a,c,d){var e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E;l={submissions:[],score:0,possible:0,submission_count:0},y=a.assignments;for(m=0,q=y.length;m<q;m++){e=y[m],f={score:0,possible:0,percent:0,drop:!1,submitted:!1},k=null;for(n=0,r=c.length;n<r;n++){j=c[n];if(j.assignment_id!==e.id)continue;k=j;break}k==null&&(k={score:null}),k.assignment_group_id=a.id,k.points_possible==null&&(k.points_possible=e.points_possible),f.submission=k,l.submissions.push(f);if(!d||k.score!=null&&k.score!=="")f.score=this.parse(k.score),f.possible=this.parse(e.points_possible),f.percent=this.parse(f.score/f.possible),f.submitted=k.score!=null&&k.score!=="",f.submitted&&(l.submission_count+=1)}l.submissions.sort(function(a,b){return a.percent-b.percent}),i=b.extend({drop_lowest:0,drop_highest:0,never_drop:[]},a.rules),g=0,z=["low","high"];for(o=0,s=z.length;o<s;o++){h=z[o],A=l.submissions;for(p=0,t=A.length;p<t;p++)f=A[p],!f.drop&&i["drop_"+h+"est"]>0&&b.inArray(f.assignment_id,i.never_drop)===-1&&f.possible>0&&f.submitted&&(f.drop=!0,(B=f.submission)!=null&&(B.drop=!0),i["drop_"+h+"est"]-=1,g+=1)}g>0&&g===l.submission_count&&(l.submissions[l.submissions.length-1].drop=!1,(C=l.submissions[l.submissions.length-1].submission)!=null&&(C.drop=!1),g-=1),l.submission_count-=g,D=l.submissions;for(w=0,u=D.length;w<u;w++)j=D[w],j.drop||(l.score+=j.score);E=l.submissions;for(x=0,v=E.length;x<v;x++)j=E[x],j.drop||(l.possible+=j.possible);return l},a.calculate_total=function(a,b,c){var d,e,f,g,h,i,j,k,l;e=b?"current":"final";if(c==="percent"){h=0,g=0,j=0;for(k=0,l=a.length;k<l;k++){d=a[k];if(d.group.group_weight>0)d[e].submission_count>0&&d[e].possible>0&&(i=d[e].score/d[e].possible,h+=d.group.group_weight*i,g+=d.group.group_weight),j+=d.group.group_weight;else continue}return b&&g<100&&(f=j<100?j:100,h=h*f/g),{score:h,possible:100}}return{score:this.sum(function(){var b,c,f;f=[];for(b=0,c=a.length;b<c;b++)d=a[b],f.push(d[e].score);return f}()),possible:this.sum(function(){var b,c,f;f=[];for(b=0,c=a.length;b<c;b++)d=a[b],f.push(d[e].possible);return f}())}},a.sum=function(a){var b,c,d,e;b=0;for(d=0,e=a.length;d<e;d++)c=a[d],b+=c;return b},a.parse=function(a){var b;return b=parseFloat(a),b&&isFinite(b)?b:0},a.letter_grade=function(a,c){var d,e;return c<0&&(c=0),e=b.grep(a,function(b,d){return c>=b[1]*100||d===a.length-1}),d=e[0],d[0]},a}(),window.INST.GradeCalculator=c})}.call(this),define("grade_summary",["INST","i18n!gradebook","jquery","jquery.ajaxJSON","jquery.instructure_forms","jquery.instructure_misc_helpers","jquery.instructure_misc_plugins","jquery.templateData","media_comments"],function(a,b,c){function d(a,b){if(b.length===0)return;var d=b.getTemplateData({textValues:["assignment_group_id","rules","group_weight"]});d=c.extend(d,b.getFormData());var e=a[d.assignment_group_id]||{};e.group_weight||(e.group_weight=parseFloat(d.group_weight)/100),e.scores=e.scores||[],e.full_points=e.full_points||[],e.count=e.count||0,e.submissions=e.submissions||[],e.sorted_submissions=e.sorted_submissions||[],isNaN(e.score_total)&&(e.score_total=null),isNaN(e.full_total)&&(e.full_total=null);if(e.score_total!==null||e.full_total!==null){e.calculated_score=e.score_total/e.full_total;if(isNaN(e.calculated_score)||!isFinite(e.calculated_score))e.calculated_score=0}else e.score_total=0,e.full_total=0;if(!e.rules){d.rules=d.rules||"";var f={drop_highest:0,drop_lowest:0,never_drop:[]},g=d.rules.split("\n");for(var h in g){var i=g[h].split(":"),j=null;i.length>1&&(j=parseInt(i[1],10)),j&&!isNaN(j)&&isFinite(j)&&(i[0]=="drop_lowest"?f.drop_lowest=j:i[0]=="drop_highest"?f.drop_highest=j:i[0]=="never_drop"&&f.never_drop.push(j))}e.rules=f}return a[d.assignment_group_id]=e,e}function e(){var e=c("#only_consider_graded_assignments").attr("checked"),f=c("#grades_summary .student_assignment"),g={},h=c(".group_total");h.each(function(){d(g,c(this))}),f.removeClass("dropped"),f.each(function(){var a=c(this),b;if(a.hasClass("hard_coded"))return;var f=a.getTemplateData({textValues:["assignment_group_id","score","points_possible","assignment_id"]});if((!f.score||isNaN(parseFloat(f.score)))&&e){c(this).addClass("dropped");return}var h=g[f.assignment_group_id];h||(h=d(g,c("#submission_group-"+f.assignment_group_id)));if(!h)return;var i=parseFloat(f.score);if(!i||isNaN(i)||!isFinite(i))i=0;var j=parseFloat(f.points_possible);if(!j||isNaN(j))j=0;var k=i/j;if(isNaN(k)||!isFinite(k))k=0;f.calculated_score=i,f.calculated_possible=j,f.calculated_percent=k,h.submissions.push(f),g[f.assignment_group_id]=h});for(var i in g){var j=g[i];j.sorted_submissions=j.submissions.sort(function(a,b){var c=[a.calculated_percent],d=[b.calculated_percent];return c>d?1:c==d?0:-1});var k=0,l=0;for(var m=0;m<j.sorted_submissions.length;m++)j.sorted_submissions[m].calculated_drop=!1;for(m=0;m<j.sorted_submissions.length;m++)submission=j.sorted_submissions[m],!submission.calculated_drop&&k<j.rules.drop_lowest&&submission.calculated_possible>0&&c.inArray(submission.assignment_id,j.rules.never_drop)==-1&&(k++,submission.calculated_drop=!0),j.sorted_submissions[m]=submission;for(m=j.sorted_submissions.length-1;m>=0;m--)submission=j.sorted_submissions[m],!submission.calculated_drop&&l<j.rules.drop_highest&&submission.calculated_possible>0&&c.inArray(submission.assignment_id,j.rules.never_drop)==-1&&(l++,submission.calculated_drop=!0),j.sorted_submissions[m]=submission;for(m=0;m<j.sorted_submissions.length;m++)submission=j.sorted_submissions[m],submission.calculated_drop?(c("#submission_"+submission.assignment_id).addClass("dropped"),k++):(c("#submission_"+submission.assignment_id).removeClass("dropped"),j.scores.push(submission.calculated_score),j.full_points.push(submission.calculated_possible),j.count++,j.score_total+=submission.calculated_score,j.full_total+=submission.calculated_possible);g[i]=j}var n=0,o=0,p=0,q=0,r=0;c.each(g,function(a,b){var f=d(g,c("#submission_group-"+a)),h=Math.round(b.calculated_score*1e3)/10;c("#submission_group-"+a).find(".grade").text(h).end().find(".score_teaser").text(b.score_total+" / "+b.full_total),h=b.calculated_score*b.group_weight;if(isNaN(h)||!isFinite(h))h=0;e&&b.count>0&&(q+=b.group_weight),n+=h,r+=b.score_total,p+=b.full_total});var s=parseFloat(c("#total_groups_weight").text());if(isNaN(s)||!isFinite(s)||s===0)o=Math.round(1e3*r/p)/10,c(".student_assignment.final_grade .score_teaser").text(r+" / "+p);else{var t=parseFloat(c("#total_groups_weight").text())/100;if(isNaN(t)||!isFinite(t)||t===0)t=1;if(e&&q<1){var u=t<1?t:1;n=u*n/q}o=n,o=Math.round(o*1e3)/10,c(".student_assignment.final_grade .score_teaser").text(b.t("percent","Percent"))}if(isNaN(o)||!isFinite(o))o=0;c(".student_assignment.final_grade").find(".grade").text(o),window.grading_scheme&&c(".final_letter_grade .grade").text(a.GradeCalculator.letter_grade(grading_scheme,o)),c(".revert_all_scores").showIf(c("#grades_summary .revert_score_link").length>0);var v=(new Date).getTime()}c(document).ready(function(){e(),c(".revert_all_scores_link").click(function(a){a.preventDefault(),c("#grades_summary .revert_score_link").each(function(){c(this).trigger("click",!0)}),c("#.show_guess_grades.exists").show(),e()}),c("tr.student_assignment").mouseover(function(){c(this).hasClass("dropped")?c(this).attr("title",b.t("titles.dropped_assignment_no_total","This assignment will not be considered in the total calculation")):c(this).attr("title","")}),c(".toggle_comments_link").click(function(a){a.preventDefault(),c(this).parents("tr.student_assignment").next("tr.comments").toggle()}),c(".toggle_rubric_assessments_link").click(function(a){a.preventDefault(),c(this).parents("tr.student_assignment").next("tr.comments").next("tr.rubric_assessments").toggle()}),c(".student_assignment.editable .assignment_score").click(function(a){if(c("#grades_summary.editable").length===0||c(this).find("#grade_entry").length>0||c(a.target).closest(".revert_score_link").length>0)return;c(this).find(".grade").data("originalValue")||c(this).find(".grade").data("originalValue",c(this).find(".grade").html()),c(this).find(".grade").empty().append(c("#grade_entry")),c(this).find(".score_value").hide();var b=c(this).parents(".student_assignment").find(".score").text();c("#grade_entry").val(parseFloat(b)).show().focus().select()}),c("#grade_entry").keydown(function(a){if(a.keyCode==13)c(this)[0].blur();else if(a.keyCode==27){var b=c(this).parents(".student_assignment").addClass("dont_update").find(".original_score").text();c(this).val(b||"")[0].blur()}}),c("#grades_summary .student_assignment").bind("score_change",function(a,d){var f=c(this),g=f.find(".original_score").text(),h=parseFloat(g),i=parseFloat(f.find("#grade_entry").val()||c(this).find(".score").text()),j;isNaN(h)&&(h=null),isNaN(i)&&(i=null),!i&&i!==0&&(i=h),j=h!=i,i==parseInt(i,10)&&(i+=".0"),f.find(".score").text(i),f.hasClass("dont_update")&&(d=!1,f.removeClass("dont_update"));if(d){var k=f.getTemplateData({textValues:["assignment_id"]}).assignment_id,l=c.replaceTags(c(".update_submission_url").attr("href"),"assignment_id",k);j||(i=null),c.ajaxJSON(l,"PUT",{"submission[student_entered_score]":i},function(a){a={student_entered_score:a.submission.student_entered_score},f.fillTemplateData({data:a})},c.noop),j||(i=h)}c("#grade_entry").hide().appendTo(c("body"));if(j)f.find(".assignment_score").attr("title","").find(".score_teaser").text(b.t("titles.hypothetical_score","This is a What-If score")).end().find(".score_holder").append(c("#revert_score_template").clone(!0).attr("id","").show()).find(".grade").addClass("changed");else{var m=f.data("muted")?b.t("student_mute_notification","Instructor is working on grades"):b.t("click_to_change","Click to test a different score");f.find(".assignment_score").attr("title",b.t("click_to_change","Click to test a different score")).find(".score_teaser").text(m).end().find(".grade").removeClass("changed"),f.find(".revert_score_link").remove()}i===0&&(i="0.0"),i===h&&(i=g),f.find(".grade").html(i||f.find(".grade").data("originalValue")),e()}),c("#grade_entry").blur(function(){var a=c(this).parents(".student_assignment");a.find(".score").text(c(this).val()),a.triggerHandler("score_change",!0)}),c("#grades_summary").delegate(".revert_score_link","click",function(a,d){a.preventDefault(),a.stopPropagation();var f=c(this).parents(".student_assignment"),g=f.find(".original_score").text(),h=f.data("muted")?b.t("student_mute_notification","Instructor is working on grades"):b.t("click_to_change","Click to test a different score");f.find(".score").text(g),f.data("muted")?f.find(".grade").html('<img alt="Muted" class="muted_icon" src="/images/sound_mute.png?1318436336">'):f.find(".grade").text(g||"-"),f.find(".assignment_score").attr("title",b.t("click_to_change","Click to test a different score")).find(".score_teaser").text(h).end().find(".grade").removeClass("changed"),f.find(".revert_score_link").remove(),f.find(".score_value").text(g),d||e()}),c("#grades_summary:not(.editable) .assignment_score").css("cursor","default"),c("#grades_summary tr").hover(function(){c(this).find("td.title .context").addClass("context_hover")},function(){c(this).find("td.title .context").removeClass("context_hover")}),c(".show_guess_grades_link").click(function(a){c("#grades_summary .student_entered_score").each(function(){var a=parseFloat(c(this).text(),10);if(!isNaN(a)&&(a||a===0)){var b=c(this).parents(".student_assignment");b.find(".score").text(a),b.find(".score_value").hide(),b.triggerHandler("score_change",!1)}}),c(".show_guess_grades").hide()}),c("#grades_summary .student_entered_score").each(function(){var a=parseFloat(c(this).text(),10);!isNaN(a)&&a&&c(".show_guess_grades").show().addClass("exists")}),c(".comments .play_comment_link").mediaCommentThumbnail("normal"),c(".play_comment_link").live("click",function(a){a.preventDefault();var b=c(this).parents(".comment_media"),d=b.getTemplateData({textValues:["media_comment_id"]}).media_comment_id;d&&(b.children(":not(.media_comment_content)").remove(),b.find(".media_comment_content").mediaComment("show_inline",d,"any"))}),c("#only_consider_graded_assignments").change(function(){e()}).triggerHandler("change"),c("#show_all_details_link").click(function(a){a.preventDefault(),c("tr.comments").show(),c("tr.rubric_assessments").show()}),c.scrollSidebar(),c("#observer_user_url").change(function(){location.href!=c(this).val()&&(location.href=c(this).val())})})}),function(){require(["grade_summary","compiled/grade_calculator"])}.call(this),define("compiled/bundles/grade_summary",function(){})