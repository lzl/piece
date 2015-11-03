// mimic latency
// Meteor._sleepForMs(1000);

Meteor.publish("pieceSingleUserPosts", function (userId, limit) {
  if (limit === undefined) {
    limit = 20;
  }
  check(userId, String);
  check(limit, Number);
  if (! Meteor.users.findOne(userId)) {
    this.ready();
  }
  return Pieces.find({ownerId: userId, published: true}, {sort: {createdAt: -1}, limit: limit});
});

Meteor.publish("pieceCurrentUserPosts", function (limit) {
  if (limit === undefined) {
    limit = 20;
  }
  check(limit, Number);
  return Pieces.find({ownerId: this.userId, published: true}, {sort: {createdAt: -1}, limit: limit});
});

Meteor.publish("pieceAllUserPosts", function (limit) {
  if (limit === undefined) {
    limit = 20;
  }
  check(limit, Number);
  return Pieces.find({published: true}, {sort: {createdAt: -1}, limit: limit});
});

Meteor.publish("pieceMultiUserPosts", function (userId, limit) {
  if (limit === undefined) {
    limit = 20;
  }
  check(userId, Array);
  check(limit, Number);
  return Pieces.find({ownerId: {$in: userId}, published: true}, {sort: {createdAt: -1}, limit: limit});
});
