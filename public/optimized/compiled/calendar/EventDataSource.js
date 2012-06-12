(function(){var a=function(a,b){return function(){return a.apply(b,arguments)}};define(["jquery","compiled/calendar/commonEventFactory","jquery.ajaxJSON","vendor/jquery.ba-tinypubsub"],function(b,c){return function(){function d(c){this.fetchNextBatch=a(this.fetchNextBatch,this),this.startFetch=a(this.startFetch,this),this.getParticipants=a(this.getParticipants,this),this.getEvents=a(this.getEvents,this),this.getEventsForAppointmentGroup=a(this.getEventsForAppointmentGroup,this),this.processAppointmentData=a(this.processAppointmentData,this),this.getAppointmentGroups=a(this.getAppointmentGroups,this),this.getAppointmentGroupsFromCache=a(this.getAppointmentGroupsFromCache,this),this.getEventsFromCache=a(this.getEventsFromCache,this),this.processNextRequest=a(this.processNextRequest,this),this.getEventsFromCacheForContext=a(this.getEventsFromCacheForContext,this),this.addEventToCache=a(this.addEventToCache,this),this.needUndatedEventsForContexts=a(this.needUndatedEventsForContexts,this),this.requiredDateRangeForContexts=a(this.requiredDateRangeForContexts,this),this.requiredDateRangeForContext=a(this.requiredDateRangeForContext,this),this.clearCache=a(this.clearCache,this),this.eventWithId=a(this.eventWithId,this),this.eventDeleted=a(this.eventDeleted,this),this.eventSaved=a(this.eventSaved,this),this.contexts=c,this.clearCache(),this.inFlightRequest=!1,this.pendingRequests=[],b.subscribe("CommonEvent/eventDeleted",this.eventDeleted),b.subscribe("CommonEvent/eventSaved",this.eventSaved)}return d.prototype.eventSaved=function(a){return this.addEventToCache(a)},d.prototype.eventDeleted=function(a){var b,c;b=(c=this.cache.contexts[a.contextCode()])!=null?c.events:void 0;if(b)return delete b[a.id]},d.prototype.eventWithId=function(a){var b,c,d;d=this.cache.contexts;for(b in d){c=d[b];if(c.events[a])return c.events[a]}return null},d.prototype.clearCache=function(){var a,b,c,d,e;this.cache={contexts:{},appointmentGroups:{},participants:{},fetchedAppointmentGroups:null},d=this.contexts,e=[];for(b=0,c=d.length;b<c;b++)a=d[b],e.push(this.cache.contexts[a.asset_string]={events:{},fetchedRanges:[],fetchedUndated:!1});return e},d.prototype.requiredDateRangeForContext=function(a,b,c){var d,e,f,g,h;if(!(d=this.cache.contexts[c]))return[a,b];if(!(f=d.fetchedRanges))return[a,b];for(g=0,h=f.length;g<h;g++)e=f[g],e[0]<=a&&a<=e[1]&&(a=e[1]),e[0]<=b&&b<=e[1]&&(b=e[0]);return[a,b]},d.prototype.requiredDateRangeForContexts=function(a,b,c){var d,e,f,g,h,i,j,k;f=b,g=a;for(i=0,j=c.length;i<j;i++)d=c[i],k=this.requiredDateRangeForContext(a,b,d),h=k[0],e=k[1],h<f&&(f=h),e>g&&(g=e);return[f,g]},d.prototype.needUndatedEventsForContexts=function(a){var b,c,d;for(c=0,d=a.length;c<d;c++){b=a[c];if(!this.cache.contexts[b].fetchedUndated)return!0}return!1},d.prototype.addEventToCache=function(a){var b,c;return b=a.contextCode(),c=this.cache.contexts[b],c.events[a.id]=a},d.prototype.getEventsFromCacheForContext=function(a,b,c){var d,e,f,g,h;d=this.cache.contexts[c],f=[],h=d.events;for(g in h)e=h[g],(!e.start&&!a||e.start>=a&&e.start<=b)&&f.push(e);return f},d.prototype.processNextRequest=function(){var a,b,c;c=this.pendingRequests.shift();if(c)return b=c[0],a=c[1],b.apply(null,a)},d.prototype.getEventsFromCache=function(a,b,c){var d,e,f,g;e=[];for(f=0,g=c.length;f<g;f++)d=c[f],e=e.concat(this.getEventsFromCacheForContext(a,b,d));return e},d.prototype.getAppointmentGroupsFromCache=function(){var a,b,c,d;c=this.cache.appointmentGroups,d=[];for(b in c)a=c[b],d.push(a);return d},d.prototype.getAppointmentGroups=function(a,b){var c,d,e,f=this;if(this.inFlightRequest){this.pendingRequests.push([this.getAppointmentGroups,arguments]);return}if(this.cache.fetchedAppointmentGroups&&this.cache.fetchedAppointmentGroups.manageable===a){b(this.getAppointmentGroupsFromCache()),this.processNextRequest();return}return this.cache.fetchedAppointmentGroups={manageable:a},this.cache.appointmentGroups={},c=function(a,b,c){var d,e,g,h;if(a){h=[];for(e=0,g=a.length;e<g;e++)d=a[e],c.scope==="manageable"?d.is_manageable=!0:d.is_scheduleable=!0,h.push(f.processAppointmentData(d));return h}},d=function(){return b(f.getAppointmentGroupsFromCache())},e=[["/api/v1/appointment_groups",{include:["appointments","child_events"]}]],a&&e.push(["/api/v1/appointment_groups",{scope:"manageable",include:["appointments","child_events"]}]),this.startFetch(e,c,d)},d.prototype.processAppointmentData=function(a){var b,d,e,f,g,h,i,j,k;g=a.id,this.cache.appointmentGroups[g]=a;if(a.appointments){a.appointmentEvents=[],j=a.appointments,k=[];for(h=0,i=j.length;h<i;h++)f=j[h],e=c(f,this.contexts),e&&e.object.workflow_state!=="deleted"?(a.appointmentEvents.push(e),this.addEventToCache(e),f.child_events?(e.childEvents=[],k.push(function(){var a,g,h,i;h=f.child_events,i=[];for(a=0,g=h.length;a<g;a++)d=h[a],b=c(d,this.contexts),this.addEventToCache(e),i.push(e.childEvents.push(b));return i}.call(this))):k.push(void 0)):k.push(void 0);return k}},d.prototype.getEventsForAppointmentGroup=function(a,b){var c,d,e=this;if(this.inFlightRequest){this.pendingRequests.push([this.getEventsForAppointmentGroup,arguments]);return}if(a.appointmentEvents){b(a.appointmentEvents),this.processNextRequest();return}return c=function(a){if(a)return e.processAppointmentData(a)},d={include:["appointments","child_events"]},this.startFetch([[a.url,d]],c,function(){return b(a.appointmentEvents)})},d.prototype.getEvents=function(a,d,e,f){var g,h,i,j,k,l,m,n,o,p=this;if(this.inFlightRequest){this.pendingRequests.push([this.getEvents,arguments]);return}l=function(a,c,d){var e,f,g;return g=p.requiredDateRangeForContexts(a,c,d),f=g[0],e=g[1],f<e?{context_codes:d,start_date:b.dateToISO8601UTC(f),end_date:b.dateToISO8601UTC(e)}:null},m=function(a){return p.needUndatedEventsForContexts(a)?{context_codes:a,undated:"1"}:null},k=a?l(a,d,e):m(e);if(!k){f(this.getEventsFromCache(a,d,e)),this.processNextRequest();return}for(n=0,o=e.length;n<o;n++)g=e[n],h=this.cache.contexts[g],h&&(a?h.fetchedRanges.push([a,d]):h.fetchedUndated=!0);return j=function(){return f(p.getEventsFromCache(a,d,e))},i=function(a){var b,d,e,f,g;if(a){g=[];for(e=0,f=a.length;e<f;e++)b=a[e],d=c(b,p.contexts),d&&d.object.workflow_state!=="deleted"?g.push(p.addEventToCache(d)):g.push(void 0);return g}},this.startFetch([["/api/v1/calendar_events",k],["/api/v1/calendar_events",b.extend({type:"assignment"},k)]],i,j)},d.prototype.getParticipants=function(a,b,c){var d,e,f,g,h=this;if(this.inFlightRequest){this.pendingRequests.push([this.getParticipants,arguments]);return}f=""+a.id+"_"+b;if(this.cache.participants[f]){c(this.cache.participants[f]),this.processNextRequest();return}return this.cache.participants[f]=[],d=function(a,b,c){if(a)return h.cache.participants[f].push.apply(h.cache.participants[f],a)},e=function(){return c(h.cache.participants[f])},g=a.participant_type==="Group"?"groups":"users",this.startFetch([["/api/v1/appointment_groups/"+a.id+"/"+g,{registration_status:b}]],d,e)},d.prototype.startFetch=function(a,b,c){var d,e,f,g,h,i,j=this;d=0,this.inFlightRequest=!0,f=function(e,f,g,h){b(e,g,h);if(f){d+=1;if(d>=a.length)return c(),j.inFlightRequest=!1,j.processNextRequest()}},i=[];for(g=0,h=a.length;g<h;g++)e=a[g],i.push(function(a){return j.fetchNextBatch(a[0],a[1],function(b,c){return f(b,c,a[0],a[1])})}(e));return i},d.prototype.fetchNextBatch=function(a,c,d){var e,f=this;return e=function(a){var b,c,d,e,f,g,h,i;if(!a)return null;e={},h=a.split(",");for(f=0,g=h.length;f<g;f++)b=h[f],i=b.split(";"),c=i[0],d=i[1],c=c.replace(/^</,"").replace(/>$/,""),d=d.split('"')[1],e[d]=c;return e},b.publish("EventDataSource/ajaxStarted"),c.per_page=50,b.ajaxJSON(a,"GET",c,function(a,g){var h,i;b.publish("EventDataSource/ajaxEnded"),h=typeof g.getResponseHeader=="function"?g.getResponseHeader("Link"):void 0,i=e(h);if(i!=null?i.next:void 0){d(a,!1),f.fetchNextBatch(i.next,c,d);return}return d(a,!0)})},d}()})}).call(this)