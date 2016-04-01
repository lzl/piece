FilterBar = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    Session.setDefault('enableFilterFeature', undefined);
    if (Session.get('enableFilterFeature') === undefined) {
      Meteor.call('isLoyalWriter', (error, result) => {
        Session.set('enableFilterFeature', result);
      })
    }
    return {
      enableFilterFeature: Session.get('enableFilterFeature'),
    };
  },
  render() {
    if (this.data.enableFilterFeature) {
      return (
        <nav className="navbar navbar-light">
          <div className="nav navbar-nav">
            <span className={this.isActive('now')} onClick={this.handleNow}>Now</span>
            <span className={this.isActive('week')} onClick={this.handleLastWeek}>last week</span>
            <span className={this.isActive('month')} onClick={this.handleLastMonth}>last month</span>
            <span className={this.isActive('year')} onClick={this.handleLastYear}>last year</span>
          </div>
          <form className="form-inline pull-xs-right hidden-xs-down">
            <input className="form-control" type="text" placeholder="Search" />
            {' '}
            <button className="btn btn-success-outline" type="submit">Search</button>
          </form>
        </nav>
      );
    } else {
      return <span />;
    }
  },

  handleNow(event) {
    event.preventDefault();
    FlowRouter.go('/');
  },
  handleLastWeek(event) {
    event.preventDefault();
    const lastWeek = (function(d){d.setDate(d.getDate()-7); return d})(new Date);
    const timestamp = lastWeek.getTime();
    FlowRouter.go(`/?before=${timestamp}`);
  },
  handleLastMonth(event) {
    event.preventDefault();
    const lastMonth = (function(d){d.setMonth(d.getMonth()-1); return d})(new Date);
    const timestamp = lastMonth.getTime();
    FlowRouter.go(`/?before=${timestamp}`);
  },
  handleLastYear(event) {
    event.preventDefault();
    const lastYear = (function(d){d.setFullYear(d.getFullYear()-1); return d})(new Date);
    const timestamp = lastYear.getTime();
    FlowRouter.go(`/?before=${timestamp}`);
  },

  isActive(filter) {
    const timestamp = FlowRouter.getQueryParam("before");

    const now = () => {
      if (!timestamp) {
        return "nav-item nav-link pointer active";
      } else {
        return "nav-item nav-link pointer";
      }
    }

    const week = () => {
      const lastWeek = (function(d){d.setDate(d.getDate()-7); return d})(new Date).getTime();
      const lastTwoWeek = (function(d){d.setDate(d.getDate()-14); return d})(new Date).getTime();
      if (timestamp <= lastWeek && timestamp >= lastTwoWeek) {
        return "nav-item nav-link pointer active";
      } else {
        return "nav-item nav-link pointer";
      }
    }

    const month = () => {
      const lastMonth = (function(d){d.setMonth(d.getMonth()-1); return d})(new Date).getTime();
      const lastTwoMonth = (function(d){d.setMonth(d.getMonth()-2); return d})(new Date).getTime();
      if (timestamp <= lastMonth && timestamp >= lastTwoMonth) {
        return "nav-item nav-link pointer active";
      } else {
        return "nav-item nav-link pointer";
      }
    }

    const year = () => {
      const lastYear = (function(d){d.setFullYear(d.getFullYear()-1); return d})(new Date).getTime();
      const lastTwoYear = (function(d){d.setFullYear(d.getFullYear()-2); return d})(new Date).getTime();
      if (timestamp <= lastYear && timestamp >= lastTwoYear) {
        return "nav-item nav-link pointer active";
      } else {
        return "nav-item nav-link pointer";
      }
    }

    const filters = { now, week, month, year };

    if (filters && filters.hasOwnProperty(filter)) {
      return filters[filter]();
    } else {
      throw new Meteor.Error("UI", "Wrong or not found filter at FilterBar component.");
    }
  }
});
