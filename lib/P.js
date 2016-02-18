const isActiveNavItem = (routeName) => {
  const currentRouteName = FlowRouter.getRouteName();
  return currentRouteName === routeName ? "nav-item active" : "nav-item";
};

const isActiveDropdownItem = (routeName) => {
  const currentRouteName = FlowRouter.getRouteName();
  return currentRouteName === routeName ? "dropdown-item active" : "dropdown-item";
};

const isActiveButton = (routeName) => {
  const currentRouteName = FlowRouter.getRouteName();
  return currentRouteName === routeName ? "btn btn-secondary active" : "btn btn-secondary";
};

const isActiveNavLink = (hash) => {
  const currentHash = window.location.hash.substr(1);
  if (hash === "following") {
    return currentHash === hash || currentHash === '' ? "nav-link active" : "nav-link";
  }
  return currentHash === hash ? "nav-link active" : "nav-link";
};

const isActiveListGroup = (hash) => {
  const currentHash = window.location.hash.substr(1);
  if (hash === "following") {
    return currentHash === hash || currentHash === '' ? "list-group list-group-active" : "list-group";
  }
  return currentHash === hash ? "list-group list-group-active" : "list-group";
};

const isActiveCard = (hash) => {
  const currentHash = window.location.hash.substr(1);
  return currentHash === hash ? "card card-block card-active" : "card card-block";
};

const createUser = ({username, password}) => {
  Accounts.createUser({username: username, password: password}, (error) => {
    if (error) {
      alert(error.reason);
    }
  });
};

const loginWithPassword = ({username, password}) => {
  Meteor.loginWithPassword(username, password, (error) => {
    if (error) {
      alert(error.reason);
    }
  });
};

const changePassword = ({currentPassword, newPassword}) => {
  Accounts.changePassword(currentPassword, newPassword, (error) => {
    if (error) {
      alert(error.reason);
    } else {
      alert("Success. Your password has changed.");
    }
  });
};

const forgotPassword = (email, self) => {
  const options = {email};
  Accounts.forgotPassword(options, (error) => {
    if (error) {
      alert(error.reason);
    } else {
      alert("Success. Please check your inbox.");
    }
    self.refs.email.value = '';
    self.setState({sending: false});
  });
};

const resetPassword = (password) => {
  const token = Accounts._resetPasswordToken;
  if (!token) {
    return alert("Failed. Need reset password token.");
  }
  Accounts.resetPassword(token, password, (error) => {
    if (error) {
      alert(error.reason);
    } else {
      FlowRouter.go('/');
      // alert("Success! Your password has been reset.");
    }
  });
};

const resolveAddress = (address) => {
  const parser = document.createElement('a');
  parser.href = address;
  const hostname = parser.host;
  const pathname = parser.pathname;
  const type = pathname.substr(1, 1);
  const userId = pathname.substr(3, 17);
  const isValid = type === "c";
  return {hostname, userId, isValid};
};

const makeAddress = ({hostname, userId}) => {
  return P.protocol + hostname + "/c/" + userId;
};

const setCurrentCloneId = () => {
  Session.setDefault("currentCloneId", Clones.findOne()._id);
  // if currentCloneId was set, then check if it belongs to current user
  if (! Clones.findOne(Session.get("currentCloneId"))) {
    // if not, then set again
    console.warn("Clone ID " + Session.get("currentCloneId") + " is not belong to you.");
    Session.set("currentCloneId", Clones.findOne()._id);
  }
};

const getHostname = (address) => {
  address = address || Meteor.absoluteUrl();
  if (Meteor.isServer) {
    const url = Npm.require("url");
    return url.parse(address).host;
  } else {
    const parser = document.createElement('a');
    parser.href = address;
    return parser.host;
  }
}

const fromNow = (timestamp) => {
  if (timestamp === undefined) {
    return 'unknown';
  }
  const time = timestamp.getTime();

  let now = undefined;
  if (Meteor.isServer) {
    now = Date.now();
  } else {
    now = TimeSync.serverTime() || Date.now();
  }

  const between = (now - time) / 1000;
  if (between < 60) {
    return ~~(between) + 's';
  } else if (between < 3600) {
    return ~~(between / 60) + 'm';
  } else if (between < 86400) {
    return ~~(between / 3600) + 'h';
  } else {
    return ~~(between / 86400) + 'd';
  }
}

const updateRate = (timestamp) => {
  if (timestamp === undefined) {
    return 'unknown';
  }
  const time = timestamp.getTime();
  // const between = (TimeSync.serverTime(null, 60 * 60 * 1000) - time) / 1000;
  const between = (Date.now() - time) / 1000;
  if (between < 3600) {
    return 'just updated';
  } else if (between < 86400) {
    return 'updated today';
  } else {
    return ~~(between / 86400) + 'd';
  }
}

const publishedAt = (timestamp) => {
  return moment(timestamp).format('LLL');
}

const linkifyOptions = {
  format: (value, type) => {
    if (type === 'url' && value.length > 50) {
      value = value.slice(0, 50) + '…';
    }
    return value;
  },
  linkAttributes: {
    rel: 'nofollow'
  },
  linkClass: null
}

const fetch = (hostname, userId) => {
  console.log("fetch");
  const connection = DDP.connect(hostname);
  const collection = new Mongo.Collection('pieces', {connection: connection});
  Tracker.autorun(() => {
    const handle = connection.subscribe("singleClonePieces", userId);
    console.log(collection.find().count())
  })
}

const protocol = "http://";

const showHostname = (hostname) => {
  if (P.getHostname() === hostname) {
    return false;
  } else {
    return true;
  }
};

const publishPieceLimit = 20;

P = {
  isActiveNavItem,
  isActiveDropdownItem,
  isActiveButton,
  isActiveNavLink,
  isActiveListGroup,
  isActiveCard,
  createUser,
  loginWithPassword,
  changePassword,
  forgotPassword,
  resetPassword,
  resolveAddress,
  makeAddress,
  setCurrentCloneId,
  getHostname,
  fromNow,
  updateRate,
  publishedAt,
  linkifyOptions,
  fetch,
  protocol,
  showHostname,
  publishPieceLimit,
};
