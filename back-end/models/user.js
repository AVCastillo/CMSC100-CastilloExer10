import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  friends:{type:Array, required:false},
  requests:{type:Array, required:false},
  toAccept:{type:Array, required:false}
});

const PostSchema= new mongoose.Schema({
  timestamp:{type: Date, required:true},
  author_reference:{type: String, required:true},
  fullName:{type:String, required:true},
  content:{type:String, required:true}

});

UserSchema.pre("save", function(next) {
  const user = this;

  if (!user.isModified("password")) return next();

  return bcrypt.genSalt((saltError, salt) => {
    if (saltError) { return next(saltError); }

    return bcrypt.hash(user.password, salt, (hashError, hash) => {
      if (hashError) { return next(hashError); }

      user.password = hash;
      return next();
    });
  });
});

UserSchema.methods.comparePassword = function(password, callback) {
  bcrypt.compare(password, this.password, callback);
}

mongoose.model("User", UserSchema);
mongoose.model("Post",PostSchema);