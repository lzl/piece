// Meteor.startup(function () {
//   ReactDOM.render(<App />, document.getElementById("render-target"));
// });
//
// App = React.createClass({
//   render () {
//     return (
//       <div className="container">
//         <div className="row">
//           <Navigation status="connected" />
//         </div>
//         <div className="row">
//           <AccountsNavbar />
//         </div>
//         <div className="row">
//           <Notepad
//             cloneNum={2}
//             currentClone={{_id: "a", name: "Alice"}}
//             otherClones={[{_id: "b", name: "Bob"}]}
//           />
//         </div>
//         <div className="hr" />
//         <div className="row">
//           <PreviewBox />
//         </div>
//         <div className="hr" />
//         <div className="row">
//           <FollowBox
//             hostname={"piece.meteor.com"}
//             userId={"492WZqeqCxrDqfG5u"}
//           />
//         </div>
//         <div className="hr" />
//         <div className="row">
//           <PieceCard
//             piece={{_id: "1", type: "plaintext", content: "This is a plaintext piece.", owner: "lzl", ownerId: "1", hostname: "piece.meteor.com", createdAt: "now"}}
//           />
//           <PieceCard
//             piece={{_id: "2", type: "sharism-piece", content: "This is a sharism piece.", owner: "rui", ownerId: "2", hostname: "piece.meteor.com", createdAt: "now",
//             origin: {_id: "1", content: "This is a plaintext piece.", owner: "lzl", ownerId: "1", hostname: "piece.meteor.com", createdAt: "now"}}}
//           />
//           <PieceList profile={{name: "lzl", updatedAt: "now"}}
//             pieces={[{_id: "1", type: "plaintext", content: "This is a plaintext piece.", owner: "lzl", ownerId: "1", hostname: "piece.meteor.com", createdAt: "now"},
//             {_id: "2", type: "sharism-piece", content: "This is a sharism piece.", owner: "rui", ownerId: "2", hostname: "piece.meteor.com", createdAt: "now",
//             origin: {_id: "1", content: "This is a plaintext piece.", owner: "lzl", ownerId: "1", hostname: "piece.meteor.com", createdAt: "now"}}]}
//           />
//           <LoadMore disabled='' />
//           <LoadMore disabled='disabled' />
//         </div>
//         <div className="hr" />
//         <div className="row">
//           <LoginWithPassword />
//           <SignupWithPassword />
//         </div>
//         <div className="hr" />
//       </div>
//     );
//   }
// })
