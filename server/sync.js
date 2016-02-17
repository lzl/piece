Tracker.autorun(function () {
  const cursor = Addresses.find();
  const handle = cursor.observeChanges({
    added(id, address) {
      const {hostname, userId} = address;
      check(hostname, String);
      check(userId, String);

      const isLocalHostname = hostname === P.getHostname();
      if (isLocalHostname) return;

      const hasUserId = _Hosts.findOne({hostname, userId});
      if (hasUserId) return;

      const hasHost = _Hosts.findOne({hostname});
      if (!hasHost) {
        return _Hosts.insert({
          hostname,
          userId: [userId],
          createdAt: new Date()
        });
      } else {
        return _Hosts.update({hostname}, {$push: {userId}});
      }
    }
  });
})

const connection = {};
const collection = {};
const subscription = {};
const observation = {};
const computation = {};

Tracker.autorun(function () {
  const cursor = _Hosts.find();
  const handle = cursor.observeChanges({
    added(id, host) {
      const {hostname} = host;
      check(hostname, String);
      connection[hostname] = DDP.connect(`${P.protocol}${hostname}`);
      console.log("collection:", hostname);
      collection[hostname] = new Mongo.Collection('pieces', {connection: connection[hostname]});
      connection[hostname].onReconnect = function () {
        console.log("connected:", hostname, (new Date()).toString());

        if (_.has(computation, hostname)) {
          console.log("stop computation:", hostname);
          computation[hostname].stop();
          delete computation[hostname];
        }

        if (_.has(observation, hostname)) {
          console.log("stop observation:", hostname);
          observation[hostname].stop();
          delete observation[hostname];
        }

        if (_.has(subscription, hostname)) {
          console.log("stop subscription:", hostname);
          subscription[hostname].stop();
          delete subscription[hostname];
        }

        const userId = _Hosts.findOne({_id: id}, {fields: {userId: 1}}).userId;
        check(userId, Array);
        console.log("subscription:", hostname, userId.length);
        subscription[hostname] = connection[hostname].subscribe("multiClonePiecesByIds", userId);

        Tracker.nonreactive(function () {
          Tracker.autorun(function (c) {
            if (subscription[hostname].ready()) {
              console.log("sub ready:", hostname);
              const cursor = collection[hostname].find();
              observation[hostname] = cursor.observeChanges({
                added(id, piece) {
                  if (Pieces.findOne(id)) {
                    console.log("duplicate:", id, hostname, (new Date()).toString());
                    return;
                  } else {
                    console.log("added:", id, hostname, (new Date()).toString());
                    piece._id = id;
                    Pieces.insert(piece);
                    Addresses.update({hostname: piece.hostname, userId: piece.userId}, {$set: {username: piece.username, updatedAt: piece.createdAt}});
                  }
                },
                removed(id) {
                  const hasOne = Pieces.findOne({_id: id});
                  if (!hasOne) return;
                  console.log("removed:", id, (new Date()).toString());
                  Pieces.remove(id);
                }
              });
              computation[hostname] = c;
            }
          })
        });
      };
    },
    changed(id, host) {
      const hostname = _Hosts.findOne({_id: id}, {fields: {hostname: 1}}).hostname;
      const userId = host.userId;
      check(hostname, String);
      check(userId, Array);

      console.log("stop subscription:", hostname);
      subscription[hostname].stop();
      console.log("change subscription:", hostname, userId.length, (new Date()).toString());
      subscription[hostname] = connection[hostname].subscribe("multiClonePiecesByIds", userId);
    }
  });
})
