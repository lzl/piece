Pieces = new Mongo.Collection('pieces');
Pieces.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; }
});

Clones = new Mongo.Collection('clones');
Clones.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; }
});

Subs = new Mongo.Collection('subs');
Subs.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; }
});

Meteor.users.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; }
});

Addresses = new Mongo.Collection('addresses');
Addresses.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; }
});
