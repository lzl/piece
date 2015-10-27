Pieces = new Mongo.Collection('pieces');

Pieces.allow({
  insert() { return false; },
  update() { return false; },
  remove() { return false; }
});

Pieces.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; }
});

Meteor.users.allow({
  insert() { return false; },
  update() { return false; },
  remove() { return false; }
});

Meteor.users.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; }
});
