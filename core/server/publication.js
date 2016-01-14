// mimic latency
// Meteor._sleepForMs(1000);

const MAX_PIECES = 100;

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

Meteor.publish('pieceCurrentClonePosts', function (cloneId) {
  check(cloneId, String);
  const self = this;

  if (! Clones.findOne({_id: cloneId})) {
    this.ready();
  }

  const query = {
    ownerId: cloneId,
    published: true
  };
  self.autorun(function (computation) {
    return Pieces.find(query, {limit: self.data('limit') || 20, sort: {createdAt: -1}});
  });
});

Meteor.publish("pieceSingleCloneProfile", function (cloneId) {
  check(cloneId, String);

  const query = {
    _id: cloneId
  };
  const options = {
    fields: {name: 1, updatedAt: 1}
  };
  return Clones.find(query, options);
});

Meteor.publish("pieceMultiCloneProfiles", function (cloneIds) {
  check(cloneIds, Array);

  const query = {
    _id: {$in: cloneIds}
  };
  const options = {
    fields: {name: 1, updatedAt: 1}
  };
  return Clones.find(query, options);
});

Meteor.publish("pieceMultiUserPostsByDate", function (userId, date) {
  if (date === undefined) {
    date = (function(d){d.setDate(d.getDate()-1); return d;})(new Date);
  }
  check(userId, Array);
  check(date, Date);

  const MIN_DATE = (function(d){d.setDate(d.getDate()-7); return d;})(new Date);
  if (date < MIN_DATE) {
    date = MIN_DATE;
  }

  const query = {
    ownerId: {$in: userId},
    published: true,
    createdAt: {$gt: date}
  };
  const options = {
    sort: {createdAt: -1},
    limit: MAX_PIECES
  };
  return Pieces.find(query, options);
});
