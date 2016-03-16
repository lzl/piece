Meteor.methods({
  insertAddress(hostname, userId) {
    check(hostname, String);
    check(userId, String);

    const hasOne = Addresses.findOne({hostname, userId});
    if (hasOne) return;

    const isLocalHostname = hostname === P.getHostname();
    if (isLocalHostname) {
      const piece = Pieces.findOne({hostname, userId}, {sort: {createdAt: -1}});
      return Addresses.insert({
        hostname,
        userId,
        username: piece.username,
        createdAt: new Date(),
        updatedAt: piece.createdAt
      });
    } else {
      const connection = DDP.connect(`${P.protocol}${hostname}`);
      let collection = new Mongo.Collection('pieces', {connection: connection});
      connection.onReconnect = function () {
        const subscription = connection.subscribe("singleClonePieces", userId);
        Tracker.autorun(function (computation) {
          if (subscription.ready()) {
            const cursor = collection.find();
            const observation = cursor.observeChanges({
              added(id, piece) {
                if (Pieces.findOne(id)) {
                  console.log("duplicate:", id, hostname);
                  return;
                } else {
                  console.log("added:", id, hostname);
                  piece._id = id;
                  Pieces.insert(piece);
                }
              }
            });

            const stop = () => {
              computation.stop();
              observation.stop();
              subscription.stop();
              connection.disconnect();
              collection = undefined;
              Meteor.clearTimeout(handle);
            };
            const handle = Meteor.setTimeout(stop, 5000);

            const piece = collection.findOne({hostname, userId}, {sort: {createdAt: -1}});
            return Addresses.insert({
              hostname,
              userId,
              username: piece.username,
              createdAt: new Date(),
              updatedAt: piece.createdAt
            });
          }
        });
      }
    }
  },
  fetchPieces(hostname, userId) {
    check(hostname, String);
    check(userId, String);

    console.log("fetch: connect & sub");
    const connection = DDP.connect(`${P.protocol}${hostname}`);
    const collection = new Mongo.Collection('pieces', {connection: connection});
    const subscription = connection.subscribe("singleClonePieces", userId, 100);

    Tracker.autorun(function (computation) {
      if (subscription.ready()) {
        const cursor = collection.find();
        const observe = cursor.observeChanges({
          added(id, piece) {
            if (Pieces.findOne(id)) {
              console.log("fetch: duplicate", id);
              return;
            } else {
              console.log("fetch: added", id);
              piece._id = id;
              Pieces.insert(piece);
            }
          },
          removed(id) {
            console.log("fetch: removed", id);
            Pieces.remove(id);
          }
        });

        const stop = () => {
          console.log("fetch: stop observe, sub & computation");
          observe.stop();
          subscription.stop();
          computation.stop();
        };
        setTimeout(function () {stop();}, 1000 * 5);
      }
    })
  },
  addEmail(newEmail) {
    check(newEmail, String);
    const userId = Meteor.userId();
    return Accounts.addEmail(userId, newEmail);
  },
  removeEmail(email) {
    check(email, String);
    const userId = Meteor.userId();
    return Accounts.removeEmail(userId, email);
  },
  sendVerificationEmail() {
    const userId = Meteor.userId();
    return Accounts.sendVerificationEmail(userId);
  },
  exportPieces(cloneId) {
    check(cloneId, String);

    const userId = Meteor.userId();
    if (! userId) {
      throw new Meteor.Error("not-authorized", "Log in before export pieces.");
    }

    const ownedClone = Clones.findOne({_id: cloneId, ownerId: userId});
    if (ownedClone) {
      const pieces = Pieces.find({userId: cloneId}, {sort: {createdAt: -1}}).fetch();
      return JSON.stringify(pieces, null, 2);
    } else {
      throw new Meteor.Error("not-authorized", "You don't own that clone.");
    }
  },
  importPieces(cloneId, pieces) {
    check(cloneId, String);
    check(pieces, Array);

    const userId = Meteor.userId();
    if (! userId) {
      throw new Meteor.Error("not-authorized", "Log in before import pieces.");
    }

    if (userId !== "ECb9ff6LKQidizhcE") {
      throw new Meteor.Error("not-authorized", "You have no authorization to import pieces.");
    }

    const ownedClone = Clones.findOne({_id: cloneId, ownerId: userId});
    if (ownedClone) {
      let count = 0;

      const username = ownedClone.name;
      const userId = cloneId;
      const hostname = P.getHostname();
      const importedAt = new Date();

      _.each(pieces, (piece) => {
        if (piece._id) delete piece['_id'];

        const createdAt = new Date(piece.createdAt);

        let modifiedPiece = undefined;
        if (piece.origin) {
          piece.origin.createdAt = new Date(piece.origin.createdAt);
          const origin = piece.origin;
          modifiedPiece = Object.assign({}, piece, {
            username,
            userId,
            hostname,
            createdAt,
            origin,
            importedAt
          })
        } else {
          modifiedPiece = Object.assign({}, piece, {
            username,
            userId,
            hostname,
            createdAt,
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
})
