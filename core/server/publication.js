Meteor.publish("pieceSingleUserPosts", function (userId, limit) {
  if (limit === undefined) {
    limit = 20;
  }
  check(userId, String);
  check(limit, Number);
  return Pieces.find({authorId: userId, published: true}, {sort: {createdAt: -1}, limit: limit});
});

Meteor.publish("pieceCurrentUserPosts", function (limit) {
  if (limit === undefined) {
    limit = 20;
  }
  check(limit, Number);
  return Pieces.find({authorId: this.userId, published: true}, {sort: {createdAt: -1}, limit: limit});
});
