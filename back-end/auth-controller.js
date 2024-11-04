import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';


// get user model registered in Mongoose
const User = mongoose.model("User");
const Post= mongoose.model("Post");

const signUp = (req, res) => {
  const newuser = new User({
    firstName: req.body.firstName,
    lastName:req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    friends:[],
    requests:[],
    toAccept:[]
  });

  console.log("New user: ");
  console.log(newuser);



  newuser.save((err) => {
    if (err) { return res.send({ success: false }); }
    else { return res.send({ success: true }); }
  });
}



const addPosts=(req,res)=>{

  const newpost= new Post({
    timestamp:Date(),
    author_reference: req.body.author,
    fullName:req.body.fullname,
    content: req.body.content
  })

  console.log("New post: ");
  console.log(newpost);

   newpost.save((err)=>{
    if(!err){
      res.send({success:true})
    }else{
      res.send({success:false})
    }
  })
}

const viewFriends=(req,res)=>{
  User.findOne({_id:req.body.id},(err,document)=>{
    if(!err){
      res.send({success:true, friends:document.friends})
    }else{
      res.send({success:false})
    }
  })
}

const acceptFriend=(req,res)=>{
  User.updateOne({_id:req.body.id},{friends:req.body.accepted, toAccept:req.body.stillpending},(err,output)=>{
    if(!err){
      res.send({success:true})
    }else{
      res.send({success:false})
    }
  })
}

const getReqs=(req,res)=>{
  User.findOne({_id:req.body.id},(err,document)=>{
    if(!err){
      res.send({success:true, reqs:document.requests})
    }else{
      res.send({success:false})
    }
  })
}
const mutualFriend=(req,res)=>{
  User.updateOne({_id:req.body.id},{friends:req.body.mutual, requests:req.body.acceptedreq},(err,output)=>{
    if(!err){
      res.send({success:true})
    }else{
      res.send({success:false})
    }
  })
}

const removeReq=(req,res)=>{
  User.updateOne({_id:req.body.id},{toAccept:req.body.reqs},(err,output)=>{
    if(!err){
      res.send({success:true})
    }else{
      res.send({success:false})
    }
  })
}

const removeReqOther=(req,res)=>{
  User.updateOne({_id:req.body.id},{requests:req.body.reqs},(err,output)=>{
    if(!err){
      res.send({success:true})
    }else{
      res.send({success:false})
    }
  })
}

const editPost=(req,res)=>{
  Post.updateOne({_id:req.body.id},{content:req.body.content},(err,output)=>{
    if(!err){
      res.send({success:true})
    }else{
      res.send({success:false})
    }
  })

}

const addfriend=(req,res)=>{
  User.updateOne({email:req.body.email},{requests:req.body.request},(err,output)=>{
    if(!err){
      res.send({success:true})
    }else{
      res.send({success:false})
    }
  })

}

const pendingReq=(req,res)=>{
  User.updateOne({email:req.body.email},{toAccept:req.body.request},(err,output)=>{
    if(!err){
      res.send({success:true})
    }else{
      res.send({success:false})
    }
  })

}

// const getRequests=(req,res)=>{
//   User.find({},(err,document)=>{
//     if(!err){
//       return res.send({success:true, people:document})
//     }
//   })
// }

const deletePost=(req,res)=>{
  Post.deleteOne({_id:req.body.id},(err,output)=>{
    if(!err){
      res.send({success:true})
    }else{
      res.send({success:false})
    }
  })
}

const displayPosts=(req,res)=>{
  Post.find({},(err,document)=>{
    if(!err){
      console.log(document)
      return res.send({success:true, post: document})
    }else{
      return res.send({success:false})
    }
  })
}


const searchPeople=(req,res)=>{
  User.find({},(err,document)=>{
    if(!err){
      console.log(document)
      return res.send({success:true, people: document})
    }else{
      return res.send({success:false})
    }
  })
}

const login = (req, res) => {
  const email = req.body.email.trim();
  const password = req.body.password;

  User.findOne({ email }, (err, user) => {
    // check if email exists
    if (err || !user) {
      //  Scenario 1: FAIL - User doesn't exist
      console.log("user doesn't exist");
      return res.send({ success: false });
    }

    // check if password is correct
    user.comparePassword(password, (err, isMatch) => {
      if (err || !isMatch) {
        // Scenario 2: FAIL - Wrong password
        console.log("wrong password");
        return res.send({ success: false });
      }

      console.log("Successfully logged in");

      // Scenario 3: SUCCESS - time to create a token
      const tokenPayload = {
        _id: user._id
      }

      const token = jwt.sign(tokenPayload, "THIS_IS_A_SECRET_STRING");

      // return the token to the client
      return res.send({ success: true, token, email: user.email,id:user._id });


    })
  })
}

const checkIfLoggedIn = (req, res) => {

  if (!req.cookies || !req.cookies.authToken) {
    // Scenario 1: FAIL - No cookies / no authToken cookie sent
    return res.send({ isLoggedIn: false });
  }

  // Token is present. Validate it
  return jwt.verify(
    req.cookies.authToken,
    "THIS_IS_A_SECRET_STRING",
    (err, tokenPayload) => {
      if (err) {
        // Scenario 2: FAIL - Error validating token
        return res.send({ isLoggedIn: false });
      }

      const userId = tokenPayload._id;

      // check if user exists
      return User.findById(userId, (userErr, user) => {
        if (userErr || !user) {
          // Scenario 3: FAIL - Failed to find user based on id inside token payload
          return res.send({ isLoggedIn: false });
        }

        // Scenario 4: SUCCESS - token and user id are valid
        console.log("user is currently logged in");
        return res.send({ isLoggedIn: true });
      });
    });
}

export { signUp, login, checkIfLoggedIn, addPosts,displayPosts,editPost,deletePost,viewFriends, searchPeople, addfriend,pendingReq,acceptFriend,mutualFriend,getReqs,removeReq,removeReqOther }