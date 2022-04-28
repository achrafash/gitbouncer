workflow
✅ user login
✅ fetch user repos
✅ generate shareable link
✅ visitor login
✅ add visitor as collaborator while showing a loading screen: "You're getting added to the private repo"
✅ redirect the visitor to the repo and send an email to the owner

✅ get user email from github
✅ show some loading spinners
✅ fix hot reload -> I have the experimental features turned on, that is why!
✅ lazy loading of repos with skeleton
✅ implement the search feature

-   try switching to `graphql-yoga` instead of `apollo-server-micro`
-   fix: permissions is set to "write" by default -> change that!
-   use react-query to cache the requests on the client
-   micro interactions
    -   when clicking the lock/unlock button: like Medium clap button or something
    -   when hovering a repo card: some type of gradient spreading
-   Only 50 invites every 24 hours -> handle that use case by displaying a message "Please wait X hours to join. Want to get notified? Leave your email below:"
