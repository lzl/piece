Accounts.onCreateUser((options, user) => {
  Clones.insert({
    name: user.username,
    ownerId: user._id,
    createdAt: new Date()
  });
  return user;
});
