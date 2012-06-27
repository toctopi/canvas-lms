(function(){var a=function(a,b){return function(){return a.apply(b,arguments)}};define(["jquery","underscore","i18n!calendar","jst/calendar/messageParticipants","jst/calendar/recipientList"],function(b,c,d,e,f){var g;return g=function(){function g(d){var g;this.opts=d,this.messageFailed=a(this.messageFailed,this),this.messageSent=a(this.messageSent,this),this.sendMessage=a(this.sendMessage,this),this.loadParticipants=a(this.loadParticipants,this),this.opts.timeslot?(this.recipients=c(this.opts.timeslot.child_events).map(function(a){return a.user||a.group}),g=this.recipients[0].short_name===void 0?"Group":"User",this.$form=b(e({participant_type:g})),this.$form.find("select.message_groups").remove()):(this.group=this.opts.group,this.$form=b(e({participant_type:this.group.participant_type})),this.dataSource=this.opts.dataSource,this.$select=this.$form.find("select.message_groups").change(this.loadParticipants).val("unregistered")),this.$form.submit(this.sendMessage),this.$participantList=this.$form.find("ul"),this.recipients&&this.$participantList.html(f({recipientType:g,recipients:this.recipients}))}return g.name="MessageParticipantsDialog",g.prototype.show=function(){return this.$form.dialog({width:400,resizable:!1,buttons:[{text:d.t("buttons.send_message","Send"),"data-text-while-loading":d.t("buttons.sending_message","Sending..."),click:function(){return b(this).submit()}},{text:d.t("buttons.cancel","Cancel"),click:function(){return b(this).dialog("close")}}],close:function(){return b(this).remove()}}),this.loadParticipants()},g.prototype.participantStatus=function(a){var c;return a==null&&(a=null),c=b('<li class="status" />'),this.$participantList.html(c),a?c.text(a):c.spin()},g.prototype.loadParticipants=function(){var a,b=this;if(this.recipients)return;return a=this.$select.val(),this.loading=!0,this.participantStatus(),this.dataSource.getParticipants(this.group,a,function(a){var c;return delete b.loading,a.length?b.$participantList.html(f({recipientType:b.group.participant_type,recipients:a})):(c=b.group.participant_type==="Group"?d.t("no_groups","No groups found"):d.t("no_users","No users found"),b.participantStatus(c))})},g.prototype.sendMessage=function(a){var c,d;a.preventDefault();if(this.loading)return;c=this.$form.getFormData();if(!c["recipients[]"]||!c.body)return;return d=b.ajaxJSON("/conversations","POST",c,this.messageSent,this.messageFailed),this.$form.disableWhileLoading(d,{buttons:["[data-text-while-loading] .ui-button-text"]})},g.prototype.messageSent=function(a){return this.$form.dialog("close"),b.flashMessage(d.t("messages_sent","Messages Sent"))},g.prototype.messageFailed=function(a){return this.$form.find(".error").text(d.t("errors.send_message_failed","There was an error sending your message, please try again"))},g}()})}).call(this)