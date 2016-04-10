import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

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
        <FollowButton hostname={this.props.hostname} userId={this.props.userId} />
        {' '}
        <CloneSelectBox />
      </form>
    );
  }
});

const FollowButtonComponent = React.createClass({
  getInitialState() {
    return {
      unfollow: false
    };
  },

  render() {
    if (this.props.following) {
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
    if (confirm(`Do you really want to unfollow ${this.props.username || 'it'}?`)) {
      const hostname = this.props.hostname;
      const userId = this.props.userId;
      const cloneId = Session.get("currentCloneId");
      Meteor.call('removeSubByClone', hostname, userId, cloneId, (error, result) => {
        if (error) {
          alert(error.reason);
        }
      });
    }
  },
  handleMouseEnter(event) {
    event.preventDefault();
    this.setState({unfollow: true});
  },
  handleMouseLeave(event) {
    event.preventDefault();
    this.setState({unfollow: false});
  },
});

FollowButton = createContainer(({hostname, userId}) => {
  return {
    following: !!Subs.findOne({hostname, userId, ownerId: Session.get('currentCloneId')}),
  }
}, FollowButtonComponent);

// FollowButton = React.createClass({
//   getInitialState() {
//     return {
//       unfollow: false
//     };
//   },
//   mixins: [ReactMeteorData],
//   getMeteorData() {
//     return {
//       following: !!Subs.findOne({hostname: this.props.hostname, userId: this.props.userId, ownerId: Session.get('currentCloneId')}),
//     }
//   },
//
//   render() {
//     if (this.data.following) {
//       if (this.state.unfollow) {
//         return <button type="button" className="btn btn-danger btn-follow" onClick={this.handleUnfollow} onMouseLeave={this.handleMouseLeave}>Unfollow</button>
//       } else {
//         return <button type="button" className="btn btn-success btn-follow" onMouseEnter={this.handleMouseEnter}>Following</button>
//       }
//     } else {
//       return <button type="button" className="btn btn-primary btn-follow" onClick={this.handleFollow}>Follow</button>
//     }
//   },
//
//   handleFollow(event) {
//     event.preventDefault();
//     const hostname = this.props.hostname;
//     const userId = this.props.userId;
//     const cloneId = Session.get("currentCloneId");
//     Meteor.call('insertSubByClone', hostname, userId, cloneId, (error, result) => {
//       if (error) {
//         alert(error.reason);
//       }
//     });
//   },
//   handleUnfollow(event) {
//     event.preventDefault();
//     if (confirm(`Do you really want to unfollow ${this.props.username || 'it'}?`)) {
//       const hostname = this.props.hostname;
//       const userId = this.props.userId;
//       const cloneId = Session.get("currentCloneId");
//       Meteor.call('removeSubByClone', hostname, userId, cloneId, (error, result) => {
//         if (error) {
//           alert(error.reason);
//         }
//       });
//     }
//   },
//   handleMouseEnter(event) {
//     event.preventDefault();
//     this.setState({unfollow: true});
//   },
//   handleMouseLeave(event) {
//     event.preventDefault();
//     this.setState({unfollow: false});
//   },
// });
