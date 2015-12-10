// mimic latency
// Meteor._sleepForMs(1000);

const MAX_PIECES = 1000;

Meteor.publish("pieceSingleUserPosts", function (userId, limit) {
  if (limit === undefined) {
    limit = 20;
  }
  check(userId, String);
  check(limit, Number);

  if (! Meteor.users.findOne({_id: userId})) {
    this.ready();
  }

  const query = {
    ownerId: userId,
    published: true
  };
  const options = {
    sort: {createdAt: -1},
    limit: Math.min(limit, MAX_PIECES)
  };
  return Pieces.find(query, options);
});

Meteor.publish("pieceCurrentUserPosts", function (limit) {
  if (limit === undefined) {
    limit = 20;
  }
  check(limit, Number);

  if (! this.userId) {
    this.ready();
  }

  const query = {
    ownerId: this.userId,
    published: true
  };
  const options = {
    sort: {createdAt: -1},
    limit: Math.min(limit, MAX_PIECES)
  };
  return Pieces.find(query, options);
});

Meteor.publish("pieceAllUserPosts", function (limit) {
  if (limit === undefined) {
    limit = 20;
  }
  check(limit, Number);

  const query = {
    published: true
  };
  const options = {
    sort: {createdAt: -1},
    limit: Math.min(limit, MAX_PIECES)
  };
  return Pieces.find(query, options);
});

Meteor.publish("pieceMultiUserPosts", function (userId, limit) {
  if (limit === undefined) {
    limit = 20;
  }
  check(userId, Array);
  check(limit, Number);

  const query = {
    ownerId: {$in: userId},
    published: true
  };
  const options = {
    sort: {createdAt: -1},
    limit: Math.min(limit, MAX_PIECES)
  };
  return Pieces.find(query, options);
});

Meteor.publish("pieceCurrentUserClones", function () {
  if (this.userId) {
    return Clones.find({ownerId: this.userId}, {sort: {createdAt: 1}});
  } else {
    return this.ready();
  }
});

Meteor.publish("pieceSingleClonePosts", function (cloneId, limit) {
  if (limit === undefined) {
    limit = 20;
  }
  check(cloneId, String);
  check(limit, Number);

  if (! Clones.findOne({_id: cloneId})) {
    this.ready();
  }

  const query = {
    ownerId: cloneId,
    published: true
  };
  const options = {
    sort: {createdAt: -1},
    limit: Math.min(limit, MAX_PIECES)
  };
  return Pieces.find(query, options);
});

Meteor.publish("pieceMultiCloneProfiles", function (cloneIds) {
  check(cloneIds, Array);

  const query = {
    _id: {$in: cloneIds}
  };
  const options = {
    fields: {name: 1}
  };
  return Clones.find(query, options);
});
