Meteor.methods({
  pieceInsert: function (val) {
    check(val, String);
    return Pieces.insert({
      type: "plaintext",
      content: val,
      // author: Meteor.user().username,
      // authorId: Meteor.userId(),
      published: true,
      createdAt: new Date()
    })
  },
  pieceRemove: function (id) {
    check(id, String);
    return Pieces.remove(id);
    // let authorId = Pieces.findOne({_id: id}).authorId;
    // if (authorId === Meteor.userId()) {
    //   return Pieces.remove(id);
    // } else {
    //   throw new Meteor.Error("unauthorized", "This piece is not belong to you.");
    // }
  }
});
