(function() {

  define(['i18n!discussions', 'compiled/discussions/app'], function(I18n, app) {
    var UNKOWN_AUTHOR, findParticipant;
    UNKOWN_AUTHOR = {
      avatar_image_url: null,
      display_name: I18n.t('uknown_author', 'Unknown Author'),
      id: null
    };
    return findParticipant = function(userId) {
      var participant, _ref;
      participant = (_ref = app.topicView.discussion) != null ? _ref.participants.get(userId) : void 0;
      if (participant != null) {
        return participant.toJSON();
      } else if (userId === ENV.DISCUSSION.CURRENT_USER.id) {
        return ENV.DISCUSSION.CURRENT_USER;
      } else {
        return UNKOWN_AUTHOR;
      }
    };
  });

}).call(this);
