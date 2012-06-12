(function() {

  require(['Backbone', 'compiled/discussions/app', 'compiled/discussions/TopicView', 'compiled/discussions/ParticipantCollection'], function(Backbone, app, TopicView, ParticipantCollection) {
    this.app = app;
    return $(function() {
      return app.topicView = new TopicView({
        model: new Backbone.Model
      });
    });
  });

}).call(this);
