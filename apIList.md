#devtinder API List
authRouter
- POST/ signup
- POST /login
- POST/ logout

profileRouter
- PATCH/ profile/edit
- GET/profile/view
- PATCH/profile/password

connectionRequestRouter
-POST/request/send/:status/:userId
status here can either be ignored or intersted

-POST /request/review/:status/:requestId

userRouter
-GET /user/connections
-GET /user/ request/received
-GET/feed
Status:ignore,interested,accepted,rejected
