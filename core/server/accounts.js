Accounts.onLogin(() => {
  const user = Meteor.user();
  const hasClone = Clones.findOne(user._id);
  if (! hasClone) {
    Clones.insert({
      _id: user._id,
      name: user.username,
      ownerId: user._id,
      createdAt: new Date()
    });
  }
});
