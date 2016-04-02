import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

class FilterBarComponent extends Component {
  render() {
    if (this.props.enableFilterFeature) {
      return (
        <div className="bar">
          <div className="btn-group btn-group-sm">
            <button type="button" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Go to
            </button>
            <div className="dropdown-menu">
              <span className={this.isActive('now')} onClick={this.handleNow.bind(this)}>now</span>
              <span className={this.isActive('week')} onClick={this.handleLastWeek.bind(this)}>last week</span>
              <span className={this.isActive('month')} onClick={this.handleLastMonth.bind(this)}>last month</span>
              <span className={this.isActive('year')} onClick={this.handleLastYear.bind(this)}>last year</span>
            </div>
          </div>

          <form className="form-inline pull-xs-right">
            <input className="form-control form-control-sm" type="text" placeholder="Search" />
            {' '}
            <button className="btn btn-success-outline btn-sm hidden-xs-down" type="submit">Search</button>
          </form>
        </div>
      );
    } else {
      return <span />;
    }
  }

  handleNow(event) {
    event.preventDefault();
    FlowRouter.go('/');
  }

  handleLastWeek(event) {
    event.preventDefault();
    const lastWeek = (function(d){d.setDate(d.getDate()-7); return d})(new Date);
    const timestamp = lastWeek.getTime();
    FlowRouter.go(`/?before=${timestamp}`);
  }

  handleLastMonth(event) {
    event.preventDefault();
    const lastMonth = (function(d){d.setMonth(d.getMonth()-1); return d})(new Date);
    const timestamp = lastMonth.getTime();
    FlowRouter.go(`/?before=${timestamp}`);
  }

  handleLastYear(event) {
    event.preventDefault();
    const lastYear = (function(d){d.setFullYear(d.getFullYear()-1); return d})(new Date);
    const timestamp = lastYear.getTime();
    FlowRouter.go(`/?before=${timestamp}`);
  }

  isActive(filter) {
    const timestamp = FlowRouter.getQueryParam("before");

    const now = () => {
      if (!timestamp) {
        return "dropdown-item pointer active";
      } else {
        return "dropdown-item pointer";
      }
    }

    const week = () => {
      const lastWeek = (function(d){d.setDate(d.getDate()-7); return d})(new Date).getTime();
      const lastTwoWeek = (function(d){d.setDate(d.getDate()-14); return d})(new Date).getTime();
      if (timestamp <= lastWeek && timestamp >= lastTwoWeek) {
        return "dropdown-item pointer active";
      } else {
        return "dropdown-item pointer";
      }
    }

    const month = () => {
      const lastMonth = (function(d){d.setMonth(d.getMonth()-1); return d})(new Date).getTime();
      const lastTwoMonth = (function(d){d.setMonth(d.getMonth()-2); return d})(new Date).getTime();
      if (timestamp <= lastMonth && timestamp >= lastTwoMonth) {
        return "dropdown-item pointer active";
      } else {
        return "dropdown-item pointer";
      }
    }

    const year = () => {
      const lastYear = (function(d){d.setFullYear(d.getFullYear()-1); return d})(new Date).getTime();
      const lastTwoYear = (function(d){d.setFullYear(d.getFullYear()-2); return d})(new Date).getTime();
      if (timestamp <= lastYear && timestamp >= lastTwoYear) {
        return "dropdown-item pointer active";
      } else {
        return "dropdown-item pointer";
      }
    }

    const filters = { now, week, month, year };

    if (filters && filters.hasOwnProperty(filter)) {
      return filters[filter]();
    } else {
      throw new Meteor.Error("UI", "Wrong or not found filter at FilterBar component.");
    }
  }
}

FilterBar = createContainer(() => {
  Session.setDefault('enableFilterFeature', undefined);
  if (Session.get('enableFilterFeature') === undefined) {
    Meteor.call('isLoyalWriter', (error, result) => {
      Session.set('enableFilterFeature', result);
    })
  }
  return {
    enableFilterFeature: Session.get('enableFilterFeature'),
  };
}, FilterBarComponent);

// FilterBar = React.createClass({
//   mixins: [ReactMeteorData],
//   getMeteorData() {
//     Session.setDefault('enableFilterFeature', undefined);
//     if (Session.get('enableFilterFeature') === undefined) {
//       Meteor.call('isLoyalWriter', (error, result) => {
//         Session.set('enableFilterFeature', result);
//       })
//     }
//     return {
//       enableFilterFeature: Session.get('enableFilterFeature'),
//     };
//   },
//   render() {
//     if (this.data.enableFilterFeature) {
//       return (
//         <div className="bar">
//           <div className="btn-group btn-group-sm">
//             <button type="button" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//               Go to
//             </button>
//             <div className="dropdown-menu">
//               <span className={this.isActive('now')} onClick={this.handleNow}>now</span>
//               <span className={this.isActive('week')} onClick={this.handleLastWeek}>last week</span>
//               <span className={this.isActive('month')} onClick={this.handleLastMonth}>last month</span>
//               <span className={this.isActive('year')} onClick={this.handleLastYear}>last year</span>
//             </div>
//           </div>
//
//           <form className="form-inline pull-xs-right">
//             <input className="form-control form-control-sm" type="text" placeholder="Search" />
//             {' '}
//             <button className="btn btn-success-outline btn-sm hidden-xs-down" type="submit">Search</button>
//           </form>
//         </div>
//       );
//     } else {
//       return <span />;
//     }
//   },
//
//   handleNow(event) {
//     event.preventDefault();
//     FlowRouter.go('/');
//   },
//   handleLastWeek(event) {
//     event.preventDefault();
//     const lastWeek = (function(d){d.setDate(d.getDate()-7); return d})(new Date);
//     const timestamp = lastWeek.getTime();
//     FlowRouter.go(`/?before=${timestamp}`);
//   },
//   handleLastMonth(event) {
//     event.preventDefault();
//     const lastMonth = (function(d){d.setMonth(d.getMonth()-1); return d})(new Date);
//     const timestamp = lastMonth.getTime();
//     FlowRouter.go(`/?before=${timestamp}`);
//   },
//   handleLastYear(event) {
//     event.preventDefault();
//     const lastYear = (function(d){d.setFullYear(d.getFullYear()-1); return d})(new Date);
//     const timestamp = lastYear.getTime();
//     FlowRouter.go(`/?before=${timestamp}`);
//   },
//
//   isActive(filter) {
//     const timestamp = FlowRouter.getQueryParam("before");
//
//     const now = () => {
//       if (!timestamp) {
//         return "dropdown-item pointer active";
//       } else {
//         return "dropdown-item pointer";
//       }
//     }
//
//     const week = () => {
//       const lastWeek = (function(d){d.setDate(d.getDate()-7); return d})(new Date).getTime();
//       const lastTwoWeek = (function(d){d.setDate(d.getDate()-14); return d})(new Date).getTime();
//       if (timestamp <= lastWeek && timestamp >= lastTwoWeek) {
//         return "dropdown-item pointer active";
//       } else {
//         return "dropdown-item pointer";
//       }
//     }
//
//     const month = () => {
//       const lastMonth = (function(d){d.setMonth(d.getMonth()-1); return d})(new Date).getTime();
//       const lastTwoMonth = (function(d){d.setMonth(d.getMonth()-2); return d})(new Date).getTime();
//       if (timestamp <= lastMonth && timestamp >= lastTwoMonth) {
//         return "dropdown-item pointer active";
//       } else {
//         return "dropdown-item pointer";
//       }
//     }
//
//     const year = () => {
//       const lastYear = (function(d){d.setFullYear(d.getFullYear()-1); return d})(new Date).getTime();
//       const lastTwoYear = (function(d){d.setFullYear(d.getFullYear()-2); return d})(new Date).getTime();
//       if (timestamp <= lastYear && timestamp >= lastTwoYear) {
//         return "dropdown-item pointer active";
//       } else {
//         return "dropdown-item pointer";
//       }
//     }
//
//     const filters = { now, week, month, year };
// 
//     if (filters && filters.hasOwnProperty(filter)) {
//       return filters[filter]();
//     } else {
//       throw new Meteor.Error("UI", "Wrong or not found filter at FilterBar component.");
//     }
//   }
// });
