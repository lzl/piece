Tracker.autorun(function () {
  console.log("server connection status:", Meteor.status().status, new Date());
});
