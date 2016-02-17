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
  const hasAddress = Addresses.findOne({userId: user._id});
  if (! hasAddress) {
    const hostname = P.getHostname();
    Addresses.insert({
      hostname,
      username: user.username,
      userId: user._id,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }
});
