define("jst/calendar/editAppointmentGroup",["compiled/handlebars_helpers","i18n!calendar.edit_appointment_group"],function(a){var b=a.template,c=a.templates=a.templates||{};return c["calendar/editAppointmentGroup"]=b(function(a,b,c,d,e){function r(a,b){return"checked"}function s(a,b){return" "}function t(a,b){return' style="display:none;" '}function u(a,b){return' style="display:none;" '}c=c||a.helpers;var f="",g,h,i,j,k,l=this,m="function",n=c.helperMissing,o=void 0,p=this.escapeExpression,q=c.blockHelperMissing;f+="<form action='#' id='edit_appointment_form'>\n  <div class=\"left-column-wrapper\">\n    <p>\n      <b>",g="Name",h="name",i={},j="calendar.editAppointmentGroup",i.scope=j,j=c.t||b.t,k={},k.hash=i,typeof j===m?g=j.call(b,h,g,k):j===o?g=n.call(b,"t",h,g,k):g=j;if(g||g===0)f+=g;f+='</b><br />\n      <input type="text" name="title" style="width: 190px" value="',g=c.appointment_group||b.appointment_group,g=g===null||g===undefined||g===!1?g:g.title,typeof g===m?g=g.call(b,{hash:{}}):g===o&&(g=n.call(b,"appointment_group.title",{hash:{}})),f+=p(g)+'">\n    </p>\n    <p>\n      <b>',g="Location",h="location",i={},j="calendar.editAppointmentGroup",i.scope=j,j=c.t||b.t,k={},k.hash=i,typeof j===m?g=j.call(b,h,g,k):j===o?g=n.call(b,"t",h,g,k):g=j;if(g||g===0)f+=g;f+='</b><br />\n      <input type="text" name="location" style="width: 190px" value="',g=c.appointment_group||b.appointment_group,g=g===null||g===undefined||g===!1?g:g.location_name,typeof g===m?g=g.call(b,{hash:{}}):g===o&&(g=n.call(b,"appointment_group.location_name",{hash:{}})),f+=p(g)+'">\n    </p>\n    <div class="select-calendar-container">\n      <b>',g="Calendar",h="calendar",i={},j="calendar.editAppointmentGroup",i.scope=j,j=c.t||b.t,k={},k.hash=i,typeof j===m?g=j.call(b,h,g,k):j===o?g=n.call(b,"t",h,g,k):g=j;if(g||g===0)f+=g;f+='</b><br />\n      <button class="button ag_contexts_selector"></button>\n      <div class="ag-menu-container"></div>\n    </div>\n    <p>\n      <input type="checkbox" class="group-signup-checkbox" id="group-signup-checkbox" name="use_group_signup" value="1" ',g="Group",h=c.participant_type||b.participant_type,i=c.ifEqual||b.ifEqual,k=l.program(1,r,e),k.hash={},k.fn=k,k.inverse=l.noop,typeof i===m?g=i.call(b,h,g,k):g=q.call(b,i,h,g,k);if(g||g===0)f+=g;f+='>\n      <label for="group-signup-checkbox">Have students sign up in groups.</label>\n    </p>\n    <div class="group-signup" style="display: none">\n      <b>',g="Group Category",h="group_category",i={},j="calendar.editAppointmentGroup",i.scope=j,j=c.t||b.t,k={},k.hash=i,typeof j===m?g=j.call(b,h,g,k):j===o?g=n.call(b,"t",h,g,k):g=j;if(g||g===0)f+=g;f+='</b><br />\n      <div class="group_select">\n        <select name="group_category_id"></select>\n      </div>\n    </div>\n  </div>\n  <div class="right-column-wrapper">\n    <div class="time-block-list-wrapper">\n      <div class="time-block-list">\n        <table class="time-block-list-header">\n          <tr>\n            <th class="date-column">Date</th>\n            <th class="time-range-column" colspan="4">Time Range</th>\n          </tr>\n        </table>\n        <div class="time-block-list-body-wrapper">\n          <table class="time-block-list-body"></table>\n        </div>\n        <div class="splitter" style="font-size: 0.8em">\n          <p>\n            <a class="split-link button small-button" href="#">Split</a>into slots of <input type="number" name="duration" value="30" style="width: 40px" /> minutes each.\n          </p>\n        </div>\n      </div>\n    </div>\n    <div style="margin-top: 1.5em">\n      <b>Options</b>\n      <ul class="ag-options">\n        <li>\n          <input type="checkbox" id="appointment-blocks-per-slot-option-button" name="per_slot_option" value="1" />\n          <label for="appointment-blocks-per-slot-option-button">Limit each time slot to</label>\n          <input type="number" name="participants_per_appointment" value="',g=c.appointment_group||b.appointment_group,g=g===null||g===undefined||g===!1?g:g.participants_per_appointment,typeof g===m?g=g.call(b,{hash:{}}):g===o&&(g=n.call(b,"appointment_group.participants_per_appointment",{hash:{}})),f+=p(g)+'" style="width: 40px;" />\n          <label for="appointment-blocks-per-slot-option-button">\n            <span ',g="Group",h=c.participant_type||b.participant_type,i=c.ifEqual||b.ifEqual,k=l.program(3,s,e),k.hash={},k.fn=k,k.inverse=l.program(5,t,e),typeof i===m?g=i.call(b,h,g,k):g=q.call(b,i,h,g,k);if(g||g===0)f+=g;f+=' class="per_appointment_groups_label">groups.</span>\n            <span ',g="Group",h=c.participant_type||b.participant_type,i=c.ifEqual||b.ifEqual,k=l.program(7,u,e),k.hash={},k.fn=k,k.inverse=l.noop,typeof i===m?g=i.call(b,h,g,k):g=q.call(b,i,h,g,k);if(g||g===0)f+=g;return f+=' class="per_appointment_users_label">users.</span>\n          </label>\n        </li>\n        <li>\n          <input type="checkbox" id="appointment-blocks-participant-visibility-button" name="participant_visibility" value="1" />\n          <label for="appointment-blocks-participant-visibility-button">Allow students to see who has signed up for time slots.</label>\n        </li>\n        <li>\n          <input type="checkbox" id="max-per-student-option" name="max_appointments_per_participant_option" value="1">\n          <label for="max-per-student-option">Limit participants to</label>\n          <input type="number" name="max_appointments_per_participant" value="',g=c.appointment_group||b.appointment_group,g=g===null||g===undefined||g===!1?g:g.max_appointments_per_participant,typeof g===m?g=g.call(b,{hash:{}}):g===o&&(g=n.call(b,"appointment_group.max_appointments_per_participant",{hash:{}})),f+=p(g)+'" min="1"style="width: 40px">\n          <label for="max-per-student-option">appointment(s).</label>\n        </li>\n      </ul>\n    </div>\n  </div>\n  <div class="details-wrapper">\n    <b>Details:</b><br />\n    <textarea name="description" style="width: 100%">',g=c.appointment_group||b.appointment_group,g=g===null||g===undefined||g===!1?g:g.description,typeof g===m?g=g.call(b,{hash:{}}):g===o&&(g=n.call(b,"appointment_group.description",{hash:{}})),f+=p(g)+"</textarea>\n  </div>\n</form>\n",f}),c["calendar/editAppointmentGroup"]})