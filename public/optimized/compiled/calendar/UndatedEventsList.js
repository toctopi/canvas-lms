(function(){var a=function(a,b){return function(){return a.apply(b,arguments)}};define(["jquery","jst/calendar/undatedEvents","compiled/calendar/EventDataSource","compiled/calendar/ShowEventDetailsDialog","jqueryui/draggable","jquery.disableWhileLoading","vendor/jquery.ba-tinypubsub"],function(b,c,d,e){var f;return f=function(){function d(d,e){this.dataSource=e,this.eventSaved=a(this.eventSaved,this),this.eventSaving=a(this.eventSaving,this),this.visibleContextListChanged=a(this.visibleContextListChanged,this),this.clickEvent=a(this.clickEvent,this),this.show=a(this.show,this),this.load=a(this.load,this),this.div=b(d).html(c({})),this.hidden=!0,this.visibleContextList=[],b.subscribe({"CommonEvent/eventDeleting":this.eventSaving,"CommonEvent/eventDeleted":this.eventSaved,"CommonEvent/eventSaving":this.eventSaving,"CommonEvent/eventSaved":this.eventSaved,"Calendar/visibleContextListChanged":this.visibleContextListChanged}),this.div.delegate(".event","click",this.clickEvent).delegate(".undated-events-link","click",this.show)}return d.name="UndatedEventsList",d.prototype.load=function(){var a,d=this;if(this.hidden)return;return a=new b.Deferred,this.div.disableWhileLoading(a,{buttons:[".undated-events-link"],opacity:1,lines:8,length:2,width:2,radius:3}),this.dataSource.getEvents(null,null,this.visibleContextList,function(e){var f,g,h;a.resolve(),d.div.html(c({events:e}));for(g=0,h=e.length;g<h;g++)f=e[g],d.div.find("."+f.id).data("calendarEvent",f);return d.div.find(".event").draggable({revert:"invalid",revertDuration:0,helper:"clone",start:function(){return b(this).hide()},stop:function(){if(!b(this).data("calendarEvent").start)return b(this).show()}})})},d.prototype.show=function(a){return a.preventDefault(),this.hidden=!1,this.load()},d.prototype.clickEvent=function(a){var c,d;d=b(a.target).data("event-id"),c=this.dataSource.eventWithId(d);if(c)return(new e(c,this.dataSource)).show()},d.prototype.visibleContextListChanged=function(a){this.visibleContextList=a;if(!this.hidden)return this.load()},d.prototype.eventSaving=function(a){return this.div.find("."+a.id).addClass("event_pending")},d.prototype.eventSaved=function(){return this.load()},d}()})}).call(this)