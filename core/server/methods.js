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
      var count = 0;

      const owner = ownedClone.name;
      const ownerId = cloneId;

      let hostname = Meteor.absoluteUrl();
      const url = Npm.require("url");
      hostname = url.parse(hostname).host;
      // for local development
      if (hostname === 'localhost') {
        hostname = 'localhost:3000';
      }

      const importedAt = new Date();

      _.each(pieces, (piece) => {
        if (piece._id) delete piece['_id'];

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
            origin,
            imported: true,
            importedAt
          })
        } else {
          modifiedPiece = Object.assign({}, piece, {
            owner,
            ownerId,
            hostname,
            createdAt,
            imported: true,
            importedAt
          })
        }

        Pieces.insert(modifiedPiece);
        count = count + 1;
      })

      return count;
    } else {
      throw new Meteor.Error("not-authorized", "You don't own that clone.");
    }
  }
});
