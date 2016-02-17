PreviewBox = React.createClass({
  getInitialState() {
    return {
      length: 30
    };
  },

  render() {
    return (
      <form className="form-inline" onSubmit={this.handleSubmit}>
        <CloneSelectBox />
        {' '}
        <div className="form-group">
          <label className="sr-only" htmlFor="address">Address</label>
          <input type="text" className="form-control" id="address" ref="address" placeholder="Address" size={this.state.length} onChange={this.handleChange} required />
        </div>
        {' '}
        <button type="submit" className="btn btn-primary">Preview</button>
      </form>
    );
  },

  handleSubmit(event) {
    event.preventDefault()
    const address = this.refs.address.value;
    const {hostname, userId, isValid} = P.resolveAddress(address);
    if (isValid) {
      FlowRouter.go(`/follow?hostname=${hostname}&userId=${userId}`);
    } else {
      alert("Please enter a valid address.");
    }
  },

  handleChange(event) {
    event.preventDefault();
    const length = this.refs.address.value.length;
    if (length > 30) {
      this.setState({length: length});
    } else {
      this.setState({length: 30});
    }
  }
});

FollowBox = React.createClass({
  render() {
    const hostname = this.props.hostname;
    const userId = this.props.userId;
    const address = P.makeAddress({hostname, userId});
    return (
      <form className="form-inline">
        <div className="form-group">
          <label className="sr-only" htmlFor="address">Address</label>
          <input type="text" className="form-control" id="address" ref="address" value={address} size={address.length} readOnly />
        </div>
        {' '}
        <FollowButton {...this.props} />
      </form>
    );
  }
});

FollowButton = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      following: !!Subs.findOne({hostname: this.props.hostname, userId: this.props.userId, ownerId: Session.get('currentCloneId')}),
    }
  },

  getInitialState() {
    return {
      unfollow: false
    };
  },

  render() {
    if (this.data.following) {
      if (this.state.unfollow) {
        return <button type="button" className="btn btn-danger btn-follow" onClick={this.handleUnfollow} onMouseLeave={this.handleMouseLeave}>Unfollow</button>
      } else {
        return <button type="button" className="btn btn-success btn-follow" onMouseEnter={this.handleMouseEnter}>Following</button>
      }
    } else {
      return <button type="button" className="btn btn-primary btn-follow" onClick={this.handleFollow}>Follow</button>
    }
  },

  handleFollow(event) {
    event.preventDefault();
    const hostname = this.props.hostname;
    const userId = this.props.userId;
    const cloneId = Session.get("currentCloneId");
    Meteor.call('insertSubByClone', hostname, userId, cloneId, (error, result) => {
      if (error) {
        alert(error.reason);
      }
    });
  },
  handleUnfollow(event) {
    event.preventDefault();
    const hostname = this.props.hostname;
    const userId = this.props.userId;
    const cloneId = Session.get("currentCloneId");
    Meteor.call('removeSubByClone', hostname, userId, cloneId, (error, result) => {
      if (error) {
        alert(error.reason);
      }
    });
  },
  handleMouseEnter(event) {
    event.preventDefault();
    this.setState({unfollow: true});
  },
  handleMouseLeave(event) {
    event.preventDefault();
    this.setState({unfollow: false});
  },
})

PreviewButton = React.createClass({
  render() {
    return <button type="button" className="btn btn-secondary" onClick={this.handlePreview}>Preview</button>
  },
  handlePreview(event) {
    event.preventDefault();
    const hostname = this.props.hostname;
    const userId = this.props.userId;
    FlowRouter.go(`/follow?hostname=${hostname}&userId=${userId}`);
  }
})
