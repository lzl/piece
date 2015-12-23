Meteor.methods({
  pieceExportByClone(cloneId) {
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
  },
  pieceImportByClone(cloneId, pieces) {
    check(cloneId, String);
    check(pieces, Array);

    const userId = Meteor.userId();
    if (! userId) {
      throw new Meteor.Error("not-authorized", "Log in before import pieces.");
    }

    const ownedClone = Clones.findOne({_id: cloneId, ownerId: userId});
    if (ownedClone) {
      _.each(pieces, (piece) => {
        if (piece._id) delete piece['_id'];

        const owner = ownedClone.name;
        const ownerId = cloneId;

        let hostname = Meteor.absoluteUrl();
        const url = Npm.require("url");
        hostname = url.parse(hostname).host;
        // for local development
        if (hostname === 'localhost') {
          hostname = 'localhost:3000';
        }

        const createdAt = new Date(piece.createdAt);

        let modifiedPiece = undefined;
        if (piece.origin) {
          piece.origin.createdAt = new Date(piece.origin.createdAt);
          const origin = piece.origin;
          modifiedPiece = Object.assign({}, piece, {
            owner,
            ownerId,
            hostname,
            createdAt,
            origin
          })
        } else {
          modifiedPiece = Object.assign({}, piece, {
            owner,
            ownerId,
            hostname,
            createdAt
          })
        }

        Pieces.insert(modifiedPiece);
      })
    } else {
      throw new Meteor.Error("not-authorized", "You don't own that clone.");
    }
  }
});
