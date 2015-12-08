// mimic latency
// Meteor._sleepForMs(1000);

const MAX_PIECES = 1000;

Meteor.publish("pieceSingleUserPosts", function (userId, limit) {
  if (limit === undefined) {
    limit = 20;
  }
  check(userId, String);
  check(limit, Number);

  if (! Meteor.users.findOne(userId)) {
    this.ready();
  }

  const selectors = {
    ownerId: userId,
    published: true
  };
  const options = {
    sort: {createdAt: -1},
    limit: Math.min(limit, MAX_PIECES)
  };
  return Pieces.find(selectors, options);
});

Meteor.publish("pieceCurrentUserPosts", function (limit) {
  if (limit === undefined) {
    limit = 20;
  }
  check(limit, Number);

  if (! this.userId) {
    this.ready();
  }

  const selectors = {
    ownerId: this.userId,
    published: true
  };
  const options = {
    sort: {createdAt: -1},
    limit: Math.min(limit, MAX_PIECES)
  };
  return Pieces.find(selectors, options);
});

Meteor.publish("pieceAllUserPosts", function (limit) {
  if (limit === undefined) {
    limit = 20;
  }
  check(limit, Number);

  const selectors = {
    published: true
  };
  const options = {
    sort: {createdAt: -1},
    limit: Math.min(limit, MAX_PIECES)
  };
  return Pieces.find(selectors, options);
});

Meteor.publish("pieceMultiUserPosts", function (userId, limit) {
  if (limit === undefined) {
    limit = 20;
  }
  check(userId, Array);
  check(limit, Number);

  const selectors = {
    ownerId: {$in: userId},
    published: true
  };
  const options = {
    sort: {createdAt: -1},
    limit: Math.min(limit, MAX_PIECES)
  };
  return Pieces.find(selectors, options);
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

  if (! Clones.findOne(cloneId)) {
    this.ready();
  }

  const selectors = {
    ownerId: cloneId,
    published: true
  };
  const options = {
    sort: {createdAt: -1},
    limit: Math.min(limit, MAX_PIECES)
  };
  return Pieces.find(selectors, options);
});
