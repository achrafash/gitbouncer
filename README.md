workflow
✅ user login
✅ fetch user repos
✅ generate shareable link
    - add repo to the database
✅ visitor login
5. add visitor as collaborator while showing a loading screen: "You're getting added to the private repo"
6. redirect the visitor to the repo and send an email to the owner


- fix: permissions is set to "write" by default -> change that!
- fix hot reload -> I have the experimental features turned on, that is why!
✅ get user email from github
- use swr to cache the requests on the client
- implement the search feature
- lazy loading of repos with skeleton
- micro interactions
  - when clicking the lock/unlock button: like Medium clap button or something
  - when hovering a repo card: some type of gradient spreading
- Only 50 invites every 24 hours -> handle that use case by displaying a message "Please wait X hours to join. Want to get notified? Leave your email below:"