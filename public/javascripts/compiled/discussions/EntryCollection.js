(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(['Backbone', 'compiled/discussions/Entry'], function(Backbone, Entry) {
    var EntryCollection;
    return EntryCollection = (function(_super) {

      __extends(EntryCollection, _super);

      EntryCollection.name = 'EntryCollection';

      function EntryCollection() {
        return EntryCollection.__super__.constructor.apply(this, arguments);
      }

      EntryCollection.prototype.model = Entry;

      return EntryCollection;

    })(Backbone.Collection);
  });

}).call(this);
