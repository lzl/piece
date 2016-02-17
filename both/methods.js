Meteor.methods({
  insertPieceByClone(content, cloneId) {
    check(content, String);
    check(cloneId, String);

    const userId = Meteor.userId();
    if (! userId) {
      throw new Meteor.Error("not-authorized", "Log in before insert piece.");
    }

    const ownedClone = Clones.findOne({_id: cloneId, ownerId: userId});
    if (ownedClone) {
      const createdAt = new Date();
      const hostname = P.getHostname();
      Clones.update({_id: cloneId, ownerId: userId}, {$set: {updatedAt: createdAt}});
      Addresses.update({hostname, userId: cloneId}, {$set: {username: ownedClone.name, updatedAt: createdAt}});
      return Pieces.insert({
        type: "plaintext",
        content,
        username: ownedClone.name,
        userId: ownedClone._id,
        hostname,
        published: true,
        createdAt
      })
    } else {
      throw new Meteor.Error("not-authorized", "You don't own that clone.");
    }
  },
  removePieceByClone(id) {
    check(id, String);
    const userId = Meteor.userId();
    if (! userId) {
      throw new Meteor.Error("not-authorized", "Log in before remove piece.");
    }
    const cloneId = Pieces.findOne({_id: id}).userId;
    const ownerId = Clones.findOne(cloneId).ownerId;
    if (ownerId === userId) {
      return Pieces.remove({_id: id});
    } else {
      throw new Meteor.Error("not-authorized", "You are not this piece's owner.");
    }
  },
  sharePieceByClone(piece, comment, cloneId) {
    check(piece, Object);
    check(comment, String);
    check(cloneId, String);
    // if comment is empty, then set to null
    comment = comment || null;

    const userId = Meteor.userId();
    if (! userId) {
      throw new Meteor.Error("not-authorized", "Log in before share piece.");
    }

    const ownedClone = Clones.findOne({_id: cloneId, ownerId: userId});
    if (ownedClone) {
      const createdAt = new Date();
      const hostname = P.getHostname();
      Clones.update({_id: cloneId, ownerId: userId}, {$set: {updatedAt: createdAt}});
      return Pieces.insert({
        type: "sharism-piece",
        content: comment,
        origin: piece,
        username: ownedClone.name,
        userId: ownedClone._id,
        hostname,
        published: true,
        createdAt
      })
    } else {
      throw new Meteor.Error("not-authorized", "You don't own that clone.");
    }
  },
  insertSubByClone: function (subHostname, subUserId, cloneId) {
    check(cloneId, String);
    check(subHostname, String);
    check(subUserId, String);

    const userId = Meteor.userId();
    if (! userId) {
      throw new Meteor.Error("not-authorized", "Log in before subscribe.");
    }

    const ownedClone = Clones.findOne({_id: cloneId, ownerId: userId});
    if (ownedClone) {
      const createdAt = new Date();
      Subs.insert({
        hostname: subHostname,
        userId: subUserId,
        ownerId: cloneId,
        createdAt
      })

      Meteor.call('insertAddress', subHostname, subUserId);
    } else {
      throw new Meteor.Error("not-authorized", "You don't own that clone.");
    }
  },
  removeSubByClone: function (subHostname, subUserId, cloneId) {
    check(subHostname, String);
    check(subUserId, String);
    check(cloneId, String);

    const userId = Meteor.userId();
    if (! userId) {
      throw new Meteor.Error("not-authorized", "Log in before unsubscribe.");
    }

    const ownedClone = Clones.findOne({_id: cloneId, ownerId: userId});
    if (ownedClone) {
      Subs.remove({
        hostname: subHostname,
        userId: subUserId,
        ownerId: cloneId
      })
    } else {
      throw new Meteor.Error("not-authorized", "You don't own that clone.");
    }
  },
  insertClone(name) {
    check(name, String);

    const ownerId = Meteor.userId();
    if (! ownerId) {
      throw new Meteor.Error("not-authorized", "Log in before insert clone.");
    }
    const duplicateName = Clones.findOne({name, ownerId});
    if (duplicateName) {
      throw new Meteor.Error("duplicate", "You already have this clone name. Try another.");
    }

    return Clones.insert({
      name,
      ownerId,
      createdAt: new Date()
    })
  },
});
