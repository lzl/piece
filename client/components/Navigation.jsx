import React from 'react';

Navigation = ({status, isUser}) =>
  <nav className="navbar navbar-light">
    <ul className="nav navbar-nav hidden-xs-down">
      <li className="nav-item">
        <div className="nav-link">
          <Status status={status} />
        </div>
      </li>
      <li className={P.isActiveNavItem("main")}>
        <a className="nav-link" href="/">Piece</a>
      </li>
      {isUser ? <li className={P.isActiveNavItem("reader")}>
        <a className="nav-link" href="/reader">Reader</a>
      </li> : ''}
      {isUser ? <li className={P.isActiveNavItem("dashboard")}>
        <a className="nav-link" href="/dashboard">Dashboard</a>
      </li> : ''}
      {isUser ? <li className="nav-item pull-xs-right">
        <a className="nav-link" href="#" onClick={(e) => {e.preventDefault(); Meteor.logout();}}>Logout</a>
      </li> : ''}
    </ul>

    <div className="nav navbar-nav hidden-sm-up">
      <div className="btn-group btn-group-sm">
        <button type="button" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <Status status={status} />
        </button>
        <div className="dropdown-menu">
          <a className={P.isActiveDropdownItem("main")} href="/">Piece</a>
          {isUser ? <a className={P.isActiveDropdownItem("reader")} href="/reader">Reader</a> : ''}
          {isUser ? <a className={P.isActiveDropdownItem("dashboard")} href="/dashboard">Dashboard</a> : ''}
          {isUser ? <div className="dropdown-divider"></div> : ''}
          {isUser ? <a className="dropdown-item" href="#" onClick={(e) => {e.preventDefault(); Meteor.logout();}}>Logout</a> : ''}
        </div>
      </div>
      {' '}
      {isUser ? <div className="btn-group btn-group-sm pull-xs-right" role="group" aria-label="Navigation"><a className={P.isActiveButton("main")} href="/">Piece</a><a className={P.isActiveButton("reader")} href="/reader">Reader</a></div> : ""}
    </div>
  </nav>
Navigation.displayName = 'Navigation'

const Status = ({status}) => {
  const statuses = {
    'connecting': <span className="text-primary">Connecting</span>,
    'connected': <span className="text-success">Connected</span>,
    'failed': <span title="Click to reconnect" className="text-danger pointer" onClick={Meteor.reconnect}>Failed</span>,
    'waiting': <span title="Click to reconnect" className="text-primary pointer" onClick={Meteor.reconnect}>Waiting</span>,
    'offline': <span title="Click to reconnect" className="text-danger pointer" onClick={Meteor.reconnect}>Offline</span>,
  };

  if (status && statuses.hasOwnProperty(status)) {
    return statuses[status];
  } else {
    throw new Meteor.Error("UI", "Wrong or not found status at Status component.");
  }
};
Status.displayName = 'Status';
