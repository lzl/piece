Meteor.methods({
  pieceInsert: function (val) {
    check(val, String);
    if (Meteor.userId()) {
      return Pieces.insert({
        type: "plaintext",
        content: val,
        owner: Meteor.user().username,
        ownerId: Meteor.userId(),
        published: true,
        createdAt: new Date()
      })
    } else {
      throw new Meteor.Error("not-authorized", "Log in before insert piece.");
    }
  },
  pieceRemove: function (id) {
    check(id, String);
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized", "Log in before remove piece.");
    }
    let ownerId = Pieces.findOne({_id: id}).ownerId;
    if (ownerId === Meteor.userId()) {
      return Pieces.remove(id);
    } else {
      throw new Meteor.Error("not-authorized", "You are not this piece's owner.");
    }
  },
  cloneInsert(val) {
    check(val, String);
    if (Meteor.userId()) {
      return Clones.insert({
        name: val,
        ownerId: Meteor.userId(),
        createdAt: new Date()
      });
    } else {
      throw new Meteor.Error("not-authorized", "Log in before create clone.");
    }
  }
});
