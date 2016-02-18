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

Meteor.startup(function () {
  // set up stmp
  if (Meteor.settings.private && Meteor.settings.private.smtp) {
    process.env.MAIL_URL = Meteor.settings.private.smtp;
  }
  // override email templates
  const greet = (welcomeMsg) => {
    return (user, url) => {
      const greeting = (user && user.username) ? ("Hello " + user.username + ",") : "Hello,";
      return `${greeting}

${welcomeMsg}, simply click the link below.

${url}

Thanks.
`;
    };
  };
  if (Meteor.settings.private && Meteor.settings.private.username && Meteor.settings.private.email) {
    Accounts.emailTemplates.from = `${Meteor.settings.private.username} <${Meteor.settings.private.email}>`;
  }
  if (Meteor.settings.private && Meteor.settings.private.siteName) {
    Accounts.emailTemplates.siteName = "Piece";
  }
  Accounts.emailTemplates.verifyEmail.text = greet("To verify your account email");
  Accounts.emailTemplates.resetPassword.text = greet("To reset your password");
  Accounts.emailTemplates.enrollAccount.text = greet("To start using the service");
});
