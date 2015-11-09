var methodRule = {
  type: "method",
  name: function (name) {
    return _.contains(['pieceInsert', 'pieceRemove'], name);
  },
}

var subscriptionRule = {
  type: "subscription",
  name: function (name) {
    return _.contains(['meteor_autoupdate_clientVersions', 'meteor.loginServiceConfiguration', 'pieceSingleUserPosts', 'pieceCurrentUserPosts', 'pieceAllUserPosts', 'pieceMultiUserPosts'], name);
  }
}

DDPRateLimiter.addRule(methodRule);
DDPRateLimiter.addRule(subscriptionRule);
