## v0.2, 2015-10-26

- Goal: Build a sub-project called Piece Reader, where you can follow/subscribe pieces, like Twitter to tweets, or RSS Reader to feeds. Then upload to Meteor and GitHub.

### The UI

Goal: Users can follow/subscribe and read others' pieces.

- Ask: [How to show documents from multiple remote publication in the template?](http://stackoverflow.com/q/33298716/1958475)
- Problem solved: Connect to multiple servers via DDP, then observe their collections reactive via cursor.observeChanges.
- Create a Subs collection to store users' subscription.
- Users can subscribe manually with remote server name and user ID.

### The Core

- Add a publication to subscribe multiple users' pieces.

## v0.1, 2015-10-21

- Goal: Build a prototype, then upload to Meteor and GitHub.
- Meteor: [http://piece.meteor.com](http://piece.meteor.com)
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
