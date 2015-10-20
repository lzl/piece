if (Meteor.isClient) {
  Meteor.subscribe("pieceAllUserPosts");

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
  
  Meteor.startup(function () {
    React.render(<App />, document.getElementById("render-target"));
  });
}
