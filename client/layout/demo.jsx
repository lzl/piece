import React from 'react';

Demo = React.createClass({
  render () {
    return (
      <div className="row">
        <div className="col-xs-12">
          <AccountBar loggingIn={this.props.loggingIn} login={true} />

          <div className="hero narrow">
            <p>Don't read, sign up.</p>
            <p>But you can if you want to.</p>
            <div className="hr" />
            <div className="hr" />
            <p>I build this website as an user. I use it. That's how I build it.</p>
            <p>I want to publish my ideas, opinion or just feeling. So there is a text input area with a button to submit.</p>
            <p>I'd like to follow someone's ideas, opinion or even feeling. Then there is a new page called <em>Reader</em>.</p>
            <p>Write and read. That's all the things you can do with this website, basically. I think it's enough.</p>
            <div className="hr" />
            <div className="hr" />
            <p>I believed in the Internet and I see <abbr title="A link, can be clicked to open a new page or website.">hyperlink</abbr> as a core value of it. What this website missed, you will find the counterpart via hyperlink. What we really need is, to recall the words we didn't value and to get the link we didn't know. That's the vision of Piece.</p>
            <p><mark>Connect with the younger version of self.</mark></p>
            <p><mark>Connect with the world of unknown.</mark></p>
            <p>Do you agree? If yes, it's probably a good time to sign up.</p>
          </div>

          <AccountBar loggingIn={this.props.loggingIn} login={false} />

          <div className="hero narrow">
            <p>I have to say, Piece is not Twitter or Weibo(微博). Piece is not decentralized version of anything. Piece is <em>just</em> a website you can use. Simple as writing or reading. Publish like a boss and don't give a shit about following anyone? That's OK. Have nothing to say and just glance at what you're following once a day? No problem.</p>
            <p>And do you know.</p>
            <p>No one could spam you because there is no reply button at all. (*´艸｀*)</p>
            <p>It feels like you live in a room without a door. Let all around us be peace.</p>
            <p>Piece <span className="heart">♥</span> <a href="https://www.meteor.com/">Meteor</a> and <a href="https://github.com/lzl/piece">GitHub</a>.</p>
          </div>
        </div>
      </div>
    );
  }
});
