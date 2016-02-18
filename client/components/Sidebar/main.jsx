Sidebar = React.createClass({
  render () {
    return (
      <ul className="nav nav-pills nav-stacked">
        <li className="nav-item">
          <a className={P.isActiveNavLink("following")} href="#following">Followings</a>
          <a className={P.isActiveNavLink("account")} href="#account">Account</a>
          <a className={P.isActiveNavLink("about")} href="#about">About</a>
        </li>
      </ul>
    );
  }
})
