(function(){var a=function(a,b){return function(){return a.apply(b,arguments)}};define(["jquery","i18n!calendar","compiled/util/Popover","compiled/calendar/CommonEvent","compiled/calendar/EditEventDetailsDialog","jst/calendar/eventDetails","jst/calendar/deleteItem","jst/calendar/reservationOverLimitDialog","compiled/calendar/MessageParticipantsDialog","compiled/fn/preventDefault","underscore","jquery.ajaxJSON","jquery.instructure_misc_helpers","jquery.instructure_misc_plugins","vendor/jquery.ba-tinypubsub"],function(b,c,d,e,f,g,h,i,j,k,l){var m,n,o=this;return n=function(a){return function(){return a.apply(this,[])}},m=function(){function e(b,c){this.dataSource=c,this.show=a(this.show,this),this.cancelAppointment=a(this.cancelAppointment,this),this.unreserveEvent=a(this.unreserveEvent,this),this.reserveEvent=a(this.reserveEvent,this),this.reserveSuccessCB=a(this.reserveSuccessCB,this),this.reserveErrorCB=a(this.reserveErrorCB,this),this.deleteEvent=a(this.deleteEvent,this),this.showEditDialog=a(this.showEditDialog,this),this.event=b,this.contexts=b.contexts}return e.name="ShowEventDetailsDialog",e.prototype.showEditDialog=function(){return this.popover.hide(),(new f(this.event)).show()},e.prototype.deleteEvent=function(a){var d,e=this;a==null&&(a=this.event);if(this.event.isNewEvent())return;return d=a.object.url,a.object.assignment&&(d=b.replaceTags(this.event.deleteURL,"id",this.event.object.id)),b("<div />").confirmDelete({url:d,message:b(h({message:a.deleteConfirmation,hide_reason:a.object.workflow_state!=="locked"})),dialog:{title:c.t("confirm_deletion","Confirm Deletion")},prepareData:function(a){return{cancel_reason:a.find("#cancel_reason").val()}},confirmed:function(){return e.popover.hide(),b.publish("CommonEvent/eventDeleting",a)},success:function(){return b.publish("CommonEvent/eventDeleted",a)}})},e.prototype.reserveErrorCB=function(a){var d,e,f,g,h,j=this;for(g=0,h=a.length;g<h;g++){e=a[g];if(e.message!=="participant has met per-participant limit")continue;f=!0,e.reschedulable=e.reservations.length===1,d=b(i(e)).dialog({resizable:!1,width:450,buttons:e.reschedulable?[{text:c.t("reschedule","Reschedule"),"class":"ui-button-primary",click:function(){return d.disableWhileLoading(j.reserveEvent({cancel_existing:!0}).always(function(){return d.dialog("close")}))}},{text:c.t("do_nothing","Do Nothing"),click:function(){return d.dialog("close")}}]:[{text:c.t("ok","OK"),click:function(){return d.dialog("close")}}]})}if(!f)return alert("Could not reserve event: "+a),b.publish("CommonEvent/eventSaveFailed",this.event)},e.prototype.reserveSuccessCB=function(a){return this.popover.hide(),b.publish("CommonEvent/eventSaved",this.event)},e.prototype.reserveEvent=function(a){return a==null&&(a={}),b.publish("CommonEvent/eventSaving",this.event),b.ajaxJSON(this.event.object.reserve_url,"POST",a,this.reserveSuccessCB,this.reserveErrorCB)},e.prototype.unreserveEvent=function(){var a,b,c,d,e;d=this.event.childEvents;for(b=0,c=d.length;b<c;b++){a=d[b];if((e=a.object)!=null?e.own_reservation:void 0){this.deleteEvent(a);return}}},e.prototype.cancelAppointment=function(a){var d,e,f,g=this;return e=a.data("url"),d=l.detect(this.event.calendarEvent.child_events,function(a){return a.url===e}),b("<div/>").confirmDelete({url:e,message:b(h({message:c.t("cancel_appointment","Are you sure you want to cancel your appointment with %{name}?",{name:((f=d.user)!=null?f.short_name:void 0)||d.group.name})})),dialog:{title:c.t("confirm_removal","Confirm Removal"),width:"400px",resizable:!1},prepareData:function(a){return{cancel_reason:a.find("#cancel_reason").val()}},success:function(){var c,d;g.event.object.child_events=l(g.event.object.child_events).reject(function(b){return b.url===a.data("url")}),a.remove(),d=b("#scheduler").prop("checked"),c=g.event.calendarEvent.child_events;if(!d&&c.length===0)return b.publish("CommonEvent/eventDeleted",g.event),g.popover.hide()}})},e.prototype.show=function(a){var c,e,f,h,i,l,m,o,p,q,r,s,t,u,v,w=this;e=b.extend(!0,{},this.event,{can_reserve:(l=this.event.object)!=null?l.reserve_url:void 0}),this.event.contextInfo.can_create_appointment_groups&&(e.can_reserve=!1);if((m=this.event.object)!=null?m.child_events:void 0){this.event.object.reserved&&(e.can_unreserve=!0,e.can_reserve=!1),o=this.event.object.child_events;for(h=0,i=o.length;h<i;h++)c=o[h],f={id:((p=c.user)!=null?p.id:void 0)||c.group.id,name:((q=c.user)!=null?q.short_name:void 0)||c.group.name,event_url:c.url},((r=e.reservations)!=null?r:e.reservations=[]).push(f),c.user&&((s=e.reserved_users)!=null?s:e.reserved_users=[]).push(f),c.group&&((t=e.reserved_groups)!=null?t:e.reserved_groups=[]).push(f)}return((u=this.event.object)!=null?u.available_slots:void 0)===0?(e.can_reserve=!1,e.availableSlotsText="None"):((v=this.event.object)!=null?v.available_slots:void 0)>0&&(e.availableSlotsText=this.event.object.available_slots),e.showEventLink=e.can_edit&&e.fullDetailsURL(),e.showEventLink||(e.showEventLink=e.isAppointmentGroupEvent()),this.popover=new d(a,g(e)),this.popover.el.find(".edit_event_link").click(k(this.showEditDialog)),this.popover.el.find(".delete_event_link").click(k(n(this.deleteEvent))),this.popover.el.find(".reserve_event_link").click(k(n(this.reserveEvent))),this.popover.el.find(".unreserve_event_link").click(k(this.unreserveEvent)),this.popover.el.find(".cancel_appointment_link").click(k(function(a){var c;return c=b(a.target).closest("li"),w.cancelAppointment(c)})),this.popover.el.find(".message_students").click(k(function(){return(new j({timeslot:w.event.calendarEvent})).show()}))},e}()})}).call(this)