(function(){var a=function(a,b){return function(){return a.apply(b,arguments)}};define(["jquery","i18n!calendar","underscore","compiled/calendar/CommonEvent","compiled/calendar/EditCalendarEventDetails","compiled/calendar/EditAssignmentDetails","compiled/calendar/EditApptCalendarEventDialog","compiled/calendar/EditAppointmentGroupDetails","jst/calendar/editEvent","jqueryui/dialog","jqueryui/tabs"],function(b,c,d,e,f,g,h,i,j){var k;return k=b('<div id="edit_event"><div /></div>').appendTo("body").dialog({autoOpen:!1,width:"auto",resizable:!1,title:c.t("titles.edit_event","Edit Event")}),function(){function c(b){this.event=b,this.show=a(this.show,this),this.closeCB=a(this.closeCB,this),this.contextChange=a(this.contextChange,this),this.setupTabs=a(this.setupTabs,this),this.currentContextInfo=null}return c.prototype.contextInfoForCode=function(a){var b,c,d,e;e=this.event.possibleContexts();for(c=0,d=e.length;c<d;c++){b=e[c];if(b.asset_string===a)return b}return null},c.prototype.setupTabs=function(){var a,c;return c=k.find("#edit_event_tabs"),c.tabs().bind("tabsselect",function(a,c){return b(c.panel).closest(".tab_holder").data("form-widget").activate()}),this.event.eventType==="calendar_event"?(c.tabs("select",0),c.tabs("remove",1),this.calendarEventForm.activate()):this.event.eventType==="assignment"?(c.tabs("select",1),c.tabs("remove",0),this.assignmentDetailsForm.activate()):(a=d.any(this.event.allPossibleContexts,function(a){return a.can_create_assignments}),a||c.tabs("remove",1),this.calendarEventForm.activate())},c.prototype.contextChange=function(a){k.removeClass(k.data("group_class")),k.addClass("group_"+a).data("group_class","group_"+a),this.calendarEventForm&&this.calendarEventForm.setContext(a);if(this.assignmentDetailsForm)return this.assignmentDetailsForm.setContext(a)},c.prototype.closeCB=function(){return k.dialog("close")},c.prototype.show=function(){var a,c;if(this.event.isAppointmentGroupEvent())return(new h(this.event)).show();c=j(),k.children().replaceWith(c);if(this.event.isNewEvent()||this.event.eventType==="calendar_event")a=k.find("#edit_calendar_event_form_holder"),this.calendarEventForm=new f(a,this.event,this.contextChange,this.closeCB),a.data("form-widget",this.calendarEventForm);if(this.event.isNewEvent()||this.event.eventType==="assignment")this.assignmentDetailsForm=new g(b("#edit_assignment_form_holder"),this.event,this.contextChange,this.closeCB),k.find("#edit_assignment_form_holder").data("form-widget",this.assignmentDetailsForm);return this.setupTabs(),k.dialog("open")},c}()})}).call(this)