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
  }
})
