# History

## v0.9, 2016-02-17

- Goal: 3 in 1. Integrate Reader and Profile into Piece.
- This version is built from scratch. 95% React + 5% Blaze.
- Fast. The server will keep (re-)connecting with other nodes to fetch latest pieces.

## v0.8, 2015-12-25

- Goal: Export. Users can export all their own pieces as an JSON file for backup.

### Piece

- There is a Dashboard page.
- One button click to export pieces.

## v0.7, 2015-12-18

- Goal: Sharism. Users can share pieces from Reader to Piece.

### Piece

- User can see more information about piece.
- New type of piece: sharism-piece.
- Better way to switch clones.

### Piece Reader

- Very robust since code refactoring.
- User can see more information about piece.
- Follow/unfollow at piece detail modal.

### Piece Profile

- A Button to follow at given Piece Reader.

## v0.6, 2015-11-30

- Goal: Clone. Users can clone themselves. Clones would have their own lives.

### Piece

- Each user can create multiple clones.
- Each clone would post its own pieces.
- Older version still works for backwards compatibility.

### Piece Reader

- Each user can create multiple clones.
- Each clone would have its own following.
- Older version still works for backwards compatibility.

## v0.5, 2015-11-06

- Goal: Follow Button. At Piece Reader, users can manage their following/subscriptions. At Piece Profile, visitor can click the Follow button to follow at selected Piece Reader.

### Piece Reader

- Use FlowRouter and BlazeLayout.
- Added `/following` and `/follow` router.
- Added navbar of Bootstrap 4.
- Code refactoring.

### Piece Profile

- Build the input group of Follow Button.

## v0.4, 2015-10-29

- Goal: Build another sub-project called Piece Profile, where visitors can read your pieces, like Twitter profile page or Wordpress blog page. Then upload to Meteor and GitHub.
- Meteor: [https://piece-profile.meteor.com](https://piece-profile.meteor.com)
- Github: [https://github.com/lzl/piece-profile](https://github.com/lzl/piece-profile)

### Piece Profile

- The core logic is simple. Use DDP to connect and subscribe from remote Piece server.
- New UI: Use Bootstrap v4, Card for profile. List group for posts.
- Hidden UI: I created my own theme called B&W, which is hidden at folder `.ui-lzl`.
- Server-side rendering. Such fast.

## v0.3, 2015-10-28

- Goal: Make Piece and Piece Reader more security.

### Security

- Learn from [Securing Meteor Applications](https://themeteorchef.com/blog/securing-meteor-applications/) by Ryan Glover (aka The Meteor Chef).
- Added package `audit-arguments-check` and `browser-policy`.
- Disabled allow and deny, especially the `Meteor.users` collection.
- Enabled SSL connection by default.

## v0.2, 2015-10-26

- Goal: Build a sub-project called Piece Reader, where you can follow/subscribe pieces, like Twitter to tweets, or RSS Reader to feeds. Then upload to Meteor and GitHub.
- Meteor: [https://piece-reader.meteor.com](https://piece-reader.meteor.com)
- Github: [https://github.com/lzl/piece-reader](https://github.com/lzl/piece-reader)

### The UI of Piece Reader

Goal: Users can follow/subscribe and read others' pieces.

- Ask: [How to show documents from multiple remote publication in the template?](http://stackoverflow.com/q/33298716/1958475)
- Problem solved: Connect to multiple servers via DDP, then observe their collections reactive via cursor.observeChanges.
- Create a Subs collection to store users' subscription.
- Users can subscribe manually with remote server name and user ID.
- The subscription form will be validating while users are typing.
- Visitors can make a quick demo easily without an account.

### The Core of Piece

- Add a publication to subscribe multiple users' pieces.

## v0.1, 2015-10-21

- Goal: Build a prototype, then upload to Meteor and GitHub.
- Meteor: [https://piece.meteor.com](https://piece.meteor.com)
- GitHub: [https://github.com/lzl/piece](https://github.com/lzl/piece)

### The UI

Goal: With the UI, visitors can view public pieces, users can create, read and delete their own pieces.

- The UI is the interface of that Core. Visitors see and use Piece with the help of UI.
- It uses React to render what you see. Get started with the official Meteor-React tutorial.
- Build App and Card component. Card is the interface of each piece.
- Yes, that Card style is from Bootstrap v4.
- Hide the textarea unless you are logged in.
- In the Card, you can delete your own piece.

### The Core

Goal: With the Core, developers can publish, subscribe and CRUD the pieces from collection.

- Reuse the code from old day. Including collection, methods and publication. Which is the Core 思密达~
- The one and only one collection is the store of pieces.
- The two methods access that store with a security guard.
- The publication defines what you can see.
