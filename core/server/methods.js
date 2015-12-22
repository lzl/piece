Meteor.methods({
  pieceCurrentCloneExport(cloneId) {
    check(cloneId, String);

    const userId = Meteor.userId();
    if (! userId) {
      throw new Meteor.Error("not-authorized", "Log in before export pieces.");
    }

    const ownedClone = Clones.findOne({_id: cloneId, ownerId: userId});
    if (ownedClone) {
      const pieces = Pieces.find({ownerId: cloneId}).fetch();
      return JSON.stringify(pieces, null, 2);
    } else {
      throw new Meteor.Error("not-authorized", "You don't own that clone.");
    }
  }
});
