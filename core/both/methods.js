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
    const ownerId = Pieces.findOne(id).ownerId;
    if (ownerId === Meteor.userId()) {
      return Pieces.remove({_id: id});
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
  },
  pieceInsertByClone(val, cloneId) {
    check(val, String);
    check(cloneId, String);

    const userId = Meteor.userId();
    if (! userId) {
      throw new Meteor.Error("not-authorized", "Log in before insert piece.");
    }

    const ownedClone = Clones.findOne({_id: cloneId, ownerId: userId});
    if (ownedClone) {
      return Pieces.insert({
        type: "plaintext",
        content: val,
        owner: ownedClone.name,
        ownerId: ownedClone._id,
        published: true,
        createdAt: new Date()
      })
    } else {
      throw new Meteor.Error("not-authorized", "You don't own that clone.");
    }
  },
  pieceRemoveByClone: function (id) {
    check(id, String);
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized", "Log in before remove piece.");
    }
    const cloneId = Pieces.findOne(id).ownerId;
    const userId = Clones.findOne(cloneId).ownerId;
    if (userId === Meteor.userId()) {
      return Pieces.remove({_id: id});
    } else {
      throw new Meteor.Error("not-authorized", "You are not this piece's owner.");
    }
  },
});
