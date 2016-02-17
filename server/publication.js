Meteor.publish("currentUserClones", function () {
  // Meteor._sleepForMs(500);
  const ownerId = this.userId;
  if (ownerId) {
    return Clones.find({ownerId}, {sort: {createdAt: 1}});
  } else {
    return this.ready();
  }
});

Meteor.publish('currentClonePieces', function (cloneId, before) {
  // Meteor._sleepForMs(500);
  check(cloneId, String);
  check(before, Match.OneOf(String, null));

  const userId = this.userId;
  if (! userId) {
    return this.ready();
  }

  const clone = Clones.findOne({_id: cloneId});
  if (! clone) {
    return this.ready();
  }

  if (userId !== clone.ownerId) {
    return this.ready();
  }

  let query = undefined;
  if (before) {
    const timestamp = Number(before);
    before = new Date(timestamp);
    query = {
      userId: cloneId,
      createdAt: {$lt: before},
      published: true
    };
  } else {
    query = {
      userId: cloneId,
      published: true
    };
  }
  const limit = P.publishPieceLimit;
  const options = {
    limit,
    sort: {createdAt: -1}
  };
  return Pieces.find(query, options);
});

Meteor.publish("currentCloneSubs", function (cloneId) {
  // Meteor._sleepForMs(500);
  check(cloneId, String);

  const userId = this.userId;
  if (userId) {
    const ownerId = Clones.findOne(cloneId).ownerId;
    if (userId === ownerId) {
      return Subs.find({ownerId: cloneId});
    } else {
      return this.ready();
    }
  } else {
    return this.ready();
  }
});

Meteor.publish("singleClonePieces", function (cloneId, limit) {
  // Meteor._sleepForMs(500);
  if (limit === undefined) {
    limit = 20;
  }
  check(cloneId, String);
  check(limit, Number);

  if (! Clones.findOne({_id: cloneId})) {
    return this.ready();
  }

  const query = {
    userId: cloneId,
    published: true
  };
  const options = {
    sort: {createdAt: -1},
    limit: Math.min(limit, 100)
  };
  return Pieces.find(query, options);
});

Meteor.publish("singleCloneProfile", function (cloneId) {
  // Meteor._sleepForMs(500);
  check(cloneId, String);

  const query = {
    _id: cloneId
  };

  const hasClone = Clones.findOne(query);
  if (! hasClone) {
    return this.ready();
  }

  const options = {
    fields: {name: 1, updatedAt: 1}
  };
  return Clones.find(query, options);
});

Meteor.publish('multiClonePieces', function (cloneId, before) {
  // Meteor._sleepForMs(500);
  check(cloneId, String);
  check(before, Match.OneOf(String, null));

  if (! this.userId) {
    return this.ready();
  }

  const subs = Subs.find({ownerId: cloneId}, {fields: {_id: 0, hostname: 1, userId: 1}}).fetch();

  let query = undefined;
  if (before) {
    const timestamp = Number(before);
    before = new Date(timestamp);
    query = {
      $or: subs,
      createdAt: {$lt: before},
      published: true
    };
  } else {
    query = {
      $or: subs,
      published: true
    };
  }
  const limit = P.publishPieceLimit;
  const options = {
    limit,
    sort: {createdAt: -1}
  };
  return Pieces.find(query, options);
});

Meteor.publish('multiClonePiecesByIds', function (ids) {
  // Meteor._sleepForMs(500);
  check(ids, Array);

  const hostname = P.getHostname();
  // const yesterday = (function(d){ d.setDate(d.getDate()-1); return d})(new Date);
  const minute = (function(d){ d.setTime(d.getTime()-60000); return d})(new Date);

  const query = {
    hostname,
    userId: {$in: ids},
    createdAt: {$gt: minute},
    published: true
  };
  const options = {
    sort: {createdAt: -1}
  };
  return Pieces.find(query, options);
});

Meteor.publish('multiAddressesByIds', function (ids) {
  check(ids, Array);
  const query = {
    userId: {$in: ids}
  };
  const options = {
    fields: {hostname: 1, userId: 1, username: 1, updatedAt: 1},
    sort: {updatedAt: -1}
  };
  return Addresses.find(query, options);
});
