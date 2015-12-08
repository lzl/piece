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

Meteor.users.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; }
});
