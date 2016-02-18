if (Meteor.settings.private) {
  Meteor.startup(function() {
    process.env.MAIL_URL = Meteor.settings.private.mailgun;
  });
}
