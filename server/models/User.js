import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    minlength: 5
  },
  lastname: {
    type: String,
    maxlength: 50
  },
  role: {
    type: Number,
    default: 0
  },
  image: String,
  token: {
    type: String
  },
  tokenExp: {
    type: Number
  }
});

const saltRounds = 10;
userSchema.pre('save', function(next) {
  var user = this;

  if(user.isModified('password')) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if(err) return next(err);
  
      bcrypt.hash(user.password, salt, function(err, hash) {
        if(err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function(plainPassword, callback) {
  bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
    if(err) return callback(err);
    callback(null, isMatch);
  });
}

userSchema.methods.generateToken = function(callback) {
  var user = this;
  var token = jwt.sign(user._id.toHexString(), "secretToken"); 
  user.token = token;

  user.save(function(err, userInfo) {
    if(err) return callback(err);
    callback(null, userInfo);
  })
}

userSchema.statics.findByToken = function(token, callback) {
  var user = this;

  jwt.verify(token, "secretToken", function(err, decoded) {
    user.findOne({ "_id": decoded, "token": token }, function(err, userInfo) {
      if(err) return callback(err);
      callback(null, userInfo);
    });
  });
}

const User = mongoose.model('User', userSchema);

export default User;