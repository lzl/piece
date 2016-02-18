Accounts.onEmailVerificationLink(function (token, done) {
  Accounts.verifyEmail(token, function (error) {
    if (! error) {
      FlowRouter.go('/dashboard#account');
      alert("Your email address has been verified.");
    } else {
      alert(error.reason);
    }
    done();
  });
});
