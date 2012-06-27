define("translations/calendars",["i18nObj","jquery"],function(a,b){b.extend(!0,a,{translations:{es:{calendars:{assignment_details:"Detalles de la Tarea",default_title:"evento",event_details:"Detalles del Evento",feed_dialog_title:"Canal del Calendario",keycodes:{"delete":"d",edit:"e","new":"n",next_day:"ctrl + derecha",next_event:"j",next_week:"ctrl + abajo",open:"o",previous_day:"ctrl + izquierda",previous_event:"k",previous_week:"ctrl + arriba",refresh:"r"},notices:{event_moved:"%{event} fue movido a %{day}"},prompts:{delete_assignment:"¿Está seguro que quiere borrar esta tarea?",delete_event:"¿Está seguro que quiere borrar este evento?"},titles:{add_new_assignment:"Agregar Tarea Nueva",add_new_event:"Agregar Evento Nuevo",edit_assignment:"Editar la Tarea",edit_event:"Editar el Evento"}}}}})}),define("calendar_move",["i18n!calendars","jquery","jquery.instructure_date_and_time","jquery.templateData","jqueryui/datepicker"],function(a,b){function c(a){return{day:a.getDate(),month:a.getMonth(),year:a.getFullYear()}}var d=a.t("#date.month_names");return{changeMonth:function(a,e){var f=a.data("calendar_objects"),g={},h=null;if(typeof e=="string"){var h=b.datepicker.parseDate("mm/dd/yy",e);h&&h.setDate(1)}if(!h)var i=parseInt(a.find(".month_number").text(),10),j=parseInt(a.find(".year_number").text(),10),h=new Date(j,i+e-1,1);var g={month_name:d[h.getMonth()+1],month_number:h.getMonth()+1,year_number:h.getFullYear()};a.fillTemplateData({data:g});var k=new Date,l=c(k),m=c(h);k=h,k.setDate(0),k.setDate(k.getDate()-k.getDay());var n=c(k),o=null;m.day!=n.day&&(k.setDate(1),k.setMonth(k.getMonth()+1),k.setDate(0),o={day:k.getDate(),month:n.month,year:n.year},k.setDate(1),k.setMonth(k.getMonth()+1)),k.setMonth(h.getMonth()+1),k.setDate(0);var p={day:k.getDate(),month:m.month,year:m.yearh};k.setDate(k.getDate()+1),k.setDate(k.getDate()+(6-k.getDay())),k.setDate(k.getDate()+7);var q=c(k),r=a.data("days");r||(r=a.find(".calendar_day_holder"),a.data("days",r)),a.hasClass("mini_month")&&(r=a.find(".day")),a.find(".calendar_event").remove();var s=0,t=n.day,i=n.month,j=n.year;while(t<=q.day||i!=q.month){var u=r.eq(s);if(u.length>0){var v=u.attr("class").split(" "),w=[];for(var x=0;x<v.length;x++)v[x].indexOf("date_")!=0&&w.push(v[x]);u.attr("class",w.join(" "))}u.show().addClass("visible").parents("tr").show().addClass("visible");var g={day_number:t},y=i<9?"0"+(i+1):i+1,z=t<10?"0"+t:t;id="day_"+j+"_"+y+"_"+z,a.hasClass("mini_month")&&(id="mini_"+id),u.attr("id",id).find(".day_number").text(t).attr("title",y+"/"+z+"/"+j).addClass("date_"+y+"_"+z+"_"+j);var A=u.children("div");a.hasClass("mini_month")&&(A=u),A.removeClass("current_month other_month today"),i==m.month?A.addClass("current_month"):A.addClass("other_month"),i==l.month&&t==l.day&&j==l.year&&A.addClass("today"),t++,s++;if(o&&t>o.day&&i==o.month||t>p.day&&i==p.month)i+=1,i>=12&&(i-=12,j++),t=1}while(s<r.length){var u=r.eq(s);u.parents("tr").hide().removeClass("visible"),u.hide().removeClass("visible"),s++}!!a.hasClass("mini_month")}}}),define("syllabus",["jquery","calendar_move","wikiSidebar","jquery.instructure_date_and_time","jquery.instructure_forms","jquery.instructure_misc_helpers","jquery.instructure_misc_plugins","jquery.loadingImg","compiled/tinymce","tinymce.editor_box","vendor/jquery.scrollTo","jqueryui/datepicker"],function(a,b,c){a(function(a){function d(){k.find(".day.has_event").removeClass("has_event"),j.find("tr.date").each(function(){var b=a(this).find(".day_date").attr("data-date").split("/"),c=b.join("_"),d=[b[2],b[0],b[1]].join("_");k.find(".mini_calendar_day.date_"+c+", #mini_day_"+d).addClass("has_event")})}function e(b,c){a("tr.date.related,.day.related").removeClass("related");if(b){var d=c.split("/"),e=d.join("_"),f=[d[2],d[0],d[1]].join("_");k.find(".mini_calendar_day.date_"+e+", #mini_day_"+f).add(j.find("tr.date.events_"+e)).addClass("related")}}var f=a("#edit_course_syllabus_form"),g=a("#course_syllabus_body"),h=a("#course_syllabus"),i=a("#course_syllabus_details"),j=a("#syllabus"),k=a(".mini_month");k.find(".next_month_link, .prev_month_link").bind("mousedown",function(c){c.preventDefault(),b.changeMonth(k,a(this).hasClass("next_month_link")?1:-1),d()}).bind("click",!1),k.delegate(".mini_calendar_day","click",function(c){c.preventDefault();var f=a(this).find(".day_number").attr("title");b.changeMonth(k,f),d(),a(".events_"+f.replace(/\//g,"_")).ifExists(function(b){a("html,body").scrollTo(b),e(!0,f)})}).delegate(".mini_calendar_day","mouseover mouseout",function(b){e(b.type==="mouseover",a(this).find(".day_number").attr("title"))}),j.delegate("tr.date","mouseenter mouseleave",function(b){e(b.type==="mouseenter",a(this).find(".day_date").attr("title"))}),a(".jump_to_today_link").click(function(c){c.preventDefault();var d=a.datepicker.formatDate("mm/dd/yy",new Date),f;a("tr.date").each(function(){var b=a(this).find(".day_date").attr("title");if(b>d)return!1;f=a(this)}),b.changeMonth(k,d),a("html,body").scrollTo(f||a("tr.date:first")),e(!0,d)}),c&&c.init(),f.bind("edit",function(){f.show(),h.hide(),i.hide(),g.editorBox(),g.editorBox("set_code",h.html()),c&&(c.attachToEditor(g),c.show(),a("#sidebar_content").hide())}),f.bind("hide_edit",function(){f.hide(),h.show();var b=a.trim(h.html());i.showIf(!b),g.editorBox("destroy"),a("#sidebar_content").show(),c&&c.hide()}),a(".edit_syllabus_link").click(function(b){b.preventDefault(),a("#edit_course_syllabus_form").triggerHandler("edit")}),f.find(".toggle_views_link").click(function(a){a.preventDefault(),g.editorBox("toggle")}),f.find(".cancel_button").click(function(a){f.triggerHandler("hide_edit"),a.preventDefault()}),f.formSubmit({object_name:"course",processData:function(a){return a["course[syllabus_body]"]=g.editorBox("get_code"),a},beforeSubmit:function(a){f.triggerHandler("hide_edit"),i.hide(),h.loadingImage()},success:function(a){h.loadingImage("remove").html(a.course.syllabus_body),i.hide()},error:function(a){f.triggerHandler("edit").formErrors(a)}}),a.scrollSidebar(),d()})}),function(){require(["syllabus"])}.call(this),define("compiled/bundles/syllabus",function(){})