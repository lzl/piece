if (Meteor.isClient) {
  Meteor.subscribe("pieceAllUserPosts");
  
  Meteor.startup(function () {
    React.render(<App />, document.getElementById("render-target"));
  });
}
