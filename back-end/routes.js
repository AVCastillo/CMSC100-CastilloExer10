import { signUp, login, checkIfLoggedIn,addPosts,displayPosts, editPost,deletePost,viewFriends,searchPeople,addfriend,pendingReq,acceptFriend,mutualFriend,getReqs,removeReq,removeReqOther } from "./auth-controller.js";

const setUpRoutes = (app) => {
  app.post("/signup", signUp);
  app.post("/login", login);
  app.post("/checkifloggedin", checkIfLoggedIn);
  app.post("/add-post", addPosts );
  app.post("/display-post",displayPosts)
  app.post("/edit-post",editPost)
  app.post("/delete-post",deletePost)
  app.post("/viewFriends",viewFriends)
  app.post("/search-people",searchPeople)
  app.post("/add-friend",addfriend)
  app.post("/pending",pendingReq)
  app.post("/accept-friend",acceptFriend)
  app.post("/mutual-friend",mutualFriend)
  app.post("/get-requests",getReqs)
  app.post("/remove-req",removeReq)
  app.post("/remove-req-other",removeReqOther)
  
}

export default setUpRoutes;