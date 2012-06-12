(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(['Backbone', 'compiled/discussions/Participant'], function(Backbone, Participant) {
    var ParticipantCollection;
    return ParticipantCollection = (function(_super) {

      __extends(ParticipantCollection, _super);

      ParticipantCollection.name = 'ParticipantCollection';

      function ParticipantCollection() {
        return ParticipantCollection.__super__.constructor.apply(this, arguments);
      }

      ParticipantCollection.prototype.model = Participant;

      return ParticipantCollection;

    })(Backbone.Collection);
  });

}).call(this);
